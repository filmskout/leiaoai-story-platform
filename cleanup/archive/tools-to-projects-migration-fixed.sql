-- 修复的Tools到Projects转换SQL脚本
-- 处理tools表不存在的情况

-- ============================================
-- 步骤1：检查现有表结构
-- ============================================

-- 检查是否存在tools表
DO $$ 
BEGIN
    -- 如果tools表存在，则进行备份和重命名
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        RAISE NOTICE 'Found tools table, proceeding with migration...';
        
        -- 备份现有数据
        EXECUTE 'CREATE TABLE IF NOT EXISTS backup_tools AS SELECT * FROM public.tools';
        EXECUTE 'CREATE TABLE IF NOT EXISTS backup_tool_ratings AS SELECT * FROM public.tool_ratings';
        EXECUTE 'CREATE TABLE IF NOT EXISTS backup_user_favorites AS SELECT * FROM public.user_favorites';
        EXECUTE 'CREATE TABLE IF NOT EXISTS backup_tool_stories AS SELECT * FROM public.tool_stories';
        EXECUTE 'CREATE TABLE IF NOT EXISTS backup_tool_stats AS SELECT * FROM public.tool_stats';
        EXECUTE 'CREATE TABLE IF NOT EXISTS backup_tool_versions AS SELECT * FROM public.tool_versions';
        EXECUTE 'CREATE TABLE IF NOT EXISTS backup_company_stats AS SELECT * FROM public.company_stats';
        
        -- 重命名主表
        ALTER TABLE public.tools RENAME TO projects;
        
        -- 重命名相关表（如果存在）
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_ratings') THEN
            ALTER TABLE public.tool_ratings RENAME TO project_ratings;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_stories') THEN
            ALTER TABLE public.tool_stories RENAME TO project_stories;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_stats') THEN
            ALTER TABLE public.tool_stats RENAME TO project_stats;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_versions') THEN
            ALTER TABLE public.tool_versions RENAME TO project_versions;
        END IF;
        
        -- 更新user_favorites表的外键列名（如果存在）
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'tool_id') THEN
            ALTER TABLE public.user_favorites RENAME COLUMN tool_id TO project_id;
        ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_favorites') THEN
            -- 如果user_favorites表存在但没有tool_id列，添加project_id列
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'project_id') THEN
                ALTER TABLE public.user_favorites ADD COLUMN project_id uuid;
            END IF;
        END IF;
        
        -- 更新company_stats表的列名（如果存在）
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_stats' AND column_name = 'total_tools') THEN
            ALTER TABLE public.company_stats RENAME COLUMN total_tools TO total_projects;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_stats' AND column_name = 'average_tool_rating') THEN
            ALTER TABLE public.company_stats RENAME COLUMN average_tool_rating TO average_project_rating;
        END IF;
        
        RAISE NOTICE 'Successfully migrated tools table to projects table';
        
    ELSE
        RAISE NOTICE 'Tools table does not exist, checking if projects table already exists...';
        
        -- 如果tools表不存在，检查projects表是否已存在
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
            RAISE NOTICE 'Projects table already exists, skipping migration';
        ELSE
            RAISE NOTICE 'Neither tools nor projects table exists, creating projects table...';
            
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
            
            -- 创建相关表
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
            
            CREATE TABLE public.project_stats (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
                total_ratings integer DEFAULT 0,
                average_rating numeric(3,2) DEFAULT 0,
                total_views integer DEFAULT 0,
                created_at timestamptz DEFAULT now(),
                updated_at timestamptz DEFAULT now()
            );
            
            CREATE TABLE public.project_stories (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
                story_id uuid REFERENCES public.stories(id) ON DELETE CASCADE,
                created_at timestamptz DEFAULT now()
            );
            
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
    END IF;
END $$;

-- ============================================
-- 步骤2：更新外键约束
-- ============================================

