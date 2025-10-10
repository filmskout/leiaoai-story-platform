CREATE TABLE user_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    story_id UUID NOT NULL,
    share_type VARCHAR(50) DEFAULT 'link',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);