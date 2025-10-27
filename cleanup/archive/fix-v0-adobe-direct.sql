-- 一键诊断和修复Adobe、v0项目
-- 不依赖复杂的PL/SQL逻辑

-- ========================================
-- 第一部分: 诊断
-- ========================================

-- 查看所有相关公司
SELECT '=== 所有相关公司 ===' as section;
SELECT id::text, name, category FROM companies 
WHERE name IN ('Adobe', 'Vercel', 'Adobe Express', 'Adobe Firefly', 'Express', 'Firefly', 'v0', 'v0 by Vercel')
ORDER BY name;

-- 查看所有相关项目
SELECT '=== 所有相关项目 ===' as section;
SELECT p.id::text, p.name, c.name as parent_company 
FROM projects p
LEFT JOIN companies c ON p.company_id = c.id
WHERE p.name IN ('Adobe Express', 'Adobe Firefly', 'v0')
ORDER BY c.name, p.name;

-- ========================================
-- 第二部分: 修复
-- ========================================

-- 1. 为Adobe创建Express项目（如果不存在）
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Adobe Express',
  'Adobe Express是一款面向社交媒体和营销内容的在线创作工具，提供模板、设计工具和素材库。',
  'https://www.adobe.com/products/express.html',
  'AI Application'
FROM companies c
WHERE c.name = 'Adobe'
  AND NOT EXISTS (
    SELECT 1 FROM projects 
    WHERE company_id = c.id AND name = 'Adobe Express'
  );

-- 2. 为Adobe创建Firefly项目（如果不存在）
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Adobe Firefly',
  'Adobe Firefly是Adobe的生成式AI图像工具，支持文本生成图像、图像编辑和创意扩展。',
  'https://www.adobe.com/firefly',
  'AI Model'
FROM companies c
WHERE c.name = 'Adobe'
  AND NOT EXISTS (
    SELECT 1 FROM projects 
    WHERE company_id = c.id AND name = 'Adobe Firefly'
  );

-- 3. 为Vercel创建v0项目（如果不存在）
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'v0',
  'v0是Vercel的AI代码生成工具，可以根据文本描述生成React组件代码，支持实时预览和编辑。',
  'https://v0.dev',
  'AI Tool'
FROM companies c
WHERE c.name = 'Vercel'
  AND NOT EXISTS (
    SELECT 1 FROM projects 
    WHERE company_id = c.id AND name = 'v0'
  );

-- ========================================
-- 第三部分: 显示结果
-- ========================================

SELECT '=== 修复后的Adobe项目 ===' as section;
SELECT p.name as project, p.category, p.website
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Adobe'
ORDER BY p.name;

SELECT '=== 修复后的Vercel项目 ===' as section;
SELECT p.name as project, p.category, p.website
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Vercel'
ORDER BY p.name;

-- ========================================
-- 第四部分: 检查是否还有错误的公司记录
-- ========================================

SELECT '=== 残留的错误公司（需要删除） ===' as section;
SELECT id::text, name FROM companies 
WHERE name IN ('Adobe Express', 'Express', 'Adobe Firefly', 'Firefly')
AND id NOT IN (SELECT id FROM companies WHERE name = 'Adobe')
UNION ALL
SELECT id::text, name FROM companies 
WHERE (name = 'v0' OR name LIKE '%v0%')
AND id NOT IN (SELECT id FROM companies WHERE name = 'Vercel');
