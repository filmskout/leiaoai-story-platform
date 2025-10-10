CREATE TABLE social_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    total_likes_given INTEGER DEFAULT 0,
    total_likes_received INTEGER DEFAULT 0,
    total_comments_made INTEGER DEFAULT 0,
    total_stories_published INTEGER DEFAULT 0,
    total_shares_made INTEGER DEFAULT 0,
    days_active INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);