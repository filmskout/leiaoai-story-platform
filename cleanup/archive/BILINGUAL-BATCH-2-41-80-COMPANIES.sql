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

-- 51. Kuaishou AI (快手AI)
UPDATE companies SET
  description = '快手AI开发短视频AI推荐算法和内容创作工具。',
  detailed_description = '快手AI成立于2011年，是中国领先的短视频平台。总部位于北京，员工10000+人。公司开发的AI推荐算法用于个性化内容推荐，理解用户兴趣和行为。快手AI还提供视频编辑、特效生成等工具，帮助创作者制作高质量内容。2023年，快手AI获得了广泛的采用，成为中国最大的短视频平台之一。',
  headquarters = '北京, 中国',
  website = 'https://www.kuaishou.com',
  founded_year = 2011,
  employee_count = '10000+人'
WHERE name = 'Kuaishou AI' OR name LIKE '%快手%' OR name LIKE '%Kuaishou%';

-- 52. Meituan AI (美团AI)
UPDATE companies SET
  description = '美团AI开发本地生活服务AI推荐算法。',
  detailed_description = '美团AI成立于2010年，是中国领先的本地生活服务平台。总部位于北京，员工100000+人。公司开发的AI推荐算法用于个性化推荐餐饮、外卖、酒店等服务。美团AI还提供智能配送、智能客服等功能，提升用户体验。2023年，美团AI获得了广泛的采用，成为中国最大的本地生活服务平台。',
  headquarters = '北京, 中国',
  website = 'https://www.meituan.com',
  founded_year = 2010,
  employee_count = '100000+人'
WHERE name = 'Meituan AI' OR name LIKE '%美团%' OR name LIKE '%Meituan%';

-- 53. DiDi AI (滴滴AI)
UPDATE companies SET
  description = '滴滴AI开发智能出行算法和自动驾驶技术。',
  detailed_description = '滴滴AI成立于2012年，是中国领先的出行平台。总部位于北京，员工20000+人。公司开发的AI算法用于智能调度、路线优化、动态定价等场景。滴滴AI还开发自动驾驶技术，已在多个城市进行测试。2023年，滴滴AI获得了广泛的采用，成为中国最大的出行平台。',
  headquarters = '北京, 中国',
  website = 'https://www.didiglobal.com',
  founded_year = 2012,
  employee_count = '20000+人'
WHERE name = 'DiDi AI' OR name LIKE '%滴滴%' OR name LIKE '%DiDi%';

-- 54. JDD A (京东AI)
UPDATE companies SET
  description = '京东AI开发电商AI推荐算法和智能物流系统。',
  detailed_description = '京东AI成立于2013年，是中国领先的电商平台。总部位于北京，员工300000+人。公司开发的AI推荐算法用于个性化商品推荐和搜索优化。京东AI还提供智能客服、智能物流等功能，提升用户体验和运营效率。2023年，京东AI获得了广泛的采用，成为中国最大的B2C电商平台之一。',
  headquarters = '北京, 中国',
  website = 'https://www.jd.com',
  founded_year = 2013,
  employee_count = '300000+人'
WHERE name = 'JD AI' OR name LIKE '%京东%' OR name LIKE '%JD%';

-- 55. PDD AI (拼多多AI)
UPDATE companies SET
  description = '拼多多AI开发社交电商推荐算法。',
  detailed_description = '拼多多AI成立于2015年，是中国领先的社交电商平台。总部位于上海，员工50000+人。公司开发的AI推荐算法用于个性化商品推荐，结合社交元素提升用户参与度。拼多多AI还提供智能定价、智能客服等功能，提升用户体验。2023年，拼多多AI获得了广泛的采用，成为中国增长最快的电商平台之一。',
  headquarters = '上海, 中国',
  website = 'https://www.pinduoduo.com',
  founded_year = 2015,
  employee_count = '50000+人'
WHERE name = 'PDD AI' OR name LIKE '%拼多多%' OR name LIKE '%PDD%';

-- 56. Kuaibo AI (快播AI)
UPDATE companies SET
  description = '快播AI开发视频AI推荐算法和内容创作工具。',
  detailed_description = '快播AI成立于2007年，是中国的视频平台。总部位于深圳，员工3000-5000人。公司开发的AI推荐算法用于个性化内容推荐。快播AI还提供视频编辑、特效生成等工具，帮助创作者制作内容。2023年，快播AI专注于AI技术在视频领域的应用。',
  headquarters = '深圳, 中国',
  website = 'https://www.kuaibo.com',
  founded_year = 2007,
  employee_count = '3000-5000人'
