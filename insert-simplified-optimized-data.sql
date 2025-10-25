-- 简化版AIverse数据插入脚本
-- 只使用现有字段：companies(name, description), projects(company_id, name, description, category, website)
-- 在Supabase SQL Editor中执行

-- 1. 插入所有公司数据
INSERT INTO companies (name, description) VALUES
('OpenAI', 'OpenAI是一家领先的人工智能研究公司，专注于开发安全、有益的通用人工智能。公司成立于2015年，总部位于美国旧金山，以开发GPT系列大语言模型和ChatGPT而闻名全球。'),
('Anthropic', 'Anthropic是一家专注于AI安全的公司，致力于开发有益、无害、诚实的AI系统。公司由OpenAI前研究副总裁创立，以开发Claude AI助手而闻名。'),
('Google', 'Google是Alphabet旗下的科技巨头，在人工智能领域投入巨大，开发了Gemini、Bard等AI产品，并在搜索、云计算、自动驾驶等领域广泛应用AI技术。'),
('Microsoft', 'Microsoft是全球领先的科技公司，在AI领域投入巨大，开发了Copilot系列产品，并与OpenAI建立了战略合作关系，将AI技术深度集成到Office、Azure等产品中。'),
('DeepSeek', 'DeepSeek是中国领先的AI公司，专注于大语言模型和代码生成技术，开发了DeepSeek-Coder等产品，在代码生成和AI推理方面表现优异。'),
('Midjourney', 'Midjourney是一家专注于AI图像生成的创新公司，开发了同名AI艺术创作平台，以其独特的艺术风格和高质量的图像生成能力而闻名。'),
('Stability AI', 'Stability AI是一家开源AI公司，开发了Stable Diffusion等开源图像生成模型，致力于让AI技术更加开放和可访问。'),
('Hugging Face', 'Hugging Face是领先的AI模型平台和社区，为开发者提供机器学习模型的分享、训练和部署服务，是开源AI生态的重要推动者。'),
('Runway', 'Runway是一家专注于AI视频生成和编辑的创新公司，开发了Gen-3等先进的视频生成模型，为内容创作者提供强大的AI工具。'),
('ElevenLabs', 'ElevenLabs是一家专注于AI语音生成和克隆技术的公司，提供逼真的语音合成服务，广泛应用于内容创作和多媒体制作。');

-- 2. 插入所有项目数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN ('OpenAI', 'Anthropic', 'Google', 'Microsoft', 'DeepSeek', 'Midjourney', 'Stability AI', 'Hugging Face', 'Runway', 'ElevenLabs')
)
INSERT INTO projects (company_id, name, description, category, website)
SELECT 
  ci.id,
  p.name,
  p.description,
  p.category,
  p.website
FROM company_ids ci
CROSS JOIN LATERAL (
  VALUES
    ('OpenAI', 'ChatGPT', 'Advanced conversational AI assistant powered by GPT-4, capable of natural language understanding, code generation, creative writing, and complex reasoning tasks.', 'Artificial Intelligence', 'https://chatgpt.com'),
    ('OpenAI', 'GPT-4', 'Large multimodal language model capable of processing text and images, with advanced reasoning capabilities and improved accuracy.', 'Artificial Intelligence', 'https://openai.com/gpt-4'),
    ('OpenAI', 'DALL-E 3', 'Advanced AI image generation model that creates high-quality images from text descriptions with improved accuracy and creativity.', 'Design', 'https://openai.com/dall-e-3'),
    ('Anthropic', 'Claude', 'Advanced AI assistant designed with constitutional AI principles, featuring enhanced safety, helpfulness, and honesty in conversations and tasks.', 'Artificial Intelligence', 'https://claude.ai'),
    ('Google', 'Gemini', 'Google''s most advanced AI model with multimodal capabilities, supporting text, image, audio, and video processing with enhanced reasoning and creativity.', 'Artificial Intelligence', 'https://gemini.google.com'),
    ('Google', 'Google AI Studio', 'Development platform for building and prototyping with Google''s AI models, offering easy integration and testing capabilities.', 'Developer Tools', 'https://aistudio.google.com'),
    ('Microsoft', 'Microsoft Copilot', 'AI-powered productivity assistant integrated across Microsoft 365 suite, providing intelligent assistance for writing, analysis, and automation tasks.', 'Productivity', 'https://copilot.microsoft.com'),
    ('Microsoft', 'Azure AI', 'Comprehensive AI platform on Microsoft Azure cloud, offering machine learning, cognitive services, and AI infrastructure for enterprises.', 'Developer Tools', 'https://azure.microsoft.com/ai'),
    ('DeepSeek', 'DeepSeek-Coder', 'Advanced AI coding assistant specialized in code generation, debugging, and software development with support for multiple programming languages.', 'Developer Tools', 'https://deepseek.com/coder'),
    ('Midjourney', 'Midjourney', 'Leading AI image generation platform with painterly aesthetic, advanced prompt engineering, and community-driven improvements for creative professionals.', 'Design', 'https://www.midjourney.com'),
    ('Stability AI', 'Stable Diffusion', 'Open-source AI image generation model with community-driven improvements, ControlNet support, and unlimited customizations for developers and artists.', 'Design', 'https://stability.ai/stable-diffusion'),
    ('Hugging Face', 'Hugging Face Hub', 'Leading AI model platform and community for sharing, training, and deploying machine learning models and datasets with comprehensive tools and resources.', 'Developer Tools', 'https://huggingface.co'),
    ('Runway', 'Runway Gen-3', 'Advanced AI video generation and editing platform with Gen-3 model for cinematic video creation and motion graphics with professional-grade quality.', 'Video', 'https://runwayml.com'),
    ('ElevenLabs', 'ElevenLabs Voice AI', 'Leading AI voice generation and cloning platform with realistic speech synthesis and emotion control for content creators and multimedia professionals.', 'Content Creation', 'https://elevenlabs.io')
) AS p(company_name, name, description, category, website)
WHERE ci.name = p.company_name;

-- 完成
SELECT '简化版AIverse数据插入完成！' as status;