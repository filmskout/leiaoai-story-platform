-- Migration: add_session_id_to_interaction_tables
-- Created at: 1759911852

-- Add session_id columns to interaction tables if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_likes' AND column_name = 'session_id') THEN
        ALTER TABLE story_likes ADD COLUMN session_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_saves' AND column_name = 'session_id') THEN
        ALTER TABLE story_saves ADD COLUMN session_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_comments' AND column_name = 'session_id') THEN
        ALTER TABLE story_comments ADD COLUMN session_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'story_shares' AND column_name = 'session_id') THEN
        ALTER TABLE story_shares ADD COLUMN session_id TEXT;
    END IF;
END $$;;