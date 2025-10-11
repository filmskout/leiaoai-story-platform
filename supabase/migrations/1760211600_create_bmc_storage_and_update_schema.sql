-- Migration: Create BMC Storage Bucket and Update Schema
-- Created: 2025-10-11
-- Purpose: Add image_url field to bmc_boards and create storage bucket for BMC images

-- 1. Add image_url column to bmc_boards table (if not exists)
ALTER TABLE bmc_boards 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Add category column to chat_sessions table (for tracking session source)
ALTER TABLE chat_sessions
ADD COLUMN IF NOT EXISTS category TEXT;

-- 3. Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_sessions_category 
ON chat_sessions(category) 
WHERE category IS NOT NULL;

-- 4. Create a view for session statistics by category
CREATE OR REPLACE VIEW sessions_by_category AS
SELECT 
  category,
  COUNT(*) as session_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(CASE 
    WHEN updated_at > created_at 
    THEN EXTRACT(EPOCH FROM (updated_at - created_at)) 
    ELSE 0 
  END) as avg_duration_seconds
FROM chat_sessions
WHERE category IS NOT NULL
GROUP BY category;

-- 5. Comment on new fields
COMMENT ON COLUMN bmc_boards.image_url IS 'Public URL of BMC image stored in Supabase Storage (bmc-images bucket)';
COMMENT ON COLUMN chat_sessions.category IS 'Source category from professional services area (e.g., startup, finance, healthcare)';

-- Note: Storage bucket creation must be done via Supabase Dashboard or CLI
-- Bucket name: bmc-images
-- Public: Yes
-- File size limit: 10MB
-- Allowed MIME types: image/png, image/jpeg

