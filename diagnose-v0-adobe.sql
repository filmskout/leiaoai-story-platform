-- 专门针对v0和Adobe的项目修复
-- 先诊断当前状态

-- 1. 检查Adobe、Vercel、Express、Firefly、v0是否存在
SELECT 'Companies检查:' as section, id, name, category, website
FROM companies
WHERE name IN ('Adobe', 'Vercel', 'Adobe Express', 'Adobe Firefly', 'Express', 'Firefly', 'v0', 'v0 by Vercel')
ORDER BY name;

-- 2. 检查projects表中是否有这些项目
SELECT 'Projects检查:' as section, p.id, p.name, c.name as parent_company, p.company_id
FROM projects p
LEFT JOIN companies c ON p.company_id = c.id
WHERE p.name IN ('Adobe Express', 'Adobe Firefly', 'Express', 'Firefly', 'v0')
ORDER BY p.name;

-- 3. 检查是否有重复的项目
SELECT '重复检查:' as section, p.name, COUNT(*) as count, STRING_AGG(c.name, ', ') as parents
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE p.name IN ('Adobe Express', 'Adobe Firefly', 'v0')
GROUP BY p.name
HAVING COUNT(*) > 1;

-- 4. 查找可能作为独立公司存在的项目
SELECT '可能的错误公司:' as section, c.id, c.name, c.description
FROM companies c
WHERE c.name LIKE '%Adobe Express%' 
   OR c.name LIKE '%Adobe Firefly%'
   OR c.name LIKE '%Firefly%'
   OR c.name LIKE '%Express%'
   OR c.name = 'v0'
   OR c.name LIKE '%v0%';
