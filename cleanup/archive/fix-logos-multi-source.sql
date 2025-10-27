-- 使用多种来源修复Logo
-- 包括Clearbit备用域名和其他logo服务

-- 1. 修复Adobe Logo (尝试多种来源)
UPDATE companies 
SET logo_url = 'https://cdn.brandfetch.io/idEOGDWuFc/logo/light/adobe',
    logo_storage_url = 'https://cdn.brandfetch.io/idEOGDWuFc/logo/light/adobe',
    logo_updated_at = NOW()
WHERE name = 'Adobe' AND (logo_url IS NULL OR logo_url = '');

-- 如果上面的失败，尝试Unavatar
UPDATE companies 
SET logo_url = 'https://unavatar.io/adobe.com',
    logo_storage_url = 'https://unavatar.io/adobe.com',
    logo_updated_at = NOW()
WHERE name = 'Adobe' AND (logo_url IS NULL OR logo_url = '');

-- 2. 修复Vercel Logo
UPDATE companies 
SET logo_url = 'https://cdn.brandfetch.io/id0qRZ0vR6/logo/light/vercel',
    logo_storage_url = 'https://cdn.brandfetch.io/id0qRZ0vR6/logo/light/vercel',
    logo_updated_at = NOW()
WHERE name = 'Vercel' AND (logo_url IS NULL OR logo_url = '');

UPDATE companies 
SET logo_url = 'https://unavatar.io/vercel.com',
    logo_storage_url = 'https://unavatar.io/vercel.com',
    logo_updated_at = NOW()
WHERE name = 'Vercel' AND (logo_url IS NULL OR logo_url = '');

-- 3. 修复Codeium Logo
UPDATE companies 
SET logo_url = 'https://unavatar.io/codeium.com',
    logo_storage_url = 'https://unavatar.io/codeium.com',
    logo_updated_at = NOW()
WHERE name = 'Codeium';

-- 4. 修复DeepSeek Logo
UPDATE companies 
SET logo_url = 'https://logo.clearbit.com/deepseek.com',
    logo_storage_url = 'https://logo.clearbit.com/deepseek.com',
    logo_updated_at = NOW()
WHERE name = 'DeepSeek';

-- 尝试备用域名
UPDATE companies 
SET logo_url = 'https://unavatar.io/deepseek.com',
    logo_storage_url = 'https://unavatar.io/deepseek.com',
    logo_updated_at = NOW()
WHERE name = 'DeepSeek' AND (logo_url IS NULL OR logo_url LIKE '%deepseek%' = false);

-- 5. 修复Lovable Logo
UPDATE companies 
SET logo_url = 'https://unavatar.io/lovable.dev',
    logo_storage_url = 'https://unavatar.io/lovable.dev',
    logo_updated_at = NOW()
WHERE name = 'Lovable';

-- 6. 修复Manus Logo
UPDATE companies 
SET logo_url = 'https://unavatar.io/manus.io',
    logo_storage_url = 'https://unavatar.io/manus.io',
    logo_updated_at = NOW()
WHERE name = 'Manus';

-- 7. 修复Stability AI Logo
UPDATE companies 
SET logo_url = 'https://unavatar.io/stability.ai',
    logo_storage_url = 'https://unavatar.io/stability.ai',
    logo_updated_at = NOW()
WHERE name = 'Stability AI';

-- 8. Anthropic和OpenAI保持现有的
-- (这两个已经配置成功，不需要更新)

-- 显示所有公司的Logo状态
SELECT name, logo_url, logo_storage_url 
FROM companies 
WHERE name IN ('Adobe', 'Vercel', 'Anthropic', 'Codeium', 'DeepSeek', 'Lovable', 'Manus', 'OpenAI', 'Stability AI')
ORDER BY name;
