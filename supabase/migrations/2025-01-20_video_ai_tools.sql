-- 视频AI工具产品数据
-- 包含各公司的具体视频生成工具和工作流产品

-- 插入Google DeepMind的视频工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Veo 3', 'Video Generation', '谷歌DeepMind的先进AI视频生成模型，支持文本到视频转换', 'https://deepmind.google/technologies/veo', ARRAY['Text-to-Video', 'High Quality', 'Multimodal'], '["文本到视频", "高质量生成", "物理模拟", "多风格渲染"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = 'Google DeepMind';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Veo API', 'API Service', 'Veo模型的API接口服务', 'https://deepmind.google/technologies/veo', ARRAY['Video API', 'Developer Tools', 'Text-to-Video'], '["视频生成API", "开发者工具", "企业集成", "批量处理"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = 'Google DeepMind';

-- 插入Artlist的视频工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Artlist AI Video', 'Video Generation', 'Artlist的AI视频生成工具，支持文本和图像到视频转换', 'https://artlist.io', ARRAY['Text-to-Video', 'Image-to-Video', 'Creative Tools'], '["文本到视频", "图像到视频", "多种风格", "创意工具"]'::jsonb, true, true, 'Subscription'
FROM public.companies c WHERE c.name = 'Artlist';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Artlist Creative Suite', 'Video Workflow', 'Artlist的创意视频制作套件', 'https://artlist.io', ARRAY['Video Workflow', 'Creative Suite', 'Content Creation'], '["视频工作流", "创意套件", "内容创作", "模板库"]'::jsonb, true, true, 'Subscription'
FROM public.companies c WHERE c.name = 'Artlist';

-- 插入ComfyUI的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'ComfyUI', 'Video Workflow', '开源的AI图像和视频生成工作流界面', 'https://github.com/comfyanonymous/ComfyUI', ARRAY['Open Source', 'Workflow', 'Video Generation'], '["开源工作流", "可视化界面", "自定义节点", "社区分享"]'::jsonb, true, true, 'Open Source'
FROM public.companies c WHERE c.name = 'ComfyUI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'ComfyUI Manager', 'Workflow Management', 'ComfyUI的扩展管理器', 'https://github.com/ltdrdata/ComfyUI-Manager', ARRAY['Extension Manager', 'Plugin System', 'Workflow Tools'], '["扩展管理", "插件系统", "工作流工具", "自动更新"]'::jsonb, true, true, 'Open Source'
FROM public.companies c WHERE c.name = 'ComfyUI';

-- 插入Stability AI的视频工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Stable Video Diffusion', 'Video Generation', 'Stability AI的稳定视频扩散模型', 'https://stability.ai', ARRAY['Video Generation', 'Open Source', 'Stable Diffusion'], '["视频生成", "开源模型", "稳定扩散", "高质量输出"]'::jsonb, true, true, 'Open Source'
FROM public.companies c WHERE c.name = 'Stability AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Stable Video API', 'API Service', 'Stable Video的API接口服务', 'https://stability.ai', ARRAY['Video API', 'Developer Tools', 'Stable Video'], '["视频API", "开发者工具", "企业集成", "批量处理"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = 'Stability AI';

-- 插入Runway的视频工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Runway Gen-3', 'Video Generation', 'Runway的第三代AI视频生成模型', 'https://runwayml.com', ARRAY['Video Generation', 'High Quality', 'Creative Tools'], '["视频生成", "高质量输出", "创意工具", "多种风格"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Runway';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Runway Video Editor', 'Video Editing', 'Runway的AI视频编辑工具', 'https://runwayml.com', ARRAY['Video Editing', 'AI Tools', 'Creative Suite'], '["AI视频编辑", "智能剪辑", "特效制作", "音频同步"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Runway';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Runway API', 'API Service', 'Runway的API接口服务', 'https://runwayml.com', ARRAY['Video API', 'Developer Tools', 'Enterprise'], '["视频API", "开发者工具", "企业集成", "批量处理"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = 'Runway';

