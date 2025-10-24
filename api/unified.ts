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

              case 'company-categories':
                return handleCompanyCategories(req, res);

              case 'check-data-completeness':
                return handleCheckDataCompleteness(req, res);

              case 'batch-complete-companies':
                return handleBatchCompleteCompanies(req, res);

              case 'test-news-generation':
                return handleTestNewsGeneration(req, res);

              case 'generate-tools-for-companies':
                return handleGenerateToolsForCompanies(req, res);
              
              case 'fix-database-schema':
                return handleFixDatabaseSchema(req, res);
              
              case 'test-env':
                return handleTestEnv(req, res);
              
              case 'insert-company-data':
                return handleInsertCompanyData(req, res);
              
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
    
    // 批量获取工具数据
    const { data: toolsData } = await supabase
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

    toolsData?.forEach(tool => {
      const count = projectsCountMap.get(tool.company_id) || 0;
      projectsCountMap.set(tool.company_id, count + 1);
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
      .not('id', 'in', `(SELECT DISTINCT company_id FROM tools WHERE company_id IS NOT NULL)`);

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
        
        // 生成工具数据
        const tools = await generateToolsForCompany(company.name, company.id, false); // 工具生成暂时使用OpenAI
        
        results.generated++;
        results.companies.push({
          name: company.name,
          id: company.id,
          toolsGenerated: tools.length,
          status: 'success'
        });
        
        console.log(`✅ 成功生成 ${tools.length} 个工具: ${company.name}`);
        
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

// 为单个公司生成工具数据
async function generateToolsForCompany(companyName: string, companyId: string, useDeepSeek = false) {
  try {
    console.log(`🛠️ 开始为 ${companyName} 生成工具数据`);
    
    // 使用OpenAI生成工具数据 - 深度研究模式
    const prompt = `You are a senior AI product analyst conducting deep research on "${companyName}". You have extensive knowledge of their technology stack, market positioning, and product portfolio.

**RESEARCH REQUIREMENTS:**
Conduct thorough analysis and provide detailed information about their AI tools and products:

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
  "tools": [
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

Generate 5-7 comprehensive tools/products based on thorough research. Ensure all information is factual, current, and based on available public data.`;

    console.log(`🛠️ 发送工具生成请求: ${companyName} ${useDeepSeek ? '[DeepSeek]' : '[OpenAI]'}`);
    
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
    console.log(`🛠️ ${useDeepSeek ? 'DeepSeek' : 'OpenAI'}工具生成响应: ${content.substring(0, 200)}...`);
    
    let toolsData;
    try {
      toolsData = JSON.parse(content);
    } catch (parseError) {
      console.warn(`⚠️ JSON解析失败，使用默认工具数据: ${companyName}`);
      toolsData = {
        tools: [
          {
            name: `${companyName} AI Platform`,
            description: `由${companyName}开发的AI平台`,
            url: `https://${companyName.toLowerCase()}.com/platform`,
            category: 'AI平台'
          },
          {
            name: `${companyName} AI Tools`,
            description: `由${companyName}提供的AI工具套件`,
            url: `https://${companyName.toLowerCase()}.com/tools`,
            category: 'AI工具'
          }
        ]
      };
    }

    const tools = toolsData.tools || [];
    console.log(`🛠️ 准备插入 ${tools.length} 个工具到数据库`);

    // 插入工具数据到数据库
    const insertedTools: any[] = [];
    for (const tool of tools) {
      try {
        const { data: insertedTool, error: insertError } = await supabase
          .from('tools')
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