-- 完整的数据库Schema更新 - 添加所有缺失字段
-- 在Supabase SQL Editor中执行

-- 1. 为companies表添加所有缺失字段
ALTER TABLE companies ADD COLUMN IF NOT EXISTS english_description TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_overseas BOOLEAN DEFAULT false;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS founded_year INTEGER;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS employee_count VARCHAR(100);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS industry VARCHAR(100);

-- 2. 为projects表添加所有缺失字段
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_stories TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS latest_features TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. 创建标签索引
CREATE INDEX IF NOT EXISTS idx_companies_tags ON companies USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN (tags);

-- 4. 创建常用标签表
CREATE TABLE IF NOT EXISTS common_tags (
  id SERIAL PRIMARY KEY,
  tag_name VARCHAR(50) UNIQUE NOT NULL,
  tag_category VARCHAR(50) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 插入常用标签
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
('Integration', 'Technology', 0),

-- 功能标签
('Video', 'Application', 0),
('Image', 'Application', 0),
('Text', 'Application', 0),
('Code', 'Application', 0),
('Chat', 'Application', 0),

-- 地域标签
('International', 'Company Type', 0),
('Domestic', 'Company Type', 0),

-- 业务标签
('Business', 'Application', 0),
('Creative', 'Application', 0),
('Developer Tools', 'Application', 0),
('Writing', 'Application', 0),
('Analytics', 'Application', 0),
('Customer Support', 'Application', 0),
('Sales', 'Application', 0),
('Chatbots', 'Application', 0),
('Learning', 'Application', 0),
('Data', 'Application')

ON CONFLICT (tag_name) DO NOTHING;

-- 完成
SELECT 'Database schema updated successfully with all required fields!' as status;
