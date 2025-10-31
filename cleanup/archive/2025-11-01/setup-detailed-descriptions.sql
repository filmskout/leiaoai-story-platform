-- Generate detailed descriptions for remaining 96 companies
-- This SQL will update all companies with comprehensive descriptions

BEGIN;

-- Add or update detailed_description column with comprehensive information
-- This will be populated by LLM-generated content for all 116 companies

-- Schema validation: Ensure detailed_description column exists
ALTER TABLE companies ADD COLUMN IF NOT EXISTS detailed_description TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS description TEXT;

-- For now, copy current description to detailed_description where missing
UPDATE companies 
SET detailed_description = COALESCE(detailed_description, description)
WHERE detailed_description IS NULL;

-- Trim descriptions to 100 characters for brief descriptions (list view)
UPDATE companies
SET description = CASE 
  WHEN LENGTH(description) > 100 THEN LEFT(description, 97) || '...'
  ELSE description
END;

COMMIT;

-- Next: This script sets up the infrastructure
-- The actual detailed descriptions will need to be generated using LLM
-- or manually researched for all 116 companies
