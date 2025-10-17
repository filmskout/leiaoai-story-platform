-- 中国AI公司数据
-- 基于最新的中国AI公司信息和融资数据

-- 插入中国主要AI公司
INSERT INTO public.companies (name, website, description, founded_year, headquarters, industry_tags, logo_url, social_links, valuation_usd, last_funding_date) VALUES

-- 百度
('百度', 'https://www.baidu.com', '中国领先的AI技术公司，提供搜索引擎、自动驾驶、AI芯片等产品', 2000, '北京, 中国', ARRAY['Search', 'AI Platform', 'Autonomous Driving', 'LLM'], 'https://www.baidu.com/favicon.ico', '{"weibo": "https://weibo.com/baidu", "zhihu": "https://www.zhihu.com/org/baidu"}', 45000000000, '2024-01-01'),

-- 阿里巴巴
('阿里巴巴', 'https://www.alibaba.com', '全球领先的电商和云计算公司，提供AI驱动的商业解决方案', 1999, '杭州, 中国', ARRAY['E-commerce', 'Cloud Computing', 'AI Platform', 'LLM'], 'https://www.alibaba.com/favicon.ico', '{"weibo": "https://weibo.com/alibaba", "zhihu": "https://www.zhihu.com/org/alibaba"}', 200000000000, '2024-01-01'),

-- 腾讯
('腾讯', 'https://www.tencent.com', '中国领先的互联网公司，提供社交、游戏、AI等多元化服务', 1998, '深圳, 中国', ARRAY['Social Media', 'Gaming', 'AI Platform', 'LLM'], 'https://www.tencent.com/favicon.ico', '{"weibo": "https://weibo.com/tencent", "zhihu": "https://www.zhihu.com/org/tencent"}', 400000000000, '2024-01-01'),

-- 字节跳动
('字节跳动', 'https://www.bytedance.com', '全球领先的互联网公司，提供短视频、AI等创新产品', 2012, '北京, 中国', ARRAY['Social Media', 'Video', 'AI Platform', 'LLM'], 'https://www.bytedance.com/favicon.ico', '{"weibo": "https://weibo.com/bytedance", "zhihu": "https://www.zhihu.com/org/bytedance"}', 140000000000, '2024-01-01'),

-- 商汤科技
('商汤科技', 'https://www.sensetime.com', '全球领先的AI公司，专注于计算机视觉和深度学习技术', 2014, '香港, 中国', ARRAY['Computer Vision', 'Deep Learning', 'AI Platform'], 'https://www.sensetime.com/favicon.ico', '{"weibo": "https://weibo.com/sensetime", "zhihu": "https://www.zhihu.com/org/sensetime"}', 12000000000, '2021-12-01'),

-- 科大讯飞
('科大讯飞', 'https://www.iflytek.com', '中国领先的语音识别和自然语言处理技术公司', 1999, '合肥, 中国', ARRAY['Speech Recognition', 'NLP', 'AI Platform'], 'https://www.iflytek.com/favicon.ico', '{"weibo": "https://weibo.com/iflytek", "zhihu": "https://www.zhihu.com/org/iflytek"}', 15000000000, '2023-01-01'),

-- 旷视科技
('旷视科技', 'https://www.megvii.com', '专注于计算机视觉技术的AI公司，提供人脸识别和智能城市解决方案', 2011, '北京, 中国', ARRAY['Computer Vision', 'Face Recognition', 'Smart City'], 'https://www.megvii.com/favicon.ico', '{"weibo": "https://weibo.com/megvii", "zhihu": "https://www.zhihu.com/org/megvii"}', 4000000000, '2019-05-01'),

-- 寒武纪科技
('寒武纪科技', 'https://www.cambricon.com', '专注于AI芯片设计的公司，提供云端和边缘计算AI芯片', 2016, '北京, 中国', ARRAY['AI Chips', 'Edge Computing', 'Hardware'], 'https://www.cambricon.com/favicon.ico', '{"weibo": "https://weibo.com/cambricon", "zhihu": "https://www.zhihu.com/org/cambricon"}', 2000000000, '2020-07-01'),

-- 优必选科技
('优必选科技', 'https://www.ubtrobot.com', '全球领先的AI和人形机器人公司', 2012, '深圳, 中国', ARRAY['Robotics', 'AI', 'Humanoid Robots'], 'https://www.ubtrobot.com/favicon.ico', '{"weibo": "https://weibo.com/ubtrobot", "zhihu": "https://www.zhihu.com/org/ubtrobot"}', 1000000000, '2018-05-01'),

-- MiniMax
('MiniMax', 'https://www.minimax.com', '专注于通用基础模型的AI公司，提供对话和多模态内容生成', 2021, '北京, 中国', ARRAY['LLM', 'Multimodal AI', 'Conversational AI'], 'https://www.minimax.com/favicon.ico', '{"weibo": "https://weibo.com/minimax", "zhihu": "https://www.zhihu.com/org/minimax"}', 2500000000, '2024-03-01'),

