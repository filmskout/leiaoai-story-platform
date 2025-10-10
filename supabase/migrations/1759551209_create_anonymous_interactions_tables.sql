-- Migration: create_anonymous_interactions_tables
-- Created at: 1759551209

-- Create anonymous_likes table for IP-based like tracking
CREATE TABLE IF NOT EXISTS anonymous_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_ip TEXT NOT NULL,
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(client_ip, story_id)
);

-- Create anonymous_shares table for IP-based share tracking  
CREATE TABLE IF NOT EXISTS anonymous_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_ip TEXT NOT NULL,
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    share_type TEXT DEFAULT 'link',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_anonymous_likes_client_ip_story ON anonymous_likes(client_ip, story_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_likes_story_id ON anonymous_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_shares_client_ip ON anonymous_shares(client_ip);
CREATE INDEX IF NOT EXISTS idx_anonymous_shares_story_id ON anonymous_shares(story_id);

-- Add RLS policies for anonymous tables
ALTER TABLE anonymous_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_shares ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for anonymous interactions
CREATE POLICY "Allow public access to anonymous_likes" ON anonymous_likes FOR ALL USING (true);
CREATE POLICY "Allow public access to anonymous_shares" ON anonymous_shares FOR ALL USING (true);;