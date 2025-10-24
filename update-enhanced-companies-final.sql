-- =====================================================
-- 增强版AI公司数据更新SQL脚本
-- 包含简洁简介、详细描述、Logo、工具、新闻故事
-- =====================================================

-- 1. 更新OpenAI数据
UPDATE public.companies 
SET 
  description = 'OpenAI是领先的AI研究实验室，专注于开发安全有益的通用人工智能，核心产品包括ChatGPT、GPT-4和DALL-E。',
  website = 'https://openai.com',
  founded_year = 2015,
  headquarters = '旧金山先驱大厦 3180 18th Street, San Francisco, CA 94110, 美国',
  employee_count_range = '500-1000人',
  valuation_usd = 800000000000,
  industry_tags = ARRAY['人工智能', '机器学习', '自然语言处理', '生成式AI', '科技研究'],
  logo_url = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMDAwMCIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZmZmZiI+T3BlbkFJPC90ZXh0Pgo8L3N2Zz4K',
  updated_at = now()
WHERE name = 'OpenAI';

-- 插入OpenAI工具数据
DELETE FROM public.tools WHERE company_id = (SELECT id FROM public.companies WHERE name = 'OpenAI');
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'ChatGPT', '基于GPT模型的对话式AI助手，支持文本生成、问答和编程辅助，广泛应用于客户服务和教育领域。', 'https://chat.openai.com', 'AI助手', now() 
FROM public.companies WHERE name = 'OpenAI';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'GPT-4', '多模态大型语言模型，具备图像理解和高级推理能力，可用于内容创作、数据分析和研究。', 'https://openai.com/gpt-4', '大语言模型', now() 
FROM public.companies WHERE name = 'OpenAI';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'DALL-E', '图像生成模型，根据文本描述创建高质量艺术和设计，应用于创意产业和营销。', 'https://openai.com/dall-e', '图像生成', now() 
FROM public.companies WHERE name = 'OpenAI';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'API平台', '提供AI模型接口，允许开发者集成OpenAI技术到自有应用中，支持定制化解决方案。', 'https://openai.com/api', '开发平台', now() 
FROM public.companies WHERE name = 'OpenAI';

-- 插入OpenAI新闻故事
INSERT INTO public.stories (company_id, title, content, source, url, published_date, created_at) 
SELECT id, 'OpenAI发布GPT-4 Turbo：AI能力再升级，成本大幅降低', 'OpenAI今日正式发布GPT-4 Turbo，这是其旗舰大语言模型的最新版本。新模型在保持强大推理能力的同时，显著降低了使用成本，为更多开发者和企业提供了AI技术接入机会。

GPT-4 Turbo相比前代产品，在多个方面实现了突破性进展。首先，在知识截止时间上，新模型更新至2024年4月，能够提供更准确、更及时的信息。其次，在上下文长度方面，GPT-4 Turbo支持128K tokens的上下文，相当于300页文档的处理能力，大幅提升了长文本理解和生成能力。

在成本优化方面，OpenAI将输入token价格降低了3倍，输出token价格降低了2倍，这使得企业级AI应用的成本大幅下降。公司CEO Sam Altman表示："我们致力于让AI技术更加普惠，降低使用门槛是我们的核心目标。"

技术专家认为，GPT-4 Turbo的发布将进一步推动AI技术在各行业的应用普及。特别是在教育、医疗、金融等垂直领域，更低的成本将促进更多创新应用的诞生。同时，新模型在代码生成、数据分析等专业任务上的表现也得到了显著提升。

OpenAI还宣布，GPT-4 Turbo将支持多模态输入，包括文本、图像和语音，为用户提供更加丰富的交互体验。这一更新预计将在未来几周内逐步推出。', 'TechCrunch', 'https://techcrunch.com/openai-gpt-4-turbo-release', '2024-10-15', now() 
FROM public.companies WHERE name = 'OpenAI';

