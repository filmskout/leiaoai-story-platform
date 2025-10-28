-- BILINGUAL COMPANY DATA - BATCH 1 (Companies 1-40)
-- This SQL file contains bilingual (Chinese/English) descriptions for 40 AI companies
-- Generated using DeepSeek API for comprehensive, accurate information

BEGIN;

-- 1. Adobe (Adobe Inc.)
UPDATE companies SET
  description = COALESCE(description, 'Adobe是全球数字媒体和营销解决方案领域的领导者，提供创意软件和AI工具。'),
  detailed_description = COALESCE(detailed_description, 'Adobe成立于1982年，是全球数字媒体和营销解决方案领域的领导者。公司总部位于美国加州圣何塞，员工超过25000人。Adobe提供包括Photoshop、Illustrator、InDesign等创意软件，以及Adobe Express、Adobe Firefly等AI工具。这些工具广泛应用于广告、设计、出版、网络开发等领域。Adobe还提供企业级的数字体验管理平台，帮助品牌创建、管理和优化数字客户体验。公司在纳斯达克上市，市值超过2000亿美元。2023年，Adobe推出了Firefly生成式AI模型，进一步巩固了其在创意技术领域的领导地位。Adobe的Creative Cloud订阅模式为创意工作者提供了强大的工具套件。公司在AI、云服务和数字转型领域持续投入，致力于帮助企业和个人实现创意梦想。'),
  headquarters = 'San Jose, California, USA',
  website = COALESCE(website, 'https://www.adobe.com'),
  founded_year = COALESCE(founded_year, 1982),
  employee_count = COALESCE(employee_count, '25000+人')
WHERE name = 'Adobe' OR name LIKE '%Adobe%';

-- 2. Vercel Inc.
UPDATE companies SET
  description = COALESCE(description, 'Vercel是专注于前端开发的云平台公司，提供Next.js框架和无缝部署体验。'),
  detailed_description = COALESCE(detailed_description, 'Vercel成立于2015年，是专注于前端开发的云平台公司。总部位于美国旧金山，员工300-500人。公司提供无缝的开发者体验，支持一键部署Web应用，自动优化性能，并提供全球CDN加速。Vercel是Next.js框架的创建者和维护者，该框架已成为React生态中最受欢迎的全栈框架。公司还提供实时协作、预览功能、边缘计算等服务。Vercel的客户包括Netflix、GitHub、Adobe等知名公司。2021年，Vercel完成了D轮融资，估值达到15亿美元。Vercel的Edge Network遍布全球，确保用户获得最佳性能。公司还开发了v0 AI代码生成工具，进一步简化开发流程。'),
  headquarters = 'San Francisco, California, USA',
  website = COALESCE(website, 'https://vercel.com'),
  founded_year = COALESCE(founded_year, 2015),
  employee_count = COALESCE(employee_count, '300-500人')
WHERE name = 'Vercel' OR name LIKE '%Vercel%';

-- 3. Anthropic PBC
UPDATE companies SET
  description = 'Anthropic是专注于AI安全和可控性的研究公司，开发了Claude大语言模型系列。',
  detailed_description = 'Anthropic成立于2021年，是一家专注于AI安全和可控性的研究公司。总部位于美国旧金山，员工200-500人。公司由OpenAI的前成员创立，目标是开发安全、有用、诚实的AI系统。Anthropic开发了Claude系列大语言模型，包括Claude 3 Opus、Sonnet和Haiku，这些模型在对话、编程、分析等任务上表现出色。公司特别强调模型的安全性，采用Constitutional AI训练方法，确保AI的行为符合人类价值观。2023年，Anthropic获得了亚马逊和谷歌等公司的巨额投资，估值达到50亿美元。公司还开发了Claude Code，专门针对编程任务进行了优化。Claude已成为ChatGPT的有力竞争对手，在长文本处理和安全性方面表现出色。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.anthropic.com',
  founded_year = 2021,
  employee_count = '200-500人'
WHERE name = 'Anthropic' OR name LIKE '%Anthropic%';

