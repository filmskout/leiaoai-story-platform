-- 中国AI公司工具数据
-- 包含各公司的具体工具、服务和产品

-- 插入百度的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '文心一言', 'Conversational AI', '百度的大语言模型，支持中文对话和文本生成', 'https://yiyan.baidu.com', ARRAY['Chinese LLM', 'Conversational AI', 'Text Generation'], '["中文对话", "文本生成", "多模态交互", "知识问答"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '百度';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '文心大模型API', 'API Service', '百度文心大模型的API接口服务', 'https://cloud.baidu.com', ARRAY['Developer Tools', 'API', 'Chinese LLM'], '["文本生成API", "对话API", "多模态API", "企业集成"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = '百度';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Apollo自动驾驶', 'Autonomous Driving', '百度Apollo自动驾驶平台', 'https://apollo.auto', ARRAY['Autonomous Driving', 'AI Platform', 'Automotive'], '["自动驾驶", "高精地图", "车路协同", "智能交通"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = '百度';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '百度智能云', 'Cloud AI', '百度智能云AI服务平台', 'https://cloud.baidu.com', ARRAY['Cloud AI', 'AI Platform', 'Enterprise'], '["AI服务", "机器学习", "深度学习", "企业解决方案"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = '百度';

-- 插入阿里巴巴的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '通义千问', 'Conversational AI', '阿里巴巴的大语言模型，支持中文对话和任务执行', 'https://tongyi.aliyun.com', ARRAY['Chinese LLM', 'Conversational AI', 'Task Execution'], '["中文对话", "任务执行", "代码生成", "多模态交互"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '阿里巴巴';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '通义万相', 'Image Generation', '阿里巴巴的AI图像生成模型', 'https://tongyi.aliyun.com', ARRAY['Image Generation', 'Creative AI', 'Chinese AI'], '["文本到图像", "图像编辑", "风格转换", "中文理解"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '阿里巴巴';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '阿里云AI', 'Cloud AI', '阿里云AI服务平台', 'https://www.aliyun.com', ARRAY['Cloud AI', 'AI Platform', 'Enterprise'], '["机器学习", "深度学习", "自然语言处理", "计算机视觉"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = '阿里巴巴';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '钉钉AI', 'AI Assistant', '钉钉智能助手，集成到办公场景中', 'https://www.dingtalk.com', ARRAY['Productivity', 'AI Assistant', 'Office Integration'], '["智能助手", "会议总结", "文档生成", "工作流自动化"]'::jsonb, true, false, 'Subscription'
FROM public.companies c WHERE c.name = '阿里巴巴';

-- 插入腾讯的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '混元大模型', 'Conversational AI', '腾讯的大语言模型，支持中文对话和内容生成', 'https://hunyuan.tencent.com', ARRAY['Chinese LLM', 'Conversational AI', 'Content Generation'], '["中文对话", "内容生成", "代码生成", "多模态交互"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '腾讯';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '腾讯云AI', 'Cloud AI', '腾讯云AI服务平台', 'https://cloud.tencent.com', ARRAY['Cloud AI', 'AI Platform', 'Enterprise'], '["机器学习", "深度学习", "自然语言处理", "计算机视觉"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = '腾讯';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '腾讯混元助手', 'AI Assistant', '腾讯混元AI助手，集成到微信等产品中', 'https://weixin.qq.com', ARRAY['AI Assistant', 'Social Media', 'Productivity'], '["智能助手", "对话生成", "内容创作", "社交集成"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '腾讯';

-- 插入字节跳动的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '豆包', 'Conversational AI', '字节跳动的大语言模型，支持中文对话和内容生成', 'https://www.doubao.com', ARRAY['Chinese LLM', 'Conversational AI', 'Content Generation'], '["中文对话", "内容生成", "创意写作", "多模态交互"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '字节跳动';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '豆包大模型API', 'API Service', '字节跳动豆包大模型的API接口', 'https://www.volcengine.com', ARRAY['Developer Tools', 'API', 'Chinese LLM'], '["文本生成API", "对话API", "多模态API", "企业集成"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = '字节跳动';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '剪映AI', 'Video Generation', '剪映AI视频生成和编辑工具', 'https://lv.ulikecam.com', ARRAY['Video Generation', 'Creative AI', 'Video Editing'], '["AI视频生成", "智能剪辑", "特效制作", "自动字幕"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '字节跳动';