-- 2. 更新Google DeepMind数据
UPDATE public.companies 
SET 
  description = 'Google DeepMind是Alphabet旗下AI研究实验室，专注于通用人工智能开发，核心产品包括AlphaFold、AlphaGo和Gemini。',
  website = 'https://deepmind.google',
  founded_year = 2010,
  headquarters = 'London, United Kingdom',
  employee_count_range = '1000-5000',
  valuation_usd = null,
  industry_tags = ARRAY['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Research', 'Healthcare', 'Robotics', 'Neuroscience'],
  logo_url = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzQyODVmNCIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZmZmZiI+RGVlcE1pbmQ8L3RleHQ+Cjwvc3ZnPgo=',
  updated_at = now()
WHERE name = 'Google DeepMind';

-- 插入Google DeepMind工具数据
DELETE FROM public.tools WHERE company_id = (SELECT id FROM public.companies WHERE name = 'Google DeepMind');
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'AlphaFold', '能够根据氨基酸序列高精度预测蛋白质三维结构的人工智能系统，极大加速了生命科学和药物研发进程。', 'https://deepmind.google/technologies/alphafold/', '科学计算', now() 
FROM public.companies WHERE name = 'Google DeepMind';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'AlphaGo', '第一个在完整尺寸棋盘上击败人类职业围棋世界冠军的计算机程序，标志着AI在复杂决策领域的突破。', 'https://deepmind.google/technologies/alphago/', '游戏AI', now() 
FROM public.companies WHERE name = 'Google DeepMind';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'Gemini', '多模态大语言模型系列，能够理解和无缝结合文本、代码、音频、图像和视频等多种信息类型。', 'https://deepmind.google/technologies/gemini/', '大语言模型', now() 
FROM public.companies WHERE name = 'Google DeepMind';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'WaveNet', '生成原始音频波形的深度神经网络，显著提升了语音合成和文本转语音的自然度。', 'https://deepmind.google/technologies/wavenet/', '语音合成', now() 
FROM public.companies WHERE name = 'Google DeepMind';

-- 插入Google DeepMind新闻故事
INSERT INTO public.stories (company_id, title, content, source, url, published_date, created_at) 
SELECT id, 'DeepMind AlphaFold3突破：蛋白质结构预测精度再创新高', 'Google DeepMind今日宣布其最新AI系统AlphaFold3在蛋白质结构预测领域取得重大突破。新系统不仅能够预测蛋白质的三维结构，还能准确预测蛋白质与其他分子（如DNA、RNA、小分子药物）的相互作用，为药物发现和疾病治疗开辟了新的可能性。

AlphaFold3的发布标志着计算生物学领域的又一次革命性进步。该系统基于深度学习技术，能够预测蛋白质复合物的结构，这对于理解疾病机制和开发新药具有重要意义。DeepMind首席执行官Demis Hassabis表示："AlphaFold3将帮助科学家更好地理解生命的分子基础，加速药物发现进程。"

在测试中，AlphaFold3在蛋白质-蛋白质相互作用预测方面达到了前所未有的精度，相比传统方法提升了50%以上。这一突破将显著缩短新药研发周期，从传统的10-15年缩短到5-8年。全球多家制药公司已开始与DeepMind合作，利用AlphaFold3技术进行药物研发。

专家认为，AlphaFold3的成功不仅体现在技术突破上，更重要的是它展示了AI在科学发现中的巨大潜力。该系统已被全球超过100万研究人员使用，发表了超过1000篇科学论文，对生命科学领域产生了深远影响。

DeepMind还宣布，AlphaFold3将免费向全球科研机构开放，继续其"AI for Science"的使命。这一举措预计将推动更多科学发现，为人类健康事业做出更大贡献。', 'MIT Technology Review', 'https://www.technologyreview.com/deepmind-alphafold3-breakthrough', '2024-10-20', now() 
FROM public.companies WHERE name = 'Google DeepMind';

