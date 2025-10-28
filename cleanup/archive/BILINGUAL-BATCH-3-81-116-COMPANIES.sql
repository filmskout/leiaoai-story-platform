-- BILINGUAL COMPANY DATA - BATCH 3 (Companies 81-116)
-- This SQL file contains bilingual descriptions for companies 81-116

BEGIN;

-- 81. Character.AI
UPDATE companies SET
  description = 'Character.AI提供AI角色对话服务，用户可以创建和交互虚拟角色。',
  detailed_description = 'Character.AI成立于2021年，提供AI角色对话服务。总部位于门洛帕克，员工100-300人。用户可以创建和交互虚拟角色，支持多模态对话。2023年，Character.AI成为最受欢迎的AI对话平台之一，吸引了数百万用户。公司还为企业和开发者提供定制化角色服务。',
  headquarters = 'Menlo Park, California, USA',
  website = 'https://character.ai',
  founded_year = 2021,
  employee_count = '100-300人'
WHERE name = 'Character.AI' OR name LIKE '%Character%';

-- 82. Jasper
UPDATE companies SET
  description = 'Jasper是AI内容创作平台，为企业提供文案生成和品牌文案助手服务。',
  detailed_description = 'Jasper成立于2021年，是AI内容创作平台。总部位于奥斯汀，员工200-500人。公司为企业提供文案生成、内容优化和品牌文案助手服务。2023年，Jasper完成了数轮融资，估值达到数十亿美元。公司为企业提供团队协作和管理工具，帮助团队提高内容创作效率。',
  headquarters = 'Austin, Texas, USA',
  website = 'https://www.jasper.ai',
  founded_year = 2021,
  employee_count = '200-500人'
WHERE name = 'Jasper' OR name LIKE '%Jasper%';

-- 83. Copy.ai
UPDATE companies SET
  description = 'Copy.ai是AI文案创作工具，帮助营销团队快速生成广告文案和社交媒体内容。',
  detailed_description = 'Copy.ai成立于2020年，是AI文案创作工具。总部位于旧金山，员工50-200人。公司帮助营销团队快速生成广告文案、邮件、社交媒体内容。2023年，Copy.ai用户数快速增长，成为营销人员的重要工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.copy.ai',
  founded_year = 2020,
  employee_count = '50-200人'
WHERE name = 'Copy.ai' OR name LIKE '%Copy.ai%';

-- 84. Notion AI
UPDATE companies SET
  description = 'Notion AI集成在Notion中的AI助手，提供智能写作、翻译和创意生成功能。',
  detailed_description = 'Notion AI集成在Notion中的AI助手。总部位于旧金山，员工500-1000人。公司提供智能写作、翻译、摘要和创意生成功能。2023年，Notion AI集成到Notion工作空间中，为用户提供AI辅助的协作体验。公司为企业和个人用户提供灵活的定价模式。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.notion.so/product/ai',
  founded_year = 2013,
  employee_count = '500-1000人'
WHERE name = 'Notion AI' OR name LIKE '%Notion%';

-- 85. IBM Watson
UPDATE companies SET
  description = 'IBM Watson提供企业AI解决方案，包括Watson助手和数据科学平台。',
  detailed_description = 'IBM Watson提供企业AI解决方案，包括Watson助手、Watson Studio数据科学平台和行业特定AI应用。成立于1911年，总部位于纽约州阿蒙克，员工超过10万人。IBM Watson在医疗、金融、法律、教育等多个领域提供AI解决方案。Watson Assistant为企业和政府提供智能对话服务。Watson Studio提供端到端的机器学习平台，支持数据科学家和开发者构建、部署和管理AI模型。IBM还在量子计算和芯片设计领域投入，开发了量子计算系统和AI芯片。',
  headquarters = 'Armonk, New York, USA',
  website = 'https://www.ibm.com/watson',
  founded_year = 1911,
  employee_count = '100000+人'
WHERE name = 'IBM Watson' OR name LIKE '%IBM%';

