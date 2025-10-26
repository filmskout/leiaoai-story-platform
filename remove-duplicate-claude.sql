-- 查找并删除重复的Claude项目

-- 1. 查找重复的Claude项目
SELECT '=== 重复的Claude项目 ===' as info,
  p.id,
  p.name,
  p.website,
  p.description,
  p.company_id,
  c.name as company_name,
  p.created_at
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE p.name LIKE '%Claude%'
ORDER BY c.name, p.created_at;

-- 2. 删除重复项（保留最早的）
WITH ranked_projects AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY name, company_id ORDER BY created_at) as rn
  FROM projects
  WHERE name IN ('Claude', 'Claude Code')
)
DELETE FROM projects
WHERE id IN (
  SELECT id FROM ranked_projects WHERE rn > 1
);

-- 3. 显示删除后的结果
SELECT '=== 删除后的Claude项目 ===' as info,
  p.name,
  p.website,
  c.name as company_name
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE p.name LIKE '%Claude%'
ORDER BY c.name;
