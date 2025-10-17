-- AI Companies Catalog Enhancement
-- 扩展现有的companies和tools表，添加评分、收藏、故事等功能

-- 扩展companies表，添加更多字段
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS founded_year int;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS headquarters text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS employee_count_range text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS valuation_usd numeric;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS last_funding_date date;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS industry_tags text[];
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb;

-- 扩展tools表，添加更多字段
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS pricing_model text;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS launch_date date;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS industry_tags text[];
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS api_available boolean DEFAULT false;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS free_tier boolean DEFAULT false;

-- 创建用户评分表
CREATE TABLE IF NOT EXISTS public.tool_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- 创建用户收藏表
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- 创建工具故事关联表（链接到现有的stories表）
CREATE TABLE IF NOT EXISTS public.tool_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  tool_id uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(story_id, tool_id)
);

-- 创建公司故事关联表
CREATE TABLE IF NOT EXISTS public.company_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(story_id, company_id)
);

-- 创建工具统计表（聚合评分数据）
CREATE TABLE IF NOT EXISTS public.tool_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  average_rating numeric(3,2) DEFAULT 0,
  total_ratings int DEFAULT 0,
  total_favorites int DEFAULT 0,
  total_stories int DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tool_id)
);

-- 创建公司统计表
CREATE TABLE IF NOT EXISTS public.company_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  total_tools int DEFAULT 0,
  average_tool_rating numeric(3,2) DEFAULT 0,
  total_stories int DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tool_ratings_user ON public.tool_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_ratings_tool ON public.tool_ratings(tool_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_tool ON public.user_favorites(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_stories_story ON public.tool_stories(story_id);
CREATE INDEX IF NOT EXISTS idx_tool_stories_tool ON public.tool_stories(tool_id);
CREATE INDEX IF NOT EXISTS idx_company_stories_story ON public.company_stories(story_id);
CREATE INDEX IF NOT EXISTS idx_company_stories_company ON public.company_stories(company_id);

-- 启用行级安全
ALTER TABLE public.tool_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_stats ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
DO $$ BEGIN
  CREATE POLICY tool_ratings_read_all ON public.tool_ratings FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY tool_ratings_insert_auth ON public.tool_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY tool_ratings_update_auth ON public.tool_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY tool_ratings_delete_auth ON public.tool_ratings FOR DELETE TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY user_favorites_read_all ON public.user_favorites FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY user_favorites_insert_auth ON public.user_favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY user_favorites_delete_auth ON public.user_favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY tool_stories_read_all ON public.tool_stories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY tool_stories_insert_auth ON public.tool_stories FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY company_stories_read_all ON public.company_stories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY company_stories_insert_auth ON public.company_stories FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY tool_stats_read_all ON public.tool_stats FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY company_stats_read_all ON public.company_stats FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 创建更新统计数据的函数
CREATE OR REPLACE FUNCTION update_tool_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新工具统计
  INSERT INTO public.tool_stats (tool_id, average_rating, total_ratings, total_favorites, total_stories)
  SELECT 
    COALESCE(NEW.tool_id, OLD.tool_id),
    COALESCE(AVG(r.rating), 0),
    COUNT(r.id),
    COUNT(f.id),
    COUNT(ts.id)
  FROM public.tools t
  LEFT JOIN public.tool_ratings r ON t.id = r.tool_id
  LEFT JOIN public.user_favorites f ON t.id = f.tool_id
  LEFT JOIN public.tool_stories ts ON t.id = ts.tool_id
  WHERE t.id = COALESCE(NEW.tool_id, OLD.tool_id)
  GROUP BY t.id
  ON CONFLICT (tool_id) DO UPDATE SET
    average_rating = EXCLUDED.average_rating,
    total_ratings = EXCLUDED.total_ratings,
    total_favorites = EXCLUDED.total_favorites,
    total_stories = EXCLUDED.total_stories,
    updated_at = now();
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_tool_stats_rating ON public.tool_ratings;
CREATE TRIGGER trigger_update_tool_stats_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.tool_ratings
  FOR EACH ROW EXECUTE FUNCTION update_tool_stats();

DROP TRIGGER IF EXISTS trigger_update_tool_stats_favorite ON public.user_favorites;
CREATE TRIGGER trigger_update_tool_stats_favorite
  AFTER INSERT OR DELETE ON public.user_favorites
  FOR EACH ROW EXECUTE FUNCTION update_tool_stats();

DROP TRIGGER IF EXISTS trigger_update_tool_stats_story ON public.tool_stories;
CREATE TRIGGER trigger_update_tool_stats_story
  AFTER INSERT OR DELETE ON public.tool_stories
  FOR EACH ROW EXECUTE FUNCTION update_tool_stats();

-- 创建更新公司统计的函数
CREATE OR REPLACE FUNCTION update_company_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新公司统计
  INSERT INTO public.company_stats (company_id, total_tools, average_tool_rating, total_stories)
  SELECT 
    COALESCE(NEW.company_id, OLD.company_id),
    COUNT(t.id),
    COALESCE(AVG(ts.average_rating), 0),
    COUNT(cs.id)
  FROM public.companies c
  LEFT JOIN public.tools t ON c.id = t.company_id
  LEFT JOIN public.tool_stats ts ON t.id = ts.tool_id
  LEFT JOIN public.company_stories cs ON c.id = cs.company_id
  WHERE c.id = COALESCE(NEW.company_id, OLD.company_id)
  GROUP BY c.id
  ON CONFLICT (company_id) DO UPDATE SET
    total_tools = EXCLUDED.total_tools,
    average_tool_rating = EXCLUDED.average_tool_rating,
    total_stories = EXCLUDED.total_stories,
    updated_at = now();
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_company_stats_tool ON public.tools;
CREATE TRIGGER trigger_update_company_stats_tool
  AFTER INSERT OR UPDATE OR DELETE ON public.tools
  FOR EACH ROW EXECUTE FUNCTION update_company_stats();

DROP TRIGGER IF EXISTS trigger_update_company_stats_story ON public.company_stories;
CREATE TRIGGER trigger_update_company_stats_story
  AFTER INSERT OR DELETE ON public.company_stories
  FOR EACH ROW EXECUTE FUNCTION update_company_stats();
