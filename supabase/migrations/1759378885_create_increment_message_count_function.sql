-- Migration: create_increment_message_count_function
-- Created at: 1759378885

-- Migration: create_increment_message_count_function
-- Created at: 1758996839

CREATE OR REPLACE FUNCTION increment_message_count(session_uuid UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE ai_chat_sessions 
    SET message_count = message_count + 1,
        updated_at = NOW()
    WHERE id = session_uuid;
END;
$$;;