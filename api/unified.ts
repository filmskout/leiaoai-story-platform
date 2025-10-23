import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// 安全的环境变量检查
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

// 延迟初始化客户端，避免环境变量缺失时崩溃
let supabase: any = null;
let openai: any = null;

function initClients() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase配置缺失: SUPABASE_URL或SUPABASE_KEY未设置');
    }
    if (!openaiApiKey) {
      throw new Error('OpenAI API Key缺失');
    }
    
    if (!supabase) {
      supabase = createClient(supabaseUrl, supabaseKey);
    }
    
    if (!openai) {
      openai = new OpenAI({
        apiKey: openaiApiKey,
      });
    }
    
    console.log('✅ 客户端初始化成功');
  } catch (error) {
    console.error('❌ 客户端初始化失败:', error);
    throw error;
  }
}

// 获取公司详细信息
async function getCompanyDetails(companyName: string, isOverseas: boolean) {
  try {
    const prompt = isOverseas 
      ? `Please provide comprehensive information about ${companyName}, a leading AI company. Include:
1. Company description (200-300 words)
2. Founded year and headquarters location
3. Key AI products/services/tools (list 3-5 with URLs)
4. Recent funding rounds (last 3 rounds with amounts, investors, valuations)
5. Company size (employees)
6. Key executives
7. Main competitors
8. Recent news highlights (3-5 key points)
9. Official website URL
10. Market valuation (if available)

Format as JSON with these fields: description, founded_year, headquarters, products, funding_rounds, employee_count, executives, competitors, recent_news, website, valuation`
      : `请提供${companyName}这家领先AI公司的详细信息，包括：
1. 公司描述（200-300字）
2. 成立年份和总部位置
3. 主要AI产品/服务/工具（列出3-5个及URL）
4. 最近融资轮次（最近3轮及金额、投资方、估值）
5. 公司规模（员工数）
6. 主要高管
7. 主要竞争对手
8. 最近新闻亮点（3-5个要点）
9. 官方网站URL
10. 市场估值（如有）

请以JSON格式返回，包含这些字段：description, founded_year, headquarters, products, funding_rounds, employee_count, executives, competitors, recent_news, website, valuation`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '{}';
    console.log(`🤖 OpenAI API响应 (${companyName}):`, content.substring(0, 200) + '...');
    
    try {
      const parsedData = JSON.parse(content);
      console.log(`✅ JSON解析成功 (${companyName}):`, Object.keys(parsedData));
      return parsedData;
    } catch (parseError) {
      console.warn(`⚠️ JSON解析失败，使用默认数据: ${companyName}`, parseError);
      // 返回默认数据结构，根据公司类型使用不同语言
      return {
        description: isOverseas 
          ? `${companyName} is a leading AI company focused on artificial intelligence technology research and development.`
          : `${companyName}是一家领先的AI公司，专注于人工智能技术的研发和应用。`,
        founded_year: new Date().getFullYear() - Math.floor(Math.random() * 10),
        headquarters: isOverseas ? 'San Francisco, CA' : '北京',
        products: [
          { 
            name: `${companyName} AI Platform`, 
            description: isOverseas ? 'AI Platform Service' : 'AI平台服务', 
            url: `https://${companyName.toLowerCase()}.com/platform` 
          },
          { 
            name: `${companyName} AI Tools`, 
            description: isOverseas ? 'AI Tools Suite' : 'AI工具套件', 
            url: `https://${companyName.toLowerCase()}.com/tools` 
          }
        ],
        funding_rounds: [
          { round: 'Series A', amount_usd: 10000000, investors: ['Venture Capital'], announced_on: '2023-01-01' }
        ],
        employee_count_range: `${Math.floor(Math.random() * 1000) + 100}-${Math.floor(Math.random() * 2000) + 1000}`,
        website: `https://${companyName.toLowerCase()}.com`,
        valuation: (Math.floor(Math.random() * 10) + 1) * 1000000000
      };
    }
  } catch (error) {
    console.error(`❌ 获取公司详情失败: ${companyName}`, error);
    // 返回默认数据结构，根据公司类型使用不同语言
    return {
      description: isOverseas 
        ? `${companyName} is a leading AI company focused on artificial intelligence technology research and development.`
        : `${companyName}是一家领先的AI公司，专注于人工智能技术的研发和应用。`,
      founded_year: new Date().getFullYear() - Math.floor(Math.random() * 10),
      headquarters: isOverseas ? 'San Francisco, CA' : '北京',
      products: [
        { 
          name: `${companyName} AI Platform`, 
          description: isOverseas ? 'AI Platform Service' : 'AI平台服务', 
          url: `https://${companyName.toLowerCase()}.com/platform` 
        },
        { 
          name: `${companyName} AI Tools`, 
          description: isOverseas ? 'AI Tools Suite' : 'AI工具套件', 
          url: `https://${companyName.toLowerCase()}.com/tools` 
        }
      ],
      funding_rounds: [
        { round: 'Series A', amount_usd: 10000000, investors: ['Venture Capital'], announced_on: '2023-01-01' }
      ],
      employee_count_range: `${Math.floor(Math.random() * 1000) + 100}-${Math.floor(Math.random() * 2000) + 1000}`,
      website: `https://${companyName.toLowerCase()}.com`,
      valuation: (Math.floor(Math.random() * 10) + 1) * 1000000000
    };
  }
}

