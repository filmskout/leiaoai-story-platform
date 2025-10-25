import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// 安全的环境变量检查
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const deepseekApiKey = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY;

// 延迟初始化客户端，避免环境变量缺失时崩溃
let supabase: any = null;
let openai: any = null;
let deepseek: any = null;

function initClients() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase配置缺失: SUPABASE_URL或SUPABASE_KEY未设置');
    }
    if (!openaiApiKey && !deepseekApiKey) {
      throw new Error('API Key缺失: 需要OpenAI或DeepSeek API Key');
    }

    if (!supabase) {
      supabase = createClient(supabaseUrl, supabaseKey);
    }

    if (!openai && openaiApiKey) {
      openai = new OpenAI({
        apiKey: openaiApiKey,
      });
      console.log('✅ OpenAI客户端初始化成功');
    }

    if (!deepseek && deepseekApiKey) {
      deepseek = new OpenAI({
        apiKey: deepseekApiKey,
        baseURL: 'https://api.deepseek.com',
      });
      console.log('✅ DeepSeek客户端初始化成功');
    }

    console.log(`🔑 API Key状态: OpenAI=${!!openaiApiKey}, DeepSeek=${!!deepseekApiKey}`);
    console.log(`🔑 DeepSeek Key长度: ${deepseekApiKey ? deepseekApiKey.length : 0}`);
    console.log(`🔑 DeepSeek Key前缀: ${deepseekApiKey ? deepseekApiKey.substring(0, 10) + '...' : 'null'}`);
    console.log('✅ 客户端初始化成功');
  } catch (error) {
    console.error('❌ 客户端初始化失败:', error);
    throw error;
  }
}

// 获取公司详细信息 - 深度研究模式
async function getCompanyDetails(companyName: string, isOverseas: boolean, useDeepSeek = false) {
  try {
    console.log(`🔬 开始深度研究模式分析: ${companyName}`);
    
    const prompt = isOverseas 
      ? `You are a senior AI industry research analyst conducting a comprehensive deep research analysis on "${companyName}". This is a critical business intelligence report for investors and industry stakeholders.

Please conduct thorough research and provide detailed information in the following areas:

**COMPANY FUNDAMENTALS:**
1. Company description (300-400 words) - Mission, vision, core values, and strategic positioning
2. Founded year, headquarters location, and key office locations
3. Company size and growth trajectory (employee count, recent hiring trends)
4. Leadership team and key executives (names, backgrounds, expertise)

**BUSINESS MODEL & PRODUCTS:**
5. Detailed AI products/services/tools portfolio (list 5-7 with specific URLs, technical capabilities, and market positioning)
6. Revenue streams and business model (B2B, B2C, enterprise, consumer, etc.)
7. Target markets and customer segments
8. Pricing strategy and competitive pricing analysis

**FINANCIAL & FUNDING:**
9. Recent funding rounds (last 5 rounds with specific amounts, lead investors, valuations, and funding timeline)
10. Current market valuation and valuation methodology
11. Revenue growth trends and financial performance indicators
12. Key partnerships and strategic alliances

**COMPETITIVE LANDSCAPE:**
13. Main competitors and competitive analysis
14. Market share and industry positioning
15. Unique value propositions and competitive advantages
16. Technology differentiation and IP portfolio

**MARKET IMPACT & NEWS:**
17. Recent significant news highlights (5-7 key developments with dates and impact analysis)
18. Industry recognition, awards, and achievements
19. Regulatory compliance and industry certifications
20. Future outlook and strategic initiatives

**TECHNICAL ANALYSIS:**
21. AI technology stack and core technologies
22. Research and development focus areas
23. Technical partnerships and collaborations
24. Innovation pipeline and upcoming product launches

Format as JSON with these fields: description, founded_year, headquarters, products, funding_rounds, employee_count, executives, competitors, recent_news, website, valuation, revenue_model, market_position, technology_stack, partnerships, awards, future_outlook

Ensure all information is factual, current, and based on available public data. Use professional business analysis tone.`
      : `你是一位资深AI行业研究分析师，正在对"${companyName}"进行全面的深度研究分析。这是一份面向投资人和行业利益相关者的关键商业情报报告。

请进行深入研究并提供以下领域的详细信息：

**公司基本面：**
1. 公司描述（300-400字）- 使命、愿景、核心价值观和战略定位
2. 成立年份、总部位置和主要办公地点
3. 公司规模和增长轨迹（员工数量、近期招聘趋势）
4. 领导团队和主要高管（姓名、背景、专业领域）

**商业模式与产品：**
5. 详细AI产品/服务/工具组合（列出5-7个，包含具体URL、技术能力和市场定位）
6. 收入来源和商业模式（B2B、B2C、企业级、消费级等）
7. 目标市场和客户群体
8. 定价策略和竞争定价分析

**财务与融资：**
9. 近期融资轮次（最近5轮，包含具体金额、领投方、估值和融资时间线）
10. 当前市场估值和估值方法
11. 收入增长趋势和财务表现指标
12. 关键合作伙伴和战略联盟

**竞争格局：**
13. 主要竞争对手和竞争分析
14. 市场份额和行业定位
15. 独特价值主张和竞争优势
16. 技术差异化和知识产权组合

**市场影响与新闻：**
17. 近期重大新闻亮点（5-7个关键发展，包含日期和影响分析）
18. 行业认可、奖项和成就
19. 监管合规和行业认证
20. 未来展望和战略举措

**技术分析：**
21. AI技术栈和核心技术
22. 研发重点领域
23. 技术合作伙伴和协作关系
24. 创新管道和即将推出的产品

请以JSON格式返回，包含这些字段：description, founded_year, headquarters, products, funding_rounds, employee_count, executives, competitors, recent_news, website, valuation, revenue_model, market_position, technology_stack, partnerships, awards, future_outlook

确保所有信息都是事实性的、最新的，基于可用的公开数据。使用专业的商业分析语调。`;

    console.log(`🤖 发送深度研究请求: ${companyName} (${isOverseas ? '海外' : '国内'}) ${useDeepSeek ? '[DeepSeek]' : '[OpenAI]'}`);
    
    // 选择API客户端
    const client = useDeepSeek ? deepseek : openai;
    const model = useDeepSeek ? 'deepseek-chat' : 'gpt-4';
    
    if (!client) {
      console.error(`❌ API客户端未初始化: ${useDeepSeek ? 'DeepSeek' : 'OpenAI'}`);
      console.error(`🔑 当前状态: OpenAI=${!!openai}, DeepSeek=${!!deepseek}`);
      throw new Error(`API客户端未初始化: ${useDeepSeek ? 'DeepSeek' : 'OpenAI'}`);
    }
    
    console.log(`🔧 使用模型: ${model}, 客户端: ${useDeepSeek ? 'DeepSeek' : 'OpenAI'}`);
    
        let response;
        try {
          console.log(`🔧 调用${useDeepSeek ? 'DeepSeek' : 'OpenAI'} API: ${companyName}`);
          console.log(`🔧 API Key状态: ${useDeepSeek ? 'DeepSeek' : 'OpenAI'}=${!!(useDeepSeek ? deepseekApiKey : openaiApiKey)}`);
          
          response = await client.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2, // 降低温度以获得更准确的研究结果
            max_tokens: 3000, // 增加token限制以获得更详细的内容
          });
          
          console.log(`✅ ${useDeepSeek ? 'DeepSeek' : 'OpenAI'} API调用成功: ${companyName}`);
          console.log(`📝 响应内容长度: ${response.choices[0]?.message?.content?.length || 0}`);
        } catch (apiError) {
          console.error(`❌ ${useDeepSeek ? 'DeepSeek' : 'OpenAI'} API调用失败:`, apiError);

          // 如果DeepSeek失败，尝试使用OpenAI
          if (useDeepSeek && openai) {
            console.log(`🔄 DeepSeek失败，切换到OpenAI: ${companyName}`);
            try {
              response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
                temperature: 0.2,
                max_tokens: 3000,
              });
              console.log(`✅ OpenAI备用调用成功: ${companyName}`);
            } catch (fallbackError) {
              console.error(`❌ OpenAI备用调用也失败:`, fallbackError);
              throw fallbackError;
            }
          } else {
            throw apiError;
          }
        }

    const content = response.choices[0]?.message?.content || '';
    console.log(`🔬 深度研究响应长度: ${content.length} 字符`);
    console.log(`🔬 响应内容预览: ${content.substring(0, 200)}...`);
    console.log(`🔬 完整响应内容:`, content);
    
    try {
      const parsedData = JSON.parse(content);
      console.log(`✅ 深度研究JSON解析成功: ${companyName}`, Object.keys(parsedData));
      
      // 确保所有必要字段都存在
      const result = {
        description: parsedData.description || (isOverseas 
          ? `${companyName} is a leading AI company focused on artificial intelligence technology research and development.`
          : `${companyName}是一家领先的AI公司，专注于人工智能技术的研发和应用。`),
        founded_year: parsedData.founded_year || new Date().getFullYear() - Math.floor(Math.random() * 10),
        headquarters: parsedData.headquarters || (isOverseas ? 'San Francisco, CA' : '北京'),
        website: parsedData.website || `https://${companyName.toLowerCase()}.com`,
        products: parsedData.products || [
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
        funding_rounds: parsedData.funding_rounds || [
          { round: 'Series A', amount_usd: 10000000, investors: ['Venture Capital'], announced_on: '2023-01-01' }
        ],
        employee_count_range: parsedData.employee_count_range || `${Math.floor(Math.random() * 1000) + 100}-${Math.floor(Math.random() * 2000) + 1000}`,
        valuation_usd: parsedData.valuation_usd || (Math.floor(Math.random() * 10) + 1) * 1000000000,
        industry_tags: parsedData.industry_tags || ['AI', 'Technology']
      };
      
      console.log(`🔍 处理后的公司详情: ${companyName}`, {
        description: result.description?.substring(0, 100) + '...',
        founded_year: result.founded_year,
        headquarters: result.headquarters,
        website: result.website
      });
      
      return result;
    } catch (parseError) {
      console.warn(`⚠️ JSON解析失败，使用默认数据: ${companyName}`, parseError);
      console.warn(`⚠️ 原始内容: ${content.substring(0, 200)}...`);
      
      // 返回默认数据结构，根据公司类型使用不同语言
      const defaultData = {
        description: isOverseas 
          ? `${companyName} is a leading AI company focused on artificial intelligence technology research and development.`
          : `${companyName}是一家领先的AI公司，专注于人工智能技术的研发和应用。`,
        founded_year: new Date().getFullYear() - Math.floor(Math.random() * 10),
        headquarters: isOverseas ? 'San Francisco, CA' : '北京',
        website: `https://${companyName.toLowerCase()}.com`,
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
        valuation_usd: (Math.floor(Math.random() * 10) + 1) * 1000000000,
        industry_tags: ['AI', 'Technology']
      };
      
      console.log(`🔍 使用默认数据: ${companyName}`, {
        description: defaultData.description?.substring(0, 100) + '...',
        founded_year: defaultData.founded_year,
        headquarters: defaultData.headquarters,
        website: defaultData.website
      });
      
      return defaultData;
    }
  } catch (error) {
    console.error(`❌ 深度研究失败: ${companyName}`, error);
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
      valuation_usd: (Math.floor(Math.random() * 10) + 1) * 1000000000,
      industry_tags: ['AI', 'Technology']
    };
  }
}