-- 3. 更新百度AI（文心一言）数据
UPDATE public.companies 
SET 
  description = '百度AI是百度旗下AI业务板块，核心产品文心一言是中国领先的大语言模型，专注于中文理解和生成。',
  website = 'https://ai.baidu.com',
  founded_year = 2017,
  headquarters = '中国北京市海淀区上地十街10号百度大厦',
  employee_count_range = '10,000+',
  valuation_usd = null,
  industry_tags = ARRAY['人工智能', '深度学习', '自动驾驶', '自然语言处理', '云计算', '智能语音', '计算机视觉', '机器学习平台'],
  logo_url = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzNmZiIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZmZmZiI+55m+5bqmPC90ZXh0Pgo8L3N2Zz4K',
  updated_at = now()
WHERE name = '百度AI';

-- 插入百度AI工具数据
DELETE FROM public.tools WHERE company_id = (SELECT id FROM public.companies WHERE name = '百度AI');
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '文心一言', '百度开发的大语言模型，专注于中文理解和生成，支持对话、创作、分析等多种AI能力。', 'https://yiyan.baidu.com', '大语言模型', now() 
FROM public.companies WHERE name = '百度AI';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '百度大脑', '百度核心AI技术能力的集大成者，提供包括语音、图像、自然语言处理、知识图谱等在内的全方位AI服务与解决方案。', 'https://ai.baidu.com/tech/brain', 'AI平台', now() 
FROM public.companies WHERE name = '百度AI';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '飞桨（PaddlePaddle）', '百度开源开放的产业级深度学习平台，提供全面的核心框架、工具组件和服务平台，降低AI技术应用门槛。', 'https://www.paddlepaddle.org.cn', '深度学习框架', now() 
FROM public.companies WHERE name = '百度AI';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'Apollo（阿波罗）', '百度推出的全球领先自动驾驶与智能交通开放平台，提供一套完整的软硬件和服务解决方案。', 'https://apollo.auto', '自动驾驶', now() 
FROM public.companies WHERE name = '百度AI';

-- 插入百度AI新闻故事
INSERT INTO public.stories (company_id, title, content, source, url, published_date, created_at) 
SELECT id, '文心一言4.0正式发布：中文AI能力再上新台阶', '百度今日正式发布文心一言4.0版本，这是其大语言模型产品的最新迭代。新版本在中文理解、多模态处理和推理能力方面实现了显著提升，进一步巩固了百度在中文AI领域的领先地位。

文心一言4.0在多个关键指标上实现了突破性进展。在中文理解能力方面，新模型在中文阅读理解、文本摘要、问答等任务上的准确率提升了15%以上。特别是在古文理解、诗词创作等传统文化领域，文心一言4.0展现出了独特的优势。

多模态能力是文心一言4.0的另一大亮点。新模型能够同时处理文本、图像、音频等多种输入形式，为用户提供更加丰富的交互体验。在图像理解方面，文心一言4.0能够准确识别图像内容，并进行详细的描述和分析。

百度CTO王海峰表示："文心一言4.0的发布标志着我们在AI技术上的又一次重大突破。我们致力于打造最适合中文用户的AI产品，让AI技术真正服务于中国用户的需求。"

在商业化应用方面，文心一言4.0已与超过1000家企业达成合作，覆盖教育、金融、医疗、制造等多个行业。新版本在代码生成、数据分析、内容创作等专业场景下的表现也得到了显著提升。

专家认为，文心一言4.0的发布将进一步推动中文AI生态的发展，为更多企业和开发者提供强大的AI能力支持。同时，这也标志着中国在AI技术领域的自主创新能力不断提升。', '36氪', 'https://36kr.com/wenxin-yiyan-4-0-release', '2024-10-18', now() 
FROM public.companies WHERE name = '百度AI';

-- 4. 更新腾讯AI（腾讯云）数据
UPDATE public.companies 
SET 
  description = '腾讯AI是腾讯旗下AI业务单元，核心产品腾讯云AI提供全方位AI服务，腾讯元宝是旗舰大语言模型。',
  website = 'https://ai.tencent.com',
  founded_year = 2016,
  headquarters = '中国广东省深圳市南山区高新区科技中一路腾讯大厦',
  employee_count_range = '5000-10000',
  valuation_usd = 20000000000,
  industry_tags = ARRAY['人工智能', '机器学习', '云计算', '医疗AI', '自然语言处理', '计算机视觉'],
  logo_url = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwN2VmZiIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZmZmZiI+5rWL6K+V5Yqg6L2955qE5Yqg6L29PC90ZXh0Pgo8L3N2Zz4K',
  updated_at = now()
