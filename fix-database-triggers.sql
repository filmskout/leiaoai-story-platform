-- 修复数据库触发器，将 tools 引用改为 projects
-- 首先检查现有的触发器
SELECT 'Current triggers:' as status;
SELECT trigger_name, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name LIKE '%company%' OR trigger_name LIKE '%tool%' OR trigger_name LIKE '%project%';

-- 删除旧的触发器
DROP TRIGGER IF EXISTS update_company_stats_trigger ON companies;
DROP TRIGGER IF EXISTS update_company_stats_trigger ON tools;
DROP TRIGGER IF EXISTS update_company_stats_trigger ON projects;

-- 删除旧的函数
DROP FUNCTION IF EXISTS update_company_stats();

-- 创建新的更新公司统计函数
CREATE OR REPLACE FUNCTION update_company_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.company_stats (
    company_id, 
    total_projects, 
    average_project_rating, 
    total_stories,
    created_at,
    updated_at
  )
  SELECT 
    COALESCE(NEW.company_id, OLD.company_id),
    COUNT(p.id),
    COALESCE(AVG(ps.average_rating), 0),
    COUNT(cs.id),
    NOW(),
    NOW()
  FROM public.companies c
  LEFT JOIN public.projects p ON c.id = p.company_id
  LEFT JOIN public.project_stats ps ON p.id = ps.project_id
  LEFT JOIN public.company_stories cs ON c.id = cs.company_id
  WHERE c.id = COALESCE(NEW.company_id, OLD.company_id)
  GROUP BY c.id
  ON CONFLICT (company_id) DO UPDATE SET
    total_projects = EXCLUDED.total_projects,
    average_project_rating = EXCLUDED.average_project_rating,
    total_stories = EXCLUDED.total_stories,
    updated_at = NOW();

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 创建新的触发器
CREATE TRIGGER update_company_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_company_stats();

CREATE TRIGGER update_company_stats_from_projects_trigger
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_company_stats();

CREATE TRIGGER update_company_stats_from_stories_trigger
  AFTER INSERT OR UPDATE OR DELETE ON company_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_company_stats();

-- 检查 company_stats 表结构
SELECT 'Company stats table structure:' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'company_stats' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 如果 company_stats 表没有正确的列，添加它们
DO $$ 
BEGIN
  -- 添加 total_projects 列（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'company_stats' 
    AND column_name = 'total_projects' 
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.company_stats ADD COLUMN total_projects INTEGER DEFAULT 0;
  END IF;

  -- 添加 average_project_rating 列（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'company_stats' 
    AND column_name = 'average_project_rating' 
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.company_stats ADD COLUMN average_project_rating DECIMAL(3,2) DEFAULT 0;
  END IF;

  -- 删除旧的列（如果存在）
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'company_stats' 
    AND column_name = 'total_tools' 
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.company_stats DROP COLUMN total_tools;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'company_stats' 
    AND column_name = 'average_tool_rating' 
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.company_stats DROP COLUMN average_tool_rating;
  END IF;
END $$;

-- 更新所有现有的 company_stats 记录
UPDATE public.company_stats 
SET 
  total_projects = (
    SELECT COUNT(*) 
    FROM public.projects p 
    WHERE p.company_id = company_stats.company_id
  ),
  average_project_rating = (
    SELECT COALESCE(AVG(ps.average_rating), 0)
    FROM public.projects p
    LEFT JOIN public.project_stats ps ON p.id = ps.project_id
    WHERE p.company_id = company_stats.company_id
  ),
  updated_at = NOW();

-- 验证修复结果
SELECT 'Fixed triggers and updated stats:' as status;
SELECT 
  cs.company_id,
  c.name as company_name,
  cs.total_projects,
  cs.average_project_rating,
  cs.total_stories
FROM public.company_stats cs
JOIN public.companies c ON cs.company_id = c.id
ORDER BY cs.total_projects DESC
LIMIT 10;
