-- 为Adobe和Vercel添加Logo，并创建项目

-- 步骤1: 为Adobe添加Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/adobe.com',
    logo_storage_url = 'https://logo.clearbit.com/adobe.com',
    logo_updated_at = NOW()
WHERE name = 'Adobe';

-- 步骤2: 为Vercel添加Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/vercel.com',
    logo_storage_url = 'https://logo.clearbit.com/vercel.com',
    logo_updated_at = NOW()
WHERE name = 'Vercel';

-- 步骤3: 为Adobe创建Express项目
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
    SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Adobe Express'
  );

-- 步骤4: 为Adobe创建Firefly项目
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
    SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Adobe Firefly'
  );

-- 步骤5: 为Vercel创建v0项目
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
    SELECT 1 FROM projects WHERE company_id = c.id AND name = 'v0'
  );

-- 步骤6: 显示结果
SELECT '=== 公司Logo ===' as section, name, logo_url, logo_storage_url
FROM companies
WHERE name IN ('Adobe', 'Vercel')
ORDER BY name;

SELECT '=== Adobe的项目 ===' as section, p.name, p.category, p.website
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Adobe'
ORDER BY p.name;

SELECT '=== Vercel的项目 ===' as section, p.name, p.category, p.website
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Vercel'
ORDER BY p.name;
