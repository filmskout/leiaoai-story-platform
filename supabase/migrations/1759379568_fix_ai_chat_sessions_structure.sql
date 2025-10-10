-- Migration: fix_ai_chat_sessions_structure
-- Created at: 1759379568

-- Migration: fix_ai_chat_sessions_structure
-- Update ai_chat_sessions table to match frontend expectations

-- Add missing columns to ai_chat_sessions
ALTER TABLE ai_chat_sessions 
ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '新的对话',
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'zh-CN',
ADD COLUMN IF NOT EXISTS ai_model VARCHAR(50) DEFAULT 'deepseek',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;

-- Rename model column to ai_model if it exists
ALTER TABLE ai_chat_sessions 
RENAME COLUMN model TO ai_model_old;

-- Create a view that maps ai_chat_sessions to chat_sessions for compatibility
CREATE OR REPLACE VIEW chat_sessions AS 
SELECT 
    id,
    session_id,
    user_id,
    title,
    created_at,
    updated_at,
    language,
    ai_model,
    is_active,
    message_count
FROM ai_chat_sessions;

-- Insert sample stories for testing
INSERT INTO stories (
    user_id,
    title,
    content,
    excerpt,
    status,
    is_public,
    view_count,
    like_count,
    comment_count,
    featured_image_url,
    published_at
) VALUES 
(
    gen_random_uuid(),
    'LeiaoAI Investment Strategy: CVC Industrial Investment Best Practices',
    'Corporate Venture Capital (CVC) has become a crucial investment strategy for large enterprises looking to innovate and expand their market reach. This comprehensive guide explores the best practices for implementing effective CVC investment systems.',
    'Learn how large enterprises can build and optimize their CVC investment strategies for maximum ROI and strategic value.',
    'published',
    true,
    1250,
    45,
    12,
    '/story-images/story-1.jpg',
    NOW()
),
(
    gen_random_uuid(),
    'Market Analysis: IPO Trends in 2025',
    'The IPO market in 2025 has shown remarkable resilience and growth. This analysis covers the key trends, successful strategies, and emerging opportunities in the public markets.',
    'Comprehensive analysis of 2025 IPO market trends and investment opportunities.',
    'published', 
    true,
    980,
    38,
    7,
    '/story-images/story-2.jpg',
    NOW()
),
(
    gen_random_uuid(),
    'M&A Strategy: Valuation Models for Tech Startups',
    'Understanding the right valuation models for technology startups is crucial for successful M&A transactions. This article explores various approaches and methodologies.',
    'Expert insights on tech startup valuation models for M&A transactions.',
    'published',
    true,
    750,
    29,
    5,
    '/story-images/story-3.jpg',
    NOW()
) ON CONFLICT DO NOTHING;;