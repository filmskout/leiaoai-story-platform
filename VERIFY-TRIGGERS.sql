-- 验证所有触发器是否创建成功

-- 1. 查看实际创建的触发器
SELECT 
  event_object_table as table_name,
  trigger_name,
  event_manipulation as event_type,
  action_timing as timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('story_likes', 'story_comments', 'story_saves', 'story_tag_assignments')
ORDER BY event_object_table, trigger_name;

-- 2. 应该有的8个触发器清单
SELECT '期望的触发器列表：' as info;
SELECT 'story_likes' as table_name, 'increment_story_like_trigger' as trigger_name, 'INSERT' as event
UNION ALL
SELECT 'story_likes', 'decrement_story_like_trigger', 'DELETE'
UNION ALL
SELECT 'story_comments', 'increment_story_comment_trigger', 'INSERT'
UNION ALL
SELECT 'story_comments', 'decrement_story_comment_trigger', 'DELETE'
UNION ALL
SELECT 'story_saves', 'increment_story_saves_trigger', 'INSERT'
UNION ALL
SELECT 'story_saves', 'decrement_story_saves_trigger', 'DELETE'
UNION ALL
SELECT 'story_tag_assignments', 'increment_tag_usage_trigger', 'INSERT'
UNION ALL
SELECT 'story_tag_assignments', 'decrement_tag_usage_trigger', 'DELETE'
ORDER BY table_name, event;

-- 3. 统计每个表的触发器数量
SELECT 
  event_object_table as table_name,
  COUNT(*) as trigger_count
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('story_likes', 'story_comments', 'story_saves', 'story_tag_assignments')
GROUP BY event_object_table
ORDER BY table_name;

