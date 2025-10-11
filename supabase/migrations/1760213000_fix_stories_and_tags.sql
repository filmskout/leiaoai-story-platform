-- =====================================================
-- Stories功能和标签系统修复
-- 生成时间: 2025-10-11
-- =====================================================

-- 重要说明:
-- 当前数据库中已经有 story_tags (tags表) 和 story_tag_assignments (junction table)
-- 但是代码中混用了 'tags' 和 'story_tags' 两个名称
-- 这个迁移将统一命名并修复所有相关功能

-- =====================================================
-- 步骤1: 创建tags视图（如果代码需要查询tags表）
-- =====================================================

-- 创建一个视图，让代码可以用 'tags' 查询 'story_tags'
CREATE OR REPLACE VIEW tags AS
SELECT * FROM story_tags;

-- =====================================================
-- 步骤2: 确保所有交互表存在
-- =====================================================

-- Story Likes (user_likes already exists, but let's ensure consistency)
-- 重命名为更明确的名称
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_likes') THEN
    -- 如果 story_likes 不存在，将 user_likes 重命名
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_likes') THEN
      ALTER TABLE user_likes RENAME TO story_likes;
    END IF;
  END IF;
END $$;

-- Story Saves
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_saves') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_saves') THEN
      ALTER TABLE user_saves RENAME TO story_saves;
    END IF;
  END IF;
END $$;

-- Story Comments
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_comments') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_comments') THEN
      ALTER TABLE user_comments RENAME TO story_comments;
    END IF;
  END IF;
END $$;

-- Story Shares
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_shares') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_shares') THEN
      ALTER TABLE user_shares RENAME TO story_shares;
    END IF;
  END IF;
END $$;

-- 确保story_likes表有正确的结构
CREATE TABLE IF NOT EXISTS story_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_story_user_like UNIQUE(story_id, user_id),
  CONSTRAINT unique_story_session_like UNIQUE(story_id, session_id)
);

-- 确保story_saves表有正确的结构  
CREATE TABLE IF NOT EXISTS story_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_story_user_save UNIQUE(story_id, user_id)
);

-- 确保story_comments表有正确的结构
CREATE TABLE IF NOT EXISTS story_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL,
  user_id UUID,
  session_id TEXT,
  content TEXT NOT NULL,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 确保story_shares表有正确的结构
CREATE TABLE IF NOT EXISTS story_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL,
  user_id UUID,
  session_id TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 步骤3: 创建索引以提升查询性能
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_user_id ON story_likes(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_story_likes_session_id ON story_likes(session_id) WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_story_saves_story_id ON story_saves(story_id);
CREATE INDEX IF NOT EXISTS idx_story_saves_user_id ON story_saves(user_id);

CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_user_id ON story_comments(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_story_comments_created_at ON story_comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_story_shares_story_id ON story_shares(story_id);
CREATE INDEX IF NOT EXISTS idx_story_shares_platform ON story_shares(platform);

CREATE INDEX IF NOT EXISTS idx_story_tag_assignments_story_id ON story_tag_assignments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_tag_assignments_tag_id ON story_tag_assignments(tag_id);

CREATE INDEX IF NOT EXISTS idx_story_tags_is_active ON story_tags(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_story_tags_usage_count ON story_tags(usage_count DESC);

-- =====================================================
-- 步骤4: 创建数据库函数用于更新计数
-- =====================================================

-- 增加like计数
CREATE OR REPLACE FUNCTION increment_story_like_count(p_story_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE stories
  SET like_count = like_count + 1,
      updated_at = now()
  WHERE id = p_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 减少like计数
CREATE OR REPLACE FUNCTION decrement_story_like_count(p_story_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE stories
  SET like_count = GREATEST(like_count - 1, 0),
      updated_at = now()
  WHERE id = p_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 增加comment计数
CREATE OR REPLACE FUNCTION increment_story_comment_count(p_story_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE stories
  SET comment_count = comment_count + 1,
      updated_at = now()
  WHERE id = p_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 更新tag使用计数
CREATE OR REPLACE FUNCTION update_tag_usage_count(p_tag_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE story_tags
  SET usage_count = (
    SELECT COUNT(*)
    FROM story_tag_assignments
    WHERE tag_id = p_tag_id
  )
  WHERE id = p_tag_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 步骤5: 创建触发器自动更新计数
-- =====================================================

-- 当插入tag assignment时自动更新usage_count
CREATE OR REPLACE FUNCTION auto_update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE story_tags
    SET usage_count = usage_count + 1
    WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE story_tags
    SET usage_count = GREATEST(usage_count - 1, 0)
    WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_tag_usage_count ON story_tag_assignments;
CREATE TRIGGER trigger_update_tag_usage_count
AFTER INSERT OR DELETE ON story_tag_assignments
FOR EACH ROW
EXECUTE FUNCTION auto_update_tag_usage_count();

-- =====================================================
-- 步骤6: RLS 策略（如果需要）
-- =====================================================

-- 允许所有人读取公开的stories交互统计
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_shares ENABLE ROW LEVEL SECURITY;

-- 任何人都可以读取likes (for统计)
CREATE POLICY "Anyone can view story likes" ON story_likes
  FOR SELECT USING (true);

-- 用户可以like (authenticated或匿名通过session_id)
CREATE POLICY "Users can like stories" ON story_likes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- 用户可以删除自己的like
CREATE POLICY "Users can unlike stories" ON story_likes
  FOR DELETE USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- Saves policies
CREATE POLICY "Anyone can view story saves" ON story_saves
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can save stories" ON story_saves
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave their stories" ON story_saves
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies  
CREATE POLICY "Anyone can view comments" ON story_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can post comments" ON story_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can update their comments" ON story_comments
  FOR UPDATE USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can delete their comments" ON story_comments
  FOR DELETE USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- Shares policies
CREATE POLICY "Anyone can view shares" ON story_shares
  FOR SELECT USING (true);

CREATE POLICY "Users can share stories" ON story_shares
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- =====================================================
-- 步骤7: 创建辅助视图
-- =====================================================

-- 故事详情视图（包含tags）
CREATE OR REPLACE VIEW story_details_with_tags AS
SELECT 
  s.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', t.id,
        'name', t.name,
        'display_name', t.display_name,
        'color', t.color
      )
    ) FILTER (WHERE t.id IS NOT NULL),
    '[]'::json
  ) as tags
FROM stories s
LEFT JOIN story_tag_assignments sta ON sta.story_id = s.id
LEFT JOIN story_tags t ON t.id = sta.tag_id
GROUP BY s.id;

-- =====================================================
-- 完成！
-- =====================================================

-- 添加注释
COMMENT ON VIEW tags IS '视图：映射到story_tags表，用于代码兼容性';
COMMENT ON TABLE story_likes IS '故事点赞记录';
COMMENT ON TABLE story_saves IS '故事收藏记录';
COMMENT ON TABLE story_comments IS '故事评论记录';
COMMENT ON TABLE story_shares IS '故事分享记录';
COMMENT ON TABLE story_tag_assignments IS 'Story和Tag的多对多关联表';
COMMENT ON FUNCTION increment_story_like_count IS '增加故事的点赞计数';
COMMENT ON FUNCTION decrement_story_like_count IS '减少故事的点赞计数';
COMMENT ON FUNCTION increment_story_comment_count IS '增加故事的评论计数';
COMMENT ON FUNCTION update_tag_usage_count IS '更新标签的使用计数';

