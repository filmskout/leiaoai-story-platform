-- 综合修复脚本：清理重复数据 + 添加logo
-- 在Supabase SQL Editor中执行

-- 步骤1: 检查当前状态
SELECT '=== 修复前状态 ===' as step;
SELECT 
  COUNT(*) as total_companies,
  COUNT(DISTINCT name) as unique_names,
  COUNT(logo_storage_url) as storage_logos,
  COUNT(logo_url) as url_logos,
  COUNT(logo_base64) as base64_logos
FROM companies;

-- 步骤2: 检查重复公司
SELECT '=== 重复公司检查 ===' as step;
SELECT 
  name, 
  COUNT(*) as count,
  STRING_AGG(id::text, ', ') as ids
FROM companies 
GROUP BY name 
HAVING COUNT(*) > 1
ORDER BY count DESC
LIMIT 10;

-- 步骤3: 删除重复公司（保留最早创建的记录）
WITH duplicates AS (
  SELECT 
    id,
    name,
    ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at ASC) as rn
  FROM companies
),
duplicate_ids AS (
  SELECT id FROM duplicates WHERE rn > 1
)
DELETE FROM companies 
WHERE id IN (SELECT id FROM duplicate_ids);

-- 步骤4: 为缺失logo的公司添加logo
UPDATE companies SET 
  logo_storage_url = CASE 
    -- 特殊处理一些知名公司
    WHEN name = 'OpenAI' THEN 'https://logo.clearbit.com/openai.com'
    WHEN name = 'Anthropic' THEN 'https://logo.clearbit.com/anthropic.com'
    WHEN name = 'Google' THEN 'https://logo.clearbit.com/google.com'
    WHEN name = 'Microsoft' THEN 'https://logo.clearbit.com/microsoft.com'
    WHEN name = 'Apple' THEN 'https://logo.clearbit.com/apple.com'
    WHEN name = 'Amazon' THEN 'https://logo.clearbit.com/amazon.com'
    WHEN name = 'Meta' THEN 'https://logo.clearbit.com/meta.com'
    WHEN name = 'Tesla' THEN 'https://logo.clearbit.com/tesla.com'
    WHEN name = 'NVIDIA' THEN 'https://logo.clearbit.com/nvidia.com'
    WHEN name = 'Intel' THEN 'https://logo.clearbit.com/intel.com'
    WHEN name = 'IBM' THEN 'https://logo.clearbit.com/ibm.com'
    WHEN name = 'Oracle' THEN 'https://logo.clearbit.com/oracle.com'
    WHEN name = 'Salesforce' THEN 'https://logo.clearbit.com/salesforce.com'
    -- 通用处理
    ELSE 'https://logo.clearbit.com/' || LOWER(REPLACE(REPLACE(REPLACE(name, ' ', ''), '.', ''), ' ', '')) || '.com'
  END
WHERE logo_storage_url IS NULL 
  AND logo_url IS NULL 
  AND logo_base64 IS NULL
  AND name IS NOT NULL;

-- 步骤5: 检查修复后状态
SELECT '=== 修复后状态 ===' as step;
SELECT 
  COUNT(*) as total_companies,
  COUNT(DISTINCT name) as unique_names,
  COUNT(logo_storage_url) as storage_logos,
  COUNT(logo_url) as url_logos,
  COUNT(logo_base64) as base64_logos,
  COUNT(CASE WHEN logo_storage_url IS NULL AND logo_url IS NULL AND logo_base64 IS NULL THEN 1 END) as still_missing_logos
FROM companies;

-- 步骤6: 检查是否还有重复
SELECT '=== 重复检查 ===' as step;
SELECT 
  name, 
  COUNT(*) as count
FROM companies 
GROUP BY name 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 完成
SELECT '=== 修复完成 ===' as step;
