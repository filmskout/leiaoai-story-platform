# BP文档存储设置指南

## 步骤1: 运行SQL迁移

在Supabase Dashboard的SQL Editor中运行以下SQL：

```sql
-- 1. 更新 bp_submissions 表结构
ALTER TABLE bp_submissions 
DROP COLUMN IF EXISTS file_base64;

ALTER TABLE bp_submissions
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS extracted_text TEXT,
ADD COLUMN IF NOT EXISTS analysis_scores JSONB,
ADD COLUMN IF NOT EXISTS analysis_status TEXT DEFAULT 'pending';

-- 添加索引
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

-- Storage RLS 策略
CREATE POLICY IF NOT EXISTS "Users can upload own BP documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'bp-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY IF NOT EXISTS "Users can view own BP documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'bp-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

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

CREATE POLICY IF NOT EXISTS "Users can delete own BP documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'bp-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 数据表 RLS 策略
CREATE POLICY IF NOT EXISTS "Users can insert own BP submissions"
ON bp_submissions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own BP submissions"
ON bp_submissions FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own BP submissions"
ON bp_submissions FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own BP submissions"
ON bp_submissions FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 统计视图
CREATE OR REPLACE VIEW bp_analysis_stats AS
SELECT 
  analysis_status,
  COUNT(*) as submission_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(score) as avg_score,
  MAX(created_at) as latest_submission
FROM bp_submissions
GROUP BY analysis_status;
```

## 步骤2: 创建 Storage Bucket

### 方法1: 使用Supabase Dashboard（推荐）

1. 访问 Supabase Dashboard
2. 进入 Storage 部分
3. 点击 "New bucket"
4. 配置：
   - **Name**: `bp-documents`
   - **Public**: ❌ 否（私有）
   - **File size limit**: `52428800` (50 MB)
   - **Allowed MIME types**: 
     - `application/pdf`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

5. 点击 "Create bucket"

### 方法2: 使用SQL（备选）

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bp-documents',
  'bp-documents',
  false,
  52428800,
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;
```

## 步骤3: 验证设置

### 检查表结构

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bp_submissions'
ORDER BY ordinal_position;
```

应该看到:
- `file_url` (text)
- `extracted_text` (text)
- `analysis_scores` (jsonb)
- `analysis_status` (text)

### 检查Storage Bucket

```sql
SELECT * FROM storage.buckets WHERE id = 'bp-documents';
```

应该返回1行记录。

### 检查RLS策略

```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'bp_submissions' OR schemaname = 'storage';
```

应该看到所有插入、查询、更新、删除的策略。

## 步骤4: 测试（在前端实施后）

1. 上传一个PDF文件
2. 检查Storage中是否存在
3. 检查bp_submissions表中是否有记录
4. 测试删除功能

---

## ✅ 完成清单

- [ ] 运行SQL迁移（步骤1）
- [ ] 创建bp-documents bucket（步骤2）
- [ ] 验证表结构（步骤3）
- [ ] 验证Storage bucket（步骤3）
- [ ] 验证RLS策略（步骤3）

准备就绪后，可以开始前端实施！

