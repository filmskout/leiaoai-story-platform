-- 检查重复公司和缺失logo的SQL脚本
-- 在Supabase SQL Editor中执行

-- 1. 检查重复公司
SELECT 
  name, 
  COUNT(*) as count,
  STRING_AGG(id::text, ', ') as ids
FROM companies 
GROUP BY name 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 2. 检查logo配置情况
SELECT 
  COUNT(*) as total_companies,
  COUNT(logo_storage_url) as storage_logos,
  COUNT(logo_url) as url_logos,
  COUNT(logo_base64) as base64_logos,
  COUNT(CASE WHEN logo_storage_url IS NULL AND logo_url IS NULL AND logo_base64 IS NULL THEN 1 END) as missing_logos
FROM companies;

-- 3. 查看缺失logo的公司
SELECT 
  name, 
  logo_storage_url, 
  logo_url, 
  logo_base64,
  created_at
FROM companies 
WHERE logo_storage_url IS NULL 
  AND logo_url IS NULL 
  AND logo_base64 IS NULL
ORDER BY created_at DESC
LIMIT 20;

-- 4. 查看有logo的公司示例
SELECT 
  name, 
  logo_storage_url, 
  logo_url, 
  logo_base64
FROM companies 
WHERE logo_storage_url IS NOT NULL 
   OR logo_url IS NOT NULL 
   OR logo_base64 IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