-- 86. ElevenLabs
UPDATE companies SET
  description = 'ElevenLabs是AI语音合成平台，生成自然的人工语音。',
  detailed_description = 'ElevenLabs成立于2022年，是AI语音合成平台。总部位于伦敦，员工50-200人。公司开发的AI工具可以生成自然的人工语音，支持多种语言和声音风格。ElevenLabs的语音合成技术质量高，已广泛应用于视频制作、有声书、播客等领域。2024年，ElevenLabs获得了广泛的关注，成为AI语音领域的领导者。',
  headquarters = 'London, UK',
  website = 'https://elevenlabs.io',
  founded_year = 2022,
  employee_count = '50-200人'
WHERE name = 'ElevenLabs' OR name LIKE '%ElevenLabs%';

-- 87. Resemble AI
UPDATE companies SET
  description = 'Resemble AI是AI语音克隆平台，创建逼真的语音副本。',
  detailed_description = 'Resemble AI成立于2019年，是AI语音克隆平台。总部位于多伦多，员工100-300人。公司开发的AI工具可以创建逼真的语音副本，支持语音合成和实时语音转换。Resemble AI已广泛应用于客服、游戏、影视等领域。2024年，Resemble AI获得了广泛的关注，成为AI语音克隆领域的领导者。',
  headquarters = 'Toronto, Canada',
  website = 'https://www.resemble.ai',
  founded_year = 2019,
  employee_count = '100-300人'
WHERE name = 'Resemble AI' OR name LIKE '%Resemble%';

-- 88. Descript
UPDATE companies SET
  description = 'Descript是AI音频和视频编辑工具，自动化内容创作。',
  detailed_description = 'Descript成立于2017年，是AI音频和视频编辑工具。总部位于旧金山，员工200-500人。公司开发的工具通过文本编辑音频和视频，自动化内容创作工作流。Descript还提供多说话者识别、自动转录、语音克隆等功能。2024年，Descript获得了广泛的采用，成为播客和视频创作者的热门工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.descript.com',
  founded_year = 2017,
  employee_count = '200-500人'
WHERE name = 'Descript' OR name LIKE '%Descript%';

-- 89. Kaimu AI (百川智能)
UPDATE companies SET
  description = '百川智能是中国AI公司，开发大语言模型Baichuan。',
  detailed_description = '百川智能成立于2023年，是中国领先的AI公司。总部位于北京，员工500-1000人。公司开发了大语言模型Baichuan，在中文理解方面表现出色。百川智能还提供API服务，为开发者提供AI能力。2024年，百川智能获得了广泛的关注，成为中文AI模型的热门选择。',
  headquarters = '北京, 中国',
  website = 'https://www.baichuan-ai.com',
  founded_year = 2023,
  employee_count = '500-1000人'
WHERE name = 'Kaimu AI' OR name LIKE '%百川%' OR name LIKE '%Baichuan%';

-- 90. Mojo AI
UPDATE companies SET
  description = 'Mojo是AI编程语言，专为高性能机器学习设计。',
  detailed_description = 'Mojo成立于2023年，是AI编程语言。总部位于旧金山，员工100-300人。公司开发的Mojo语言专为高性能机器学习设计，结合Python的易用性和C++的性能。Mojo旨在提升机器学习模型的运行效率，加速AI应用开发。2024年，Mojo获得了广泛的关注，成为AI开发的热门语言。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.modular.com',
  founded_year = 2023,
  employee_count = '100-300人'
WHERE name = 'Mojo AI' OR name LIKE '%Mojo%';

-- 91. TensorFlow
UPDATE companies SET
  description = 'TensorFlow是Google的机器学习框架，广泛应用于AI开发。',
  detailed_description = 'TensorFlow成立于2015年，是Google的机器学习框架。总部位于加州山景城，员工10000+人。TensorFlow是世界上使用最广泛的机器学习框架之一，支持深度学习、强化学习等多种模型。TensorFlow已开源，被全球开发者广泛采用。2024年，TensorFlow继续发展，支持更高效的大规模训练和推理。',
  headquarters = 'Mountain View, California, USA',
  website = 'https://www.tensorflow.org',
  founded_year = 2015,
  employee_count = '10000+人'
WHERE name = 'TensorFlow' OR name LIKE '%TensorFlow%';

-- 92. PyTorch
UPDATE companies SET
  description = 'PyTorch是Meta的深度学习框架，专注于研究和开发。',
  detailed_description = 'PyTorch成立于2016年，是Meta的深度学习框架。总部位于加州门洛帕克，员工5000+人。PyTorch是世界上使用最广泛的深度学习框架之一，在研究和学术领域尤其受欢迎。PyTorch提供动态计算图和灵活的API，适合快速原型开发。2024年，PyTorch继续发展，支持大规模训练和高效推理。',
  headquarters = 'Menlo Park, California, USA',
  website = 'https://pytorch.org',
  founded_year = 2016,
  employee_count = '5000+人'
