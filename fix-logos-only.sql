-- 简单的Logo修复脚本（仅更新logo字段）

-- 1. 修复Adobe Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/adobe.com',
    logo_storage_url = 'https://logo.clearbit.com/adobe.com',
    logo_updated_at = NOW()
WHERE name = 'Adobe';

-- 2. 修复Vercel Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/vercel.com',
    logo_storage_url = 'https://logo.clearbit.com/vercel.com',
    logo_updated_at = NOW()
WHERE name = 'Vercel';

-- 3. 修复Anthropic Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/anthropic.com',
    logo_storage_url = 'https://logo.clearbit.com/anthropic.com',
    logo_updated_at = NOW()
WHERE name = 'Anthropic';

-- 4. 修复Codeium Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/codeium.com',
    logo_storage_url = 'https://logo.clearbit.com/codeium.com',
    logo_updated_at = NOW()
WHERE name = 'Codeium';

-- 5. 修复DeepSeek Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/deepseek.com',
    logo_storage_url = 'https://logo.clearbit.com/deepseek.com',
    logo_updated_at = NOW()
WHERE name = 'DeepSeek';

-- 6. 修复Lovable Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/lovable.dev',
    logo_storage_url = 'https://logo.clearbit.com/lovable.dev',
    logo_updated_at = NOW()
WHERE name = 'Lovable';

-- 7. 修复Manus Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/manus.io',
    logo_storage_url = 'https://logo.clearbit.com/manus.io',
    logo_updated_at = NOW()
WHERE name = 'Manus';

-- 8. 修复OpenAI Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/openai.com',
    logo_storage_url = 'https://logo.clearbit.com/openai.com',
    logo_updated_at = NOW()
WHERE name = 'OpenAI';

-- 9. 修复Stability AI Logo
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
