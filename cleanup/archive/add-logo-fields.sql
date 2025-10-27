-- 添加logo字段到companies表
-- 在Supabase SQL Editor中执行

-- 1. 添加logo_base64字段
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_base64 TEXT;

-- 2. 添加logo相关字段
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_companies_logo ON companies(logo_base64) WHERE logo_base64 IS NOT NULL;

-- 4. 添加更新触发器
CREATE OR REPLACE FUNCTION update_companies_logo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.logo_updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_companies_logo_updated_at ON companies;
CREATE TRIGGER update_companies_logo_updated_at
    BEFORE UPDATE OF logo_base64, logo_url ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_companies_logo_updated_at();

-- 完成
SELECT 'Logo字段添加完成！' as status;
