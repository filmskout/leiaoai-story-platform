-- 为所有缺失logo的公司添加通用logo的SQL脚本
-- 在Supabase SQL Editor中执行

-- 为缺失logo的公司添加通用logo URL
UPDATE companies SET 
  logo_storage_url = 'https://logo.clearbit.com/' || LOWER(REPLACE(REPLACE(REPLACE(name, ' ', ''), '.', ''), ' ', '')) || '.com'
WHERE logo_storage_url IS NULL 
  AND logo_url IS NULL 
  AND logo_base64 IS NULL
  AND name IS NOT NULL;

-- 如果上面的通用方法失败，使用备用方法
UPDATE companies SET 
  logo_storage_url = 'https://logo.clearbit.com/' || LOWER(REPLACE(name, ' ', '')) || '.com'
WHERE logo_storage_url IS NULL 
  AND logo_url IS NULL 
  AND logo_base64 IS NULL
  AND name IS NOT NULL;

-- 检查结果
SELECT 
  COUNT(*) as total_companies,
  COUNT(logo_storage_url) as storage_logos,
  COUNT(logo_url) as url_logos,
  COUNT(logo_base64) as base64_logos,
  COUNT(CASE WHEN logo_storage_url IS NULL AND logo_url IS NULL AND logo_base64 IS NULL THEN 1 END) as still_missing_logos
FROM companies;

-- 完成
SELECT '通用logo补充完成！' as status;
