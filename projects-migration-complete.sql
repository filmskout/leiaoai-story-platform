-- 完全重写的Projects迁移脚本
-- 消除所有tools引用，使用projects概念

-- ============================================
-- 步骤1：检查现有表结构并创建projects表
-- ============================================

DO $$ 
BEGIN
    -- 检查是否存在projects表
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        RAISE NOTICE 'Projects table already exists, skipping creation';
    ELSE
        RAISE NOTICE 'Creating projects table and related tables...';
        
        -- 创建projects表
        CREATE TABLE public.projects (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
            name text NOT NULL,
            description text,
            url text,
            website text,
            logo_url text,
            category text DEFAULT 'AI项目',
            industry_tags text[] DEFAULT '{}',
            free_tier boolean DEFAULT false,
            api_available boolean DEFAULT false,
            project_type text DEFAULT 'AI Product',
            pricing_model text,
            target_audience text,
            technology_stack text[],
            use_cases text[],
            integrations text[],
            documentation_url text,
            github_url text,
            demo_url text,
            pricing_url text,
            launch_date date,
            status text DEFAULT 'Active',
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
        
        -- 创建project_ratings表
        CREATE TABLE public.project_ratings (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
            user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
            rating integer CHECK (rating >= 1 AND rating <= 5),
            review_text text,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now(),
            UNIQUE(project_id, user_id)
        );
        
        -- 创建project_stats表
        CREATE TABLE public.project_stats (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
            total_ratings integer DEFAULT 0,
            average_rating numeric(3,2) DEFAULT 0,
            total_views integer DEFAULT 0,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
        
        -- 创建project_stories表
        CREATE TABLE public.project_stories (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
            story_id uuid REFERENCES public.stories(id) ON DELETE CASCADE,
            created_at timestamptz DEFAULT now()
        );
        
        -- 创建project_versions表
        CREATE TABLE public.project_versions (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
            version_number text NOT NULL,
            release_notes text,
            release_date date,
            created_at timestamptz DEFAULT now()
        );
        
        RAISE NOTICE 'Successfully created projects table and related tables';
    END IF;
END $$;

-- ============================================
-- 步骤2：处理user_favorites表
-- ============================================

DO $$ 
BEGIN
    -- 检查user_favorites表是否存在
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_favorites') THEN
        -- 如果存在tool_id列，重命名为project_id
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'tool_id') THEN
            ALTER TABLE public.user_favorites RENAME COLUMN tool_id TO project_id;
            RAISE NOTICE 'Renamed tool_id to project_id in user_favorites table';
        ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'project_id') THEN
            -- 如果既没有tool_id也没有project_id，添加project_id列
            ALTER TABLE public.user_favorites ADD COLUMN project_id uuid;
            RAISE NOTICE 'Added project_id column to user_favorites table';
        END IF;
    ELSE
        -- 如果user_favorites表不存在，创建它
        CREATE TABLE public.user_favorites (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
            project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
            created_at timestamptz DEFAULT now(),
            UNIQUE(user_id, project_id)
        );
        RAISE NOTICE 'Created user_favorites table with project_id column';
    END IF;
END $$;

-- ============================================
-- 步骤3：处理company_stats表
-- ============================================

DO $$ 
BEGIN
    -- 检查company_stats表是否存在
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'company_stats') THEN
        -- 如果存在total_tools列，重命名为total_projects
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_stats' AND column_name = 'total_tools') THEN
            ALTER TABLE public.company_stats RENAME COLUMN total_tools TO total_projects;
            RAISE NOTICE 'Renamed total_tools to total_projects in company_stats table';
        ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_stats' AND column_name = 'total_projects') THEN
            -- 如果既没有total_tools也没有total_projects，添加total_projects列
            ALTER TABLE public.company_stats ADD COLUMN total_projects integer DEFAULT 0;
            RAISE NOTICE 'Added total_projects column to company_stats table';
        END IF;
        
        -- 如果存在average_tool_rating列，重命名为average_project_rating
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_stats' AND column_name = 'average_tool_rating') THEN
            ALTER TABLE public.company_stats RENAME COLUMN average_tool_rating TO average_project_rating;
            RAISE NOTICE 'Renamed average_tool_rating to average_project_rating in company_stats table';
        ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_stats' AND column_name = 'average_project_rating') THEN
            -- 如果既没有average_tool_rating也没有average_project_rating，添加average_project_rating列
            ALTER TABLE public.company_stats ADD COLUMN average_project_rating numeric(3,2) DEFAULT 0;
            RAISE NOTICE 'Added average_project_rating column to company_stats table';
        END IF;
    ELSE
        -- 如果company_stats表不存在，创建它
        CREATE TABLE public.company_stats (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
            total_projects integer DEFAULT 0,
            average_project_rating numeric(3,2) DEFAULT 0,
            total_fundings integer DEFAULT 0,
            total_stories integer DEFAULT 0,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
        RAISE NOTICE 'Created company_stats table with projects columns';
    END IF;
END $$;

-- ============================================
-- 步骤4：创建索引
-- ============================================

-- 删除可能存在的旧索引
DROP INDEX IF EXISTS idx_tools_company;
DROP INDEX IF EXISTS idx_tool_ratings_user;
DROP INDEX IF EXISTS idx_tool_ratings_tool;

-- 创建新的索引
CREATE INDEX IF NOT EXISTS idx_projects_company ON public.projects(company_id);
CREATE INDEX IF NOT EXISTS idx_project_ratings_user ON public.project_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_project_ratings_project ON public.project_ratings(project_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_project ON public.user_favorites(project_id);
CREATE INDEX IF NOT EXISTS idx_company_stats_company ON public.company_stats(company_id);

-- ============================================
-- 步骤5：设置RLS策略
-- ============================================

-- 为新表启用RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧策略
DROP POLICY IF EXISTS tools_read_all ON public.projects;
DROP POLICY IF EXISTS tool_ratings_read_all ON public.project_ratings;
DROP POLICY IF EXISTS tool_stats_read_all ON public.project_stats;

-- 创建新的RLS策略
CREATE POLICY projects_read_all ON public.projects FOR SELECT USING (true);
CREATE POLICY project_ratings_read_all ON public.project_ratings FOR SELECT USING (true);
CREATE POLICY project_stats_read_all ON public.project_stats FOR SELECT USING (true);
CREATE POLICY project_stories_read_all ON public.project_stories FOR SELECT USING (true);
CREATE POLICY project_versions_read_all ON public.project_versions FOR SELECT USING (true);

-- ============================================
-- 步骤6：验证结果
-- ============================================

-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'project_ratings', 'project_stats', 'project_stories', 'project_versions', 'user_favorites', 'company_stats')
ORDER BY table_name;

-- 检查projects表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'projects'
ORDER BY ordinal_position;

-- 检查数据完整性
SELECT 
    (SELECT COUNT(*) FROM public.projects) as projects_count,
    (SELECT COUNT(*) FROM public.project_ratings) as ratings_count,
    (SELECT COUNT(*) FROM public.project_stats) as stats_count,
    (SELECT COUNT(*) FROM public.project_stories) as stories_count,
    (SELECT COUNT(*) FROM public.user_favorites) as favorites_count,
    (SELECT COUNT(*) FROM public.company_stats) as company_stats_count;
