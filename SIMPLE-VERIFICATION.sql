-- 简化的验证SQL - 一次性验证所有设置

-- ═══════════════════════════════════════════════════════════════
-- 1. 验证数据库表（应该有10个）
-- ═══════════════════════════════════════════════════════════════
SELECT '=== 数据库表验证 ===' as section;

SELECT 
  table_name,
  'OK' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'bmc_boards',
    'chat_sessions',
    'chat_messages',
    'bp_submissions',
    'story_tags',
    'story_tag_assignments',
    'story_likes',
    'story_saves',
    'story_comments',
    'story_shares'
  )
ORDER BY table_name;

-- ═══════════════════════════════════════════════════════════════
-- 2. 验证触发器（应该有8个）
-- ═══════════════════════════════════════════════════════════════
SELECT '=== 触发器验证 ===' as section;

SELECT 
  event_object_table as table_name,
  trigger_name,
  'OK' as status
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('story_likes', 'story_comments', 'story_saves', 'story_tag_assignments')
ORDER BY event_object_table, trigger_name;

-- ═══════════════════════════════════════════════════════════════
-- 3. 验证Storage Buckets（应该有2个）
-- ═══════════════════════════════════════════════════════════════
SELECT '=== Storage Buckets验证 ===' as section;

SELECT 
  name as bucket_name,
  CASE WHEN public THEN 'Public' ELSE 'Private' END as access_type,
  'OK' as status
FROM storage.buckets
WHERE name IN ('bmc-images', 'bp-documents')
ORDER BY name;

-- ═══════════════════════════════════════════════════════════════
-- 4. 统计总结
-- ═══════════════════════════════════════════════════════════════
SELECT '=== 设置完成度统计 ===' as section;

SELECT 
  '数据库表' as item,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('bmc_boards', 'chat_sessions', 'chat_messages', 'bp_submissions', 
                      'story_tags', 'story_tag_assignments', 'story_likes', 'story_saves', 
                      'story_comments', 'story_shares')) as actual,
  10 as expected,
  CASE 
    WHEN (SELECT COUNT(*) FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name IN ('bmc_boards', 'chat_sessions', 'chat_messages', 'bp_submissions', 
                            'story_tags', 'story_tag_assignments', 'story_likes', 'story_saves', 
                            'story_comments', 'story_shares')) = 10 
    THEN '✅ 完成' 
    ELSE '❌ 未完成' 
  END as status

UNION ALL

SELECT 
  '触发器' as item,
  (SELECT COUNT(*) FROM information_schema.triggers 
   WHERE event_object_schema = 'public' 
   AND event_object_table IN ('story_likes', 'story_comments', 'story_saves', 'story_tag_assignments')) as actual,
  8 as expected,
  CASE 
    WHEN (SELECT COUNT(*) FROM information_schema.triggers 
          WHERE event_object_schema = 'public' 
          AND event_object_table IN ('story_likes', 'story_comments', 'story_saves', 'story_tag_assignments')) = 8 
    THEN '✅ 完成' 
    ELSE '⚠️  检查' 
  END as status

UNION ALL

SELECT 
  'Storage Buckets' as item,
  (SELECT COUNT(*) FROM storage.buckets WHERE name IN ('bmc-images', 'bp-documents')) as actual,
  2 as expected,
  CASE 
    WHEN (SELECT COUNT(*) FROM storage.buckets WHERE name IN ('bmc-images', 'bp-documents')) = 2 
    THEN '✅ 完成' 
    ELSE '❌ 未完成' 
  END as status;

