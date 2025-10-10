CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    badge_type VARCHAR(100) NOT NULL,
    badge_name VARCHAR(255) NOT NULL,
    badge_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id,
    badge_type)
);