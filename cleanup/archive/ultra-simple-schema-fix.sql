-- =====================================================
-- 超简化版数据库Schema修复脚本
-- 只处理确实存在的问题，避免引用不存在的表
-- =====================================================

-- 1. 删除companies表上的触发器
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS company_updates_trigger ON public.companies;
DROP TRIGGER IF EXISTS update_company_stats_trigger ON public.companies;

-- 2. 删除projects表上的触发器（如果projects表存在）
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS update_company_stats_from_projects_trigger ON public.projects;

-- 3. 删除company_stories表上的触发器（如果company_stories表存在）
DROP TRIGGER IF EXISTS update_company_stats_from_stories_trigger ON public.company_stories;

-- 4. 删除company_updates表上的触发器（如果company_updates表存在）
DROP TRIGGER IF EXISTS prevent_duplicate_updates ON public.company_updates;

-- 5. 删除有问题的函数
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.update_company_last_modified();
DROP FUNCTION IF EXISTS public.check_duplicate_update();
DROP FUNCTION IF EXISTS public.update_company_stats();

-- 6. 清理所有数据
DELETE FROM public.stories;
DELETE FROM public.fundings;
DELETE FROM public.projects;
DELETE FROM public.companies;

-- 7. 重新创建必要的函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. 重新创建触发器
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 9. 验证修复结果
SELECT '修复完成！' as status;
SELECT COUNT(*) as companies_count FROM public.companies;
SELECT COUNT(*) as projects_count FROM public.projects;
SELECT COUNT(*) as fundings_count FROM public.fundings;
SELECT COUNT(*) as stories_count FROM public.stories;
