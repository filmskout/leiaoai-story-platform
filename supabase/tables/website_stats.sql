CREATE TABLE website_stats (
    id SERIAL PRIMARY KEY,
    total_users INTEGER DEFAULT 12580,
    total_qa INTEGER DEFAULT 3240,
    total_bp_analysis INTEGER DEFAULT 123,
    avg_response_time DECIMAL DEFAULT 8.3,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);