-- 智谱AI
('智谱AI', 'https://www.zhipuai.cn', '专注于大模型技术的AI公司，提供ChatGLM等产品', 2019, '北京, 中国', ARRAY['LLM', 'AI Platform', 'ChatGLM'], 'https://www.zhipuai.cn/favicon.ico', '{"weibo": "https://weibo.com/zhipuai", "zhihu": "https://www.zhihu.com/org/zhipuai"}', 1000000000, '2024-01-01'),

-- 月之暗面
('月之暗面', 'https://www.moonshot.ai', '专注于大模型技术的AI公司，提供Kimi等产品', 2023, '北京, 中国', ARRAY['LLM', 'AI Platform', 'Kimi'], 'https://www.moonshot.ai/favicon.ico', '{"weibo": "https://weibo.com/moonshot", "zhihu": "https://www.zhihu.com/org/moonshot"}', 2000000000, '2024-02-01'),

-- 零一万物
('零一万物', 'https://www.01.ai', '专注于AI技术的公司，提供Yi系列大模型', 2023, '北京, 中国', ARRAY['LLM', 'AI Platform', 'Yi Model'], 'https://www.01.ai/favicon.ico', '{"weibo": "https://weibo.com/01ai", "zhihu": "https://www.zhihu.com/org/01ai"}', 1000000000, '2024-01-01'),

-- 百川智能
('百川智能', 'https://www.baichuan-ai.com', '专注于大模型技术的AI公司，提供Baichuan系列模型', 2023, '北京, 中国', ARRAY['LLM', 'AI Platform', 'Baichuan'], 'https://www.baichuan-ai.com/favicon.ico', '{"weibo": "https://weibo.com/baichuan", "zhihu": "https://www.zhihu.com/org/baichuan"}', 1000000000, '2024-01-01'),

-- 深言科技
('深言科技', 'https://www.deepseek.com', '专注于大模型技术的AI公司，提供DeepSeek系列模型', 2023, '北京, 中国', ARRAY['LLM', 'AI Platform', 'DeepSeek'], 'https://www.deepseek.com/favicon.ico', '{"weibo": "https://weibo.com/deepseek", "zhihu": "https://www.zhihu.com/org/deepseek"}', 2000000000, '2024-01-01'),

-- 来也科技
('来也科技', 'https://www.laiye.com', '专注于RPA和AI自动化的公司，提供智能机器人解决方案', 2015, '北京, 中国', ARRAY['RPA', 'Automation', 'AI Assistant'], 'https://www.laiye.com/favicon.ico', '{"weibo": "https://weibo.com/laiye", "zhihu": "https://www.zhihu.com/org/laiye"}', 500000000, '2021-07-01'),

-- 第四范式
('第四范式', 'https://www.4paradigm.com', '专注于企业级AI平台的公司，提供机器学习平台', 2014, '北京, 中国', ARRAY['Enterprise AI', 'ML Platform', 'AI Platform'], 'https://www.4paradigm.com/favicon.ico', '{"weibo": "https://weibo.com/4paradigm", "zhihu": "https://www.zhihu.com/org/4paradigm"}', 2000000000, '2021-01-01'),

-- 云从科技
('云从科技', 'https://www.cloudwalk.cn', '专注于计算机视觉技术的AI公司，提供人脸识别和智能分析', 2015, '广州, 中国', ARRAY['Computer Vision', 'Face Recognition', 'AI Platform'], 'https://www.cloudwalk.cn/favicon.ico', '{"weibo": "https://weibo.com/cloudwalk", "zhihu": "https://www.zhihu.com/org/cloudwalk"}', 1000000000, '2020-05-01'),

-- 依图科技
('依图科技', 'https://www.yitutech.com', '专注于计算机视觉和语音技术的AI公司', 2012, '上海, 中国', ARRAY['Computer Vision', 'Speech Recognition', 'AI Platform'], 'https://www.yitutech.com/favicon.ico', '{"weibo": "https://weibo.com/yitutech", "zhihu": "https://www.zhihu.com/org/yitutech"}', 1500000000, '2020-11-01'),

-- 思必驰
('思必驰', 'https://www.aichat.com', '专注于语音识别和自然语言处理技术的AI公司', 2007, '苏州, 中国', ARRAY['Speech Recognition', 'NLP', 'Voice AI'], 'https://www.aichat.com/favicon.ico', '{"weibo": "https://weibo.com/aichat", "zhihu": "https://www.zhihu.com/org/aichat"}', 1000000000, '2021-03-01')

-- Use DO NOTHING to avoid duplicate insertion errors
ON CONFLICT DO NOTHING;
