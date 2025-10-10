CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    preferred_language TEXT DEFAULT 'zh-CN',
    preferred_ai_model TEXT DEFAULT 'openai',
    preferred_image_model TEXT DEFAULT 'standard',
    theme_preference TEXT DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);