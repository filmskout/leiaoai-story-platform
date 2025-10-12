-- ============================================================================
-- Web3钱包认证 - 分步执行指南
-- ============================================================================
-- 请按顺序逐步执行每个步骤，确认每步成功后再进行下一步
-- ============================================================================

-- ============================================================================
-- 步骤0: 检查profiles表是否存在
-- ============================================================================

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- 如果没有返回结果，表不存在，需要先创建profiles表
-- 如果有返回结果，继续下一步

-- ============================================================================
-- 步骤1: 查看profiles表当前结构
-- ============================================================================

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 查看是否已经有wallet_address和wallet_type列

-- ============================================================================
-- 步骤2: 添加wallet_address列
-- ============================================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- 验证添加成功
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'wallet_address';

-- 应该返回一行：wallet_address | text

-- ============================================================================
-- 步骤3: 添加wallet_type列（带CHECK约束）
-- ============================================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS wallet_type TEXT;

-- 如果列已存在，添加CHECK约束（如果还没有）
DO $$ 
BEGIN
    -- 尝试添加CHECK约束
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_wallet_type_check'
    ) THEN
        ALTER TABLE profiles 
        ADD CONSTRAINT profiles_wallet_type_check 
        CHECK (wallet_type IN ('ethereum', 'solana', NULL));
    END IF;
END $$;

-- 验证添加成功
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'wallet_type';

-- 应该返回一行：wallet_type | text

-- ============================================================================
-- 步骤4: 验证两列都已添加
-- ============================================================================

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('wallet_address', 'wallet_type')
ORDER BY column_name;

-- 应该返回两行：
-- wallet_address | text | YES
-- wallet_type    | text | YES

-- ============================================================================
-- 步骤5: 添加wallet_address索引
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address 
ON profiles(wallet_address) 
WHERE wallet_address IS NOT NULL;

-- 验证索引创建成功
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
AND indexname = 'idx_profiles_wallet_address';

-- ============================================================================
-- 步骤6: 添加wallet_type索引
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_wallet_type 
ON profiles(wallet_type) 
WHERE wallet_type IS NOT NULL;

-- 验证索引创建成功
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
AND indexname = 'idx_profiles_wallet_type';

-- ============================================================================
-- 步骤7: 添加唯一约束（确保一个钱包只能关联一个账户）
-- ============================================================================

-- 首先检查是否有重复的钱包地址
SELECT wallet_address, COUNT(*) as count
FROM profiles
WHERE wallet_address IS NOT NULL
GROUP BY wallet_address
HAVING COUNT(*) > 1;

-- 如果有重复，需要先清理，否则继续
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_wallet_unique 
ON profiles(wallet_address) 
WHERE wallet_address IS NOT NULL;

-- 验证唯一索引创建成功
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
AND indexname = 'idx_profiles_wallet_unique';

-- ============================================================================
-- 步骤8: 查看所有钱包相关的索引
-- ============================================================================

SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
AND indexname LIKE '%wallet%'
ORDER BY indexname;

-- 应该看到3个索引：
-- idx_profiles_wallet_address
-- idx_profiles_wallet_type
-- idx_profiles_wallet_unique

-- ============================================================================
-- 步骤9: 检查profiles表的RLS策略
-- ============================================================================

SELECT schemaname, tablename, policyname, cmd, permissive, roles
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 确保有足够的策略允许用户读写自己的profile

-- ============================================================================
-- 步骤10: 最终验证
-- ============================================================================

SELECT 
    '✅ Wallet authentication schema added' as status,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_name = 'profiles' 
     AND column_name IN ('wallet_address', 'wallet_type')) as column_count,
    (SELECT COUNT(*) FROM pg_indexes 
     WHERE tablename = 'profiles' 
     AND indexname LIKE '%wallet%') as index_count;

-- 期望结果：
-- status: ✅ Wallet authentication schema added
-- column_count: 2
-- index_count: 3

-- ============================================================================
-- 完成！
-- ============================================================================

/*
如果所有步骤都成功：
✅ wallet_address列已添加
✅ wallet_type列已添加（带CHECK约束）
✅ 3个索引已创建
✅ 唯一约束已添加

现在可以：
1. 使用Ethereum钱包登录（MetaMask）
2. 使用Solana钱包登录（Phantom）
3. 在应用中绑定/解绑钱包地址
*/

