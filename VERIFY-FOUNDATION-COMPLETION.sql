-- ============================================================
-- Verify Foundation Data Completion
-- ============================================================

-- 1. 总体统计
SELECT 
    COUNT(*) as total_companies,
    COUNT(founded_year) as with_founded_year,
    COUNT(headquarters) as with_headquarters,
    ROUND(COUNT(founded_year)::numeric / COUNT(*) * 100, 2) as founded_year_pct,
    ROUND(COUNT(headquarters)::numeric / COUNT(*) * 100, 2) as headquarters_pct
FROM companies;

-- 2. 列出所有缺失数据的公司
SELECT 
    name,
    founded_year,
    headquarters,
    CASE 
        WHEN founded_year IS NULL AND headquarters IS NULL THEN 'Both missing'
        WHEN founded_year IS NULL THEN 'Missing founded_year'
        WHEN headquarters IS NULL THEN 'Missing headquarters'
        ELSE 'Complete'
    END as status
FROM companies
WHERE founded_year IS NULL OR headquarters IS NULL
ORDER BY status, name;

-- 3. 统计缺失数量
SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE founded_year IS NULL) as missing_founded_year,
    COUNT(*) FILTER (WHERE headquarters IS NULL) as missing_headquarters,
    COUNT(*) FILTER (WHERE founded_year IS NULL AND headquarters IS NULL) as missing_both
FROM companies;

-- 4. 显示所有116家公司的完整状态（按名称排序）
SELECT 
    name,
    founded_year,
    headquarters,
    CASE 
        WHEN founded_year IS NOT NULL AND headquarters IS NOT NULL THEN '✅ Complete'
        ELSE '❌ Incomplete'
    END as status
FROM companies
ORDER BY name;

-- 5. 仅显示已完成数据的公司
SELECT 
    COUNT(*) as completed_count,
    ROUND(COUNT(*)::numeric / (SELECT COUNT(*) FROM companies) * 100, 2) as completion_pct
FROM companies
WHERE founded_year IS NOT NULL AND headquarters IS NOT NULL;

