-- Migration: create_stories_table
-- Created at: 1758863073

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    is_public BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public stories are viewable by everyone" ON stories FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Users can view their own stories" ON stories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stories" ON stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stories" ON stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stories" ON stories FOR DELETE USING (auth.uid() = user_id);;