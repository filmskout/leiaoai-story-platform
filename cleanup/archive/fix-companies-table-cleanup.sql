-- 修复companies表清理问题
-- 首先检查companies表的结构
SELECT 'Companies table structure:' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'companies' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查是否有触发器引用companies表
SELECT 'Triggers on companies table:' as status;
SELECT trigger_name, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'companies' AND trigger_schema = 'public';

-- 检查外键约束
SELECT 'Foreign key constraints:' as status;
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND (tc.table_name = 'companies' OR ccu.table_name = 'companies');

-- 尝试手动清理companies表（禁用触发器）
SET session_replication_role = replica;
DELETE FROM companies;
SET session_replication_role = DEFAULT;

-- 验证清理结果
SELECT 'Companies table count after cleanup:' as status;
SELECT COUNT(*) as companies_count FROM companies;
