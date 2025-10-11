-- 步骤1: 先运行这个SQL来检查stories表的结构
-- 复制结果并告诉我主键列名是什么

SELECT 
  c.column_name,
  c.data_type,
  CASE 
    WHEN pk.column_name IS NOT NULL THEN 'PRIMARY KEY'
    ELSE ''
  END as key_type
FROM information_schema.columns c
LEFT JOIN (
  SELECT kcu.column_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
  WHERE tc.table_schema = 'public'
    AND tc.table_name = 'stories'
    AND tc.constraint_type = 'PRIMARY KEY'
) pk ON c.column_name = pk.column_name
WHERE c.table_schema = 'public' 
  AND c.table_name = 'stories'
ORDER BY c.ordinal_position;

