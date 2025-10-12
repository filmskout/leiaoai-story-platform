-- 补充可能缺失的触发器
-- 先运行VERIFY-TRIGGERS.sql查看缺少哪个，然后运行此文件

-- 删除所有旧触发器（确保重新创建）
DROP TRIGGER IF EXISTS increment_story_like_trigger ON story_likes;
DROP TRIGGER IF EXISTS decrement_story_like_trigger ON story_likes;
DROP TRIGGER IF EXISTS increment_story_comment_trigger ON story_comments;
DROP TRIGGER IF EXISTS decrement_story_comment_trigger ON story_comments;
DROP TRIGGER IF EXISTS increment_story_saves_trigger ON story_saves;
DROP TRIGGER IF EXISTS decrement_story_saves_trigger ON story_saves;
DROP TRIGGER IF EXISTS increment_tag_usage_trigger ON story_tag_assignments;
DROP TRIGGER IF EXISTS decrement_tag_usage_trigger ON story_tag_assignments;

-- 重新创建所有8个触发器

-- 1. story_likes 触发器（2个）
CREATE TRIGGER increment_story_like_trigger
AFTER INSERT ON story_likes
FOR EACH ROW EXECUTE FUNCTION increment_story_like_count();

CREATE TRIGGER decrement_story_like_trigger
AFTER DELETE ON story_likes
FOR EACH ROW EXECUTE FUNCTION decrement_story_like_count();

-- 2. story_comments 触发器（2个）
CREATE TRIGGER increment_story_comment_trigger
AFTER INSERT ON story_comments
FOR EACH ROW EXECUTE FUNCTION increment_story_comment_count();

CREATE TRIGGER decrement_story_comment_trigger
AFTER DELETE ON story_comments
FOR EACH ROW EXECUTE FUNCTION decrement_story_comment_count();

-- 3. story_saves 触发器（2个）
CREATE TRIGGER increment_story_saves_trigger
AFTER INSERT ON story_saves
FOR EACH ROW EXECUTE FUNCTION increment_story_saves_count();

CREATE TRIGGER decrement_story_saves_trigger
AFTER DELETE ON story_saves
FOR EACH ROW EXECUTE FUNCTION decrement_story_saves_count();

-- 4. story_tag_assignments 触发器（2个）
CREATE TRIGGER increment_tag_usage_trigger
AFTER INSERT ON story_tag_assignments
FOR EACH ROW EXECUTE FUNCTION increment_tag_usage_count();

CREATE TRIGGER decrement_tag_usage_trigger
AFTER DELETE ON story_tag_assignments
FOR EACH ROW EXECUTE FUNCTION decrement_tag_usage_count();

-- 验证创建结果
SELECT 
  event_object_table as table_name,
  trigger_name,
  event_manipulation as event_type
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('story_likes', 'story_comments', 'story_saves', 'story_tag_assignments')
ORDER BY event_object_table, trigger_name;