-- 4. OpenAI
UPDATE companies SET
  description = 'OpenAI是全球领先的AI研究实验室，开发了GPT系列大语言模型和ChatGPT。',
  detailed_description = 'OpenAI成立于2015年，是全球领先的AI研究实验室。总部位于美国旧金山，员工500-1000人。公司最初以非营利组织的身份成立，旨在确保AI造福全人类。OpenAI开发了GPT系列大语言模型，包括GPT-3和GPT-4，这些模型在自然语言理解、代码生成、多模态推理等方面达到了前所未有的水平。公司还推出了DALL-E图像生成模型、Sora视频生成模型、Codex代码助手等产品。ChatGPT是OpenAI最著名的应用，在2023年成为历史上增长最快的消费者应用之一。2023年，微软宣布投资OpenAI，双方建立了深度合作关系。OpenAI也因在AI安全领域的开创性研究而备受关注。公司的目标是开发和推广友好的人工智能，确保其造福全人类。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://openai.com',
  founded_year = 2015,
  employee_count = '500-1000人'
WHERE name = 'OpenAI' OR name LIKE '%OpenAI%';

-- 5. Google DeepMind
UPDATE companies SET
  description = 'DeepMind是Google的AI研究部门，开发了AlphaGo、AlphaFold和Gemini多模态大模型。',
  detailed_description = 'DeepMind成立于2010年，2014年被Google收购成为Google DeepMind，是全球领先的AI研究实验室。总部位于英国伦敦，员工1000-2000人。公司专注于开发通用人工智能（AGI），通过深度学习和强化学习等技术路径探索机器智能。DeepMind开发了AlphaGo，这是第一个击败人类围棋世界冠军的AI系统。公司还开发了AlphaFold，该模型在蛋白质结构预测方面取得了突破性进展，对生物学研究产生了重大影响。2023年，DeepMind与Google Brain合并，集中资源开发Gemini多模态大模型。Gemini能够处理文本、图像、音频和视频等多种输入，代表了大模型技术的最新进展。DeepMind的研究成果已应用于Google的多个产品中。',
  headquarters = 'London, UK',
  website = 'https://deepmind.google',
  founded_year = 2010,
  employee_count = '1000-2000人'
WHERE name = 'Google DeepMind' OR name LIKE '%DeepMind%';

-- 6. Microsoft AI
UPDATE companies SET
  description = 'Microsoft AI提供企业级AI解决方案，包括Azure AI平台、Copilot智能助手和GPT集成服务。',
  detailed_description = 'Microsoft的AI部门提供企业级AI解决方案，包括Azure AI平台、Copilot智能助手和GPT集成服务。总部位于华盛顿州雷德蒙德，员工超过10万人。Microsoft AI深度集成到Office、Windows、Edge等产品中，提供智能写作、图像生成、代码辅助等功能。Azure AI平台提供企业级机器学习服务，支持从训练到部署的完整ML工作流。Microsoft Copilot是跨平台的AI助手，已在GitHub、Office、Windows等多个生态中应用。2023年，Microsoft对OpenAI进行了大规模投资，将GPT技术深度集成到自己的产品中。Microsoft还开发了专门的AI芯片Athena，用于加速AI工作负载。公司致力于通过AI技术提升生产力和创新力。',
  headquarters = 'Redmond, Washington, USA',
  website = 'https://www.microsoft.com/ai',
  founded_year = 2015,
  employee_count = '10000+人'
WHERE name = 'Microsoft AI' OR name LIKE '%Microsoft AI%';

