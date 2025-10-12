-- ============================================================================
-- AI Chat Sessions 调试查询
-- ============================================================================
-- 用途: 检查会话保存、统计和显示问题
-- ============================================================================

-- 步骤1: 检查chat_sessions表中的数据
-- ============================================================================

SELECT 
    session_id,
    user_id,
    title,
    category,
    message_count,
    markdown_file_url,
    markdown_file_path,
    created_at,
    updated_at
FROM chat_sessions
ORDER BY created_at DESC
LIMIT 10;

-- 预期结果：应该看到最近创建的会话，包含category字段

-- 步骤2: 检查chat_messages表中的消息
-- ============================================================================

SELECT 
    cm.id,
    cm.session_id,
    cm.role,
    LEFT(cm.content, 100) as content_preview,
    cm.ai_model,
    cm.processing_time,
    cm.created_at,
    cs.category
FROM chat_messages cm
LEFT JOIN chat_sessions cs ON cm.session_id = cs.session_id
ORDER BY cm.created_at DESC
LIMIT 20;

-- 预期结果：应该看到用户和AI的消息记录

-- 步骤3: 统计各category的会话数量
-- ============================================================================

SELECT 
    category,
    COUNT(*) as session_count,
    COUNT(DISTINCT user_id) as unique_users
FROM chat_sessions
WHERE category IS NOT NULL
GROUP BY category
ORDER BY session_count DESC;

-- 预期结果：每个专业服务区域的会话统计

-- 步骤4: 检查总会话数
-- ============================================================================

SELECT 
    COUNT(*) as total_sessions,
    COUNT(DISTINCT user_id) as total_users,
    COUNT(CASE WHEN category IS NOT NULL THEN 1 END) as sessions_with_category,
    COUNT(CASE WHEN category IS NULL THEN 1 END) as sessions_without_category
FROM chat_sessions;

-- 预期结果：总统计数据

-- 步骤5: 检查特定用户的会话（替换YOUR_USER_ID）
-- ============================================================================

-- 先获取当前登录用户ID
-- SELECT auth.uid() as current_user_id;

-- 然后查询该用户的会话
SELECT 
    session_id,
    title,
    category,
    message_count,
    markdown_file_url IS NOT NULL as has_markdown,
    created_at,
    updated_at
FROM chat_sessions
WHERE user_id = auth.uid()  -- 或者替换为具体的用户ID
ORDER BY created_at DESC;

-- 预期结果：当前用户的所有会话

-- 步骤6: 检查最近24小时的会话
-- ============================================================================

SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    COUNT(*) as sessions_created,
    COUNT(DISTINCT category) as categories_used
FROM chat_sessions
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

-- 预期结果：最近24小时每小时的会话创建统计

-- ============================================================================
-- 常见问题诊断
-- ============================================================================

-- 问题1: Dashboard不显示会话
-- 检查1：用户是否登录？
SELECT 
    CASE 
        WHEN auth.uid() IS NULL THEN '❌ 用户未登录'
        ELSE '✅ 用户已登录: ' || auth.uid()::text
    END as login_status;

-- 检查2：该用户是否有会话？
SELECT 
    COUNT(*) as my_sessions,
    MAX(created_at) as last_session_at
FROM chat_sessions
WHERE user_id = auth.uid();

-- 问题2: 会话统计不准确
-- 检查website_stats表
SELECT * FROM website_stats ORDER BY updated_at DESC LIMIT 1;

-- 检查是否有RLS策略阻止读取
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('chat_sessions', 'chat_messages')
ORDER BY tablename, policyname;

-- ============================================================================
-- 修复建议
-- ============================================================================

/*
如果Dashboard不显示会话，可能的原因：

1. RLS策略问题
   - 确保chat_sessions表有正确的SELECT policy
   - 策略应允许用户查看自己的会话

2. user_id不匹配
   - 检查会话的user_id是否与当前登录用户匹配
   - 可能保存时使用了null或错误的user_id

3. 前端查询问题
   - 检查Profile.tsx中的loadChatSessions函数
   - 确保正确使用user.id进行查询

4. 数据未保存
   - 检查useAIChat.ts中的createNewSession是否成功
   - 查看浏览器console是否有错误日志

修复步骤：
1. 运行上述查询确认数据是否存在
2. 检查RLS policies是否正确
3. 检查前端console日志
4. 确认user.id是否正确
*/

-- ============================================================================
-- 快速修复：添加或更新RLS策略（如果需要）
-- ============================================================================

-- 允许用户查看自己的会话
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON chat_sessions;

CREATE POLICY "Users can view their own chat sessions"
ON chat_sessions FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

-- 允许用户创建自己的会话
DROP POLICY IF EXISTS "Users can create their own chat sessions" ON chat_sessions;

CREATE POLICY "Users can create their own chat sessions"
ON chat_sessions FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

-- 允许用户更新自己的会话
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON chat_sessions;

CREATE POLICY "Users can update their own chat sessions"
ON chat_sessions FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);

-- 验证策略
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'chat_sessions'
ORDER BY policyname;

-- 预期结果：应该看到上述三个策略

