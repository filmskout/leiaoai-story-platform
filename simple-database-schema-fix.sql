-- =====================================================
-- 简化版数据库Schema修复脚本
-- 专门解决 "record 'new' has no field 'company_id'" 错误
-- =====================================================

-- 1. 删除所有有问题的触发器
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS company_updates_trigger ON public.company_updates;
DROP TRIGGER IF EXISTS prevent_duplicate_updates ON public.company_updates;
DROP TRIGGER IF EXISTS update_company_stats_trigger ON public.companies;
DROP TRIGGER IF EXISTS update_company_stats_from_projects_trigger ON public.projects;
DROP TRIGGER IF EXISTS update_company_stats_from_stories_trigger ON public.company_stories;

-- 2. 删除所有有问题的函数
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.update_company_last_modified();
DROP FUNCTION IF EXISTS public.check_duplicate_update();
DROP FUNCTION IF EXISTS public.update_company_stats();

-- 3. 清理所有数据
DELETE FROM public.stories;
DELETE FROM public.fundings;
DELETE FROM public.projects;
DELETE FROM public.companies;
DELETE FROM public.company_updates;

-- 4. 重新创建必要的函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. 重新创建触发器
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 6. 验证修复结果
SELECT '修复完成！' as status;
SELECT COUNT(*) as companies_count FROM public.companies;
SELECT COUNT(*) as projects_count FROM public.projects;
SELECT COUNT(*) as fundings_count FROM public.fundings;
SELECT COUNT(*) as stories_count FROM public.stories;
