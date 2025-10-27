-- 完整的Logo修复和公司-项目关系优化脚本
-- 解决Unavatar的域名问题

-- 第一部分：修复Logo（使用备用域名格式）

-- 1. Adobe
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/adobe.com',
    logo_storage_url = 'https://logo.clearbit.com/adobe.com',
    logo_updated_at = NOW()
WHERE name = 'Adobe';

-- 2. Vercel
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/vercel.com',
    logo_storage_url = 'https://logo.clearbit.com/vercel.com',
    logo_updated_at = NOW()
WHERE name = 'Vercel';

-- 3. Codeium
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/codeium.com',
    logo_storage_url = 'https://logo.clearbit.com/codeium.com',
    logo_updated_at = NOW()
WHERE name = 'Codeium';

-- 4. DeepSeek
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/deepseek.com',
    logo_storage_url = 'https://logo.clearbit.com/deepseek.com',
    logo_updated_at = NOW()
WHERE name = 'DeepSeek';

-- 5. Lovable
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/lovable.dev',
    logo_storage_url = 'https://logo.clearbit.com/lovable.dev',
    logo_updated_at = NOW()
WHERE name = 'Lovable';

-- 6. Manus
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/manus.io',
    logo_storage_url = 'https://logo.clearbit.com/manus.io',
    logo_updated_at = NOW()
WHERE name = 'Manus';

-- 7. Stability AI
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/stability.ai',
    logo_storage_url = 'https://logo.clearbit.com/stability.ai',
    logo_updated_at = NOW()
WHERE name = 'Stability AI';

-- 第二部分：确保Adobe Express和Firefly是Adobe的项目
-- 先删除可能错误的记录
DELETE FROM projects 
WHERE name IN ('Adobe Express', 'Adobe Firefly') 
  AND company_id NOT IN (SELECT id FROM companies WHERE name = 'Adobe');

-- 然后确保正确的关联
DO $$
DECLARE
  adobe_company_id INTEGER;
  express_project_id INTEGER;
  firefly_project_id INTEGER;
BEGIN
  -- 获取Adobe公司的ID
  SELECT id INTO adobe_company_id FROM companies WHERE name = 'Adobe' LIMIT 1;
  
  IF adobe_company_id IS NOT NULL THEN
    -- 检查Adobe Express是否存在
    SELECT id INTO express_project_id FROM projects 
    WHERE name = 'Adobe Express' AND company_id = adobe_company_id;
    
    IF express_project_id IS NULL THEN
      -- 创建Adobe Express项目
      INSERT INTO projects (company_id, name, description, website, category)
      VALUES (
        adobe_company_id,
        'Adobe Express',
        'Adobe Express是一款面向社交媒体和营销内容的在线创作工具，提供模板、设计工具和素材库。',
        'https://www.adobe.com/products/express.html',
        'AI Application'
      );
    END IF;
    
    -- 检查Adobe Firefly是否存在
    SELECT id INTO firefly_project_id FROM projects 
    WHERE name = 'Adobe Firefly' AND company_id = adobe_company_id;
    
    IF firefly_project_id IS NULL THEN
      -- 创建Adobe Firefly项目
      INSERT INTO projects (company_id, name, description, website, category)
      VALUES (
        adobe_company_id,
        'Adobe Firefly',
        'Adobe Firefly是Adobe的生成式AI图像工具，支持文本生成图像、图像编辑和创意扩展。',
        'https://www.adobe.com/firefly',
        'AI Model'
      );
    END IF;
  END IF;
END $$;

-- 第三部分：确保v0是Vercel的项目
-- 先删除可能错误的记录
DELETE FROM projects 
WHERE name = 'v0' 
  AND company_id NOT IN (SELECT id FROM companies WHERE name = 'Vercel');

-- 然后确保正确的关联
DO $$
DECLARE
  vercel_company_id INTEGER;
  v0_project_id INTEGER;
BEGIN
  -- 获取Vercel公司的ID
  SELECT id INTO vercel_company_id FROM companies WHERE name = 'Vercel' LIMIT 1;
  
  IF vercel_company_id IS NOT NULL THEN
    -- 检查v0是否存在
    SELECT id INTO v0_project_id FROM projects 
    WHERE name = 'v0' AND company_id = vercel_company_id;
    
    IF v0_project_id IS NULL THEN
      -- 创建v0项目
      INSERT INTO projects (company_id, name, description, website, category)
      VALUES (
        vercel_company_id,
        'v0',
        'v0是Vercel的AI代码生成工具，可以根据文本描述生成React组件代码，支持实时预览和编辑。',
        'https://v0.dev',
        'AI Tool'
      );
    END IF;
  END IF;
END $$;

-- 显示修复结果
SELECT 'Logo修复结果:' as section, name, logo_url, logo_storage_url
FROM companies 
WHERE name IN ('Adobe', 'Vercel', 'Anthropic', 'Codeium', 'DeepSeek', 'Lovable', 'Manus', 'Stability AI', 'OpenAI')
ORDER BY name;

-- 显示公司-项目关系
SELECT '公司-项目关系:' as section, c.name as company, p.name as project
FROM companies c
JOIN projects p ON c.id = p.company_id
WHERE c.name IN ('Adobe', 'Vercel')
ORDER BY c.name, p.name;
