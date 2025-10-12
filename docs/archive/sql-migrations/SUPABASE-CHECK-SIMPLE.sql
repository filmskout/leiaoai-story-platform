-- 简化版Supabase检查 - 只检查最关键的部分
-- 避免使用不存在的系统表

-- ═══════════════════════════════════════════════════════════════
-- 1. 快速检查：所有必需的表
-- ═══════════════════════════════════════════════════════════════
SELECT 
  CASE 
    WHEN COUNT(*) = 6 THEN '✅ 所有6个表都存在'
    ELSE '❌ 缺少' || (6 - COUNT(*))::text || '个表'
  END as 表检查结果
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('bp_submissions', 'story_likes', 'story_saves', 'story_comments', 'chat_sessions', 'chat_messages');

-- ═══════════════════════════════════════════════════════════════
-- 2. 快速检查：RLS是否全部启用
-- ═══════════════════════════════════════════════════════════════
SELECT 
  CASE 
    WHEN COUNT(*) = 6 AND SUM(CASE WHEN rowsecurity THEN 1 ELSE 0 END) = 6 
    THEN '✅ 所有表的RLS都已启用'
    ELSE '❌ 有' || (6 - SUM(CASE WHEN rowsecurity THEN 1 ELSE 0 END))::text || '个表RLS未启用'
  END as RLS检查结果
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('bp_submissions', 'story_likes', 'story_saves', 'story_comments', 'chat_sessions', 'chat_messages');

-- ═══════════════════════════════════════════════════════════════
-- 3. 快速检查：Policies数量
-- ═══════════════════════════════════════════════════════════════
SELECT 
  CASE 
    WHEN COUNT(*) >= 15 THEN '✅ Policies数量充足 (' || COUNT(*)::text || '个)'
    ELSE '⚠️  Policies可能不足 (' || COUNT(*)::text || '个，预期至少15个)'
  END as Policies检查结果
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('bp_submissions', 'story_likes', 'story_saves', 'story_comments', 'chat_sessions', 'chat_messages');

-- ═══════════════════════════════════════════════════════════════
-- 4. 快速检查：Storage Buckets
-- ═══════════════════════════════════════════════════════════════
SELECT 
  CASE 
    WHEN COUNT(*) = 2 THEN '✅ 两个buckets都存在'
    WHEN COUNT(*) = 0 THEN '❌ 没有创建任何bucket'
    ELSE '⚠️  只有' || COUNT(*)::text || '个bucket（应该有2个）'
  END as Buckets检查结果
FROM storage.buckets
WHERE name IN ('bmc-images', 'bp-documents');

-- ═══════════════════════════════════════════════════════════════
-- 5. 快速检查：当前用户
-- ═══════════════════════════════════════════════════════════════
SELECT 
  CASE 
    WHEN auth.uid() IS NOT NULL THEN '✅ 已登录 (ID: ' || auth.uid()::text || ')'
    ELSE '❌ 未登录 - 很多功能需要登录才能使用'
  END as 登录状态;

-- ═══════════════════════════════════════════════════════════════
-- 📊 总结
-- ═══════════════════════════════════════════════════════════════
/*
如果所有检查都是 ✅，说明Supabase基本设置正确。

如果有 ❌ 或 ⚠️，需要：
1. 表不存在 → 运行相应的SQL迁移文件
2. RLS未启用 → 运行迁移文件会自动启用
3. Policies不足 → 重新运行迁移文件
4. Buckets缺失 → 在Supabase Dashboard手动创建
5. 未登录 → 在应用中先登录

详细的修复步骤请查看: CURRENT-ISSUES-FIX.md
*/

-- ═══════════════════════════════════════════════════════════════
-- 可选：查看详细信息
-- ═══════════════════════════════════════════════════════════════

-- 如果想看每个表的详细信息，取消下面的注释：

/*
-- 查看每个表的状态
SELECT 
  tablename as 表名,
  CASE WHEN rowsecurity THEN '✅ 已启用' ELSE '❌ 未启用' END as RLS状态
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('bp_submissions', 'story_likes', 'story_saves', 'story_comments', 'chat_sessions', 'chat_messages')
ORDER BY tablename;

-- 查看每个表的Policies数量
SELECT 
  tablename as 表名,
  COUNT(*) as Policies数量
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('bp_submissions', 'story_likes', 'story_saves', 'story_comments')
GROUP BY tablename
ORDER BY tablename;

-- 查看Buckets详情
SELECT 
  name as Bucket名称,
  CASE WHEN public THEN 'Public' ELSE 'Private' END as 访问类型,
  file_size_limit / 1024 / 1024 as 大小限制MB
FROM storage.buckets
WHERE name IN ('bmc-images', 'bp-documents')
ORDER BY name;
*/

