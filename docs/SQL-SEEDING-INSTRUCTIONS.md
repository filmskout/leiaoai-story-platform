# SQL Editor Copy-Paste Instructions for AI Companies Database Seeding

## Prerequisites
1. Open your Supabase SQL Editor
2. Make sure you have the necessary permissions to create tables and insert data
3. Run these scripts in the exact order shown below

## Step 1: Create Database Schema
Copy and paste this first to create all tables and relationships:

```sql
-- Run this first: Create database schema
-- File: 2025-01-20_ai_companies_catalog.sql

-- Add new columns to companies table
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS valuation_usd numeric;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS funding_status text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS industry_tags text[];
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb;

-- Extend tools table, add more fields
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS pricing_model text;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS launch_date date;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS industry_tags text[];
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS api_available boolean DEFAULT false;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS free_tier boolean DEFAULT false;

-- New table for user ratings on tools
create table if not exists public.tool_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  review_text text,
  created_at timestamptz not null default now(),
  unique (user_id, tool_id)
);

-- New table for user favorites
create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, tool_id)
);

-- New table to link stories to tools
create table if not exists public.tool_stories (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (story_id, tool_id)
);

-- New table to link stories to companies
create table if not exists public.company_stories (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (story_id, company_id)
);

-- Table for aggregated tool statistics
create table if not exists public.tool_stats (
  tool_id uuid primary key references public.tools(id) on delete cascade,
  average_rating numeric default 0,
  total_ratings int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table for aggregated company statistics
create table if not exists public.company_stats (
  company_id uuid primary key references public.companies(id) on delete cascade,
  total_tools int default 0,
  average_tool_rating numeric default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS policies for new tables
alter table public.tool_ratings enable row level security;
create policy "tool_ratings_read_all" on public.tool_ratings for select using (true);
create policy "tool_ratings_insert_auth" on public.tool_ratings for insert to authenticated with check (true);
create policy "tool_ratings_update_auth" on public.tool_ratings for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tool_ratings_delete_auth" on public.tool_ratings for delete to authenticated using (user_id = auth.uid());

alter table public.user_favorites enable row level security;
create policy "user_favorites_read_all" on public.user_favorites for select using (true);
create policy "user_favorites_insert_auth" on public.user_favorites for insert to authenticated with check (true);
create policy "user_favorites_delete_auth" on public.user_favorites for delete to authenticated using (user_id = auth.uid());

alter table public.tool_stories enable row level security;
create policy "tool_stories_read_all" on public.tool_stories for select using (true);
create policy "tool_stories_insert_auth" on public.tool_stories for insert to authenticated with check (true);

alter table public.company_stories enable row level security;
create policy "company_stories_read_all" on public.company_stories for select using (true);
create policy "company_stories_insert_auth" on public.company_stories for insert to authenticated with check (true);

alter table public.tool_stats enable row level security;
create policy "tool_stats_read_all" on public.tool_stats for select using (true);

alter table public.company_stats enable row level security;
create policy "company_stats_read_all" on public.company_stats for select using (true);

-- Functions and Triggers for tool_stats
create or replace function public.update_tool_average_rating()
returns trigger as $$
begin
  insert into public.tool_stats (tool_id, average_rating, total_ratings)
  values (new.tool_id, new.rating, 1)
  on conflict (tool_id) do update
  set
    average_rating = (
      (select sum(rating) from public.tool_ratings where tool_id = new.tool_id) + new.rating
    ) / (
      (select count(*) from public.tool_ratings where tool_id = new.tool_id) + 1
    ),
    total_ratings = (select count(*) from public.tool_ratings where tool_id = new.tool_id) + 1,
    updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger tool_ratings_after_insert
after insert on public.tool_ratings
for each row execute function public.update_tool_average_rating();

-- Functions and Triggers for company_stats
create or replace function public.update_company_tool_stats()
returns trigger as $$
declare
  company_id_val uuid;
begin
  if tg_op = 'INSERT' or tg_op = 'UPDATE' then
    company_id_val := new.company_id;
  else
    company_id_val := old.company_id;
  end if;

  insert into public.company_stats (company_id, total_tools, average_tool_rating)
  values (company_id_val, 0, 0) -- Initial values, will be updated by select
  on conflict (company_id) do update
  set
    total_tools = (select count(*) from public.tools where company_id = company_id_val),
    average_tool_rating = (select avg(ts.average_rating) from public.tools t join public.tool_stats ts on t.id = ts.tool_id where t.company_id = company_id_val),
    updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger tools_after_change
after insert or update or delete on public.tools
for each row execute function public.update_company_tool_stats();
```