-- 插入商汤科技的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '商汤AI平台', 'AI Platform', '商汤科技的一站式AI开发平台', 'https://www.sensetime.com', ARRAY['AI Platform', 'Computer Vision', 'Enterprise'], '["计算机视觉", "人脸识别", "图像分析", "智能监控"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = '商汤科技';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '商汤大模型', 'LLM', '商汤科技的大语言模型', 'https://www.sensetime.com', ARRAY['LLM', 'Chinese AI', 'Multimodal'], '["大语言模型", "多模态AI", "中文理解", "视觉语言"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = '商汤科技';

-- 插入科大讯飞的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '讯飞星火', 'Conversational AI', '科大讯飞的大语言模型，专注于中文语音和文本处理', 'https://xinghuo.xfyun.cn', ARRAY['Chinese LLM', 'Speech Recognition', 'Conversational AI'], '["中文对话", "语音识别", "语音合成", "多语言支持"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '科大讯飞';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '讯飞开放平台', 'API Service', '科大讯飞的AI能力开放平台', 'https://www.xfyun.cn', ARRAY['Developer Tools', 'API', 'Speech Recognition'], '["语音识别API", "语音合成API", "自然语言处理API", "多语言支持"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = '科大讯飞';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '讯飞听见', 'Speech Recognition', '科大讯飞的语音转文字服务', 'https://www.iflyrec.com', ARRAY['Speech Recognition', 'Transcription', 'Real-time'], '["实时转写", "多语言识别", "方言识别", "专业词汇"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '科大讯飞';

-- 插入MiniMax的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'MiniMax大模型', 'LLM', 'MiniMax的通用基础模型，支持对话和多模态内容生成', 'https://www.minimax.com', ARRAY['LLM', 'Multimodal AI', 'Conversational AI'], '["对话生成", "多模态内容", "创意写作", "代码生成"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'MiniMax';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'MiniMax API', 'API Service', 'MiniMax大模型的API接口', 'https://www.minimax.com', ARRAY['Developer Tools', 'API', 'LLM'], '["文本生成API", "多模态API", "对话API", "企业集成"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = 'MiniMax';

-- 插入智谱AI的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'ChatGLM', 'Conversational AI', '智谱AI的大语言模型，支持中文对话和任务执行', 'https://chatglm.cn', ARRAY['Chinese LLM', 'Conversational AI', 'Task Execution'], '["中文对话", "任务执行", "代码生成", "知识问答"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '智谱AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '智谱清言', 'Conversational AI', '智谱AI的对话助手，集成到多个应用场景', 'https://chatglm.cn', ARRAY['Conversational AI', 'AI Assistant', 'Chinese AI'], '["智能对话", "知识问答", "创意写作", "学习助手"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '智谱AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '智谱AI API', 'API Service', '智谱AI大模型的API接口', 'https://open.bigmodel.cn', ARRAY['Developer Tools', 'API', 'Chinese LLM'], '["文本生成API", "对话API", "多模态API", "企业集成"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = '智谱AI';

-- 插入月之暗面的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Kimi', 'Conversational AI', '月之暗面的大语言模型，支持长文本处理和分析', 'https://kimi.moonshot.cn', ARRAY['Chinese LLM', 'Conversational AI', 'Long Text'], '["长文本处理", "智能对话", "文档分析", "知识问答"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '月之暗面';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Moonshot API', 'API Service', '月之暗面大模型的API接口', 'https://platform.moonshot.cn', ARRAY['Developer Tools', 'API', 'Chinese LLM'], '["文本生成API", "对话API", "长文本处理", "企业集成"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = '月之暗面';

-- 插入零一万物的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Yi大模型', 'LLM', '零一万物的大语言模型，支持多语言和多模态', 'https://www.01.ai', ARRAY['LLM', 'Multilingual', 'Multimodal'], '["多语言支持", "多模态交互", "代码生成", "创意写作"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '零一万物';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Yi API', 'API Service', '零一万物Yi大模型的API接口', 'https://www.01.ai', ARRAY['Developer Tools', 'API', 'LLM'], '["文本生成API", "多模态API", "多语言API", "企业集成"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = '零一万物';

