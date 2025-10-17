-- 基于a16z报告的完整AI工具数据
-- 包含每个公司的具体工具、服务和产品

-- 插入OpenAI的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'ChatGPT', 'Conversational AI', 'AI对话助手，能够进行自然语言对话和任务协助，支持多模态交互', 'https://chat.openai.com', ARRAY['Customer Support', 'Content Creation', 'Education', 'General Purpose'], '["对话生成", "代码编写", "文本总结", "翻译", "多模态交互"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'OpenAI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'DALL-E', 'Image Generation', 'AI图像生成模型，根据文本描述创建高质量图像', 'https://openai.com/dall-e', ARRAY['Design', 'Marketing', 'Creative', 'Visual Content'], '["文本到图像", "图像编辑", "风格转换", "高分辨率"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = 'OpenAI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Sora', 'Video Generation', 'AI视频生成模型，根据文本创建高质量视频内容', 'https://openai.com/sora', ARRAY['Video Production', 'Marketing', 'Entertainment', 'Content Creation'], '["文本到视频", "视频编辑", "场景生成", "长视频支持"]'::jsonb, false, false, 'Enterprise'
FROM public.companies c WHERE c.name = 'OpenAI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'GPT-4 API', 'API Service', 'GPT-4模型的API接口，供开发者集成使用', 'https://platform.openai.com', ARRAY['Developer Tools', 'API', 'Integration', 'Enterprise'], '["文本生成", "代码生成", "对话API", "批量处理"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = 'OpenAI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Whisper', 'Speech Recognition', 'AI语音识别和转录模型，支持多语言', 'https://openai.com/whisper', ARRAY['Speech Recognition', 'Transcription', 'Accessibility', 'Multilingual'], '["语音转文字", "多语言支持", "实时转录", "高精度"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'OpenAI';

-- 插入Anthropic的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Claude', 'Conversational AI', 'AI助手，专注于安全、有用和诚实的对话，支持长文本处理', 'https://claude.ai', ARRAY['Customer Support', 'Content Creation', 'Analysis', 'Safety'], '["长文本处理", "代码分析", "文档总结", "安全对话", "多模态"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Anthropic';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Claude API', 'API Service', 'Claude模型的API接口，提供企业级AI服务', 'https://console.anthropic.com', ARRAY['Developer Tools', 'API', 'Enterprise', 'Safety'], '["文本生成", "对话API", "企业集成", "安全保证"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = 'Anthropic';

-- 插入Replit的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Replit Agent', 'AI Coding', 'AI代码助手，能够自主开发应用和自动化任务', 'https://replit.com', ARRAY['Code Generation', 'Development', 'AI Coding', 'Autonomous'], '["自主编程", "应用开发", "代码调试", "部署", "长时间运行"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Replit';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Replit Workspace', 'Development Environment', '在线编程环境和协作平台，集成AI功能', 'https://replit.com', ARRAY['Development', 'Collaboration', 'Cloud IDE', 'AI Integration'], '["在线IDE", "实时协作", "版本控制", "部署", "AI助手"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Replit';

-- 插入Google的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Gemini', 'Conversational AI', 'Google的多模态AI模型，集成搜索和生产力功能', 'https://gemini.google.com', ARRAY['Multimodal AI', 'Search', 'Productivity', 'Integration'], '["文本生成", "图像理解", "代码生成", "搜索增强", "多模态"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Google';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Gemini API', 'API Service', 'Gemini模型的API接口，支持多模态功能', 'https://ai.google.dev', ARRAY['Developer Tools', 'API', 'Multimodal', 'Enterprise'], '["文本API", "图像API", "多模态API", "企业集成"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = 'Google';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'NotebookLM', 'AI Assistant', 'AI驱动的笔记和研究助手，支持文档分析', 'https://notebooklm.google.com', ARRAY['Research', 'Note-taking', 'Education', 'Document Analysis'], '["文档分析", "智能总结", "研究助手", "知识管理"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Google';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'AI Studio', 'Developer Tools', '开发者平台，提供Gemini模型的沙盒环境', 'https://aistudio.google.com', ARRAY['Developer Tools', 'Sandbox', 'Model Testing', 'Prototyping'], '["模型测试", "快速原型", "API集成", "多模态开发"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Google';

