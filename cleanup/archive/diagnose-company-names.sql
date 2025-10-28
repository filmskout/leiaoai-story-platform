-- ============================================================
-- Diagnose: Check actual company names in database
-- ============================================================

-- Show all companies
SELECT name, founded_year, headquarters
FROM companies
ORDER BY name;

-- Count missing
SELECT 
    COUNT(*) as total_missing,
    COUNT(*) FILTER (WHERE founded_year IS NULL AND headquarters IS NULL) as both_missing
FROM companies
WHERE founded_year IS NULL OR headquarters IS NULL;

-- List missing companies
SELECT name, founded_year, headquarters,
    CASE 
        WHEN founded_year IS NULL AND headquarters IS NULL THEN 'Both missing'
        WHEN founded_year IS NULL THEN 'Missing founded_year'
        WHEN headquarters IS NULL THEN 'Missing headquarters'
        ELSE 'Complete'
    END as status
FROM companies
WHERE founded_year IS NULL OR headquarters IS NULL
ORDER BY status, name;

