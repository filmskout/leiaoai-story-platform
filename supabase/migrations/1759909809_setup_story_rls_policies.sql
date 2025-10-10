-- Migration: setup_story_rls_policies
-- Created at: 1759909809

-- Migration: setup_story_rls_policies
-- Enable RLS and create policies for story-related tables

-- Enable RLS on all story tables
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_shares ENABLE ROW LEVEL SECURITY;

-- Stories policies
DROP POLICY IF EXISTS "Public stories are viewable by everyone" ON stories;
CREATE POLICY "Public stories are viewable by everyone" ON stories FOR SELECT USING (status = 'published' AND is_public = true);

DROP POLICY IF EXISTS "Users can insert stories" ON stories;
CREATE POLICY "Users can insert stories" ON stories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own stories" ON stories;
CREATE POLICY "Users can update their own stories" ON stories FOR UPDATE USING (auth.uid() = author_id);

-- Story categories policies (read-only for most users)
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON story_categories;
CREATE POLICY "Categories are viewable by everyone" ON story_categories FOR SELECT USING (is_active = true);

-- Story tags policies (read-only for most users)
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON story_tags;
CREATE POLICY "Tags are viewable by everyone" ON story_tags FOR SELECT USING (is_active = true);

-- Story tag assignments policies
DROP POLICY IF EXISTS "Tag assignments are viewable by everyone" ON story_tag_assignments;
CREATE POLICY "Tag assignments are viewable by everyone" ON story_tag_assignments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert tag assignments" ON story_tag_assignments;
CREATE POLICY "Users can insert tag assignments" ON story_tag_assignments FOR INSERT WITH CHECK (true);

-- Story interactions policies (likes, saves, comments, shares)
DROP POLICY IF EXISTS "Everyone can view story likes" ON story_likes;
CREATE POLICY "Everyone can view story likes" ON story_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Everyone can insert story likes" ON story_likes;
CREATE POLICY "Everyone can insert story likes" ON story_likes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete their own likes" ON story_likes;
CREATE POLICY "Users can delete their own likes" ON story_likes FOR DELETE USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
);

DROP POLICY IF EXISTS "Everyone can view story saves" ON story_saves;
CREATE POLICY "Everyone can view story saves" ON story_saves FOR SELECT USING (true);

DROP POLICY IF EXISTS "Everyone can insert story saves" ON story_saves;
CREATE POLICY "Everyone can insert story saves" ON story_saves FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete their own saves" ON story_saves;
CREATE POLICY "Users can delete their own saves" ON story_saves FOR DELETE USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
);

DROP POLICY IF EXISTS "Everyone can view story comments" ON story_comments;
CREATE POLICY "Everyone can view story comments" ON story_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Everyone can insert story comments" ON story_comments;
CREATE POLICY "Everyone can insert story comments" ON story_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own comments" ON story_comments;
CREATE POLICY "Users can update their own comments" ON story_comments FOR UPDATE USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
);

DROP POLICY IF EXISTS "Users can delete their own comments" ON story_comments;
CREATE POLICY "Users can delete their own comments" ON story_comments FOR DELETE USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
);

DROP POLICY IF EXISTS "Everyone can view story shares" ON story_shares;
CREATE POLICY "Everyone can view story shares" ON story_shares FOR SELECT USING (true);

DROP POLICY IF EXISTS "Everyone can insert story shares" ON story_shares;
CREATE POLICY "Everyone can insert story shares" ON story_shares FOR INSERT WITH CHECK (true);;