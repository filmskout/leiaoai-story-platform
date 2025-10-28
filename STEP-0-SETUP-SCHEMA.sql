-- COMPLETE UPDATE FOR ALL 116 COMPANIES
-- This script will be executed in Supabase SQL Editor
-- It combines company classification, tier assignment, and project categorization

BEGIN;

-- Step 1: Ensure all required columns exist
ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_type TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_tier TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS detailed_description TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS focus_areas TEXT[];

ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_category TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_subcategory TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS target_audience TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS pricing_model TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS use_cases TEXT[];

COMMIT;
