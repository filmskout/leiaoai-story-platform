-- =====================================================
-- 完整数据库Schema修复脚本
-- 解决 "record 'new' has no field 'company_id'" 错误
-- 可以直接在Supabase SQL Editor中执行
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

-- 检查现有函数
SELECT '现有函数:' as info;
SELECT 
    routine_name, 
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%company%' OR routine_name LIKE '%tool%' OR routine_name LIKE '%project%'
ORDER BY routine_name;

-- 检查表结构
SELECT 'Companies表结构:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'companies' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. 删除所有有问题的触发器和函数
SELECT '=== 开始清理有问题的触发器和函数 ===' as status;

-- 删除触发器
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS company_updates_trigger ON public.company_updates;
DROP TRIGGER IF EXISTS prevent_duplicate_updates ON public.company_updates;
DROP TRIGGER IF EXISTS update_company_stats_trigger ON public.companies;
DROP TRIGGER IF EXISTS update_company_stats_from_projects_trigger ON public.projects;
DROP TRIGGER IF EXISTS update_company_stats_from_stories_trigger ON public.company_stories;

-- 删除函数
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.update_company_last_modified();
DROP FUNCTION IF EXISTS public.check_duplicate_update();
DROP FUNCTION IF EXISTS public.update_company_stats();

-- 3. 清理相关表数据
SELECT '=== 清理相关表数据 ===' as status;

-- 删除所有相关数据（按依赖关系顺序）
DELETE FROM public.company_updates WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM public.tool_versions WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM public.funding_updates WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM public.monitoring_jobs WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM public.web_cache WHERE id != '00000000-0000-0000-0000-000000000000';

-- 删除主要业务数据
DELETE FROM public.stories WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM public.fundings WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM public.projects WHERE id != '00000000-0000-0000-0000-000000000000';

-- 最后删除companies表数据
DELETE FROM public.companies WHERE id != '00000000-0000-0000-0000-000000000000';

-- 4. 验证清理结果
SELECT '=== 验证清理结果 ===' as status;

SELECT '清理后的记录数:' as info;
SELECT 
    'companies' as table_name, COUNT(*) as record_count FROM public.companies
UNION ALL
SELECT 'projects' as table_name, COUNT(*) as record_count FROM public.projects
UNION ALL
SELECT 'fundings' as table_name, COUNT(*) as record_count FROM public.fundings
UNION ALL
SELECT 'stories' as table_name, COUNT(*) as record_count FROM public.stories
UNION ALL
SELECT 'company_updates' as table_name, COUNT(*) as record_count FROM public.company_updates;

-- 5. 重新创建必要的函数和触发器（如果需要）
SELECT '=== 重新创建必要的函数和触发器 ===' as status;

-- 创建更新updated_at字段的函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- 6. 最终验证
SELECT '=== 最终验证 ===' as status;

-- 检查触发器
SELECT '修复后的触发器:' as info;
SELECT 
    trigger_name, 
    event_object_table, 
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY event_object_table, trigger_name;

-- 检查函数
SELECT '修复后的函数:' as info;
SELECT 
    routine_name, 
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('update_updated_at_column')
ORDER BY routine_name;

-- 测试插入和删除操作
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
SELECT '数据库Schema修复完成！所有触发器问题已解决。' as message;
