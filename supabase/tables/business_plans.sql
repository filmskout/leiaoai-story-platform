CREATE TABLE business_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(20) DEFAULT 'pdf',
    upload_status VARCHAR(20) DEFAULT 'uploaded' CHECK (upload_status IN ('uploaded',
    'processing',
    'analyzed',
    'failed')),
    analysis_result JSONB,
    analysis_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);