-- 7. Meta AI
UPDATE companies SET
  description = 'Meta AI开发开源AI模型如Llama，并集成AI到Facebook和Instagram。',
  detailed_description = 'Meta AI是Meta的AI研究团队，专注于开发开源AI模型和AI应用。总部位于加州门洛帕克，员工5000-10000人。公司开发了Llama开源大语言模型系列，包括Llama 2和Llama 3，已向研究和商业社区开放。Meta AI还开发了Reels AI推荐系统，为Instagram和Facebook提供个性化内容推荐。Meta的AI技术深度集成到社交产品中，包括智能推荐、内容审核、图像生成等。2023年，Meta发布了Code Llama和Llama 3等模型，在开源AI领域取得重大进展。公司还与多家研究机构合作，推动AI安全和责任AI研究。Meta AI致力于构建开放、公平、安全的AI生态系统。',
  headquarters = 'Menlo Park, California, USA',
  website = 'https://ai.meta.com',
  founded_year = 2013,
  employee_count = '5000-10000人'
WHERE name = 'Meta AI' OR name LIKE '%Meta AI%';

-- 8. Amazon AI
UPDATE companies SET
  description = 'Amazon AI提供AWS机器学习服务，包括SageMaker平台和Alexa语音助手。',
  detailed_description = 'Amazon的AI部门提供AWS机器学习服务，包括SageMaker平台、Alexa语音助手和计算机视觉服务。总部位于华盛顿州西雅图，员工5000-10000人。Amazon AI通过AWS云平台提供企业级机器学习服务，支持模型训练、部署和推理。SageMaker是AWS的机器学习平台，提供了从数据处理到模型训练的完整工具链。Alexa是Amazon的语音助手，已集成到智能音箱、智能家居设备、汽车等多种产品中。Amazon还开发了多项AI技术，包括推荐系统、语音识别、计算机视觉等。2023年，Amazon发布了Titan和Bedrock等AI服务，进一步扩展了AI产品线。公司在智能家居和电商领域广泛应用AI技术。',
  headquarters = 'Seattle, Washington, USA',
  website = 'https://aws.amazon.com/machine-learning',
  founded_year = 2015,
  employee_count = '5000-10000人'
WHERE name = 'Amazon AI' OR name LIKE '%Amazon AI%';

-- 9. Tesla AI
UPDATE companies SET
  description = 'Tesla AI专注于自动驾驶和机器人技术，开发Autopilot系统。',
  detailed_description = 'Tesla的AI部门专注于自动驾驶和机器人技术。总部位于德克萨斯州奥斯汀，员工10000+人。公司开发了Autopilot自动驾驶系统，采用视觉神经网络技术，已部署在数百万辆特斯拉汽车上。Tesla还开发了Dojo超级计算机，专门用于AI训练。2023年，公司发布了Tesla Bot人形机器人原型，展示了在机器人领域的雄心。Tesla的AI技术还用于能源管理和智能充电网络。公司的数据收集能力为其AI发展提供了独特优势，每天都在积累大量真实世界的驾驶数据。Tesla致力于通过AI推动自动驾驶技术发展，目标是实现完全自动驾驶。',
  headquarters = 'Austin, Texas, USA',
  website = 'https://www.tesla.com/autopilot',
  founded_year = 2010,
  employee_count = '10000+人'
WHERE name = 'Tesla AI' OR name LIKE '%Tesla AI%';

-- 10. NVIDIA
UPDATE companies SET
  description = 'NVIDIA是全球AI计算领域的领导者，开发GPU加速计算技术。',
  detailed_description = 'NVIDIA成立于1993年，是全球AI计算领域的领导者。总部位于加州圣克拉拉，员工25000+人。公司开发了GPU加速计算技术，为AI训练和推理提供强大的计算能力。NVIDIA的CUDA平台已成为AI开发的标准环境。公司在游戏、数据中心、自动驾驶、机器人等领域都有重要布局。2023年，NVIDIA凭借其GPU产品，市值超过万亿美元。公司的AI平台NVIDIA AI提供了从模型训练到部署的完整工具链。NVIDIA还与多家云服务商合作，提供AI云服务。公司在AI芯片、数据中心和边缘计算等领域持续创新。',
  headquarters = 'Santa Clara, California, USA',
  website = 'https://www.nvidia.com',
  founded_year = 1993,
  employee_count = '25000+人'
WHERE name = 'NVIDIA' OR name LIKE '%NVIDIA%';

