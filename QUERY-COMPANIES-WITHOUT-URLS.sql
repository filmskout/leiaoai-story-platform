-- 查询所有没有URL的公司
-- 用于识别需要补齐URL的公司列表

SELECT 
    c.id,
    c.name,
    c.website,
    c.company_tier,
    c.company_category,
    c.headquarters,
    COUNT(p.id) as projects_count,
    c.created_at
FROM companies c
LEFT JOIN projects p ON p.company_id = c.id
WHERE c.website IS NULL OR c.website = ''
GROUP BY c.id, c.name, c.website, c.company_tier, c.company_category, c.headquarters, c.created_at
ORDER BY c.created_at DESC;

-- 查看公司URL统计
SELECT 
    COUNT(*) as total_companies,
    COUNT(website) as companies_with_url,
    COUNT(*) - COUNT(website) as companies_without_url
FROM companies;

