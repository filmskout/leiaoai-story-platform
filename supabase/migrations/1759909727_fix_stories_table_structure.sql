-- Migration: fix_stories_table_structure
-- Created at: 1759909727

-- Migration: fix_stories_table_structure
-- Fix database schema conflicts and add missing fields

-- Add missing fields to stories table
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS publisher TEXT DEFAULT 'LeiaoAI Agent',
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS category_id UUID;

-- Rename conflicting columns to match expected interface
ALTER TABLE stories 
RENAME COLUMN IF EXISTS views_count TO view_count;

ALTER TABLE stories 
RENAME COLUMN IF EXISTS likes_count TO like_count;

ALTER TABLE stories 
RENAME COLUMN IF EXISTS comments_count TO comment_count;

-- Update missing featured_image_url for existing stories
UPDATE stories 
SET featured_image_url = COALESCE(cover_image_url, '/story-images/story-' || (FLOOR(RANDOM() * 8) + 1) || '.jpg')
WHERE featured_image_url IS NULL;

-- Set up proper categories relationship
UPDATE stories s
SET category_id = sc.id
FROM story_categories sc
WHERE s.category = sc.name AND s.category_id IS NULL;

-- Ensure all counts have default values
UPDATE stories SET view_count = COALESCE(view_count, 0);
UPDATE stories SET like_count = COALESCE(like_count, 0);
UPDATE stories SET comment_count = COALESCE(comment_count, 0);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_category_id ON stories(category_id);
CREATE INDEX IF NOT EXISTS idx_stories_published_at ON stories(published_at);
CREATE INDEX IF NOT EXISTS idx_story_tag_assignments_story_id ON story_tag_assignments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_tag_assignments_tag_id ON story_tag_assignments(tag_id);;