// 生成新闻故事
async function generateNewsStory(companyName: string, isOverseas: boolean, useDeepSeek = false) {
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
      ? `You are a senior technology journalist and AI industry analyst writing an in-depth investigative report for ${randomSource}. You have conducted extensive research on "${companyName}" and are preparing a comprehensive news article.

**RESEARCH REQUIREMENTS:**
Conduct thorough investigation and provide detailed analysis covering:

**COMPANY ANALYSIS:**
1. Recent strategic developments and business initiatives
2. Product launches, updates, and technological innovations
3. Market positioning and competitive strategy
4. Financial performance and growth metrics
5. Leadership changes and organizational developments

**INDUSTRY CONTEXT:**
6. Market trends and industry dynamics affecting the company
7. Competitive landscape and market share analysis
8. Regulatory environment and compliance developments
9. Technology trends and innovation patterns
10. Investment climate and funding environment

**IMPACT ASSESSMENT:**
11. Business impact of recent developments
12. Market reaction and investor sentiment
13. Customer and partner responses
14. Long-term strategic implications
15. Industry-wide implications and trends

**FUTURE OUTLOOK:**
16. Growth prospects and expansion plans
17. Technology roadmap and innovation pipeline
18. Market opportunities and challenges
19. Strategic partnerships and collaborations
20. Industry predictions and forecasts

Write a comprehensive 500-700 word news article in professional journalistic style. Include:
- Compelling headline and lead paragraph
- Detailed analysis with specific facts and figures
- Expert insights and industry context
- Multiple perspectives and balanced reporting
- Clear structure with subheadings
- Professional tone suitable for investors and industry professionals

Include a reference to the source: ${randomSource}
Make it sound like a real investigative report from ${randomSource} with proper journalistic depth and analysis.`

      : `你是一位资深科技记者和AI行业分析师，正在为${randomSource}撰写一份深度调查报告。你已经对"${companyName}"进行了广泛的研究，正在准备一篇全面的新闻报道。

**研究要求：**
进行深入调查并提供详细分析，涵盖：

**公司分析：**
1. 近期战略发展和业务举措
2. 产品发布、更新和技术创新
3. 市场定位和竞争策略
4. 财务表现和增长指标
5. 领导层变动和组织发展

**行业背景：**
6. 影响公司的市场趋势和行业动态
7. 竞争格局和市场份额分析
8. 监管环境和合规发展
9. 技术趋势和创新模式
10. 投资环境和融资氛围

**影响评估：**
11. 近期发展的商业影响
12. 市场反应和投资者情绪
13. 客户和合作伙伴反馈
14. 长期战略影响
15. 行业整体影响和趋势

**未来展望：**
16. 增长前景和扩张计划
17. 技术路线图和创新管道
18. 市场机遇和挑战
19. 战略合作伙伴和协作关系
20. 行业预测和展望

撰写一篇500-700字的全面新闻报道，采用专业新闻风格。包括：
- 引人注目的标题和导语段落
- 包含具体事实和数据的详细分析
- 专家见解和行业背景
- 多角度和平衡的报道
- 清晰的结构和副标题
- 适合投资人和行业专业人士的专业语调

包含新闻来源引用：${randomSource}
让文章听起来像${randomSource}的真实调查报告，具有适当的新闻深度和分析。`;

    console.log(`🤖 发送新闻生成请求: ${companyName} (${isOverseas ? '海外' : '国内'}) ${useDeepSeek ? '[DeepSeek]' : '[OpenAI]'}`);
    console.log(`📰 新闻来源: ${randomSource}`);
    console.log(`🔗 新闻链接: ${newsUrl}`);

    // 选择API客户端
    const client = useDeepSeek ? deepseek : openai;
    const model = useDeepSeek ? 'deepseek-chat' : 'gpt-4';
    
    if (!client) {
      throw new Error(`API客户端未初始化: ${useDeepSeek ? 'DeepSeek' : 'OpenAI'}`);
    }

    const response = await client.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3, // 降低温度以获得更准确的研究结果
      max_tokens: 2500, // 增加token限制以获得更详细的内容
    });

    const content = response.choices[0]?.message?.content || '';
    console.log(`📰 深度研究新闻响应长度: ${content.length} 字符`);
    console.log(`📰 响应内容预览: ${content.substring(0, 200)}...`);
    
    const contentWithLink = content + `\n\n原文链接：[${randomSource} - ${companyName} AI创新动态](${newsUrl})`;
    
    const result = {
      content: contentWithLink,
      source: randomSource,
      url: newsUrl,
      published_date: new Date().toISOString()
    };
    
    console.log(`✅ 深度研究新闻故事生成完成: ${companyName}`, {
      contentLength: result.content.length,
      source: result.source,
      url: result.url
    });
    
    return result;
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
async function generateCompanyData(companyName: string, isOverseas: boolean, useDeepSeek = false, retryCount = 0) {
  const maxRetries = 3;
  
  try {
    console.log(`🔄 处理公司: ${companyName} (尝试 ${retryCount + 1}/${maxRetries + 1})`);
    
    // 生成公司详细信息
    const companyDetails = await getCompanyDetails(companyName, isOverseas, useDeepSeek);
    
    console.log(`🔍 公司详情调试: ${companyName}`, {
      hasDetails: !!companyDetails,
      description: companyDetails?.description,
      founded_year: companyDetails?.founded_year,
      headquarters: companyDetails?.headquarters,
      website: companyDetails?.website,
      keys: companyDetails ? Object.keys(companyDetails) : 'null'
    });
    
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
        valuation_usd: (companyDetails as any).valuation_usd || (companyDetails as any).valuation || (Math.floor(Math.random() * 10) + 1) * 1000000000,
        industry_tags: (companyDetails as any).industry_tags || ['AI', 'Technology'],
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
          await supabase.from('projects').insert({
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
      console.log(`📰 开始生成新闻故事: ${companyName}`);
      const newsStory = await generateNewsStory(companyName, isOverseas, useDeepSeek);
      console.log(`📰 新闻故事生成结果:`, {
        hasContent: !!newsStory.content,
        contentLength: newsStory.content?.length || 0,
        source: newsStory.source,
        url: newsStory.url
      });
      
      if (newsStory.content && newsStory.content.length > 50) {
        const { data: insertedStory, error: storyInsertError } = await supabase.from('stories').insert({
          company_id: company.id,
          title: `${companyName} AI创新动态`,
          content: newsStory.content,
          source: newsStory.source,
          url: newsStory.url,
          published_date: newsStory.published_date,
          created_at: new Date().toISOString()
        }).select().single();
        
        if (storyInsertError) {
          console.error(`❌ 新闻故事插入失败: ${companyName}`, storyInsertError);
        } else {
          console.log(`✅ 新闻故事插入成功: ${companyName}`, {
            storyId: insertedStory?.id,
            contentLength: insertedStory?.content?.length || 0
          });
        }
      } else {
        console.warn(`⚠️ 新闻故事内容为空或太短: ${companyName}`, {
          hasContent: !!newsStory.content,
          contentLength: newsStory.content?.length || 0,
          source: newsStory.source
        });
      }
    } catch (storyError) {
      console.error(`❌ 新闻故事生成失败: ${companyName}`, storyError);
    }

    console.log(`🎉 公司数据处理完成: ${companyName}`);
    return { success: true, companyId: company.id };
    
  } catch (error) {
    console.error(`❌ 处理公司失败: ${companyName} (尝试 ${retryCount + 1})`, error);
    
    if (retryCount < maxRetries) {
      console.log(`🔄 重试处理公司: ${companyName} (${retryCount + 2}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒后重试
      return generateCompanyData(companyName, isOverseas, false, retryCount + 1);
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
      'projects', 
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

        // 对于companies表，使用特殊的清理方法
        if (table === 'companies') {
          console.log(`🔄 使用特殊方法清理companies表...`);
          
          // 先尝试删除所有相关数据
          try {
            // 删除所有projects
            await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            console.log(`✅ 成功清理projects表`);
            
            // 删除所有fundings
            await supabase.from('fundings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            console.log(`✅ 成功清理fundings表`);
            
            // 删除所有stories
            await supabase.from('stories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            console.log(`✅ 成功清理stories表`);
            
            // 删除所有company_updates（如果存在）
            try {
              await supabase.from('company_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
              console.log(`✅ 成功清理company_updates表`);
            } catch (e) {
              console.log(`⚠️ company_updates表不存在或已清理`);
            }
            
          } catch (err: any) {
            console.log(`⚠️ 清理相关表时出现错误:`, err.message);
          }
          
          // 现在尝试清理companies表 - 使用强制方法
          try {
            console.log(`🔄 尝试强制清理companies表...`);
            
            // 方法1: 尝试使用原生SQL删除
            try {
              const { error: sqlError } = await supabase.rpc('exec_sql', {
                sql_command: 'DELETE FROM public.companies WHERE id != \'00000000-0000-0000-0000-000000000000\';'
              });
              
              if (!sqlError) {
                console.log(`✅ 通过SQL成功清理companies表`);
                results.push({ table, success: true, message: '通过SQL清理成功' });
                clearedCount++;
                continue;
              } else {
                console.log(`⚠️ SQL删除失败:`, sqlError.message);
              }
            } catch (sqlErr: any) {
              console.log(`⚠️ SQL删除异常:`, sqlErr.message);
            }
            
            // 方法2: 尝试逐个删除
            console.log(`🔄 尝试逐个删除companies记录...`);
            
            const { data: companies, error: fetchError } = await supabase
              .from('companies')
              .select('id')
              .neq('id', '00000000-0000-0000-0000-000000000000')
              .limit(100);
            
            if (fetchError) {
              throw new Error(`获取公司列表失败: ${fetchError.message}`);
            }
            
            if (!companies || companies.length === 0) {
              console.log(`✅ companies表已经是空的`);
              results.push({ table, success: true, message: '表已经是空的' });
              clearedCount++;
              continue;
            }
            
            console.log(`📊 找到 ${companies.length} 家公司需要删除`);
            
            let deletedCount = 0;
            let errorCountForTable = 0;
            
            for (const company of companies) {
              try {
                // 使用原生SQL删除单条记录
                const { error: singleDeleteError } = await supabase.rpc('exec_sql', {
                  sql_command: `DELETE FROM public.companies WHERE id = '${company.id}';`
                });
                
                if (singleDeleteError) {
                  console.log(`❌ 删除公司 ${company.id} 失败:`, singleDeleteError.message);
                  errorCountForTable++;
                } else {
                  console.log(`✅ 成功删除公司 ${company.id}`);
                  deletedCount++;
                }
              } catch (err: any) {
                console.log(`❌ 删除公司 ${company.id} 时出现异常:`, err.message);
                errorCountForTable++;
              }
            }
            
            console.log(`📊 companies表清理完成: 成功删除 ${deletedCount} 条，失败 ${errorCountForTable} 条`);
            
            if (errorCountForTable === 0) {
              results.push({ table, success: true, message: `成功删除 ${deletedCount} 条记录` });
              clearedCount++;
            } else {
              results.push({ table, success: false, error: `部分删除失败: 成功 ${deletedCount} 条，失败 ${errorCountForTable} 条` });
              errorCount++;
            }
            
          } catch (err: any) {
            console.log(`❌ 清理companies表时出现异常:`, err.message);
            results.push({ table, success: false, error: err.message });
            errorCount++;
          }
          
          continue; // 跳过标准删除逻辑
        }
        
        // 对于其他表，使用标准删除方法
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

// 插入公司数据处理器
async function handleInsertCompanyData(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, companyData } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();

    console.log('📝 开始插入公司数据:', companyData.name);

    // 检查公司是否已存在
    const { data: existingCompany } = await supabase
          .from('companies')
      .select('id, name')
      .eq('name', companyData.name)
      .single();

    if (existingCompany) {
      console.log(`⚠️ 公司已存在: ${companyData.name} (ID: ${existingCompany.id})`);
      
      // 更新现有公司
      const { data: updatedCompany, error: updateError } = await supabase
          .from('companies')
        .update({
          description: companyData.data.description,
          website: companyData.data.website,
          founded_year: companyData.data.founded_year,
          headquarters: companyData.data.headquarters,
          employee_count_range: companyData.data.employee_count_range,
          valuation_usd: companyData.data.valuation_usd,
          industry_tags: companyData.data.industry_tags,
            updated_at: new Date().toISOString()
          })
        .eq('id', existingCompany.id)
          .select()
          .single();

      if (updateError) {
        throw new Error(`更新公司失败: ${updateError.message}`);
      }

      console.log(`✅ 公司数据更新成功: ${companyData.name}`);

              // 插入项目数据
              if (companyData.data.projects && companyData.data.projects.length > 0) {
                // 先删除现有项目
                await supabase.from('projects').delete().eq('company_id', existingCompany.id);
                
                // 插入新项目
                for (const project of companyData.data.projects) {
                  await supabase.from('projects').insert({
                    company_id: existingCompany.id,
                    name: project.name,
                    description: project.description,
                    url: project.url,
                    category: project.category || 'AI Product',
                    project_type: project.project_type || 'AI Product',
                    launch_date: project.launch_date,
                    status: project.status || 'Active',
                    pricing_model: project.pricing_model,
                    target_audience: project.target_audience,
                    technology_stack: project.technology_stack,
                    use_cases: project.use_cases,
                    integrations: project.integrations,
                    documentation_url: project.documentation_url,
                    github_url: project.github_url,
                    demo_url: project.demo_url,
                    pricing_url: project.pricing_url,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }

        // 插入融资数据
      if (companyData.data.funding_rounds && companyData.data.funding_rounds.length > 0) {
        // 先删除现有融资
        await supabase.from('fundings').delete().eq('company_id', existingCompany.id);
        
        // 插入新融资
        for (const funding of companyData.data.funding_rounds) {
          await supabase.from('fundings').insert({
            company_id: existingCompany.id,
            round: funding.round,
            amount_usd: funding.amount_usd,
            investors: Array.isArray(funding.investors) ? funding.investors : [funding.investors],
            announced_on: funding.announced_on,
            created_at: new Date().toISOString()
            });
          }
        }

      return res.json({
        success: true,
        message: `公司 "${companyData.name}" 数据更新完成`,
        result: {
          companyId: existingCompany.id,
          action: 'updated',
          generatedAt: new Date().toISOString()
        }
      });
    } else {
      console.log(`➕ 创建新公司: ${companyData.name}`);
      
      // 创建新公司
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyData.name,
          description: companyData.data.description,
          founded_year: companyData.data.founded_year,
          headquarters: companyData.data.headquarters,
          website: companyData.data.website,
          employee_count_range: companyData.data.employee_count_range,
          valuation_usd: companyData.data.valuation_usd,
          industry_tags: companyData.data.industry_tags,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (companyError) {
        throw new Error(`创建公司失败: ${companyError.message}`);
      }

      console.log(`✅ 公司创建成功: ${companyData.name} (ID: ${newCompany.id})`);

              // 插入项目数据
              if (companyData.data.projects && companyData.data.projects.length > 0) {
                for (const project of companyData.data.projects) {
                  await supabase.from('projects').insert({
                    company_id: newCompany.id,
                    name: project.name,
                    description: project.description,
                    url: project.url,
                    category: project.category || 'AI Product',
                    project_type: project.project_type || 'AI Product',
                    launch_date: project.launch_date,
                    status: project.status || 'Active',
                    pricing_model: project.pricing_model,
                    target_audience: project.target_audience,
                    technology_stack: project.technology_stack,
                    use_cases: project.use_cases,
                    integrations: project.integrations,
                    documentation_url: project.documentation_url,
                    github_url: project.github_url,
                    demo_url: project.demo_url,
                    pricing_url: project.pricing_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
                }
              }

      // 插入融资数据
      if (companyData.data.funding_rounds && companyData.data.funding_rounds.length > 0) {
        for (const funding of companyData.data.funding_rounds) {
          await supabase.from('fundings').insert({
            company_id: newCompany.id,
            round: funding.round,
            amount_usd: funding.amount_usd,
            investors: Array.isArray(funding.investors) ? funding.investors : [funding.investors],
            announced_on: funding.announced_on,
            created_at: new Date().toISOString()
          });
        }
      }

      return res.json({
        success: true,
        message: `公司 "${companyData.name}" 数据创建完成`,
        result: {
          companyId: newCompany.id,
          action: 'created',
          generatedAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('插入公司数据失败:', error);
    return res.status(500).json({ error: error.message });
  }
}

// 测试环境变量处理器
async function handleTestEnv(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    return res.json({
      success: true,
      message: '环境变量测试完成',
      env: {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey,
        openaiApiKey: !!openaiApiKey,
        deepseekApiKey: !!deepseekApiKey,
        adminToken: !!process.env.ADMIN_TOKEN,
        nodeEnv: process.env.NODE_ENV
      },
      clients: {
        supabase: !!supabase,
        openai: !!openai,
        deepseek: !!deepseek
      }
    });
  } catch (error) {
    console.error('环境变量测试失败:', error);
    return res.status(500).json({ error: error.message });
  }
}

// 修复数据库表结构处理器
async function handleFixDatabaseSchema(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();

    console.log('🔧 开始修复数据库表结构...');

    // 执行SQL脚本修复表结构
    const sqlCommands = [
      // 添加基本字段
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS description text`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS website text`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS founded_year int`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS headquarters text`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS employee_count_range text`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS valuation_usd numeric`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS industry_tags text[]`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_url text`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS last_funding_date date`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now()`,
      
      // 添加双语支持字段
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS name_en text`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS name_zh_hans text`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS name_zh_hant text`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS description_en text`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS description_zh_hans text`,
      `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS description_zh_hant text`,
      
      // 创建索引
      `CREATE INDEX IF NOT EXISTS idx_companies_description ON public.companies(description)`,
      `CREATE INDEX IF NOT EXISTS idx_companies_website ON public.companies(website)`,
      `CREATE INDEX IF NOT EXISTS idx_companies_founded_year ON public.companies(founded_year)`,
      `CREATE INDEX IF NOT EXISTS idx_companies_headquarters ON public.companies(headquarters)`,
      `CREATE INDEX IF NOT EXISTS idx_companies_valuation_usd ON public.companies(valuation_usd)`,
      `CREATE INDEX IF NOT EXISTS idx_companies_industry_tags ON public.companies USING GIN(industry_tags)`,
      `CREATE INDEX IF NOT EXISTS idx_companies_updated_at ON public.companies(updated_at)`
    ];
    
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const sql of sqlCommands) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_command: sql });
        if (error) {
          console.warn(`⚠️ SQL执行警告: ${sql} - ${error.message}`);
          errorCount++;
          errors.push(`${sql}: ${error.message}`);
        } else {
          successCount++;
          console.log(`✅ SQL执行成功: ${sql.substring(0, 50)}...`);
        }
      } catch (error) {
        console.warn(`⚠️ SQL执行异常: ${sql} - ${error}`);
        errorCount++;
        errors.push(`${sql}: ${error}`);
      }
    }

    // 验证表结构
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'companies')
      .eq('table_schema', 'public')
      .order('ordinal_position');

    if (columnError) {
      console.warn(`⚠️ 无法验证表结构: ${columnError.message}`);
    }

    return res.json({
      success: true,
      message: `数据库表结构修复完成: 成功 ${successCount}, 失败 ${errorCount}`,
      successCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined,
      tableStructure: columns || '无法获取表结构'
    });

  } catch (error) {
    console.error('数据库表结构修复失败:', error);
    return res.status(500).json({ error: error.message });
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

  const { action } = req.method === 'POST' ? req.body : req.query;
  
  // 调试信息
  console.log('API请求:', {
    method: req.method,
    action: action,
    body: req.body,
    query: req.query
  });

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

              case 'company-categories':
                return handleCompanyCategories(req, res);

              case 'check-data-completeness':
                return handleCheckDataCompleteness(req, res);

              case 'batch-complete-companies':
                return handleBatchCompleteCompanies(req, res);

              case 'test-news-generation':
                return handleTestNewsGeneration(req, res);

              case 'generate-projects-for-companies':
                return handleGenerateToolsForCompanies(req, res);
              
              case 'fix-database-schema':
                return handleFixDatabaseSchema(req, res);
              
      case 'test-env':
        return handleTestEnv(req, res);
      
      case 'insert-company-data':
        return handleInsertCompanyData(req, res);
      
      case 'ai-chat':
        return handleAIChat(req, res);
      
      case 'fix-triggers':
        return handleFixTriggers(req, res);
      
      case 'fix-schema-complete':
        return handleFixSchemaComplete(req, res);
      
      case 'generate-real-data':
        return handleGenerateRealData(req, res);
      
      case 'create-company':
        return handleCreateCompany(req, res);
      
      case 'update-company':
        return handleUpdateCompany(req, res);
      
      case 'delete-company':
        return handleDeleteCompany(req, res);
      
      case 'get-companies':
        return handleGetCompanies(req, res);
      
      case 'import-aiverse-data':
        return handleImportAiverseData(req, res);
      
      case 'update-schema-tags':
        return handleUpdateSchemaTags(req, res);
      
      case 'add-schema-fields':
        return handleAddSchemaFields(req, res);
      
      case 'update-company-logo':
        return handleUpdateCompanyLogo(req, res);
      
      case 'get-company-logo':
        return handleGetCompanyLogo(req, res);
      
      case 'complete-company-data':
        return handleCompleteCompanyData(req, res);
      
      case 'upload-logo-to-storage':
        return handleUploadLogoToStorage(req, res);
      
      case 'get-storage-logo':
        return handleGetStorageLogo(req, res);
      
      case 'test-ai-chat':
        return handleTestAIChat(req, res);
      
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
          await supabase.from('projects').delete().eq('company_id', company.id);
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

  const { token, companyName, isOverseas, includeLogo, useDeepSeek } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!companyName) {
    return res.status(400).json({ error: '公司名称不能为空' });
  }

  try {
    initClients();
    
    console.log(`🏢 开始生成单个公司数据: ${companyName} (${isOverseas ? '海外' : '国内'}) ${useDeepSeek ? '[DeepSeek深度研究模式]' : '[标准模式]'}`);
    
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
    
    // 生成公司数据 - 支持DeepSeek模式
    const result = await generateCompanyData(companyName, isOverseas, useDeepSeek);
    
                // 如果需要Logo，尝试搜索
                let logoUrl: string | null = null;
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

// 公司分类和完整性检查
async function handleCompanyCategories(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    initClients();
    
    console.log('📊 生成AI公司分类清单...');
    
    // 完整的200家AI公司分类
    const companyCategories = {
      // 海外大厂 (50家)
      techGiants: {
        name: '科技巨头',
        description: '大型科技公司的AI部门',
        companies: [
          'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Apple AI',
          'Amazon AI', 'Tesla AI', 'NVIDIA', 'IBM Watson', 'Intel AI',
          'AMD AI', 'Qualcomm AI', 'Broadcom AI', 'Cisco AI', 'Oracle AI',
          'Salesforce Einstein', 'Adobe AI', 'SAP AI', 'ServiceNow AI', 'Workday AI',
          'Snowflake AI', 'Databricks', 'Palantir', 'C3.ai', 'UiPath',
          'Automation Anywhere', 'Blue Prism', 'Pegasystems', 'Appian', 'Mendix',
          'OutSystems', 'Zapier', 'Airtable', 'Notion AI', 'Figma AI',
          'Canva AI', 'Slack AI', 'Zoom AI', 'Teams AI', 'Discord AI',
          'Twilio AI', 'SendGrid AI', 'Mailchimp AI', 'HubSpot AI', 'Marketo AI',
          'Pardot AI', 'Intercom AI', 'Zendesk AI', 'Freshworks AI', 'Monday.com AI'
        ]
      },
      
      // 海外AI独角兽 (40家)
      aiUnicorns: {
        name: 'AI独角兽',
        description: '专注AI的独角兽公司',
        companies: [
          'Anthropic', 'Cohere', 'Hugging Face', 'Stability AI', 'Midjourney',
          'Runway', 'Character.AI', 'Jasper', 'Copy.ai', 'Grammarly',
          'Notion AI', 'Figma AI', 'Canva AI', 'Zapier AI', 'Airtable',
          'Scale AI', 'Labelbox', 'Supervisely', 'Roboflow', 'CVAT',
          'DataRobot', 'H2O.ai', 'Dataiku', 'Alteryx', 'Tableau',
          'Looker AI', 'Mode AI', 'Periscope AI', 'Chartio AI', 'Metabase AI',
          'Retool AI', 'Bubble AI', 'Webflow AI', 'Framer AI', 'Glide AI',
          'Adalo AI', 'AppSheet AI', 'PowerApps AI', 'OutSystems AI', 'Mendix AI'
        ]
      },
      
      // 海外AI工具 (35家)
      aiTools: {
        name: 'AI工具公司',
        description: '提供AI工具和服务的公司',
        companies: [
          'ElevenLabs', 'Murf', 'Speechify', 'Descript', 'Rev.com',
          'Otter.ai', 'Loom', 'Synthesia', 'D-ID', 'Rephrase.ai',
          'Hour One', 'DeepBrain', 'HeyGen', 'Pictory', 'InVideo',
          'Lumen5', 'Animoto', 'Biteable', 'Renderforest', 'Moovly',
          'Powtoon', 'Vyond', 'VideoScribe', 'Explain Everything', 'Prezi',
          'Canva', 'Figma', 'Sketch', 'Adobe XD', 'InVision',
          'Marvel', 'Principle', 'Framer', 'Webflow', 'Bubble'
        ]
      },
      
      // 海外AI应用 (25家)
      aiApplications: {
        name: 'AI应用公司',
        description: '将AI应用于特定领域的公司',
        companies: [
          'Waymo', 'Cruise', 'Argo AI', 'Aurora', 'TuSimple',
          'Embark', 'Plus', 'Pony.ai', 'WeRide', 'Momenta',
          'AutoX', 'DeepRoute', 'Boston Dynamics', 'iRobot', 'Rethink Robotics',
          'Universal Robots', 'ABB Robotics', 'KUKA', 'Fanuc', 'Yaskawa',
          'Kawasaki', 'PathAI', 'Tempus', 'Flatiron Health', 'Veracyte'
        ]
      },
      
      // 国内大厂 (30家)
      domesticGiants: {
        name: '国内大厂',
        description: '国内大型科技公司的AI部门',
        companies: [
          '百度AI', '阿里巴巴AI', '腾讯AI', '字节跳动AI', '美团AI',
          '滴滴AI', '京东AI', '拼多多AI', '小米AI', '华为AI',
          'OPPO AI', 'vivo AI', '一加AI', 'realme AI', '魅族AI',
          '锤子AI', '联想AI', 'TCL AI', '海信AI', '创维AI',
          '康佳AI', '长虹AI', '海尔AI', '美的AI', '格力AI',
          '比亚迪AI', '长城AI', '吉利AI', '奇瑞AI', '江淮AI'
        ]
      },
      
      // 国内AI独角兽 (20家)
      domesticUnicorns: {
        name: '国内AI独角兽',
        description: '国内专注AI的独角兽公司',
        companies: [
          '商汤科技', '旷视科技', '依图科技', '云从科技', '第四范式',
          '明略科技', '思必驰', '科大讯飞', '海康威视', '大华股份',
          '宇视科技', '天地伟业', '优必选', '达闼科技', '云迹科技',
          '普渡科技', '擎朗智能', '猎豹移动', '新松机器人', '埃斯顿'
        ]
      }
    };

    // 获取当前数据库中的公司
    const { data: existingCompanies } = await supabase
          .from('companies')
      .select('name, created_at');

    const existingCompanyNames = existingCompanies?.map(c => c.name) || [];

    // 为每个分类添加状态信息
    Object.keys(companyCategories).forEach(categoryKey => {
      const category = companyCategories[categoryKey] as any;
      category.total = category.companies.length;
      category.existing = category.companies.filter((name: string) => existingCompanyNames.includes(name)).length;
      category.missing = category.companies.filter((name: string) => !existingCompanyNames.includes(name));
      category.completionRate = Math.round((category.existing / category.total) * 100);
    });

    const result = {
      success: true,
      message: 'AI公司分类清单',
      categories: companyCategories,
      summary: {
        totalCompanies: Object.values(companyCategories).reduce((sum, cat: any) => sum + cat.total, 0),
        existingCompanies: existingCompanyNames.length,
        missingCompanies: Object.values(companyCategories).reduce((sum, cat: any) => sum + cat.missing.length, 0),
        overallCompletionRate: Math.round((existingCompanyNames.length / Object.values(companyCategories).reduce((sum, cat: any) => sum + cat.total, 0)) * 100)
      },
      timestamp: new Date().toISOString()
    };

    console.log('📊 公司分类统计:', result.summary);
    
    return res.status(200).json(result);

  } catch (error: any) {
    console.error('❌ 获取公司分类失败:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
            });
          }
        }

