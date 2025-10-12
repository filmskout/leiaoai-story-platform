-- 检查BP相关的RLS策略
-- ==================================================

-- 1. 检查bp_submissions表的RLS状态
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '✅ RLS已启用' ELSE '❌ RLS未启用' END as rls_status
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'bp_submissions';

-- 2. 检查bp_submissions的所有policies
SELECT 
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'bp_submissions';

-- 3. 检查bp-documents bucket的存在
SELECT 
  id,
  name,
  public as is_public,
  file_size_limit / 1024 / 1024 as size_limit_mb
FROM storage.buckets
WHERE name = 'bp-documents';

-- ==================================================
-- 如果policies不存在或不正确，运行下面的修复SQL
-- ==================================================

-- 启用RLS（如果未启用）
ALTER TABLE bp_submissions ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧policies
DROP POLICY IF EXISTS "Users can insert their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can view their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can update their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can delete their own BP submissions" ON bp_submissions;

-- 创建新的RLS policies
CREATE POLICY "Users can insert their own BP submissions"
ON bp_submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own BP submissions"
ON bp_submissions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own BP submissions"
ON bp_submissions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own BP submissions"
ON bp_submissions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ==================================================
-- Storage policies for bp-documents bucket
-- ==================================================
-- 注意: Storage policies需要在Supabase Dashboard中手动设置
-- 或使用以下SQL（如果你的Supabase版本支持）:

-- INSERT操作 - 允许用户上传到自己的文件夹
INSERT INTO storage.policies (name, bucket_id, definition, check_expression)
VALUES (
  'Users can upload BP files to their folder',
  'bp-documents',
  '(bucket_id = ''bp-documents''::text) AND (auth.uid() = (storage.foldername(name))[1]::uuid)',
  '(bucket_id = ''bp-documents''::text) AND (auth.uid() = (storage.foldername(name))[1]::uuid)'
)
ON CONFLICT (name, bucket_id) DO NOTHING;

-- SELECT操作 - 允许用户查看自己的文件
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Users can view their own BP files',
  'bp-documents',
  '(bucket_id = ''bp-documents''::text) AND (auth.uid() = (storage.foldername(name))[1]::uuid)'
)
ON CONFLICT (name, bucket_id) DO NOTHING;

-- DELETE操作 - 允许用户删除自己的文件
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Users can delete their own BP files',
  'bp-documents',
  '(bucket_id = ''bp-documents''::text) AND (auth.uid() = (storage.foldername(name))[1]::uuid)'
)
ON CONFLICT (name, bucket_id) DO NOTHING;

