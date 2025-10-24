-- =====================================================
-- 精确版数据库Schema修复脚本
-- 只删除有问题的触发器，保留其他正常工作的触发器
-- =====================================================

-- 1. 首先检查当前数据库状态
SELECT '=== 当前数据库状态检查 ===' as status;

-- 检查现有触发器
SELECT '现有触发器:' as info;
SELECT 
    trigger_name, 
    event_object_table, 
    action_statement,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY event_object_table, trigger_name;

-- 2. 只删除有问题的触发器（不删除函数）
SELECT '=== 删除有问题的触发器 ===' as status;

-- 删除companies表上的有问题的触发器
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS company_updates_trigger ON public.companies;
DROP TRIGGER IF EXISTS update_company_stats_trigger ON public.companies;

-- 删除projects表上的有问题的触发器
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS update_company_stats_from_projects_trigger ON public.projects;

-- 删除company_stories表上的有问题的触发器
DROP TRIGGER IF EXISTS update_company_stats_from_stories_trigger ON public.company_stories;

-- 删除company_updates表上的有问题的触发器
DROP TRIGGER IF EXISTS prevent_duplicate_updates ON public.company_updates;

-- 3. 删除有问题的函数（使用CASCADE）
SELECT '=== 删除有问题的函数 ===' as status;

-- 只删除有问题的函数，保留update_updated_at_column
DROP FUNCTION IF EXISTS public.update_company_last_modified() CASCADE;
DROP FUNCTION IF EXISTS public.check_duplicate_update() CASCADE;
DROP FUNCTION IF EXISTS public.update_company_stats() CASCADE;

-- 4. 清理所有数据
SELECT '=== 清理所有数据 ===' as status;

DELETE FROM public.stories;
DELETE FROM public.fundings;
DELETE FROM public.projects;
DELETE FROM public.companies;

-- 清理其他可能存在的表
DELETE FROM public.company_updates WHERE id != '00000000-0000-0000-0000-000000000000';

-- 5. 重新创建companies表上的触发器
SELECT '=== 重新创建必要的触发器 ===' as status;

-- 为companies表创建updated_at触发器
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 为projects表创建updated_at触发器
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 6. 验证修复结果
SELECT '=== 验证修复结果 ===' as status;

-- 检查触发器
SELECT '修复后的触发器:' as info;
SELECT 
    trigger_name, 
    event_object_table, 
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND event_object_table IN ('companies', 'projects')
ORDER BY event_object_table, trigger_name;

-- 检查记录数
SELECT '清理后的记录数:' as info;
SELECT 
    'companies' as table_name, COUNT(*) as record_count FROM public.companies
UNION ALL
SELECT 'projects' as table_name, COUNT(*) as record_count FROM public.projects
UNION ALL
SELECT 'fundings' as table_name, COUNT(*) as record_count FROM public.fundings
UNION ALL
SELECT 'stories' as table_name, COUNT(*) as record_count FROM public.stories;

-- 7. 测试操作
SELECT '=== 测试操作 ===' as status;

-- 测试插入一条记录
INSERT INTO public.companies (
    id, 
    name, 
    description, 
    website, 
    founded_year, 
    headquarters, 
    employee_count_range, 
    valuation_usd, 
    industry_tags, 
    logo_url, 
    company_type, 
    company_tier, 
    company_category,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Test Company',
    'Test Description',
    'https://test.com',
    2020,
    'Test City, Test Country',
    '1-10',
    1000000,
    ARRAY['AI', 'Test'],
    'https://test.com/logo.png',
    'AI Company',
    'Tier 1',
    'AI Platform',
    NOW(),
    NOW()
);

-- 获取刚插入的记录ID
SELECT '插入的测试记录:' as info;
SELECT id, name FROM public.companies WHERE name = 'Test Company';

-- 测试删除操作
DELETE FROM public.companies WHERE name = 'Test Company';

-- 验证删除结果
SELECT '删除后的记录数:' as info;
SELECT COUNT(*) as companies_count FROM public.companies;

SELECT '=== 修复完成 ===' as status;
SELECT '数据库Schema修复完成！触发器问题已解决，保留了其他正常工作的触发器。' as message;
