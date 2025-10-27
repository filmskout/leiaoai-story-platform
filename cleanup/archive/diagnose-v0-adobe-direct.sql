-- 直接诊断和修复Adobe、v0的问题
-- 不需要DO块，直接操作

-- 1. 看看数据库中实际有什么
SELECT '=== 当前所有Adobe和v0相关的公司 ===' as info;
SELECT id, name, category, website, created_at 
FROM companies 
WHERE name LIKE '%Adobe%' OR name LIKE '%Firefly%' OR name LIKE '%Express%' OR name = 'v0' OR name LIKE '%v0%'
ORDER BY name;

SELECT '=== 当前所有Adobe和v0相关的项目 ===' as info;
SELECT p.id, p.name, c.name as parent_company
FROM projects p
LEFT JOIN companies c ON p.company_id = c.id
WHERE p.name LIKE '%Adobe%' OR p.name LIKE '%Firefly%' OR p.name LIKE '%Express%' OR p.name = 'v0'
ORDER BY p.name;

-- 2. 手动修复 - Adobe Express
-- 假设需要将某个错误的公司ID转换为Adobe的项目
-- 首先显示需要修复的记录
SELECT '=== 需要修复的Express/Firefly公司 ===' as info;
SELECT id, name FROM companies 
WHERE name IN ('Adobe Express', 'Express', 'Adobe Firefly', 'Firefly')
AND id NOT IN (SELECT id FROM companies WHERE name = 'Adobe');

-- 3. 手动修复 - v0
SELECT '=== 需要修复的v0公司 ===' as info;
SELECT id, name FROM companies 
WHERE (name = 'v0' OR name LIKE '%v0%')
AND id NOT IN (SELECT id FROM companies WHERE name = 'Vercel');
