-- BILINGUAL COMPANY DATA - BATCH 2 (Companies 41-80)
-- This SQL file contains bilingual descriptions for companies 41-80

BEGIN;

-- 41. Baidu AI (百度AI)
UPDATE companies SET
  description = '百度AI是百度的AI部门，开发了文心一言大模型、Apollo自动驾驶平台。',
  detailed_description = '百度AI成立于2015年，是中国领先的人工智能公司。总部位于北京，员工3000-5000人。百度AI在自然语言处理、计算机视觉、自动驾驶等领域投入了巨资。公司开发的文心一言是中文大语言模型，在中文理解和生成方面表现出色。Apollo自动驾驶平台是中国最先进的自动驾驶技术之一，与多家汽车制造商建立了合作关系。百度智能云提供AI即服务，包括语音识别、图像识别、知识图谱等能力。百度AI还在百度搜索引擎中集成了AI技术，提供更智能的搜索体验。2023年，文心一言成为国内最受欢迎的大语言模型之一。百度AI在教育、医疗、金融等领域也有广泛应用。',
  headquarters = '北京, 中国',
  website = 'https://ai.baidu.com',
  founded_year = 2015,
  employee_count = '3000-5000人'
WHERE name = 'Baidu AI' OR name LIKE '%百度%' OR name LIKE '%Baidu%';

-- 42. Alibaba Cloud AI (阿里巴巴云AI)
UPDATE companies SET
  description = '阿里巴巴云AI提供通义千问大模型、阿里云AI平台和企业级AI解决方案。',
  detailed_description = '阿里巴巴云AI是阿里巴巴集团的核心技术部门，总部位于杭州，员工5000-10000人。公司开发的通义千问是阿里云的大语言模型，在中文和英文理解方面都表现优秀。阿里云AI平台提供企业级AI服务，包括机器学习平台PAI、视觉识别、语音识别和自然语言处理能力。通义千问已广泛应用于阿里巴巴生态，包括淘宝、天猫、钉钉等产品。2023年，阿里巴巴发布了通义千问2.0版本，模型能力显著提升。公司还在量子计算、芯片设计等领域投入，开发了倚天710等AI芯片。阿里云已成为全球第三大云服务提供商。',
  headquarters = '杭州, 中国',
  website = 'https://www.alibaba.com/ai',
  founded_year = 2015,
  employee_count = '5000-10000人'
WHERE name = 'Alibaba Cloud AI' OR name LIKE '%阿里巴巴%' OR name LIKE '%Alibaba%';

-- 43. Tencent Cloud AI (腾讯云AI)
UPDATE companies SET
  description = '腾讯云AI开发了混元大模型、腾讯云AI平台和集成到微信、QQ的AI服务。',
  detailed_description = '腾讯云AI是腾讯的核心技术团队，总部位于深圳，员工5000-10000人。公司开发的混元大语言模型已广泛应用于腾讯生态。腾讯AI能力深度集成到微信、QQ、游戏、社交等产品中，提供智能对话、内容推荐、语音识别等服务。腾讯云AI平台提供企业级机器学习服务，支持模型训练、部署和推理。腾讯的游戏AI技术处于行业领先地位，运用于《王者荣耀》、《和平精英》等游戏。2023年，腾讯发布了混元2.0版本，在对话、创作、代码生成等能力上大幅提升。',
  headquarters = '深圳, 中国',
  website = 'https://cloud.tencent.com/product/tiia',
  founded_year = 2015,
  employee_count = '5000-10000人'
WHERE name = 'Tencent Cloud AI' OR name LIKE '%腾讯%' OR name LIKE '%Tencent%';

-- 44. ByteDance AI (字节跳动AI)
UPDATE companies SET
  description = '字节跳动AI开发了豆包大模型、火山引擎AI平台和驱动抖音的推荐系统。',
  detailed_description = '字节跳动AI成立于2018年，是字节跳动的核心技术部门。总部位于北京，员工3000-5000人。公司开发的豆包大语言模型已集成到抖音、今日头条、Pico等产品中，提供个性化推荐、内容创作、智能问答等服务。火山引擎AI平台提供推荐算法、计算机视觉、自然语言处理等AI能力，服务外部客户。字节跳动的推荐算法在短视频和信息流领域处于领先地位，日活跃用户数亿。公司还开发了Trae AI创作工具，支持代码生成和文档编辑。',
  headquarters = '北京, 中国',
  website = 'https://www.volcengine.com/ai',
  founded_year = 2018,
  employee_count = '3000-5000人'
WHERE name = 'ByteDance AI' OR name LIKE '%字节%' OR name LIKE '%ByteDance%';

