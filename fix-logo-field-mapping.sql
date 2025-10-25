-- 修复Logo字段映射问题
-- 在Supabase SQL Editor中执行

-- 将logo_storage_url的值复制到logo_url字段，确保前端能正确显示
UPDATE companies SET 
  logo_url = logo_storage_url
WHERE logo_storage_url IS NOT NULL AND logo_url IS NULL;

-- 完成
SELECT 'Logo字段映射修复完成！' as status;
