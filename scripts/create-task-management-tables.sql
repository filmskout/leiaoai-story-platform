-- 创建任务管理表
CREATE TABLE IF NOT EXISTS background_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id VARCHAR(255) UNIQUE NOT NULL,
  task_type VARCHAR(100) NOT NULL, -- 'generate-full-data', 'reconfigure', 'clear-database'
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'paused'
  progress JSONB DEFAULT '{"current": 0, "total": 0, "percentage": 0}',
  current_step TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  result_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建任务日志表
CREATE TABLE IF NOT EXISTS task_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id VARCHAR(255) NOT NULL,
  log_level VARCHAR(20) NOT NULL, -- 'info', 'warning', 'error'
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建任务进度表
CREATE TABLE IF NOT EXISTS task_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id VARCHAR(255) NOT NULL,
  step_name VARCHAR(255) NOT NULL,
  step_progress JSONB DEFAULT '{"current": 0, "total": 0}',
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_background_tasks_task_id ON background_tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_background_tasks_status ON background_tasks(status);
CREATE INDEX IF NOT EXISTS idx_task_logs_task_id ON task_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_task_progress_task_id ON task_progress(task_id);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_background_tasks_updated_at BEFORE UPDATE ON background_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_progress_updated_at BEFORE UPDATE ON task_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
