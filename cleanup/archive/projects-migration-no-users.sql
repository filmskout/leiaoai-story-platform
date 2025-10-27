-- Projects迁移脚本 - 不依赖users表
-- 适用于Supabase中没有users表的情况

-- ============================================
-- 步骤0：检查现有表结构
-- ============================================

-- 显示当前数据库中存在的所有表
SELECT 'Current tables in database:' as info;
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ============================================
-- 步骤1：创建projects表
-- ============================================

-- 如果projects表不存在，创建它
CREATE TABLE IF NOT EXISTS public.projects (
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

-- ============================================
-- 步骤2：创建project_ratings表（不依赖users表）
-- ============================================

CREATE TABLE IF NOT EXISTS public.project_ratings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid,
    user_id uuid, -- 保留字段，但不添加外键约束
    rating integer CHECK (rating >= 1 AND rating <= 5),
    review_text text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(project_id, user_id)
);

-- ============================================
-- 步骤3：创建project_stats表
-- ============================================

CREATE TABLE IF NOT EXISTS public.project_stats (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid,
    total_ratings integer DEFAULT 0,
    average_rating numeric(3,2) DEFAULT 0,
    total_views integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 步骤4：创建project_stories表
-- ============================================

CREATE TABLE IF NOT EXISTS public.project_stories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid,
    story_id uuid,
    created_at timestamptz DEFAULT now()
);

-- ============================================
-- 步骤5：创建project_versions表
-- ============================================

CREATE TABLE IF NOT EXISTS public.project_versions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid,
    version_number text NOT NULL,
    release_notes text,
    release_date date,
    created_at timestamptz DEFAULT now()
);

-- ============================================
-- 步骤6：处理user_favorites表
-- ============================================

-- 如果user_favorites表不存在，创建它
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid, -- 保留字段，但不添加外键约束
    project_id uuid,
    created_at timestamptz DEFAULT now()
);

-- 如果user_favorites表存在但只有tool_id列，添加project_id列
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'tool_id') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'project_id') THEN
            ALTER TABLE public.user_favorites ADD COLUMN project_id uuid;
        END IF;
    END IF;
END $$;

-- ============================================
-- 步骤7：处理company_stats表
-- ============================================

-- 如果company_stats表不存在，创建它
CREATE TABLE IF NOT EXISTS public.company_stats (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    total_projects integer DEFAULT 0,
    average_project_rating numeric(3,2) DEFAULT 0,
    total_fundings integer DEFAULT 0,
    total_stories integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 如果company_stats表存在，重命名相关列
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_stats' AND column_name = 'total_tools') THEN
        ALTER TABLE public.company_stats RENAME COLUMN total_tools TO total_projects;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_stats' AND column_name = 'average_tool_rating') THEN
        ALTER TABLE public.company_stats RENAME COLUMN average_tool_rating TO average_project_rating;
    END IF;
END $$;

-- ============================================
-- 步骤8：添加外键约束（仅对存在的表）
-- ============================================

-- 为project_ratings添加外键约束（仅projects表）
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_ratings_project_id_fkey' AND table_name = 'project_ratings') THEN
        ALTER TABLE public.project_ratings ADD CONSTRAINT project_ratings_project_id_fkey 
            FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 为project_stats添加外键约束
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_stats_project_id_fkey' AND table_name = 'project_stats') THEN
        ALTER TABLE public.project_stats ADD CONSTRAINT project_stats_project_id_fkey 
            FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 为project_stories添加外键约束
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_stories_project_id_fkey' AND table_name = 'project_stories') THEN
        ALTER TABLE public.project_stories ADD CONSTRAINT project_stories_project_id_fkey 
            FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stories') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_stories_story_id_fkey' AND table_name = 'project_stories') THEN
            ALTER TABLE public.project_stories ADD CONSTRAINT project_stories_story_id_fkey 
                FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 为project_versions添加外键约束
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_versions_project_id_fkey' AND table_name = 'project_versions') THEN
        ALTER TABLE public.project_versions ADD CONSTRAINT project_versions_project_id_fkey 
            FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 为user_favorites添加外键约束（仅projects表）
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'user_favorites_project_id_fkey' AND table_name = 'user_favorites') THEN
        ALTER TABLE public.user_favorites ADD CONSTRAINT user_favorites_project_id_fkey 
            FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 为company_stats添加外键约束
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'company_stats_company_id_fkey' AND table_name = 'company_stats') THEN
        ALTER TABLE public.company_stats ADD CONSTRAINT company_stats_company_id_fkey 
            FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;
    END IF;
END $$;

-- ============================================
-- 步骤9：创建索引
-- ============================================

-- 为projects表创建索引
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON public.projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- 为project_ratings表创建索引
CREATE INDEX IF NOT EXISTS idx_project_ratings_project_id ON public.project_ratings(project_id);
CREATE INDEX IF NOT EXISTS idx_project_ratings_user_id ON public.project_ratings(user_id);

-- 为user_favorites表创建索引
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_project_id ON public.user_favorites(project_id);

-- 为company_stats表创建索引
CREATE INDEX IF NOT EXISTS idx_company_stats_company_id ON public.company_stats(company_id);

-- ============================================
-- 步骤10：设置RLS策略
-- ============================================

-- 启用RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_stats ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧策略
DROP POLICY IF EXISTS tools_read_all ON public.projects;
DROP POLICY IF EXISTS tool_ratings_read_all ON public.project_ratings;
DROP POLICY IF EXISTS tool_stats_read_all ON public.project_stats;

-- 创建新的RLS策略
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'projects_read_all' AND tablename = 'projects') THEN
        CREATE POLICY projects_read_all ON public.projects FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'project_ratings_read_all' AND tablename = 'project_ratings') THEN
        CREATE POLICY project_ratings_read_all ON public.project_ratings FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'project_stats_read_all' AND tablename = 'project_stats') THEN
        CREATE POLICY project_stats_read_all ON public.project_stats FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'project_stories_read_all' AND tablename = 'project_stories') THEN
        CREATE POLICY project_stories_read_all ON public.project_stories FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'project_versions_read_all' AND tablename = 'project_versions') THEN
        CREATE POLICY project_versions_read_all ON public.project_versions FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_favorites_read_all' AND tablename = 'user_favorites') THEN
        CREATE POLICY user_favorites_read_all ON public.user_favorites FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'company_stats_read_all' AND tablename = 'company_stats') THEN
        CREATE POLICY company_stats_read_all ON public.company_stats FOR SELECT USING (true);
    END IF;
END $$;

-- ============================================
-- 步骤11：验证结果
-- ============================================

-- 显示所有创建的表
SELECT 'Created tables:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%project%'
ORDER BY table_name;

-- 显示projects表结构
SELECT 'Projects table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'projects'
ORDER BY ordinal_position;

-- 显示外键约束
SELECT 'Foreign key constraints:' as info;
SELECT tc.table_name, tc.constraint_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
AND tc.table_name LIKE '%project%'
ORDER BY tc.table_name, tc.constraint_name;

-- 显示RLS策略
SELECT 'RLS policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename LIKE '%project%'
ORDER BY tablename, policyname;

SELECT 'Migration completed successfully!' as result;
