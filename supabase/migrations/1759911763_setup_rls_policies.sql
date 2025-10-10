-- Migration: setup_rls_policies
-- Created at: 1759911763

-- Enable RLS on all tables
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_shares ENABLE ROW LEVEL SECURITY;

-- Stories policies
DROP POLICY IF EXISTS "Stories are viewable by everyone" ON stories;
CREATE POLICY "Stories are viewable by everyone" ON stories FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can insert their own stories" ON stories;
CREATE POLICY "Users can insert their own stories" ON stories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own stories" ON stories;
CREATE POLICY "Users can update their own stories" ON stories FOR UPDATE USING (true);

-- Tags policies (read-only for public)
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON tags;
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create tags" ON tags;
CREATE POLICY "Anyone can create tags" ON tags FOR INSERT WITH CHECK (true);

-- Story tags policies
DROP POLICY IF EXISTS "Story tags are viewable by everyone" ON story_tags;
CREATE POLICY "Story tags are viewable by everyone" ON story_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create story tags" ON story_tags;
CREATE POLICY "Anyone can create story tags" ON story_tags FOR INSERT WITH CHECK (true);

-- Interaction policies
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON story_likes;
CREATE POLICY "Likes are viewable by everyone" ON story_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can like stories" ON story_likes;
CREATE POLICY "Anyone can like stories" ON story_likes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can remove their likes" ON story_likes;
CREATE POLICY "Users can remove their likes" ON story_likes FOR DELETE USING (true);

-- Saves policies
DROP POLICY IF EXISTS "Saves are viewable by everyone" ON story_saves;
CREATE POLICY "Saves are viewable by everyone" ON story_saves FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can save stories" ON story_saves;
CREATE POLICY "Anyone can save stories" ON story_saves FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can remove their saves" ON story_saves;
CREATE POLICY "Users can remove their saves" ON story_saves FOR DELETE USING (true);

-- Comments policies
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON story_comments;
CREATE POLICY "Comments are viewable by everyone" ON story_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can comment on stories" ON story_comments;
CREATE POLICY "Anyone can comment on stories" ON story_comments FOR INSERT WITH CHECK (true);

-- Shares policies
DROP POLICY IF EXISTS "Shares are viewable by everyone" ON story_shares;
CREATE POLICY "Shares are viewable by everyone" ON story_shares FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can share stories" ON story_shares;
CREATE POLICY "Anyone can share stories" ON story_shares FOR INSERT WITH CHECK (true);;