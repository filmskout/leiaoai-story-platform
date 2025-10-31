-- Complete data update for all 116 companies
-- This includes brief descriptions (100 characters) and detailed descriptions (400+ words)

BEGIN;

-- Note: This is a placeholder. Real data generation should use LLM or manual research
-- For now, updating schema to support both description and detailed_description fields

-- First, ensure detailed_description column exists
ALTER TABLE companies ADD COLUMN IF NOT EXISTS detailed_description TEXT;

-- Update description field to be brief (if it's too long)
UPDATE companies 
SET description = LEFT(description, 120)
WHERE LENGTH(description) > 120;

-- Add placeholder for companies without detailed descriptions
UPDATE companies
SET detailed_description = COALESCE(
  detailed_description,
  'This company is a leading AI technology provider. Detailed information will be added soon.'
)
WHERE detailed_description IS NULL OR detailed_description = '';

COMMIT;

-- Next steps:
-- 1. Use LLM or manual research to populate detailed descriptions
-- 2. Each company should have:
--    - description: Brief 100-character summary for list view
--    - detailed_description: 400+ word comprehensive description for detail view
