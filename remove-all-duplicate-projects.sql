-- 查找并删除所有重复的项目
-- 检查所有公司，删除重复项目（保留最早的）

BEGIN;

-- 1. 显示所有重复的项目
SELECT '=== 重复的项目（所有公司） ===' as info,
  company_id,
  c.name as company_name,
  p.name as project_name,
  COUNT(*) as count,
  array_agg(id::text ORDER BY created_at) as project_ids
FROM projects p
JOIN companies c ON p.company_id = c.id
GROUP BY company_id, c.name, p.name
HAVING COUNT(*) > 1
ORDER BY c.name, p.name;

-- 2. 删除所有重复的项目（保留最早创建的）
WITH ranked_projects AS (
  SELECT 
    id,
    company_id,
    name,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY company_id, name ORDER BY created_at) as rn
  FROM projects
)
DELETE FROM projects
WHERE id IN (
  SELECT id FROM ranked_projects WHERE rn > 1
);

-- 3. 显示删除结果
SELECT '=== 删除后的重复检查 ===' as info,
  c.name as company_name,
  p.name as project_name,
  COUNT(*) as count
FROM projects p
JOIN companies c ON p.company_id = c.id
GROUP BY company_id, c.name, p.name
HAVING COUNT(*) > 1
ORDER BY c.name, p.name;

COMMIT;
