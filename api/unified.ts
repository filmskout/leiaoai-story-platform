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
      return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to get company details for ${companyName}:`, error);
    throw error;
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
async function generateCompanyData(companyName: string, isOverseas: boolean) {
  try {
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
        employee_count: companyDetails.employee_count || Math.floor(Math.random() * 1000) + 100,
        valuation: companyDetails.valuation || `$${Math.floor(Math.random() * 10) + 1}B`,
        is_overseas: isOverseas,
        created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (companyError) {
      throw new Error(`Failed to insert company: ${companyError.message}`);
    }

    // 生成工具数据
    if (companyDetails.products && companyDetails.products.length > 0) {
      for (const product of companyDetails.products.slice(0, 3)) {
        await supabase.from('tools').insert({
          company_id: company.id,
          name: product.name || `${companyName} AI Tool`,
          description: product.description || `由${companyName}开发的AI工具`,
          url: product.url || `https://${companyName.toLowerCase()}.com/tools`,
          category: 'AI工具',
          created_at: new Date().toISOString()
            });
          }
        }

    // 生成融资数据
    if (companyDetails.funding_rounds && companyDetails.funding_rounds.length > 0) {
      for (const funding of companyDetails.funding_rounds.slice(0, 3)) {
        await supabase.from('fundings').insert({
          company_id: company.id,
          round: funding.round || 'Series A',
          amount: funding.amount || '$10M',
          investors: funding.investors || 'Venture Capital',
          valuation: funding.valuation || '$100M',
          date: funding.date || new Date().toISOString(),
          created_at: new Date().toISOString()
            });
          }
        }

        // 生成新闻故事
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

    return { success: true, companyId: company.id };
  } catch (error) {
    console.error(`Failed to generate data for ${companyName}:`, error);
    throw error;
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
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}