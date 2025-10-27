-- 检查公司-项目关系
-- 找出所有被错误归类为"公司"的"项目"

-- 1. 检查潜在的错误"公司"（实际上是项目）
SELECT 
  name,
  description,
  website,
  category,
  '可能应该是项目' as issue
FROM companies
WHERE name IN (
  'Adobe Express',
  'Adobe Firefly',
  'v0',
  'v0 by Vercel',
  'Adobe AI',
  'Firefly',
  'Express'
)
ORDER BY name;

-- 2. 检查这些是否已经有对应的父公司
SELECT 
  c.name as potential_project,
  parent.name as parent_company,
  parent.id as parent_id
FROM companies c
LEFT JOIN companies parent ON (
  (parent.name = 'Adobe' AND (c.name LIKE '%Adobe%' OR c.name LIKE '%Firefly%' OR c.name LIKE '%Express%'))
  OR (parent.name = 'Vercel' AND (c.name = 'v0' OR c.name = 'v0 by Vercel'))
)
WHERE c.name IN ('Adobe Express', 'Adobe Firefly', 'Firefly', 'Express', 'v0', 'v0 by Vercel', 'Adobe AI')
ORDER BY parent.name, c.name;

-- 3. 检查projects表中是否已经有这些项目
SELECT 
  p.name as project_name,
  c.name as parent_company,
  p.company_id
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE p.name IN ('Adobe Express', 'Adobe Firefly', 'v0', 'Express', 'Firefly')
ORDER BY c.name, p.name;

-- 4. 检查如果这些"项目公司"被删除，是否有重复的projects记录
SELECT 
  project_name,
  COUNT(*) as duplicate_count
FROM (
  SELECT p.name as project_name
  FROM projects p
  JOIN companies c ON p.company_id = c.id
  WHERE p.name IN ('Adobe Express', 'Adobe Firefly', 'v0', 'Express', 'Firefly')
) subquery
GROUP BY project_name
HAVING COUNT(*) > 1;
