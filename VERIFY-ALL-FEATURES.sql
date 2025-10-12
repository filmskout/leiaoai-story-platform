-- ============================================================================
-- 完整功能验证脚本
-- ============================================================================
-- 验证所有数据库配置是否正确完成
-- ============================================================================

-- ============================================================================
-- 1. Chat Sessions 验证
-- ============================================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '1. CHAT SESSIONS 验证' as section;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- 检查chat_sessions表结构
SELECT 
    'chat_sessions columns' as check_name,
    COUNT(*) as count,
    CASE WHEN COUNT(*) >= 10 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.columns
WHERE table_name = 'chat_sessions';

-- 检查必需的列
SELECT 
    'Required columns' as check_name,
    CASE 
        WHEN COUNT(*) = 9 THEN '✅ ALL PRESENT'
        ELSE '❌ MISSING: ' || (9 - COUNT(*))::text
    END as status
FROM information_schema.columns
WHERE table_name = 'chat_sessions'
AND column_name IN (
    'session_id', 'user_id', 'title', 'category', 'message_count',
    'markdown_file_url', 'markdown_file_path', 'created_at', 'updated_at'
);

-- 检查chat_messages RLS策略
SELECT 
    'chat_messages RLS policies' as check_name,
    COUNT(*) as count,
    CASE WHEN COUNT(*) >= 2 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM pg_policies
WHERE tablename = 'chat_messages';

-- ============================================================================
-- 2. Wallet Authentication 验证
-- ============================================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '2. WALLET AUTHENTICATION 验证' as section;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- 检查profiles表是否存在
SELECT 
    'profiles table' as check_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles')
        THEN '✅ EXISTS'
        ELSE '❌ NOT FOUND'
    END as status;

-- 检查wallet列
SELECT 
    'wallet columns' as check_name,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 2 THEN '✅ BOTH PRESENT' ELSE '❌ MISSING' END as status
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('wallet_address', 'wallet_type');

-- 检查wallet索引
SELECT 
    'wallet indexes' as check_name,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 3 THEN '✅ ALL PRESENT' ELSE '❌ MISSING' END as status
FROM pg_indexes
WHERE tablename = 'profiles'
AND indexname LIKE '%wallet%';

-- 列出所有wallet索引
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
AND indexname LIKE '%wallet%'
ORDER BY indexname;

-- ============================================================================
-- 3. Storage Buckets 验证
-- ============================================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '3. STORAGE BUCKETS 验证' as section;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- 检查Storage buckets（需要从storage.buckets表查询）
SELECT 
    id as bucket_name,
    public as is_public,
    CASE WHEN public THEN '🌐 Public' ELSE '🔒 Private' END as access_type
FROM storage.buckets
ORDER BY id;

-- ============================================================================
-- 4. RLS策略总览
-- ============================================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '4. RLS POLICIES 总览' as section;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- 列出所有RLS策略
SELECT 
    tablename,
    COUNT(*) as policy_count,
    CASE WHEN COUNT(*) > 0 THEN '✅ Protected' ELSE '⚠️ No policies' END as status
FROM pg_policies
GROUP BY tablename
ORDER BY tablename;

-- ============================================================================
-- 5. 数据库函数检查（查找重复）
-- ============================================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '5. DATABASE FUNCTIONS 检查' as section;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- 列出所有自定义函数
SELECT 
    routine_name as function_name,
    routine_type as type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 查找可能重复的函数（相同名称不同参数）
SELECT 
    routine_name,
    COUNT(*) as version_count,
    CASE WHEN COUNT(*) > 1 THEN '⚠️ Multiple versions' ELSE '✅ Single version' END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
GROUP BY routine_name
ORDER BY version_count DESC, routine_name;

-- ============================================================================
-- 6. 触发器检查
-- ============================================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '6. TRIGGERS 检查' as section;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- 列出所有触发器
SELECT 
    trigger_name,
    event_object_table as table_name,
    action_timing as timing,
    event_manipulation as event
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ============================================================================
-- 7. 最终总结
-- ============================================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '7. 配置状态总结' as section;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
    '✅ Configuration Complete' as status,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as total_tables,
    (SELECT COUNT(*) FROM pg_policies) as total_policies,
    (SELECT COUNT(*) FROM storage.buckets) as total_buckets,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public') as total_functions;

-- ============================================================================
-- 测试建议
-- ============================================================================

/*
运行此脚本后，检查：

1. ✅ Chat Sessions
   - column_count >= 10
   - 所有必需列都存在
   - RLS policies >= 2

2. ✅ Wallet Authentication  
   - profiles表存在
   - wallet_address和wallet_type都存在
   - 3个索引都已创建

3. ✅ Storage Buckets
   - bmc-images (public)
   - bp-documents (private)
   - chat-sessions (private)

4. ✅ RLS Policies
   - 所有表都有适当的策略

5. ⚠️ 重复函数
   - 如果有"Multiple versions"，需要清理

接下来的测试：
1. 尝试登录（Email/Password, Google, 钱包）
2. 创建AI Chat会话
3. 上传BP文档
4. 保存BMC图片
5. 检查Dashboard显示
*/