## Step 2: Insert Core AI Companies
Copy and paste this to add the main AI companies:

```sql
-- Run this second: Core AI companies from a16z reports
-- File: 2025-01-20_complete_ai_companies.sql

INSERT INTO public.companies (id, name, website, description, logo_url, valuation_usd, funding_status, industry_tags)
VALUES
('00000000-0000-0000-0000-000000000001', 'OpenAI', 'https://openai.com', 'OpenAI is an AI research and deployment company dedicated to ensuring that artificial general intelligence benefits all of humanity.', 'https://openai.com/favicon.ico', 300000000000, 'Series E', '{"Conversational AI", "Code Generation", "Image Generation", "Video Generation", "API"}'),
('00000000-0000-0000-0000-000000000002', 'Anthropic', 'https://www.anthropic.com', 'Anthropic focuses on creating reliable and interpretable AI systems, with Claude being their flagship conversational AI model.', 'https://www.anthropic.com/favicon.ico', 61500000000, 'Series D', '{"Conversational AI", "LLM"}'),
('00000000-0000-0000-0000-000000000003', 'Google', 'https://ai.google', 'Google is a global technology company that provides AI-powered products and services across search, cloud, and consumer applications.', 'https://www.google.com/favicon.ico', 1800000000000, 'Public', '{"Search", "AI Platform", "Cloud AI", "Multimodal AI"}'),
('00000000-0000-0000-0000-000000000004', 'Microsoft', 'https://www.microsoft.com', 'Microsoft is a technology company that provides AI solutions through Azure, Office 365, and various enterprise services.', 'https://www.microsoft.com/favicon.ico', 3000000000000, 'Public', '{"Enterprise AI", "Cloud AI", "Productivity"}'),
('00000000-0000-0000-0000-000000000005', 'Meta', 'https://ai.meta.com', 'Meta develops AI technologies for social media, virtual reality, and augmented reality applications.', 'https://www.meta.com/favicon.ico', 800000000000, 'Public', '{"Social AI", "VR/AR", "LLM"}'),
('00000000-0000-0000-0000-000000000006', 'Perplexity AI', 'https://www.perplexity.ai', 'Perplexity AI is a conversational AI-powered search engine that provides accurate answers with sources.', 'https://www.perplexity.ai/favicon.ico', 9000000000, 'Series C', '{"Search", "Conversational AI", "Information Retrieval"}'),
('00000000-0000-0000-0000-000000000007', 'Scale AI', 'https://scale.com', 'Scale AI provides data labeling and AI infrastructure services for machine learning teams.', 'https://scale.com/favicon.ico', 14000000000, 'Series E', '{"Data Labeling", "AI Infrastructure", "MLOps"}'),
('00000000-0000-0000-0000-000000000008', 'Databricks', 'https://www.databricks.com', 'Databricks provides a unified analytics platform for big data and machine learning.', 'https://www.databricks.com/favicon.ico', 62000000000, 'Series H', '{"Data Analytics", "ML Platform", "Big Data"}'),
('00000000-0000-0000-0000-000000000009', 'Hugging Face', 'https://huggingface.co', 'Hugging Face is a platform that provides tools and resources for natural language processing and machine learning.', 'https://huggingface.co/favicon.ico', 4000000000, 'Series C', '{"NLP", "Open Source", "ML Platform"}'),
('00000000-0000-0000-0000-000000000010', 'Stability AI', 'https://stability.ai', 'Stability AI develops open-source AI models for image generation and other creative applications.', 'https://stability.ai/favicon.ico', 1000000000, 'Series A', '{"Image Generation", "Open Source", "Creative AI"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  description = EXCLUDED.description,
  logo_url = EXCLUDED.logo_url,
  valuation_usd = EXCLUDED.valuation_usd,
  funding_status = EXCLUDED.funding_status,
  industry_tags = EXCLUDED.industry_tags;
```

## Step 3: Insert AI Tools
Copy and paste this to add the tools for each company:

