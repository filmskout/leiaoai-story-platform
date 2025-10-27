-- 为公司添加详细描述字段
-- 分离简短描述（用于列表页）和详细描述（用于详情页）

BEGIN;

-- 1. 检查当前description字段
SELECT '=== 当前描述长度 ===' as info,
  name,
  LENGTH(description) as desc_length,
  LEFT(description, 50) || '...' as sample
FROM companies
WHERE name IN ('Adobe', 'Vercel', 'Anthropic', 'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Amazon AI', 'Tesla AI', 'NVIDIA')
ORDER BY name;

-- 2. 更新重点公司的详细描述（示例数据）
-- Adobe
UPDATE companies 
SET description = 'Adobe是全球领先的数字媒体和营销解决方案提供商，提供创意软件、数字体验软件和企业解决方案。',
    detailed_description = 'Adobe成立于1982年，是全球数字媒体和营销解决方案领域的领导者。公司总部位于美国加州圣何塞，员工超过25000人。Adobe提供包括Photoshop、Illustrator、InDesign等创意软件，以及Adobe Express、Adobe Firefly等AI工具。这些工具广泛应用于广告、设计、出版、网络开发等领域。Adobe还提供企业级的数字体验管理平台，帮助品牌创建、管理和优化数字客户体验。公司在纳斯达克上市，市值超过2000亿美元。2023年，Adobe推出了Firefly生成式AI模型，进一步巩固了其在创意技术领域的领导地位。'
WHERE name = 'Adobe';

-- Vercel
UPDATE companies 
SET description = 'Vercel是前端云平台提供商，提供构建和部署现代Web应用的工具和服务，支持Next.js框架。',
    detailed_description = 'Vercel成立于2015年，是专注于前端开发的云平台公司。总部位于美国旧金山，员工300-500人。公司提供无缝的开发者体验，支持一键部署Web应用，自动优化性能，并提供全球CDN加速。Vercel是Next.js框架的创建者和维护者，该框架已成为React生态中最受欢迎的全栈框架。公司还提供实时协作、预览功能、边缘计算等服务。Vercel的客户包括Netflix、GitHub、Adobe等知名公司。2021年，Vercel完成了D轮融资，估值达到15亿美元。'
WHERE name = 'Vercel';

-- Anthropic
UPDATE companies 
SET description = 'Anthropic是专注于AI安全的公司，开发了Claude AI助手，致力于构建可控、可解释的AI系统。',
    detailed_description = 'Anthropic成立于2021年，是一家专注于AI安全和可控性的研究公司。总部位于美国旧金山，员工200-500人。公司由OpenAI的前成员创立，目标是开发安全、有用、诚实的AI系统。Anthropic开发了Claude系列大语言模型，包括Claude 3 Opus、Sonnet和Haiku，这些模型在对话、编程、分析等任务上表现出色。公司特别强调模型的安全性，采用Constitutional AI训练方法，确保AI的行为符合人类价值观。2023年，Anthropic获得了亚马逊和谷歌等公司的巨额投资，估值达到50亿美元。公司还开发了Claude Code，专门针对编程任务进行了优化。'
WHERE name = 'Anthropic';

-- OpenAI
UPDATE companies 
SET description = 'OpenAI是一家AI研究公司，开发了GPT系列大语言模型、DALL-E图像生成模型和Sora视频生成模型。',
    detailed_description = 'OpenAI成立于2015年，是全球领先的AI研究实验室。总部位于美国旧金山，员工500-1000人。公司最初以非营利组织的身份成立，旨在确保AI造福全人类。OpenAI开发了GPT系列大语言模型，包括GPT-3和GPT-4，这些模型在自然语言理解、代码生成、多模态推理等方面达到了前所未有的水平。公司还推出了DALL-E图像生成模型、Sora视频生成模型、Codex代码助手等产品。ChatGPT是OpenAI最著名的应用，在2023年成为历史上增长最快的消费者应用之一。2023年，微软宣布投资OpenAI，双方建立了深度合作关系。OpenAI也因在AI安全领域的开创性研究而备受关注。'
WHERE name = 'OpenAI';

-- Google DeepMind
UPDATE companies 
SET description = 'Google DeepMind是谷歌的AI研究实验室，专注于通用人工智能和深度学习，开发了AlphaGo、Gemini等系统。',
    detailed_description = 'DeepMind成立于2010年，2014年被Google收购成为Google DeepMind，是全球领先的AI研究实验室。总部位于英国伦敦，员工1000-2000人。公司专注于开发通用人工智能（AGI），通过深度学习和强化学习等技术路径探索机器智能。DeepMind开发了AlphaGo，这是第一个击败人类围棋世界冠军的AI系统。公司还开发了AlphaFold，该模型在蛋白质结构预测方面取得了突破性进展，对生物学研究产生了重大影响。2023年，DeepMind与Google Brain合并，集中资源开发Gemini多模态大模型。Gemini能够处理文本、图像、音频和视频等多种输入，代表了大模型技术的最新进展。'
WHERE name = 'Google DeepMind';

-- 显示更新结果
SELECT '=== 更新后的描述 ===' as info,
  name,
  LENGTH(description) as brief_length,
  LENGTH(detailed_description) as detailed_length
FROM companies
WHERE name IN ('Adobe', 'Vercel', 'Anthropic', 'OpenAI', 'Google DeepMind')
ORDER BY name;

COMMIT;
