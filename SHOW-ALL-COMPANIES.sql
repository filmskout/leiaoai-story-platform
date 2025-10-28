-- Show ALL companies with their current data
-- This helps us understand the actual company names in the database

SELECT 
    id,
    name,
    founded_year,
    headquarters,
    CASE 
        WHEN founded_year IS NULL AND headquarters IS NULL THEN '❌ Both missing'
        WHEN founded_year IS NULL THEN '⚠️ Missing founded_year'
        WHEN headquarters IS NULL THEN '⚠️ Missing headquarters'
        ELSE '✅ Complete'
    END as status
FROM companies
ORDER BY status, name;

-- Summary count
SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN founded_year IS NOT NULL AND headquarters IS NOT NULL THEN 1 END) as complete,
    COUNT(CASE WHEN founded_year IS NULL AND headquarters IS NULL THEN 1 END) as both_missing,
    COUNT(CASE WHEN founded_year IS NULL OR headquarters IS NULL THEN 1 END) as any_missing,
    ROUND(COUNT(CASE WHEN founded_year IS NOT NULL AND headquarters IS NOT NULL THEN 1 END)::numeric / COUNT(*) * 100, 2) as completion_pct
FROM companies;