WHERE name = 'Kuaibo AI' OR name LIKE '%快播%' OR name LIKE '%Kuaibo%';

-- 57. AutoGPT
UPDATE companies SET
  description = 'AutoGPT是AI自动化代理，能够自主执行复杂任务。',
  detailed_description = 'AutoGPT成立于2023年，是AI自动化代理。总部位于旧金山，员工50-200人。公司开发的AI代理能够自主执行复杂任务，包括搜索信息、生成内容、执行操作等。AutoGPT基于GPT模型，可以理解目标并制定执行计划。2023年，AutoGPT获得了广泛的关注，展示了AI自动化的潜力。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://github.com/Significant-Gravitas/Auto-GPT',
  founded_year = 2023,
  employee_count = '50-200人'
WHERE name = 'AutoGPT' OR name LIKE '%AutoGPT%';

-- 58. AgentGPT
UPDATE companies SET
  description = 'AgentGPT是AI任务自动化平台，帮助用户创建AI代理。',
  detailed_description = 'AgentGPT成立于2023年，是AI任务自动化平台。总部位于旧金山，员工50-200人。公司开发的平台帮助用户创建AI代理，自动化复杂的任务流程。AgentGPT基于GPT模型，可以通过自然语言描述创建代理。2023年，AgentGPT获得了广泛的关注，成为AI自动化工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://agentgpt.reworkd.ai',
  founded_year = 2023,
  employee_count = '50-200人'
WHERE name = 'AgentGPT' OR name LIKE '%AgentGPT%';

-- 59. LangChain
UPDATE companies SET
  description = 'LangChain是AI应用开发框架，简化AI应用构建。',
  detailed_description = 'LangChain成立于2022年，是AI应用开发框架。总部位于旧金山，员工100-300人。公司开发的框架简化AI应用的构建，支持与多种LLM集成。LangChain提供了丰富的工具和组件，帮助开发者快速构建AI应用。2023年，LangChain获得了广泛的采用，成为AI开发的热门框架。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.langchain.com',
  founded_year = 2022,
  employee_count = '100-300人'
WHERE name = 'LangChain' OR name LIKE '%LangChain%';

-- 60. LangFlow
UPDATE companies SET
  description = 'LangFlow是可视化AI应用构建平台。',
  detailed_description = 'LangFlow成立于2023年，是可视化AI应用构建平台。总部位于旧金山，员工50-200人。公司开发的平台通过可视化界面帮助用户构建AI应用，无需编程。LangFlow支持多种LLM和工具，提供丰富的模板和组件。2023年，LangFlow获得了广泛的关注，成为低代码AI开发工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://langflow.org',
  founded_year = 2023,
  employee_count = '50-200人'
WHERE name = 'LangFlow' OR name LIKE '%LangFlow%';

-- 61. LangSmith
UPDATE companies SET
  description = 'LangSmith是LangChain的监控和调试平台，跟踪AI应用运行。',
  detailed_description = 'LangSmith成立于2023年，是LangChain的监控和调试平台。总部位于旧金山，员工100-300人。公司开发的平台帮助开发者监控和调试AI应用，跟踪模型调用、性能和成本。LangSmith提供完整的AI应用生命周期管理，包括开发、测试、部署等。2024年，LangSmith获得了广泛的采用，成为AI开发的重要工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.langsmith.com',
  founded_year = 2023,
  employee_count = '100-300人'
WHERE name = 'LangSmith' OR name LIKE '%LangSmith%';

-- 62. Pinecone
UPDATE companies SET
  description = 'Pinecone是向量数据库，为AI应用提供语义搜索能力。',
  detailed_description = 'Pinecone成立于2019年，是向量数据库。总部位于旧金山，员工200-500人。公司开发的向量数据库为AI应用提供语义搜索能力，支持大规模向量数据的存储和检索。Pinecone已被广泛应用于推荐系统、搜索、相似度匹配等场景。2024年，Pinecone获得了广泛的采用，成为AI应用的热门基础设施。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.pinecone.io',
  founded_year = 2019,
  employee_count = '200-500人'