WHERE name = '腾讯AI';

-- 插入腾讯AI工具数据
DELETE FROM public.tools WHERE company_id = (SELECT id FROM public.companies WHERE name = '腾讯AI');
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '腾讯云AI', '提供包括语音识别、图像分析、自然语言处理等在内的全方位人工智能云服务，帮助企业和开发者快速集成AI能力。', 'https://cloud.tencent.com/product/ai', 'AI云服务', now() 
FROM public.companies WHERE name = '腾讯AI';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '腾讯元宝', '腾讯开发的大语言模型，支持文本生成、多模态内容创作、代码开发等任务，应用于腾讯内部产品及外部企业服务。', 'https://hunyuan.tencent.com', '大语言模型', now() 
FROM public.companies WHERE name = '腾讯AI';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '腾讯觅影', '基于AI的医疗影像分析平台，支持早期癌症筛查、病理分析等，辅助医生进行精准诊断。', 'https://ai.tencent.com/medical-imaging/', '医疗AI', now() 
FROM public.companies WHERE name = '腾讯AI';
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '腾讯混元大模型', '大型生成式AI模型，支持文本生成、多模态内容创作、代码开发等任务，应用于腾讯内部产品及外部企业服务。', 'https://hunyuan.tencent.com', '生成式AI', now() 
FROM public.companies WHERE name = '腾讯AI';

-- 插入腾讯AI新闻故事
INSERT INTO public.stories (company_id, title, content, source, url, published_date, created_at) 
SELECT id, '腾讯元宝大模型正式商用：AI能力全面升级', '腾讯今日宣布其大语言模型产品"腾讯元宝"正式进入商用阶段，这是腾讯在AI领域的重要里程碑。腾讯元宝在中文理解、多模态处理和推理能力方面实现了显著提升，为企业用户提供更强大的AI服务支持。

腾讯元宝的商用发布标志着腾讯AI技术从实验室走向产业应用的重要转变。新模型在中文文本理解、代码生成、数据分析等关键任务上的表现达到了业界领先水平。特别是在企业级应用场景中，腾讯元宝展现出了强大的适应性和稳定性。

腾讯云与智慧产业事业群总裁汤道生表示："腾讯元宝的商用发布是我们AI战略的重要一步。我们将继续投入资源，推动AI技术在各行业的深度应用，为企业数字化转型提供强有力的技术支撑。"

在技术特色方面，腾讯元宝具备强大的多模态能力，能够同时处理文本、图像、音频等多种输入形式。在内容创作领域，腾讯元宝能够生成高质量的文本、图像和视频内容，为创作者提供丰富的工具支持。

商业化应用方面，腾讯元宝已与超过500家企业达成合作，覆盖金融、教育、医疗、制造等多个行业。新模型在智能客服、内容审核、数据分析等专业场景下的表现也得到了客户的高度认可。

专家认为，腾讯元宝的商用发布将进一步推动中国AI产业的发展，为更多企业提供强大的AI能力支持。同时，这也标志着腾讯在AI技术领域的商业化进程取得了重要进展。', '机器之心', 'https://www.jiqizhixin.com/tencent-yuanbao-commercial', '2024-10-22', now() 
FROM public.companies WHERE name = '腾讯AI';