-- 插入Microsoft的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Copilot', 'AI Assistant', 'Microsoft的AI助手，集成到Office套件和Windows中', 'https://copilot.microsoft.com', ARRAY['Productivity', 'Office Integration', 'Enterprise', 'Windows'], '["文档编写", "邮件助手", "会议总结", "代码生成", "系统集成"]'::jsonb, true, false, 'Subscription'
FROM public.companies c WHERE c.name = 'Microsoft';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Azure OpenAI', 'API Service', 'Azure上的OpenAI服务，提供企业级AI解决方案', 'https://azure.microsoft.com/en-us/products/ai-services/openai-service', ARRAY['Cloud AI', 'API', 'Enterprise', 'Security'], '["GPT模型", "DALL-E", "企业级安全", "合规性"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = 'Microsoft';

-- 插入Perplexity AI的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Perplexity Pro', 'AI Search', 'AI驱动的搜索引擎，提供实时信息和引用来源', 'https://perplexity.ai', ARRAY['Search', 'Research', 'Information Retrieval', 'Real-time'], '["实时搜索", "引用来源", "多语言支持", "专业搜索"]'::jsonb, true, false, 'Subscription'
FROM public.companies c WHERE c.name = 'Perplexity AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Perplexity API', 'API Service', 'Perplexity的API接口，提供搜索和问答服务', 'https://docs.perplexity.ai', ARRAY['Developer Tools', 'API', 'Search', 'Real-time'], '["搜索API", "问答API", "实时信息", "企业集成"]'::jsonb, true, false, 'Pay-per-request'
FROM public.companies c WHERE c.name = 'Perplexity AI';

-- 插入ElevenLabs的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'ElevenLabs Voice', 'Voice Synthesis', 'AI语音合成平台，支持语音克隆和情感表达', 'https://elevenlabs.io', ARRAY['Voice AI', 'Audio Generation', 'Content Creation', 'Voice Cloning'], '["语音克隆", "多语言合成", "情感表达", "实时生成", "高质量音频"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'ElevenLabs';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'ElevenLabs API', 'API Service', '语音合成API接口，支持批量处理', 'https://elevenlabs.io/docs', ARRAY['Developer Tools', 'API', 'Voice AI', 'Batch Processing'], '["语音API", "批量处理", "自定义声音", "实时合成"]'::jsonb, true, false, 'Pay-per-character'
FROM public.companies c WHERE c.name = 'ElevenLabs';

-- 插入Notion的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Notion AI', 'AI Assistant', 'Notion中的AI写作和内容助手，集成到工作空间中', 'https://notion.so', ARRAY['Productivity', 'AI Writing', 'Content Creation', 'Workspace'], '["智能写作", "内容总结", "翻译", "头脑风暴", "工作空间集成"]'::jsonb, true, false, 'Subscription'
FROM public.companies c WHERE c.name = 'Notion';

-- 插入Canva的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Magic Design', 'AI Design', 'AI驱动的设计工具，自动生成视觉内容', 'https://canva.com', ARRAY['Design', 'Creative AI', 'Visual Content', 'Automation'], '["AI设计", "模板生成", "品牌套件", "协作设计", "多格式导出"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Canva';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Magic Write', 'AI Writing', 'AI内容写作工具，专为营销和社交媒体优化', 'https://canva.com', ARRAY['Content Writing', 'Marketing', 'Social Media', 'Copywriting'], '["内容生成", "社交媒体文案", "营销材料", "多语言支持"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Canva';

