-- 创建company-logos存储bucket的SQL配置 (修复版本)
-- 在Supabase SQL Editor中执行

-- 1. 创建存储bucket（如果不存在）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos', 
  true,
  2097152, -- 2MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. 设置存储策略 - 允许所有人读取 (如果不存在)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Public company logos are viewable by everyone'
    ) THEN
        CREATE POLICY "Public company logos are viewable by everyone"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'company-logos');
    END IF;
END $$;

-- 3. 设置存储策略 - 只允许认证用户上传 (如果不存在)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can upload company logos'
    ) THEN
        CREATE POLICY "Authenticated users can upload company logos"
        ON storage.objects FOR INSERT
        WITH CHECK (
          bucket_id = 'company-logos' 
          AND auth.role() = 'authenticated'
        );
    END IF;
END $$;

-- 4. 设置存储策略 - 只允许认证用户更新 (如果不存在)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can update company logos'
    ) THEN
        CREATE POLICY "Authenticated users can update company logos"
        ON storage.objects FOR UPDATE
        USING (
          bucket_id = 'company-logos' 
          AND auth.role() = 'authenticated'
        );
    END IF;
END $$;

-- 5. 设置存储策略 - 只允许认证用户删除 (如果不存在)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can delete company logos'
    ) THEN
        CREATE POLICY "Authenticated users can delete company logos"
        ON storage.objects FOR DELETE
        USING (
          bucket_id = 'company-logos' 
          AND auth.role() = 'authenticated'
        );
    END IF;
END $$;

-- 6. 更新companies表，添加storage_url字段
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_storage_url TEXT;

-- 7. 创建索引
CREATE INDEX IF NOT EXISTS idx_companies_logo_storage ON companies(logo_storage_url) WHERE logo_storage_url IS NOT NULL;

-- 完成
SELECT 'Company logos storage bucket配置完成！' as status;
