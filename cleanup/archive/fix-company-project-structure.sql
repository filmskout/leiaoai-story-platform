-- 修复公司和项目的数据结构
-- 将错误的公司转换为正确的项目，并合并到母公司

BEGIN;

-- 1. 确保Adobe公司存在
INSERT INTO companies (
  id,
  name,
  description,
  english_description,
  headquarters,
  valuation,
  website,
  category,
  is_overseas,
  founded_year,
  employee_count,
  industry
) VALUES (
  gen_random_uuid(),
  'Adobe',
  'Adobe是全球领先的数字媒体和营销解决方案提供商，提供创作软件、数字体验软件和企业解决方案。',
  'Adobe is a leading global provider of digital media and marketing solutions, offering creative software, digital experience software and enterprise solutions.',
  'San Jose, California, USA',
  200000000000,
  'https://www.adobe.com',
  'techGiants',
  true,
  1982,
  '28000+',
  'Software'
) ON CONFLICT (name) DO NOTHING;

-- 2. 将Adobe Express项目关联到Adobe公司
DO $$
DECLARE
  adobe_company_id UUID;
  express_project_id UUID;
BEGIN
  -- 获取Adobe公司的ID
  SELECT id INTO adobe_company_id FROM companies WHERE name = 'Adobe' LIMIT 1;
  
  -- 获取Adobe Express项目的ID
  SELECT id INTO express_project_id FROM companies WHERE name = 'Adobe Express' LIMIT 1;
  
  IF adobe_company_id IS NOT NULL AND express_project_id IS NOT NULL THEN
    -- 如果有projects表，插入项目
    INSERT INTO projects (company_id, name, description, website)
    SELECT adobe_company_id, name, description, website
    FROM companies
    WHERE name = 'Adobe Express';
    
    -- 迁移相关数据
    UPDATE fundings SET company_id = adobe_company_id WHERE company_id = express_project_id;
    UPDATE stories SET company_id = adobe_company_id WHERE company_id = express_project_id;
    DELETE FROM companies WHERE id = express_project_id;
  END IF;
END $$;

-- 3. 将Adobe Firefly项目关联到Adobe公司
DO $$
DECLARE
  adobe_company_id UUID;
  firefly_project_id UUID;
BEGIN
  SELECT id INTO adobe_company_id FROM companies WHERE name = 'Adobe' LIMIT 1;
  SELECT id INTO firefly_project_id FROM companies WHERE name = 'Adobe Firefly' LIMIT 1;
  
  IF adobe_company_id IS NOT NULL AND firefly_project_id IS NOT NULL THEN
    INSERT INTO projects (company_id, name, description, website)
    SELECT adobe_company_id, name, description, website
    FROM companies
    WHERE name = 'Adobe Firefly';
    
    UPDATE fundings SET company_id = adobe_company_id WHERE company_id = firefly_project_id;
    UPDATE stories SET company_id = adobe_company_id WHERE company_id = firefly_project_id;
    DELETE FROM companies WHERE id = firefly_project_id;
  END IF;
END $$;

-- 4. 修复v0 by Vercel
DO $$
DECLARE
  vercel_company_id UUID;
  v0_company_id UUID;
BEGIN
  SELECT id INTO vercel_company_id FROM companies WHERE name = 'Vercel' LIMIT 1;
  
  -- 如果没有Vercel公司，创建一个
  IF vercel_company_id IS NULL THEN
    INSERT INTO companies (id, name, description, english_description, headquarters, valuation, website, category, is_overseas, founded_year, employee_count, industry)
    VALUES (
      gen_random_uuid(),
      'Vercel',
      'Vercel是前端云平台提供商，提供构建和部署现代Web应用的工具和服务。',
      'Vercel is a frontend cloud platform that provides tools and services for building and deploying modern web applications.',
      'San Francisco, California, USA',
      3000000000,
      'https://vercel.com',
      'techGiants',
      true,
      2015,
      '500+',
      'Software'
    ) RETURNING id INTO vercel_company_id;
  END IF;
  
  SELECT id INTO v0_company_id FROM companies WHERE name LIKE '%v0%' OR name LIKE 'V0%' LIMIT 1;
  
  IF v0_company_id IS NOT NULL THEN
    INSERT INTO projects (company_id, name, description, website)
    SELECT vercel_company_id, name, description, website
    FROM companies
    WHERE id = v0_company_id;
    
    UPDATE fundings SET company_id = vercel_company_id WHERE company_id = v0_company_id;
    UPDATE stories SET company_id = vercel_company_id WHERE company_id = v0_company_id;
    DELETE FROM companies WHERE id = v0_company_id;
  END IF;
END $$;

-- 5. 添加Adobe和Vercel的Logo（使用Clearbit）
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/adobe.com',
    logo_storage_url = 'https://logo.clearbit.com/adobe.com',
    logo_updated_at = NOW()
WHERE name = 'Adobe';

UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/vercel.com',
    logo_storage_url = 'https://logo.clearbit.com/vercel.com',
    logo_updated_at = NOW()
WHERE name = 'Vercel';

-- 6. 补齐其他失效Logo
UPDATE companies 
SET logo_url = CASE
  WHEN name = 'Anthropic' THEN 'https://logo.clearbit.com/anthropic.com'
  WHEN name = 'Codeium' THEN 'https://logo.clearbit.com/codeium.com'
  WHEN name = 'DeepSeek' THEN 'https://logo.clearbit.com/deepseek.com'
  WHEN name = 'Lovable' THEN 'https://logo.clearbit.com/lovable.dev'
  WHEN name = 'Manus' THEN 'https://logo.clearbit.com/manus.com'
  WHEN name = 'OpenAI' THEN 'https://logo.clearbit.com/openai.com'
  WHEN name = 'Stability AI' THEN 'https://logo.clearbit.com/stability.ai'
END,
logo_storage_url = CASE
  WHEN name = 'Anthropic' THEN 'https://logo.clearbit.com/anthropic.com'
  WHEN name = 'Codeium' THEN 'https://logo.clearbit.com/codeium.com'
  WHEN name = 'DeepSeek' THEN 'https://logo.clearbit.com/deepseek.com'
  WHEN name = 'Lovable' THEN 'https://logo.clearbit.com/lovable.dev'
  WHEN name = 'Manus' THEN 'https://logo.clearbit.com/manus.com'
  WHEN name = 'OpenAI' THEN 'https://logo.clearbit.com/openai.com'
  WHEN name = 'Stability AI' THEN 'https://logo.clearbit.com/stability.ai'
END,
logo_updated_at = NOW()
WHERE name IN ('Anthropic', 'Codeium', 'DeepSeek', 'Lovable', 'Manus', 'OpenAI', 'Stability AI');

COMMIT;