WHERE name = 'Pinecone' OR name LIKE '%Pinecone%';

-- 63. Weaviate
UPDATE companies SET
  description = 'Weaviate是开源向量数据库，支持语义搜索和图数据库功能。',
  detailed_description = 'Weaviate成立于2017年，是开源向量数据库。总部位于荷兰阿姆斯特丹，员工100-300人。公司开发的向量数据库支持语义搜索和图数据库功能，为AI应用提供强大的数据存储能力。Weaviate支持多种机器学习模型，包括BERT、GPT等。2024年，Weaviate获得了广泛的采用，成为AI应用的重要基础设施。',
  headquarters = 'Amsterdam, Netherlands',
  website = 'https://weaviate.io',
  founded_year = 2017,
  employee_count = '100-300人'
WHERE name = 'Weaviate' OR name LIKE '%Weaviate%';

-- 64. Milvus
UPDATE companies SET
  description = 'Milvus是开源向量数据库，为AI应用提供高效的向量搜索。',
  detailed_description = 'Milvus成立于2019年，是开源向量数据库。总部位于北京，员工200-500人。公司开发的向量数据库为AI应用提供高效的向量搜索能力，支持大规模向量数据的存储和检索。Milvus已被广泛应用于图像搜索、推荐系统等场景。2024年，Milvus获得了广泛的采用，成为AI应用的重要基础设施。',
  headquarters = '北京, 中国',
  website = 'https://milvus.io',
  founded_year = 2019,
  employee_count = '200-500人'
WHERE name = 'Milvus' OR name LIKE '%Milvus%';

-- 65. Qdrant
UPDATE companies SET
  description = 'Qdrant是开源向量搜索引擎，提供高性能的相似度搜索。',
  detailed_description = 'Qdrant成立于2021年，是开源向量搜索引擎。总部位于柏林，员工100-300人。公司开发的向量搜索引擎提供高性能的相似度搜索，支持大规模向量数据的存储和检索。Qdrant采用Rust编写，性能优异。2024年，Qdrant获得了广泛的采用，成为AI应用的热门基础设施。',
  headquarters = 'Berlin, Germany',
  website = 'https://qdrant.tech',
  founded_year = 2021,
  employee_count = '100-300人'
WHERE name = 'Qdrant' OR name LIKE '%Qdrant%';

-- 66. Chroma
UPDATE companies SET
  description = 'Chroma是AI原生向量数据库，简化为AI应用存储embedding。',
  detailed_description = 'Chroma成立于2022年，是AI原生向量数据库。总部位于旧金山，员工100-300人。公司开发的向量数据库简化为AI应用存储embedding，提供简单的API和强大的搜索能力。Chroma已与LangChain等框架集成，成为AI应用的热门选择。2024年，Chroma获得了广泛的采用，成为AI开发的重要工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.trychroma.com',
  founded_year = 2022,
  employee_count = '100-300人'
WHERE name = 'Chroma' OR name LIKE '%Chroma%';

-- 67. LlamaIndex
UPDATE companies SET
  description = 'LlamaIndex是数据框架，连接LLM和私有数据源。',
  detailed_description = 'LlamaIndex成立于2022年，是数据框架。总部位于旧金山，员工100-300人。公司开发的框架连接LLM和私有数据源，使LLM能够访问和理解企业数据。LlamaIndex提供简单的API，帮助开发者快速构建基于LLM的应用。2024年，LlamaIndex获得了广泛的采用，成为AI应用开发的重要工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.llamaindex.ai',
  founded_year = 2022,
  employee_count = '100-300人'
WHERE name = 'LlamaIndex' OR name LIKE '%LlamaIndex%';

-- 68. Haystack
UPDATE companies SET
  description = 'Haystack是神经搜索框架，构建端到端搜索应用。',
  detailed_description = 'Haystack成立于2019年，是神经搜索框架。总部位于柏林，员工100-300人。公司开发的框架帮助开发者构建端到端的搜索应用，集成多种AI模型。Haystack提供完整的工作流，包括文档处理、embedding、检索、问答等。2024年，Haystack获得了广泛的采用，成为AI搜索应用的重要框架。',
  headquarters = 'Berlin, Germany',
  website = 'https://haystack.deepset.ai',
  founded_year = 2019,
  employee_count = '100-300人'
WHERE name = 'Haystack' OR name LIKE '%Haystack%';