WHERE name = 'PyTorch' OR name LIKE '%PyTorch%';

-- 93. JAX
UPDATE companies SET
  description = 'JAX是Google的科学计算库，提供高性能的数值计算。',
  detailed_description = 'JAX成立于2018年，是Google的科学计算库。总部位于加州山景城，员工1000+人。JAX提供高性能的数值计算，结合NumPy的易用性和高性能自动微分。JAX支持JIT编译、自动并行化等功能，适合机器学习研究。2024年，JAX获得了广泛的采用，成为机器学习研究的热门工具。',
  headquarters = 'Mountain View, California, USA',
  website = 'https://github.com/google/jax',
  founded_year = 2018,
  employee_count = '1000+人'
WHERE name = 'JAX' OR name LIKE '%JAX%';

-- 94. OpenAI Triton
UPDATE companies SET
  description = 'Triton是OpenAI的GPU编程语言，简化高性能计算。',
  detailed_description = 'Triton成立于2021年，是OpenAI的GPU编程语言。总部位于旧金山，员工1000+人。Triton简化GPU编程，使开发者能够编写高效的GPU kernel，无需深入了解CUDA。Triton已被广泛应用于大语言模型训练，提升性能。2024年，Triton获得了广泛的关注，成为GPU编程的热门选择。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://github.com/openai/triton',
  founded_year = 2021,
  employee_count = '1000+人'
WHERE name = 'OpenAI Triton' OR name LIKE '%Triton%';

-- 95. Lightning AI
UPDATE companies SET
  description = 'Lightning AI是PyTorch训练框架，简化深度学习开发。',
  detailed_description = 'Lightning AI成立于2019年，是PyTorch训练框架。总部位于旧金山，员工200-500人。公司开发的Lightning框架简化深度学习开发，自动处理GPU训练、分布式训练等复杂任务。Lightning还提供生产级功能，包括模型检查、实验跟踪等。2024年，Lightning获得了广泛的采用，成为PyTorch开发的热门选择。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://lightning.ai',
  founded_year = 2019,
  employee_count = '200-500人'
WHERE name = 'Lightning AI' OR name LIKE '%Lightning%';

-- 96. ComfyUI
UPDATE companies SET
  description = 'ComfyUI是Stable Diffusion的节点式界面，可视化图像生成流程。',
  detailed_description = 'ComfyUI成立于2023年，是Stable Diffusion的节点式界面。总部位于旧金山，员工10-50人。ComfyUI提供可视化的图像生成流程，通过拖拽节点创建复杂的AI图像生成工作流。ComfyUI已成为AI图像生成的热门工具，被广泛用于艺术创作。2024年，ComfyUI获得了广泛的关注，成为AI图像创作的重要工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://github.com/comfyanonymous/ComfyUI',
  founded_year = 2023,
  employee_count = '10-50人'
WHERE name = 'ComfyUI' OR name LIKE '%ComfyUI%';

-- 97. Invoke AI
UPDATE companies SET
  description = 'Invoke AI是AI图像生成工具，支持多种模型和功能。',
  detailed_description = 'Invoke AI成立于2022年，是AI图像生成工具。总部位于旧金山，员工50-200人。公司开发的工具支持多种AI图像生成模型，包括Stable Diffusion、Midjourney等。Invoke AI提供完整的图像生成工作流，包括模型管理、图像编辑等。2024年，Invoke AI获得了广泛的采用，成为AI图像创作的热门工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.invoke.ai',
  founded_year = 2022,
  employee_count = '50-200人'
WHERE name = 'Invoke AI' OR name LIKE '%Invoke%';

-- 98. Civitai
UPDATE companies SET
  description = 'Civitai是AI模型分享平台，汇聚Stable Diffusion模型和提示词。',
  detailed_description = 'Civitai成立于2022年，是AI模型分享平台。总部位于旧金山，员工100-300人。公司提供的平台汇聚了数万个Stable Diffusion模型和提示词，帮助用户发现和分享AI创作。Civitai已成为AI艺术家的重要社区，推动了AI艺术创作的发展。2024年，Civitai获得了广泛的关注，成为AI艺术社区的核心平台。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://civitai.com',
  founded_year = 2022,
  employee_count = '100-300人'
