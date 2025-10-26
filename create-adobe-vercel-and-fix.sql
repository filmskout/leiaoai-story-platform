-- 创建Adobe和Vercel公司，并修复项目关系

-- 步骤1: 创建Adobe公司（如果不存在）
INSERT INTO companies (name, description, website, category, is_overseas, founded_year)
SELECT 
  'Adobe',
  'Adobe是全球领先的数字媒体和营销解决方案提供商，提供创作软件、数字体验软件和企业解决方案。',
  'https://www.adobe.com',
  'Tech Giants',
  true,
  1982
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Adobe');

-- 步骤2: 创建Vercel公司（如果不存在）
INSERT INTO companies (name, description, website, category, is_overseas, founded_year)
SELECT 
  'Vercel',
  'Vercel是前端云平台提供商，提供构建和部署现代Web应用的工具和服务。',
  'https://vercel.com',
  'AI Tools',
  true,
  2015
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Vercel');

-- 步骤3: 检查Adobe Express和Firefly是否已经作为错误公司存在
-- 如果有，需要迁移它们的数据
SELECT '=== 需要迁移的公司 ===' as info, id::text, name, description, website
FROM companies
WHERE name IN ('Adobe Express', 'Express', 'Adobe Firefly', 'Firefly')
AND NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Adobe');

-- 步骤4: 如果是"Adobe Express"作为公司存在，创建为Adobe的项目
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  adobe.id,
  'Adobe Express',
  COALESCE(express.description, 'Adobe Express是一款面向社交媒体和营销内容的在线创作工具'),
  COALESCE(express.website, 'https://www.adobe.com/products/express.html'),
  'AI Application'
FROM companies adobe, companies express
WHERE adobe.name = 'Adobe'
  AND express.name IN ('Adobe Express', 'Express')
  AND NOT EXISTS (
    SELECT 1 FROM projects 
    WHERE company_id = adobe.id AND name = 'Adobe Express'
  );

-- 步骤5: 如果是"Adobe Firefly"作为公司存在，创建为Adobe的项目
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  adobe.id,
  'Adobe Firefly',
  COALESCE(firefly.description, 'Adobe Firefly是Adobe的生成式AI图像工具'),
  COALESCE(firefly.website, 'https://www.adobe.com/firefly'),
  'AI Model'
FROM companies adobe, companies firefly
WHERE adobe.name = 'Adobe'
  AND firefly.name IN ('Adobe Firefly', 'Firefly')
  AND NOT EXISTS (
    SELECT 1 FROM projects 
    WHERE company_id = adobe.id AND name = 'Adobe Firefly'
  );

-- 步骤6: 检查v0是否已经作为错误公司存在
SELECT '=== 需要迁移的v0公司 ===' as info, id::text, name, description, website
FROM companies
WHERE (name = 'v0' OR name LIKE '%v0%')
AND NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Vercel');

-- 步骤7: 如果是"v0"作为公司存在，创建为Vercel的项目
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  vercel.id,
  'v0',
  COALESCE(v0.description, 'v0是Vercel的AI代码生成工具'),
  COALESCE(v0.website, 'https://v0.dev'),
  'AI Tool'
FROM companies vercel, companies v0
WHERE vercel.name = 'Vercel'
  AND (v0.name = 'v0' OR v0.name LIKE '%v0%')
  AND NOT EXISTS (
    SELECT 1 FROM projects 
    WHERE company_id = vercel.id AND name = 'v0'
  );

-- 步骤8: 显示创建结果
SELECT '=== 创建的公司 ===' as info, name, description
FROM companies
WHERE name IN ('Adobe', 'Vercel')
ORDER BY name;

SELECT '=== Adobe的项目 ===' as info, p.name, p.description
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Adobe'
ORDER BY p.name;

SELECT '=== Vercel的项目 ===' as info, p.name, p.description
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Vercel'
ORDER BY p.name;