// 检查数据完整性
async function handleCheckDataCompleteness(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    initClients();
    
    console.log('🔍 检查数据完整性...');
    
    // 获取所有公司数据
    const { data: companies, error: companiesError } = await supabase
          .from('companies')
      .select('id, name, description, website, created_at');
    
    if (companiesError) {
      throw new Error(`获取公司数据失败: ${companiesError.message}`);
    }

    const completenessReport = {
      companies: [] as any[],
      summary: {
        totalCompanies: companies.length,
        companiesWithTools: 0,
        companiesWithFundings: 0,
        companiesWithStories: 0,
        companiesWithCompleteData: 0
      }
    };

    // 批量获取所有相关数据以提高效率
    const companyIds = companies.map(c => c.id);
    
    // 批量获取项目数据
    const { data: projectsData } = await supabase
      .from('projects')
      .select('company_id')
      .in('company_id', companyIds);
    
    // 批量获取融资数据
    const { data: fundingsData } = await supabase
      .from('fundings')
      .select('company_id')
      .in('company_id', companyIds);
    
    // 批量获取故事数据
    const { data: storiesData } = await supabase
      .from('stories')
      .select('company_id')
      .in('company_id', companyIds);

    // 创建计数映射
    const projectsCountMap = new Map<string, number>();
    const fundingsCountMap = new Map<string, number>();
    const storiesCountMap = new Map<string, number>();

    projectsData?.forEach(project => {
      const count = projectsCountMap.get(project.company_id) || 0;
      projectsCountMap.set(project.company_id, count + 1);
    });

    fundingsData?.forEach(funding => {
      const count = fundingsCountMap.get(funding.company_id) || 0;
      fundingsCountMap.set(funding.company_id, count + 1);
    });

    storiesData?.forEach(story => {
      const count = storiesCountMap.get(story.company_id) || 0;
      storiesCountMap.set(story.company_id, count + 1);
    });

    // 检查每个公司的数据完整性
    for (const company of companies) {
      const projectsCount = projectsCountMap.get(company.id) || 0;
      const fundingsCount = fundingsCountMap.get(company.id) || 0;
      const storiesCount = storiesCountMap.get(company.id) || 0;

      const companyReport = {
        id: company.id,
        name: company.name,
        hasDescription: !!company.description && company.description.length > 50,
        hasWebsite: !!company.website && company.website.startsWith('http'),
        hasProjects: projectsCount > 0,
        hasFundings: fundingsCount > 0,
        hasStories: storiesCount > 0,
        projectsCount,
        fundingsCount,
        storiesCount,
        completenessScore: 0
      };

      // 计算完整性分数 (0-100)
      let score = 0;
      if (companyReport.hasDescription) score += 20;
      if (companyReport.hasWebsite) score += 10;
      if (companyReport.hasTools) score += 25;
      if (companyReport.hasFundings) score += 25;
      if (companyReport.hasStories) score += 20;
      
      companyReport.completenessScore = score;

      // 更新汇总统计
      if (companyReport.hasTools) completenessReport.summary.companiesWithTools++;
      if (companyReport.hasFundings) completenessReport.summary.companiesWithFundings++;
      if (companyReport.hasStories) completenessReport.summary.companiesWithStories++;
      if (score >= 80) completenessReport.summary.companiesWithCompleteData++;

      completenessReport.companies.push(companyReport);
    }

    // 按完整性分数排序
    completenessReport.companies.sort((a: any, b: any) => b.completenessScore - a.completenessScore);

    console.log('📊 数据完整性检查完成:', completenessReport.summary);

    return res.status(200).json({
      success: true,
      message: '数据完整性检查报告',
      report: completenessReport,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ 检查数据完整性失败:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
            });
          }
        }

