-- 详细检查stories表

-- 1. 检查stories表是否存在
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stories')
    THEN 'stories表存在'
    ELSE 'stories表不存在！'
  END as table_status;

-- 2. 如果存在，显示所有列
SELECT 
  column_name,
  data_type,
  udt_name,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'stories'
ORDER BY ordinal_position;

-- 3. 显示所有约束
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'stories'
ORDER BY tc.constraint_type, kcu.column_name;

-- 4. 显示主键详细信息
SELECT 
  kcu.column_name as primary_key_column,
  c.data_type,
  c.udt_name as underlying_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.columns c
  ON kcu.table_name = c.table_name 
  AND kcu.column_name = c.column_name
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'stories'
  AND tc.constraint_type = 'PRIMARY KEY';

