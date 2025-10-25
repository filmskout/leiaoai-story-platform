-- 添加logo相关字段到companies表
-- 在Supabase SQL Editor中执行

-- 添加logo相关字段
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_storage_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_base64 TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_companies_logo_storage ON companies(logo_storage_url) WHERE logo_storage_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_companies_logo_base64 ON companies(logo_base64) WHERE logo_base64 IS NOT NULL;

-- 完成
SELECT 'Logo字段添加完成！' as status;