```sql
-- Run this third: AI tools for each company
-- File: 2025-01-20_complete_ai_tools.sql

INSERT INTO public.tools (id, company_id, name, category, description, website, logo_url, pricing_model, launch_date, industry_tags, features, api_available, free_tier)
VALUES
('00000000-0000-0000-0000-000000000101', (SELECT id FROM public.companies WHERE name = 'OpenAI'), 'ChatGPT', 'Conversational AI', 'An AI language model designed for generating human-like text based on user prompts.', 'https://chat.openai.com', 'https://chat.openai.com/favicon.ico', 'Freemium', '2022-11-30', '{"Customer Support", "Content Creation", "Education"}', '["Text Generation", "Summarization", "Translation"]', true, true),
('00000000-0000-0000-0000-000000000102', (SELECT id FROM public.companies WHERE name = 'OpenAI'), 'Sora', 'Video Generation', 'An AI model that creates realistic and imaginative scenes from text instructions.', 'https://openai.com/sora', 'https://openai.com/favicon.ico', 'Subscription', '2024-02-15', '{"Video Production", "Creative Tools"}', '["Text-to-Video", "Video Editing"]', false, false),
('00000000-0000-0000-0000-000000000103', (SELECT id FROM public.companies WHERE name = 'OpenAI'), 'DALL-E', 'Image Generation', 'An AI system that can create realistic images and art from a natural language description.', 'https://openai.com/dall-e', 'https://openai.com/favicon.ico', 'Pay-per-use', '2021-01-05', '{"Design", "Marketing", "Creative"}', '["Text-to-Image", "Image Editing", "Style Transfer"]', true, false),
('00000000-0000-0000-0000-000000000104', (SELECT id FROM public.companies WHERE name = 'Anthropic'), 'Claude', 'Conversational AI', 'An AI assistant designed to be helpful, harmless, and honest in conversations.', 'https://claude.ai', 'https://claude.ai/favicon.ico', 'Freemium', '2023-03-14', '{"Customer Support", "Analysis", "Writing"}', '["Long Context", "Code Analysis", "Document Processing"]', true, true),
('00000000-0000-0000-0000-000000000105', (SELECT id FROM public.companies WHERE name = 'Google'), 'Gemini', 'Conversational AI', 'Google''s most capable AI model for multimodal reasoning across text, images, and code.', 'https://gemini.google.com', 'https://gemini.google.com/favicon.ico', 'Freemium', '2023-12-06', '{"Multimodal", "Search", "Productivity"}', '["Text Generation", "Image Understanding", "Code Generation"]', true, true),
('00000000-0000-0000-0000-000000000106', (SELECT id FROM public.companies WHERE name = 'Google'), 'AI Studio', 'Developer Tools', 'A platform for building and deploying AI applications with Google''s models.', 'https://aistudio.google.com', 'https://aistudio.google.com/favicon.ico', 'Pay-per-use', '2023-05-10', '{"Developer Tools", "API", "ML Platform"}', '["Model API", "Fine-tuning", "Deployment"]', true, false),
('00000000-0000-0000-0000-000000000107', (SELECT id FROM public.companies WHERE name = 'Microsoft'), 'Copilot', 'AI Assistant', 'An AI-powered assistant integrated across Microsoft''s productivity suite.', 'https://copilot.microsoft.com', 'https://copilot.microsoft.com/favicon.ico', 'Subscription', '2023-03-16', '{"Productivity", "Office", "Enterprise"}', '["Document Creation", "Email Assistance", "Meeting Notes"]', false, false),
('00000000-0000-0000-0000-000000000108', (SELECT id FROM public.companies WHERE name = 'Meta'), 'Meta AI', 'Conversational AI', 'Meta''s AI assistant integrated into WhatsApp, Instagram, and other Meta platforms.', 'https://ai.meta.com', 'https://ai.meta.com/favicon.ico', 'Free', '2023-09-27', '{"Social Media", "Messaging", "Entertainment"}', '["Chat", "Image Generation", "Search"]', false, true),
('00000000-0000-0000-0000-000000000109', (SELECT id FROM public.companies WHERE name = 'Perplexity AI'), 'Perplexity Pro', 'Search Engine', 'An AI-powered search engine that provides accurate answers with cited sources.', 'https://www.perplexity.ai', 'https://www.perplexity.ai/favicon.ico', 'Subscription', '2022-12-05', '{"Search", "Research", "Information"}', '["Source Citation", "Real-time Data", "Academic Search"]', true, false),
('00000000-0000-0000-0000-000000000110', (SELECT id FROM public.companies WHERE name = 'Scale AI'), 'Scale Data Engine', 'Data Platform', 'A platform for high-quality data labeling and AI infrastructure services.', 'https://scale.com', 'https://scale.com/favicon.ico', 'Enterprise', '2016-06-01', '{"Data Labeling", "MLOps", "Quality Assurance"}', '["Data Annotation", "Quality Control", "Model Training"]', true, false)
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  website = EXCLUDED.website,
  logo_url = EXCLUDED.logo_url,
  pricing_model = EXCLUDED.pricing_model,
  launch_date = EXCLUDED.launch_date,
  industry_tags = EXCLUDED.industry_tags,
  features = EXCLUDED.features,
  api_available = EXCLUDED.api_available,
  free_tier = EXCLUDED.free_tier;
```

