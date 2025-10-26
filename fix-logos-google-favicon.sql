-- 测试不同logo来源并更新

-- 首先清空这些公司的logo（用于测试）
-- UPDATE companies SET logo_url = NULL, logo_storage_url = NULL WHERE name IN ('Adobe', 'Vercel', 'Codeium', 'DeepSeek', 'Lovable', 'Manus', 'Stability AI');

-- 然后尝试多种logo来源

-- 方案1: Google Favicon API (最可靠)
UPDATE companies SET 
  logo_url = 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128',
  logo_storage_url = 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128',
  logo_updated_at = NOW()
WHERE name = 'Adobe';

UPDATE companies SET 
  logo_url = 'https://www.google.com/s2/favicons?domain=vercel.com&sz=128',
  logo_storage_url = 'https://www.google.com/s2/favicons?domain=vercel.com&sz=128',
  logo_updated_at = NOW()
WHERE name = 'Vercel';

UPDATE companies SET 
  logo_url = 'https://www.google.com/s2/favicons?domain=codeium.com&sz=128',
  logo_storage_url = 'https://www.google.com/s2/favicons?domain=codeium.com&sz=128',
  logo_updated_at = NOW()
WHERE name = 'Codeium';

UPDATE companies SET 
  logo_url = 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=128',
  logo_storage_url = 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=128',
  logo_updated_at = NOW()
WHERE name = 'DeepSeek';

UPDATE companies SET 
  logo_url = 'https://www.google.com/s2/favicons?domain=lovable.dev&sz=128',
  logo_storage_url = 'https://www.google.com/s2/favicons?domain=lovable.dev&sz=128',
  logo_updated_at = NOW()
WHERE name = 'Lovable';

UPDATE companies SET 
  logo_url = 'https://www.google.com/s2/favicons?domain=manus.io&sz=128',
  logo_storage_url = 'https://www.google.com/s2/favicons?domain=manus.io&sz=128',
  logo_updated_at = NOW()
WHERE name = 'Manus';

UPDATE companies SET 
  logo_url = 'https://www.google.com/s2/favicons?domain=stability.ai&sz=128',
  logo_storage_url = 'https://www.google.com/s2/favicons?domain=stability.ai&sz=128',
  logo_updated_at = NOW()
WHERE name = 'Stability AI';

-- 显示结果
SELECT name, logo_url, logo_storage_url FROM companies 
WHERE name IN ('Adobe', 'Vercel', 'Codeium', 'DeepSeek', 'Lovable', 'Manus', 'Stability AI')
ORDER BY name;
