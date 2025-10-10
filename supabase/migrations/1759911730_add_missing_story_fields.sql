-- Migration: add_missing_story_fields
-- Created at: 1759911730

-- Add missing fields to stories table
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS publisher TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published',
ADD COLUMN IF NOT EXISTS location TEXT;

-- Update existing stories to have an author if they don't have one
UPDATE stories SET author = 'Anonymous' WHERE author IS NULL;

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create story_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS story_tags (
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, tag_id)
);

-- Create story interactions tables
CREATE TABLE IF NOT EXISTS story_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(story_id, user_id, session_id)
);

CREATE TABLE IF NOT EXISTS story_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(story_id, user_id, session_id)
);

CREATE TABLE IF NOT EXISTS story_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  content TEXT NOT NULL,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS story_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_is_public ON stories(is_public);
CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_saves_story_id ON story_saves(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON story_comments(story_id);;