-- 完整的Tools到Projects转换SQL脚本
-- 请按顺序在Supabase SQL编辑器中执行

-- ============================================
-- 步骤1：备份现有数据
-- ============================================
CREATE TABLE IF NOT EXISTS backup_tools AS SELECT * FROM public.tools;
CREATE TABLE IF NOT EXISTS backup_tool_ratings AS SELECT * FROM public.tool_ratings;
CREATE TABLE IF NOT EXISTS backup_user_favorites AS SELECT * FROM public.user_favorites;
CREATE TABLE IF NOT EXISTS backup_tool_stories AS SELECT * FROM public.tool_stories;
CREATE TABLE IF NOT EXISTS backup_tool_stats AS SELECT * FROM public.tool_stats;
CREATE TABLE IF NOT EXISTS backup_tool_versions AS SELECT * FROM public.tool_versions;
CREATE TABLE IF NOT EXISTS backup_company_stats AS SELECT * FROM public.company_stats;

-- ============================================
-- 步骤2：重命名表和列
-- ============================================

-- 重命名主表
ALTER TABLE public.tools RENAME TO projects;

-- 重命名相关表
ALTER TABLE public.tool_ratings RENAME TO project_ratings;
ALTER TABLE public.tool_stories RENAME TO project_stories;
ALTER TABLE public.tool_stats RENAME TO project_stats;
ALTER TABLE public.tool_versions RENAME TO project_versions;

-- 更新user_favorites表的外键列名
ALTER TABLE public.user_favorites RENAME COLUMN tool_id TO project_id;

-- 更新company_stats表的列名
ALTER TABLE public.company_stats RENAME COLUMN total_tools TO total_projects;
ALTER TABLE public.company_stats RENAME COLUMN average_tool_rating TO average_project_rating;

-- ============================================
-- 步骤3：更新外键约束
-- ============================================

-- 删除旧的外键约束
ALTER TABLE public.project_ratings DROP CONSTRAINT IF EXISTS tool_ratings_tool_id_fkey;
ALTER TABLE public.user_favorites DROP CONSTRAINT IF EXISTS user_favorites_tool_id_fkey;
ALTER TABLE public.project_stories DROP CONSTRAINT IF EXISTS tool_stories_tool_id_fkey;
ALTER TABLE public.project_stats DROP CONSTRAINT IF EXISTS tool_stats_tool_id_fkey;
ALTER TABLE public.project_versions DROP CONSTRAINT IF EXISTS tool_versions_tool_id_fkey;

-- 添加新的外键约束
ALTER TABLE public.project_ratings ADD CONSTRAINT project_ratings_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

ALTER TABLE public.user_favorites ADD CONSTRAINT user_favorites_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

ALTER TABLE public.project_stories ADD CONSTRAINT project_stories_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

ALTER TABLE public.project_stats ADD CONSTRAINT project_stats_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

ALTER TABLE public.project_versions ADD CONSTRAINT project_versions_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- ============================================
-- 步骤4：更新索引
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
-- 步骤5：更新RLS策略
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
-- 步骤6：添加projects表的增强字段
-- ============================================

-- 为projects表添加更多字段以支持项目概念
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_type text DEFAULT 'AI Product';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS pricing_model text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS target_audience text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS technology_stack text[];
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS use_cases text[];
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS integrations text[];
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS documentation_url text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_url text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS demo_url text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS pricing_url text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS launch_date date;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status text DEFAULT 'Active';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ============================================
-- 步骤7：验证转换结果
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
