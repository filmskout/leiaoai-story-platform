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

COMMIT;
