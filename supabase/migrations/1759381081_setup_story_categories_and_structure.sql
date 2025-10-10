-- Migration: setup_story_categories_and_structure
-- Created at: 1759381081

-- Create story_categories table if not exists
CREATE TABLE IF NOT EXISTS story_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update stories table to add missing columns
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS category_id UUID,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS publisher TEXT DEFAULT 'LeiaoAI Agent';

-- Insert story categories
INSERT INTO story_categories (name, display_name, description, sort_order) 
VALUES 
('ai_tools', 'AI工具体验', 'Users sharing experiences with AI tools and platforms', 1),
('startup_interview', '创业访谈', 'Interviews with entrepreneurs and startup founders', 2),
('investment_outlook', '投资展望', 'Investment insights and market outlook analysis', 3),
('finance_ai', '金融AI应用', 'AI applications in finance and investment', 4),
('video_generation', '视频生成体验', 'Experiences with AI video generation tools', 5),
('domestic_ai', '国产AI工具', 'Chinese AI tools and platforms', 6),
('overseas_ai', '海外AI平台', 'International AI platforms and tools', 7)
ON CONFLICT (name) DO UPDATE SET
display_name = EXCLUDED.display_name,
description = EXCLUDED.description,
sort_order = EXCLUDED.sort_order;;