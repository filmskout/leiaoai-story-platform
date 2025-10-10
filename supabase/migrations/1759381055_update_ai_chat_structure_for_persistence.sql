-- Migration: update_ai_chat_structure_for_persistence
-- Created at: 1759381055

-- Update ai_chat_sessions table to match requirements
ALTER TABLE ai_chat_sessions 
DROP COLUMN IF EXISTS session_id,
ADD COLUMN IF NOT EXISTS session_id UUID DEFAULT uuid_generate_v4(),
ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'qwen',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'zh-CN',
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;

-- Create story_categories table if not exists
CREATE TABLE IF NOT EXISTS story_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    display_name_en TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update stories table to reference categories properly
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS category_id UUID,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS publisher TEXT DEFAULT 'LeiaoAI Agent';

-- Insert story categories
INSERT INTO story_categories (name, display_name, display_name_en, description, sort_order) 
VALUES 
('ai_tools', 'AI工具体验', 'AI Tools Experience', 'Users sharing experiences with AI tools and platforms', 1),
('startup_interview', '创业访谈', 'Startup Interview', 'Interviews with entrepreneurs and startup founders', 2),
('investment_outlook', '投资展望', 'Investment Outlook', 'Investment insights and market outlook analysis', 3),
('finance_ai', '金融AI应用', 'Finance AI Application', 'AI applications in finance and investment', 4),
('video_generation', '视频生成体验', 'Video Generation Experience', 'Experiences with AI video generation tools', 5),
('domestic_ai', '国产AI工具', 'Domestic AI Tools', 'Chinese AI tools and platforms', 6),
('overseas_ai', '海外AI平台', 'Overseas AI Platforms', 'International AI platforms and tools', 7)
ON CONFLICT (name) DO UPDATE SET
display_name = EXCLUDED.display_name,
display_name_en = EXCLUDED.display_name_en,
description = EXCLUDED.description,
sort_order = EXCLUDED.sort_order;;