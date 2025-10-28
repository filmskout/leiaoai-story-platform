-- 查询数据完整性
-- 检查URL、估值、融资信息的配置情况

-- 1. 总体统计
SELECT 
    'Total Companies' as metric,
    COUNT(*)::text as value
FROM companies
UNION ALL
SELECT 
    'Companies with Website',
    COUNT(*)::text
FROM companies WHERE website IS NOT NULL AND website != ''
UNION ALL
SELECT 
    'Companies with Valuation',
    COUNT(*)::text
FROM companies WHERE valuation_usd IS NOT NULL
UNION ALL
SELECT 
    'Companies with Headquarters',
    COUNT(*)::text
FROM companies WHERE headquarters IS NOT NULL AND headquarters != ''
UNION ALL
SELECT 
    'Companies with Founded Year',
    COUNT(*)::text
FROM companies WHERE founded_year IS NOT NULL;

-- 2. 融资信息统计
SELECT 
    'Total Funding Records' as metric,
    COUNT(*)::text as value
FROM fundings
UNION ALL
SELECT 
    'Companies with Funding',
    COUNT(DISTINCT company_id)::text
FROM fundings;

-- 3. 项目统计
SELECT 
    'Total Projects' as metric,
    COUNT(*)::text as value
FROM projects
UNION ALL
SELECT 
    'Projects with Website',
    COUNT(*)::text
FROM projects WHERE website IS NOT NULL AND website != '';

-- 4. 缺失数据的公司（按tier）
SELECT 
    c.company_tier,
    COUNT(*) as total,
    COUNT(c.website) FILTER (WHERE c.website IS NOT NULL) as with_website,
    COUNT(c.valuation_usd) FILTER (WHERE c.valuation_usd IS NOT NULL) as with_valuation,
    COUNT(c.headquarters) FILTER (WHERE c.headquarters IS NOT NULL) as with_headquarters
FROM companies c
GROUP BY c.company_tier
ORDER BY c.company_tier;

-- 5. 缺失URL的公司列表
SELECT 
    name,
    company_tier,
    headquarters,
    valuation_usd,
    CASE 
        WHEN website IS NULL OR website = '' THEN '❌ 缺失URL'
        ELSE '✅ 已配置'
    END as url_status
FROM companies
WHERE website IS NULL OR website = ''
ORDER BY company_tier, name;

-- 6. 缺失估值的公司列表
SELECT 
    name,
    company_tier,
    website,
    headquarters,
    CASE 
        WHEN valuation_usd IS NULL THEN '❌ 缺失估值'
        ELSE '✅ 已配置'
    END as valuation_status
FROM companies
WHERE valuation_usd IS NULL
ORDER BY company_tier, name;

-- 7. 查看前20家公司的完整信息（示例）
SELECT 
    c.name,
    c.website,
    c.valuation_usd,
    c.company_tier,
    c.headquarters,
    c.founded_year,
    COUNT(p.id) as projects_count,
    COUNT(f.id) as fundings_count
FROM companies c
LEFT JOIN projects p ON p.company_id = c.id
LEFT JOIN fundings f ON f.company_id = c.id
GROUP BY c.id, c.name, c.website, c.valuation_usd, c.company_tier, c.headquarters, c.founded_year
ORDER BY COALESCE(c.valuation_usd, 0) DESC
LIMIT 20;

