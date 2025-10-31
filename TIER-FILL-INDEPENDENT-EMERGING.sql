-- Heuristic fill for remaining NULL tiers: Independent / Emerging
-- Safe to run multiple times
BEGIN;

-- Emerging: newer companies (founded >= 2019) OR still missing website
UPDATE companies
SET company_tier = 'Emerging'
WHERE (company_tier IS NULL OR company_tier = '')
  AND (
    (founded_year IS NOT NULL AND founded_year >= 2019)
    OR (website IS NULL OR website = '')
  );

-- Independent: the rest of still-null tiers
UPDATE companies
SET company_tier = 'Independent'
WHERE (company_tier IS NULL OR company_tier = '');

COMMIT;

-- Verify
SELECT company_tier, COUNT(*) FROM companies GROUP BY company_tier ORDER BY company_tier;
SELECT name FROM companies WHERE company_tier IS NULL ORDER BY name;
