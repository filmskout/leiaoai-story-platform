-- 完整修复：Logo + 公司-项目关系
-- 一次性解决所有问题

-- ========================================
-- 第一部分: 修复所有Logo
-- ========================================

-- 1. Adobe
UPDATE companies SET logo_url = 'https://logo.clearbit.com/adobe.com', logo_storage_url = 'https://logo.clearbit.com/adobe.com', logo_updated_at = NOW() WHERE name = 'Adobe';

-- 2. Vercel
UPDATE companies SET logo_url = 'https://logo.clearbit.com/vercel.com', logo_storage_url = 'https://logo.clearbit.com/vercel.com', logo_updated_at = NOW() WHERE name = 'Vercel';

-- 3. Codeium
UPDATE companies SET logo_url = 'https://logo.clearbit.com/codeium.com', logo_storage_url = 'https://logo.clearbit.com/codeium.com', logo_updated_at = NOW() WHERE name = 'Codeium';

-- 4. DeepSeek
UPDATE companies SET logo_url = 'https://logo.clearbit.com/deepseek.com', logo_storage_url = 'https://logo.clearbit.com/deepseek.com', logo_updated_at = NOW() WHERE name = 'DeepSeek';

-- 5. Lovable
UPDATE companies SET logo_url = 'https://logo.clearbit.com/lovable.dev', logo_storage_url = 'https://logo.clearbit.com/lovable.dev', logo_updated_at = NOW() WHERE name = 'Lovable';

-- 6. Manus
UPDATE companies SET logo_url = 'https://logo.clearbit.com/manus.io', logo_storage_url = 'https://logo.clearbit.com/manus.io', logo_updated_at = NOW() WHERE name = 'Manus';

-- 7. Stability AI
UPDATE companies SET logo_url = 'https://logo.clearbit.com/stability.ai', logo_storage_url = 'https://logo.clearbit.com/stability.ai', logo_updated_at = NOW() WHERE name = 'Stability AI';

-- ========================================
-- 第二部分: 修复公司-项目关系
-- ========================================

DO $$
DECLARE
  adobe_id INTEGER;
  vercel_id INTEGER;
  wrong_company_id INTEGER;
BEGIN
  -- 获取父公司ID
  SELECT id INTO adobe_id FROM companies WHERE name = 'Adobe' LIMIT 1;
  SELECT id INTO vercel_id FROM companies WHERE name = 'Vercel' LIMIT 1;
  
  -- 修复Adobe Express, Firefly
  IF adobe_id IS NOT NULL THEN
    FOR wrong_company_id IN 
      SELECT id FROM companies WHERE name IN ('Adobe Express', 'Express', 'Adobe Firefly', 'Firefly')
    LOOP
      -- 转移为project（如果没有重复）
      INSERT INTO projects (company_id, name, description, website, category)
      SELECT adobe_id, name, description, website, category
      FROM companies
      WHERE id = wrong_company_id
      ON CONFLICT DO NOTHING;
      
      -- 删除错误的公司记录
      DELETE FROM companies WHERE id = wrong_company_id;
    END LOOP;
  END IF;
  
  -- 修复v0
  IF vercel_id IS NOT NULL THEN
    FOR wrong_company_id IN 
      SELECT id FROM companies WHERE name IN ('v0', 'v0 by Vercel')
    LOOP
      INSERT INTO projects (company_id, name, description, website, category)
      SELECT vercel_id, name, description, website, category
      FROM companies
      WHERE id = wrong_company_id
      ON CONFLICT DO NOTHING;
      
      DELETE FROM companies WHERE id = wrong_company_id;
    END LOOP;
  END IF;
END $$;

-- ========================================
-- 第三部分: 显示结果
-- ========================================

-- Logo状态
SELECT 'Logo状态:' as section, name, logo_url 
FROM companies 
WHERE name IN ('Adobe', 'Vercel', 'Codeium', 'DeepSeek', 'Lovable', 'Manus', 'Stability AI', 'OpenAI', 'Anthropic')
ORDER BY name;

-- 公司-项目关系
SELECT 'Adobe的项目:' as section, p.name as project, p.category
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Adobe'
ORDER BY p.name;

SELECT 'Vercel的项目:' as section, p.name as project, p.category
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Vercel'
ORDER BY p.name;
