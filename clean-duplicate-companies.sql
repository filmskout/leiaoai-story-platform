-- 清理重复公司数据的SQL脚本
-- 在Supabase SQL Editor中执行

-- 1. 删除重复公司（保留最早创建的记录）
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

-- 2. 检查清理结果
SELECT 
  name, 
  COUNT(*) as count
FROM companies 
GROUP BY name 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 3. 统计清理后的数据
SELECT 
  COUNT(*) as total_companies,
  COUNT(logo_storage_url) as storage_logos,
  COUNT(logo_url) as url_logos,
  COUNT(logo_base64) as base64_logos
FROM companies;

-- 完成
SELECT '重复公司清理完成！' as status;
