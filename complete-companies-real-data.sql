-- =========================================
-- 补齐公司数据的 SQL 脚本
-- 使用真实数据填充
-- =========================================

BEGIN;

-- 1. Adobe
UPDATE companies 
SET 
  website = 'https://www.adobe.com',
  description = 'Adobe是全球领先的数字媒体和营销解决方案提供商，提供创意软件、数字体验软件和企业解决方案。',
  headquarters = 'San Jose, USA',
  founded_year = 1982,
  employee_count = '25000+人'
WHERE name = 'Adobe';

-- 2. Vercel
UPDATE companies 
SET 
  website = 'https://vercel.com',
  description = 'Vercel是前端云平台提供商，提供构建和部署现代Web应用的工具和服务，支持Next.js框架。',
  headquarters = 'San Francisco, USA',
  founded_year = 2015,
  employee_count = '300-500人'
WHERE name = 'Vercel';

-- 3. Anthropic
UPDATE companies 
SET 
  website = 'https://www.anthropic.com',
  description = 'Anthropic是专注于AI安全的公司，开发了Claude AI助手，致力于构建可控、可解释的AI系统。',
  headquarters = 'San Francisco, USA',
  founded_year = 2021,
  employee_count = '200-500人'
WHERE name = 'Anthropic';

-- 4. OpenAI
UPDATE companies 
SET 
  website = 'https://www.openai.com',
  description = 'OpenAI是一家AI研究公司，开发了GPT系列大语言模型、DALL-E图像生成模型和Sora视频生成模型。',
  headquarters = 'San Francisco, USA',
  founded_year = 2015,
  employee_count = '500-1000人'
WHERE name = 'OpenAI';

-- 5. Google DeepMind
UPDATE companies 
SET 
  website = 'https://deepmind.google',
  description = 'Google DeepMind是谷歌的AI研究实验室，专注于通用人工智能和深度学习，开发了AlphaGo、Gemini等系统。',
  headquarters = 'London, UK',
  founded_year = 2010,
  employee_count = '1000-2000人'
WHERE name = 'Google DeepMind';

-- 6. Microsoft AI
UPDATE companies 
SET 
  website = 'https://www.microsoft.com/ai',
  description = 'Microsoft AI提供企业级AI解决方案，包括Azure AI平台、Copilot智能助手和GPT集成服务。',
  headquarters = 'Redmond, USA',
  founded_year = 1975,
  employee_count = '10万+人'
WHERE name = 'Microsoft AI';

-- 7. Meta AI
UPDATE companies 
SET 
  website = 'https://ai.meta.com',
  description = 'Meta AI是Meta的AI研究团队，开发了Llama开源大语言模型、Reels AI推荐系统和虚拟助手。',
  headquarters = 'Menlo Park, USA',
  founded_year = 2021,
  employee_count = '5000-10000人'
WHERE name = 'Meta AI';

-- 8. Amazon AI
UPDATE companies 
SET 
  website = 'https://aws.amazon.com/machine-learning',
  description = 'Amazon AI提供AWS机器学习服务，包括SageMaker平台、Alexa语音助手和计算机视觉服务。',
  headquarters = 'Seattle, USA',
  founded_year = 2006,
  employee_count = '5000-10000人'
WHERE name = 'Amazon AI';

-- 9. Tesla AI
UPDATE companies 
SET 
  website = 'https://www.tesla.com/AI',
  description = 'Tesla AI专注于自动驾驶和机器人技术，开发了Autopilot系统、Dojo训练芯片和Tesla Bot人形机器人。',
  headquarters = 'Austin, USA',
  founded_year = 2003,
  employee_count = '10000+人'
WHERE name = 'Tesla AI';

-- 10. NVIDIA
UPDATE companies 
SET 
  website = 'https://www.nvidia.com/ai',
  description = 'NVIDIA是全球AI计算领域的领导者，提供GPU加速计算、CUDA平台和推理云服务。',
  headquarters = 'Santa Clara, USA',
  founded_year = 1993,
  employee_count = '25000+人'
WHERE name = 'NVIDIA';

