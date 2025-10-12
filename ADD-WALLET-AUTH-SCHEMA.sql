-- ============================================================================
-- 添加Web3钱包认证支持到数据库Schema
-- ============================================================================
-- 为profiles表添加钱包地址和类型字段
-- ============================================================================

-- 步骤1: 添加钱包相关列到profiles表
-- ============================================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS wallet_type TEXT CHECK (wallet_type IN ('ethereum', 'solana', NULL));

-- 步骤2: 添加索引以提高钱包查询性能
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address 
ON profiles(wallet_address) 
WHERE wallet_address IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_wallet_type 
ON profiles(wallet_type) 
WHERE wallet_type IS NOT NULL;

-- 步骤3: 添加唯一约束确保每个钱包地址只能关联一个账户
-- ============================================================================

-- 注意：如果已有重复数据，需要先清理
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_wallet_unique 
ON profiles(wallet_address) 
WHERE wallet_address IS NOT NULL;

-- 步骤4: 验证修改
-- ============================================================================

-- 查看profiles表结构
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('wallet_address', 'wallet_type')
ORDER BY ordinal_position;

-- 查看新创建的索引
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
AND indexname LIKE '%wallet%';

-- 步骤5: 更新现有的RLS策略（如果需要）
-- ============================================================================

-- profiles表的RLS策略应该已经存在
-- 检查现有策略
SELECT schemaname, tablename, policyname, cmd, permissive
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 如果需要，可以添加特定的钱包访问策略
-- 这里假设现有的RLS策略已经足够

-- ============================================================================
-- 完成！
-- ============================================================================

/*
运行完这些SQL后，profiles表将支持：

1. ✅ wallet_address - 存储Ethereum或Solana钱包地址
2. ✅ wallet_type - 钱包类型（'ethereum' 或 'solana'）
3. ✅ 索引优化 - 快速查询钱包地址
4. ✅ 唯一约束 - 防止一个钱包关联多个账户

使用场景：
- 用户可以通过Web3钱包（MetaMask, Phantom等）登录
- 用户可以在设置中绑定/解绑钱包地址
- 系统可以通过钱包地址识别用户
- 支持Ethereum和Solana两种主流区块链

注意事项：
1. 钱包地址应该存储为小写以确保一致性
2. 用户可以同时有邮箱和钱包登录方式
3. 建议在应用层验证钱包签名的有效性
4. 钱包登录时生成的email格式: {wallet_address}@wallet.leiaoai.local
*/

-- 显示最终状态
SELECT 
    '✅ Wallet authentication schema added' as status,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_name = 'profiles' 
     AND column_name IN ('wallet_address', 'wallet_type')) as column_count,
    (SELECT COUNT(*) FROM pg_indexes 
     WHERE tablename = 'profiles' 
     AND indexname LIKE '%wallet%') as index_count;

-- ============================================================================
-- Google OAuth说明
-- ============================================================================

/*
Google OAuth集成不需要额外的数据库字段，因为：

1. Supabase自动处理Google OAuth:
   - 用户点击"Sign in with Google"
   - Supabase重定向到Google登录
   - Google返回后Supabase创建用户账户
   - auth.users表自动填充Google提供的信息

2. 用户信息自动同步:
   - email: 从Google获取
   - full_name: 从Google显示名称
   - avatar_url: 从Google头像URL
   - 这些都存储在profiles表中

3. Supabase Dashboard配置:
   需要在Supabase Dashboard中启用Google OAuth：
   - Authentication → Providers → Google
   - 添加Google Client ID和Secret
   - 设置Redirect URL

不需要额外的数据库修改！
*/

-- ============================================================================
-- 测试查询
-- ============================================================================

-- 查询所有使用钱包登录的用户
-- SELECT 
--     user_id,
--     username,
--     wallet_address,
--     wallet_type,
--     created_at
-- FROM profiles
-- WHERE wallet_address IS NOT NULL
-- ORDER BY created_at DESC;

-- 查询特定钱包地址的用户
-- SELECT * FROM profiles 
-- WHERE wallet_address = '0x...' -- 替换为实际钱包地址
-- LIMIT 1;

-- 统计各认证方式的用户数
-- SELECT 
--     CASE 
--         WHEN wallet_address IS NOT NULL THEN wallet_type || ' wallet'
--         WHEN email LIKE '%@gmail.com' THEN 'Google OAuth'
--         ELSE 'Email/Password'
--     END as auth_method,
--     COUNT(*) as user_count
-- FROM profiles
-- GROUP BY auth_method
-- ORDER BY user_count DESC;

