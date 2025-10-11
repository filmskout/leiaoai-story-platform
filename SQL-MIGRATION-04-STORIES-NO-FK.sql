-- ============================================
-- 迁移文件 4: Stories and Tags System
-- 无外键约束版本（先创建表，后面手动添加外键）
-- ============================================

-- 1. 创建story_tags表
DROP TABLE IF EXISTS story_tags CASCADE;
CREATE TABLE story_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. 创建story_tag_assignments表（暂时不添加外键）
DROP TABLE IF EXISTS story_tag_assignments CASCADE;
CREATE TABLE story_tag_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL,
  tag_id UUID NOT NULL REFERENCES story_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(story_id, tag_id)
);

-- 3. 创建story_likes表（暂时不添加外键）
DROP TABLE IF EXISTS story_likes CASCADE;
CREATE TABLE story_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX story_likes_user_unique ON story_likes(story_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX story_likes_session_unique ON story_likes(story_id, session_id) WHERE session_id IS NOT NULL;

-- 4. 创建story_saves表（暂时不添加外键）
DROP TABLE IF EXISTS story_saves CASCADE;
CREATE TABLE story_saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(story_id, user_id)
);

-- 5. 创建story_comments表（暂时不添加外键）
DROP TABLE IF EXISTS story_comments CASCADE;
CREATE TABLE story_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL,
  user_id UUID,
  session_id TEXT,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES story_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 6. 创建story_shares表（暂时不添加外键）
DROP TABLE IF EXISTS story_shares CASCADE;
CREATE TABLE story_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL,
  user_id UUID,
  session_id TEXT,
  platform TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 7. 创建索引
CREATE INDEX idx_story_tag_assignments_story ON story_tag_assignments(story_id);
CREATE INDEX idx_story_tag_assignments_tag ON story_tag_assignments(tag_id);
CREATE INDEX idx_story_likes_story ON story_likes(story_id);
CREATE INDEX idx_story_likes_user ON story_likes(user_id);
CREATE INDEX idx_story_saves_story ON story_saves(story_id);
CREATE INDEX idx_story_saves_user ON story_saves(user_id);
CREATE INDEX idx_story_comments_story ON story_comments(story_id);
CREATE INDEX idx_story_comments_parent ON story_comments(parent_comment_id);
CREATE INDEX idx_story_shares_story ON story_shares(story_id);

-- 8. 启用RLS
ALTER TABLE story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_shares ENABLE ROW LEVEL SECURITY;

-- 9. 删除所有旧的policies
DROP POLICY IF EXISTS "Anyone can view active tags" ON story_tags;
DROP POLICY IF EXISTS "Anyone can view tag assignments" ON story_tag_assignments;
DROP POLICY IF EXISTS "Authenticated users can assign tags to their stories" ON story_tag_assignments;
DROP POLICY IF EXISTS "Anyone can view likes" ON story_likes;
DROP POLICY IF EXISTS "Authenticated users can like stories" ON story_likes;
DROP POLICY IF EXISTS "Anonymous users can like stories" ON story_likes;
DROP POLICY IF EXISTS "Users can unlike their likes" ON story_likes;
DROP POLICY IF EXISTS "Authenticated users can view saves" ON story_saves;
DROP POLICY IF EXISTS "Authenticated users can save stories" ON story_saves;
DROP POLICY IF EXISTS "Users can unsave their saves" ON story_saves;
DROP POLICY IF EXISTS "Anyone can view comments" ON story_comments;
DROP POLICY IF EXISTS "Authenticated users can add comments" ON story_comments;
DROP POLICY IF EXISTS "Anonymous users can add comments" ON story_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON story_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON story_comments;
DROP POLICY IF EXISTS "Anyone can view shares" ON story_shares;
DROP POLICY IF EXISTS "Anyone can record shares" ON story_shares;

-- 10. 创建RLS policies
CREATE POLICY "Anyone can view active tags"
  ON story_tags FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view tag assignments"
  ON story_tag_assignments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can assign tags to their stories"
  ON story_tag_assignments FOR ALL
  USING (true);

CREATE POLICY "Anyone can view likes"
  ON story_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like stories"
  ON story_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can like stories"
  ON story_likes FOR INSERT
  WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Users can unlike their likes"
  ON story_likes FOR DELETE
  USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Authenticated users can view saves"
  ON story_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can save stories"
  ON story_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave their saves"
  ON story_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments"
  ON story_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add comments"
  ON story_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can add comments"
  ON story_comments FOR INSERT
  WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Users can update their own comments"
  ON story_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON story_comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view shares"
  ON story_shares FOR SELECT
  USING (true);

CREATE POLICY "Anyone can record shares"
  ON story_shares FOR INSERT
  WITH CHECK (true);

