-- 删除错误的公司记录
-- 注意：这会永久删除数据，请先备份

-- 步骤1: 删除Adobe Express、Firefly的错误公司记录
-- 它们应该作为Adobe的项目，而不是独立公司
DELETE FROM companies 
WHERE name IN ('Adobe Express', 'Express', 'Adobe Firefly', 'Firefly')
  AND id NOT IN (SELECT id FROM companies WHERE name = 'Adobe');

-- 步骤2: 删除v0的错误公司记录  
-- v0应该作为Vercel的项目，而不是独立公司
DELETE FROM companies 
WHERE (name = 'v0' OR name LIKE '%v0%')
  AND id NOT IN (SELECT id FROM companies WHERE name = 'Vercel');

-- 步骤3: 显示删除结果
SELECT '剩余的公司' as info, id::text, name FROM companies 
WHERE name IN ('Adobe', 'Vercel', 'Adobe Express', 'Adobe Firefly', 'Firefly', 'Express', 'v0')
ORDER BY name;