-- 45. iFlytek (科大讯飞)
UPDATE companies SET
  description = '科大讯飞专注于语音识别和智能教育，开发了星火认知大模型。',
  detailed_description = '科大讯飞成立于1999年，是中国领先的智能语音与人工智能公司。总部位于合肥，员工2000-5000人。公司开发的星火认知大模型在中文语音识别和理解方面处于世界领先水平。科大讯飞的技术广泛应用于智能教育、医疗、司法、汽车等领域。公司的讯飞输入法是中国最受欢迎的智能输入法之一。在教育领域，科大讯飞开发了智能阅卷、个性化学习推荐、口语评测等产品。在医疗领域，公司开发了AI辅助诊断系统，已在全国数千家医院部署。2023年，星火认知大模型发布，在中文理解、数学推理、代码生成等能力上取得突破。',
  headquarters = '合肥, 中国',
  website = 'https://www.iflytek.com',
  founded_year = 1999,
  employee_count = '2000-5000人'
WHERE name = 'iFlytek' OR name LIKE '%科大讯飞%' OR name LIKE '%iFlytek%';

-- 46. Stability AI
UPDATE companies SET
  description = 'Stability AI开发开源AI模型，包括Stable Diffusion图像生成模型。',
  detailed_description = 'Stability AI成立于2020年，开发开源AI模型。总部位于英国伦敦，员工100-300人。公司开发了Stable Diffusion图像生成模型，该模型是开源的，任何人都可以下载和使用。Stability AI还开发了Stable Video和AudioCraft等模型，支持视频和音频生成。2023年，Stable Diffusion成为最受欢迎的开源图像生成模型之一，被集成到多个图像生成应用中。公司的开源策略赢得了开发者社区的广泛支持。Stability AI还提供了训练和部署AI模型的工具和服务。',
  headquarters = 'London, UK',
  website = 'https://stability.ai',
  founded_year = 2020,
  employee_count = '100-300人'
WHERE name = 'Stability AI' OR name LIKE '%Stability%';

-- 47. Hugging Face
UPDATE companies SET
  description = 'Hugging Face是AI模型托管平台，提供Transformers库和模型中心。',
  detailed_description = 'Hugging Face成立于2016年，是AI模型托管平台。总部位于纽约，员工200-500人。公司提供Transformers库、模型中心和协作工具，支持开源AI生态。Hugging Face托管了数万个AI模型，从大语言模型到专门的领域模型。平台的模型中心已成为开发者共享和使用AI模型的重要场所。公司还开发了Inference API，让开发者可以轻松使用托管模型。2023年，Hugging Face获得了多次融资，估值达到数十亿美元。公司与多个研究机构合作，推动开源AI发展。',
  headquarters = 'New York, New York, USA',
  website = 'https://huggingface.co',
  founded_year = 2016,
  employee_count = '200-500人'
WHERE name = 'Hugging Face' OR name LIKE '%Hugging Face%';

-- 48. Midjourney
UPDATE companies SET
  description = 'Midjourney开发AI图像生成服务，专注于艺术性和美学。',
  detailed_description = 'Midjourney成立于2022年，开发AI图像生成服务。总部位于旧金山，员工50-100人。公司通过Discord提供艺术创作工具，支持文本转图像生成。Midjourney专注于艺术性和美学，其生成的图像在艺术性和细节方面表现出色。2023年，Midjourney成为最受欢迎的AI图像生成服务之一，吸引了数百万艺术家和创意工作者。公司通过Discord社区与用户互动，持续改进模型质量。Midjourney的订阅模式为不同需求的用户提供了灵活的定价选择。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.midjourney.com',
  founded_year = 2022,
  employee_count = '50-100人'
WHERE name = 'Midjourney' OR name LIKE '%Midjourney%';

-- 49. Runway
UPDATE companies SET
  description = 'Runway提供AI视频创作工具，开发了Gen-2视频生成模型。',
  detailed_description = 'Runway成立于2018年，提供AI视频创作工具。总部位于纽约，员工100-300人。公司开发了Gen-2视频生成模型，支持文本和图像转视频。Runway还提供图像编辑、背景移除、风格转换等创意工具，支持电影级视频制作。2023年，Gen-2成为最先进的视频生成模型之一，被电影制片人、艺术家和创意工作者广泛使用。公司还开发了移动应用，让用户可以在手机上使用AI创作工具。',
  headquarters = 'New York, New York, USA',
  website = 'https://runwayml.com',
  founded_year = 2018,
  employee_count = '100-300人'
WHERE name = 'Runway' OR name LIKE '%Runway%';

-- 50. Perplexity AI
UPDATE companies SET
  description = 'Perplexity AI是AI搜索助手，结合实时网络搜索和GPT模型。',
  detailed_description = 'Perplexity AI成立于2022年，是AI搜索助手。总部位于旧金山，员工50-150人。公司结合实时网络搜索和GPT模型，提供准确、有来源的回答。Perplexity的搜索功能让用户可以获取最新、最准确的信息。2023年，Perplexity获得了多次融资，用户数快速增长。公司与多个LLM提供商合作，为用户提供高质量的搜索体验。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.perplexity.ai',
  founded_year = 2022,
  employee_count = '50-150人'
WHERE name = 'Perplexity AI' OR name LIKE '%Perplexity%';

COMMIT;
