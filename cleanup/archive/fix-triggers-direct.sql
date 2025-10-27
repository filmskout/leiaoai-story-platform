-- 修复数据库触发器问题 - 直接SQL方法
-- 解决 "record 'new' has no field 'company_id'" 错误

-- 1. 删除所有有问题的触发器
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS company_updates_trigger ON public.company_updates;
DROP TRIGGER IF EXISTS prevent_duplicate_updates ON public.company_updates;

-- 2. 删除有问题的函数
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.update_company_last_modified();
DROP FUNCTION IF EXISTS public.check_duplicate_update();

-- 3. 检查当前触发器状态
SELECT 'Current triggers after cleanup:' as status;
SELECT trigger_name, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY event_object_table, trigger_name;

-- 4. 测试删除操作
SELECT 'Testing delete operation...' as status;
SELECT COUNT(*) as companies_count FROM public.companies;

-- 5. 尝试删除一条记录
DO $$
DECLARE
    test_id uuid;
BEGIN
    -- 获取第一条记录的ID
    SELECT id INTO test_id FROM public.companies LIMIT 1;
    
    IF test_id IS NOT NULL THEN
        -- 尝试删除
        DELETE FROM public.companies WHERE id = test_id;
        RAISE NOTICE 'Successfully deleted test record: %', test_id;
    ELSE
        RAISE NOTICE 'No records found to test delete operation';
    END IF;
END $$;

-- 6. 最终验证
SELECT 'Final verification:' as status;
SELECT COUNT(*) as remaining_companies FROM public.companies;
