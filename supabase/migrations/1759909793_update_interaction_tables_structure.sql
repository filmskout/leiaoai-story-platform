-- Migration: update_interaction_tables_structure
-- Created at: 1759909793

-- Migration: update_interaction_tables_structure
-- Update existing tables to support anonymous interactions

-- Add session_id column to story_likes if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_likes' AND column_name = 'session_id') THEN
        ALTER TABLE story_likes ADD COLUMN session_id TEXT;
    END IF;
END $$;

-- Add session_id column to story_saves if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_saves' AND column_name = 'session_id') THEN
        ALTER TABLE story_saves ADD COLUMN session_id TEXT;
    END IF;
END $$;

-- Add session_id and author_name columns to story_comments if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_comments' AND column_name = 'session_id') THEN
        ALTER TABLE story_comments ADD COLUMN session_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_comments' AND column_name = 'author_name') THEN
        ALTER TABLE story_comments ADD COLUMN author_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_comments' AND column_name = 'parent_comment_id') THEN
        ALTER TABLE story_comments ADD COLUMN parent_comment_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_comments' AND column_name = 'updated_at') THEN
        ALTER TABLE story_comments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create story_shares table if it doesn't exist
CREATE TABLE IF NOT EXISTS story_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL,
    user_id UUID,
    session_id TEXT,
    platform TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_story_likes_session_id ON story_likes(session_id);
CREATE INDEX IF NOT EXISTS idx_story_saves_session_id ON story_saves(session_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_session_id ON story_comments(session_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_parent_id ON story_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_story_shares_story_id ON story_shares(story_id);
CREATE INDEX IF NOT EXISTS idx_story_shares_user_id ON story_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_story_shares_session_id ON story_shares(session_id);;