-- 插入Pika Labs的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Pika 1.5', 'Video Generation', 'Pika Labs的AI视频生成模型', 'https://pika.art', ARRAY['Text-to-Video', 'High Quality', 'Creative Tools'], '["文本到视频", "高质量生成", "创意工具", "多种风格"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Pika Labs';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Pika Studio', 'Video Workflow', 'Pika的视频创作工作室', 'https://pika.art', ARRAY['Video Workflow', 'Creative Studio', 'Collaboration'], '["视频工作流", "创意工作室", "协作功能", "项目管理"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Pika Labs';

-- 插入Luma AI的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Luma Dream Machine', 'Video Generation', 'Luma AI的AI视频生成模型', 'https://lumalabs.ai', ARRAY['Text-to-Video', '3D Video', 'High Quality'], '["文本到视频", "3D视频", "高质量生成", "物理模拟"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Luma AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Luma 3D', '3D Content', 'Luma的3D内容创建工具', 'https://lumalabs.ai', ARRAY['3D Content', 'Video Generation', 'Creative Tools'], '["3D内容", "视频生成", "创意工具", "模型创建"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Luma AI';

-- 插入Synthesia的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Synthesia Studio', 'Video Generation', 'Synthesia的AI视频生成平台', 'https://synthesia.io', ARRAY['AI Avatars', 'Virtual Presenter', 'Video Generation'], '["AI虚拟主播", "虚拟演示", "视频生成", "多语言支持"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Synthesia';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Synthesia API', 'API Service', 'Synthesia的API接口服务', 'https://synthesia.io', ARRAY['Video API', 'Developer Tools', 'Enterprise'], '["视频API", "开发者工具", "企业集成", "批量生成"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = 'Synthesia';

-- 插入海螺AI的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Hailuo Video', 'Video Generation', '海螺AI的视频生成工具，支持多种生成方式', 'https://hailuo.ai', ARRAY['Text-to-Video', 'Image-to-Video', 'Chinese AI'], '["文本到视频", "图像到视频", "中文AI", "多种风格"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '海螺AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Hailuo Studio', 'Video Workflow', '海螺AI的视频创作工作室', 'https://hailuo.ai', ARRAY['Video Workflow', 'Creative Studio', 'Chinese AI'], '["视频工作流", "创意工作室", "中文AI", "协作功能"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '海螺AI';

-- 插入SeaArt的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'SeaArt SonoVision', 'Video Generation', 'SeaArt的AI视频生成模型', 'https://seaart.ai', ARRAY['Text-to-Video', 'High Quality', 'Chinese AI'], '["文本到视频", "高质量生成", "中文AI", "多种风格"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'SeaArt';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'SeaArt Ultra Pro', 'Video Generation', 'SeaArt的专业版视频生成工具', 'https://seaart.ai', ARRAY['Professional Video', 'High Quality', 'Chinese AI'], '["专业视频", "高质量生成", "中文AI", "企业级"]'::jsonb, true, false, 'Subscription'
FROM public.companies c WHERE c.name = 'SeaArt';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'SeaArt Workflow', 'Video Workflow', 'SeaArt的视频工作流工具', 'https://seaart.ai', ARRAY['Video Workflow', 'Creative Tools', 'Chinese AI'], '["视频工作流", "创意工具", "中文AI", "模板库"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'SeaArt';

-- 插入Vidu的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Vidu Video', 'Video Generation', 'Vidu的AI视频生成平台', 'https://vidu.ai', ARRAY['Text-to-Video', 'High Quality', 'Chinese AI'], '["文本到视频", "高质量生成", "中文AI", "创意工具"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Vidu';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Vidu Studio', 'Video Workflow', 'Vidu的视频创作工作室', 'https://vidu.ai', ARRAY['Video Workflow', 'Creative Studio', 'Chinese AI'], '["视频工作流", "创意工作室", "中文AI", "项目管理"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Vidu';

-- 插入SeedDream的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'SeedDream 4.0', 'Video Generation', 'SeedDream的第四代AI视频生成模型', 'https://seeddream.ai', ARRAY['Text-to-Video', 'Advanced Models', 'Chinese AI'], '["文本到视频", "先进模型", "中文AI", "高质量生成"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'SeedDream';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'SeedDream Studio', 'Video Workflow', 'SeedDream的视频创作工作室', 'https://seeddream.ai', ARRAY['Video Workflow', 'Creative Studio', 'Chinese AI'], '["视频工作流", "创意工作室", "中文AI", "高级功能"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'SeedDream';

