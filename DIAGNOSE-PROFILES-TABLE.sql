-- ============================================================================
-- 诊断profiles表问题
-- ============================================================================

-- 1. 检查profiles表是否存在
SELECT 
    'profiles table exists' as check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles'
        ) THEN '✅ YES'
        ELSE '❌ NO - Table does not exist!'
    END as result;

-- 2. 如果表存在，显示所有列
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. 检查是否已经有wallet相关列
SELECT 
    'wallet columns exist' as check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles'
            AND column_name IN ('wallet_address', 'wallet_type')
        ) THEN '✅ YES - Already added'
        ELSE '❌ NO - Need to add'
    END as result;

-- 4. 列出所有public schema中的表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 5. 检查是否可能是不同的schema
SELECT 
    table_schema,
    table_name
FROM information_schema.tables 
WHERE table_name = 'profiles'
ORDER BY table_schema;

-- ============================================================================
-- 根据结果判断：
-- ============================================================================

/*
场景1: profiles表存在但没有wallet列
  → 运行ADD-WALLET-AUTH-STEP-BY-STEP.sql从步骤2开始

场景2: profiles表不存在
  → 需要先创建profiles表
  → 可能使用了不同的表名（如user_profiles, users_profiles等）

场景3: profiles表在不同的schema中
  → 需要明确指定schema名称

场景4: wallet列已存在
  → 跳过列添加，直接创建索引
*/

