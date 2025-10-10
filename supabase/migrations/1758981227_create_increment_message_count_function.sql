-- Migration: create_increment_message_count_function
-- Created at: 1758981227

-- 创建更新消息计数的数据库函数
CREATE OR REPLACE FUNCTION increment_message_count(session_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE chat_sessions 
    SET message_count = message_count + 2,
        updated_at = NOW()
    WHERE session_id = session_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;;