CREATE TABLE platform_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    total_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    total_stories INTEGER DEFAULT 0,
    new_stories INTEGER DEFAULT 0,
    total_chat_sessions INTEGER DEFAULT 0,
    new_chat_sessions INTEGER DEFAULT 0,
    total_bp_analyses INTEGER DEFAULT 0,
    new_bp_analyses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);