-- 11. 创建数据库函数（使用动态SQL来适配不同的主键列名）
CREATE OR REPLACE FUNCTION increment_story_like_count()
RETURNS TRIGGER AS $$
BEGIN
  -- 尝试用id
  BEGIN
    UPDATE stories SET like_count = like_count + 1 WHERE id = NEW.story_id;
    IF NOT FOUND THEN
      -- 如果没找到，尝试用story_id
      UPDATE stories SET like_count = like_count + 1 WHERE story_id = NEW.story_id;
    END IF;
  EXCEPTION WHEN undefined_column THEN
    -- 如果id列不存在，用story_id
    UPDATE stories SET like_count = like_count + 1 WHERE story_id = NEW.story_id;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_story_like_count()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    UPDATE stories SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.story_id;
    IF NOT FOUND THEN
      UPDATE stories SET like_count = GREATEST(0, like_count - 1) WHERE story_id = OLD.story_id;
    END IF;
  EXCEPTION WHEN undefined_column THEN
    UPDATE stories SET like_count = GREATEST(0, like_count - 1) WHERE story_id = OLD.story_id;
  END;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_story_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    UPDATE stories SET comment_count = comment_count + 1 WHERE id = NEW.story_id;
    IF NOT FOUND THEN
      UPDATE stories SET comment_count = comment_count + 1 WHERE story_id = NEW.story_id;
    END IF;
  EXCEPTION WHEN undefined_column THEN
    UPDATE stories SET comment_count = comment_count + 1 WHERE story_id = NEW.story_id;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_story_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    UPDATE stories SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.story_id;
    IF NOT FOUND THEN
      UPDATE stories SET comment_count = GREATEST(0, comment_count - 1) WHERE story_id = OLD.story_id;
    END IF;
  EXCEPTION WHEN undefined_column THEN
    UPDATE stories SET comment_count = GREATEST(0, comment_count - 1) WHERE story_id = OLD.story_id;
  END;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_story_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    UPDATE stories SET saves_count = saves_count + 1 WHERE id = NEW.story_id;
    IF NOT FOUND THEN
      UPDATE stories SET saves_count = saves_count + 1 WHERE story_id = NEW.story_id;
    END IF;
  EXCEPTION WHEN undefined_column THEN
    UPDATE stories SET saves_count = saves_count + 1 WHERE story_id = NEW.story_id;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_story_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    UPDATE stories SET saves_count = GREATEST(0, saves_count - 1) WHERE id = OLD.story_id;
    IF NOT FOUND THEN
      UPDATE stories SET saves_count = GREATEST(0, saves_count - 1) WHERE story_id = OLD.story_id;
    END IF;
  EXCEPTION WHEN undefined_column THEN
    UPDATE stories SET saves_count = GREATEST(0, saves_count - 1) WHERE story_id = OLD.story_id;
  END;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE story_tags
  SET usage_count = usage_count + 1
  WHERE id = NEW.tag_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE story_tags
  SET usage_count = GREATEST(0, usage_count - 1)
  WHERE id = OLD.tag_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 12. 删除旧的触发器
DROP TRIGGER IF EXISTS increment_story_like_trigger ON story_likes;
DROP TRIGGER IF EXISTS decrement_story_like_trigger ON story_likes;
DROP TRIGGER IF EXISTS increment_story_comment_trigger ON story_comments;
DROP TRIGGER IF EXISTS decrement_story_comment_trigger ON story_comments;
DROP TRIGGER IF EXISTS increment_story_saves_trigger ON story_saves;
DROP TRIGGER IF EXISTS decrement_story_saves_trigger ON story_saves;
DROP TRIGGER IF EXISTS increment_tag_usage_trigger ON story_tag_assignments;
DROP TRIGGER IF EXISTS decrement_tag_usage_trigger ON story_tag_assignments;

-- 13. 创建触发器
CREATE TRIGGER increment_story_like_trigger
AFTER INSERT ON story_likes
FOR EACH ROW EXECUTE FUNCTION increment_story_like_count();

CREATE TRIGGER decrement_story_like_trigger
AFTER DELETE ON story_likes
FOR EACH ROW EXECUTE FUNCTION decrement_story_like_count();

CREATE TRIGGER increment_story_comment_trigger
AFTER INSERT ON story_comments
FOR EACH ROW EXECUTE FUNCTION increment_story_comment_count();

CREATE TRIGGER decrement_story_comment_trigger
AFTER DELETE ON story_comments
FOR EACH ROW EXECUTE FUNCTION decrement_story_comment_count();

CREATE TRIGGER increment_story_saves_trigger
AFTER INSERT ON story_saves
FOR EACH ROW EXECUTE FUNCTION increment_story_saves_count();

CREATE TRIGGER decrement_story_saves_trigger
AFTER DELETE ON story_saves
FOR EACH ROW EXECUTE FUNCTION decrement_story_saves_count();

CREATE TRIGGER increment_tag_usage_trigger
AFTER INSERT ON story_tag_assignments
FOR EACH ROW EXECUTE FUNCTION increment_tag_usage_count();

CREATE TRIGGER decrement_tag_usage_trigger
AFTER DELETE ON story_tag_assignments
FOR EACH ROW EXECUTE FUNCTION decrement_tag_usage_count();

-- 14. 插入默认标签
INSERT INTO story_tags (name, display_name, color) VALUES
  ('ai_technology', 'AI技术', '#3B82F6'),
  ('investment', '投资', '#10B981'),
  ('startup', '创业', '#F59E0B'),
  ('business', '商业', '#8B5CF6'),
  ('finance', '金融', '#EF4444'),
  ('innovation', '创新', '#06B6D4'),
  ('market', '市场', '#EC4899'),
  ('strategy', '战略', '#6366F1'),
  ('success', '成功案例', '#14B8A6'),
  ('failure', '失败教训', '#F97316')
ON CONFLICT (name) DO NOTHING;