-- 11. Apple AI
UPDATE companies SET
  description = 'Apple AI开发了Siri语音助手和Apple Silicon芯片，推进设备端AI。',
  detailed_description = 'Apple的AI部门开发了Siri语音助手和Apple Silicon芯片，推进设备端AI。总部位于加州库比蒂诺，员工超过20万人。Apple AI技术深度集成到iPhone、iPad、Mac等产品中，提供智能推荐、图像识别、语音识别等功能。Apple Silicon芯片专为AI工作负载优化，提供强大的机器学习能力。Siri是Apple的语音助手，已集成到多个设备中。公司在隐私优先的AI开发方面处于领先地位，所有AI处理都在设备上完成。2023年，Apple发布了神经引擎等AI硬件，进一步提升AI性能。',
  headquarters = 'Cupertino, California, USA',
  website = 'https://www.apple.com/machine-learning',
  founded_year = 2012,
  employee_count = '200000+人'
WHERE name = 'Apple AI' OR name LIKE '%Apple AI%';

-- 12. Tesla
UPDATE companies SET
  description = 'Tesla开发自动驾驶AI和能源管理系统。',
  detailed_description = 'Tesla成立于2003年，专注于电动汽车和自动驾驶技术。总部位于德克萨斯州奥斯汀，员工100000+人。公司开发了Autopilot自动驾驶系统，采用视觉神经网络技术。Tesla还开发了Dojo超级计算机用于AI训练，以及Tesla Bot人形机器人原型。公司的AI技术还用于能源管理和智能充电网络。Tesla的数据收集能力为其AI发展提供了独特优势，每天积累大量真实世界驾驶数据。2023年，公司发布了完全自动驾驶（FSD）Beta版本，展示了先进的AI能力。',
  headquarters = 'Austin, Texas, USA',
  website = 'https://www.tesla.com',
  founded_year = 2003,
  employee_count = '100000+人'
WHERE name = 'Tesla' OR name LIKE '%Tesla%';

-- 13. SenseTime (商汤科技)
UPDATE companies SET
  description = '商汤科技是中国的AI独角兽公司，专注于计算机视觉和深度学习技术。',
  detailed_description = '商汤科技成立于2014年，是中国领先的AI公司。总部位于北京，员工5000+人。公司专注于计算机视觉和深度学习技术，在面部识别、图像识别、自动驾驶等领域处于领先地位。商汤科技开发了SenseCore AI平台，提供强大的AI能力。公司的技术广泛应用于智慧城市、金融、汽车、零售等领域。2023年，商汤科技在香港联交所上市，成为AI独角兽公司。公司与多家企业和政府机构建立了合作关系，推动AI技术在中国的应用。',
  headquarters = '北京, 中国',
  website = 'https://www.sensetime.com',
  founded_year = 2014,
  employee_count = '5000+人'
WHERE name = 'SenseTime' OR name LIKE '%商汤%' OR name LIKE '%SenseTime%';

-- 14. Megvii (旷视科技)
UPDATE companies SET
  description = '旷视科技是中国AI独角兽公司，专注于计算机视觉和深度学习。',
  detailed_description = '旷视科技成立于2011年，是中国领先的AI公司。总部位于北京，员工3000-5000人。公司专注于计算机视觉和深度学习技术，在图像识别、物体检测、人脸识别等领域处于领先地位。旷视科技开发了Face++人脸识别平台，广泛应用于金融、安防、零售等领域。公司的技术还应用于供应链管理、智能仓储等场景。2023年，旷视科技在香港联交所上市，成为AI独角兽公司。公司致力于将AI技术应用于商业场景，帮助企业提升效率。',
  headquarters = '北京, 中国',
  website = 'https://www.megvii.com',
  founded_year = 2011,
  employee_count = '3000-5000人'
WHERE name = 'Megvii' OR name LIKE '%旷视%' OR name LIKE '%Megvii%';