-- 69. Haystack AutoGPT
UPDATE companies SET
  description = 'Haystack AutoGPT集成了AutoGPT功能，自动化AI任务。',
  detailed_description = 'Haystack AutoGPT成立于2023年，集成了AutoGPT功能。总部位于柏林，员工50-200人。公司开发的工具结合Haystack和AutoGPT，自动化AI任务流程。Haystack AutoGPT可以帮助用户创建复杂的AI代理，自动化工作任务。2024年，Haystack AutoGPT获得了广泛的关注，成为AI自动化工具。',
  headquarters = 'Berlin, Germany',
  website = 'https://github.com/deepset-ai/haystack',
  founded_year = 2023,
  employee_count = '50-200人'
WHERE name = 'Haystack AutoGPT' OR name LIKE '%Haystack AutoGPT%';

-- 70. Semantic Kernel
UPDATE companies SET
  description = 'Semantic Kernel是Microsoft的AI编排框架，连接LLM和企业数据。',
  detailed_description = 'Semantic Kernel成立于2023年，是Microsoft的AI编排框架。总部位于华盛顿州雷德蒙德，员工1000+人。公司开发的框架连接LLM和企业数据，使开发者能够快速构建AI应用。Semantic Kernel支持多种LLM提供商，包括OpenAI、Azure OpenAI等。2024年，Semantic Kernel获得了广泛的采用，成为企业AI开发的重要框架。',
  headquarters = 'Redmond, Washington, USA',
  website = 'https://github.com/microsoft/semantic-kernel',
  founded_year = 2023,
  employee_count = '1000+人'
WHERE name = 'Semantic Kernel' OR name LIKE '%Semantic Kernel%';

-- 71. Gradio
UPDATE companies SET
  description = 'Gradio是机器学习模型演示平台，快速部署AI模型。',
  detailed_description = 'Gradio成立于2021年，是机器学习模型演示平台。总部位于旧金山，员工100-300人。公司开发的平台帮助开发者快速部署和分享AI模型，创建交互式Web界面。Gradio支持多种机器学习框架，提供简单的API。2023年，Gradio获得了广泛的采用，成为AI模型部署的热门工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.gradio.app',
  founded_year = 2021,
  employee_count = '100-300人'
WHERE name = 'Gradio' OR name LIKE '%Gradio%';

-- 72. Streamlit
UPDATE companies SET
  description = 'Streamlit是机器学习应用开发框架，快速构建AI应用。',
  detailed_description = 'Streamlit成立于2018年，是机器学习应用开发框架。总部位于旧金山，员工200-500人。公司开发的框架帮助开发者快速构建AI应用，通过Python脚本创建交互式Web界面。Streamlit已被Snowflake收购，继续为企业提供服务。2023年，Streamlit获得了广泛的采用，成为AI应用开发的热门框架。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://streamlit.io',
  founded_year = 2018,
  employee_count = '200-500人'
WHERE name = 'Streamlit' OR name LIKE '%Streamlit%';

-- 73. Kaggle
UPDATE companies SET
  description = 'Kaggle是数据科学竞赛平台，促进AI研究和实践。',
  detailed_description = 'Kaggle成立于2010年，是数据科学竞赛平台。总部位于旧金山，员工500-1000人。公司提供的平台帮助数据科学家参与竞赛、分享数据集、学习AI技术。Kaggle已被Google收购，继续为社区提供服务。2023年，Kaggle获得了广泛的采用，成为数据科学家的重要平台。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.kaggle.com',
  founded_year = 2010,
  employee_count = '500-1000人'
WHERE name = 'Kaggle' OR name LIKE '%Kaggle%';

-- 74. Hugging Face
UPDATE companies SET
  description = 'Hugging Face是AI模型托管平台，提供Transformers库和模型中心。',
  detailed_description = 'Hugging Face成立于2016年，是AI模型托管平台。总部位于纽约，员工200-500人。公司提供Transformers库、模型中心和协作工具，支持开源AI生态。Hugging Face托管了数万个AI模型，从大语言模型到专门的领域模型。平台的模型中心已成为开发者共享和使用AI模型的重要场所。2023年，Hugging Face获得了多次融资，估值达到数十亿美元。',
  headquarters = 'New York, New York, USA',
  website = 'https://huggingface.co',
  founded_year = 2016,
  employee_count = '200-500人'
