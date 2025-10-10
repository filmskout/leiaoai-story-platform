-- Migration: create_story_shares_table
-- Created at: 1759909777

-- Migration: create_story_shares_table
-- Create story_shares table and add proper constraints

-- Create story_shares table
CREATE TABLE IF NOT EXISTS story_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL,
    user_id UUID,
    session_id TEXT,
    platform TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_story_shares_story_id ON story_shares(story_id);
CREATE INDEX IF NOT EXISTS idx_story_shares_user_id ON story_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_story_shares_session_id ON story_shares(session_id);

-- Add unique constraints to prevent duplicate interactions (if columns exist)
DO $$
BEGIN
    -- For story_likes
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_likes') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'unique_user_story_like') THEN
            CREATE UNIQUE INDEX unique_user_story_like ON story_likes(story_id, user_id) WHERE user_id IS NOT NULL;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'unique_session_story_like') THEN
            CREATE UNIQUE INDEX unique_session_story_like ON story_likes(story_id, session_id) WHERE session_id IS NOT NULL;
        END IF;
    END IF;
    
    -- For story_saves
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_saves') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'unique_user_story_save') THEN
            CREATE UNIQUE INDEX unique_user_story_save ON story_saves(story_id, user_id) WHERE user_id IS NOT NULL;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'unique_session_story_save') THEN
            CREATE UNIQUE INDEX unique_session_story_save ON story_saves(story_id, session_id) WHERE session_id IS NOT NULL;
        END IF;
    END IF;
END $$;;