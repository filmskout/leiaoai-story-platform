// 优化的批量数据生成脚本
// 多模型协作，token优化，批量处理

import https from 'https';
import fs from 'fs';

// 环境变量配置
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const QWEN_API_KEY = process.env.QWEN_API_KEY;

// 公司分类和优先级
const COMPANY_TIERS = {
  'Tier 1 - AI巨头': [
    'OpenAI', 'Anthropic', 'Google DeepMind', 'Microsoft AI', 'Meta AI',
    'Tesla AI', 'NVIDIA', 'Intel AI', 'IBM Watson', 'Amazon AI',
    'Apple AI', 'Salesforce Einstein', 'Adobe AI', 'Oracle AI', 'SAP AI',
    'Palantir', 'Databricks', 'Snowflake', 'Hugging Face', 'Stability AI'
  ],
  'Tier 2 - AI独角兽': [
    'Midjourney', 'Runway', 'Character.AI', 'Jasper', 'Copy.ai',
    'Grammarly', 'Notion AI', 'Figma AI', 'Canva AI', 'Zapier AI',
    'Cohere', 'Mistral AI', 'Aleph Alpha', 'Scale AI', 'Labelbox',
    'DeepL', 'Replika', 'Synthesia', 'Graphcore', 'Improbable',
    'Darktrace', 'Onfido', 'Tractable', 'Element AI', 'Layer 6 AI',
    'Deep Genomics', 'BlueDot', 'Alchemy', 'Infura', 'QuickNode',
    'Moralis', 'Thirdweb', 'SuperAnnotate', 'Hive', 'Appen',
    'Babbel', 'Lingoda', 'HubSpot AI', 'Mailchimp AI', 'Shopify AI',
    'Stripe AI', 'Square AI', 'PayPal AI', 'Venmo AI', 'Cash App AI',
    'Robinhood AI', 'Coinbase AI', 'Binance AI', 'Kraken AI', 'Gemini AI'
  ],
  'Tier 3 - AI工具公司': [
    'Crypto.com AI', 'FTX AI', 'Notion', 'Figma', 'Canva',
    'Zapier', 'Airtable', 'Monday.com', 'Asana', 'Trello',
    'Slack', 'Discord', 'Zoom', 'Teams', 'Google Workspace',
    'Microsoft 365', 'Dropbox', 'Box', 'OneDrive', 'iCloud',
    'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence',
    'Linear', 'Notion', 'Obsidian', 'Roam Research', 'LogSeq',
    'Craft', 'Bear', 'Ulysses', 'Scrivener', 'Final Draft',
    'Procreate', 'Sketch', 'Adobe Creative Suite', 'Figma', 'Canva'
  ],
  'Tier 4 - AI应用公司': [
    'Grammarly', 'Hemingway', 'ProWritingAid', 'Ginger', 'LanguageTool',
    'DeepL', 'Google Translate', 'Microsoft Translator', 'Amazon Translate',
    'Reverso', 'Linguee', 'PONS', 'Collins', 'Oxford', 'Cambridge',
    'Duolingo', 'Babbel', 'Rosetta Stone', 'Busuu', 'Memrise',
    'Anki', 'Quizlet', 'Kahoot', 'Mentimeter', 'Poll Everywhere',
    'Typeform', 'SurveyMonkey', 'Google Forms', 'Microsoft Forms', 'JotForm',
    'Calendly', 'Acuity Scheduling', 'When2meet', 'Doodle', 'WhenIsGood',
    'Buffer', 'Hootsuite', 'Sprout Social', 'Later', 'Planoly'
  ]
};

// 生成统计
let generationStats = {
  totalCompanies: 0,
  completed: 0,
  failed: 0,
  projectsGenerated: 0,
  fundingsGenerated: 0,
  storiesGenerated: 0,
  startTime: new Date(),
  errors: []
};