## Step 4: Insert Funding Data
Copy and paste this to add funding information:

```sql
-- Run this fourth: Funding information
-- File: 2025-01-20_complete_funding_data.sql
-- Copy and paste the entire content from: supabase/migrations/2025-01-20_complete_funding_data.sql
```

## Step 5: Insert Chinese AI Companies (Optional)
If you want to add Chinese AI companies, run this:

```sql
-- Run this fifth: Chinese AI companies (optional)
-- File: 2025-01-20_chinese_ai_companies.sql

INSERT INTO public.companies (name, website, description, founded_year, headquarters, industry_tags, logo_url, social_links, valuation_usd, last_funding_date) VALUES
('百度', 'https://www.baidu.com', '中国领先的AI技术公司，提供搜索引擎、自动驾驶、AI芯片等产品', 2000, '北京, 中国', ARRAY['Search', 'AI Platform', 'Autonomous Driving', 'LLM'], 'https://www.baidu.com/favicon.ico', '{"weibo": "https://weibo.com/baidu", "zhihu": "https://www.zhihu.com/org/baidu"}', 45000000000, '2024-01-01'),
('阿里巴巴', 'https://www.alibaba.com', '全球领先的电商和云计算公司，提供AI驱动的商业解决方案', 1999, '杭州, 中国', ARRAY['E-commerce', 'Cloud Computing', 'AI Platform', 'LLM'], 'https://www.alibaba.com/favicon.ico', '{"weibo": "https://weibo.com/alibaba", "zhihu": "https://www.zhihu.com/org/alibaba"}', 200000000000, '2024-01-01'),
('腾讯', 'https://www.tencent.com', '中国领先的互联网公司，提供社交、游戏、AI等多元化服务', 1998, '深圳, 中国', ARRAY['Social Media', 'Gaming', 'AI Platform', 'LLM'], 'https://www.tencent.com/favicon.ico', '{"weibo": "https://weibo.com/tencent", "zhihu": "https://www.zhihu.com/org/tencent"}', 400000000000, '2024-01-01'),
('字节跳动', 'https://www.bytedance.com', '全球领先的互联网公司，提供短视频、AI等创新产品', 2012, '北京, 中国', ARRAY['Social Media', 'Video', 'AI Platform', 'LLM'], 'https://www.bytedance.com/favicon.ico', '{"weibo": "https://weibo.com/bytedance", "zhihu": "https://www.zhihu.com/org/bytedance"}', 140000000000, '2024-01-01'),
('商汤科技', 'https://www.sensetime.com', '全球领先的AI公司，专注于计算机视觉和深度学习技术', 2014, '香港, 中国', ARRAY['Computer Vision', 'Deep Learning', 'AI Platform'], 'https://www.sensetime.com/favicon.ico', '{"weibo": "https://weibo.com/sensetime", "zhihu": "https://www.zhihu.com/org/sensetime"}', 12000000000, '2021-12-01')
ON CONFLICT (name) DO UPDATE SET
  website = EXCLUDED.website,
  description = EXCLUDED.description,
  founded_year = EXCLUDED.founded_year,
  headquarters = EXCLUDED.headquarters,
  industry_tags = EXCLUDED.industry_tags,
  logo_url = EXCLUDED.logo_url,
  social_links = EXCLUDED.social_links,
  valuation_usd = EXCLUDED.valuation_usd,
  last_funding_date = EXCLUDED.last_funding_date;
```

## Step 6: Insert Video AI Companies (Optional)
If you want to add video AI companies, run this:

