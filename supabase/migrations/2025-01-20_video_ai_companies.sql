-- 视频生成和视频工作流AI工具数据
-- 包含国内外重点的视频AI工具

-- 插入视频AI公司
INSERT INTO public.companies (name, website, description, founded_year, headquarters, industry_tags, logo_url, social_links, valuation_usd, last_funding_date) VALUES

-- 国外视频AI公司
('Google DeepMind', 'https://deepmind.google', '谷歌DeepMind部门，开发Veo等先进AI视频生成模型', 2010, '伦敦, 英国', ARRAY['Video Generation', 'AI Research', 'Multimodal AI'], 'https://deepmind.google/favicon.ico', '{"twitter": "https://twitter.com/deepmind", "linkedin": "https://linkedin.com/company/deepmind"}', 1000000000, '2014-01-01'),

('Artlist', 'https://artlist.io', '提供AI视频生成工具和创意内容平台', 2016, '特拉维夫, 以色列', ARRAY['Video Generation', 'Creative Tools', 'Content Platform'], 'https://artlist.io/favicon.ico', '{"twitter": "https://twitter.com/artlist", "linkedin": "https://linkedin.com/company/artlist"}', 200000000, '2021-06-01'),

('ComfyUI', 'https://github.com/comfyanonymous/ComfyUI', '开源的AI图像和视频生成工作流界面', 2023, '全球开源', ARRAY['Open Source', 'Workflow', 'Video Generation'], 'https://github.com/favicon.ico', '{"github": "https://github.com/comfyanonymous/ComfyUI"}', 0, '2023-01-01'),

('Stability AI', 'https://stability.ai', '开发Stable Diffusion和视频生成AI模型', 2020, '伦敦, 英国', ARRAY['Video Generation', 'Open Source', 'AI Models'], 'https://stability.ai/favicon.ico', '{"twitter": "https://twitter.com/stabilityai", "linkedin": "https://linkedin.com/company/stability-ai"}', 1000000000, '2022-10-01'),

('Runway', 'https://runwayml.com', 'AI视频生成和编辑平台，提供多种视频AI工具', 2018, '纽约, 美国', ARRAY['Video Generation', 'Video Editing', 'AI Platform'], 'https://runwayml.com/favicon.ico', '{"twitter": "https://twitter.com/runwayml", "linkedin": "https://linkedin.com/company/runway"}', 1500000000, '2023-06-01'),

('Pika Labs', 'https://pika.art', 'AI视频生成平台，支持文本到视频转换', 2023, '旧金山, 美国', ARRAY['Video Generation', 'Text-to-Video', 'AI Platform'], 'https://pika.art/favicon.ico', '{"twitter": "https://twitter.com/pika_labs", "linkedin": "https://linkedin.com/company/pika-labs"}', 500000000, '2024-01-01'),

('Luma AI', 'https://lumalabs.ai', 'AI视频生成和3D内容创建平台', 2021, '旧金山, 美国', ARRAY['Video Generation', '3D Content', 'AI Platform'], 'https://lumalabs.ai/favicon.ico', '{"twitter": "https://twitter.com/lumalabs", "linkedin": "https://linkedin.com/company/luma-labs"}', 300000000, '2023-03-01'),

('Synthesia', 'https://synthesia.io', 'AI视频生成平台，专注于虚拟主播和视频制作', 2017, '伦敦, 英国', ARRAY['Video Generation', 'Virtual Presenter', 'AI Avatars'], 'https://synthesia.io/favicon.ico', '{"twitter": "https://twitter.com/synthesia_io", "linkedin": "https://linkedin.com/company/synthesia"}', 1000000000, '2023-06-01'),

-- 国内视频AI公司
('海螺AI', 'https://hailuo.ai', '国内领先的AI视频生成平台，支持多种视频生成方式', 2023, '北京, 中国', ARRAY['Video Generation', 'Chinese AI', 'Multimodal'], 'https://hailuo.ai/favicon.ico', '{"weibo": "https://weibo.com/hailuoai", "zhihu": "https://www.zhihu.com/org/hailuoai"}', 200000000, '2024-01-01'),