WHERE name = 'Hugging Face' OR name LIKE '%Hugging Face%';

-- 75. Weights & Biases
UPDATE companies SET
  description = 'Weights & Biases是机器学习实验跟踪平台，监控模型训练。',
  detailed_description = 'Weights & Biases成立于2018年，是机器学习实验跟踪平台。总部位于旧金山，员工300-500人。公司开发的平台帮助开发者跟踪和监控机器学习实验，记录超参数、指标和输出。Weights & Biases支持多种机器学习框架，提供可视化界面。2023年，Weights & Biases获得了广泛的采用，成为MLOps的热门工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.wandb.com',
  founded_year = 2018,
  employee_count = '300-500人'
WHERE name = 'Weights & Biases' OR name LIKE '%Weights%';

-- 76. Comet ML
UPDATE companies SET
  description = 'Comet ML是机器学习模型管理平台，跟踪实验和模型版本。',
  detailed_description = 'Comet ML成立于2017年，是机器学习模型管理平台。总部位于纽约，员工200-500人。公司开发的平台帮助开发者管理机器学习实验，跟踪模型版本和性能。Comet ML支持多种机器学习框架，提供协作功能。2023年，Comet ML获得了广泛的采用，成为MLOps的热门工具。',
  headquarters = 'New York, New York, USA',
  website = 'https://www.comet.com',
  founded_year = 2017,
  employee_count = '200-500人'
WHERE name = 'Comet ML' OR name LIKE '%Comet%';

-- 77. Neptune
UPDATE companies SET
  description = 'Neptune是机器学习实验管理平台，跟踪和比较模型性能。',
  detailed_description = 'Neptune成立于2017年，是机器学习实验管理平台。总部位于华沙，员工200-500人。公司开发的平台帮助开发者跟踪机器学习实验，比较模型性能和管理版本。Neptune支持多种机器学习框架，提供可视化界面。2023年，Neptune获得了广泛的采用，成为MLOps的热门工具。',
  headquarters = 'Warsaw, Poland',
  website = 'https://neptune.ai',
  founded_year = 2017,
  employee_count = '200-500人'
WHERE name = 'Neptune' OR name LIKE '%Neptune%';

-- 78. ClearML
UPDATE companies SET
  description = 'ClearML是MLOps平台，自动化机器学习工作流。',
  detailed_description = 'ClearML成立于2018年，是MLOps平台。总部位于特拉维夫，员工100-300人。公司开发的平台自动化机器学习工作流，包括实验跟踪、模型管理、资源调度等。ClearML支持多种机器学习框架，提供完整的企业级功能。2023年，ClearML获得了广泛的采用，成为企业MLOps的热门选择。',
  headquarters = 'Tel Aviv, Israel',
  website = 'https://clear.ml',
  founded_year = 2018,
  employee_count = '100-300人'
WHERE name = 'ClearML' OR name LIKE '%ClearML%';

-- 79. Polyaxon
UPDATE companies SET
  description = 'Polyaxon是机器学习平台，简化模型训练和部署。',
  detailed_description = 'Polyaxon成立于2017年，是机器学习平台。总部位于旧金山，员工100-300人。公司开发的平台简化模型训练和部署，提供实验跟踪、资源管理、模型服务等功能。Polyaxon支持多种机器学习框架，可以部署在Kubernetes上。2023年，Polyaxon获得了广泛的采用，成为企业ML平台的热门选择。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://polyaxon.com',
  founded_year = 2017,
  employee_count = '100-300人'
WHERE name = 'Polyaxon' OR name LIKE '%Polyaxon%';

-- 80. Determined AI
UPDATE companies SET
  description = 'Determined AI是深度学习训练平台，加速模型训练。',
  detailed_description = 'Determined AI成立于2017年，是深度学习训练平台。总部位于西雅图，员工100-300人。公司开发的平台加速深度学习模型训练，提供分布式训练、自动超参数优化等功能。Determined AI支持PyTorch和TensorFlow，已被HPE收购。2023年，Determined AI继续为企业提供深度学习平台。',
  headquarters = 'Seattle, Washington, USA',
  website = 'https://www.determined.ai',
  founded_year = 2017,
  employee_count = '100-300人'
WHERE name = 'Determined AI' OR name LIKE '%Determined%';

COMMIT;