-- 插入百川智能的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Baichuan大模型', 'LLM', '百川智能的大语言模型，专注于中文理解和生成', 'https://www.baichuan-ai.com', ARRAY['Chinese LLM', 'Conversational AI', 'Text Generation'], '["中文对话", "文本生成", "知识问答", "创意写作"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '百川智能';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Baichuan API', 'API Service', '百川智能大模型的API接口', 'https://www.baichuan-ai.com', ARRAY['Developer Tools', 'API', 'Chinese LLM'], '["文本生成API", "对话API", "中文理解API", "企业集成"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = '百川智能';

-- 插入深言科技的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'DeepSeek', 'Conversational AI', '深言科技的大语言模型，专注于代码生成和数学推理', 'https://www.deepseek.com', ARRAY['Chinese LLM', 'Code Generation', 'Math Reasoning'], '["代码生成", "数学推理", "中文对话", "逻辑分析"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = '深言科技';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'DeepSeek API', 'API Service', '深言科技DeepSeek大模型的API接口', 'https://platform.deepseek.com', ARRAY['Developer Tools', 'API', 'Code Generation'], '["代码生成API", "对话API", "数学推理API", "企业集成"]'::jsonb, true, false, 'Pay-per-token'
FROM public.companies c WHERE c.name = '深言科技';

-- 插入来也科技的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '来也RPA', 'RPA', '来也科技的RPA自动化平台', 'https://www.laiye.com', ARRAY['RPA', 'Automation', 'AI Assistant'], '["流程自动化", "智能机器人", "工作流管理", "企业集成"]'::jsonb, true, false, 'Subscription'
FROM public.companies c WHERE c.name = '来也科技';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '来也AI助手', 'AI Assistant', '来也科技的AI智能助手', 'https://www.laiye.com', ARRAY['AI Assistant', 'Automation', 'Productivity'], '["智能助手", "任务执行", "工作流自动化", "企业服务"]'::jsonb, true, false, 'Subscription'
FROM public.companies c WHERE c.name = '来也科技';

-- 插入第四范式的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '第四范式平台', 'ML Platform', '第四范式的企业级机器学习平台', 'https://www.4paradigm.com', ARRAY['Enterprise AI', 'ML Platform', 'AutoML'], '["机器学习平台", "AutoML", "模型部署", "企业AI"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = '第四范式';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '第四范式AI', 'AI Platform', '第四范式的AI能力平台', 'https://www.4paradigm.com', ARRAY['AI Platform', 'Enterprise AI', 'ML'], '["AI能力", "机器学习", "深度学习", "企业解决方案"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = '第四范式';

-- 插入云从科技的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '云从AI平台', 'AI Platform', '云从科技的AI能力平台', 'https://www.cloudwalk.cn', ARRAY['Computer Vision', 'Face Recognition', 'AI Platform'], '["人脸识别", "计算机视觉", "智能分析", "安防监控"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = '云从科技';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '云从大模型', 'LLM', '云从科技的大语言模型', 'https://www.cloudwalk.cn', ARRAY['LLM', 'Chinese AI', 'Multimodal'], '["大语言模型", "多模态AI", "中文理解", "视觉语言"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = '云从科技';

-- 插入依图科技的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '依图AI平台', 'AI Platform', '依图科技的AI能力平台', 'https://www.yitutech.com', ARRAY['Computer Vision', 'Speech Recognition', 'AI Platform'], '["计算机视觉", "语音识别", "智能分析", "AI平台"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = '依图科技';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '依图大模型', 'LLM', '依图科技的大语言模型', 'https://www.yitutech.com', ARRAY['LLM', 'Chinese AI', 'Multimodal'], '["大语言模型", "多模态AI", "中文理解", "视觉语言"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = '依图科技';

-- 插入思必驰的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '思必驰AI', 'Voice AI', '思必驰的语音AI平台', 'https://www.aichat.com', ARRAY['Speech Recognition', 'Voice AI', 'NLP'], '["语音识别", "语音合成", "自然语言处理", "多语言支持"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = '思必驰';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, '思必驰API', 'API Service', '思必驰的语音AI API接口', 'https://www.aichat.com', ARRAY['Developer Tools', 'API', 'Voice AI'], '["语音识别API", "语音合成API", "NLP API", "企业集成"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = '思必驰';