```sql
-- Run this sixth: Video AI companies (optional)
-- File: 2025-01-20_video_ai_companies.sql

INSERT INTO public.companies (name, website, description, founded_year, headquarters, industry_tags, logo_url, social_links, valuation_usd, last_funding_date) VALUES
('Google DeepMind', 'https://deepmind.google', '谷歌DeepMind部门，开发Veo等先进AI视频生成模型', 2010, '伦敦, 英国', ARRAY['Video Generation', 'AI Research', 'Multimodal AI'], 'https://deepmind.google/favicon.ico', '{"twitter": "https://twitter.com/deepmind", "linkedin": "https://linkedin.com/company/deepmind"}', 1000000000, '2014-01-01'),
('Runway', 'https://runwayml.com', 'AI视频生成和编辑平台，提供多种视频AI工具', 2018, '纽约, 美国', ARRAY['Video Generation', 'Video Editing', 'AI Platform'], 'https://runwayml.com/favicon.ico', '{"twitter": "https://twitter.com/runwayml", "linkedin": "https://linkedin.com/company/runway"}', 1500000000, '2023-06-01'),
('Pika Labs', 'https://pika.art', 'AI视频生成平台，支持文本到视频转换', 2023, '旧金山, 美国', ARRAY['Video Generation', 'Text-to-Video', 'AI Platform'], 'https://pika.art/favicon.ico', '{"twitter": "https://twitter.com/pika_labs", "linkedin": "https://linkedin.com/company/pika-labs"}', 500000000, '2024-01-01'),
('海螺AI', 'https://hailuo.ai', '国内领先的AI视频生成平台，支持多种视频生成方式', 2023, '北京, 中国', ARRAY['Video Generation', 'Chinese AI', 'Multimodal'], 'https://hailuo.ai/favicon.ico', '{"weibo": "https://weibo.com/hailuoai", "zhihu": "https://www.zhihu.com/org/hailuoai"}', 200000000, '2024-01-01'),
('SeaArt', 'https://seaart.ai', '全能AI视频生成器，支持多种模型和风格', 2023, '北京, 中国', ARRAY['Video Generation', 'Creative AI', 'Chinese AI'], 'https://seaart.ai/favicon.ico', '{"weibo": "https://weibo.com/seaart", "zhihu": "https://www.zhihu.com/org/seaart"}', 150000000, '2024-02-01')
ON CONFLICT (name) DO UPDATE SET
  website = EXCLUDED.website,
  description = EXCLUDED.description,
  founded_year = EXCLUDED.founded_year,
  headquarters = EXCLUDED.headquarters,
  industry_tags = EXCLUDED.industry_tags,
  logo_url = EXCLUDED.logo_url,
  social_links = EXCLUDED.social_links,
  valuation_usd = EXCLUDED.valuation_usd,
  last_funding_date = EXCLUDED.last_funding_date;
```

## Step 7: Generate AI Content with Cursor (Recommended)
After seeding the data, you can use Cursor's built-in AI to enrich descriptions:

```bash
# In your terminal, run:
cd /Users/kengorgor/repo/leiaoai-story-platform
npm install @supabase/supabase-js dotenv
npx tsx scripts/generate_content_with_cursor.ts
```

**Benefits of using Cursor's AI:**
- ✅ No API rate limits
- ✅ No additional costs
- ✅ Uses the most appropriate model automatically
- ✅ Better integration with your development environment
- ✅ Automatic fallback handling

## Alternative: OpenAI API (If you prefer)
If you want to use OpenAI API instead, you can use the original script:

```bash
# Make sure you have OPENAI_API_KEY in your .env file
npx tsx scripts/generate_company_content.ts
```

**Note:** The OpenAI script includes rate limiting and retry logic to handle API limits.

## Important Notes:

1. **Run scripts in order**: Execute Step 1 first, then Steps 2-6 in sequence
2. **Check for errors**: If any step fails, fix the error before proceeding
3. **Backup first**: Consider backing up your database before running these scripts
4. **Rate limits**: The OpenAI script includes rate limiting to avoid API errors
5. **Environment variables**: Make sure your `.env` file has the required API keys

## Troubleshooting:

- **Permission errors**: Ensure you have the right database permissions
- **Duplicate key errors**: The scripts use `ON CONFLICT` to handle duplicates
- **Missing tables**: Make sure Step 1 completed successfully before running other steps
- **API rate limits**: Wait a few minutes between OpenAI API calls if you hit limits

This will give you a comprehensive AI companies catalog with ratings, favorites, stories, and detailed company information!
