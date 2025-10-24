// 优化的批量数据生成API端点
// 支持多模型协作和进度监控

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// 初始化Supabase客户端
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    'Linear', 'Obsidian', 'Roam Research', 'LogSeq', 'Craft',
    'Bear', 'Ulysses', 'Scrivener', 'Final Draft', 'Procreate',
    'Sketch', 'Adobe Creative Suite'
  ],
  'Tier 4 - AI应用公司': [
    'Hemingway', 'ProWritingAid', 'Ginger', 'LanguageTool',
    'Google Translate', 'Microsoft Translator', 'Amazon Translate',
    'Reverso', 'Linguee', 'PONS', 'Collins', 'Oxford', 'Cambridge',
    'Duolingo', 'Rosetta Stone', 'Busuu', 'Memrise', 'Anki',
    'Quizlet', 'Kahoot', 'Mentimeter', 'Poll Everywhere',
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
  errors: [] as string[],
  currentTier: '',
  currentCompany: '',
  isRunning: false
};

// API调用函数
async function callAPI(url: string, options: any, timeout = 30000): Promise<any> {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const req = https.request(url, options, (res: any) => {
      let data = '';
      res.on('data', (chunk: any) => data += chunk);
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
async function callDeepSeek(prompt: string, maxTokens = 4000): Promise<string> {
  const url = 'https://api.deepseek.com/v1/chat/completions';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
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
  } catch (error: any) {
    console.error('DeepSeek API调用失败:', error.message);
    throw error;
  }
}

// OpenAI API调用
async function callOpenAI(prompt: string, maxTokens = 4000): Promise<string> {
  const url = 'https://api.openai.com/v1/chat/completions';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
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
  } catch (error: any) {
    console.error('OpenAI API调用失败:', error.message);
    throw error;
  }
}

// 清理JSON响应
function cleanJSONResponse(response: string): string {
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

// 生成公司详细信息
async function generateCompanyDetails(companyName: string, tier: string): Promise<any> {
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
    console.error(`生成公司详情失败: ${companyName}`, error);
    // 回退到OpenAI
    try {
      const response = await callOpenAI(prompt);
      const cleanedResponse = cleanJSONResponse(response);
      return JSON.parse(cleanedResponse);
    } catch (fallbackError) {
      console.error(`OpenAI回退也失败: ${companyName}`, fallbackError);
      throw fallbackError;
    }
  }
}

// 生成项目信息
async function generateProjects(companyName: string): Promise<any[]> {
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
    console.error(`生成项目失败: ${companyName}`, error);
    throw error;
  }
}

// 生成融资信息
async function generateFunding(companyName: string): Promise<any[]> {
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
    console.error(`生成融资信息失败: ${companyName}`, error);
    throw error;
  }
}

// 生成新闻故事
async function generateStories(companyName: string): Promise<any[]> {
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
    console.error(`生成新闻故事失败: ${companyName}`, error);
    throw error;
  }
}