-- 删除旧的外键约束（如果存在）
DO $$ 
BEGIN
    -- 删除project_ratings的旧约束
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'tool_ratings_tool_id_fkey' AND table_name = 'project_ratings') THEN
        ALTER TABLE public.project_ratings DROP CONSTRAINT tool_ratings_tool_id_fkey;
    END IF;
    
    -- 删除user_favorites的旧约束
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'user_favorites_tool_id_fkey' AND table_name = 'user_favorites') THEN
        ALTER TABLE public.user_favorites DROP CONSTRAINT user_favorites_tool_id_fkey;
    END IF;
    
    -- 删除project_stories的旧约束
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'tool_stories_tool_id_fkey' AND table_name = 'project_stories') THEN
        ALTER TABLE public.project_stories DROP CONSTRAINT tool_stories_tool_id_fkey;
    END IF;
    
    -- 删除project_stats的旧约束
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'tool_stats_tool_id_fkey' AND table_name = 'project_stats') THEN
        ALTER TABLE public.project_stats DROP CONSTRAINT tool_stats_tool_id_fkey;
    END IF;
    
    -- 删除project_versions的旧约束
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'tool_versions_tool_id_fkey' AND table_name = 'project_versions') THEN
        ALTER TABLE public.project_versions DROP CONSTRAINT tool_versions_tool_id_fkey;
    END IF;
END $$;

-- 添加新的外键约束
DO $$ 
BEGIN
    -- 为project_ratings添加外键约束
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_ratings') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_ratings_project_id_fkey' AND table_name = 'project_ratings') THEN
            ALTER TABLE public.project_ratings ADD CONSTRAINT project_ratings_project_id_fkey 
                FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
        END IF;
    END IF;
    
    -- 为user_favorites添加外键约束
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_favorites') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'project_id') THEN
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'user_favorites_project_id_fkey' AND table_name = 'user_favorites') THEN
                ALTER TABLE public.user_favorites ADD CONSTRAINT user_favorites_project_id_fkey 
                    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
            END IF;
        END IF;
    END IF;
    
    -- 为project_stories添加外键约束
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_stories') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_stories_project_id_fkey' AND table_name = 'project_stories') THEN
            ALTER TABLE public.project_stories ADD CONSTRAINT project_stories_project_id_fkey 
                FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
        END IF;
    END IF;
    
    -- 为project_stats添加外键约束
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_stats') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_stats_project_id_fkey' AND table_name = 'project_stats') THEN
            ALTER TABLE public.project_stats ADD CONSTRAINT project_stats_project_id_fkey 
                FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
        END IF;
    END IF;
    
    -- 为project_versions添加外键约束
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_versions') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_versions_project_id_fkey' AND table_name = 'project_versions') THEN
            ALTER TABLE public.project_versions ADD CONSTRAINT project_versions_project_id_fkey 
                FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- ============================================
-- 步骤3：更新索引
-- ============================================

-- 删除旧索引
DROP INDEX IF EXISTS idx_tools_company;
DROP INDEX IF EXISTS idx_tool_ratings_user;
DROP INDEX IF EXISTS idx_tool_ratings_tool;

-- 创建新索引
CREATE INDEX IF NOT EXISTS idx_projects_company ON public.projects(company_id);
CREATE INDEX IF NOT EXISTS idx_project_ratings_user ON public.project_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_project_ratings_project ON public.project_ratings(project_id);

-- ============================================
-- 步骤4：更新RLS策略
-- ============================================

-- 删除旧的RLS策略
DROP POLICY IF EXISTS tools_read_all ON public.projects;
DROP POLICY IF EXISTS tool_ratings_read_all ON public.project_ratings;
DROP POLICY IF EXISTS tool_stats_read_all ON public.project_stats;

-- 为新表启用RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stats ENABLE ROW LEVEL SECURITY;

-- 创建新的RLS策略
CREATE POLICY projects_read_all ON public.projects FOR SELECT USING (true);
CREATE POLICY project_ratings_read_all ON public.project_ratings FOR SELECT USING (true);
CREATE POLICY project_stats_read_all ON public.project_stats FOR SELECT USING (true);

-- ============================================
-- 步骤5：验证转换结果
-- ============================================

-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'project_ratings', 'project_stats', 'project_stories', 'project_versions')
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
    (SELECT COUNT(*) FROM public.project_stories) as stories_count;
