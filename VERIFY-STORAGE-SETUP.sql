-- 验证Storage Buckets设置

-- 1. 查看所有Storage buckets
SELECT 
  id,
  name as bucket_name,
  public as is_public,
  created_at
FROM storage.buckets
ORDER BY name;

-- 预期结果：应该看到 bmc-images (public=true) 和 bp-documents (public=false)

-- 2. 查看bmc-images bucket详情
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name = 'bmc-images';

-- 预期：public=true, file_size_limit=10485760 (10MB)

-- 3. 查看bp-documents bucket详情
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name = 'bp-documents';

-- 预期：public=false, file_size_limit=52428800 (50MB)

-- 4. 测试查询storage.objects表（检查结构是否正常）
SELECT 
  COUNT(*) as total_files,
  bucket_id,
  COUNT(DISTINCT owner) as unique_owners
FROM storage.objects
GROUP BY bucket_id;

-- 如果没有上传过文件，这个查询会返回空结果，这是正常的

-- 5. 检查RLS是否启用在storage.objects表
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'storage'
  AND tablename = 'objects';

-- 预期：rls_enabled = true