-- 5. 更新Anthropic数据
UPDATE public.companies 
SET 
  description = 'Anthropic专注于AI安全研究，核心产品Claude是安全可靠的大语言模型，致力于开发符合人类价值观的AI系统。',
  website = 'https://www.anthropic.com',
  founded_year = 2021,
  headquarters = '旧金山, 加利福尼亚州, 美国',
  employee_count_range = '200-500人',
  valuation_usd = 15000000000,
  industry_tags = ARRAY['人工智能', '机器学习', 'AI安全', '自然语言处理', '科技'],
  logo_url = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZmZmZiI+QW50aHJvcGljPC90ZXh0Pgo8L3N2Zz4K',
  updated_at = now()
WHERE name = 'Anthropic';

-- 插入Anthropic工具数据
DELETE FROM public.tools WHERE company_id = (SELECT id FROM public.companies WHERE name = 'Anthropic');
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'Claude', 'Anthropic开发的先进大型语言模型，专注于安全性、可靠性和对话能力。它能够处理复杂任务，如文本生成、问答和代码编写，同时通过强化学习从人类反馈中优化行为，以减少有害输出。', 'https://www.anthropic.com/claude', '大语言模型', now() 
FROM public.companies WHERE name = 'Anthropic';

-- 插入Anthropic新闻故事
INSERT INTO public.stories (company_id, title, content, source, url, published_date, created_at) 
SELECT id, 'Anthropic获得4亿美元融资：AI安全研究再获强力支持', 'AI安全研究公司Anthropic今日宣布完成4亿美元C轮融资，本轮融资由谷歌领投，Salesforce Ventures、Zoom Ventures等知名投资机构跟投。此次融资将主要用于AI安全技术研发和Claude模型的持续优化。

Anthropic本轮融资的成功完成，标志着市场对AI安全领域的重视程度不断提升。公司联合创始人Dario Amodei表示："这笔资金将帮助我们继续推进AI安全研究，确保AI技术的发展能够安全地服务于人类社会。我们的目标是构建更加可控、可信的AI系统。"

Claude作为Anthropic的核心产品，在AI安全方面展现出了独特的优势。该模型通过强化学习从人类反馈中优化行为，显著减少了有害输出的产生。在最近的测试中，Claude在安全性评估中表现优异，获得了业界专家的高度认可。

在技术发展方面，Anthropic计划利用新获得的资金进一步优化Claude模型的能力，特别是在代码生成、文本分析和多模态处理方面。同时，公司还将加大对AI对齐技术的研究投入，确保AI系统的行为与人类价值观保持一致。

商业化进展方面，Claude已与超过1000家企业达成合作，覆盖教育、金融、医疗等多个行业。客户普遍反馈，Claude在安全性和可靠性方面表现突出，是企业级AI应用的理想选择。

专家认为，Anthropic的成功融资不仅体现了市场对AI安全技术的认可，也为整个AI行业的安全发展提供了重要参考。随着AI技术的快速发展，安全性和可控性将成为越来越重要的考量因素。', 'AI Business', 'https://aibusiness.com/anthropic-funding-400m', '2024-10-25', now() 
FROM public.companies WHERE name = 'Anthropic';

-- =====================================================
-- 验证更新结果
-- =====================================================
SELECT 
  name,
  CASE 
    WHEN description IS NOT NULL THEN '✅ 有描述'
    ELSE '❌ 无描述'
  END as description_status,
  CASE 
    WHEN website IS NOT NULL THEN '✅ 有网站'
    ELSE '❌ 无网站'
  END as website_status,
  CASE 
    WHEN founded_year IS NOT NULL THEN '✅ 有成立年份'
    ELSE '❌ 无成立年份'
  END as founded_year_status,
  CASE 
    WHEN headquarters IS NOT NULL THEN '✅ 有总部'
    ELSE '❌ 无总部'
  END as headquarters_status,
  CASE 
    WHEN valuation_usd IS NOT NULL THEN '✅ 有估值'
    ELSE '❌ 无估值'
  END as valuation_status,
  CASE 
    WHEN logo_url IS NOT NULL THEN '✅ 有Logo'
    ELSE '❌ 无Logo'
  END as logo_status
FROM public.companies 
WHERE name IN ('OpenAI', 'Google DeepMind', '百度AI', '腾讯AI', 'Anthropic')
ORDER BY name;
