-- ============================================================
-- Quick Check: Foundation Data Status
-- ============================================================

-- Summary
SELECT 
    'Summary' as report_section,
    COUNT(*)::text as total_companies,
    COUNT(CASE WHEN founded_year IS NOT NULL THEN 1 END)::text as with_founded_year,
    COUNT(CASE WHEN headquarters IS NOT NULL THEN 1 END)::text as with_headquarters,
    ROUND(COUNT(CASE WHEN founded_year IS NOT NULL AND headquarters IS NOT NULL THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100, 2)::text || '%' as completion_pct
FROM companies;

-- Missing companies (if any)
SELECT 
    'Missing Data' as report_section,
    name,
    founded_year::text as founded_year,
    headquarters
FROM companies
WHERE founded_year IS NULL OR headquarters IS NULL
ORDER BY name;

-- Sample of completed companies
SELECT 
    'Sample Completed' as report_section,
    name,
    founded_year::text as founded_year,
    headquarters
FROM companies
WHERE founded_year IS NOT NULL AND headquarters IS NOT NULL
ORDER BY name
LIMIT 20;