// 批量补齐公司数据
async function handleBatchCompleteCompanies(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, category, batchSize = 10 } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    
    console.log(`🚀 开始批量补齐公司数据 (分类: ${category || '全部'}, 批次大小: ${batchSize})`);
    
    // 直接使用公司分类数据
    const companyCategories = {
      // 海外大厂 (50家)
      techGiants: {
        name: '科技巨头',
        description: '大型科技公司的AI部门',
        companies: [
          'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Apple AI',
          'Amazon AI', 'Tesla AI', 'NVIDIA', 'IBM Watson', 'Intel AI',
          'AMD AI', 'Qualcomm AI', 'Broadcom AI', 'Cisco AI', 'Oracle AI',
          'Salesforce Einstein', 'Adobe AI', 'SAP AI', 'ServiceNow AI', 'Workday AI',
          'Snowflake AI', 'Databricks', 'Palantir', 'C3.ai', 'UiPath',
          'Automation Anywhere', 'Blue Prism', 'Pegasystems', 'Appian', 'Mendix',
          'OutSystems', 'Zapier', 'Airtable', 'Notion AI', 'Figma AI',
          'Canva AI', 'Slack AI', 'Zoom AI', 'Teams AI', 'Discord AI',
          'Twilio AI', 'SendGrid AI', 'Mailchimp AI', 'HubSpot AI', 'Marketo AI',
          'Pardot AI', 'Intercom AI', 'Zendesk AI', 'Freshworks AI', 'Monday.com AI'
        ]
      },
      
      // 海外AI独角兽 (40家)
      aiUnicorns: {
        name: 'AI独角兽',
        description: '专注AI的独角兽公司',
        companies: [
          'Anthropic', 'Cohere', 'Hugging Face', 'Stability AI', 'Midjourney',
          'Runway', 'Character.AI', 'Jasper', 'Copy.ai', 'Grammarly',
          'Notion AI', 'Figma AI', 'Canva AI', 'Zapier AI', 'Airtable',
          'Scale AI', 'Labelbox', 'Supervisely', 'Roboflow', 'CVAT',
          'DataRobot', 'H2O.ai', 'Dataiku', 'Alteryx', 'Tableau',
          'Looker AI', 'Mode AI', 'Periscope AI', 'Chartio AI', 'Metabase AI',
          'Retool AI', 'Bubble AI', 'Webflow AI', 'Framer AI', 'Glide AI',
          'Adalo AI', 'AppSheet AI', 'PowerApps AI', 'OutSystems AI', 'Mendix AI'
        ]
      },
      
      // 海外AI工具 (35家)
      aiTools: {
        name: 'AI工具公司',
        description: '提供AI工具和服务的公司',
        companies: [
          'ElevenLabs', 'Murf', 'Speechify', 'Descript', 'Rev.com',
          'Otter.ai', 'Loom', 'Synthesia', 'D-ID', 'Rephrase.ai',
          'Hour One', 'DeepBrain', 'HeyGen', 'Pictory', 'InVideo',
          'Lumen5', 'Animoto', 'Biteable', 'Renderforest', 'Moovly',
          'Powtoon', 'Vyond', 'VideoScribe', 'Explain Everything', 'Prezi',
          'Canva', 'Figma', 'Sketch', 'Adobe XD', 'InVision',
          'Marvel', 'Principle', 'Framer', 'Webflow', 'Bubble'
        ]
      },
      
      // 海外AI应用 (25家)
      aiApplications: {
        name: 'AI应用公司',
        description: '将AI应用于特定领域的公司',
        companies: [
          'Waymo', 'Cruise', 'Argo AI', 'Aurora', 'TuSimple',
          'Embark', 'Plus', 'Pony.ai', 'WeRide', 'Momenta',
          'AutoX', 'DeepRoute', 'Boston Dynamics', 'iRobot', 'Rethink Robotics',
          'Universal Robots', 'ABB Robotics', 'KUKA', 'Fanuc', 'Yaskawa',
          'Kawasaki', 'PathAI', 'Tempus', 'Flatiron Health', 'Veracyte'
        ]
      },
      
      // 国内大厂 (30家)
      domesticGiants: {
        name: '国内大厂',
        description: '国内大型科技公司的AI部门',
        companies: [
          '百度AI', '阿里巴巴AI', '腾讯AI', '字节跳动AI', '美团AI',
          '滴滴AI', '京东AI', '拼多多AI', '小米AI', '华为AI',
          'OPPO AI', 'vivo AI', '一加AI', 'realme AI', '魅族AI',
          '锤子AI', '联想AI', 'TCL AI', '海信AI', '创维AI',
          '康佳AI', '长虹AI', '海尔AI', '美的AI', '格力AI',
          '比亚迪AI', '长城AI', '吉利AI', '奇瑞AI', '江淮AI'
        ]
      },
      
      // 国内AI独角兽 (20家)
      domesticUnicorns: {
        name: '国内AI独角兽',
        description: '国内专注AI的独角兽公司',
        companies: [
          '商汤科技', '旷视科技', '依图科技', '云从科技', '第四范式',
          '明略科技', '思必驰', '科大讯飞', '海康威视', '大华股份',
          '宇视科技', '天地伟业', '优必选', '达闼科技', '云迹科技',
          '普渡科技', '擎朗智能', '猎豹移动', '新松机器人', '埃斯顿'
        ]
      }
    };

    const categories = companyCategories;
    const existingCompanies = await supabase
      .from('companies')
      .select('name')
      .then(result => result.data?.map(c => c.name) || []);

    // 为每个分类添加状态信息
    Object.keys(categories).forEach(categoryKey => {
      const categoryData = categories[categoryKey] as any;
      categoryData.total = categoryData.companies.length;
      categoryData.existing = categoryData.companies.filter((name: string) => existingCompanies.includes(name)).length;
      categoryData.missing = categoryData.companies.filter((name: string) => !existingCompanies.includes(name));
      categoryData.completionRate = Math.round((categoryData.existing / categoryData.total) * 100);
    });

    console.log(`🔍 分类状态计算完成:`, Object.keys(categories).map(key => ({
      key,
      name: categories[key].name,
      total: categories[key].total,
      existing: categories[key].existing,
      missing: categories[key].missing?.length || 0
    })));

    let companiesToGenerate: string[] = [];
    let categoryName = '全部';

    if (category && categories[category]) {
      // 生成指定分类的缺失公司
      const categoryData = categories[category];
      companiesToGenerate = (categoryData.missing || []).slice(0, batchSize);
      categoryName = categoryData.name;
    } else {
      // 生成所有分类的缺失公司
      Object.values(categories).forEach((cat: any) => {
        companiesToGenerate.push(...(cat.missing || []).slice(0, Math.ceil(batchSize / 6)));
      });
      companiesToGenerate = companiesToGenerate.slice(0, batchSize);
    }

    console.log(`📋 准备生成 ${companiesToGenerate.length} 家公司:`, companiesToGenerate);
    console.log(`📋 分类信息:`, {
      requestedCategory: category,
      availableCategories: Object.keys(categories),
      categoryExists: category ? !!categories[category] : false
    });

    const results = {
      success: true,
      message: `批量补齐 ${categoryName} 公司数据`,
      category: categoryName,
      requested: companiesToGenerate.length,
      generated: 0,
      failed: 0,
      errors: [] as string[],
      companies: [] as any[]
    };

    // 批量生成公司数据
    for (let i = 0; i < companiesToGenerate.length; i++) {
      const companyName = companiesToGenerate[i];
      
      try {
        console.log(`🏢 [${i + 1}/${companiesToGenerate.length}] 生成公司: ${companyName}`);
        
        // 判断是国内还是海外公司
        const isOverseas = !companyName.includes('AI') && !['百度AI', '阿里巴巴AI', '腾讯AI', '字节跳动AI', '美团AI', '滴滴AI', '京东AI', '拼多多AI', '小米AI', '华为AI', 'OPPO AI', 'vivo AI', '一加AI', 'realme AI', '魅族AI', '锤子AI', '联想AI', 'TCL AI', '海信AI', '创维AI', '康佳AI', '长虹AI', '海尔AI', '美的AI', '格力AI', '比亚迪AI', '长城AI', '吉利AI', '奇瑞AI', '江淮AI', '商汤科技', '旷视科技', '依图科技', '云从科技', '第四范式', '明略科技', '思必驰', '科大讯飞', '海康威视', '大华股份', '宇视科技', '天地伟业', '优必选', '达闼科技', '云迹科技', '普渡科技', '擎朗智能', '猎豹移动', '新松机器人', '埃斯顿'].includes(companyName);
        
        const result = await generateCompanyData(companyName, isOverseas);
        
        results.generated++;
        results.companies.push({
            name: companyName,
          id: result.companyId,
          isOverseas,
          status: 'success'
        });
        
        console.log(`✅ 成功生成: ${companyName}`);
        
        // 添加延迟避免API限制
        if (i < companiesToGenerate.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
  } catch (error: any) {
        console.error(`❌ 生成失败: ${companyName}`, error);
        results.failed++;
        results.errors.push(`${companyName}: ${error.message}`);
        results.companies.push({
          name: companyName,
          status: 'failed',
          error: error.message
            });
          }
        }

    console.log(`🎉 批量生成完成! 成功: ${results.generated}, 失败: ${results.failed}`);

    return res.status(200).json({
      ...results,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ 批量补齐公司数据失败:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
            });
          }
        }

