-- ============================================
-- 迁移文件 1: BMC Storage Setup
-- ============================================

-- 1. 创建bmc_boards表（如果不存在）
CREATE TABLE IF NOT EXISTS bmc_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_bmc_boards_user_id ON bmc_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_bmc_boards_created_at ON bmc_boards(created_at DESC);

-- 3. 启用RLS
ALTER TABLE bmc_boards ENABLE ROW LEVEL SECURITY;

-- 4. 删除旧的policies（如果存在）
DROP POLICY IF EXISTS "Users can view their own BMC boards" ON bmc_boards;
DROP POLICY IF EXISTS "Users can insert their own BMC boards" ON bmc_boards;
DROP POLICY IF EXISTS "Users can update their own BMC boards" ON bmc_boards;
DROP POLICY IF EXISTS "Users can delete their own BMC boards" ON bmc_boards;

-- 5. 创建RLS policies for bmc_boards
CREATE POLICY "Users can view their own BMC boards"
  ON bmc_boards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own BMC boards"
  ON bmc_boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own BMC boards"
  ON bmc_boards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own BMC boards"
  ON bmc_boards FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Storage policies for bmc-images bucket
DROP POLICY IF EXISTS "Users can upload their own BMC images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own BMC images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own BMC images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own BMC images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view BMC images" ON storage.objects;

CREATE POLICY "Users can upload their own BMC images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'bmc-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own BMC images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'bmc-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view BMC images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bmc-images');

CREATE POLICY "Users can update their own BMC images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'bmc-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own BMC images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'bmc-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

