CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user',
    'assistant')),
    content TEXT NOT NULL,
    ai_model TEXT DEFAULT 'deepseek',
    processing_time INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);