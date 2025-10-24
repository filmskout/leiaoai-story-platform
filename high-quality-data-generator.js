import https from 'https';
import fs from 'fs';

// 环境变量配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

// 200+ AI公司列表（全球知名公司）
const AI_COMPANIES = [
  // 美国AI巨头
  { name: "OpenAI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Google DeepMind", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Microsoft AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Meta AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Apple AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Amazon AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Tesla AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "NVIDIA", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "IBM Watson", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Intel AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Adobe AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Salesforce Einstein", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Oracle AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "SAP AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "ServiceNow AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Workday AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Snowflake AI", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Databricks", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "Palantir", country: "US", category: "AI Giant", tier: "Tier 1" },
  { name: "C3.ai", country: "US", category: "AI Giant", tier: "Tier 1" },

  // 美国AI独角兽
  { name: "Anthropic", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Cohere", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Scale AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Hugging Face", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Stability AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Midjourney", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Character.AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Runway", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Jasper AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Copy.ai", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Grammarly", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Notion AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Figma AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Canva AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Zapier AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Airtable AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Monday.com AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Slack AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Zoom AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Discord AI", country: "US", category: "AI Unicorn", tier: "Tier 2" },

  // 美国AI工具公司
  { name: "UiPath", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Automation Anywhere", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Blue Prism", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Pegasystems", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Appian", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Mendix", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "OutSystems", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Twilio AI", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "SendGrid AI", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Mailchimp AI", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "HubSpot AI", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Marketo AI", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Pardot AI", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Intercom AI", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Zendesk AI", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Freshworks AI", country: "US", category: "AI Tools", tier: "Independent" },

  // 中国AI巨头
  { name: "百度AI", country: "CN", category: "Domestic Giant", tier: "Tier 1" },
  { name: "腾讯AI", country: "CN", category: "Domestic Giant", tier: "Tier 1" },
  { name: "阿里巴巴AI", country: "CN", category: "Domestic Giant", tier: "Tier 1" },
  { name: "字节跳动AI", country: "CN", category: "Domestic Giant", tier: "Tier 1" },
  { name: "华为AI", country: "CN", category: "Domestic Giant", tier: "Tier 1" },
  { name: "小米AI", country: "CN", category: "Domestic Giant", tier: "Tier 1" },
  { name: "京东AI", country: "CN", category: "Domestic Giant", tier: "Tier 1" },
  { name: "美团AI", country: "CN", category: "Domestic Giant", tier: "Tier 1" },
  { name: "滴滴AI", country: "CN", category: "Domestic Giant", tier: "Tier 1" },
  { name: "快手AI", country: "CN", category: "Domestic Giant", tier: "Tier 1" },

  // 中国AI独角兽
  { name: "商汤科技", country: "CN", category: "Domestic Unicorn", tier: "Tier 2" },
  { name: "旷视科技", country: "CN", category: "Domestic Unicorn", tier: "Tier 2" },
  { name: "依图科技", country: "CN", category: "Domestic Unicorn", tier: "Tier 2" },
  { name: "云从科技", country: "CN", category: "Domestic Unicorn", tier: "Tier 2" },
  { name: "第四范式", country: "CN", category: "Domestic Unicorn", tier: "Tier 2" },
  { name: "明略科技", country: "CN", category: "Domestic Unicorn", tier: "Tier 2" },
  { name: "思必驰", country: "CN", category: "Domestic Unicorn", tier: "Tier 2" },
  { name: "小i机器人", country: "CN", category: "Domestic Unicorn", tier: "Tier 2" },
  { name: "达观数据", country: "CN", category: "Domestic Unicorn", tier: "Tier 2" },
  { name: "容联云通讯", country: "CN", category: "Domestic Unicorn", tier: "Tier 2" },

  // 欧洲AI公司
  { name: "DeepMind", country: "UK", category: "AI Giant", tier: "Tier 1" },
  { name: "Aleph Alpha", country: "DE", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Mistral AI", country: "FR", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Cohere", country: "UK", category: "AI Unicorn", tier: "Tier 2" },
  { name: "Graphcore", country: "UK", category: "AI Tools", tier: "Independent" },
  { name: "Darktrace", country: "UK", category: "AI Tools", tier: "Independent" },
  { name: "SAS", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Teradata", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Informatica", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Talend", country: "FR", category: "AI Tools", tier: "Independent" },

  // 亚洲其他AI公司
  { name: "Samsung AI", country: "KR", category: "AI Giant", tier: "Tier 1" },
  { name: "LG AI", country: "KR", category: "AI Giant", tier: "Tier 1" },
  { name: "SoftBank AI", country: "JP", category: "AI Giant", tier: "Tier 1" },
  { name: "Sony AI", country: "JP", category: "AI Giant", tier: "Tier 1" },
  { name: "Panasonic AI", country: "JP", category: "AI Giant", tier: "Tier 1" },
  { name: "NEC AI", country: "JP", category: "AI Giant", tier: "Tier 1" },
  { name: "Fujitsu AI", country: "JP", category: "AI Giant", tier: "Tier 1" },
  { name: "Hitachi AI", country: "JP", category: "AI Giant", tier: "Tier 1" },
  { name: "Toshiba AI", country: "JP", category: "AI Giant", tier: "Tier 1" },
  { name: "Canon AI", country: "JP", category: "AI Giant", tier: "Tier 1" },

  // 新兴AI公司
  { name: "Perplexity AI", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Claude AI", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Inflection AI", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Adept AI", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Replit AI", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Cursor AI", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "GitHub Copilot", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Tabnine", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Kite", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "CodeT5", country: "US", category: "AI Applications", tier: "Emerging" },

  // 更多AI工具公司
  { name: "DataRobot", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "H2O.ai", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Domino Data Lab", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Weights & Biases", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "MLflow", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Kubeflow", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Ray", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Dask", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Apache Spark", country: "US", category: "AI Tools", tier: "Independent" },
  { name: "Apache Kafka", country: "US", category: "AI Tools", tier: "Independent" },

  // 更多AI应用公司
  { name: "Luma AI", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Pika Labs", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Synthesia", country: "UK", category: "AI Applications", tier: "Emerging" },
  { name: "D-ID", country: "IL", category: "AI Applications", tier: "Emerging" },
  { name: "HeyGen", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Murf", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "ElevenLabs", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Descript", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Otter.ai", country: "US", category: "AI Applications", tier: "Emerging" },
  { name: "Rev.ai", country: "US", category: "AI Applications", tier: "Emerging" },

  // 更多AI硬件公司
  { name: "Cerebras", country: "US", category: "AI Hardware", tier: "Independent" },
  { name: "SambaNova", country: "US", category: "AI Hardware", tier: "Independent" },
  { name: "Groq", country: "US", category: "AI Hardware", tier: "Independent" },
  { name: "Mythic", country: "US", category: "AI Hardware", tier: "Independent" },
  { name: "Kneron", country: "US", category: "AI Hardware", tier: "Independent" },
  { name: "Hailo", country: "IL", category: "AI Hardware", tier: "Independent" },
  { name: "Horizon Robotics", country: "CN", category: "AI Hardware", tier: "Independent" },
  { name: "Cambricon", country: "CN", category: "AI Hardware", tier: "Independent" },
  { name: "Barefoot Networks", country: "US", category: "AI Hardware", tier: "Independent" },
  { name: "Barefoot Networks", country: "US", category: "AI Hardware", tier: "Independent" },

  // 更多AI平台公司
  { name: "Dataiku", country: "US", category: "AI Platform", tier: "Independent" },
  { name: "Alteryx", country: "US", category: "AI Platform", tier: "Independent" },
  { name: "RapidMiner", country: "US", category: "AI Platform", tier: "Independent" },
  { name: "KNIME", country: "DE", category: "AI Platform", tier: "Independent" },
  { name: "Orange", country: "SI", category: "AI Platform", tier: "Independent" },
  { name: "Weka", country: "NZ", category: "AI Platform", tier: "Independent" },
  { name: "Scikit-learn", country: "FR", category: "AI Platform", tier: "Independent" },
  { name: "TensorFlow", country: "US", category: "AI Platform", tier: "Independent" },
  { name: "PyTorch", country: "US", category: "AI Platform", tier: "Independent" },
  { name: "Keras", country: "US", category: "AI Platform", tier: "Independent" },

  // 更多AI安全公司
  { name: "Darktrace", country: "UK", category: "AI Security", tier: "Independent" },
  { name: "CrowdStrike", country: "US", category: "AI Security", tier: "Independent" },
  { name: "SentinelOne", country: "US", category: "AI Security", tier: "Independent" },
  { name: "Vectra AI", country: "US", category: "AI Security", tier: "Independent" },
  { name: "Securonix", country: "US", category: "AI Security", tier: "Independent" },
  { name: "Exabeam", country: "US", category: "AI Security", tier: "Independent" },
  { name: "Splunk", country: "US", category: "AI Security", tier: "Independent" },
  { name: "Elastic", country: "US", category: "AI Security", tier: "Independent" },
  { name: "LogRhythm", country: "US", category: "AI Security", tier: "Independent" },
  { name: "QRadar", country: "US", category: "AI Security", tier: "Independent" },

  // 更多AI医疗公司
  { name: "PathAI", country: "US", category: "AI Healthcare", tier: "Independent" },
  { name: "Tempus", country: "US", category: "AI Healthcare", tier: "Independent" },
  { name: "Flatiron Health", country: "US", category: "AI Healthcare", tier: "Independent" },
  { name: "Veracyte", country: "US", category: "AI Healthcare", tier: "Independent" },
  { name: "Paige", country: "US", category: "AI Healthcare", tier: "Independent" },
  { name: "Arterys", country: "US", category: "AI Healthcare", tier: "Independent" },
  { name: "Zebra Medical", country: "IL", category: "AI Healthcare", tier: "Independent" },
  { name: "Aidoc", country: "IL", category: "AI Healthcare", tier: "Independent" },
  { name: "Butterfly Network", country: "US", category: "AI Healthcare", tier: "Independent" },
  { name: "Caption Health", country: "US", category: "AI Healthcare", tier: "Independent" },

  // 更多AI金融公司
  { name: "Kensho", country: "US", category: "AI Finance", tier: "Independent" },
  { name: "Ayasdi", country: "US", category: "AI Finance", tier: "Independent" },
  { name: "DataRobot", country: "US", category: "AI Finance", tier: "Independent" },
  { name: "H2O.ai", country: "US", category: "AI Finance", tier: "Independent" },
  { name: "Domino Data Lab", country: "US", category: "AI Finance", tier: "Independent" },
  { name: "Weights & Biases", country: "US", category: "AI Finance", tier: "Independent" },
  { name: "MLflow", country: "US", category: "AI Finance", tier: "Independent" },
  { name: "Kubeflow", country: "US", category: "AI Finance", tier: "Independent" },
  { name: "Ray", country: "US", category: "AI Finance", tier: "Independent" },
  { name: "Dask", country: "US", category: "AI Finance", tier: "Independent" },

  // 更多AI教育公司
  { name: "Coursera", country: "US", category: "AI Education", tier: "Independent" },
  { name: "Udacity", country: "US", category: "AI Education", tier: "Independent" },
  { name: "edX", country: "US", category: "AI Education", tier: "Independent" },
  { name: "Khan Academy", country: "US", category: "AI Education", tier: "Independent" },
  { name: "Duolingo", country: "US", category: "AI Education", tier: "Independent" },
  { name: "Babbel", country: "DE", category: "AI Education", tier: "Independent" },
  { name: "Rosetta Stone", country: "US", category: "AI Education", tier: "Independent" },
  { name: "Memrise", country: "UK", category: "AI Education", tier: "Independent" },
  { name: "Busuu", country: "UK", category: "AI Education", tier: "Independent" },
  { name: "Lingoda", country: "DE", category: "AI Education", tier: "Independent" },

  // 更多AI游戏公司
  { name: "Unity AI", country: "US", category: "AI Gaming", tier: "Independent" },
  { name: "Unreal Engine AI", country: "US", category: "AI Gaming", tier: "Independent" },
  { name: "CryEngine AI", country: "DE", category: "AI Gaming", tier: "Independent" },
  { name: "Godot AI", country: "AR", category: "AI Gaming", tier: "Independent" },
  { name: "Blender AI", country: "NL", category: "AI Gaming", tier: "Independent" },
  { name: "Maya AI", country: "US", category: "AI Gaming", tier: "Independent" },
  { name: "3ds Max AI", country: "US", category: "AI Gaming", tier: "Independent" },
  { name: "Cinema 4D AI", country: "DE", category: "AI Gaming", tier: "Independent" },
  { name: "Houdini AI", country: "CA", category: "AI Gaming", tier: "Independent" },
  { name: "ZBrush AI", country: "US", category: "AI Gaming", tier: "Independent" }
];

// DeepSeek API调用函数
async function callDeepSeek(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert AI industry analyst with deep knowledge of global AI companies, their products, funding, valuations, and market positions. Provide accurate, detailed, and up-to-date information."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const options = {
      hostname: 'api.deepseek.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error('Invalid response format'));
          }
        } catch (error) {
          reject(new Error(`JSON parse error: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(data);
    req.end();
  });
}

// 生成公司详细信息
async function generateCompanyDetails(company) {
  const prompt = `请为AI公司"${company.name}"生成详细的真实信息。请提供：

1. 公司基本信息：
   - 真实的总部地址（不是模板化的）
   - 成立年份
   - 员工数量范围
   - 真实估值（基于公开信息）

2. 公司描述：
   - 简短描述（50字以内）：公司的核心AI产品和方向
   - 详细描述（400-600字）：完整介绍公司背景、主要产品、技术优势、市场地位

3. 官方网站：
   - 真实的公司官网URL

4. 主要AI项目/产品：
   - 列出3-5个真实的主要AI产品或项目
   - 每个产品包含：名称、描述、类别、官网链接

5. 融资信息：
   - 最近2-3轮融资的详细信息
   - 包括：轮次、金额、估值、投资方、日期

6. 行业标签：
   - 3-5个相关的AI技术标签

请确保所有信息都是真实、准确、最新的。不要使用模板化的描述。

请以JSON格式返回，结构如下：
{
  "name": "${company.name}",
  "description": "简短描述",
  "detailed_description": "详细描述",
  "headquarters": "真实总部地址",
  "founded_year": 年份,
  "employee_count_range": "员工数量范围",
  "valuation_usd": 估值数字,
  "website": "官网URL",
  "industry_tags": ["标签1", "标签2", "标签3"],
  "projects": [
    {
      "name": "产品名称",
      "description": "产品描述",
      "category": "产品类别",
      "website": "产品官网"
    }
  ],
  "fundings": [
    {
      "round": "轮次",
      "amount_usd": 金额,
      "valuation_usd": 估值,
      "investors": ["投资方1", "投资方2"],
      "date": "日期"
    }
  ]
}`;

  try {
    console.log(`🔍 正在生成 ${company.name} 的详细信息...`);
    const response = await callDeepSeek(prompt);
    
    // 清理JSON响应
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const companyData = JSON.parse(jsonStr);
      
      // 添加分类信息
      companyData.company_type = company.category;
      companyData.company_tier = company.tier;
      companyData.company_category = company.category;
      
      console.log(`✅ ${company.name} 信息生成成功`);
      return companyData;
    } else {
      throw new Error('No valid JSON found in response');
    }
  } catch (error) {
    console.error(`❌ ${company.name} 信息生成失败:`, error.message);
    return null;
  }
}

// 插入公司数据到数据库
async function insertCompanyData(companyData) {
  try {
    // 插入公司信息
    const companyResponse = await fetch(`${SUPABASE_URL}/rest/v1/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        name: companyData.name,
        description: companyData.description,
        detailed_description: companyData.detailed_description,
        headquarters: companyData.headquarters,
        founded_year: companyData.founded_year,
        employee_count_range: companyData.employee_count_range,
        valuation_usd: companyData.valuation_usd,
        website: companyData.website,
        industry_tags: companyData.industry_tags,
        company_type: companyData.company_type,
        company_tier: companyData.company_tier,
        company_category: companyData.company_category
      })
    });

    if (!companyResponse.ok) {
      throw new Error(`Company insert failed: ${companyResponse.statusText}`);
    }

    const company = await companyResponse.json();
    console.log(`✅ 公司 ${companyData.name} 插入成功，ID: ${company.id}`);

    // 插入项目信息
    if (companyData.projects && companyData.projects.length > 0) {
      for (const project of companyData.projects) {
        const projectResponse = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            company_id: company.id,
            name: project.name,
            description: project.description,
            category: project.category,
            website: project.website,
            pricing_model: 'Freemium',
            launch_date: '2023-01-01',
            status: 'Active'
          })
        });

        if (projectResponse.ok) {
          console.log(`✅ 项目 ${project.name} 插入成功`);
        } else {
          console.error(`❌ 项目 ${project.name} 插入失败:`, projectResponse.statusText);
        }
      }
    }

    // 插入融资信息
    if (companyData.fundings && companyData.fundings.length > 0) {
      for (const funding of companyData.fundings) {
        const fundingResponse = await fetch(`${SUPABASE_URL}/rest/v1/fundings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            company_id: company.id,
            round: funding.round,
            amount_usd: funding.amount_usd,
            valuation_usd: funding.valuation_usd,
            investors: funding.investors,
            date: funding.date
          })
        });

        if (fundingResponse.ok) {
          console.log(`✅ 融资 ${funding.round} 插入成功`);
        } else {
          console.error(`❌ 融资 ${funding.round} 插入失败:`, fundingResponse.statusText);
        }
      }
    }

    return company.id;
  } catch (error) {
    console.error(`❌ 插入公司数据失败:`, error.message);
    return null;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始生成高质量AI公司数据...');
  console.log(`📊 总共需要处理 ${AI_COMPANIES.length} 家公司`);

  if (!DEEPSEEK_API_KEY) {
    console.error('❌ 未找到 DEEPSEEK_API_KEY 环境变量');
    process.exit(1);
  }

  // 清空现有数据
  console.log('🧹 清空现有数据...');
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/companies`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    console.log('✅ 现有数据已清空');
  } catch (error) {
    console.error('❌ 清空数据失败:', error.message);
  }

  let successCount = 0;
  let failCount = 0;

  // 分批处理公司
  const batchSize = 5;
  for (let i = 0; i < AI_COMPANIES.length; i += batchSize) {
    const batch = AI_COMPANIES.slice(i, i + batchSize);
    console.log(`\n📦 处理批次 ${Math.floor(i/batchSize) + 1}/${Math.ceil(AI_COMPANIES.length/batchSize)}`);
    
    const promises = batch.map(async (company) => {
      try {
        const companyData = await generateCompanyDetails(company);
        if (companyData) {
          const companyId = await insertCompanyData(companyData);
          if (companyId) {
            successCount++;
            return { success: true, name: company.name };
          }
        }
        failCount++;
        return { success: false, name: company.name };
      } catch (error) {
        console.error(`❌ 处理 ${company.name} 失败:`, error.message);
        failCount++;
        return { success: false, name: company.name };
      }
    });

    const results = await Promise.all(promises);
    
    // 显示批次结果
    results.forEach(result => {
      if (result.success) {
        console.log(`✅ ${result.name}`);
      } else {
        console.log(`❌ ${result.name}`);
      }
    });

    // 批次间延迟
    if (i + batchSize < AI_COMPANIES.length) {
      console.log('⏳ 等待 10 秒后处理下一批次...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  console.log('\n🎉 数据生成完成！');
  console.log(`✅ 成功: ${successCount} 家公司`);
  console.log(`❌ 失败: ${failCount} 家公司`);
  console.log(`📊 总计: ${AI_COMPANIES.length} 家公司`);
}

// 运行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };
