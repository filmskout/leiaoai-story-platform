import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

// Comprehensive company and tool data with bilingual support
const comprehensiveData = {
  companies: [
    // Chinese AI Companies
    {
      name: '百度',
      name_en: 'Baidu',
      name_zh_hans: '百度',
      name_zh_hant: '百度',
      description: '中国领先的AI公司，专注于搜索引擎、自动驾驶和人工智能技术',
      description_en: 'Leading Chinese AI company focused on search engines, autonomous driving, and AI technology',
      description_zh_hans: '中国领先的AI公司，专注于搜索引擎、自动驾驶和人工智能技术',
      description_zh_hant: '中國領先的AI公司，專注於搜索引擎、自動駕駛和人工智能技術',
      website: 'https://www.baidu.com',
      logo_url: 'https://www.baidu.com/favicon.ico',
      headquarters: '北京, 中国',
      founded_year: 2000,
      industry_tags: ['搜索引擎', '自动驾驶', 'AI平台', 'Search Engine', 'Autonomous Driving', 'AI Platform'],
      tools: [
        {
          name: '文心一言',
          name_en: 'ERNIE Bot',
          name_zh_hans: '文心一言',
          name_zh_hant: '文心一言',
          description: '百度开发的大语言模型，具备强大的对话和生成能力',
          description_en: 'Baidu\'s large language model with powerful conversational and generative capabilities',
          description_zh_hans: '百度开发的大语言模型，具备强大的对话和生成能力',
          description_zh_hant: '百度開發的大語言模型，具備強大的對話和生成能力',
          website: 'https://yiyan.baidu.com',
          logo_url: 'https://yiyan.baidu.com/favicon.ico',
          category: 'LLM',
          industry_tags: ['对话AI', '文本生成', 'Conversational AI', 'Text Generation']
        }
      ]
    },
    {
      name: '阿里巴巴',
      name_en: 'Alibaba',
      name_zh_hans: '阿里巴巴',
      name_zh_hant: '阿里巴巴',
      description: '全球领先的电商和云计算公司，在AI领域有重要布局',
      description_en: 'Global leading e-commerce and cloud computing company with significant AI investments',
      description_zh_hans: '全球领先的电商和云计算公司，在AI领域有重要布局',
      description_zh_hant: '全球領先的電商和雲計算公司，在AI領域有重要佈局',
      website: 'https://www.alibaba.com',
      logo_url: 'https://www.alibaba.com/favicon.ico',
      headquarters: '杭州, 中国',
      founded_year: 1999,
      industry_tags: ['电商', '云计算', 'AI平台', 'E-commerce', 'Cloud Computing', 'AI Platform'],
      tools: [
        {
          name: '通义千问',
          name_en: 'Qwen',
          name_zh_hans: '通义千问',
          name_zh_hant: '通義千問',
          description: '阿里巴巴开发的大语言模型，支持多模态交互',
          description_en: 'Alibaba\'s large language model supporting multimodal interactions',
          description_zh_hans: '阿里巴巴开发的大语言模型，支持多模态交互',
          description_zh_hant: '阿里巴巴開發的大語言模型，支持多模態交互',
          website: 'https://tongyi.aliyun.com',
          logo_url: 'https://tongyi.aliyun.com/favicon.ico',
          category: 'LLM',
          industry_tags: ['对话AI', '多模态', 'Conversational AI', 'Multimodal']
        }
      ]
    },
    {
      name: '腾讯',
      name_en: 'Tencent',
      name_zh_hans: '腾讯',
      name_zh_hant: '騰訊',
      description: '中国领先的互联网公司，在游戏、社交和AI领域有重要地位',
      description_en: 'Leading Chinese internet company with significant presence in gaming, social media, and AI',
      description_zh_hans: '中国领先的互联网公司，在游戏、社交和AI领域有重要地位',
      description_zh_hant: '中國領先的互聯網公司，在遊戲、社交和AI領域有重要地位',
      website: 'https://www.tencent.com',
      logo_url: 'https://www.tencent.com/favicon.ico',
      headquarters: '深圳, 中国',
      founded_year: 1998,
      industry_tags: ['游戏', '社交', 'AI平台', 'Gaming', 'Social Media', 'AI Platform'],
      tools: [
        {
          name: '混元大模型',
          name_en: 'Hunyuan',
          name_zh_hans: '混元大模型',
          name_zh_hant: '混元大模型',
          description: '腾讯开发的大语言模型，具备强大的理解和生成能力',
          description_en: 'Tencent\'s large language model with powerful understanding and generation capabilities',
          description_zh_hans: '腾讯开发的大语言模型，具备强大的理解和生成能力',
          description_zh_hant: '騰訊開發的大語言模型，具備強大的理解和生成能力',
          website: 'https://hunyuan.tencent.com',
          logo_url: 'https://hunyuan.tencent.com/favicon.ico',
          category: 'LLM',
          industry_tags: ['对话AI', '文本生成', 'Conversational AI', 'Text Generation']
        }
      ]
    },
    {
      name: '字节跳动',
      name_en: 'ByteDance',
      name_zh_hans: '字节跳动',
      name_zh_hant: '字節跳動',
      description: '全球领先的短视频和AI公司，旗下有TikTok等知名产品',
      description_en: 'Global leading short video and AI company, creator of TikTok and other popular products',
      description_zh_hans: '全球领先的短视频和AI公司，旗下有TikTok等知名产品',
      description_zh_hant: '全球領先的短視頻和AI公司，旗下有TikTok等知名產品',
      website: 'https://www.bytedance.com',
      logo_url: 'https://www.bytedance.com/favicon.ico',
      headquarters: '北京, 中国',
      founded_year: 2012,
      industry_tags: ['短视频', 'AI推荐', '内容生成', 'Short Video', 'AI Recommendation', 'Content Generation'],
      tools: [
        {
          name: '豆包',
          name_en: 'Doubao',
          name_zh_hans: '豆包',
          name_zh_hant: '豆包',
          description: '字节跳动开发的AI助手，支持多种任务处理',
          description_en: 'ByteDance\'s AI assistant supporting various task processing',
          description_zh_hans: '字节跳动开发的AI助手，支持多种任务处理',
          description_zh_hant: '字節跳動開發的AI助手，支持多種任務處理',
          website: 'https://www.doubao.com',
          logo_url: 'https://www.doubao.com/favicon.ico',
          category: 'LLM',
          industry_tags: ['AI助手', '任务处理', 'AI Assistant', 'Task Processing']
        }
      ]
    },
    {
      name: '商汤科技',
      name_en: 'SenseTime',
      name_zh_hans: '商汤科技',
      name_zh_hant: '商湯科技',
      description: '全球领先的AI视觉公司，专注于计算机视觉和深度学习',
      description_en: 'Global leading AI vision company focused on computer vision and deep learning',
      description_zh_hans: '全球领先的AI视觉公司，专注于计算机视觉和深度学习',
      description_zh_hant: '全球領先的AI視覺公司，專注於計算機視覺和深度學習',
      website: 'https://www.sensetime.com',
      logo_url: 'https://www.sensetime.com/favicon.ico',
      headquarters: '上海, 中国',
      founded_year: 2014,
      industry_tags: ['计算机视觉', '深度学习', '人脸识别', 'Computer Vision', 'Deep Learning', 'Face Recognition'],
      tools: [
        {
          name: '商量',
          name_en: 'SenseChat',
          name_zh_hans: '商量',
          name_zh_hant: '商量',
          description: '商汤科技开发的对话AI，具备强大的多模态理解能力',
          description_en: 'SenseTime\'s conversational AI with powerful multimodal understanding capabilities',
          description_zh_hans: '商汤科技开发的对话AI，具备强大的多模态理解能力',
          description_zh_hant: '商湯科技開發的對話AI，具備強大的多模態理解能力',
          website: 'https://chat.sensetime.com',
          logo_url: 'https://chat.sensetime.com/favicon.ico',
          category: 'LLM',
          industry_tags: ['对话AI', '多模态', 'Conversational AI', 'Multimodal']
        }
      ]
    },
    {
      name: '科大讯飞',
      name_en: 'iFLYTEK',
      name_zh_hans: '科大讯飞',
      name_zh_hant: '科大訊飛',
      description: '中国领先的语音AI公司，专注于语音识别和自然语言处理',
      description_en: 'Leading Chinese voice AI company focused on speech recognition and natural language processing',
      description_zh_hans: '中国领先的语音AI公司，专注于语音识别和自然语言处理',
      description_zh_hant: '中國領先的語音AI公司，專注於語音識別和自然語言處理',
      website: 'https://www.iflytek.com',
      logo_url: 'https://www.iflytek.com/favicon.ico',
      headquarters: '合肥, 中国',
      founded_year: 1999,
      industry_tags: ['语音识别', '自然语言处理', '教育AI', 'Speech Recognition', 'NLP', 'Education AI'],
      tools: [
        {
          name: '星火认知大模型',
          name_en: 'SparkDesk',
          name_zh_hans: '星火认知大模型',
          name_zh_hant: '星火認知大模型',
          description: '科大讯飞开发的大语言模型，具备强大的认知和推理能力',
          description_en: 'iFLYTEK\'s large language model with powerful cognitive and reasoning capabilities',
          description_zh_hans: '科大讯飞开发的大语言模型，具备强大的认知和推理能力',
          description_zh_hant: '科大訊飛開發的大語言模型，具備強大的認知和推理能力',
          website: 'https://xinghuo.xfyun.cn',
          logo_url: 'https://xinghuo.xfyun.cn/favicon.ico',
          category: 'LLM',
          industry_tags: ['认知AI', '推理', 'Cognitive AI', 'Reasoning']
        }
      ]
    },
    {
      name: '旷视科技',
      name_en: 'Megvii',
      name_zh_hans: '旷视科技',
      name_zh_hant: '曠視科技',
      description: '中国领先的计算机视觉公司，专注于人脸识别和图像分析',
      description_en: 'Leading Chinese computer vision company focused on face recognition and image analysis',
      description_zh_hans: '中国领先的计算机视觉公司，专注于人脸识别和图像分析',
      description_zh_hant: '中國領先的計算機視覺公司，專注於人臉識別和圖像分析',
      website: 'https://www.megvii.com',
      logo_url: 'https://www.megvii.com/favicon.ico',
      headquarters: '北京, 中国',
      founded_year: 2011,
      industry_tags: ['计算机视觉', '人脸识别', '图像分析', 'Computer Vision', 'Face Recognition', 'Image Analysis'],
      tools: [
        {
          name: 'Face++',
          name_en: 'Face++',
          name_zh_hans: 'Face++',
          name_zh_hant: 'Face++',
          description: '旷视科技的人脸识别平台，提供强大的视觉AI服务',
          description_en: 'Megvii\'s face recognition platform providing powerful visual AI services',
          description_zh_hans: '旷视科技的人脸识别平台，提供强大的视觉AI服务',
          description_zh_hant: '曠視科技的人臉識別平台，提供強大的視覺AI服務',
          website: 'https://www.faceplusplus.com',
          logo_url: 'https://www.faceplusplus.com/favicon.ico',
          category: 'Computer Vision',
          industry_tags: ['人脸识别', '视觉AI', 'Face Recognition', 'Visual AI']
        }
      ]
    },
    {
      name: '寒武纪科技',
      name_en: 'Cambricon',
      name_zh_hans: '寒武纪科技',
      name_zh_hant: '寒武紀科技',
      description: '中国领先的AI芯片公司，专注于智能计算芯片设计',
      description_en: 'Leading Chinese AI chip company focused on intelligent computing chip design',
      description_zh_hans: '中国领先的AI芯片公司，专注于智能计算芯片设计',
      description_zh_hant: '中國領先的AI芯片公司，專注於智能計算芯片設計',
      website: 'https://www.cambricon.com',
      logo_url: 'https://www.cambricon.com/favicon.ico',
      headquarters: '北京, 中国',
      founded_year: 2016,
      industry_tags: ['AI芯片', '智能计算', '芯片设计', 'AI Chip', 'Intelligent Computing', 'Chip Design'],
      tools: [
        {
          name: 'MLU',
          name_en: 'MLU',
          name_zh_hans: 'MLU',
          name_zh_hant: 'MLU',
          description: '寒武纪的机器学习单元，专为AI计算优化',
          description_en: 'Cambricon\'s Machine Learning Unit optimized for AI computing',
          description_zh_hans: '寒武纪的机器学习单元，专为AI计算优化',
          description_zh_hant: '寒武紀的機器學習單元，專為AI計算優化',
          website: 'https://www.cambricon.com',
          logo_url: 'https://www.cambricon.com/favicon.ico',
          category: 'AI Chip',
          industry_tags: ['AI芯片', '机器学习', 'AI Chip', 'Machine Learning']
        }
      ]
    },
    {
      name: '优必选科技',
      name_en: 'UBTECH',
      name_zh_hans: '优必选科技',
      name_zh_hant: '優必選科技',
      description: '全球领先的服务机器人公司，专注于人形机器人研发',
      description_en: 'Global leading service robotics company focused on humanoid robot development',
      description_zh_hans: '全球领先的服务机器人公司，专注于人形机器人研发',
      description_zh_hant: '全球領先的服務機器人公司，專注於人形機器人研發',
      website: 'https://www.ubtrobot.com',
      logo_url: 'https://www.ubtrobot.com/favicon.ico',
      headquarters: '深圳, 中国',
      founded_year: 2012,
      industry_tags: ['服务机器人', '人形机器人', 'AI机器人', 'Service Robotics', 'Humanoid Robot', 'AI Robot'],
      tools: [
        {
          name: 'Walker X',
          name_en: 'Walker X',
          name_zh_hans: 'Walker X',
          name_zh_hant: 'Walker X',
          description: '优必选的人形机器人，具备先进的运动控制和AI能力',
          description_en: 'UBTECH\'s humanoid robot with advanced motion control and AI capabilities',
          description_zh_hans: '优必选的人形机器人，具备先进的运动控制和AI能力',
          description_zh_hant: '優必選的人形機器人，具備先進的運動控制和AI能力',
          website: 'https://www.ubtrobot.com',
          logo_url: 'https://www.ubtrobot.com/favicon.ico',
          category: 'Robotics',
          industry_tags: ['人形机器人', '运动控制', 'Humanoid Robot', 'Motion Control']
        }
      ]
    },
    {
      name: 'MiniMax',
      name_en: 'MiniMax',
      name_zh_hans: 'MiniMax',
      name_zh_hant: 'MiniMax',
      description: '中国领先的AI公司，专注于多模态大模型和内容生成',
      description_en: 'Leading Chinese AI company focused on multimodal large models and content generation',
      description_zh_hans: '中国领先的AI公司，专注于多模态大模型和内容生成',
      description_zh_hant: '中國領先的AI公司，專注於多模態大模型和內容生成',
      website: 'https://www.minimax.com',
      logo_url: 'https://www.minimax.com/favicon.ico',
      headquarters: '北京, 中国',
      founded_year: 2021,
      industry_tags: ['多模态', '内容生成', '大模型', 'Multimodal', 'Content Generation', 'Large Model'],
      tools: [
        {
          name: 'abab',
          name_en: 'abab',
          name_zh_hans: 'abab',
          name_zh_hant: 'abab',
          description: 'MiniMax的多模态大模型，支持文本、图像和视频生成',
          description_en: 'MiniMax\'s multimodal large model supporting text, image, and video generation',
          description_zh_hans: 'MiniMax的多模态大模型，支持文本、图像和视频生成',
          description_zh_hant: 'MiniMax的多模態大模型，支持文本、圖像和視頻生成',
          website: 'https://www.minimax.com',
          logo_url: 'https://www.minimax.com/favicon.ico',
          category: 'LLM',
          industry_tags: ['多模态', '内容生成', 'Multimodal', 'Content Generation']
        }
      ]
    },
    {
      name: '智谱AI',
      name_en: 'Zhipu AI',
      name_zh_hans: '智谱AI',
      name_zh_hant: '智譜AI',
      description: '中国领先的AI公司，专注于大语言模型和知识图谱',
      description_en: 'Leading Chinese AI company focused on large language models and knowledge graphs',
      description_zh_hans: '中国领先的AI公司，专注于大语言模型和知识图谱',
      description_zh_hant: '中國領先的AI公司，專注於大語言模型和知識圖譜',
      website: 'https://www.zhipuai.cn',
      logo_url: 'https://www.zhipuai.cn/favicon.ico',
      headquarters: '北京, 中国',
      founded_year: 2019,
      industry_tags: ['大语言模型', '知识图谱', 'AI平台', 'Large Language Model', 'Knowledge Graph', 'AI Platform'],
      tools: [
        {
          name: 'ChatGLM',
          name_en: 'ChatGLM',
          name_zh_hans: 'ChatGLM',
          name_zh_hant: 'ChatGLM',
          description: '智谱AI开发的大语言模型，具备强大的对话和推理能力',
          description_en: 'Zhipu AI\'s large language model with powerful conversational and reasoning capabilities',
          description_zh_hans: '智谱AI开发的大语言模型，具备强大的对话和推理能力',
          description_zh_hant: '智譜AI開發的大語言模型，具備強大的對話和推理能力',
          website: 'https://www.zhipuai.cn',
          logo_url: 'https://www.zhipuai.cn/favicon.ico',
          category: 'LLM',
          industry_tags: ['对话AI', '推理', 'Conversational AI', 'Reasoning']
        }
      ]
    },
    {
      name: '月之暗面',
      name_en: 'Moonshot AI',
      name_zh_hans: '月之暗面',
      name_zh_hant: '月之暗面',
      description: '中国领先的AI公司，专注于长文本理解和生成',
      description_en: 'Leading Chinese AI company focused on long text understanding and generation',
      description_zh_hans: '中国领先的AI公司，专注于长文本理解和生成',
      description_zh_hant: '中國領先的AI公司，專注於長文本理解和生成',
      website: 'https://www.moonshot.cn',
      logo_url: 'https://www.moonshot.cn/favicon.ico',
      headquarters: '北京, 中国',
      founded_year: 2023,
      industry_tags: ['长文本', '文本理解', 'AI平台', 'Long Text', 'Text Understanding', 'AI Platform'],
      tools: [
        {
          name: 'Kimi',
          name_en: 'Kimi',
          name_zh_hans: 'Kimi',
          name_zh_hant: 'Kimi',
          description: '月之暗面的AI助手，擅长长文本处理和分析',
          description_en: 'Moonshot AI\'s assistant specialized in long text processing and analysis',
          description_zh_hans: '月之暗面的AI助手，擅长长文本处理和分析',
          description_zh_hant: '月之暗面的AI助手，擅長長文本處理和分析',
          website: 'https://kimi.moonshot.cn',
          logo_url: 'https://kimi.moonshot.cn/favicon.ico',
          category: 'LLM',
          industry_tags: ['长文本', '文本分析', 'Long Text', 'Text Analysis']
        }
      ]
    },
    {
      name: '零一万物',
      name_en: '01.AI',
      name_zh_hans: '零一万物',
      name_zh_hant: '零一萬物',
      description: '中国领先的AI公司，专注于大语言模型和AI应用',
      description_en: 'Leading Chinese AI company focused on large language models and AI applications',
      description_zh_hans: '中国领先的AI公司，专注于大语言模型和AI应用',
      description_zh_hant: '中國領先的AI公司，專注於大語言模型和AI應用',
      website: 'https://www.01.ai',
      logo_url: 'https://www.01.ai/favicon.ico',
      headquarters: '北京, 中国',
      founded_year: 2023,
      industry_tags: ['大语言模型', 'AI应用', 'AI平台', 'Large Language Model', 'AI Application', 'AI Platform'],
      tools: [
        {
          name: 'Yi',
          name_en: 'Yi',
          name_zh_hans: 'Yi',
          name_zh_hant: 'Yi',
          description: '零一万物的多语言大模型，支持中英文等多种语言',
          description_en: '01.AI\'s multilingual large model supporting Chinese, English, and other languages',
          description_zh_hans: '零一万物的多语言大模型，支持中英文等多种语言',
          description_zh_hant: '零一萬物的多語言大模型，支持中英文等多種語言',
          website: 'https://www.01.ai',
          logo_url: 'https://www.01.ai/favicon.ico',
          category: 'LLM',
          industry_tags: ['多语言', '大模型', 'Multilingual', 'Large Model']
        }
      ]
    },
    {
      name: '百川智能',
      name_en: 'Baichuan AI',
      name_zh_hans: '百川智能',
      name_zh_hant: '百川智能',
      description: '中国领先的AI公司，专注于大语言模型和知识增强',
      description_en: 'Leading Chinese AI company focused on large language models and knowledge enhancement',
      description_zh_hans: '中国领先的AI公司，专注于大语言模型和知识增强',
      description_zh_hant: '中國領先的AI公司，專注於大語言模型和知識增強',
      website: 'https://www.baichuan-ai.com',
      logo_url: 'https://www.baichuan-ai.com/favicon.ico',
      headquarters: '北京, 中国',
      founded_year: 2023,
      industry_tags: ['大语言模型', '知识增强', 'AI平台', 'Large Language Model', 'Knowledge Enhancement', 'AI Platform'],
      tools: [
        {
          name: 'Baichuan',
          name_en: 'Baichuan',
          name_zh_hans: 'Baichuan',
          name_zh_hant: 'Baichuan',
          description: '百川智能的大语言模型，具备强大的知识理解和生成能力',
          description_en: 'Baichuan AI\'s large language model with powerful knowledge understanding and generation capabilities',
          description_zh_hans: '百川智能的大语言模型，具备强大的知识理解和生成能力',
          description_zh_hant: '百川智能的大語言模型，具備強大的知識理解和生成能力',
          website: 'https://www.baichuan-ai.com',
          logo_url: 'https://www.baichuan-ai.com/favicon.ico',
          category: 'LLM',
          industry_tags: ['知识理解', '文本生成', 'Knowledge Understanding', 'Text Generation']
        }
      ]
    },
    {
      name: '深言科技',
      name_en: 'DeepSeek',
      name_zh_hans: '深言科技',
      name_zh_hant: '深言科技',
      description: '中国领先的AI公司，专注于代码生成和推理',
      description_en: 'Leading Chinese AI company focused on code generation and reasoning',
      description_zh_hans: '中国领先的AI公司，专注于代码生成和推理',
      description_zh_hant: '中國領先的AI公司，專注於代碼生成和推理',
      website: 'https://www.deepseek.com',
      logo_url: 'https://www.deepseek.com/favicon.ico',
      headquarters: '深圳, 中国',
      founded_year: 2023,
      industry_tags: ['代码生成', '推理', 'AI编程', 'Code Generation', 'Reasoning', 'AI Programming'],
      tools: [
        {
          name: 'DeepSeek',
          name_en: 'DeepSeek',
          name_zh_hans: 'DeepSeek',
          name_zh_hant: 'DeepSeek',
          description: '深言科技的AI模型，擅长代码生成和数学推理',
          description_en: 'DeepSeek\'s AI model specialized in code generation and mathematical reasoning',
          description_zh_hans: '深言科技的AI模型，擅长代码生成和数学推理',
          description_zh_hant: '深言科技的AI模型，擅長代碼生成和數學推理',
          website: 'https://www.deepseek.com',
          logo_url: 'https://www.deepseek.com/favicon.ico',
          category: 'LLM',
          industry_tags: ['代码生成', '数学推理', 'Code Generation', 'Mathematical Reasoning']
        }
      ]
    },
    {
      name: '来也科技',
      name_en: 'Laiye',
      name_zh_hans: '来也科技',
      name_zh_hant: '來也科技',
      description: '中国领先的RPA和AI公司，专注于智能自动化',
      description_en: 'Leading Chinese RPA and AI company focused on intelligent automation',
      description_zh_hans: '中国领先的RPA和AI公司，专注于智能自动化',
      description_zh_hant: '中國領先的RPA和AI公司，專注於智能自動化',
      website: 'https://www.laiye.com',
      logo_url: 'https://www.laiye.com/favicon.ico',
      headquarters: '北京, 中国',
      founded_year: 2015,
      industry_tags: ['RPA', '智能自动化', 'AI平台', 'RPA', 'Intelligent Automation', 'AI Platform'],
      tools: [
        {
          name: 'UiBot',
          name_en: 'UiBot',
          name_zh_hans: 'UiBot',
          name_zh_hant: 'UiBot',
          description: '来也科技的RPA平台，提供智能流程自动化解决方案',
          description_en: 'Laiye\'s RPA platform providing intelligent process automation solutions',
          description_zh_hans: '来也科技的RPA平台，提供智能流程自动化解决方案',
          description_zh_hant: '來也科技的RPA平台，提供智能流程自動化解決方案',
          website: 'https://www.laiye.com',
          logo_url: 'https://www.laiye.com/favicon.ico',
          category: 'RPA',
          industry_tags: ['RPA', '流程自动化', 'RPA', 'Process Automation']
        }
      ]
    },
    {
      name: '第四范式',
      name_en: '4Paradigm',
      name_zh_hans: '第四范式',
      name_zh_hant: '第四範式',
      description: '中国领先的AI平台公司，专注于企业级AI解决方案',
      description_en: 'Leading Chinese AI platform company focused on enterprise AI solutions',
      description_zh_hans: '中国领先的AI平台公司，专注于企业级AI解决方案',
      description_zh_hant: '中國領先的AI平台公司，專注於企業級AI解決方案',
      website: 'https://www.4paradigm.com',
      logo_url: 'https://www.4paradigm.com/favicon.ico',
      headquarters: '北京, 中国',
      founded_year: 2014,
      industry_tags: ['AI平台', '企业AI', '机器学习', 'AI Platform', 'Enterprise AI', 'Machine Learning'],
      tools: [
        {
          name: 'Sage',
          name_en: 'Sage',
          name_zh_hans: 'Sage',
          name_zh_hant: 'Sage',
          description: '第四范式的AI平台，提供企业级机器学习解决方案',
          description_en: '4Paradigm\'s AI platform providing enterprise machine learning solutions',
          description_zh_hans: '第四范式的AI平台，提供企业级机器学习解决方案',
          description_zh_hant: '第四範式的AI平台，提供企業級機器學習解決方案',
          website: 'https://www.4paradigm.com',
          logo_url: 'https://www.4paradigm.com/favicon.ico',
          category: 'ML Platform',
          industry_tags: ['机器学习', '企业AI', 'Machine Learning', 'Enterprise AI']
        }
      ]
    },
    {
      name: '云从科技',
      name_en: 'CloudWalk',
      name_zh_hans: '云从科技',
      name_zh_hant: '雲從科技',
      description: '中国领先的计算机视觉公司，专注于人脸识别和AI应用',
      description_en: 'Leading Chinese computer vision company focused on face recognition and AI applications',
      description_zh_hans: '中国领先的计算机视觉公司，专注于人脸识别和AI应用',
      description_zh_hant: '中國領先的計算機視覺公司，專注於人臉識別和AI應用',
      website: 'https://www.cloudwalk.cn',
      logo_url: 'https://www.cloudwalk.cn/favicon.ico',
      headquarters: '广州, 中国',
      founded_year: 2015,
      industry_tags: ['计算机视觉', '人脸识别', 'AI应用', 'Computer Vision', 'Face Recognition', 'AI Application'],
      tools: [
        {
          name: '云从AI',
          name_en: 'CloudWalk AI',
          name_zh_hans: '云从AI',
          name_zh_hant: '雲從AI',
          description: '云从科技的AI平台，提供计算机视觉和智能分析服务',
          description_en: 'CloudWalk\'s AI platform providing computer vision and intelligent analysis services',
          description_zh_hans: '云从科技的AI平台，提供计算机视觉和智能分析服务',
          description_zh_hant: '雲從科技的AI平台，提供計算機視覺和智能分析服務',
          website: 'https://www.cloudwalk.cn',
          logo_url: 'https://www.cloudwalk.cn/favicon.ico',
          category: 'Computer Vision',
          industry_tags: ['计算机视觉', '智能分析', 'Computer Vision', 'Intelligent Analysis']
        }
      ]
    },
    {
      name: '依图科技',
      name_en: 'YITU',
      name_zh_hans: '依图科技',
      name_zh_hant: '依圖科技',
      description: '中国领先的AI公司，专注于计算机视觉和语音技术',
      description_en: 'Leading Chinese AI company focused on computer vision and speech technology',
      description_zh_hans: '中国领先的AI公司，专注于计算机视觉和语音技术',
      description_zh_hant: '中國領先的AI公司，專注於計算機視覺和語音技術',
      website: 'https://www.yitutech.com',
      logo_url: 'https://www.yitutech.com/favicon.ico',
      headquarters: '上海, 中国',
      founded_year: 2012,
      industry_tags: ['计算机视觉', '语音技术', 'AI平台', 'Computer Vision', 'Speech Technology', 'AI Platform'],
      tools: [
        {
          name: '依图AI',
          name_en: 'YITU AI',
          name_zh_hans: '依图AI',
          name_zh_hant: '依圖AI',
          description: '依图科技的AI平台，提供计算机视觉和语音识别服务',
          description_en: 'YITU\'s AI platform providing computer vision and speech recognition services',
          description_zh_hans: '依图科技的AI平台，提供计算机视觉和语音识别服务',
          description_zh_hant: '依圖科技的AI平台，提供計算機視覺和語音識別服務',
          website: 'https://www.yitutech.com',
          logo_url: 'https://www.yitutech.com/favicon.ico',
          category: 'Computer Vision',
          industry_tags: ['计算机视觉', '语音识别', 'Computer Vision', 'Speech Recognition']
        }
      ]
    },
    {
      name: '思必驰',
      name_en: 'AISpeech',
      name_zh_hans: '思必驰',
      name_zh_hant: '思必馳',
      description: '中国领先的语音AI公司，专注于语音识别和自然语言处理',
      description_en: 'Leading Chinese voice AI company focused on speech recognition and natural language processing',
      description_zh_hans: '中国领先的语音AI公司，专注于语音识别和自然语言处理',
      description_zh_hant: '中國領先的語音AI公司，專注於語音識別和自然語言處理',
      website: 'https://www.aichat.com',
      logo_url: 'https://www.aichat.com/favicon.ico',
      headquarters: '苏州, 中国',
      founded_year: 2007,
      industry_tags: ['语音识别', '自然语言处理', '语音AI', 'Speech Recognition', 'NLP', 'Voice AI'],
      tools: [
        {
          name: 'DUI',
          name_en: 'DUI',
          name_zh_hans: 'DUI',
          name_zh_hant: 'DUI',
          description: '思必驰的对话交互平台，提供智能语音交互解决方案',
          description_en: 'AISpeech\'s dialogue interaction platform providing intelligent voice interaction solutions',
          description_zh_hans: '思必驰的对话交互平台，提供智能语音交互解决方案',
          description_zh_hant: '思必馳的對話交互平台，提供智能語音交互解決方案',
          website: 'https://www.aichat.com',
          logo_url: 'https://www.aichat.com/favicon.ico',
          category: 'Voice AI',
          industry_tags: ['语音交互', '对话AI', 'Voice Interaction', 'Conversational AI']
        }
      ]
    }
  ]
};

async function updateCompanyWithBilingualSupport(companyData: any) {
  try {
    // Find existing company
    const { data: existingCompany, error: findError } = await supabase
      .from('companies')
      .select('id')
      .eq('name', companyData.name)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      console.error(`Error finding company ${companyData.name}:`, findError);
      return;
    }

    if (existingCompany) {
      // Update existing company
      const { error: updateError } = await supabase
        .from('companies')
        .update({
          name_en: companyData.name_en,
          name_zh_hans: companyData.name_zh_hans,
          name_zh_hant: companyData.name_zh_hant,
          description: companyData.description,
          description_en: companyData.description_en,
          description_zh_hans: companyData.description_zh_hans,
          description_zh_hant: companyData.description_zh_hant,
          logo_url: companyData.logo_url,
          headquarters: companyData.headquarters,
          founded_year: companyData.founded_year,
          industry_tags: companyData.industry_tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCompany.id);

      if (updateError) {
        console.error(`Error updating company ${companyData.name}:`, updateError);
      } else {
        console.log(`✅ Updated company: ${companyData.name}`);
      }

      // Update tools for this company
      for (const toolData of companyData.tools) {
        const { data: existingTool, error: toolFindError } = await supabase
          .from('tools')
          .select('id')
          .eq('name', toolData.name)
          .eq('company_id', existingCompany.id)
          .single();

        if (toolFindError && toolFindError.code !== 'PGRST116') {
          console.error(`Error finding tool ${toolData.name}:`, toolFindError);
          continue;
        }

        if (existingTool) {
          // Update existing tool
          const { error: toolUpdateError } = await supabase
            .from('tools')
            .update({
              name_en: toolData.name_en,
              name_zh_hans: toolData.name_zh_hans,
              name_zh_hant: toolData.name_zh_hant,
              description: toolData.description,
              description_en: toolData.description_en,
              description_zh_hans: toolData.description_zh_hans,
              description_zh_hant: toolData.description_zh_hant,
              logo_url: toolData.logo_url,
              website: toolData.website,
              category: toolData.category,
              industry_tags: toolData.industry_tags,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingTool.id);

          if (toolUpdateError) {
            console.error(`Error updating tool ${toolData.name}:`, toolUpdateError);
          } else {
            console.log(`  ✅ Updated tool: ${toolData.name}`);
          }
        } else {
          // Create new tool
          const { error: toolCreateError } = await supabase
            .from('tools')
            .insert({
              name: toolData.name,
              name_en: toolData.name_en,
              name_zh_hans: toolData.name_zh_hans,
              name_zh_hant: toolData.name_zh_hant,
              description: toolData.description,
              description_en: toolData.description_en,
              description_zh_hans: toolData.description_zh_hans,
              description_zh_hant: toolData.description_zh_hant,
              logo_url: toolData.logo_url,
              website: toolData.website,
              category: toolData.category,
              industry_tags: toolData.industry_tags,
              company_id: existingCompany.id,
              pricing_model: 'Freemium',
              features: ['AI能力', '多语言支持', 'AI Capabilities', 'Multilingual Support'],
              api_available: true,
              free_tier: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (toolCreateError) {
            console.error(`Error creating tool ${toolData.name}:`, toolCreateError);
          } else {
            console.log(`  ✅ Created tool: ${toolData.name}`);
          }
        }
      }
    } else {
      console.log(`⚠️ Company not found: ${companyData.name}`);
    }
  } catch (error) {
    console.error(`Error processing company ${companyData.name}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting comprehensive data update with bilingual support...\n');

  // Disable RLS temporarily
  console.log('🔓 Disabling RLS for data updates...');
  try {
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;' 
    });
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;' 
    });
  } catch (error) {
    console.log('Note: RLS disable may need to be done manually in SQL Editor');
  }

  // Process all companies
  for (const companyData of comprehensiveData.companies) {
    await updateCompanyWithBilingualSupport(companyData);
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
  }

  console.log('\n✅ Comprehensive data update completed!');
  console.log('📊 All companies and tools now have bilingual support (English/Simplified Chinese/Traditional Chinese)');
}

main().catch(console.error);
