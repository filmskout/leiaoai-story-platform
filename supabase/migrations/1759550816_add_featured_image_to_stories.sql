-- Migration: add_featured_image_to_stories
-- Created at: 1759550816

-- Add featured_image_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'featured_image_url') THEN
        ALTER TABLE stories ADD COLUMN featured_image_url TEXT;
    END IF;
END $$;

-- Update existing stories with image URLs based on category
UPDATE stories 
SET featured_image_url = CASE 
    WHEN category = 'ai_tools' THEN '/story-images/coding-ai-1.png'
    WHEN category = 'startup_interview' THEN '/story-images/startup-ai-1.png'
    WHEN category = 'investment_outlook' THEN '/story-images/finance-ai-1.png'
    WHEN category = 'finance_ai' THEN '/story-images/finance-ai-2.png'
    WHEN category = 'video_generation' THEN '/story-images/video-generation-1.png'
    WHEN category = 'domestic_ai' THEN '/story-images/chinese-ai-1.png'
    WHEN category = 'overseas_ai' THEN '/story-images/creative-ai-1.png'
    WHEN category = 'business' THEN '/story-images/business-ai-1.png'
    WHEN category = 'content' THEN '/story-images/content-ai-1.png'
    WHEN category = 'ecommerce' THEN '/story-images/ecommerce-ai-1.png'
    WHEN category = 'education' THEN '/story-images/education-ai-1.png'
    WHEN category = 'healthcare' THEN '/story-images/healthcare-ai-1.png'
    WHEN category = 'manufacturing' THEN '/story-images/manufacturing-ai-1.png'
    WHEN category = 'realestate' THEN '/story-images/realestate-ai-1.png'
    WHEN category = 'research' THEN '/story-images/research-ai-1.png'
    WHEN category = 'social' THEN '/story-images/social-ai-1.png'
    ELSE '/story-images/story-1.jpg'
END
WHERE featured_image_url IS NULL;;