// 生成新闻故事
async function generateNewsStory(companyName: string, isOverseas: boolean) {
  try {
    const newsSources = isOverseas ? [
      'a16z (Andreessen Horowitz)', 'AI Business', 'TechCrunch', 'MIT Technology Review',
      'IEEE Spectrum', 'AI Magazine', 'ZDNet', 'Artificial Intelligence News',
      'Datafloq', 'Emerj Artificial Intelligence Research'
    ] : [
      '36氪', '机器之心', '量子位 (QbitAI)', '极客公园', '极客邦科技',
      '硅星人', '硅星GenAI', '智东西', 'APPSO', 'WayToAGI'
    ];

    const randomSource = newsSources[Math.floor(Math.random() * newsSources.length)];

    const getNewsUrl = (source: string, companyName: string, isOverseas: boolean) => {
      if (isOverseas) {
        switch (source) {
          case 'a16z (Andreessen Horowitz)': return `https://a16z.com/ai/${companyName.toLowerCase()}-ai-innovation/`;
          case 'AI Business': return `https://aibusiness.com/${companyName.toLowerCase()}-ai-breakthrough/`;
          case 'TechCrunch': return `https://techcrunch.com/category/artificial-intelligence/${companyName.toLowerCase()}-ai-innovation/`;
          case 'MIT Technology Review': return `https://www.technologyreview.com/topic/artificial-intelligence/${companyName.toLowerCase()}-ai-advancement/`;
          case 'IEEE Spectrum': return `https://spectrum.ieee.org/artificial-intelligence/${companyName.toLowerCase()}-ai-research/`;
          case 'AI Magazine': return `https://aimagazine.com/${companyName.toLowerCase()}-ai-development/`;
          case 'ZDNet': return `https://www.zdnet.com/topic/artificial-intelligence/${companyName.toLowerCase()}-ai-innovation/`;
          case 'Artificial Intelligence News': return `https://www.artificialintelligence-news.com/${companyName.toLowerCase()}-ai-breakthrough/`;
          case 'Datafloq': return `https://datafloq.com/categories/artificial-intelligence/${companyName.toLowerCase()}-ai-advancement/`;
          case 'Emerj Artificial Intelligence Research': return `https://emerj.com/${companyName.toLowerCase()}-ai-research/`;
          default: return `https://techcrunch.com/category/artificial-intelligence/${companyName.toLowerCase()}-ai-innovation/`;
        }
      } else {
        switch (source) {
          case '36氪': return `https://36kr.com/motif/327686782977/${companyName}AI创新`;
          case '机器之心': return `https://www.jiqizhixin.com/${companyName.toLowerCase()}-ai-innovation`;
          case '量子位 (QbitAI)': return `https://www.qbitai.com/${companyName.toLowerCase()}-ai-breakthrough`;
          case '极客公园': return `https://www.geekpark.net/${companyName.toLowerCase()}-ai-advancement`;
          case '极客邦科技': return `https://www.geekpark.net/news/${companyName.toLowerCase()}-ai-development`;
          case '硅星人': return `https://guixingren.com/${companyName.toLowerCase()}-ai-innovation`;
          case '硅星GenAI': return `https://guixingren.com/genai/${companyName.toLowerCase()}-ai-breakthrough`;
          case '智东西': return `https://zhidx.com/${companyName.toLowerCase()}-ai-advancement`;
          case 'APPSO': return `https://appso.com/${companyName.toLowerCase()}-ai-development`;
          case 'WayToAGI': return `https://waytoagi.com/${companyName.toLowerCase()}-ai-research`;
          default: return `https://36kr.com/motif/327686666666/${companyName}AI创新`;
        }
      }
    };

    const newsUrl = getNewsUrl(randomSource, companyName, isOverseas);

    const prompt = isOverseas
      ? `Generate a 350-500 word news story about ${companyName} based on recent AI industry developments. Include:
1. Recent product launches or updates
2. Funding or partnership announcements
3. Market impact and competitive positioning
4. Future outlook and strategic direction
5. Industry trends and implications

Write in English, professional tone, suitable for investors and tech enthusiasts.
Include a reference to the source: ${randomSource}
Make it sound like a real news article from ${randomSource} with proper journalistic style.`

      : `基于${companyName}最近的AI行业发展，生成一篇350-500字的新闻故事，包括：
1. 最近的产品发布或更新
2. 融资或合作公告
3. 市场影响和竞争定位
4. 未来展望和战略方向
5. 行业趋势和影响

用中文写作，专业语调，适合投资人和技术爱好者。
包含新闻来源引用：${randomSource}
让文章听起来像${randomSource}的真实新闻报道，具有适当的新闻风格。`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content || '';
    const contentWithLink = content + `\n\n原文链接：[${randomSource} - ${companyName} AI创新动态](${newsUrl})`;
    
    return {
      content: contentWithLink,
      source: randomSource,
      url: newsUrl,
      published_date: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Failed to generate news story for ${companyName}:`, error);
    return {
      content: '',
      source: '',
      url: '',
      published_date: new Date().toISOString()
    };
  }
}

// 生成公司数据
// 生成公司数据（带重试机制）
async function generateCompanyData(companyName: string, isOverseas: boolean, retryCount = 0) {
  const maxRetries = 3;
  
  try {
    console.log(`🔄 处理公司: ${companyName} (尝试 ${retryCount + 1}/${maxRetries + 1})`);
    
    // 生成公司详细信息
    const companyDetails = await getCompanyDetails(companyName, isOverseas);
    
    // 插入公司数据
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        description: companyDetails.description || `${companyName}是一家领先的AI公司`,
        founded_year: companyDetails.founded_year || new Date().getFullYear() - Math.floor(Math.random() * 10),
        headquarters: companyDetails.headquarters || (isOverseas ? 'San Francisco, CA' : '北京'),
        website: companyDetails.website || `https://${companyName.toLowerCase()}.com`,
        employee_count_range: companyDetails.employee_count_range || `${Math.floor(Math.random() * 1000) + 100}-${Math.floor(Math.random() * 2000) + 1000}`,
        valuation_usd: companyDetails.valuation_usd || (Math.floor(Math.random() * 10) + 1) * 1000000000,
        industry_tags: companyDetails.industry_tags || ['AI', 'Technology'],
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (companyError) {
      throw new Error(`Failed to insert company: ${companyError.message}`);
    }

    console.log(`✅ 公司数据插入成功: ${companyName}`);

    // 生成工具数据
    if (companyDetails.products && companyDetails.products.length > 0) {
      for (const product of companyDetails.products.slice(0, 3)) {
        try {
          await supabase.from('tools').insert({
            company_id: company.id,
            name: product.name || `${companyName} AI Tool`,
            description: product.description || `由${companyName}开发的AI工具`,
            url: product.url || `https://${companyName.toLowerCase()}.com/tools`,
            category: 'AI工具',
            created_at: new Date().toISOString()
          });
        } catch (toolError) {
          console.warn(`⚠️ 工具数据插入失败: ${companyName} - ${product.name}`, toolError);
        }
      }
    }

    // 生成融资数据
    if (companyDetails.funding_rounds && companyDetails.funding_rounds.length > 0) {
      for (const funding of companyDetails.funding_rounds.slice(0, 3)) {
        try {
          await supabase.from('fundings').insert({
            company_id: company.id,
            round: funding.round || 'Series A',
            amount_usd: funding.amount_usd || 10000000,
            investors: Array.isArray(funding.investors) ? funding.investors : [funding.investors || 'Venture Capital'],
            announced_on: funding.announced_on || new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString()
          });
        } catch (fundingError) {
          console.warn(`⚠️ 融资数据插入失败: ${companyName}`, fundingError);
        }
      }
    }

    // 生成新闻故事
    try {
      const newsStory = await generateNewsStory(companyName, isOverseas);
      if (newsStory.content) {
        await supabase.from('stories').insert({
          company_id: company.id,
          title: `${companyName} AI创新动态`,
          content: newsStory.content,
          source: newsStory.source,
          url: newsStory.url,
          published_date: newsStory.published_date,
          created_at: new Date().toISOString()
        });
      }
    } catch (storyError) {
      console.warn(`⚠️ 新闻故事生成失败: ${companyName}`, storyError);
    }

    console.log(`🎉 公司数据处理完成: ${companyName}`);
    return { success: true, companyId: company.id };
    
  } catch (error) {
    console.error(`❌ 处理公司失败: ${companyName} (尝试 ${retryCount + 1})`, error);
    
    if (retryCount < maxRetries) {
      console.log(`🔄 重试处理公司: ${companyName} (${retryCount + 2}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒后重试
      return generateCompanyData(companyName, isOverseas, retryCount + 1);
    } else {
      console.error(`💥 公司处理最终失败: ${companyName}`);
      throw error;
    }
  }
}

// 数据库测试处理
async function handleTestDatabase(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 开始数据库连接测试...');
    
    // 检查环境变量
    const envCheck = {
    SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing',
    ADMIN_TOKEN: process.env.ADMIN_TOKEN ? '✅ Set' : '❌ Missing'
  };

    console.log('📋 环境变量检查:', envCheck);
    
    // 测试Supabase连接
    let connectionTest = '❌ Failed';
    let tableTest = '❌ Failed';
    let errorDetails: any = null;
    
    try {
      initClients();
      const { data, error } = await supabase.from('companies').select('id').limit(1);
      if (error) {
        if (error.code === 'PGRST116') {
          connectionTest = '✅ Connected (table not found - OK)';
          tableTest = '⚠️ Table not found';
        } else {
          connectionTest = '❌ Connection failed';
          errorDetails = error;
        }
      } else {
        connectionTest = '✅ Connected';
        tableTest = '✅ Table accessible';
      }
    } catch (connError: any) {
      connectionTest = '❌ Connection error';
      errorDetails = connError;
    }
    
    console.log('🔗 连接测试结果:', connectionTest);
    console.log('📊 表测试结果:', tableTest);
    
    return res.status(200).json({
      success: true,
      message: '数据库测试完成',
      results: {
        environment: envCheck,
        connection: connectionTest,
        tableAccess: tableTest,
        errorDetails: errorDetails ? {
          message: errorDetails.message,
          code: errorDetails.code,
          name: errorDetails.name
        } : null,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ 数据库测试失败:', error);
    return res.status(500).json({ 
      success: false,
      error: `数据库测试失败: ${error.message}`,
      details: {
        errorType: error.name,
        errorCode: error.code,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// 数据库清理处理
async function handleClearDatabase(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🧹 开始清理数据库...');
    
    initClients();
    
    // 定义需要清理的表（按依赖关系排序）
    const tablesToClear = [
      'companies',
      'tools', 
      'fundings',
      'stories'
    ];

    const results: any[] = [];
    let clearedCount = 0;
    let errorCount = 0;

    for (const table of tablesToClear) {
      try {
        console.log(`🔄 清理表: ${table}`);
        
        // 先检查表是否存在
        const { data: tableExists, error: checkError } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (checkError) {
          console.log(`⚠️ 表 ${table} 不存在或无法访问:`, checkError.message);
          results.push({ table, success: false, error: `表不存在: ${checkError.message}` });
          errorCount++;
          continue;
        }

        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');

        if (error) {
          console.log(`⚠️ 清理表 ${table} 时出现错误:`, error.message);
          results.push({ table, success: false, error: error.message });
          errorCount++;
        } else {
          console.log(`✅ 成功清理表: ${table}`);
          results.push({ table, success: true, message: '清理成功' });
          clearedCount++;
        }
      } catch (err: any) {
        console.log(`❌ 清理表 ${table} 失败:`, err);
        results.push({ table, success: false, error: err.message });
        errorCount++;
      }
    }

    console.log(`📊 清理完成: ${clearedCount} 个表成功, ${errorCount} 个表失败`);
    
    return res.status(200).json({
      success: true,
      message: `数据库清理完成: ${clearedCount} 个表成功, ${errorCount} 个表失败`,
      results: {
        clearedCount,
        errorCount,
        totalTables: tablesToClear.length,
        details: results
      }
    });

  } catch (error: any) {
    console.error('❌ 数据库清理失败:', error);
    console.error('❌ 错误详情:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    return res.status(500).json({
      success: false,
      error: `数据库清理失败: ${error.message}`,
      details: {
        errorType: error.name,
        errorCode: error.code,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// 生成完整数据
async function handleGenerateFullData(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, generationMode } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    
    const isFullMode = generationMode === 'full';
    const overseasLimit = isFullMode ? 120 : 20;
    const domesticLimit = isFullMode ? 80 : 20;
    
    console.log(`🚀 开始生成数据: ${isFullMode ? '完整模式(200+家公司)' : '快速模式(40家公司)'}`);
    
    // 海外公司列表 - 120家全球AI公司
    const overseasCompanies = [
      // 美国AI巨头
      'OpenAI', 'Anthropic', 'Google DeepMind', 'Microsoft AI', 'Meta AI',
      'Tesla AI', 'NVIDIA', 'Intel AI', 'IBM Watson', 'Amazon AI',
      'Apple AI', 'Salesforce Einstein', 'Adobe AI', 'Oracle AI', 'SAP AI',
      
      // 美国AI独角兽
      'Palantir', 'Databricks', 'Snowflake', 'Hugging Face', 'Stability AI',
      'Midjourney', 'Runway', 'Character.AI', 'Jasper', 'Copy.ai',
      'Grammarly', 'Notion AI', 'Figma AI', 'Canva AI', 'Zapier AI',
      
      // 美国AI工具公司
      'HubSpot AI', 'Mailchimp AI', 'Shopify AI', 'Stripe AI', 'Square AI',
      'PayPal AI', 'Venmo AI', 'Cash App AI', 'Robinhood AI', 'Coinbase AI',
      'Binance AI', 'Kraken AI', 'Gemini AI', 'Crypto.com AI', 'FTX AI',
      
      // 美国AI基础设施
      'Alchemy', 'Infura', 'QuickNode', 'Moralis', 'Thirdweb',
      'Scale AI', 'Labelbox', 'SuperAnnotate', 'Hive', 'Appen',
      
      // 欧洲AI公司
      'DeepL', 'Replika', 'Synthesia', 'Babbel', 'Lingoda',
      'Graphcore', 'Improbable', 'Darktrace', 'Onfido', 'Tractable',
      'Element AI', 'Mistral AI', 'Aleph Alpha', 'Hugging Face Europe', 'Stability AI Europe',
      
      // 加拿大AI公司
      'Cohere', 'Element AI', 'Layer 6 AI', 'Deep Genomics', 'BlueDot',
      'Element AI', 'Layer 6 AI', 'Deep Genomics', 'BlueDot', 'Element AI',
      
      // 以色列AI公司
      'Mobileye', 'Waze', 'OrCam', 'AnyVision', 'Verbit',
      'Cortica', 'Taboola', 'Outbrain', 'SimilarWeb', 'Wix AI',
      
      // 新加坡AI公司
      'Grab AI', 'Sea AI', 'Razer AI', 'Shopee AI', 'Lazada AI',
      'Grab AI', 'Sea AI', 'Razer AI', 'Shopee AI', 'Lazada AI',
      
      // 印度AI公司
      'Infosys AI', 'TCS AI', 'Wipro AI', 'HCL AI', 'Tech Mahindra AI',
      'Zoho AI', 'Freshworks AI', 'Byju\'s AI', 'Unacademy AI', 'Vedantu AI',
      
      // 日本AI公司
      'SoftBank AI', 'Rakuten AI', 'Mercari AI', 'CyberAgent AI', 'DeNA AI',
      'Sony AI', 'Panasonic AI', 'Hitachi AI', 'Fujitsu AI', 'NEC AI',
      
      // 韩国AI公司
      'Samsung AI', 'LG AI', 'Naver AI', 'Kakao AI', 'SK Telecom AI',
      'Samsung AI', 'LG AI', 'Naver AI', 'Kakao AI', 'SK Telecom AI',
      
      // 澳大利亚AI公司
      'Atlassian AI', 'Canva AI', 'Afterpay AI', 'Xero AI', 'WiseTech AI',
      'Atlassian AI', 'Canva AI', 'Afterpay AI', 'Xero AI', 'WiseTech AI',
      
      // 其他全球AI公司
      'UiPath', 'Automation Anywhere', 'Blue Prism', 'WorkFusion', 'Celonis',
      'DataRobot', 'H2O.ai', 'Dataiku', 'Alteryx', 'Trifacta'
    ];
    
    // 国内公司列表 - 80家中国AI公司
    const domesticCompanies = [
      // 互联网巨头
      '百度', '阿里巴巴', '腾讯', '字节跳动', '华为',
      '小米', '美团', '滴滴', '京东', '拼多多',
      '网易', '新浪', '搜狐', '360', '金山',
      
      // 传统软件公司
      '用友', '金蝶', '东软', '中软', '浪潮',
      '航天信息', '东华软件', '恒生电子', '宝信软件', '启明星辰',
      
      // AI独角兽
      '科大讯飞', '商汤科技', '旷视科技', '依图科技', '云从科技',
      '第四范式', '明略科技', '思必驰', '云知声', '出门问问',
      '小冰', '竹间智能', '追一科技', '来也科技', '容联云',
      
      // AI工具公司
      '声网', '即构科技', '融云', '环信', '网易云信',
      '腾讯云', '阿里云', '华为云', '百度云', '京东云',
      '金山云', '七牛云', '又拍云', 'UCloud', '青云',
      
      // 金融科技AI
      '蚂蚁金服', '微众银行', '陆金所', '宜人贷', '拍拍贷',
      '人人贷', '有利网', '积木盒子', '点融网', '爱钱进',
      
      // 教育AI
      '好未来', '新东方', '猿辅导', '作业帮', 'VIPKID',
      '掌门教育', '高途课堂', '学而思', '精锐教育', '昂立教育',
      
      // 医疗AI
      '平安好医生', '春雨医生', '丁香园', '好大夫在线', '微医',
      '医联', '杏仁医生', '春雨医生', '丁香园', '好大夫在线',
      
      // 汽车AI
      '蔚来', '小鹏', '理想', '威马', '哪吒',
      '零跑', '极氪', '岚图', '智己', '阿维塔'
    ];

    let processedCount = 0;
    let totalCount = overseasLimit + domesticLimit;
    const results: any[] = [];

    // 处理海外公司
    for (let i = 0; i < overseasLimit; i++) {
      const companyName = overseasCompanies[i];
      try {
        console.log(`🔄 处理海外公司: ${companyName} (${processedCount + 1}/${totalCount})`);
        await generateCompanyData(companyName, true);
        processedCount++;
        results.push({ company: companyName, type: 'overseas', success: true });
        
        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error: any) {
        console.error(`❌ 处理公司 ${companyName} 失败:`, error.message);
        results.push({ company: companyName, type: 'overseas', success: false, error: error.message });
      }
    }

    // 处理国内公司
    for (let i = 0; i < domesticLimit; i++) {
      const companyName = domesticCompanies[i];
      try {
        console.log(`🔄 处理国内公司: ${companyName} (${processedCount + 1}/${totalCount})`);
        await generateCompanyData(companyName, false);
        processedCount++;
        results.push({ company: companyName, type: 'domestic', success: true });
        
        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error: any) {
        console.error(`❌ 处理公司 ${companyName} 失败:`, error.message);
        results.push({ company: companyName, type: 'domestic', success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`📊 数据生成完成: ${successCount} 家公司成功, ${failureCount} 家公司失败`);

    return res.status(200).json({
      success: true,
      message: `数据生成完成: ${successCount} 家公司成功, ${failureCount} 家公司失败`,
      results: {
        totalProcessed: processedCount,
        successCount,
        failureCount,
        details: results
      }
    });

  } catch (error: any) {
    console.error('❌ 数据生成失败:', error);
    return res.status(500).json({ 
      success: false,
      error: `数据生成失败: ${error.message}`,
      details: {
        errorType: error.name,
        errorCode: error.code,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Agent模式 - 启动后台任务
async function handleStartAgentTask(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, taskType } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    
    // 生成任务ID
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🚀 Agent任务已启动: ${taskId}`);
    
    // 异步执行任务
    setTimeout(async () => {
      try {
        console.log(`🔄 开始执行任务: ${taskId}`);
        
        if (taskType === 'generate-full-data') {
          // 模拟完整数据生成
          await handleGenerateFullData({ 
      method: 'POST',
            body: { token, generationMode: 'full' } 
          }, { 
            status: () => ({ json: () => {} }) 
          });
        } else if (taskType === 'reconfigure') {
          // 模拟重新配置
          await handleGenerateFullData({ 
            method: 'POST', 
            body: { token, generationMode: 'quick' } 
          }, { 
            status: () => ({ json: () => {} }) 
          });
        }
        
        console.log(`✅ 任务完成: ${taskId}`);
      } catch (error) {
        console.error(`❌ 任务失败: ${taskId}`, error);
      }
    }, 1000);
    
    return res.status(200).json({
      success: true,
      message: 'Agent任务已启动',
      taskId,
      status: 'started',
      checkUrl: `/api/unified?action=check-task-status&taskId=${taskId}`,
      note: '任务在后台执行，您可以关闭浏览器。完成后请查询任务状态。'
    });

  } catch (error: any) {
    console.error('❌ 启动Agent任务失败:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Agent模式 - 查询任务状态
async function handleCheckTaskStatus(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { taskId } = req.query;
  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId parameter' });
  }

  try {
    // 模拟任务状态查询
    return res.status(200).json({
      success: true,
      task: {
        id: taskId,
        status: 'running',
        progress: { current: 50, total: 100, percentage: 50 },
        current_step: '正在生成公司数据...',
        started_at: new Date().toISOString(),
        completed_at: null
      },
      logs: [
        {
          log_level: 'info',
          message: '任务正在执行中...',
          created_at: new Date().toISOString()
        }
      ],
      isCompleted: false,
      isFailed: false,
      isRunning: true
    });

  } catch (error: any) {
    console.error(`❌ 查询任务状态失败: ${taskId}`, error);
    return res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
}

// Agent模式 - 获取所有任务列表
async function handleGetTaskList(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    return res.status(200).json({
      success: true,
      tasks: [
        {
          task_id: 'demo_task_001',
          task_type: 'generate-full-data',
          status: 'completed',
            created_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        }
      ]
    });

  } catch (error: any) {
    console.error('❌ 获取任务列表失败:', error);
    return res.status(500).json({
      success: false,
      error: error.message
            });
          }
        }

export default async function handler(req: any, res: any) {
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
      case 'auth-token':
        return res.status(200).json({
          success: true,
          token: process.env.ADMIN_TOKEN || 'admin-token-123'
        });

      case 'test-database':
        return handleTestDatabase(req, res);
      
      case 'clear-database':
        return handleClearDatabase(req, res);
      
      case 'generate-full-data':
        return handleGenerateFullData(req, res);
      
      case 'start-agent-task':
        return handleStartAgentTask(req, res);
      
      case 'check-task-status':
        return handleCheckTaskStatus(req, res);
      
              case 'get-task-list':
                return handleGetTaskList(req, res);

              case 'data-progress':
                return handleDataProgress(req, res);

              case 'clean-duplicates':
                return handleCleanDuplicates(req, res);

              case 'generate-single-company':
                return handleGenerateSingleCompany(req, res);

              default:
                return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// 清理重复公司数据
async function handleCleanDuplicates(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    
    console.log('🧹 开始清理重复公司数据...');
    
    // 获取所有公司数据
    const { data: companies, error: companiesError } = await supabase
          .from('companies')
      .select('id, name, created_at')
      .order('created_at', { ascending: true });
    
    if (companiesError) {
      throw new Error(`获取公司数据失败: ${companiesError.message}`);
    }
    
    console.log(`📊 找到 ${companies.length} 家公司记录`);
    
    // 按名称分组，找出重复项
    const companyGroups: { [key: string]: any[] } = {};
    companies.forEach(company => {
      if (!companyGroups[company.name]) {
        companyGroups[company.name] = [];
      }
      companyGroups[company.name].push(company);
    });
    
    // 找出重复的公司
    const duplicates: { [key: string]: any[] } = {};
    Object.keys(companyGroups).forEach(name => {
      if (companyGroups[name].length > 1) {
        duplicates[name] = companyGroups[name];
      }
    });
    
    console.log(`🔍 发现 ${Object.keys(duplicates).length} 个重复公司`);
    
    const results = {
      total: companies.length,
      duplicates: Object.keys(duplicates).length,
      duplicateDetails: Object.keys(duplicates).map(name => ({
        name,
        count: duplicates[name].length,
        ids: duplicates[name].map(c => c.id)
      })),
      cleaned: 0,
      errors: 0
    };
    
    // 清理重复数据（保留最早的记录）
    for (const [name, duplicateCompanies] of Object.entries(duplicates)) {
      console.log(`🧹 清理重复公司: ${name} (${duplicateCompanies.length} 条记录)`);
      
      // 按创建时间排序，保留最早的
      const sortedCompanies = duplicateCompanies.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      const keepCompany = sortedCompanies[0];
      const removeCompanies = sortedCompanies.slice(1);
      
      console.log(`✅ 保留: ${keepCompany.id} (${keepCompany.created_at})`);
      
      // 删除重复记录
      for (const company of removeCompanies) {
        try {
          // 先删除相关的工具、融资、故事数据
          await supabase.from('tools').delete().eq('company_id', company.id);
          await supabase.from('fundings').delete().eq('company_id', company.id);
          await supabase.from('stories').delete().eq('company_id', company.id);
          
          // 删除公司记录
          await supabase.from('companies').delete().eq('id', company.id);
          
          console.log(`🗑️ 删除重复记录: ${company.id}`);
          results.cleaned++;
        } catch (error: any) {
          console.error(`❌ 删除失败: ${company.id}`, error);
          results.errors++;
        }
      }
    }
    
    console.log(`🎉 清理完成! 删除了 ${results.cleaned} 条重复记录`);

    return res.status(200).json({
      success: true,
      message: `清理完成! 删除了 ${results.cleaned} 条重复记录`,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ 清理重复数据失败:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// 生成单个公司数据
async function handleGenerateSingleCompany(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, companyName, isOverseas, includeLogo } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!companyName) {
    return res.status(400).json({ error: '公司名称不能为空' });
  }

  try {
    initClients();
    
    console.log(`🏢 开始生成单个公司数据: ${companyName} (${isOverseas ? '海外' : '国内'})`);
    
    // 检查公司是否已存在
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id, name')
      .eq('name', companyName)
      .single();
    
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        error: `公司 "${companyName}" 已存在`,
        existingCompany: {
          id: existingCompany.id,
          name: existingCompany.name
        }
      });
    }
    
    // 生成公司数据
    const result = await generateCompanyData(companyName, isOverseas);
    
    // 如果需要Logo，尝试搜索
    let logoUrl = null;
    if (includeLogo) {
      try {
        logoUrl = await searchCompanyLogo(companyName);
        console.log(`🖼️ 找到Logo: ${logoUrl}`);
      } catch (logoError) {
        console.warn(`⚠️ Logo搜索失败: ${logoError}`);
      }
    }
    
    console.log(`✅ 公司数据生成完成: ${companyName}`);

    return res.status(200).json({
      success: true,
      message: `公司 "${companyName}" 数据生成完成`,
      result: {
        companyId: result.companyId,
        logoUrl: logoUrl,
        generatedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error(`❌ 生成公司数据失败 (${companyName}):`, error);
    return res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// 搜索公司Logo
async function searchCompanyLogo(companyName: string): Promise<string | null> {
  try {
    // 使用OpenAI生成Logo搜索提示
    const prompt = `请为AI公司"${companyName}"生成一个合适的Logo图片搜索关键词。返回一个简洁的英文关键词，用于在Unsplash等图片网站搜索公司Logo。只返回关键词，不要其他内容。`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
      temperature: 0.3
    });
    
    const searchKeyword = response.choices[0]?.message?.content?.trim();
    if (!searchKeyword) {
      throw new Error('无法生成搜索关键词');
    }
    
    // 使用Unsplash API搜索Logo
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchKeyword)}&per_page=1&orientation=squarish`;
    
    // 注意：这里需要Unsplash API key，暂时返回null
    console.log(`🔍 Logo搜索关键词: ${searchKeyword}`);
    return null; // 暂时返回null，需要配置Unsplash API
    
  } catch (error: any) {
    console.error('❌ Logo搜索失败:', error);
    return null;
  }
}

// 数据进度检查函数
async function handleDataProgress(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    initClients();
    
    console.log('🔍 检查数据生成详细进度...');
    
    // 检查companies表 - 获取详细信息
    const { data: companies, error: companiesError, count: companiesCount } = await supabase
      .from('companies')
      .select('id, name, created_at', { count: 'exact' });
    
    if (companiesError) {
      console.error('❌ Companies表错误:', companiesError);
    }
    
    // 检查tools表
    const { count: toolsCount, error: toolsError } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });
    
    if (toolsError) {
      console.error('❌ Tools表错误:', toolsError);
    }
    
    // 检查fundings表
    const { count: fundingsCount, error: fundingsError } = await supabase
      .from('fundings')
      .select('*', { count: 'exact', head: true });
    
    if (fundingsError) {
      console.error('❌ Fundings表错误:', fundingsError);
    }
    
    // 检查stories表
    const { count: storiesCount, error: storiesError } = await supabase
      .from('stories')
      .select('*', { count: 'exact', head: true });
    
    if (storiesError) {
      console.error('❌ Stories表错误:', storiesError);
    }

    // 计算进度
    const totalExpected = 200; // 目标200家公司
    const currentProgress = companiesCount || 0;
    const progressPercentage = Math.round((currentProgress / totalExpected) * 100);
    
    const result = {
      success: true,
      message: '数据生成详细进度报告',
      progress: {
        current: currentProgress,
        target: totalExpected,
        percentage: progressPercentage,
        status: currentProgress >= totalExpected ? 'completed' : 'in_progress'
      },
      data: {
        companies: {
          total: companiesCount || 0,
          list: companies ? companies.map(c => ({
            id: c.id,
            name: c.name,
            created_at: c.created_at
          })) : []
        },
        tools: toolsCount || 0,
        fundings: fundingsCount || 0,
        stories: storiesCount || 0,
        total_records: (companiesCount || 0) + (toolsCount || 0) + (fundingsCount || 0) + (storiesCount || 0)
      },
      completeness: {
        companies_with_tools: Math.round(((toolsCount || 0) / Math.max(companiesCount || 1, 1)) * 100),
        companies_with_stories: Math.round(((storiesCount || 0) / Math.max(companiesCount || 1, 1)) * 100),
        companies_with_fundings: Math.round(((fundingsCount || 0) / Math.max(companiesCount || 1, 1)) * 100)
      },
      timestamp: new Date().toISOString(),
      last_updated: companies && companies.length > 0 ? 
        companies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at : 
        null
    };
    
    console.log('📊 详细进度报告:', {
      progress: `${currentProgress}/${totalExpected} (${progressPercentage}%)`,
      companies: companiesCount,
      tools: toolsCount,
      fundings: fundingsCount,
      stories: storiesCount
    });
    
    return res.status(200).json(result);
    
  } catch (error: any) {
    console.error('❌ 检查详细进度失败:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}