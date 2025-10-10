CREATE TABLE user_social_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    public_profile_visible BOOLEAN DEFAULT true,
    profile_share_token VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);