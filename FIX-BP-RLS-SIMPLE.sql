-- ========================================
-- BP RLS 修复 - 简化版（只修复表的RLS）
-- ========================================

-- 1️⃣ 检查bp_submissions表的RLS状态
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '✅ RLS已启用' ELSE '❌ RLS未启用' END as rls_status
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'bp_submissions';

-- 2️⃣ 检查现有的policies
SELECT 
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'bp_submissions';

-- 3️⃣ 检查bp-documents bucket
SELECT 
  id,
  name,
  public as is_public,
  file_size_limit / 1024 / 1024 as size_limit_mb
FROM storage.buckets
WHERE name = 'bp-documents';

-- ========================================
-- 修复部分：启用RLS和创建Policies
-- ========================================

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

-- ========================================
-- 完成！✅
-- ========================================
-- 表的RLS已修复
-- Storage policies需要在Dashboard手动设置
-- 请查看 BP-STORAGE-POLICIES-GUIDE.md