-- 11. IBM Watson
UPDATE companies 
SET 
  website = 'https://www.ibm.com/watson',
  description = 'IBM Watson提供企业AI解决方案，包括Watson助手、Watson Studio数据科学平台和行业特定AI应用。',
  headquarters = 'Armonk, USA',
  founded_year = 1911,
  employee_count = '10万+人'
WHERE name = 'IBM Watson';

-- 12. Stability AI
UPDATE companies 
SET 
  website = 'https://stability.ai',
  description = 'Stability AI开发开源AI模型，包括Stable Diffusion图像生成、Stable Video和AudioCraft音乐生成工具。',
  headquarters = 'London, UK',
  founded_year = 2020,
  employee_count = '100-300人'
WHERE name = 'Stability AI';

-- 13. Hugging Face
UPDATE companies 
SET 
  website = 'https://huggingface.co',
  description = 'Hugging Face是AI模型托管平台，提供Transformers库、模型中心和协作工具，支持开源AI生态。',
  headquarters = 'New York, USA',
  founded_year = 2016,
  employee_count = '200-500人'
WHERE name = 'Hugging Face';

-- 14. Midjourney
UPDATE companies 
SET 
  website = 'https://www.midjourney.com',
  description = 'Midjourney开发高质量AI图像生成服务，通过Discord提供艺术创作工具，支持文本转图像生成。',
  headquarters = 'San Francisco, USA',
  founded_year = 2022,
  employee_count = '50-100人'
WHERE name = 'Midjourney';

-- 15. Runway
UPDATE companies 
SET 
  website = 'https://runwayml.com',
  description = 'Runway提供AI视频创作工具，包括Gen-2视频生成、图像编辑和创意工具，支持电影级视频制作。',
  headquarters = 'New York, USA',
  founded_year = 2018,
  employee_count = '100-300人'
WHERE name = 'Runway';

-- 16. Perplexity AI
UPDATE companies 
SET 
  website = 'https://www.perplexity.ai',
  description = 'Perplexity AI是AI搜索助手，结合实时网络搜索和GPT模型，提供准确、有来源的回答。',
  headquarters = 'San Francisco, USA',
  founded_year = 2022,
  employee_count = '50-150人'
WHERE name = 'Perplexity AI';

-- 17. Character.AI
UPDATE companies 
SET 
  website = 'https://character.ai',
  description = 'Character.AI提供个性化AI角色对话服务，用户可以创建和交互虚拟角色，支持多模态对话。',
  headquarters = 'Menlo Park, USA',
  founded_year = 2021,
  employee_count = '100-300人'
WHERE name = 'Character.AI';

-- 18. Jasper
UPDATE companies 
SET 
  website = 'https://www.jasper.ai',
  description = 'Jasper是AI内容创作平台，为企业提供文案生成、内容优化和品牌文案助手服务。',
  headquarters = 'Austin, USA',
  founded_year = 2021,
  employee_count = '200-500人'
WHERE name = 'Jasper';

-- 19. Copy.ai
UPDATE companies 
SET 
  website = 'https://www.copy.ai',
  description = 'Copy.ai是AI文案创作工具，帮助营销团队快速生成广告文案、邮件、社交媒体内容。',
  headquarters = 'San Francisco, USA',
  founded_year = 2020,
  employee_count = '50-200人'
WHERE name = 'Copy.ai';

-- 20. Notion AI
UPDATE companies 
SET 
  website = 'https://www.notion.so/product/ai',
  description = 'Notion AI是集成在Notion中的AI助手，提供智能写作、翻译、摘要和创意生成功能。',
  headquarters = 'San Francisco, USA',
  founded_year = 2016,
  employee_count = '500-1000人'
WHERE name = 'Notion AI';

COMMIT;

-- 检查更新结果
SELECT name, website, description, headquarters, founded_year, employee_count
FROM companies
WHERE name IN ('Adobe', 'Vercel', 'Anthropic', 'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Amazon AI', 'Tesla AI', 'NVIDIA', 'IBM Watson', 'Stability AI', 'Hugging Face', 'Midjourney', 'Runway', 'Perplexity AI', 'Character.AI', 'Jasper', 'Copy.ai', 'Notion AI')
ORDER BY name;