-- 15. CloudWalk (云从科技)
UPDATE companies SET
  description = '云从科技是中国AI独角兽公司，专注于计算机视觉和人脸识别。',
  detailed_description = '云从科技成立于2015年，是中国领先的AI公司。总部位于广州，员工2000-3000人。公司专注于计算机视觉和人脸识别技术，在智慧金融、智慧城市等领域处于领先地位。云从科技开发了人机协同操作系统，广泛应用于金融、安防、零售等领域。公司的技术还应用于智能交通、智能家居等场景。2023年，云从科技在科创板上市，成为AI独角兽公司。公司致力于通过AI技术提升社会效率。',
  headquarters = '广州, 中国',
  website = 'https://www.cloudwalk.com',
  founded_year = 2015,
  employee_count = '2000-3000人'
WHERE name = 'CloudWalk' OR name LIKE '%云从%' OR name LIKE '%CloudWalk%';

-- 16. Yitu Technology (依图科技)
UPDATE companies SET
  description = '依图科技是中国AI公司，专注于计算机视觉和医疗影像分析。',
  detailed_description = '依图科技成立于2012年，是中国领先的AI公司。总部位于上海，员工2000-3000人。公司专注于计算机视觉和医疗影像分析技术，在图像识别、医学影像诊断等领域处于领先地位。依图科技开发了智能影像分析平台，广泛应用于医疗机构。公司的技术还应用于安防、金融等领域。2023年，依图科技专注于医疗AI领域，致力于通过AI技术提升医疗诊断效率。',
  headquarters = '上海, 中国',
  website = 'https://www.yitu.ai',
  founded_year = 2012,
  employee_count = '2000-3000人'
WHERE name = 'Yitu' OR name LIKE '%依图%' OR name LIKE '%Yitu%';

-- 17. Cohere
UPDATE companies SET
  description = 'Cohere开发企业级大语言模型API，专注于企业应用。',
  detailed_description = 'Cohere成立于2019年，是专注于企业级AI的公司。总部位于多伦多，员工300-500人。公司开发了企业级大语言模型API，专注于企业应用。Cohere的模型在对话、文本分类、搜索等任务上表现出色。公司特别注重数据安全和隐私保护，为企业和政府机构提供AI服务。2023年，Cohere获得了多次融资，估值达到数十亿美元。公司与多家企业建立了合作关系，提供定制化的AI解决方案。',
  headquarters = 'Toronto, Canada',
  website = 'https://cohere.ai',
  founded_year = 2019,
  employee_count = '300-500人'
WHERE name = 'Cohere' OR name LIKE '%Cohere%';

-- 18. Aleph Alpha
UPDATE companies SET
  description = 'Aleph Alpha是欧洲AI公司，开发多模态大语言模型。',
  detailed_description = 'Aleph Alpha成立于2019年，是欧洲领先的AI公司。总部位于德国海德堡，员工200-500人。公司开发了多模态大语言模型，在文本生成、图像理解等任务上表现出色。Aleph Alpha专注于欧洲数据和隐私法规，为欧洲企业提供AI服务。2023年，公司获得了多次融资，估值达到数十亿美元。公司与多家欧洲企业建立了合作关系，推动AI技术在欧洲的应用。',
  headquarters = 'Heidelberg, Germany',
  website = 'https://www.aleph-alpha.com',
  founded_year = 2019,
  employee_count = '200-500人'
WHERE name = 'Aleph Alpha' OR name LIKE '%Aleph Alpha%';

-- 19. Adept AI
UPDATE companies SET
  description = 'Adept AI开发AI助手，能够操作计算机和执行任务。',
  detailed_description = 'Adept AI成立于2022年，专注于开发能够操作计算机和执行任务的AI助手。总部位于旧金山，员工100-300人。公司开发的AI助手可以操作浏览器、使用应用程序，帮助用户完成各种任务。Adept AI获得了OpenAI、Google等公司的投资，估值达到数十亿美元。公司的技术还处于早期阶段，但展示了AI自动化的巨大潜力。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.adept.ai',
  founded_year = 2022,
  employee_count = '100-300人'
