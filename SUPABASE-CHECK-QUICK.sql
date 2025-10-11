-- 快速检查Supabase设置是否完整
-- 在Supabase SQL Editor中运行此文件

-- ═══════════════════════════════════════════════════════════════
-- 1. 检查表是否存在
-- ═══════════════════════════════════════════════════════════════
SELECT '=== 表检查 ===' as check_type;

SELECT 
  table_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables t2 
      WHERE t2.table_name = t.table_name
    ) THEN '✅ 存在'
    ELSE '❌ 不存在'
  END as status
FROM (
  VALUES 
    ('bp_submissions'),
    ('story_likes'),
    ('story_saves'),
    ('story_comments'),
    ('chat_sessions'),
    ('chat_messages')
) AS t(table_name);

-- ═══════════════════════════════════════════════════════════════
-- 2. 检查RLS是否启用
-- ═══════════════════════════════════════════════════════════════
SELECT '=== RLS状态检查 ===' as check_type;

SELECT 
  tablename as table_name,
  CASE 
    WHEN rowsecurity THEN '✅ 已启用'
    ELSE '❌ 未启用'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('bp_submissions', 'story_likes', 'story_saves', 'story_comments', 'chat_sessions', 'chat_messages')
ORDER BY tablename;

-- ═══════════════════════════════════════════════════════════════
-- 3. 检查每个表的Policies数量
-- ═══════════════════════════════════════════════════════════════
SELECT '=== Policies数量检查 ===' as check_type;

SELECT 
  tablename as table_name,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) >= 2 THEN '✅ OK'
    ELSE '⚠️  需要检查'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('bp_submissions', 'story_likes', 'story_saves', 'story_comments', 'chat_sessions', 'chat_messages')
GROUP BY tablename
ORDER BY tablename;

-- ═══════════════════════════════════════════════════════════════
-- 4. 检查Storage Buckets
-- ═══════════════════════════════════════════════════════════════
SELECT '=== Storage Buckets检查 ===' as check_type;

SELECT 
  name as bucket_name,
  CASE WHEN public THEN 'Public' ELSE 'Private' END as access_type,
  '✅ 存在' as status
FROM storage.buckets
WHERE name IN ('bmc-images', 'bp-documents')
ORDER BY name;

-- ═══════════════════════════════════════════════════════════════
-- 5. 检查当前用户
-- ═══════════════════════════════════════════════════════════════
SELECT '=== 当前用户检查 ===' as check_type;

SELECT 
  CASE 
    WHEN auth.uid() IS NOT NULL THEN '✅ 已登录'
    ELSE '❌ 未登录'
  END as auth_status,
  auth.uid() as user_id;

-- ═══════════════════════════════════════════════════════════════
-- 6. 详细的Policies列表
-- ═══════════════════================================================================
SELECT '=== 详细Policies列表 ===' as check_type;

SELECT 
  tablename,
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('bp_submissions', 'story_likes', 'story_saves', 'story_comments')
ORDER BY tablename, policyname;

-- ═══════════════════════════════════════════════════════════════
-- 结果说明
-- ═══════════════════════════════════════════════════════════════
/*
如果所有检查都显示✅，说明Supabase设置正确。

如果有❌，需要：
1. 表不存在 → 运行对应的SQL迁移文件
2. RLS未启用 → 运行 ALTER TABLE xxx ENABLE ROW LEVEL SECURITY;
3. Policies数量不对 → 重新运行SQL迁移文件
4. Bucket不存在 → 在Supabase Dashboard手动创建
5. 未登录 → 在应用中登录后再测试功能
*/

