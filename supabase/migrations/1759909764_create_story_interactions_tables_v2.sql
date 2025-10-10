-- Migration: create_story_interactions_tables_v2
-- Created at: 1759909764

-- Migration: create_story_interactions_tables_v2
-- Create tables for story interactions (likes, saves, comments, shares)

-- Create story_likes table
CREATE TABLE IF NOT EXISTS story_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL,
    user_id UUID,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create story_saves table
CREATE TABLE IF NOT EXISTS story_saves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL,
    user_id UUID,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create story_comments table if not exists
CREATE TABLE IF NOT EXISTS story_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL,
    user_id UUID,
    session_id TEXT,
    author_name TEXT,
    content TEXT NOT NULL,
    parent_comment_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_user_id ON story_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_session_id ON story_likes(session_id);

CREATE INDEX IF NOT EXISTS idx_story_saves_story_id ON story_saves(story_id);
CREATE INDEX IF NOT EXISTS idx_story_saves_user_id ON story_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_story_saves_session_id ON story_saves(session_id);

CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_user_id ON story_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_session_id ON story_comments(session_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_parent_id ON story_comments(parent_comment_id);

CREATE INDEX IF NOT EXISTS idx_story_shares_story_id ON story_shares(story_id);
CREATE INDEX IF NOT EXISTS idx_story_shares_user_id ON story_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_story_shares_session_id ON story_shares(session_id);;