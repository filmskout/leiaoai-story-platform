-- ============================================
-- 迁移文件 2: Chat Sessions Setup
-- ============================================

-- 1. 创建chat_sessions表
CREATE TABLE IF NOT EXISTS chat_sessions (
  session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '新的对话',
  category TEXT,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. 创建chat_messages表
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(session_id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  ai_model TEXT,
  processing_time NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_category ON chat_sessions(category);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- 4. 启用RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 5. 删除旧的policies
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can insert their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can delete their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Allow anonymous chat sessions" ON chat_sessions;

DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert chat messages in their sessions" ON chat_messages;

-- 6. 创建RLS policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own chat sessions"
  ON chat_sessions FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow anonymous chat sessions"
  ON chat_sessions FOR ALL
  USING (user_id IS NULL);

-- 7. 创建RLS policies for chat_messages
CREATE POLICY "Users can view their own chat messages"
  ON chat_messages FOR SELECT
  USING (
    session_id IN (
      SELECT session_id FROM chat_sessions 
      WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

CREATE POLICY "Users can insert chat messages in their sessions"
  ON chat_messages FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT session_id FROM chat_sessions 
      WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

-- 8. 删除旧视图（如果存在）
DROP VIEW IF EXISTS sessions_by_category;

-- 9. 创建视图：按category统计sessions
CREATE VIEW sessions_by_category AS
SELECT 
  category,
  COUNT(*) as session_count,
  MAX(created_at) as last_session_at
FROM chat_sessions
WHERE category IS NOT NULL
GROUP BY category
ORDER BY session_count DESC;

