-- 检查当前数据库结构
-- 在Supabase SQL编辑器中运行此查询来查看现有表

-- 1. 查看所有表
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. 检查是否有projects表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('tools', 'projects', 'tool_ratings', 'project_ratings');

-- 3. 检查companies表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'companies'
ORDER BY ordinal_position;