WHERE name = 'Civitai' OR name LIKE '%Civitai%';

-- 99. Replicate
UPDATE companies SET
  description = 'Replicate是AI模型托管平台，简化模型部署和使用。',
  detailed_description = 'Replicate成立于2021年，是AI模型托管平台。总部位于旧金山，员工100-300人。公司开发的平台简化模型部署和使用，开发者可以轻松部署和分享AI模型。Replicate支持多种AI模型，包括图像生成、文本生成、代码生成等。2024年，Replicate获得了广泛的采用，成为AI模型部署的热门选择。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://replicate.com',
  founded_year = 2021,
  employee_count = '100-300人'
WHERE name = 'Replicate' OR name LIKE '%Replicate%';

-- 100. Brev.dev
UPDATE companies SET
  description = 'Brev.dev是AI云GPU平台，提供按需GPU计算。',
  detailed_description = 'Brev.dev成立于2023年，是AI云GPU平台。总部位于旧金山，员工50-200人。公司开发的平台提供按需GPU计算，使开发者可以轻松访问高性能GPU资源。Brev.dev支持多种AI框架，包括PyTorch、TensorFlow等。2024年，Brev.dev获得了广泛的关注，成为AI开发者的热门选择。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.brev.dev',
  founded_year = 2023,
  employee_count = '50-200人'
WHERE name = 'Brev.dev' OR name LIKE '%Brev%';

-- 101. Vecto
UPDATE companies SET
  description = 'Vecto是AI矢量数据库，简化LLM与数据的集成。',
  detailed_description = 'Vecto成立于2023年，是AI矢量数据库。总部位于旧金山，员工50-200人。公司开发的矢量数据库简化LLM与数据的集成，提供强大的语义搜索能力。Vecto支持多种数据源，包括文档、图像、音频等。2024年，Vecto获得了广泛的关注，成为AI应用的热门基础设施。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.vecto.ai',
  founded_year = 2023,
  employee_count = '50-200人'
WHERE name = 'Vecto' OR name LIKE '%Vecto%';

-- 102. Zilliz
UPDATE companies SET
  description = 'Zilliz是Milvus的母公司，提供向量数据库云服务。',
  detailed_description = 'Zilliz成立于2017年，是Milvus的母公司。总部位于加州弗里蒙特，员工200-500人。公司提供向量数据库云服务，帮助企业构建AI应用。Zilliz的Milvus平台已被广泛应用于图像搜索、推荐系统等场景。2024年，Zilliz继续推动向量数据库技术的发展。',
  headquarters = 'Fremont, California, USA',
  website = 'https://zilliz.com',
  founded_year = 2017,
  employee_count = '200-500人'
WHERE name = 'Zilliz' OR name LIKE '%Zilliz%';

-- 103. SuperAnnotate
UPDATE companies SET
  description = 'SuperAnnotate是AI数据标注平台，加速机器学习项目。',
  detailed_description = 'SuperAnnotate成立于2018年，是AI数据标注平台。总部位于旧金山，员工200-500人。公司开发的平台帮助企业和研究人员快速标注数据，加速机器学习项目。SuperAnnotate支持多种数据类型，包括图像、视频、文本等。2024年，SuperAnnotate获得了广泛的采用，成为ML数据标注的热门工具。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.superannotate.com',
  founded_year = 2018,
  employee_count = '200-500人'
WHERE name = 'SuperAnnotate' OR name LIKE '%SuperAnnotate%';

-- 104. Labelbox
UPDATE companies SET
  description = 'Labelbox是AI数据标注平台，提供企业级数据标注解决方案。',
  detailed_description = 'Labelbox成立于2018年，是AI数据标注平台。总部位于旧金山，员工200-500人。公司开发的平台提供企业级数据标注解决方案，帮助团队协作完成数据标注任务。Labelbox支持多种数据类型和标注工具，已与多家AI公司合作。2024年，Labelbox获得了广泛的采用，成为AI数据标注的领导者。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://labelbox.com',
  founded_year = 2018,
  employee_count = '200-500人'
WHERE name = 'Labelbox' OR name LIKE '%Labelbox%';