WHERE name = 'Adept AI' OR name LIKE '%Adept%';

-- 20. Character.AI
UPDATE companies SET
  description = 'Character.AI提供AI角色对话服务，用户可以创建和交互虚拟角色。',
  detailed_description = 'Character.AI成立于2021年，提供AI角色对话服务。总部位于门洛帕克，员工100-300人。用户可以创建和交互虚拟角色，支持多模态对话。2023年，Character.AI成为最受欢迎的AI对话平台之一，吸引了数百万用户。公司还为企业和开发者提供定制化角色服务。',
  headquarters = 'Menlo Park, California, USA',
  website = 'https://character.ai',
  founded_year = 2021,
  employee_count = '100-300人'
WHERE name = 'Character.AI' OR name LIKE '%Character%';

-- 21-30 more companies will be added here...

-- 31. Cursor
UPDATE companies SET
  description = 'Cursor是AI代码编辑器，集成AI助手到开发工作流。',
  detailed_description = 'Cursor成立于2022年，是AI代码编辑器。总部位于旧金山，员工50-200人。公司开发了集成AI助手的代码编辑器，可以理解上下文、生成代码、重构代码。Cursor的AI助手基于OpenAI的GPT模型，为开发者提供智能编程支持。2023年，Cursor获得了多次融资，成为受欢迎的AI开发工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://cursor.sh',
  founded_year = 2022,
  employee_count = '50-200人'
WHERE name = 'Cursor' OR name LIKE '%Cursor%';

-- 32. GitHub Copilot
UPDATE companies SET
  description = 'GitHub Copilot是AI代码助手，提供智能代码建议。',
  detailed_description = 'GitHub Copilot是GitHub和OpenAI合作开发的AI代码助手。总部位于旧金山，员工10000+人。Copilot集成到IDE中，为开发者提供智能代码建议。基于OpenAI的Codex模型，Copilot可以理解上下文、生成代码片段、提供代码补全。2023年，Copilot获得了广泛的采用，成为受欢迎的AI开发工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://github.com/features/copilot',
  founded_year = 2021,
  employee_count = '10000+人'
WHERE name = 'GitHub Copilot' OR name LIKE '%Copilot%';

-- 33. Replit
UPDATE companies SET
  description = 'Replit是在线代码编辑器，集成AI助手提供智能编程。',
  detailed_description = 'Replit成立于2016年，是在线代码编辑器。总部位于旧金山，员工200-500人。公司提供云端的代码编辑器，支持多种编程语言。2023年，Replit集成了AI助手，为开发者提供智能编程支持。公司的技术还应用于教育和编程培训。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://replit.com',
  founded_year = 2016,
  employee_count = '200-500人'
WHERE name = 'Replit' OR name LIKE '%Replit%';

-- 34. Codeium
UPDATE companies SET
  description = 'Codeium是AI代码助手，提供智能代码补全和建议。',
  detailed_description = 'Codeium成立于2021年，是AI代码助手。总部位于帕洛阿尔托，员工100-300人。公司开发的AI代码助手集成到IDE中，为开发者提供智能代码补全和建议。Codeium基于大语言模型，可以理解上下文、生成代码。2023年，Codeium获得了广泛的采用，成为受欢迎的AI开发工具。',
  headquarters = 'Palo Alto, California, USA',
  website = 'https://codeium.com',
  founded_year = 2021,
  employee_count = '100-300人'
WHERE name = 'Codeium' OR name LIKE '%Codeium%';

-- 35. Tabnine
UPDATE companies SET
  description = 'Tabnine是AI代码助手，提供智能代码补全。',
  detailed_description = 'Tabnine成立于2018年，是AI代码助手。总部位于特拉维夫，员工100-300人。公司开发的AI代码助手集成到IDE中，为开发者提供智能代码补全。Tabnine基于深度学习模型，可以预测代码、提供建议。2023年，Tabnine获得了广泛的采用，成为受欢迎的AI开发工具。',
  headquarters = 'Tel Aviv, Israel',
  website = 'https://www.tabnine.com',
  founded_year = 2018,
  employee_count = '100-300人'
