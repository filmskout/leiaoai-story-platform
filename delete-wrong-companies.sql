-- 删除错误的公司记录
-- 注意：这会永久删除数据，请先备份

-- 步骤0: 先检查Adobe和Vercel是否存在
SELECT '=== Adobe和Vercel是否已存在 ===' as info, name
FROM companies
WHERE name IN ('Adobe', 'Vercel');

-- 步骤1: 删除Adobe Express、Firefly的错误公司记录
-- 它们应该作为Adobe的项目，而不是独立公司
-- 只有在Adobe和Vercel存在时才执行
WITH adobe_exists AS (
  SELECT EXISTS(SELECT 1 FROM companies WHERE name = 'Adobe') as exists_adobe
),
vercel_exists AS (
  SELECT EXISTS(SELECT 1 FROM companies WHERE name = 'Vercel') as exists_vercel
)
DELETE FROM companies 
WHERE (
  (name IN ('Adobe Express', 'Express', 'Adobe Firefly', 'Firefly') AND (SELECT exists_adobe FROM adobe_exists))
  OR
  ((name = 'v0' OR name LIKE '%v0%') AND (SELECT exists_vercel FROM vercel_exists))
);

-- 步骤2: 显示删除结果
SELECT '剩余的公司' as info, id::text, name FROM companies 
WHERE name IN ('Adobe', 'Vercel', 'Adobe Express', 'Adobe Firefly', 'Firefly', 'Express', 'v0')
ORDER BY name;
