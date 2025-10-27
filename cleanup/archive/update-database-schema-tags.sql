-- 数据库Schema更新 - 添加多标签系统
-- 为companies和projects表添加tags字段

-- 1. 为companies表添加tags字段
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. 为projects表添加tags字段
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 3. 为projects表添加用户stories字段
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS user_stories TEXT[] DEFAULT '{}';

-- 4. 为projects表添加最新功能字段
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS latest_features TEXT[] DEFAULT '{}';

-- 5. 为projects表添加用户评分字段
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS user_rating DECIMAL(3,2) DEFAULT 0.0;

-- 6. 为projects表添加用户评价数量字段
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- 7. 为projects表添加最后更新时间字段
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 8. 创建标签索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_companies_tags ON companies USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN (tags);

-- 9. 更新现有数据，为没有标签的记录添加默认标签
UPDATE companies 
SET tags = ARRAY['AI', 'Technology'] 
WHERE tags IS NULL OR array_length(tags, 1) IS NULL;

UPDATE projects 
SET tags = ARRAY['AI Tool', 'Productivity'] 
WHERE tags IS NULL OR array_length(tags, 1) IS NULL;

-- 10. 创建标签统计视图
CREATE OR REPLACE VIEW tag_statistics AS
SELECT 
    'company' as type,
    unnest(tags) as tag,
    COUNT(*) as count
FROM companies 
WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
GROUP BY unnest(tags)

UNION ALL

SELECT 
    'project' as type,
    unnest(tags) as tag,
    COUNT(*) as count
FROM projects 
WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
GROUP BY unnest(tags);

-- 11. 创建函数来验证标签数量限制
CREATE OR REPLACE FUNCTION validate_tags_limit()
RETURNS TRIGGER AS $$
BEGIN
    -- 检查companies表的标签数量
    IF TG_TABLE_NAME = 'companies' THEN
        IF NEW.tags IS NOT NULL AND array_length(NEW.tags, 1) > 3 THEN
            RAISE EXCEPTION 'Companies can have at most 3 tags';
        END IF;
    END IF;
    
    -- 检查projects表的标签数量
    IF TG_TABLE_NAME = 'projects' THEN
        IF NEW.tags IS NOT NULL AND array_length(NEW.tags, 1) > 3 THEN
            RAISE EXCEPTION 'Projects can have at most 3 tags';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. 创建触发器来强制执行标签限制
DROP TRIGGER IF EXISTS validate_companies_tags_limit ON companies;
CREATE TRIGGER validate_companies_tags_limit
    BEFORE INSERT OR UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION validate_tags_limit();

DROP TRIGGER IF EXISTS validate_projects_tags_limit ON projects;
CREATE TRIGGER validate_projects_tags_limit
    BEFORE INSERT OR UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION validate_tags_limit();

-- 13. 创建常用标签表（可选，用于标签建议）
CREATE TABLE IF NOT EXISTS common_tags (
    id SERIAL PRIMARY KEY,
    tag_name VARCHAR(50) UNIQUE NOT NULL,
    tag_category VARCHAR(50) NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. 插入常用标签
INSERT INTO common_tags (tag_name, tag_category, usage_count) VALUES
-- AI相关标签
('AI', 'Technology', 0),
('Machine Learning', 'Technology', 0),
('Deep Learning', 'Technology', 0),
('Natural Language Processing', 'Technology', 0),
('Computer Vision', 'Technology', 0),
('Generative AI', 'Technology', 0),

-- 应用领域标签
('Productivity', 'Application', 0),
('Content Creation', 'Application', 0),
('Design', 'Application', 0),
('Marketing', 'Application', 0),
('Education', 'Application', 0),
('Healthcare', 'Application', 0),
('Finance', 'Application', 0),
('E-commerce', 'Application', 0),

-- 公司类型标签
('Startup', 'Company Type', 0),
('Enterprise', 'Company Type', 0),
('Open Source', 'Company Type', 0),
('SaaS', 'Company Type', 0),
('Platform', 'Company Type', 0),

-- 技术标签
('API', 'Technology', 0),
('Cloud', 'Technology', 0),
('Mobile', 'Technology', 0),
('Web', 'Technology', 0),
('Desktop', 'Technology', 0),
('Integration', 'Technology', 0)

ON CONFLICT (tag_name) DO NOTHING;

-- 15. 创建更新标签使用计数的函数
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    -- 更新companies标签使用计数
    IF TG_TABLE_NAME = 'companies' THEN
        -- 删除旧标签计数
        IF OLD.tags IS NOT NULL THEN
            UPDATE common_tags 
            SET usage_count = usage_count - 1 
            WHERE tag_name = ANY(OLD.tags);
        END IF;
        
        -- 添加新标签计数
        IF NEW.tags IS NOT NULL THEN
            UPDATE common_tags 
            SET usage_count = usage_count + 1 
            WHERE tag_name = ANY(NEW.tags);
        END IF;
    END IF;
    
    -- 更新projects标签使用计数
    IF TG_TABLE_NAME = 'projects' THEN
        -- 删除旧标签计数
        IF OLD.tags IS NOT NULL THEN
            UPDATE common_tags 
            SET usage_count = usage_count - 1 
            WHERE tag_name = ANY(OLD.tags);
        END IF;
        
        -- 添加新标签计数
        IF NEW.tags IS NOT NULL THEN
            UPDATE common_tags 
            SET usage_count = usage_count + 1 
            WHERE tag_name = ANY(NEW.tags);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 16. 创建触发器来更新标签使用计数
DROP TRIGGER IF EXISTS update_companies_tag_count ON companies;
CREATE TRIGGER update_companies_tag_count
    AFTER INSERT OR UPDATE OR DELETE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_tag_usage_count();

DROP TRIGGER IF EXISTS update_projects_tag_count ON projects;
CREATE TRIGGER update_projects_tag_count
    AFTER INSERT OR UPDATE OR DELETE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_tag_usage_count();

-- 17. 创建标签搜索函数
CREATE OR REPLACE FUNCTION search_by_tags(
    search_tags TEXT[],
    table_type TEXT DEFAULT 'both'
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    type TEXT,
    tags TEXT[],
    match_count INTEGER
) AS $$
BEGIN
    IF table_type = 'companies' OR table_type = 'both' THEN
        RETURN QUERY
        SELECT 
            c.id,
            c.name,
            'company'::TEXT,
            c.tags,
            array_length(array(
                SELECT unnest(search_tags) 
                INTERSECT 
                SELECT unnest(c.tags)
            ), 1) as match_count
        FROM companies c
        WHERE c.tags && search_tags
        ORDER BY match_count DESC, c.name;
    END IF;
    
    IF table_type = 'projects' OR table_type = 'both' THEN
        RETURN QUERY
        SELECT 
            p.id,
            p.name,
            'project'::TEXT,
            p.tags,
            array_length(array(
                SELECT unnest(search_tags) 
                INTERSECT 
                SELECT unnest(p.tags)
            ), 1) as match_count
        FROM projects p
        WHERE p.tags && search_tags
        ORDER BY match_count DESC, p.name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 完成
SELECT 'Database schema updated successfully with multi-tag system!' as status;