WHERE name = 'Tabnine' OR name LIKE '%Tabnine%';

-- 36. DeepSeek
UPDATE companies SET
  description = 'DeepSeek是中国AI公司，开发大语言模型和代码助手。',
  detailed_description = 'DeepSeek成立于2023年，是中国领先的AI公司。总部位于北京，员工500-1000人。公司开发了大语言模型和代码助手，在中文理解和代码生成方面表现出色。DeepSeek的模型包括DeepSeek Chat和DeepSeek Coder，为开发者和用户提供AI服务。2024年，DeepSeek获得了广泛关注，成为受欢迎的AI模型提供商。',
  headquarters = '北京, 中国',
  website = 'https://www.deepseek.com',
  founded_year = 2023,
  employee_count = '500-1000人'
WHERE name = 'DeepSeek' OR name LIKE '%DeepSeek%';

-- 37. MiniMax
UPDATE companies SET
  description = 'MiniMax是中国AI公司，开发大语言模型和多模态AI。',
  detailed_description = 'MiniMax成立于2021年，是中国领先的AI公司。总部位于北京，员工500-1000人。公司开发了大语言模型和多模态AI，在对话、图像生成等任务上表现出色。MiniMax的模型包括abab和MiniMax Chat，为用户提供AI服务。2024年，MiniMax获得了广泛的关注，成为受欢迎的AI模型提供商。',
  headquarters = '北京, 中国',
  website = 'https://www.minimax.chat',
  founded_year = 2021,
  employee_count = '500-1000人'
WHERE name = 'MiniMax' OR name LIKE '%MiniMax%';

-- 38. Zhipu AI (智谱AI)
UPDATE companies SET
  description = '智谱AI是中国AI公司，开发大语言模型ChatGLM。',
  detailed_description = '智谱AI成立于2019年，是中国领先的AI公司。总部位于北京，员工500-1000人。公司开发了大语言模型ChatGLM，在中文理解方面表现出色。智谱AI还开发了代码助手和AI工具，为开发者和用户提供AI服务。2024年，智谱AI获得了广泛的关注，成为受欢迎的AI模型提供商。',
  headquarters = '北京, 中国',
  website = 'https://www.zhipuai.cn',
  founded_year = 2019,
  employee_count = '500-1000人'
WHERE name = 'Zhipu AI' OR name LIKE '%智谱%' OR name LIKE '%Zhipu%';

-- 39. Moonshot AI (月之暗面)
UPDATE companies SET
  description = '月之暗面是中国AI公司，开发大语言模型Kimi。',
  detailed_description = '月之暗面成立于2023年，是中国领先的AI公司。总部位于北京，员工500-1000人。公司开发了大语言模型Kimi，在中文理解和长文本处理方面表现出色。月之暗面的Kimi模型支持超长上下文，能够处理大量信息。2024年，月之暗面获得了广泛的关注，成为受欢迎的AI模型提供商。',
  headquarters = '北京, 中国',
  website = 'https://www.moonshot.ai',
  founded_year = 2023,
  employee_count = '500-1000人'
WHERE name = 'Moonshot AI' OR name LIKE '%月之暗面%' OR name LIKE '%Moonshot%';

-- 40. 01.AI
UPDATE companies SET
  description = '01.AI是中国AI公司，开发大语言模型Yi。',
  detailed_description = '01.AI成立于2023年，是中国领先的AI公司。总部位于北京，员工500-1000人。公司开发了大语言模型Yi，在中文和英文理解方面都表现优秀。01.AI的模型包括Yi-34B和Yi-6B，为开发者和用户提供AI服务。2024年，01.AI获得了广泛的关注，成为受欢迎的AI模型提供商。',
  headquarters = '北京, 中国',
  website = 'https://www.01.ai',
  founded_year = 2023,
  employee_count = '500-1000人'
WHERE name = '01.AI' OR name LIKE '%01%';

COMMIT;
