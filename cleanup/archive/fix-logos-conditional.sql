-- 根据实际情况手动补齐Logo
-- Anthropic和OpenAI已经有logo，补齐其他的

-- 1. Adobe (尝试多种来源)
UPDATE companies 
SET logo_url = COALESCE(logo_url, 'https://unavatar.io/adobe.com'),
    logo_storage_url = COALESCE(logo_storage_url, 'https://unavatar.io/adobe.com'),
    logo_updated_at = CASE WHEN logo_updated_at IS NULL THEN NOW() ELSE logo_updated_at END
WHERE name = 'Adobe';

-- 2. Vercel (尝试多种来源)
UPDATE companies 
SET logo_url = COALESCE(logo_url, 'https://unavatar.io/vercel.com'),
    logo_storage_url = COALESCE(logo_storage_url, 'https://unavatar.io/vercel.com'),
    logo_updated_at = CASE WHEN logo_updated_at IS NULL THEN NOW() ELSE logo_updated_at END
WHERE name = 'Vercel';

-- 3. Codeium
UPDATE companies 
SET logo_url = COALESCE(logo_url, 'https://unavatar.io/codeium.com'),
    logo_storage_url = COALESCE(logo_storage_url, 'https://unavatar.io/codeium.com'),
    logo_updated_at = CASE WHEN logo_updated_at IS NULL THEN NOW() ELSE logo_updated_at END
WHERE name = 'Codeium';

-- 4. DeepSeek
UPDATE companies 
SET logo_url = COALESCE(logo_url, 'https://unavatar.io/deepseek.com'),
    logo_storage_url = COALESCE(logo_storage_url, 'https://unavatar.io/deepseek.com'),
    logo_updated_at = CASE WHEN logo_updated_at IS NULL THEN NOW() ELSE logo_updated_at END
WHERE name = 'DeepSeek';

-- 5. Lovable
UPDATE companies 
SET logo_url = COALESCE(logo_url, 'https://unavatar.io/lovable.dev'),
    logo_storage_url = COALESCE(logo_storage_url, 'https://unavatar.io/lovable.dev'),
    logo_updated_at = CASE WHEN logo_updated_at IS NULL THEN NOW() ELSE logo_updated_at END
WHERE name = 'Lovable';

-- 6. Manus
UPDATE companies 
SET logo_url = COALESCE(logo_url, 'https://unavatar.io/manus.io'),
    logo_storage_url = COALESCE(logo_storage_url, 'https://unavatar.io/manus.io'),
    logo_updated_at = CASE WHEN logo_updated_at IS NULL THEN NOW() ELSE logo_updated_at END
WHERE name = 'Manus';

-- 7. Stability AI
UPDATE companies 
SET logo_url = COALESCE(logo_url, 'https://unavatar.io/stability.ai'),
    logo_storage_url = COALESCE(logo_storage_url, 'https://unavatar.io/stability.ai'),
    logo_updated_at = CASE WHEN logo_updated_at IS NULL THEN NOW() ELSE logo_updated_at END
WHERE name = 'Stability AI';

-- 显示结果
SELECT name, logo_url, logo_storage_url, logo_updated_at
FROM companies 
WHERE name IN ('Adobe', 'Vercel', 'Anthropic', 'Codeium', 'DeepSeek', 'Lovable', 'Manus', 'OpenAI', 'Stability AI')
ORDER BY name;