// API调用函数
async function callAPI(url, options, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(new Error(`JSON解析失败: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// DeepSeek API调用
async function callDeepSeek(prompt, maxTokens = 4000) {
  const url = 'https://api.deepseek.com/v1/chat/completions';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的AI行业分析师，擅长生成准确、详细的AI公司信息。请使用深度研究模式，提供真实、准确的数据。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
      stream: false
    })
  };

  try {
    const response = await callAPI(url, options);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API调用失败:', error.message);
    throw error;
  }
}

// OpenAI API调用
async function callOpenAI(prompt, maxTokens = 4000) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的AI行业分析师，擅长生成高质量、准确的AI公司信息。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
      stream: false
    })
  };

  try {
    const response = await callAPI(url, options);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API调用失败:', error.message);
    throw error;
  }
}

// 生成公司详细信息
async function generateCompanyDetails(companyName, tier) {
  const prompt = `
请为AI公司"${companyName}"生成详细的英文信息。请使用深度研究模式，提供真实、准确的数据。

要求：
1. 公司基本信息：成立年份、总部位置、员工规模、官方网站
2. 公司描述：50字以内的简短描述 + 400-600字的详细描述
3. 市场估值：最新估值（美元）
4. 行业标签：相关AI领域标签

请以JSON格式返回：
{
  "name": "${companyName}",
  "description": "简短描述（50字以内）",
  "detailed_description": "详细描述（400-600字）",
  "founded_year": 年份,
  "headquarters": "总部位置",
  "website": "官方网站URL",
  "employee_count_range": "员工规模范围",
  "valuation_usd": 估值数字,
  "industry_tags": ["标签1", "标签2", "标签3"]
}
`;

  try {
    const response = await callDeepSeek(prompt);
    const cleanedResponse = cleanJSONResponse(response);
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error(`生成公司详情失败: ${companyName}`, error.message);
    // 回退到OpenAI
    try {
      const response = await callOpenAI(prompt);
      const cleanedResponse = cleanJSONResponse(response);
      return JSON.parse(cleanedResponse);
    } catch (fallbackError) {
      console.error(`OpenAI回退也失败: ${companyName}`, fallbackError.message);
      throw fallbackError;
    }
  }
}

// 生成项目信息
async function generateProjects(companyName, companyId) {
  const prompt = `
请为AI公司"${companyName}"生成3-5个主要AI项目/产品的详细信息。

要求：
1. 项目名称：准确的产品名称
2. 项目描述：详细的功能描述
3. 项目类型：AI产品类型
4. 目标用户：主要用户群体
5. 技术栈：使用的技术
6. 用例：具体应用场景
7. 定价模式：免费/付费模式
8. 状态：活跃/测试/已停用

请以JSON数组格式返回：
[
  {
    "name": "项目名称",
    "description": "项目描述",
    "url": "项目URL",
    "website": "项目网站",
    "category": "AI项目分类",
    "project_type": "项目类型",
    "target_audience": "目标用户",
    "technology_stack": ["技术1", "技术2"],
    "use_cases": ["用例1", "用例2"],
    "pricing_model": "定价模式",
    "status": "Active"
  }
]
`;

  try {
    const response = await callDeepSeek(prompt);
    const cleanedResponse = cleanJSONResponse(response);
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error(`生成项目失败: ${companyName}`, error.message);
    throw error;
  }
}

// 生成融资信息
async function generateFunding(companyName) {
  const prompt = `
请为AI公司"${companyName}"生成最近3轮融资的详细信息。

要求：
1. 融资轮次：种子轮/A轮/B轮/C轮/D轮/E轮/IPO等
2. 融资金额：具体金额（美元）
3. 投资方：主要投资方
4. 融资日期：大概日期
5. 公司估值：融资后估值

请以JSON数组格式返回：
[
  {
    "round": "融资轮次",
    "amount_usd": 融资金额数字,
    "investors": "投资方",
    "date": "YYYY-MM-DD",
    "valuation_usd": 估值数字
  }
]
`;

  try {
    const response = await callDeepSeek(prompt);
    const cleanedResponse = cleanJSONResponse(response);
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error(`生成融资信息失败: ${companyName}`, error.message);
    throw error;
  }
}

// 生成新闻故事
async function generateStories(companyName) {
  const prompt = `
请为AI公司"${companyName}"生成2-3个基于真实新闻的AI故事。

要求：
1. 故事标题：吸引人的标题
2. 故事内容：基于真实新闻的详细内容
3. 新闻来源：真实的主流媒体
4. 发布日期：大概日期
5. 故事类型：技术突破/融资新闻/产品发布/合作消息等

请以JSON数组格式返回：
[
  {
    "title": "故事标题",
    "content": "故事内容（300-500字）",
    "source_url": "新闻源URL",
    "published_date": "YYYY-MM-DD",
    "category": "故事类型"
  }
]
`;

  try {
    const response = await callDeepSeek(prompt);
    const cleanedResponse = cleanJSONResponse(response);
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error(`生成新闻故事失败: ${companyName}`, error.message);
    throw error;
  }
}

// 清理JSON响应
function cleanJSONResponse(response) {
  // 移除可能的非JSON内容
  const jsonStart = response.indexOf('{');
  const jsonArrayStart = response.indexOf('[');
  
  let startIndex = -1;
  if (jsonStart !== -1 && jsonArrayStart !== -1) {
    startIndex = Math.min(jsonStart, jsonArrayStart);
  } else if (jsonStart !== -1) {
    startIndex = jsonStart;
  } else if (jsonArrayStart !== -1) {
    startIndex = jsonArrayStart;
  }
  
  if (startIndex !== -1) {
    response = response.substring(startIndex);
  }
  
  // 找到JSON结束位置
  let braceCount = 0;
  let bracketCount = 0;
  let endIndex = response.length;
  
  for (let i = 0; i < response.length; i++) {
    if (response[i] === '{') braceCount++;
    if (response[i] === '}') braceCount--;
    if (response[i] === '[') bracketCount++;
    if (response[i] === ']') bracketCount--;
    
    if (braceCount === 0 && bracketCount === 0 && i > 0) {
      endIndex = i + 1;
      break;
    }
  }
  
  return response.substring(0, endIndex);
}

// 插入数据到Supabase
async function insertToSupabase(table, data) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'apikey': SUPABASE_SERVICE_KEY
    },
    body: JSON.stringify(data)
  };

  try {
    const response = await callAPI(url, options);
    return response;
  } catch (error) {
    console.error(`插入数据失败 (${table}):`, error.message);
    throw error;
  }
}

// 生成单个公司的完整数据
async function generateCompanyData(companyName, tier) {
  console.log(`🔄 开始生成公司数据: ${companyName} (${tier})`);
  
  try {
    // 1. 生成公司基本信息
    const companyDetails = await generateCompanyDetails(companyName, tier);
    
    // 2. 插入公司数据
    const companyData = {
      name: companyDetails.name,
      description: companyDetails.description,
      detailed_description: companyDetails.detailed_description,
      founded_year: companyDetails.founded_year,
      headquarters: companyDetails.headquarters,
      website: companyDetails.website,
      employee_count_range: companyDetails.employee_count_range,
      valuation_usd: companyDetails.valuation_usd,
      industry_tags: companyDetails.industry_tags,
      created_at: new Date().toISOString()
    };
    
    const company = await insertToSupabase('companies', companyData);
    console.log(`✅ 公司数据插入成功: ${companyName}`);
    
    // 3. 生成项目数据
    const projects = await generateProjects(companyName, company.id);
    let projectCount = 0;
    
    for (const project of projects) {
      const projectData = {
        company_id: company.id,
        name: project.name,
        description: project.description,
        url: project.url,
        website: project.website,
        category: project.category,
        project_type: project.project_type,
        target_audience: project.target_audience,
        technology_stack: project.technology_stack,
        use_cases: project.use_cases,
        pricing_model: project.pricing_model,
        status: project.status,
        created_at: new Date().toISOString()
      };
      
      await insertToSupabase('projects', projectData);
      projectCount++;
    }
    
    console.log(`✅ 项目数据插入成功: ${companyName} (${projectCount}个项目)`);
    
    // 4. 生成融资数据
    const fundings = await generateFunding(companyName);
    let fundingCount = 0;
    
    for (const funding of fundings) {
      const fundingData = {
        company_id: company.id,
        round: funding.round,
        amount_usd: funding.amount_usd,
        investors: funding.investors,
        date: funding.date,
        valuation_usd: funding.valuation_usd,
        created_at: new Date().toISOString()
      };
      
      await insertToSupabase('fundings', fundingData);
      fundingCount++;
    }
    
    console.log(`✅ 融资数据插入成功: ${companyName} (${fundingCount}轮融资)`);
    
    // 5. 生成新闻故事
    const stories = await generateStories(companyName);
    let storyCount = 0;
    
    for (const story of stories) {
      const storyData = {
        company_id: company.id,
        title: story.title,
        content: story.content,
        source_url: story.source_url,
        published_date: story.published_date,
        category: story.category,
        created_at: new Date().toISOString()
      };
      
      await insertToSupabase('stories', storyData);
      storyCount++;
    }
    
    console.log(`✅ 新闻故事插入成功: ${companyName} (${storyCount}个故事)`);
    
    // 更新统计
    generationStats.completed++;
    generationStats.projectsGenerated += projectCount;
    generationStats.fundingsGenerated += fundingCount;
    generationStats.storiesGenerated += storyCount;
    
    console.log(`🎉 公司数据生成完成: ${companyName}`);
    console.log(`   📊 项目: ${projectCount}, 融资: ${fundingCount}, 故事: ${storyCount}`);
    
    return {
      success: true,
      company: companyName,
      projects: projectCount,
      fundings: fundingCount,
      stories: storyCount
    };
    
  } catch (error) {
    console.error(`❌ 公司数据生成失败: ${companyName}`, error.message);
    generationStats.failed++;
    generationStats.errors.push(`${companyName}: ${error.message}`);
    
    return {
      success: false,
      company: companyName,
      error: error.message
    };
  }
}

// 批量生成数据
async function batchGenerateData() {
  console.log('🚀 开始批量生成AI公司数据');
  console.log('📊 目标: 200+家AI公司');
  console.log('🔬 方法: 多模型协作 (DeepSeek -> OpenAI -> Qwen)');
  console.log('⏰ 开始时间:', new Date().toLocaleString());
  console.log('');
  
  // 计算总公司数
  for (const [tier, companies] of Object.entries(COMPANY_TIERS)) {
    generationStats.totalCompanies += companies.length;
  }
  
  console.log(`📋 总计: ${generationStats.totalCompanies}家公司`);
  console.log('');
  
  // 按优先级分批生成
  for (const [tierName, companies] of Object.entries(COMPANY_TIERS)) {
    console.log(`\n🎯 开始处理: ${tierName} (${companies.length}家公司)`);
    
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const progress = ((generationStats.completed + generationStats.failed) / generationStats.totalCompanies * 100).toFixed(1);
      
      console.log(`\n[${i + 1}/${companies.length}] ${company} (总进度: ${progress}%)`);
      
      try {
        const result = await generateCompanyData(company, tierName);
        
        if (result.success) {
          console.log(`✅ 成功: ${company}`);
        } else {
          console.log(`❌ 失败: ${company} - ${result.error}`);
        }
        
        // 添加延迟避免API限制
        if (i < companies.length - 1) {
          console.log('⏳ 等待3秒...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
      } catch (error) {
        console.error(`❌ 处理失败: ${company}`, error.message);
        generationStats.failed++;
        generationStats.errors.push(`${company}: ${error.message}`);
      }
    }
    
    console.log(`\n✅ ${tierName} 处理完成`);
  }
  
  // 生成完成报告
  const endTime = new Date();
  const duration = Math.round((endTime - generationStats.startTime) / 1000 / 60);
  
  console.log('\n🎉 批量生成完成!');
  console.log('='.repeat(50));
  console.log(`📊 统计信息:`);
  console.log(`   总公司数: ${generationStats.totalCompanies}`);
  console.log(`   成功: ${generationStats.completed}`);
  console.log(`   失败: ${generationStats.failed}`);
  console.log(`   项目总数: ${generationStats.projectsGenerated}`);
  console.log(`   融资总数: ${generationStats.fundingsGenerated}`);
  console.log(`   故事总数: ${generationStats.storiesGenerated}`);
  console.log(`   耗时: ${duration}分钟`);
  console.log(`   成功率: ${(generationStats.completed / generationStats.totalCompanies * 100).toFixed(1)}%`);
  
  if (generationStats.errors.length > 0) {
    console.log('\n❌ 错误列表:');
    generationStats.errors.forEach(error => console.log(`   - ${error}`));
  }
  
  console.log('\n✅ 数据生成完成，请检查前端页面!');
}

// 主函数
async function main() {
  try {
    await batchGenerateData();
  } catch (error) {
    console.error('❌ 批量生成失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  batchGenerateData,
  generateCompanyData,
  COMPANY_TIERS,
  generationStats
};
