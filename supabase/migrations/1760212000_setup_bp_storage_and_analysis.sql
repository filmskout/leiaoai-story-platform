-- =====================================================
-- BP文档存储和分析功能数据库设置
-- 生成时间: 2025-10-11
-- =====================================================

-- 1. 更新 bp_submissions 表结构
-- =====================================================

-- 删除旧的 base64 字段（如果存在）
ALTER TABLE bp_submissions 
DROP COLUMN IF EXISTS file_base64;

-- 添加新字段
ALTER TABLE bp_submissions
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS extracted_text TEXT,
ADD COLUMN IF NOT EXISTS analysis_scores JSONB,
ADD COLUMN IF NOT EXISTS analysis_status TEXT DEFAULT 'pending';

-- 添加索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_bp_submissions_user_id 
ON bp_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_bp_submissions_analysis_status 
ON bp_submissions(analysis_status);

CREATE INDEX IF NOT EXISTS idx_bp_submissions_created_at 
ON bp_submissions(created_at DESC);

-- 添加注释
COMMENT ON COLUMN bp_submissions.file_url IS 'Supabase Storage中的文件URL';
COMMENT ON COLUMN bp_submissions.extracted_text IS 'OCR提取的文本内容';
COMMENT ON COLUMN bp_submissions.analysis_scores IS '4个维度的详细分析得分（JSON格式）';
COMMENT ON COLUMN bp_submissions.analysis_status IS '分析状态: pending, analyzing, completed, failed';

-- 2. 创建 Storage Bucket (需要在Supabase Dashboard中手动创建)
-- =====================================================
-- Bucket名称: bp-documents
-- 公开访问: No (私有)
-- 文件大小限制: 52428800 (50MB)
-- 允许的MIME类型:
--   - application/pdf
--   - application/vnd.openxmlformats-officedocument.wordprocessingml.document

-- 3. Storage RLS 策略
-- =====================================================

-- 允许用户上传自己的BP文档
CREATE POLICY IF NOT EXISTS "Users can upload own BP documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'bp-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 允许用户查看自己的BP文档
CREATE POLICY IF NOT EXISTS "Users can view own BP documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'bp-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 允许用户更新自己的BP文档
CREATE POLICY IF NOT EXISTS "Users can update own BP documents"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'bp-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'bp-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 允许用户删除自己的BP文档
CREATE POLICY IF NOT EXISTS "Users can delete own BP documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'bp-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. 数据表 RLS 策略
-- =====================================================

-- 允许用户插入自己的BP提交记录
CREATE POLICY IF NOT EXISTS "Users can insert own BP submissions"
ON bp_submissions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 允许用户查看自己的BP提交记录
CREATE POLICY IF NOT EXISTS "Users can view own BP submissions"
ON bp_submissions FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 允许用户更新自己的BP提交记录
CREATE POLICY IF NOT EXISTS "Users can update own BP submissions"
ON bp_submissions FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 允许用户删除自己的BP提交记录
CREATE POLICY IF NOT EXISTS "Users can delete own BP submissions"
ON bp_submissions FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 5. 创建统计视图
-- =====================================================

CREATE OR REPLACE VIEW bp_analysis_stats AS
SELECT 
  analysis_status,
  COUNT(*) as submission_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(score) as avg_score,
  MAX(created_at) as latest_submission
FROM bp_submissions
GROUP BY analysis_status;

COMMENT ON VIEW bp_analysis_stats IS 'BP分析统计信息';

-- =====================================================
-- 完成！
-- =====================================================

