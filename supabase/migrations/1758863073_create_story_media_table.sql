-- Migration: create_story_media_table
-- Created at: 1758863073

-- Create story_media table
CREATE TABLE IF NOT EXISTS story_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    media_name TEXT,
    file_size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE story_media ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Story media is viewable by everyone" ON story_media FOR SELECT USING (true);
CREATE POLICY "Users can insert media for their stories" ON story_media FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM stories 
        WHERE stories.id = story_media.story_id 
        AND stories.user_id = auth.uid()
    )
);;