-- 插入Midjourney的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Midjourney Bot', 'Image Generation', 'Discord上的AI图像生成机器人，支持多种艺术风格', 'https://midjourney.com', ARRAY['Image Generation', 'Creative AI', 'Art', 'Discord'], '["文本到图像", "风格控制", "高分辨率", "艺术风格", "社区功能"]'::jsonb, false, false, 'Subscription'
FROM public.companies c WHERE c.name = 'Midjourney';

-- 插入Cursor的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Cursor Editor', 'Code Editor', 'AI驱动的代码编辑器，集成AI助手功能', 'https://cursor.sh', ARRAY['Code Editor', 'AI Coding', 'Developer Tools', 'IDE'], '["AI代码生成", "智能补全", "代码解释", "重构建议", "多语言支持"]'::jsonb, true, false, 'Subscription'
FROM public.companies c WHERE c.name = 'Cursor';

-- 插入Lovable的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Lovable Platform', 'Web Development', 'AI驱动的Web开发平台，快速创建全栈应用', 'https://lovable.dev', ARRAY['Web Development', 'AI Coding', 'Rapid Prototyping', 'Full-stack'], '["快速原型", "全栈开发", "AI代码生成", "实时预览", "部署集成"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Lovable';

-- 插入Cognition的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Devin', 'AI Engineer', 'AI软件工程师，能够自主完成复杂的编程任务', 'https://cognition.ai', ARRAY['Software Engineering', 'AI Coding', 'Automation', 'Autonomous'], '["自主编程", "复杂任务", "代码调试", "系统设计", "长期项目"]'::jsonb, false, false, 'Enterprise'
FROM public.companies c WHERE c.name = 'Cognition';

-- 插入X (Twitter)的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Grok', 'AI Assistant', 'X平台的AI助手，提供实时信息和对话功能', 'https://x.com', ARRAY['Social Media', 'AI Assistant', 'Real-time', 'Information'], '["实时信息", "对话生成", "社交媒体集成", "多模态交互"]'::jsonb, true, false, 'Subscription'
FROM public.companies c WHERE c.name = 'X (Twitter)';

-- 插入Meta的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Meta AI', 'AI Assistant', 'Meta的AI助手，集成到社交媒体平台中', 'https://ai.meta.com', ARRAY['Social Media', 'AI Assistant', 'Multimodal', 'Integration'], '["对话生成", "图像生成", "社交媒体集成", "多模态交互"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Meta';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'LLaMA', 'LLM', 'Meta的开源大语言模型系列', 'https://ai.meta.com/llama', ARRAY['Open Source', 'LLM', 'Research', 'Developer Tools'], '["开源模型", "多尺寸版本", "研究用途", "商业许可"]'::jsonb, true, true, 'Open Source'
FROM public.companies c WHERE c.name = 'Meta';

-- 插入Hugging Face的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Hugging Face Hub', 'Model Hub', '开源AI模型和数据集平台', 'https://huggingface.co', ARRAY['Open Source AI', 'Model Hub', 'NLP', 'Community'], '["模型库", "数据集", "推理API", "社区协作", "开源"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Hugging Face';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Inference API', 'API Service', 'Hugging Face的推理API服务', 'https://huggingface.co/inference-api', ARRAY['Developer Tools', 'API', 'Inference', 'Open Source'], '["模型推理", "批量处理", "多模型支持", "企业集成"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = 'Hugging Face';

-- 插入Stability AI的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Stable Diffusion', 'Image Generation', '开源图像生成模型', 'https://stability.ai', ARRAY['Open Source AI', 'Image Generation', 'Diffusion Models', 'Creative'], '["文本到图像", "开源模型", "高质量生成", "自定义训练"]'::jsonb, true, true, 'Open Source'
FROM public.companies c WHERE c.name = 'Stability AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'DreamStudio', 'Image Generation', 'Stability AI的图像生成平台', 'https://dreamstudio.ai', ARRAY['Image Generation', 'Creative AI', 'User Interface'], '["文本到图像", "图像编辑", "风格控制", "高分辨率"]'::jsonb, true, true, 'Pay-per-image'
FROM public.companies c WHERE c.name = 'Stability AI';
