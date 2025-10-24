-- 修复数据库触发器问题
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

-- 3. 检查并删除可能存在的其他触发器
SELECT 'Dropping additional triggers...' as status;

-- 删除所有可能的触发器
DO $$ 
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT trigger_name, event_object_table 
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public' 
        AND (trigger_name LIKE '%company%' OR trigger_name LIKE '%tool%' OR trigger_name LIKE '%project%')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I', 
                      trigger_record.trigger_name, 
                      trigger_record.event_object_table);
        RAISE NOTICE 'Dropped trigger % on table %', trigger_record.trigger_name, trigger_record.event_object_table;
    END LOOP;
END $$;

-- 4. 检查当前触发器状态
SELECT 'Current triggers after cleanup:' as status;
SELECT trigger_name, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY event_object_table, trigger_name;

-- 5. 验证表结构
SELECT 'Companies table structure:' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'companies' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. 测试删除操作
SELECT 'Testing delete operation...' as status;

-- 先检查有多少条记录
SELECT COUNT(*) as companies_count FROM public.companies;

-- 尝试删除一条记录来测试
DO $$
DECLARE
    test_id uuid;
    delete_result text;
BEGIN
    -- 获取第一条记录的ID
    SELECT id INTO test_id FROM public.companies LIMIT 1;
    
    IF test_id IS NOT NULL THEN
        -- 尝试删除
        BEGIN
            DELETE FROM public.companies WHERE id = test_id;
            RAISE NOTICE 'Successfully deleted test record: %', test_id;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Delete failed: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'No records found to test delete operation';
    END IF;
END $$;

-- 7. 最终验证
SELECT 'Final verification:' as status;
SELECT COUNT(*) as remaining_companies FROM public.companies;