('SeaArt', 'https://seaart.ai', '全能AI视频生成器，支持多种模型和风格', 2023, '北京, 中国', ARRAY['Video Generation', 'Creative AI', 'Chinese AI'], 'https://seaart.ai/favicon.ico', '{"weibo": "https://weibo.com/seaart", "zhihu": "https://www.zhihu.com/org/seaart"}', 150000000, '2024-02-01'),

('Vidu', 'https://vidu.ai', 'AI视频生成平台，专注于高质量视频内容创作', 2023, '北京, 中国', ARRAY['Video Generation', 'High Quality', 'Chinese AI'], 'https://vidu.ai/favicon.ico', '{"weibo": "https://weibo.com/viduai", "zhihu": "https://www.zhihu.com/org/viduai"}', 100000000, '2024-01-01'),

('SeedDream', 'https://seeddream.ai', 'AI视频生成平台，提供SeedDream4.0等先进模型', 2023, '上海, 中国', ARRAY['Video Generation', 'Advanced Models', 'Chinese AI'], 'https://seeddream.ai/favicon.ico', '{"weibo": "https://weibo.com/seeddream", "zhihu": "https://www.zhihu.com/org/seeddream"}', 300000000, '2024-03-01'),

('Viddo AI', 'https://viddo.ai', '一体化AI视频生成器，支持多种模型和功能', 2023, '深圳, 中国', ARRAY['Video Generation', 'All-in-One', 'Chinese AI'], 'https://viddo.ai/favicon.ico', '{"weibo": "https://weibo.com/viddoai", "zhihu": "https://www.zhihu.com/org/viddoai"}', 200000000, '2024-02-01'),

('Wan AI', 'https://wan.ai', 'AI视频生成平台，提供Wan 2.5等模型', 2023, '杭州, 中国', ARRAY['Video Generation', 'Wan Model', 'Chinese AI'], 'https://wan.ai/favicon.ico', '{"weibo": "https://weibo.com/wanai", "zhihu": "https://www.zhihu.com/org/wanai"}', 150000000, '2024-01-01'),

('Kling AI', 'https://kling.ai', 'AI视频生成平台，专注于高质量视频内容', 2023, '北京, 中国', ARRAY['Video Generation', 'High Quality', 'Chinese AI'], 'https://kling.ai/favicon.ico', '{"weibo": "https://weibo.com/klingai", "zhihu": "https://www.zhihu.com/org/klingai"}', 100000000, '2024-01-01'),

('Dreamina', 'https://dreamina.ai', 'AI视频生成平台，支持多种创意视频制作', 2023, '上海, 中国', ARRAY['Video Generation', 'Creative Tools', 'Chinese AI'], 'https://dreamina.ai/favicon.ico', '{"weibo": "https://weibo.com/dreamina", "zhihu": "https://www.zhihu.com/org/dreamina"}', 200000000, '2024-02-01'),

('PixVerse', 'https://pixverse.ai', 'AI视频生成平台，专注于创意视频内容', 2023, '广州, 中国', ARRAY['Video Generation', 'Creative Content', 'Chinese AI'], 'https://pixverse.ai/favicon.ico', '{"weibo": "https://weibo.com/pixverse", "zhihu": "https://www.zhihu.com/org/pixverse"}', 100000000, '2024-01-01'),

('LeiaPix', 'https://convert.leiapix.com', 'AI视频生成平台，专注于3D视频内容', 2023, '北京, 中国', ARRAY['Video Generation', '3D Video', 'Chinese AI'], 'https://convert.leiapix.com/favicon.ico', '{"weibo": "https://weibo.com/leiapix", "zhihu": "https://www.zhihu.com/org/leiapix"}', 150000000, '2024-01-01')

-- Use DO NOTHING to avoid duplicate insertion errors
ON CONFLICT DO NOTHING;
