-- 检查Adobe和Vercel的logo数据
SELECT '=== 检查logo字段 ===' as info, 
  name, 
  logo_url, 
  logo_storage_url, 
  logo_base64 IS NOT NULL as has_base64,
  logo_updated_at
FROM companies
WHERE name IN ('Adobe', 'Vercel')
ORDER BY name;

-- 测试更新logo（使用Google Favicon）
UPDATE companies 
SET logo_url = 'https://www.google.com/s2/favicons?domain=adobe.com&sz=256',
    logo_storage_url = 'https://www.google.com/s2/favicons?domain=adobe.com&sz=256',
    logo_updated_at = NOW()
WHERE name = 'Adobe';

UPDATE companies 
SET logo_url = 'https://www.google.com/s2/favicons?domain=vercel.com&sz=256',
    logo_storage_url = 'https://www.google.com/s2/favicons?domain=vercel.com&sz=256',
    logo_updated_at = NOW()
WHERE name = 'Vercel';

-- 再次检查
SELECT '=== 更新后的logo字段 ===' as info, 
  name, 
  logo_url, 
  logo_storage_url
FROM companies
WHERE name IN ('Adobe', 'Vercel')
ORDER BY name;