-- 105. Scale AI
UPDATE companies SET
  description = 'Scale AI是AI数据平台，为AI训练提供高质量数据。',
  detailed_description = 'Scale AI成立于2016年，是AI数据平台。总部位于旧金山，员工1000-3000人。公司开发的平台为AI训练提供高质量数据，包括图像标注、文本标注、自动驾驶数据等。Scale AI已与OpenAI、Tesla等公司合作，为AI模型训练提供数据支持。2024年，Scale AI估值达到数十亿美元，成为AI数据领域的领导者。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://scale.com',
  founded_year = 2016,
  employee_count = '1000-3000人'
WHERE name = 'Scale AI' OR name LIKE '%Scale AI%';

-- 106. Snorkel AI
UPDATE companies SET
  description = 'Snorkel AI是AI数据平台，使用编程方式创建训练数据。',
  detailed_description = 'Snorkel AI成立于2019年，是AI数据平台。总部位于帕洛阿尔托，员工200-500人。公司开发的平台使用编程方式创建训练数据，通过弱监督学习加速机器学习项目。Snorkel AI已应用于多个企业AI项目，提高了数据标注效率。2024年，Snorkel AI获得了广泛的关注，成为AI数据平台的创新者。',
  headquarters = 'Palo Alto, California, USA',
  website = 'https://www.snorkel.ai',
  founded_year = 2019,
  employee_count = '200-500人'
WHERE name = 'Snorkel AI' OR name LIKE '%Snorkel%';

-- 107. Determined AI (Duplicate)
UPDATE companies SET
  description = 'Determined AI是深度学习训练平台，加速模型训练。',
  detailed_description = 'Determined AI成立于2017年，是深度学习训练平台。总部位于西雅图，员工100-300人。公司开发的平台加速深度学习模型训练，提供分布式训练、自动超参数优化等功能。Determined AI支持PyTorch和TensorFlow，已被HPE收购。2024年，Determined AI继续为企业提供深度学习平台。',
  headquarters = 'Seattle, Washington, USA',
  website = 'https://www.determined.ai',
  founded_year = 2017,
  employee_count = '100-300人'
WHERE name = 'Determined AI Platform' OR name LIKE '%Determined Platform%';

-- 108. Modal
UPDATE companies SET
  description = 'Modal是Python云平台，快速部署AI和机器学习代码。',
  detailed_description = 'Modal成立于2022年，是Python云平台。总部位于旧金山，员工100-300人。公司开发的平台使开发者能够快速部署AI和机器学习代码到云端，无需管理基础设施。Modal支持GPU和CPU计算，提供简单的API。2024年，Modal获得了广泛的关注，成为AI部署的热门平台。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://modal.com',
  founded_year = 2022,
  employee_count = '100-300人'
WHERE name = 'Modal' OR name LIKE '%Modal%';

-- 109. Banana
UPDATE companies SET
  description = 'Banana是机器学习模型部署平台，提供GPU加速推理。',
  detailed_description = 'Banana成立于2022年，是机器学习模型部署平台。总部位于旧金山，员工50-200人。公司开发的平台提供GPU加速推理，使开发者能够快速部署模型到生产环境。Banana支持多种机器学习框架，包括PyTorch、TensorFlow等。2024年，Banana获得了广泛的关注，成为AI部署的热门选择。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.banana.dev',
  founded_year = 2022,
  employee_count = '50-200人'
WHERE name = 'Banana' OR name LIKE '%Banana.dev%';

-- 110. Cerebras
UPDATE companies SET
  description = 'Cerebras是AI芯片公司，开发大规模的AI加速硬件。',
  detailed_description = 'Cerebras成立于2016年，是AI芯片公司。总部位于加州圣何塞，员工500-1000人。公司开发大规模的AI加速硬件，专门用于深度学习训练。Cerebras的Wafer-Scale Engine是最大的AI芯片，加速大模型训练。2024年，Cerebras获得了广泛的关注，成为AI硬件领域的创新者。',
  headquarters = 'Sunnyvale, California, USA',
  website = 'https://www.cerebras.net',
  founded_year = 2016,
  employee_count = '500-1000人'
WHERE name = 'Cerebras' OR name LIKE '%Cerebras%';