-- 插入Viddo AI的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Viddo AI Platform', 'Video Generation', 'Viddo AI的一体化视频生成平台', 'https://viddo.ai', ARRAY['All-in-One', 'Video Generation', 'Chinese AI'], '["一体化平台", "视频生成", "中文AI", "多种模型"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Viddo AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Viddo Sora 2', 'Video Generation', 'Viddo AI集成的Sora 2模型', 'https://viddo.ai', ARRAY['Sora 2', 'High Quality', 'Chinese AI'], '["Sora 2模型", "高质量生成", "中文AI", "先进技术"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Viddo AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Viddo Veo 3', 'Video Generation', 'Viddo AI集成的Veo 3模型', 'https://viddo.ai', ARRAY['Veo 3', 'High Quality', 'Chinese AI'], '["Veo 3模型", "高质量生成", "中文AI", "先进技术"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Viddo AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Viddo Wan 2.5', 'Video Generation', 'Viddo AI集成的Wan 2.5模型', 'https://viddo.ai', ARRAY['Wan 2.5', 'High Quality', 'Chinese AI'], '["Wan 2.5模型", "高质量生成", "中文AI", "先进技术"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Viddo AI';

-- 插入Wan AI的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Wan 2.5', 'Video Generation', 'Wan AI的2.5代视频生成模型', 'https://wan.ai', ARRAY['Wan Model', 'High Quality', 'Chinese AI'], '["Wan模型", "高质量生成", "中文AI", "先进技术"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Wan AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Wan Studio', 'Video Workflow', 'Wan AI的视频创作工作室', 'https://wan.ai', ARRAY['Video Workflow', 'Creative Studio', 'Chinese AI'], '["视频工作流", "创意工作室", "中文AI", "高级功能"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Wan AI';

-- 插入Kling AI的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Kling Video', 'Video Generation', 'Kling AI的视频生成工具', 'https://kling.ai', ARRAY['Text-to-Video', 'High Quality', 'Chinese AI'], '["文本到视频", "高质量生成", "中文AI", "创意工具"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Kling AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Kling Studio', 'Video Workflow', 'Kling AI的视频创作工作室', 'https://kling.ai', ARRAY['Video Workflow', 'Creative Studio', 'Chinese AI'], '["视频工作流", "创意工作室", "中文AI", "项目管理"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Kling AI';

-- 插入Dreamina的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Dreamina Video', 'Video Generation', 'Dreamina的AI视频生成工具', 'https://dreamina.ai', ARRAY['Text-to-Video', 'Creative Tools', 'Chinese AI'], '["文本到视频", "创意工具", "中文AI", "多种风格"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Dreamina';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Dreamina Studio', 'Video Workflow', 'Dreamina的视频创作工作室', 'https://dreamina.ai', ARRAY['Video Workflow', 'Creative Studio', 'Chinese AI'], '["视频工作流", "创意工作室", "中文AI", "协作功能"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Dreamina';

-- 插入PixVerse的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'PixVerse Video', 'Video Generation', 'PixVerse的AI视频生成工具', 'https://pixverse.ai', ARRAY['Text-to-Video', 'Creative Content', 'Chinese AI'], '["文本到视频", "创意内容", "中文AI", "高质量生成"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'PixVerse';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'PixVerse Studio', 'Video Workflow', 'PixVerse的视频创作工作室', 'https://pixverse.ai', ARRAY['Video Workflow', 'Creative Studio', 'Chinese AI'], '["视频工作流", "创意工作室", "中文AI", "模板库"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'PixVerse';

-- 插入LeiaPix的工具
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'LeiaPix 3D', 'Video Generation', 'LeiaPix的3D视频生成工具', 'https://convert.leiapix.com', ARRAY['3D Video', 'Video Generation', 'Chinese AI'], '["3D视频", "视频生成", "中文AI", "立体效果"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'LeiaPix';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'LeiaPix Studio', 'Video Workflow', 'LeiaPix的3D视频创作工作室', 'https://convert.leiapix.com', ARRAY['3D Workflow', 'Creative Studio', 'Chinese AI'], '["3D工作流", "创意工作室", "中文AI", "立体制作"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'LeiaPix';
