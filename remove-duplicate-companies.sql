-- Remove duplicate companies across the database
-- Keep only the earliest created record

BEGIN;

-- Find all duplicate company names
SELECT '=== Duplicate Companies Found ===' as info,
  name,
  COUNT(*) as count,
  array_agg(id::text ORDER BY created_at) as company_ids,
  array_agg(created_at::text ORDER BY created_at) as timestamps
FROM companies
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY name;

-- Delete duplicates, keeping the earliest created
WITH ranked_companies AS (
  SELECT 
    id,
    name,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at) as rn
  FROM companies
)
DELETE FROM companies
WHERE id IN (
  SELECT id FROM ranked_companies WHERE rn > 1
);

-- Verify no duplicates remain
SELECT '=== Remaining Companies (should be unique) ===' as info,
  COUNT(*) as total_companies,
  COUNT(DISTINCT name) as unique_names,
  COUNT(*) - COUNT(DISTINCT name) as duplicates
FROM companies;

COMMIT;
