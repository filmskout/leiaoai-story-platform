-- 查询所有没有URL的项目
-- 用于识别需要补齐URL的项目列表

SELECT 
    p.id,
    p.name AS project_name,
    c.name AS company_name,
    p.website,
    p.created_at
FROM projects p
INNER JOIN companies c ON p.company_id = c.id
WHERE p.website IS NULL OR p.website = ''
ORDER BY p.created_at DESC;

-- 查看项目总数
SELECT 
    COUNT(*) as total_projects,
    COUNT(website) as projects_with_url,
    COUNT(*) - COUNT(website) as projects_without_url
FROM projects;