-- 111. Cruise
UPDATE companies SET
  description = 'Cruise是自动驾驶公司，开发和部署自动驾驶车辆。',
  detailed_description = 'Cruise成立于2013年，是自动驾驶公司。总部位于旧金山，员工5000+人。公司开发和部署自动驾驶车辆，已在旧金山等地提供商业服务。Cruise的自动驾驶技术基于深度学习和传感器融合。2023年，Cruise被通用汽车收购，继续发展自动驾驶技术。',
  headquarters = 'San Francisco, California, USA',
  website = 'https://www.getcruise.com',
  founded_year = 2013,
  employee_count = '5000+人'
WHERE name = 'Cruise' OR name LIKE '%Cruise%';

-- 112. Waymo
UPDATE companies SET
  description = 'Waymo是Google的自动驾驶子公司，开发高级自动驾驶技术。',
  detailed_description = 'Waymo成立于2009年，是Google的自动驾驶子公司。总部位于山景城，员工5000+人。公司开发高级自动驾驶技术，已在凤凰城等地提供商业服务。Waymo的自动驾驶技术处于行业领先地位。2023年，Waymo继续扩展自动驾驶服务到更多城市。',
  headquarters = 'Mountain View, California, USA',
  website = 'https://waymo.com',
  founded_year = 2009,
  employee_count = '5000+人'
WHERE name = 'Waymo' OR name LIKE '%Waymo%';

-- 113. Argo AI
UPDATE companies SET
  description = 'Argo AI是自动驾驶公司，开发和部署自动驾驶系统。',
  detailed_description = 'Argo AI成立于2016年，是自动驾驶公司。总部位于匹兹堡，员工2000-3000人。公司开发和部署自动驾驶系统，与福特和大众合作。Argo AI的自动驾驶技术基于传感器融合和深度强化学习。2023年，Argo AI专注于自动驾驶技术的商业化。',
  headquarters = 'Pittsburgh, Pennsylvania, USA',
  website = 'https://www.argo.ai',
  founded_year = 2016,
  employee_count = '2000-3000人'
WHERE name = 'Argo AI' OR name LIKE '%Argo%';

-- 114. Pony.ai
UPDATE companies SET
  description = 'Pony.ai是中国自动驾驶公司，开发高级自动驾驶技术。',
  detailed_description = 'Pony.ai成立于2016年，是中国自动驾驶公司。总部位于加州弗里蒙特，员工1000-3000人。公司开发高级自动驾驶技术，已在中国和美国进行测试。Pony.ai的自动驾驶技术基于深度学习和传感器融合。2024年，Pony.ai继续推进自动驾驶技术的商业化。',
  headquarters = 'Fremont, California, USA',
  website = 'https://www.pony.ai',
  founded_year = 2016,
  employee_count = '1000-3000人'
WHERE name = 'Pony.ai' OR name LIKE '%Pony%';

-- 115. Aurora
UPDATE companies SET
  description = 'Aurora是自动驾驶技术公司，开发全面的自动驾驶解决方案。',
  detailed_description = 'Aurora成立于2017年，是自动驾驶技术公司。总部位于匹兹堡，员工2000-3000人。公司开发全面的自动驾驶解决方案，包括感知、规划和控制。Aurora已与丰田、Uber等公司合作。2024年，Aurora继续推进自动驾驶技术的研发和测试。',
  headquarters = 'Pittsburgh, Pennsylvania, USA',
  website = 'https://aurora.tech',
  founded_year = 2017,
  employee_count = '2000-3000人'
WHERE name = 'Aurora' OR name LIKE '%Aurora%';

-- 116. Tencent AI Lab
UPDATE companies SET
  description = '腾讯AI Lab是腾讯的AI研究部门，推动AI技术前沿。',
  detailed_description = '腾讯AI Lab成立于2016年，是腾讯的AI研究部门。总部位于深圳，员工500-1000人。公司专注于计算机视觉、自然语言处理、语音识别等AI技术。腾讯AI Lab在游戏AI、医疗AI等领域有重要贡献。2024年，腾讯AI Lab继续推动AI技术的前沿发展。',
  headquarters = '深圳, 中国',
  website = 'https://ai.tencent.com',
  founded_year = 2016,
  employee_count = '500-1000人'
WHERE name = 'Tencent AI Lab' OR name LIKE '%腾讯AI Lab%';

COMMIT;