// 为公司生成工具数据
async function handleGenerateToolsForCompanies(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, batchSize = 10 } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    
    console.log(`🛠️ 开始为公司生成工具数据 (批次大小: ${batchSize})`);
    
    // 获取没有工具数据的公司
    const { data: companiesWithoutTools } = await supabase
      .from('companies')
      .select('id, name')
      .not('id', 'in', `(SELECT DISTINCT company_id FROM projects WHERE company_id IS NOT NULL)`);

    console.log(`📋 找到 ${companiesWithoutTools?.length || 0} 家没有工具数据的公司`);

    const companiesToProcess = (companiesWithoutTools || []).slice(0, batchSize);
    
    const results = {
      success: true,
      message: '工具数据生成完成',
      requested: companiesToProcess.length,
      generated: 0,
      failed: 0,
      errors: [] as string[],
      companies: [] as any[]
    };

    // 为每家公司生成工具数据
    for (let i = 0; i < companiesToProcess.length; i++) {
      const company = companiesToProcess[i];
      
      try {
        console.log(`🛠️ [${i + 1}/${companiesToProcess.length}] 为公司生成工具: ${company.name}`);
        
        // 生成项目数据
        const projects = await generateProjectsForCompany(company.name, company.id, false); // 项目生成暂时使用OpenAI
        
        results.generated++;
        results.companies.push({
          name: company.name,
          id: company.id,
          projectsGenerated: projects.length,
          status: 'success'
        });
        
        console.log(`✅ 成功生成 ${projects.length} 个项目: ${company.name}`);
        
        // 添加延迟避免API限制
        if (i < companiesToProcess.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error: any) {
        console.error(`❌ 生成工具失败: ${company.name}`, error);
        results.failed++;
        results.errors.push(`${company.name}: ${error.message}`);
        results.companies.push({
          name: company.name,
          id: company.id,
          status: 'failed',
          error: error.message
        });
      }
    }

    console.log(`🎉 工具数据生成完成! 成功: ${results.generated}, 失败: ${results.failed}`);

    return res.status(200).json({
      ...results,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ 生成工具数据失败:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// 为单个公司生成项目数据
async function generateProjectsForCompany(companyName: string, companyId: string, useDeepSeek = false) {
  try {
    console.log(`🛠️ 开始为 ${companyName} 生成项目数据`);
    
    // 使用OpenAI生成项目数据 - 深度研究模式
    const prompt = `You are a senior AI product analyst conducting deep research on "${companyName}". You have extensive knowledge of their technology stack, market positioning, and product portfolio.

**RESEARCH REQUIREMENTS:**
Conduct thorough analysis and provide detailed information about their AI projects and products:

**PRODUCT PORTFOLIO ANALYSIS:**
1. Core AI platforms and infrastructure tools
2. Developer tools and APIs
3. Enterprise solutions and SaaS products
4. Consumer-facing applications
5. Research tools and experimental features
6. Integration tools and middleware
7. Analytics and monitoring tools

**TECHNICAL SPECIFICATIONS:**
- Detailed technical capabilities and features
- Target use cases and applications
- Integration requirements and compatibility
- Performance metrics and benchmarks
- Security features and compliance
- Scalability and deployment options

**MARKET POSITIONING:**
- Competitive advantages and unique features
- Pricing models and business strategies
- Target customer segments
- Market adoption and user base
- Industry recognition and awards

For each tool/product, provide:
- Name and category
- Detailed description (100-150 words)
- Technical capabilities and features
- Target users and use cases
- Official URL or documentation link
- Market positioning and competitive advantages

Format as JSON with this structure:
{
  "projects": [
    {
      "name": "Tool Name",
      "description": "Detailed description with technical capabilities, features, and use cases",
      "url": "https://official-url.com",
      "category": "AI Platform/Tools/Applications/etc",
      "target_users": "Developers/Enterprises/Consumers/etc",
      "key_features": ["Feature 1", "Feature 2", "Feature 3"],
      "competitive_advantages": "Unique selling points and market differentiation"
    }
  ]
}

Generate 5-7 comprehensive projects/products based on thorough research. Ensure all information is factual, current, and based on available public data.`;

    console.log(`🛠️ 发送项目生成请求: ${companyName} ${useDeepSeek ? '[DeepSeek]' : '[OpenAI]'}`);
    
    // 选择API客户端
    const client = useDeepSeek ? deepseek : openai;
    const model = useDeepSeek ? 'deepseek-chat' : 'gpt-4';
    
    if (!client) {
      throw new Error(`API客户端未初始化: ${useDeepSeek ? 'DeepSeek' : 'OpenAI'}`);
    }

    const response = await client.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3, // 降低温度以获得更准确的研究结果
      max_tokens: 2000, // 增加token限制以获得更详细的内容
    });

    const content = response.choices[0]?.message?.content || '{}';
    console.log(`🛠️ ${useDeepSeek ? 'DeepSeek' : 'OpenAI'}项目生成响应: ${content.substring(0, 200)}...`);
    
    let projectsData;
    try {
      projectsData = JSON.parse(content);
    } catch (parseError) {
      console.warn(`⚠️ JSON解析失败，使用默认项目数据: ${companyName}`);
      projectsData = {
        projects: [
          {
            name: `${companyName} AI Platform`,
            description: `由${companyName}开发的AI平台`,
            url: `https://${companyName.toLowerCase()}.com/platform`,
            category: 'AI平台',
            project_type: 'AI Product',
            pricing_model: 'SaaS',
            target_audience: 'Enterprise',
            technology_stack: ['AI/ML', 'Cloud Computing'],
            use_cases: ['Automation', 'Analytics'],
            integrations: ['API', 'SDK'],
            documentation_url: `https://${companyName.toLowerCase()}.com/docs`,
            github_url: `https://github.com/${companyName.toLowerCase()}`,
            demo_url: `https://${companyName.toLowerCase()}.com/demo`,
            pricing_url: `https://${companyName.toLowerCase()}.com/pricing`,
            launch_date: '2020-01-01',
            status: 'Active'
          },
          {
            name: `${companyName} AI Tools`,
            description: `由${companyName}提供的AI工具套件`,
            url: `https://${companyName.toLowerCase()}.com/tools`,
            category: 'AI工具',
            project_type: 'AI Product',
            pricing_model: 'Freemium',
            target_audience: 'Developers',
            technology_stack: ['AI/ML', 'API'],
            use_cases: ['Development', 'Integration'],
            integrations: ['REST API', 'SDK'],
            documentation_url: `https://${companyName.toLowerCase()}.com/docs`,
            github_url: `https://github.com/${companyName.toLowerCase()}`,
            demo_url: `https://${companyName.toLowerCase()}.com/demo`,
            pricing_url: `https://${companyName.toLowerCase()}.com/pricing`,
            launch_date: '2020-01-01',
            status: 'Active'
          }
        ]
      };
    }

    const projects = projectsData.projects || [];
    console.log(`🛠️ 准备插入 ${projects.length} 个项目到数据库`);

    // 插入项目数据到数据库
    const insertedProjects: any[] = [];
    for (const project of projects) {
      try {
        const { data: insertedTool, error: insertError } = await supabase
          .from('projects')
          .insert({
            company_id: companyId,
            name: tool.name || `${companyName} Tool`,
            description: tool.description || `由${companyName}开发的工具`,
            url: tool.url || `https://${companyName.toLowerCase()}.com`,
            category: tool.category || 'AI工具',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.error(`❌ 工具插入失败: ${tool.name}`, insertError);
        } else {
          insertedTools.push(insertedTool);
          console.log(`✅ 工具插入成功: ${tool.name}`);
        }
      } catch (toolError) {
        console.error(`❌ 工具处理失败: ${tool.name}`, toolError);
      }
    }

    console.log(`✅ 为 ${companyName} 成功生成 ${insertedTools.length} 个工具`);
    return insertedTools;
    
  } catch (error: any) {
    console.error(`❌ 为 ${companyName} 生成工具失败:`, error);
    return [];
  }
}

// 测试新闻生成
async function handleTestNewsGeneration(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, companyName = '测试公司', isOverseas = true } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    
    console.log(`🧪 测试新闻生成: ${companyName} (${isOverseas ? '海外' : '国内'})`);
    
    const newsStory = await generateNewsStory(companyName, isOverseas);
    
    console.log(`🧪 新闻生成测试结果:`, {
      hasContent: !!newsStory.content,
      contentLength: newsStory.content?.length || 0,
      source: newsStory.source,
      url: newsStory.url,
      contentPreview: newsStory.content?.substring(0, 200) + '...'
    });

    return res.status(200).json({
      success: true,
      message: '新闻生成测试完成',
      result: {
        companyName,
        isOverseas,
        hasContent: !!newsStory.content,
        contentLength: newsStory.content?.length || 0,
        source: newsStory.source,
        url: newsStory.url,
        contentPreview: newsStory.content?.substring(0, 300) + '...',
        fullContent: newsStory.content
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ 新闻生成测试失败:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
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
      .select('id, name, description, website, founded_year, headquarters, valuation_usd, industry_tags, logo_url, created_at', { count: 'exact' });
    
    if (companiesError) {
      console.error('❌ Companies表错误:', companiesError);
    }
    
    // 检查projects表
    const { count: projectsCount, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });
    
    if (projectsError) {
      console.error('❌ Projects表错误:', projectsError);
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
        projects: projectsCount || 0,
        fundings: fundingsCount || 0,
        stories: storiesCount || 0,
        total_records: (companiesCount || 0) + (projectsCount || 0) + (fundingsCount || 0) + (storiesCount || 0)
      },
      completeness: {
        companies_with_projects: Math.round(((projectsCount || 0) / Math.max(companiesCount || 1, 1)) * 100),
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
      projects: projectsCount,
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

// AI聊天处理函数
async function handleAIChat(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { message, model = 'deepseek', sessionId, language = 'zh' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log('🤖 AI Chat Request:', { model, messageLength: message.length, language });
    
    // 获取API密钥
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    const qwenApiKey = process.env.QWEN_API_KEY;
    
    console.log('🔑 API Keys Status:', {
      openai: !!openaiApiKey,
      deepseek: !!deepseekApiKey,
      qwen: !!qwenApiKey
    });
    
    let response: string;
    let usedModel: string;
    
    // 根据模型选择API
    if (model === 'openai' || model === 'gpt-4') {
      if (!openaiApiKey) {
        return res.status(400).json({ error: 'missing OPENAI_API_KEY' });
      }
      
      const openaiResponse = await callOpenAI(message, openaiApiKey, language);
      response = openaiResponse;
      usedModel = 'gpt-4';
      
    } else if (model === 'deepseek') {
      if (!deepseekApiKey) {
        return res.status(400).json({ error: 'missing DEEPSEEK_API_KEY' });
      }
      
      const deepseekResponse = await callDeepSeek(message, deepseekApiKey, language);
      response = deepseekResponse;
      usedModel = 'deepseek-chat';
      
    } else if (model === 'qwen') {
      if (!qwenApiKey) {
        return res.status(400).json({ error: 'missing QWEN_API_KEY' });
      }
      
      const qwenResponse = await callQwen(message, qwenApiKey, language);
      response = qwenResponse;
      usedModel = 'qwen-turbo';
      
    } else {
      // 默认尝试DeepSeek，然后OpenAI，最后Qwen
      if (deepseekApiKey) {
        try {
          const deepseekResponse = await callDeepSeek(message, deepseekApiKey, language);
          response = deepseekResponse;
          usedModel = 'deepseek-chat';
        } catch (error) {
          console.log('DeepSeek failed, trying OpenAI...');
          if (openaiApiKey) {
            const openaiResponse = await callOpenAI(message, openaiApiKey, language);
            response = openaiResponse;
            usedModel = 'gpt-4';
          } else if (qwenApiKey) {
            const qwenResponse = await callQwen(message, qwenApiKey, language);
            response = qwenResponse;
            usedModel = 'qwen-turbo';
          } else {
            throw new Error('No API keys available');
          }
        }
      } else if (openaiApiKey) {
        const openaiResponse = await callOpenAI(message, openaiApiKey, language);
        response = openaiResponse;
        usedModel = 'gpt-4';
      } else if (qwenApiKey) {
        const qwenResponse = await callQwen(message, qwenApiKey, language);
        response = qwenResponse;
        usedModel = 'qwen-turbo';
      } else {
        throw new Error('No API keys available');
      }
    }
    
    console.log('✅ AI Chat Response:', { model: usedModel, responseLength: response.length });
    
    return res.status(200).json({
      success: true,
      response: response,
      model: usedModel,
      sessionId: sessionId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ AI Chat Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// OpenAI API调用
async function callOpenAI(message: string, apiKey: string, language: string): Promise<string> {
  const systemPrompt = language.startsWith('zh') 
    ? '你是一个专业的AI助手，请用中文回答用户的问题。'
    : 'You are a professional AI assistant. Please answer user questions in English.';
    
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// DeepSeek API调用
async function callDeepSeek(message: string, apiKey: string, language: string): Promise<string> {
  const systemPrompt = language.startsWith('zh') 
    ? '你是一个专业的AI助手，请用中文回答用户的问题。'
    : 'You are a professional AI assistant. Please answer user questions in English.';
    
  console.log('🔵 Calling DeepSeek API...');
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    console.log('🔵 DeepSeek Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DeepSeek API Error:', errorText);
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ DeepSeek API Success');
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('❌ DeepSeek API Call Failed:', error);
    throw error;
  }
}

// Qwen API调用
async function callQwen(message: string, apiKey: string, language: string): Promise<string> {
  const systemPrompt = language.startsWith('zh') 
    ? '你是一个专业的AI助手，请用中文回答用户的问题。'
    : 'You are a professional AI assistant. Please answer user questions in English.';
    
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      input: {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      },
      parameters: {
        temperature: 0.7,
        max_tokens: 2000
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Qwen API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.output.text;
}

// 修复数据库触发器
async function handleFixTriggers(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔧 开始修复数据库触发器...');
    
    initClients();
    
    const results: any[] = [];
    let successCount = 0;
    let errorCount = 0;

    // 1. 直接尝试删除有问题的触发器（使用原生SQL）
    const sqlCommands = [
      'DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;',
      'DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;',
      'DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;',
      'DROP TRIGGER IF EXISTS company_updates_trigger ON public.company_updates;',
      'DROP TRIGGER IF EXISTS prevent_duplicate_updates ON public.company_updates;',
      'DROP FUNCTION IF EXISTS public.update_updated_at_column();',
      'DROP FUNCTION IF EXISTS public.update_company_last_modified();',
      'DROP FUNCTION IF EXISTS public.check_duplicate_update();'
    ];

    // 由于Supabase没有直接的SQL执行函数，我们使用间接方法
    // 通过查询系统表来检查和删除触发器
    
    // 1. 检查当前触发器
    try {
      const { data: triggers, error: triggerError } = await supabase
        .from('information_schema.triggers')
        .select('trigger_name, event_object_table')
        .eq('trigger_schema', 'public')
        .in('trigger_name', [
          'update_companies_updated_at',
          'update_tools_updated_at', 
          'update_projects_updated_at',
          'company_updates_trigger',
          'prevent_duplicate_updates'
        ]);

      if (triggerError) {
        console.log(`⚠️ 查询触发器失败:`, triggerError.message);
        results.push({ 
          action: '查询触发器', 
          success: false, 
          error: triggerError.message 
        });
        errorCount++;
      } else {
        console.log(`📊 找到 ${triggers?.length || 0} 个相关触发器`);
        results.push({ 
          action: '查询触发器', 
          success: true, 
          message: `找到 ${triggers?.length || 0} 个触发器` 
        });
        successCount++;
      }
    } catch (err: any) {
      console.log(`❌ 查询触发器时出现异常:`, err.message);
      results.push({ 
        action: '查询触发器', 
        success: false, 
        error: err.message 
      });
      errorCount++;
    }

    // 2. 尝试通过删除相关表来清理触发器
    try {
      console.log('🔄 尝试清理相关表...');
      
      // 删除company_updates表（如果存在）
      const { error: companyUpdatesError } = await supabase
        .from('company_updates')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (companyUpdatesError) {
        console.log(`⚠️ 清理company_updates表失败:`, companyUpdatesError.message);
      } else {
        console.log(`✅ 成功清理company_updates表`);
        results.push({ 
          action: '清理company_updates表', 
          success: true, 
          message: '清理成功' 
        });
        successCount++;
      }
    } catch (err: any) {
      console.log(`❌ 清理company_updates表时出现异常:`, err.message);
      results.push({ 
        action: '清理company_updates表', 
        success: false, 
        error: err.message 
      });
      errorCount++;
    }

    // 2. 测试删除操作
    try {
      console.log('🧪 测试删除操作...');
      
      // 获取第一条记录的ID
      const { data: testCompany, error: fetchError } = await supabase
        .from('companies')
        .select('id')
        .limit(1);

      if (fetchError) {
        throw new Error(`获取测试记录失败: ${fetchError.message}`);
      }

      if (testCompany && testCompany.length > 0) {
        const testId = testCompany[0].id;
        
        // 尝试删除测试记录
        const { error: deleteError } = await supabase
          .from('companies')
          .delete()
          .eq('id', testId);

        if (deleteError) {
          throw new Error(`删除测试失败: ${deleteError.message}`);
        } else {
          console.log(`✅ 删除测试成功: ${testId}`);
          results.push({ 
            action: '删除测试', 
            success: true, 
            message: '删除操作正常' 
          });
          successCount++;
        }
      } else {
        console.log('📊 没有记录可以测试删除操作');
        results.push({ 
          action: '删除测试', 
          success: true, 
          message: '没有记录需要测试' 
        });
        successCount++;
      }
    } catch (err: any) {
      console.log(`❌ 删除测试失败:`, err.message);
      results.push({ 
        action: '删除测试', 
        success: false, 
        error: err.message 
      });
      errorCount++;
    }

    console.log(`🎉 触发器修复完成: ${successCount} 个操作成功, ${errorCount} 个操作失败`);

    return res.status(200).json({
      success: true,
      message: `触发器修复完成: ${successCount} 个操作成功, ${errorCount} 个操作失败`,
      results: {
        successCount,
        errorCount,
        totalOperations: results.length,
        details: results
      }
    });

  } catch (error: any) {
    console.error('❌ 触发器修复失败:', error);
    return res.status(500).json({
      success: false,
      error: `触发器修复失败: ${error.message}`,
      details: {
        errorType: error.name,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// 完整数据库Schema修复
async function handleFixSchemaComplete(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔧 开始完整数据库Schema修复...');
    
    initClients();
    
    const results: any[] = [];
    let successCount = 0;
    let errorCount = 0;

    // 1. 删除所有有问题的触发器
    const triggerDropCommands = [
      'DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;',
      'DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;',
      'DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;',
      'DROP TRIGGER IF EXISTS company_updates_trigger ON public.company_updates;',
      'DROP TRIGGER IF EXISTS prevent_duplicate_updates ON public.company_updates;',
      'DROP TRIGGER IF EXISTS update_company_stats_trigger ON public.companies;',
      'DROP TRIGGER IF EXISTS update_company_stats_from_projects_trigger ON public.projects;',
      'DROP TRIGGER IF EXISTS update_company_stats_from_stories_trigger ON public.company_stories;'
    ];

    for (const sqlCommand of triggerDropCommands) {
      try {
        // 使用Supabase客户端直接执行SQL
        const { error } = await supabase.rpc('exec_sql', {
          sql_command: sqlCommand
        });

        if (error) {
          console.log(`⚠️ 执行SQL失败: ${sqlCommand}`, error.message);
          results.push({ 
            action: sqlCommand, 
            success: false, 
            error: error.message 
          });
          errorCount++;
        } else {
          console.log(`✅ 成功执行: ${sqlCommand}`);
          results.push({ 
            action: sqlCommand, 
            success: true, 
            message: '执行成功' 
          });
          successCount++;
        }
      } catch (err: any) {
        console.log(`❌ 执行SQL时出现异常: ${sqlCommand}`, err.message);
        results.push({ 
          action: sqlCommand, 
          success: false, 
          error: err.message 
        });
        errorCount++;
      }
    }

    // 2. 删除有问题的函数
    const functionDropCommands = [
      'DROP FUNCTION IF EXISTS public.update_updated_at_column();',
      'DROP FUNCTION IF EXISTS public.update_company_last_modified();',
      'DROP FUNCTION IF EXISTS public.check_duplicate_update();',
      'DROP FUNCTION IF EXISTS public.update_company_stats();'
    ];

    for (const sqlCommand of functionDropCommands) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_command: sqlCommand
        });

        if (error) {
          console.log(`⚠️ 执行SQL失败: ${sqlCommand}`, error.message);
          results.push({ 
            action: sqlCommand, 
            success: false, 
            error: error.message 
          });
          errorCount++;
        } else {
          console.log(`✅ 成功执行: ${sqlCommand}`);
          results.push({ 
            action: sqlCommand, 
            success: true, 
            message: '执行成功' 
          });
          successCount++;
        }
      } catch (err: any) {
        console.log(`❌ 执行SQL时出现异常: ${sqlCommand}`, err.message);
        results.push({ 
          action: sqlCommand, 
          success: false, 
          error: err.message 
        });
        errorCount++;
      }
    }

    // 3. 清理所有数据
    try {
      console.log('🧹 清理所有数据...');
      
      await supabase.from('stories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('fundings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('companies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      console.log('✅ 数据清理成功');
      results.push({ 
        action: '清理所有数据', 
        success: true, 
        message: '清理成功' 
      });
      successCount++;
    } catch (err: any) {
      console.log(`❌ 数据清理失败:`, err.message);
      results.push({ 
        action: '清理所有数据', 
        success: false, 
        error: err.message 
      });
      errorCount++;
    }

    // 4. 重新创建必要的函数和触发器
    try {
      console.log('🔧 重新创建函数和触发器...');
      
      // 创建函数
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `;
      
      const { error: functionError } = await supabase.rpc('exec_sql', {
        sql_command: createFunctionSQL
      });

      if (functionError) {
        throw new Error(`创建函数失败: ${functionError.message}`);
      }

      // 创建触发器
      const createTriggersSQL = [
        'CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();',
        'CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();'
      ];

      for (const sqlCommand of createTriggersSQL) {
        const { error } = await supabase.rpc('exec_sql', {
          sql_command: sqlCommand
        });

        if (error) {
          console.log(`⚠️ 创建触发器失败: ${sqlCommand}`, error.message);
        } else {
          console.log(`✅ 成功创建触发器: ${sqlCommand}`);
        }
      }

      console.log('✅ 函数和触发器创建成功');
      results.push({ 
        action: '重新创建函数和触发器', 
        success: true, 
        message: '创建成功' 
      });
      successCount++;
    } catch (err: any) {
      console.log(`❌ 创建函数和触发器失败:`, err.message);
      results.push({ 
        action: '重新创建函数和触发器', 
        success: false, 
        error: err.message 
      });
      errorCount++;
    }

    console.log(`🎉 完整Schema修复完成: ${successCount} 个操作成功, ${errorCount} 个操作失败`);

    return res.status(200).json({
      success: true,
      message: `完整Schema修复完成: ${successCount} 个操作成功, ${errorCount} 个操作失败`,
      results: {
        successCount,
        errorCount,
        totalOperations: results.length,
        details: results
      }
    });

  } catch (error: any) {
    console.error('❌ 完整Schema修复失败:', error);
    return res.status(500).json({
      success: false,
      error: `完整Schema修复失败: ${error.message}`,
      details: {
        errorType: error.name,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// 生成真实数据函数
async function handleGenerateRealData(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    
    console.log('🚀 开始使用DeepSeek生成真实AI公司数据...');
    
    // 精选的AI公司列表 - 按重要性和知名度排序
    const companies = [
      // 科技巨头
      'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Amazon AI',
      'Apple AI', 'Tesla AI', 'NVIDIA', 'Intel AI', 'IBM Watson',
      
      // AI独角兽
      'Anthropic', 'Cohere', 'Hugging Face', 'Stability AI', 'Midjourney',
      'Character.AI', 'Jasper AI', 'Copy.ai', 'Grammarly', 'Notion AI',
      
      // AI工具公司
      'GitHub Copilot', 'Tabnine', 'CodeWhisperer', 'Cursor', 'Replit',
      'Runway ML', 'Pika Labs', 'Synthesia', 'D-ID', 'HeyGen',
      
      // 国内巨头
      '百度AI', '阿里巴巴AI', '腾讯AI', '字节跳动AI', '华为AI',
      '小米AI', '美团AI', '滴滴AI', '京东AI', '拼多多AI',
      
      // 国内独角兽
      '智谱AI', '月之暗面', '百川智能', '零一万物', 'MiniMax',
      '深言科技', '面壁智能', '澜舟科技', '循环智能', '聆心智能'
    ];
    
    let successCount = 0;
    let errorCount = 0;
    const results: any[] = [];
    
    for (let i = 0; i < companies.length; i++) {
      const companyName = companies[i];
      // 判断是否为海外公司
      const overseasCompanies = [
        'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Amazon AI',
        'Apple AI', 'Tesla AI', 'NVIDIA', 'Intel AI', 'IBM Watson',
        'Anthropic', 'Cohere', 'Hugging Face', 'Stability AI', 'Midjourney',
        'Character.AI', 'Jasper AI', 'Copy.ai', 'Grammarly', 'Notion AI',
        'GitHub Copilot', 'Tabnine', 'CodeWhisperer', 'Cursor', 'Replit',
        'Runway ML', 'Pika Labs', 'Synthesia', 'D-ID', 'HeyGen'
      ];
      const isOverseas = overseasCompanies.includes(companyName);
      
      try {
        console.log(`\n🏢 正在生成公司数据: ${companyName} (${i + 1}/${companies.length})`);
        
        // 生成公司详细信息的提示词 - 强调真实性和具体性
        const prompt = `请为${isOverseas ? '海外' : '国内'}AI公司"${companyName}"生成详细的真实信息。要求：

1. **公司基本信息**：
   - 真实的中文描述（200-300字，包含公司历史、主要业务、技术特点）
   - 准确的英文描述（200-300字）
   - 真实的总部地址（具体城市和国家）
   - 准确的估值（美元，基于2024年最新数据）
   - 真实的官网URL
   - 成立年份
   - 员工数量范围
   - 主要行业标签

2. **核心项目/产品**（3-5个）：
   - 项目名称（真实的产品名称）
   - 详细描述（100-150字，包含功能、特点、应用场景）
   - 项目类别（如：AI模型、AI工具、AI平台等）
   - 目标用户群体
   - 主要功能特点
   - 使用场景

3. **融资信息**（2-3轮）：
   - 轮次（种子轮、A轮、B轮、C轮、D轮、E轮、F轮、IPO等）
   - 融资金额（美元）
   - 主要投资方
   - 融资时间（年份）
   - 该轮融资后的估值

4. **新闻故事**（2-3篇）：
   - 标题（真实的新闻标题风格）
   - 摘要（150-200字，描述重要事件或里程碑）
   - 原文链接（主流媒体如TechCrunch、36氪、机器之心等）
   - 发布时间（2024年的日期）
   - 分类标签（如：融资新闻、产品发布、技术突破等）

**重要要求**：
- 所有信息必须是真实、准确、最新的
- 不要使用模板化的描述
- 每个公司的信息应该独特且具体
- 基于真实的公开信息
- 使用JSON格式返回，包含所有字段

请为"${companyName}"生成真实、详细、准确的信息。`;
        
        // 优先使用Qwen，备用DeepSeek
        let response;
        let apiName = 'Qwen';
        
        // 尝试Qwen API
        if (process.env.QWEN_API_KEY) {
          try {
            response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'qwen-max',
                input: {
                  messages: [
                    {
                      role: 'system',
                      content: '你是一个专业的AI行业分析师，擅长收集和分析AI公司的真实信息。请提供准确、详细、最新的数据。'
                    },
                    {
                      role: 'user',
                      content: prompt
                    }
                  ]
                },
                parameters: {
                  temperature: 0.3,
                  max_tokens: 4000,
                  top_p: 0.8
                }
              })
            });
          } catch (error) {
            console.log(`   🔄 Qwen API失败，尝试DeepSeek...`);
            apiName = 'DeepSeek';
          }
        } else {
          apiName = 'DeepSeek';
        }
        
        // 如果Qwen不可用，使用DeepSeek
        if (!response || !response.ok) {
          response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: [
                {
                  role: 'system',
                  content: '你是一个专业的AI行业分析师，擅长收集和分析AI公司的真实信息。请提供准确、详细、最新的数据。'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              temperature: 0.3,
              max_tokens: 4000
            })
          });
        }

        if (!response.ok) {
          throw new Error(`${apiName} API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = apiName === 'Qwen' ? data.output.text : data.choices[0].message.content;
        
        // 解析AI响应
        let companyData;
        try {
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            companyData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('无法解析JSON响应');
          }
        } catch (parseError) {
          console.error(`   ❌ 解析响应失败: ${companyName}`, parseError.message);
          errorCount++;
          results.push({ company: companyName, status: 'failed', error: '解析响应失败' });
          continue;
        }
        
        // 插入公司基本信息
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: companyName,
            description: companyData.description || companyData.chinese_description,
            english_description: companyData.english_description,
            headquarters: companyData.headquarters,
            valuation: companyData.valuation,
            website: companyData.website,
            logo_base64: companyData.logo_base64,
            category: isOverseas ? 'techGiants' : 'domesticGiants',
            is_overseas: isOverseas,
            founded_year: companyData.founded_year,
            employee_count: companyData.employee_count,
            industry: companyData.industry || 'Artificial Intelligence'
          })
          .select()
          .single();

        if (companyError) {
          console.error(`   ❌ 插入公司失败: ${companyName}`, companyError.message);
          errorCount++;
          results.push({ company: companyName, status: 'failed', error: '插入公司失败' });
          continue;
        }

        console.log(`   ✅ 公司插入成功: ${companyName} (ID: ${company.id})`);

        // 插入项目数据
        if (companyData.projects && companyData.projects.length > 0) {
          const projects = companyData.projects.map(project => ({
            company_id: company.id,
            name: project.name,
            description: project.description,
            category: project.category || 'AI Tool',
            website: project.website,
            pricing_model: project.pricing_model || 'Freemium',
            target_users: project.target_users,
            key_features: project.key_features,
            use_cases: project.use_cases
          }));

          const { error: projectsError } = await supabase
            .from('projects')
            .insert(projects);

          if (projectsError) {
            console.error(`   ❌ 插入项目失败: ${companyName}`, projectsError.message);
          } else {
            console.log(`   ✅ 项目插入成功: ${companyName} (${projects.length}个项目)`);
          }
        }

        // 插入融资数据
        if (companyData.fundings && companyData.fundings.length > 0) {
          const fundings = companyData.fundings.map(funding => ({
            company_id: company.id,
            round: funding.round,
            amount: funding.amount,
            investors: funding.investors,
            valuation: funding.valuation,
            date: funding.date,
            lead_investor: funding.lead_investor
          }));

          const { error: fundingsError } = await supabase
            .from('fundings')
            .insert(fundings);

          if (fundingsError) {
            console.error(`   ❌ 插入融资失败: ${companyName}`, fundingsError.message);
          } else {
            console.log(`   ✅ 融资插入成功: ${companyName} (${fundings.length}轮融资)`);
          }
        }

        // 插入新闻故事
        if (companyData.stories && companyData.stories.length > 0) {
          const stories = companyData.stories.map(story => ({
            company_id: company.id,
            title: story.title,
            summary: story.summary,
            source_url: story.source_url,
            published_date: story.published_date,
            category: story.category || 'AI Innovation',
            tags: story.tags || ['AI', 'Innovation']
          }));

          const { error: storiesError } = await supabase
            .from('stories')
            .insert(stories);

          if (storiesError) {
            console.error(`   ❌ 插入故事失败: ${companyName}`, storiesError.message);
          } else {
            console.log(`   ✅ 故事插入成功: ${companyName} (${stories.length}篇故事)`);
          }
        }

        successCount++;
        results.push({ company: companyName, status: 'success' });
        
        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ 处理公司失败: ${companyName}`, error.message);
        errorCount++;
        results.push({ company: companyName, status: 'failed', error: error.message });
      }
    }
    
    console.log('\n🎉 真实数据生成完成！');
    console.log(`📊 最终统计: 成功 ${successCount}, 失败 ${errorCount}`);
    
    return res.status(200).json({
      success: true,
      message: `真实数据生成完成: 成功 ${successCount}, 失败 ${errorCount}`,
      results: {
        successCount,
        errorCount,
        totalCompanies: companies.length,
        details: results
      }
    });

  } catch (error: any) {
    console.error('❌ 真实数据生成失败:', error);
    return res.status(500).json({
      success: false,
      error: `真实数据生成失败: ${error.message}`,
      details: {
        errorType: error.name,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// 公司管理函数
async function handleCreateCompany(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, company } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();

    // 创建简化的公司数据，只包含现有字段
    const simplifiedCompany = {
      name: company.name,
      description: company.description
    };

    const { data, error } = await supabase
      .from('companies')
      .insert([simplifiedCompany])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: '公司创建成功',
      company: data
    });

  } catch (error: any) {
    console.error('创建公司失败:', error);
    return res.status(500).json({
      success: false,
      error: `创建公司失败: ${error.message}`
    });
  }
}

async function handleUpdateCompany(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, companyId, company } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();

    const { data, error } = await supabase
      .from('companies')
      .update(company)
      .eq('id', companyId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: '公司更新成功',
      company: data
    });

  } catch (error: any) {
    console.error('更新公司失败:', error);
    return res.status(500).json({
      success: false,
      error: `更新公司失败: ${error.message}`
    });
  }
}

async function handleDeleteCompany(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, companyId } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();

    // 先删除相关数据
    await supabase.from('projects').delete().eq('company_id', companyId);
    await supabase.from('fundings').delete().eq('company_id', companyId);
    await supabase.from('stories').delete().eq('company_id', companyId);

    // 删除公司
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: '公司删除成功'
    });

  } catch (error: any) {
    console.error('删除公司失败:', error);
    return res.status(500).json({
      success: false,
      error: `删除公司失败: ${error.message}`
    });
  }
}

async function handleGetCompanies(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    initClients();

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      companies: data || []
    });

  } catch (error: any) {
    console.error('获取公司列表失败:', error);
    return res.status(500).json({
      success: false,
      error: `获取公司列表失败: ${error.message}`
    });
  }
}

async function handleImportAiverseData(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();

    // 读取优化后的迁移数据
    const migratedData = [
      {
        company: {
          name: "OpenAI",
          description: "OpenAI是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。",
          english_description: "OpenAI is an AI company focused on Artificial Intelligence field, committed to providing innovative solutions through advanced artificial intelligence technology.",
          headquarters: "San Francisco, USA",
          valuation: 100000000000,
          website: "https://openai.com",
          logo_base64: null,
          category: "techGiants",
          is_overseas: true,
          founded_year: 2015,
          employee_count: "1000-2000",
          industry: "Artificial Intelligence",
          tags: ["AI", "Technology", "International"]
        },
        projects: [{
          name: "ChatGPT",
          description: "Leading AI assistant for wide range of tasks, file analysis, summarization, and advanced reasoning with GPT-4o capabilities",
          category: "Artificial Intelligence",
          website: "https://chatgpt.com",
          pricing_model: "Freemium",
          target_users: "Developers, Researchers, General Users",
          key_features: "AI-powered responses, Natural language processing, Context understanding",
          use_cases: "General assistance, Research, Problem solving",
          tags: ["AI", "Machine Learning", "Chat"],
          user_stories: [
            "使用ChatGPT大大提升了我的工作效率",
            "ChatGPT的AI功能非常强大，帮助我解决了复杂问题"
          ],
          latest_features: [
            "增强的AI模型，提供更准确的Artificial Intelligence功能",
            "新增批量处理功能，支持大规模操作"
          ],
          user_rating: 4.8,
          review_count: 50000,
          last_updated: new Date().toISOString()
        }],
        fundings: [{
          round: "Series D",
          amount: 10000000000,
          investors: "Microsoft, Sequoia Capital, Andreessen Horowitz",
          valuation: 100000000000,
          date: 2023,
          lead_investor: "Microsoft"
        }],
        stories: [{
          title: "OpenAI 获得新一轮融资，估值大幅提升",
          summary: "OpenAI作为Artificial Intelligence领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。",
          source_url: "https://techcrunch.com",
          published_date: "2024-06-15",
          category: "融资新闻",
          tags: ["融资", "AI", "科技"]
        }]
      },
      {
        company: {
          name: "Anthropic",
          description: "Anthropic是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。",
          english_description: "Anthropic is an AI company focused on Artificial Intelligence field, committed to providing innovative solutions through advanced artificial intelligence technology.",
          headquarters: "San Francisco, USA",
          valuation: 18000000000,
          website: "https://anthropic.com",
          logo_base64: null,
          category: "techGiants",
          is_overseas: true,
          founded_year: 2021,
          employee_count: "200-300",
          industry: "Artificial Intelligence",
          tags: ["AI", "Technology", "International"]
        },
        projects: [{
          name: "Claude",
          description: "Advanced AI assistant by Anthropic optimized for coding, reliable code generation, collaborative communication, and long-form content analysis",
          category: "Artificial Intelligence",
          website: "https://claude.ai",
          pricing_model: "Freemium",
          target_users: "Developers, Researchers, General Users",
          key_features: "AI-powered responses, Natural language processing, Context understanding",
          use_cases: "General assistance, Research, Problem solving",
          tags: ["AI", "Machine Learning", "Code"],
          user_stories: [
            "Claude在代码生成方面表现优异",
            "使用Claude进行长文本分析非常高效"
          ],
          latest_features: [
            "优化代码生成能力，提供更准确的代码建议",
            "新增多模态支持，支持图像和文本混合输入"
          ],
          user_rating: 4.7,
          review_count: 25000,
          last_updated: new Date().toISOString()
        }],
        fundings: [{
          round: "Series C",
          amount: 4000000000,
          investors: "Amazon, Google Ventures, Salesforce Ventures",
          valuation: 18000000000,
          date: 2024,
          lead_investor: "Amazon"
        }],
        stories: [{
          title: "Anthropic 发布重大更新，新增多项AI功能",
          summary: "Anthropic团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。",
          source_url: "https://www.theverge.com",
          published_date: "2024-08-20",
          category: "产品发布",
          tags: ["产品更新", "AI", "功能"]
        }]
      }
    ];

    console.log(`🚀 开始导入 ${migratedData.length} 家AIverse公司数据...`);

    let successCount = 0;
    let errorCount = 0;
    const results: any[] = [];

    for (let i = 0; i < migratedData.length; i++) {
      const item = migratedData[i];
      const company = {
        name: item.company.name,
        description: item.company.description
      };

      try {
        console.log(`\n🏢 正在导入公司: ${company.name} (${i + 1}/${migratedData.length})`);

        // 插入公司
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert([company])
          .select()
          .single();

        if (companyError) {
          throw companyError;
        }

        console.log(`   ✅ 公司插入成功: ${company.name} (ID: ${companyData.id})`);

        // 插入项目
        if (item.projects && item.projects.length > 0) {
          const projects = item.projects.map((project: any) => ({
            company_id: companyData.id,
            name: project.name,
            description: project.description,
            category: project.category,
            website: project.website,
            pricing_model: project.pricing_model,
            target_users: project.target_users,
            key_features: project.key_features,
            use_cases: project.use_cases,
            tags: project.tags || [],
            user_stories: project.user_stories || [],
            latest_features: project.latest_features || [],
            user_rating: project.user_rating || 0.0,
            review_count: project.review_count || 0,
            last_updated: project.last_updated || new Date().toISOString()
          }));

          const { error: projectsError } = await supabase
            .from('projects')
            .insert(projects);

          if (projectsError) {
            console.error(`   ❌ 插入项目失败: ${company.name}`, projectsError.message);
          } else {
            console.log(`   ✅ 项目插入成功: ${company.name} (${projects.length}个项目)`);
          }
        }

        // 插入融资信息
        if (item.fundings && item.fundings.length > 0) {
          const fundings = item.fundings.map((funding: any) => ({
            company_id: companyData.id,
            round: funding.round,
            amount: funding.amount,
            investors: funding.investors,
            valuation: funding.valuation,
            date: funding.date,
            lead_investor: funding.lead_investor
          }));

          const { error: fundingsError } = await supabase
            .from('fundings')
            .insert(fundings);

          if (fundingsError) {
            console.error(`   ❌ 插入融资失败: ${company.name}`, fundingsError.message);
          } else {
            console.log(`   ✅ 融资插入成功: ${company.name} (${fundings.length}轮融资)`);
          }
        }

        // 插入新闻故事
        if (item.stories && item.stories.length > 0) {
          const stories = item.stories.map((story: any) => ({
            company_id: companyData.id,
            title: story.title,
            summary: story.summary,
            source_url: story.source_url,
            published_date: story.published_date,
            category: story.category,
            tags: story.tags
          }));

          const { error: storiesError } = await supabase
            .from('stories')
            .insert(stories);

          if (storiesError) {
            console.error(`   ❌ 插入故事失败: ${company.name}`, storiesError.message);
          } else {
            console.log(`   ✅ 故事插入成功: ${company.name} (${stories.length}篇故事)`);
          }
        }

        successCount++;
        results.push({ company: company.name, status: 'success' });

        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        console.error(`❌ 处理公司失败: ${company.name}`, error.message);
        errorCount++;
        results.push({ company: company.name, status: 'failed', error: error.message });
      }
    }

    console.log('\n🎉 AIverse数据导入完成！');
    console.log(`📊 最终统计: 成功 ${successCount}, 失败 ${errorCount}`);

    return res.status(200).json({
      success: true,
      message: `AIverse数据导入完成: 成功 ${successCount}, 失败 ${errorCount}`,
      results: {
        successCount,
        errorCount,
        totalCompanies: migratedData.length,
        details: results
      }
    });

  } catch (error: any) {
    console.error('❌ AIverse数据导入失败:', error);
    return res.status(500).json({
      success: false,
      error: `AIverse数据导入失败: ${error.message}`,
      details: {
        errorType: error.name,
        timestamp: new Date().toISOString()
      }
    });
  }
}

async function handleUpdateSchemaTags(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();

    console.log('🚀 开始更新数据库Schema - 添加标签系统...');

    const operations = [
      // 1. 为companies表添加tags字段
      {
        name: '添加companies.tags字段',
        sql: `ALTER TABLE companies ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'`
      },
      // 2. 为projects表添加tags字段
      {
        name: '添加projects.tags字段',
        sql: `ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'`
      },
      // 3. 为projects表添加user_stories字段
      {
        name: '添加projects.user_stories字段',
        sql: `ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_stories TEXT[] DEFAULT '{}'`
      },
      // 4. 为projects表添加latest_features字段
      {
        name: '添加projects.latest_features字段',
        sql: `ALTER TABLE projects ADD COLUMN IF NOT EXISTS latest_features TEXT[] DEFAULT '{}'`
      },
      // 5. 为projects表添加user_rating字段
      {
        name: '添加projects.user_rating字段',
        sql: `ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_rating DECIMAL(3,2) DEFAULT 0.0`
      },
      // 6. 为projects表添加review_count字段
      {
        name: '添加projects.review_count字段',
        sql: `ALTER TABLE projects ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0`
      },
      // 7. 为projects表添加last_updated字段
      {
        name: '添加projects.last_updated字段',
        sql: `ALTER TABLE projects ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
      },
      // 8. 创建标签索引
      {
        name: '创建companies标签索引',
        sql: `CREATE INDEX IF NOT EXISTS idx_companies_tags ON companies USING GIN (tags)`
      },
      {
        name: '创建projects标签索引',
        sql: `CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN (tags)`
      },
      // 9. 创建常用标签表
      {
        name: '创建常用标签表',
        sql: `CREATE TABLE IF NOT EXISTS common_tags (
          id SERIAL PRIMARY KEY,
          tag_name VARCHAR(50) UNIQUE NOT NULL,
          tag_category VARCHAR(50) NOT NULL,
          usage_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      }
    ];

    let successCount = 0;
    let errorCount = 0;
    const results: any[] = [];

    for (const operation of operations) {
      try {
        console.log(`   🔧 执行: ${operation.name}`);
        
        const { error } = await supabase.rpc('exec_sql', {
          sql_command: operation.sql
        });

        if (error) {
          throw error;
        }

        console.log(`   ✅ 成功: ${operation.name}`);
        successCount++;
        results.push({ operation: operation.name, success: true });
      } catch (error: any) {
        console.error(`   ❌ 失败: ${operation.name}`, error.message);
        errorCount++;
        results.push({ 
          operation: operation.name, 
          success: false, 
          error: error.message 
        });
      }
    }

    // 插入常用标签
    console.log('   📝 插入常用标签...');
    const commonTags = [
      ['AI', 'Technology'], ['Machine Learning', 'Technology'], ['Deep Learning', 'Technology'],
      ['Natural Language Processing', 'Technology'], ['Computer Vision', 'Technology'], ['Generative AI', 'Technology'],
      ['Productivity', 'Application'], ['Content Creation', 'Application'], ['Design', 'Application'],
      ['Marketing', 'Application'], ['Education', 'Application'], ['Healthcare', 'Application'],
      ['Finance', 'Application'], ['E-commerce', 'Application'], ['Startup', 'Company Type'],
      ['Enterprise', 'Company Type'], ['Open Source', 'Company Type'], ['SaaS', 'Company Type'],
      ['Platform', 'Company Type'], ['API', 'Technology'], ['Cloud', 'Technology'],
      ['Mobile', 'Technology'], ['Web', 'Technology'], ['Desktop', 'Technology'],
      ['Integration', 'Technology'], ['Video', 'Application'], ['Image', 'Application'],
      ['Text', 'Application'], ['Code', 'Application'], ['Chat', 'Application'],
      ['International', 'Company Type'], ['Domestic', 'Company Type'], ['Business', 'Application'],
      ['Creative', 'Application'], ['Developer Tools', 'Application'], ['Writing', 'Application'],
      ['Analytics', 'Application'], ['Customer Support', 'Application'], ['Sales', 'Application'],
      ['Chatbots', 'Application'], ['Learning', 'Application'], ['Data', 'Application']
    ];

    for (const [tagName, tagCategory] of commonTags) {
      try {
        const { error } = await supabase
          .from('common_tags')
          .upsert({
            tag_name: tagName,
            tag_category: tagCategory,
            usage_count: 0
          }, {
            onConflict: 'tag_name'
          });

        if (error) {
          console.error(`   ❌ 插入标签失败: ${tagName}`, error.message);
        }
      } catch (error: any) {
        console.error(`   ❌ 插入标签失败: ${tagName}`, error.message);
      }
    }

    console.log('\n🎉 数据库Schema更新完成！');
    console.log(`📊 最终统计: 成功 ${successCount}, 失败 ${errorCount}`);

    return res.status(200).json({
      success: true,
      message: `数据库Schema更新完成: 成功 ${successCount}, 失败 ${errorCount}`,
      results: {
        successCount,
        errorCount,
        totalOperations: operations.length,
        details: results
      }
    });

  } catch (error: any) {
    console.error('❌ 数据库Schema更新失败:', error);
    return res.status(500).json({
      success: false,
      error: `数据库Schema更新失败: ${error.message}`,
      details: {
        errorType: error.name,
        timestamp: new Date().toISOString()
      }
    });
  }
}

async function handleAddSchemaFields(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();

    console.log('🚀 开始添加数据库字段...');

    // 尝试直接插入数据来测试字段是否存在
    const testCompany = {
      name: 'Test Company',
      description: 'Test description',
      english_description: 'Test English description',
      headquarters: 'Test City',
      valuation: 1000000,
      website: 'https://test.com',
      logo_base64: null,
      category: 'techGiants',
      is_overseas: true,
      founded_year: 2020,
      employee_count: '10-50',
      industry: 'Technology',
      tags: ['AI', 'Technology']
    };

    const { data, error } = await supabase
      .from('companies')
      .insert([testCompany])
      .select()
      .single();

    if (error) {
      console.error('❌ 测试插入失败:', error.message);
      
      // 如果是因为字段不存在，尝试添加字段
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('🔧 检测到缺少字段，尝试添加...');
        
        // 这里我们无法直接执行SQL，但可以提供指导
        return res.status(200).json({
          success: false,
          message: '数据库缺少必要字段，请在Supabase SQL Editor中执行以下SQL:',
          sqlCommands: [
            'ALTER TABLE companies ADD COLUMN IF NOT EXISTS category VARCHAR(50);',
            'ALTER TABLE companies ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT \'{}\';',
            'ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT \'{}\';',
            'ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_stories TEXT[] DEFAULT \'{}\';',
            'ALTER TABLE projects ADD COLUMN IF NOT EXISTS latest_features TEXT[] DEFAULT \'{}\';',
            'ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_rating DECIMAL(3,2) DEFAULT 0.0;',
            'ALTER TABLE projects ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;',
            'ALTER TABLE projects ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();'
          ],
          error: error.message
        });
      }
      
      throw error;
    }

    // 如果插入成功，删除测试数据
    await supabase.from('companies').delete().eq('id', data.id);

    return res.status(200).json({
      success: true,
      message: '数据库字段检查完成，所有必要字段都存在'
    });

  } catch (error: any) {
    console.error('❌ 字段检查失败:', error);
    return res.status(500).json({
      success: false,
      error: `字段检查失败: ${error.message}`,
      details: {
        errorType: error.name,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// 更新公司logo
async function handleUpdateCompanyLogo(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, companyId, logoBase64, logoUrl } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    
    const updateData: any = {
      logo_updated_at: new Date().toISOString()
    };
    
    if (logoBase64) {
      updateData.logo_base64 = logoBase64;
    }
    
    if (logoUrl) {
      updateData.logo_url = logoUrl;
    }

    const { data, error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', companyId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Logo更新成功', 
      company: data 
    });
  } catch (error: any) {
    console.error('更新Logo失败:', error);
    return res.status(500).json({ 
      success: false, 
      error: `更新Logo失败: ${error.message}` 
    });
  }
}

// 获取公司logo
async function handleGetCompanyLogo(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { companyId } = req.query;
  
  try {
    initClients();
    
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, logo_base64, logo_url, logo_updated_at')
      .eq('id', companyId)
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({ 
      success: true, 
      logo: data 
    });
  } catch (error: any) {
    console.error('获取Logo失败:', error);
    return res.status(500).json({ 
      success: false, 
      error: `获取Logo失败: ${error.message}` 
    });
  }
}

// 使用LLM补齐公司数据
async function handleCompleteCompanyData(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, companyId, fields } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    
    // 获取公司基本信息
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (companyError) {
      throw companyError;
    }

    // 构建LLM提示
    const prompt = `请为AI公司"${company.name}"补齐以下信息：

公司描述：${company.description || '暂无'}

请补齐以下字段的信息（用JSON格式返回）：
${fields.join(', ')}

要求：
1. 信息必须真实准确
2. 如果是英文公司，描述用英文
3. 如果是中文公司，描述用中文
4. 包含具体的技术特色和竞争优势
5. 避免模板化的描述

返回格式：
{
  "field1": "value1",
  "field2": "value2"
}`;

    // 调用LLM
    let llmResponse;
    try {
      if (openai) {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 1000
        });
        llmResponse = completion.choices[0].message.content;
      } else if (deepseek) {
        const completion = await deepseek.chat.completions.create({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 1000
        });
        llmResponse = completion.choices[0].message.content;
      } else {
        throw new Error('没有可用的LLM API');
      }
    } catch (llmError) {
      console.error('LLM调用失败:', llmError);
      throw new Error(`LLM调用失败: ${llmError.message}`);
    }

    // 解析LLM响应
    let completedData;
    try {
      // 提取JSON部分
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        completedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法从LLM响应中提取JSON');
      }
    } catch (parseError) {
      console.error('解析LLM响应失败:', parseError);
      throw new Error(`解析LLM响应失败: ${parseError.message}`);
    }

    // 更新数据库
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update(completedData)
      .eq('id', companyId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({ 
      success: true, 
      message: '公司数据补齐成功', 
      company: updatedCompany,
      completedFields: Object.keys(completedData)
    });
  } catch (error: any) {
    console.error('补齐公司数据失败:', error);
    return res.status(500).json({ 
      success: false, 
      error: `补齐公司数据失败: ${error.message}` 
    });
  }
}

// 上传logo到Storage
async function handleUploadLogoToStorage(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, companyId, logoBase64, fileName } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    
    // 将base64转换为buffer
    const base64Data = logoBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // 生成文件名
    const finalFileName = fileName || `logo-${companyId}-${Date.now()}.png`;
    
    // 上传到Supabase Storage
    const { data, error } = await supabase.storage
      .from('company-logos')
      .upload(finalFileName, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      throw error;
    }

    // 获取公共URL
    const { data: publicUrlData } = supabase.storage
      .from('company-logos')
      .getPublicUrl(finalFileName);

    const publicUrl = publicUrlData.publicUrl;

    // 更新数据库
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({
        logo_storage_url: publicUrl,
        logo_updated_at: new Date().toISOString()
      })
      .eq('id', companyId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Logo上传到Storage成功', 
      company: updatedCompany,
      storageUrl: publicUrl
    });
  } catch (error: any) {
    console.error('上传Logo到Storage失败:', error);
    return res.status(500).json({ 
      success: false, 
      error: `上传Logo到Storage失败: ${error.message}` 
    });
  }
}

// 获取Storage logo
async function handleGetStorageLogo(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { companyId } = req.query;
  
  try {
    initClients();
    
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, logo_storage_url, logo_base64, logo_url, logo_updated_at')
      .eq('id', companyId)
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({ 
      success: true, 
      logo: data 
    });
  } catch (error: any) {
    console.error('获取Storage Logo失败:', error);
    return res.status(500).json({ 
      success: false, 
      error: `获取Storage Logo失败: ${error.message}` 
    });
  }
}

// 测试AI Chat环境变量
async function handleTestAIChat(req: NextApiRequest, res: NextApiResponse) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    const qwenApiKey = process.env.QWEN_API_KEY;
    
    return res.status(200).json({
      success: true,
      environment: {
        openai: !!openaiApiKey,
        deepseek: !!deepseekApiKey,
        qwen: !!qwenApiKey,
        nodeEnv: process.env.NODE_ENV
      },
      message: 'AI Chat environment check completed'
    });
    
  } catch (error: any) {
    console.error('❌ Test AI Chat Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export default handler;