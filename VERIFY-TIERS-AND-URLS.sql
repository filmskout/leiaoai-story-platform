-- Verification: missing websites and missing tiers

-- Summary
SELECT 
  (SELECT COUNT(*) FROM companies) AS total,
  (SELECT COUNT(*) FROM companies WHERE website IS NULL OR website = '') AS missing_websites,
  (SELECT COUNT(*) FROM companies WHERE company_tier IS NULL) AS missing_tiers;

-- Missing website details
SELECT name FROM companies WHERE website IS NULL OR website = '' ORDER BY name;

-- Missing tier details
SELECT name FROM companies WHERE company_tier IS NULL ORDER BY name;

-- Tier distribution
SELECT company_tier, COUNT(*) FROM companies GROUP BY company_tier ORDER BY company_tier;