// 生成单个公司的完整数据
async function generateCompanyData(companyName: string, tier: string): Promise<any> {
  console.log(`🔄 开始生成公司数据: ${companyName} (${tier})`);
  
  try {
    // 1. 生成公司基本信息
    const companyDetails = await generateCompanyDetails(companyName, tier);
    
    // 2. 插入公司数据
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
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
      })
      .select()
      .single();

    if (companyError) {
      throw new Error(`插入公司数据失败: ${companyError.message}`);
    }
    
    console.log(`✅ 公司数据插入成功: ${companyName}`);
    
    // 3. 生成项目数据
    const projects = await generateProjects(companyName);
    let projectCount = 0;
    
    for (const project of projects) {
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
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
        });
      
      if (!projectError) {
        projectCount++;
      }
    }
    
    console.log(`✅ 项目数据插入成功: ${companyName} (${projectCount}个项目)`);
    
    // 4. 生成融资数据
    const fundings = await generateFunding(companyName);
    let fundingCount = 0;
    
    for (const funding of fundings) {
      const { error: fundingError } = await supabase
        .from('fundings')
        .insert({
          company_id: company.id,
          round: funding.round,
          amount_usd: funding.amount_usd,
          investors: funding.investors,
          date: funding.date,
          valuation_usd: funding.valuation_usd,
          created_at: new Date().toISOString()
        });
      
      if (!fundingError) {
        fundingCount++;
      }
    }
    
    console.log(`✅ 融资数据插入成功: ${companyName} (${fundingCount}轮融资)`);
    
    // 5. 生成新闻故事
    const stories = await generateStories(companyName);
    let storyCount = 0;
    
    for (const story of stories) {
      const { error: storyError } = await supabase
        .from('stories')
        .insert({
          company_id: company.id,
          title: story.title,
          content: story.content,
          source_url: story.source_url,
          published_date: story.published_date,
          category: story.category,
          created_at: new Date().toISOString()
        });
      
      if (!storyError) {
        storyCount++;
      }
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
    
  } catch (error: any) {
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
async function batchGenerateData(generationMode: 'quick' | 'full'): Promise<any> {
  console.log('🚀 开始批量生成AI公司数据');
  console.log(`📊 模式: ${generationMode === 'full' ? '完整模式(200+家公司)' : '快速模式(40家公司)'}`);
  console.log('🔬 方法: 多模型协作 (DeepSeek -> OpenAI)');
  console.log('⏰ 开始时间:', new Date().toLocaleString());
  console.log('');
  
  // 重置统计
  generationStats = {
    totalCompanies: 0,
    completed: 0,
    failed: 0,
    projectsGenerated: 0,
    fundingsGenerated: 0,
    storiesGenerated: 0,
    startTime: new Date(),
    errors: [],
    currentTier: '',
    currentCompany: '',
    isRunning: true
  };
  
  // 计算总公司数
  for (const [tier, companies] of Object.entries(COMPANY_TIERS)) {
    if (generationMode === 'quick') {
      // 快速模式：每个层级只处理前10家
      generationStats.totalCompanies += Math.min(companies.length, 10);
    } else {
      generationStats.totalCompanies += companies.length;
    }
  }
  
  console.log(`📋 总计: ${generationStats.totalCompanies}家公司`);
  console.log('');
  
  const results = {
    success: true,
    message: '批量生成完成',
    totalCompanies: generationStats.totalCompanies,
    completed: 0,
    failed: 0,
    projectsGenerated: 0,
    fundingsGenerated: 0,
    storiesGenerated: 0,
    duration: 0,
    companies: [] as any[]
  };
  
  // 按优先级分批生成
  for (const [tierName, companies] of Object.entries(COMPANY_TIERS)) {
    const companiesToProcess = generationMode === 'quick' 
      ? companies.slice(0, 10) 
      : companies;
    
    console.log(`\n🎯 开始处理: ${tierName} (${companiesToProcess.length}家公司)`);
    generationStats.currentTier = tierName;
    
    for (let i = 0; i < companiesToProcess.length; i++) {
      const company = companiesToProcess[i];
      generationStats.currentCompany = company;
      
      const progress = ((generationStats.completed + generationStats.failed) / generationStats.totalCompanies * 100).toFixed(1);
      
      console.log(`\n[${i + 1}/${companiesToProcess.length}] ${company} (总进度: ${progress}%)`);
      
      try {
        const result = await generateCompanyData(company, tierName);
        
        if (result.success) {
          console.log(`✅ 成功: ${company}`);
          results.completed++;
          results.projectsGenerated += result.projects;
          results.fundingsGenerated += result.fundings;
          results.storiesGenerated += result.stories;
        } else {
          console.log(`❌ 失败: ${company} - ${result.error}`);
          results.failed++;
        }
        
        results.companies.push(result);
        
        // 添加延迟避免API限制
        if (i < companiesToProcess.length - 1) {
          console.log('⏳ 等待3秒...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
      } catch (error: any) {
        console.error(`❌ 处理失败: ${company}`, error.message);
        results.failed++;
        results.companies.push({
          success: false,
          company: company,
          error: error.message
        });
      }
    }
    
    console.log(`\n✅ ${tierName} 处理完成`);
  }
  
  // 生成完成报告
  const endTime = new Date();
  results.duration = Math.round((endTime.getTime() - generationStats.startTime.getTime()) / 1000 / 60);
  
  console.log('\n🎉 批量生成完成!');
  console.log('='.repeat(50));
  console.log(`📊 统计信息:`);
  console.log(`   总公司数: ${results.totalCompanies}`);
  console.log(`   成功: ${results.completed}`);
  console.log(`   失败: ${results.failed}`);
  console.log(`   项目总数: ${results.projectsGenerated}`);
  console.log(`   融资总数: ${results.fundingsGenerated}`);
  console.log(`   故事总数: ${results.storiesGenerated}`);
  console.log(`   耗时: ${results.duration}分钟`);
  console.log(`   成功率: ${(results.completed / results.totalCompanies * 100).toFixed(1)}%`);
  
  generationStats.isRunning = false;
  
  return results;
}

// 获取生成进度
function getGenerationProgress(): any {
  const percentage = generationStats.totalCompanies > 0 
    ? ((generationStats.completed + generationStats.failed) / generationStats.totalCompanies * 100)
    : 0;
  
  return {
    success: true,
    isRunning: generationStats.isRunning,
    current: generationStats.completed + generationStats.failed,
    total: generationStats.totalCompanies,
    percentage: Math.round(percentage * 100) / 100,
    currentStep: generationStats.isRunning 
      ? `正在处理: ${generationStats.currentTier} - ${generationStats.currentCompany}`
      : '未运行',
    details: generationStats.errors.slice(-10), // 最近10个错误
    companies: generationStats.completed,
    projects: generationStats.projectsGenerated,
    fundings: generationStats.fundingsGenerated,
    stories: generationStats.storiesGenerated,
    startTime: generationStats.startTime,
    duration: generationStats.isRunning 
      ? Math.round((new Date().getTime() - generationStats.startTime.getTime()) / 1000 / 60)
      : 0
  };
}

// API处理器
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'batch-generate':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        const { token, generationMode } = req.body;
        if (token !== process.env.ADMIN_TOKEN) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // 异步执行批量生成
        setTimeout(async () => {
          try {
            await batchGenerateData(generationMode || 'full');
          } catch (error) {
            console.error('批量生成失败:', error);
          }
        }, 1000);

        return res.status(200).json({
          success: true,
          message: '批量生成已启动',
          note: '生成过程在后台进行，请使用progress端点监控进度'
        });

      case 'progress':
        return res.status(200).json(getGenerationProgress());

      case 'stats':
        return res.status(200).json({
          success: true,
          stats: generationStats,
          progress: getGenerationProgress()
        });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('API错误:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
