-- Migration: enable_chat_rls_policies
-- Created at: 1758981162

-- 启用行级安全策略
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 创建聊天会话的RLS策略
CREATE POLICY "用户只能查看自己的聊天会话" ON chat_sessions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "用户只能创建自己的聊天会话" ON chat_sessions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "用户只能更新自己的聊天会话" ON chat_sessions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "用户只能删除自己的聊天会话" ON chat_sessions
    FOR DELETE USING (user_id = auth.uid());

-- 创建聊天消息的RLS策略
CREATE POLICY "用户只能查看自己会话的消息" ON chat_messages
    FOR SELECT USING (session_id IN (
        SELECT session_id FROM chat_sessions WHERE user_id = auth.uid()
    ));

CREATE POLICY "用户只能在自己的会话中创建消息" ON chat_messages
    FOR INSERT WITH CHECK (session_id IN (
        SELECT session_id FROM chat_sessions WHERE user_id = auth.uid()
    ));

CREATE POLICY "允许匿名用户访问聊天功能（临时策略）" ON chat_sessions
    FOR ALL USING (user_id IS NULL);

CREATE POLICY "允许匿名用户访问聊天消息（临时策略）" ON chat_messages
    FOR ALL USING (session_id IN (
        SELECT session_id FROM chat_sessions WHERE user_id IS NULL
    ));;