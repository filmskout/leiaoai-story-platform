-- Migration: fix_stories_table_structure_v2
-- Created at: 1759909742

-- Migration: fix_stories_table_structure_v2
-- Fix database schema conflicts and add missing fields

-- Add missing fields to stories table
DO $$ 
BEGIN
    -- Add featured_image_url if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'featured_image_url') THEN
        ALTER TABLE stories ADD COLUMN featured_image_url TEXT;
    END IF;
    
    -- Add publisher if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'publisher') THEN
        ALTER TABLE stories ADD COLUMN publisher TEXT DEFAULT 'LeiaoAI Agent';
    END IF;
    
    -- Add is_public if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'is_public') THEN
        ALTER TABLE stories ADD COLUMN is_public BOOLEAN DEFAULT true;
    END IF;
    
    -- Add location if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'location') THEN
        ALTER TABLE stories ADD COLUMN location TEXT;
    END IF;
    
    -- Add category_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'category_id') THEN
        ALTER TABLE stories ADD COLUMN category_id UUID;
    END IF;
    
    -- Rename columns if they exist with different names
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'views_count') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'view_count') THEN
        ALTER TABLE stories RENAME COLUMN views_count TO view_count;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'likes_count') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'like_count') THEN
        ALTER TABLE stories RENAME COLUMN likes_count TO like_count;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'comments_count') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'comment_count') THEN
        ALTER TABLE stories RENAME COLUMN comments_count TO comment_count;
    END IF;
END $$;

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