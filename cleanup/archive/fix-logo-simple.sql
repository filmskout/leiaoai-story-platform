-- 简化的数据修复脚本
-- 将错误的"公司"转换为"项目"，并更新Logo

-- 1. 确保Adobe公司和Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/adobe.com',
    logo_storage_url = 'https://logo.clearbit.com/adobe.com',
    logo_updated_at = NOW()
WHERE name = 'Adobe';

-- 为Adobe创建Express和Firefly项目（如果还没有）
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Adobe Express',
  'Adobe Express是一款面向社交媒体和营销内容的在线创作工具，提供模板、设计工具和素材库。',
  'https://www.adobe.com/products/express.html',
  'AI Application'
FROM companies c
WHERE c.name = 'Adobe'
ON CONFLICT DO NOTHING;

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Adobe Firefly',
  'Adobe Firefly是Adobe的生成式AI图像工具，支持文本生成图像、图像编辑和创意扩展。',
  'https://www.adobe.com/firefly',
  'AI Model'
FROM companies c
WHERE c.name = 'Adobe'
ON CONFLICT DO NOTHING;

-- 2. 确保Vercel公司和Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/vercel.com',
    logo_storage_url = 'https://logo.clearbit.com/vercel.com',
    logo_updated_at = NOW()
WHERE name = 'Vercel';

-- 为Vercel创建v0项目（如果还没有）
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'v0',
  'v0是Vercel的AI代码生成工具，可以根据文本描述生成React组件代码，支持实时预览和编辑。',
  'https://v0.dev',
  'AI Tool'
FROM companies c
WHERE c.name = 'Vercel'
ON CONFLICT DO NOTHING;

-- 3. 补齐其他失效的Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/anthropic.com',
    logo_storage_url = 'https://logo.clearbit.com/anthropic.com',
    logo_updated_at = NOW()
WHERE name = 'Anthropic';

UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/codeium.com',
    logo_storage_url = 'https://logo.clearbit.com/codeium.com',
    logo_updated_at = NOW()
WHERE name = 'Codeium';

UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/deepseek.com',
    logo_storage_url = 'https://logo.clearbit.com/deepseek.com',
    logo_updated_at = NOW()
WHERE name = 'DeepSeek';

UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/lovable.dev',
    logo_storage_url = 'https://logo.clearbit.com/lovable.dev',
    logo_updated_at = NOW()
WHERE name = 'Lovable';

UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/manus.io',
    logo_storage_url = 'https://logo.clearbit.com/manus.io',
    logo_updated_at = NOW()
WHERE name = 'Manus';

UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/openai.com',
    logo_storage_url = 'https://logo.clearbit.com/openai.com',
    logo_updated_at = NOW()
WHERE name = 'OpenAI';

UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/stability.ai',
    logo_storage_url = 'https://logo.clearbit.com/stability.ai',
    logo_updated_at = NOW()
WHERE name = 'Stability AI';

-- 显示更新结果
SELECT name, logo_url, logo_storage_url 
FROM companies 
WHERE name IN ('Adobe', 'Vercel', 'Anthropic', 'Codeium', 'DeepSeek', 'Lovable', 'Manus', 'OpenAI', 'Stability AI')
ORDER BY name;
