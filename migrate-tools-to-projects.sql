-- 检查当前数据库状态
SELECT 'Current tables:' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- 检查 projects 表结构
SELECT 'Projects table structure:' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查 company_stats 表结构
SELECT 'Company stats table structure:' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'company_stats' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 如果 company_stats 表缺少必要的列，添加它们
DO $$ 
BEGIN
  -- 添加 created_at 列（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'company_stats' 
    AND column_name = 'created_at' 
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.company_stats ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- 添加 updated_at 列（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'company_stats' 
    AND column_name = 'updated_at' 
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.company_stats ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- 检查是否有任何数据需要迁移
SELECT 'Data migration status:' as status;
SELECT 
  (SELECT COUNT(*) FROM companies) as companies_count,
  (SELECT COUNT(*) FROM projects) as projects_count,
  (SELECT COUNT(*) FROM fundings) as fundings_count,
  (SELECT COUNT(*) FROM stories) as stories_count;

-- 如果 projects 表是空的，我们需要生成一些项目数据
-- 为每个公司创建一些示例项目
INSERT INTO projects (
  id,
  company_id,
  name,
  description,
  category,
  website,
  pricing_model,
  launch_date,
  status,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid() as id,
  c.id as company_id,
  CASE 
    WHEN c.name ILIKE '%OpenAI%' THEN 'ChatGPT'
    WHEN c.name ILIKE '%Google%' THEN 'Gemini'
    WHEN c.name ILIKE '%Microsoft%' THEN 'Copilot'
    WHEN c.name ILIKE '%Meta%' THEN 'Llama'
    WHEN c.name ILIKE '%Apple%' THEN 'Siri'
    WHEN c.name ILIKE '%Amazon%' THEN 'Alexa'
    WHEN c.name ILIKE '%Tesla%' THEN 'Autopilot'
    WHEN c.name ILIKE '%NVIDIA%' THEN 'CUDA'
    WHEN c.name ILIKE '%IBM%' THEN 'Watson'
    WHEN c.name ILIKE '%Intel%' THEN 'AI Chips'
    WHEN c.name ILIKE '%Adobe%' THEN 'Firefly'
    WHEN c.name ILIKE '%Salesforce%' THEN 'Einstein'
    WHEN c.name ILIKE '%Oracle%' THEN 'Oracle AI'
    WHEN c.name ILIKE '%SAP%' THEN 'SAP AI'
    WHEN c.name ILIKE '%ServiceNow%' THEN 'ServiceNow AI'
    WHEN c.name ILIKE '%Workday%' THEN 'Workday AI'
    WHEN c.name ILIKE '%Snowflake%' THEN 'Snowflake AI'
    WHEN c.name ILIKE '%Databricks%' THEN 'Databricks AI'
    WHEN c.name ILIKE '%Palantir%' THEN 'Palantir AI'
    WHEN c.name ILIKE '%C3.ai%' THEN 'C3 AI Platform'
    WHEN c.name ILIKE '%UiPath%' THEN 'UiPath RPA'
    WHEN c.name ILIKE '%Automation Anywhere%' THEN 'Automation Anywhere RPA'
    WHEN c.name ILIKE '%Blue Prism%' THEN 'Blue Prism RPA'
    WHEN c.name ILIKE '%Pegasystems%' THEN 'Pega AI'
    WHEN c.name ILIKE '%Appian%' THEN 'Appian AI'
    WHEN c.name ILIKE '%Mendix%' THEN 'Mendix AI'
    WHEN c.name ILIKE '%OutSystems%' THEN 'OutSystems AI'
    WHEN c.name ILIKE '%Zapier%' THEN 'Zapier AI'
    WHEN c.name ILIKE '%Airtable%' THEN 'Airtable AI'
    WHEN c.name ILIKE '%Notion%' THEN 'Notion AI'
    WHEN c.name ILIKE '%Figma%' THEN 'Figma AI'
    WHEN c.name ILIKE '%Canva%' THEN 'Canva AI'
    WHEN c.name ILIKE '%Slack%' THEN 'Slack AI'
    WHEN c.name ILIKE '%Zoom%' THEN 'Zoom AI'
    WHEN c.name ILIKE '%Teams%' THEN 'Teams AI'
    WHEN c.name ILIKE '%Discord%' THEN 'Discord AI'
    WHEN c.name ILIKE '%Twilio%' THEN 'Twilio AI'
    WHEN c.name ILIKE '%SendGrid%' THEN 'SendGrid AI'
    WHEN c.name ILIKE '%Mailchimp%' THEN 'Mailchimp AI'
    WHEN c.name ILIKE '%HubSpot%' THEN 'HubSpot AI'
    WHEN c.name ILIKE '%Marketo%' THEN 'Marketo AI'
    WHEN c.name ILIKE '%Pardot%' THEN 'Pardot AI'
    WHEN c.name ILIKE '%Intercom%' THEN 'Intercom AI'
    WHEN c.name ILIKE '%Zendesk%' THEN 'Zendesk AI'
    WHEN c.name ILIKE '%Freshworks%' THEN 'Freshworks AI'
    WHEN c.name ILIKE '%Monday%' THEN 'Monday.com AI'
    ELSE c.name || ' AI Platform'
  END as name,
  CASE 
    WHEN c.name ILIKE '%OpenAI%' THEN 'Advanced conversational AI system for natural language processing and generation.'
    WHEN c.name ILIKE '%Google%' THEN 'Multimodal AI model for text, image, and code generation.'
    WHEN c.name ILIKE '%Microsoft%' THEN 'AI-powered coding assistant and productivity tool.'
    WHEN c.name ILIKE '%Meta%' THEN 'Open-source large language model for various AI applications.'
    WHEN c.name ILIKE '%Apple%' THEN 'Voice-activated AI assistant for iOS and macOS devices.'
    WHEN c.name ILIKE '%Amazon%' THEN 'Voice-controlled AI assistant for smart home devices.'
    WHEN c.name ILIKE '%Tesla%' THEN 'Autonomous driving system with AI-powered navigation.'
    WHEN c.name ILIKE '%NVIDIA%' THEN 'GPU-accelerated computing platform for AI and machine learning.'
    WHEN c.name ILIKE '%IBM%' THEN 'Enterprise AI platform for business intelligence and automation.'
    WHEN c.name ILIKE '%Intel%' THEN 'AI-optimized processors and chips for machine learning workloads.'
    WHEN c.name ILIKE '%Adobe%' THEN 'AI-powered creative tools for image and video generation.'
    WHEN c.name ILIKE '%Salesforce%' THEN 'AI-powered CRM and business automation platform.'
    WHEN c.name ILIKE '%Oracle%' THEN 'Enterprise AI solutions for database and cloud computing.'
    WHEN c.name ILIKE '%SAP%' THEN 'AI-powered enterprise resource planning and business intelligence.'
    WHEN c.name ILIKE '%ServiceNow%' THEN 'AI-powered IT service management and workflow automation.'
    WHEN c.name ILIKE '%Workday%' THEN 'AI-powered human capital management and financial planning.'
    WHEN c.name ILIKE '%Snowflake%' THEN 'AI-powered cloud data platform for analytics and machine learning.'
    WHEN c.name ILIKE '%Databricks%' THEN 'Unified analytics platform for big data and AI workloads.'
    WHEN c.name ILIKE '%Palantir%' THEN 'AI-powered data analytics platform for government and enterprise.'
    WHEN c.name ILIKE '%C3.ai%' THEN 'Enterprise AI platform for digital transformation and automation.'
    WHEN c.name ILIKE '%UiPath%' THEN 'AI-powered robotic process automation platform.'
    WHEN c.name ILIKE '%Automation Anywhere%' THEN 'Intelligent automation platform for business processes.'
    WHEN c.name ILIKE '%Blue Prism%' THEN 'Digital workforce platform for process automation.'
    WHEN c.name ILIKE '%Pegasystems%' THEN 'AI-powered customer engagement and process automation platform.'
    WHEN c.name ILIKE '%Appian%' THEN 'Low-code automation platform with AI capabilities.'
    WHEN c.name ILIKE '%Mendix%' THEN 'Low-code development platform with AI integration.'
    WHEN c.name ILIKE '%OutSystems%' THEN 'Low-code development platform with AI-powered features.'
    WHEN c.name ILIKE '%Zapier%' THEN 'AI-powered workflow automation and integration platform.'
    WHEN c.name ILIKE '%Airtable%' THEN 'AI-powered database and collaboration platform.'
    WHEN c.name ILIKE '%Notion%' THEN 'AI-powered workspace and productivity platform.'
    WHEN c.name ILIKE '%Figma%' THEN 'AI-powered design and prototyping platform.'
    WHEN c.name ILIKE '%Canva%' THEN 'AI-powered graphic design and content creation platform.'
    WHEN c.name ILIKE '%Slack%' THEN 'AI-powered team communication and collaboration platform.'
    WHEN c.name ILIKE '%Zoom%' THEN 'AI-powered video conferencing and communication platform.'
    WHEN c.name ILIKE '%Teams%' THEN 'AI-powered team collaboration and communication platform.'
    WHEN c.name ILIKE '%Discord%' THEN 'AI-powered community and gaming communication platform.'
    WHEN c.name ILIKE '%Twilio%' THEN 'AI-powered cloud communications platform.'
    WHEN c.name ILIKE '%SendGrid%' THEN 'AI-powered email delivery and marketing platform.'
    WHEN c.name ILIKE '%Mailchimp%' THEN 'AI-powered email marketing and automation platform.'
    WHEN c.name ILIKE '%HubSpot%' THEN 'AI-powered inbound marketing and sales platform.'
    WHEN c.name ILIKE '%Marketo%' THEN 'AI-powered marketing automation and lead management platform.'
    WHEN c.name ILIKE '%Pardot%' THEN 'AI-powered B2B marketing automation platform.'
    WHEN c.name ILIKE '%Intercom%' THEN 'AI-powered customer support and messaging platform.'
    WHEN c.name ILIKE '%Zendesk%' THEN 'AI-powered customer service and support platform.'
    WHEN c.name ILIKE '%Freshworks%' THEN 'AI-powered customer engagement and support platform.'
    WHEN c.name ILIKE '%Monday%' THEN 'AI-powered project management and collaboration platform.'
    ELSE 'AI-powered platform for ' || LOWER(c.name) || ' solutions and services.'
  END as description,
  CASE 
    WHEN c.name ILIKE '%OpenAI%' THEN 'AI Chat'
    WHEN c.name ILIKE '%Google%' THEN 'AI Model'
    WHEN c.name ILIKE '%Microsoft%' THEN 'AI Assistant'
    WHEN c.name ILIKE '%Meta%' THEN 'AI Model'
    WHEN c.name ILIKE '%Apple%' THEN 'AI Assistant'
    WHEN c.name ILIKE '%Amazon%' THEN 'AI Assistant'
    WHEN c.name ILIKE '%Tesla%' THEN 'Autonomous Driving'
    WHEN c.name ILIKE '%NVIDIA%' THEN 'AI Hardware'
    WHEN c.name ILIKE '%IBM%' THEN 'AI Platform'
    WHEN c.name ILIKE '%Intel%' THEN 'AI Hardware'
    WHEN c.name ILIKE '%Adobe%' THEN 'AI Creative'
    WHEN c.name ILIKE '%Salesforce%' THEN 'AI CRM'
    WHEN c.name ILIKE '%Oracle%' THEN 'AI Platform'
    WHEN c.name ILIKE '%SAP%' THEN 'AI ERP'
    WHEN c.name ILIKE '%ServiceNow%' THEN 'AI ITSM'
    WHEN c.name ILIKE '%Workday%' THEN 'AI HCM'
    WHEN c.name ILIKE '%Snowflake%' THEN 'AI Analytics'
    WHEN c.name ILIKE '%Databricks%' THEN 'AI Analytics'
    WHEN c.name ILIKE '%Palantir%' THEN 'AI Analytics'
    WHEN c.name ILIKE '%C3.ai%' THEN 'AI Platform'
    WHEN c.name ILIKE '%UiPath%' THEN 'RPA'
    WHEN c.name ILIKE '%Automation Anywhere%' THEN 'RPA'
    WHEN c.name ILIKE '%Blue Prism%' THEN 'RPA'
    WHEN c.name ILIKE '%Pegasystems%' THEN 'AI Platform'
    WHEN c.name ILIKE '%Appian%' THEN 'Low-Code'
    WHEN c.name ILIKE '%Mendix%' THEN 'Low-Code'
    WHEN c.name ILIKE '%OutSystems%' THEN 'Low-Code'
    WHEN c.name ILIKE '%Zapier%' THEN 'Automation'
    WHEN c.name ILIKE '%Airtable%' THEN 'Database'
    WHEN c.name ILIKE '%Notion%' THEN 'Productivity'
    WHEN c.name ILIKE '%Figma%' THEN 'Design'
    WHEN c.name ILIKE '%Canva%' THEN 'Design'
    WHEN c.name ILIKE '%Slack%' THEN 'Communication'
    WHEN c.name ILIKE '%Zoom%' THEN 'Communication'
    WHEN c.name ILIKE '%Teams%' THEN 'Communication'
    WHEN c.name ILIKE '%Discord%' THEN 'Communication'
    WHEN c.name ILIKE '%Twilio%' THEN 'Communication'
    WHEN c.name ILIKE '%SendGrid%' THEN 'Email'
    WHEN c.name ILIKE '%Mailchimp%' THEN 'Email'
    WHEN c.name ILIKE '%HubSpot%' THEN 'Marketing'
    WHEN c.name ILIKE '%Marketo%' THEN 'Marketing'
    WHEN c.name ILIKE '%Pardot%' THEN 'Marketing'
    WHEN c.name ILIKE '%Intercom%' THEN 'Support'
    WHEN c.name ILIKE '%Zendesk%' THEN 'Support'
    WHEN c.name ILIKE '%Freshworks%' THEN 'Support'
    WHEN c.name ILIKE '%Monday%' THEN 'Project Management'
    ELSE 'AI Platform'
  END as category,
  CASE 
    WHEN c.name ILIKE '%OpenAI%' THEN 'https://chat.openai.com'
    WHEN c.name ILIKE '%Google%' THEN 'https://gemini.google.com'
    WHEN c.name ILIKE '%Microsoft%' THEN 'https://copilot.microsoft.com'
    WHEN c.name ILIKE '%Meta%' THEN 'https://llama.meta.com'
    WHEN c.name ILIKE '%Apple%' THEN 'https://siri.apple.com'
    WHEN c.name ILIKE '%Amazon%' THEN 'https://alexa.amazon.com'
    WHEN c.name ILIKE '%Tesla%' THEN 'https://tesla.com/autopilot'
    WHEN c.name ILIKE '%NVIDIA%' THEN 'https://developer.nvidia.com/cuda'
    WHEN c.name ILIKE '%IBM%' THEN 'https://watson.ibm.com'
    WHEN c.name ILIKE '%Intel%' THEN 'https://intel.com/ai'
    WHEN c.name ILIKE '%Adobe%' THEN 'https://firefly.adobe.com'
    WHEN c.name ILIKE '%Salesforce%' THEN 'https://einstein.salesforce.com'
    WHEN c.name ILIKE '%Oracle%' THEN 'https://oracle.com/ai'
    WHEN c.name ILIKE '%SAP%' THEN 'https://sap.com/ai'
    WHEN c.name ILIKE '%ServiceNow%' THEN 'https://servicenow.com/ai'
    WHEN c.name ILIKE '%Workday%' THEN 'https://workday.com/ai'
    WHEN c.name ILIKE '%Snowflake%' THEN 'https://snowflake.com/ai'
    WHEN c.name ILIKE '%Databricks%' THEN 'https://databricks.com/ai'
    WHEN c.name ILIKE '%Palantir%' THEN 'https://palantir.com/ai'
    WHEN c.name ILIKE '%C3.ai%' THEN 'https://c3.ai/platform'
    WHEN c.name ILIKE '%UiPath%' THEN 'https://uipath.com/rpa'
    WHEN c.name ILIKE '%Automation Anywhere%' THEN 'https://automationanywhere.com'
    WHEN c.name ILIKE '%Blue Prism%' THEN 'https://blueprism.com'
    WHEN c.name ILIKE '%Pegasystems%' THEN 'https://pega.com/ai'
    WHEN c.name ILIKE '%Appian%' THEN 'https://appian.com/ai'
    WHEN c.name ILIKE '%Mendix%' THEN 'https://mendix.com/ai'
    WHEN c.name ILIKE '%OutSystems%' THEN 'https://outsystems.com/ai'
    WHEN c.name ILIKE '%Zapier%' THEN 'https://zapier.com/ai'
    WHEN c.name ILIKE '%Airtable%' THEN 'https://airtable.com/ai'
    WHEN c.name ILIKE '%Notion%' THEN 'https://notion.so/ai'
    WHEN c.name ILIKE '%Figma%' THEN 'https://figma.com/ai'
    WHEN c.name ILIKE '%Canva%' THEN 'https://canva.com/ai'
    WHEN c.name ILIKE '%Slack%' THEN 'https://slack.com/ai'
    WHEN c.name ILIKE '%Zoom%' THEN 'https://zoom.us/ai'
    WHEN c.name ILIKE '%Teams%' THEN 'https://teams.microsoft.com/ai'
    WHEN c.name ILIKE '%Discord%' THEN 'https://discord.com/ai'
    WHEN c.name ILIKE '%Twilio%' THEN 'https://twilio.com/ai'
    WHEN c.name ILIKE '%SendGrid%' THEN 'https://sendgrid.com/ai'
    WHEN c.name ILIKE '%Mailchimp%' THEN 'https://mailchimp.com/ai'
    WHEN c.name ILIKE '%HubSpot%' THEN 'https://hubspot.com/ai'
    WHEN c.name ILIKE '%Marketo%' THEN 'https://marketo.com/ai'
    WHEN c.name ILIKE '%Pardot%' THEN 'https://pardot.com/ai'
    WHEN c.name ILIKE '%Intercom%' THEN 'https://intercom.com/ai'
    WHEN c.name ILIKE '%Zendesk%' THEN 'https://zendesk.com/ai'
    WHEN c.name ILIKE '%Freshworks%' THEN 'https://freshworks.com/ai'
    WHEN c.name ILIKE '%Monday%' THEN 'https://monday.com/ai'
    ELSE c.website
  END as website,
  'Freemium' as pricing_model,
  '2023-01-01' as launch_date,
  'Active' as status,
  NOW() as created_at,
  NOW() as updated_at
FROM companies c
WHERE NOT EXISTS (
  SELECT 1 FROM projects p WHERE p.company_id = c.id
);

-- 验证插入结果
SELECT 'Migration completed. Projects count:' as status;
SELECT COUNT(*) as projects_count FROM projects;

-- 显示一些示例数据
SELECT 'Sample projects:' as status;
SELECT p.name, p.category, c.name as company_name
FROM projects p
JOIN companies c ON p.company_id = c.id
ORDER BY c.name
LIMIT 10;
