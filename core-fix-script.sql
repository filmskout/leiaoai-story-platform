-- =====================================================
-- 核心问题修复脚本
-- 只删除有问题的触发器，不删除函数
-- =====================================================

-- 1. 删除有问题的触发器（不删除函数）
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS company_updates_trigger ON public.companies;
DROP TRIGGER IF EXISTS update_company_stats_trigger ON public.companies;
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS update_company_stats_from_projects_trigger ON public.projects;
DROP TRIGGER IF EXISTS update_company_stats_from_stories_trigger ON public.company_stories;
DROP TRIGGER IF EXISTS prevent_duplicate_updates ON public.company_updates;

-- 2. 删除有问题的函数（使用CASCADE）
DROP FUNCTION IF EXISTS public.update_company_last_modified() CASCADE;
DROP FUNCTION IF EXISTS public.check_duplicate_update() CASCADE;
DROP FUNCTION IF EXISTS public.update_company_stats() CASCADE;

-- 3. 清理所有数据
DELETE FROM public.stories;
DELETE FROM public.fundings;
DELETE FROM public.projects;
DELETE FROM public.companies;
DELETE FROM public.company_updates;

-- 4. 重新创建必要的触发器
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 5. 验证修复结果
SELECT '修复完成！' as status;
SELECT COUNT(*) as companies_count FROM public.companies;
SELECT COUNT(*) as projects_count FROM public.projects;
SELECT COUNT(*) as fundings_count FROM public.fundings;
SELECT COUNT(*) as stories_count FROM public.stories;
