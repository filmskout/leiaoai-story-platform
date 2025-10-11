-- ============================================
-- 迁移文件 3: BP Storage and Analysis
-- ============================================

-- 1. 创建bp_submissions表
CREATE TABLE IF NOT EXISTS bp_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  extracted_text TEXT,
  analysis_status TEXT DEFAULT 'pending' NOT NULL,
  analysis_scores JSONB,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_bp_submissions_user_id ON bp_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_submissions_status ON bp_submissions(analysis_status);
CREATE INDEX IF NOT EXISTS idx_bp_submissions_created_at ON bp_submissions(created_at DESC);

-- 3. 启用RLS
ALTER TABLE bp_submissions ENABLE ROW LEVEL SECURITY;

-- 4. 删除旧的policies
DROP POLICY IF EXISTS "Users can view their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can insert their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can update their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can delete their own BP submissions" ON bp_submissions;

-- 5. 创建RLS policies for bp_submissions
CREATE POLICY "Users can view their own BP submissions"
  ON bp_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own BP submissions"
  ON bp_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own BP submissions"
  ON bp_submissions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own BP submissions"
  ON bp_submissions FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Storage policies for bp-documents bucket
DROP POLICY IF EXISTS "Users can upload their own BP documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own BP documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own BP documents" ON storage.objects;

CREATE POLICY "Users can upload their own BP documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'bp-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own BP documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'bp-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own BP documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'bp-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

