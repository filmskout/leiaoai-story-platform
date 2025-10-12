-- ============================================================================
-- 修复 Chat Sessions Schema 问题
-- ============================================================================
-- 问题：Could not find the 'message_count' column of 'chat_sessions'
-- ============================================================================

-- 步骤1: 检查chat_sessions表的当前结构
-- ============================================================================

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'chat_sessions'
ORDER BY ordinal_position;

-- 步骤2: 添加缺失的message_count列（如果不存在）
-- ============================================================================

ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;

-- 步骤3: 确保所有必需的列都存在
-- ============================================================================

-- 确保有session_id列
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4();

-- 确保有user_id列
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 确保有title列
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '新的对话';

-- 确保有category列
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS category TEXT;

-- 确保有markdown_file_url列
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS markdown_file_url TEXT;

-- 确保有markdown_file_path列
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS markdown_file_path TEXT;

-- 确保有时间戳列
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 步骤4: 创建或替换更新时间戳的触发器
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;

CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 步骤5: 验证表结构
-- ============================================================================

SELECT 
    column_name, 
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'chat_sessions'
ORDER BY ordinal_position;

-- 预期结果：应该看到所有必需的列
-- session_id, user_id, title, category, message_count, 
-- markdown_file_url, markdown_file_path, created_at, updated_at

-- 步骤6: 检查chat_messages表的RLS策略
-- ============================================================================

-- 查看当前策略
SELECT schemaname, tablename, policyname, cmd, permissive, roles
FROM pg_policies
WHERE tablename = 'chat_messages'
ORDER BY policyname;

-- 步骤7: 添加或更新chat_messages的RLS策略
-- ============================================================================

-- 启用RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Users can insert their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;

-- 创建新策略：允许用户插入自己的消息
CREATE POLICY "Users can insert their own chat messages"
ON chat_messages FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM chat_sessions
        WHERE chat_sessions.session_id = chat_messages.session_id
        AND chat_sessions.user_id = auth.uid()
    )
);

-- 创建新策略：允许用户查看自己的消息
CREATE POLICY "Users can view their own chat messages"
ON chat_messages FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM chat_sessions
        WHERE chat_sessions.session_id = chat_messages.session_id
        AND chat_sessions.user_id = auth.uid()
    )
);

-- 步骤8: 验证RLS策略
-- ============================================================================

SELECT policyname, cmd, permissive
FROM pg_policies
WHERE tablename IN ('chat_sessions', 'chat_messages')
ORDER BY tablename, policyname;

-- 步骤9: 测试插入（可选）
-- ============================================================================

-- 注意：这个测试需要在用户登录的上下文中运行
-- DO $$
-- DECLARE
--     test_session_id UUID;
-- BEGIN
--     test_session_id := uuid_generate_v4();
--     
--     -- 测试创建会话
--     INSERT INTO chat_sessions (
--         session_id, user_id, title, category, message_count
--     ) VALUES (
--         test_session_id, auth.uid(), '测试会话', 'test', 0
--     );
--     
--     -- 测试创建消息
--     INSERT INTO chat_messages (
--         session_id, role, content, ai_model, processing_time
--     ) VALUES (
--         test_session_id, 'user', '测试消息', NULL, NULL
--     );
--     
--     -- 清理测试数据
--     DELETE FROM chat_messages WHERE session_id = test_session_id;
--     DELETE FROM chat_sessions WHERE session_id = test_session_id;
--     
--     RAISE NOTICE '✅ 测试通过：可以创建会话和消息';
-- END $$;

-- ============================================================================
-- 完成！
-- ============================================================================

/*
运行完这些SQL后：

1. chat_sessions表将有所有必需的列
2. chat_messages的RLS策略将允许用户插入和查看自己的消息
3. 会话创建应该成功

如果还有问题，请检查：
1. auth.users表是否存在
2. 用户是否已登录（auth.uid() 不为 null）
3. Extension uuid-ossp是否已启用
*/

-- 检查必需的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 显示最终状态
SELECT 
    '✅ Schema 修复完成' as status,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_name = 'chat_sessions') as column_count,
    (SELECT COUNT(*) FROM pg_policies 
     WHERE tablename = 'chat_messages') as policy_count;

