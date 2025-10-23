import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// 初始化客户端
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export type TaskType = 'generate-full-data' | 'reconfigure' | 'clear-database';
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused';
export type LogLevel = 'info' | 'warning' | 'error';

interface TaskProgress {
  current: number;
  total: number;
  percentage: number;
}

interface BackgroundTask {
  id: string;
  task_id: string;
  task_type: TaskType;
  status: TaskStatus;
  progress: TaskProgress;
  current_step: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  result_data: any | null;
  created_at: string;
  updated_at: string;
}

class BackgroundTaskManager {
  private static instance: BackgroundTaskManager;
  private runningTasks: Map<string, Promise<void>> = new Map();

  private constructor() {}

  public static getInstance(): BackgroundTaskManager {
    if (!BackgroundTaskManager.instance) {
      BackgroundTaskManager.instance = new BackgroundTaskManager();
    }
    return BackgroundTaskManager.instance;
  }

  private async log(taskId: string, level: LogLevel, message: string, details?: any) {
    try {
      await supabase.from('task_logs').insert({
        task_id: taskId,
        log_level: level,
        message: message,
        details: details,
      });
    } catch (error) {
      console.error(`Failed to log message for task ${taskId}:`, error);
    }
  }

  public async createTask(taskType: TaskType): Promise<string> {
    const taskId = uuidv4();
    try {
      const { data, error } = await supabase.from('background_tasks').insert({
        task_id: taskId,
        task_type: taskType,
        status: 'pending',
        progress: { current: 0, total: 0, percentage: 0 },
        current_step: '任务已创建',
      }).select().single();

      if (error) {
        await this.log(taskId, 'error', `创建任务失败: ${error.message}`, error);
        throw new Error(`Failed to create task: ${error.message}`);
      }
      await this.log(taskId, 'info', `任务已创建: ${taskType}`);
      return taskId;
    } catch (error) {
      console.error(`Failed to create task: ${taskId}`, error);
      throw error;
    }
  }

  public async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    currentStep?: string,
    progress?: { current: number; total: number },
    errorMessage?: string,
    resultData?: any
  ) {
    const updateData: Partial<BackgroundTask> = { status, updated_at: new Date().toISOString() };
    if (currentStep) updateData.current_step = currentStep;
    if (errorMessage) updateData.error_message = errorMessage;
    if (resultData) updateData.result_data = resultData;

    if (progress) {
      const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
      updateData.progress = { ...progress, percentage: parseFloat(percentage.toFixed(2)) };
    }

    if (status === 'running' && !updateData.started_at) {
      updateData.started_at = new Date().toISOString();
    }
    if (status === 'completed' || status === 'failed') {
      updateData.completed_at = new Date().toISOString();
    }

    try {
      const { error } = await supabase.from('background_tasks').update(updateData).eq('task_id', taskId);
      if (error) {
        await this.log(taskId, 'error', `更新任务状态失败: ${error.message}`, error);
        console.error(`Failed to update task ${taskId} status:`, error);
      }
    } catch (error) {
      console.error(`Failed to update task ${taskId} status:`, error);
    }
  }

  public async getTaskStatus(taskId: string): Promise<BackgroundTask> {
    const { data, error } = await supabase.from('background_tasks').select('*').eq('task_id', taskId).single();
    if (error) {
      throw new Error(`Failed to get task status: ${error.message}`);
    }
    return data as BackgroundTask;
  }

  public async getTaskLogs(taskId: string, limit: number = 50): Promise<any[]> {
    const { data, error } = await supabase.from('task_logs')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      console.error(`Failed to get task logs for ${taskId}:`, error);
      return [];
    }
    return data || [];
  }

  public async startTask(taskId: string) {
    if (this.runningTasks.has(taskId)) {
      await this.log(taskId, 'warning', '任务已在运行中，跳过启动');
      return;
    }

    const taskPromise = this.executeTask(taskId);
    this.runningTasks.set(taskId, taskPromise);

    try {
      await taskPromise;
    } finally {
      this.runningTasks.delete(taskId);
    }
  }

  private async executeTask(taskId: string) {
    let task: BackgroundTask | null = null;
    try {
      task = await this.getTaskStatus(taskId);
      if (!task) throw new Error('Task not found');

      await this.updateTaskStatus(taskId, 'running', '任务开始执行');
      await this.log(taskId, 'info', '任务开始执行');

      let result: any;
      switch (task.task_type) {
        case 'generate-full-data':
          result = await this.runGenerateFullData(taskId);
          break;
        case 'reconfigure':
          result = await this.runReconfigure(taskId);
          break;
        case 'clear-database':
          result = await this.runClearDatabase(taskId);
          break;
        default:
          throw new Error(`未知任务类型: ${task.task_type}`);
      }

      await this.updateTaskStatus(taskId, 'completed', '任务已完成', undefined, undefined, result);
      await this.log(taskId, 'info', '任务已完成', result);

    } catch (error: any) {
      const errorMessage = error.message || '未知错误';
      await this.updateTaskStatus(taskId, 'failed', `任务失败: ${errorMessage}`, undefined, errorMessage);
      await this.log(taskId, 'error', `任务执行失败: ${errorMessage}`, error);
      console.error(`Background task ${taskId} failed:`, error);
    }
  }

  private async runGenerateFullData(taskId: string) {
    await this.log(taskId, 'info', '开始生成完整数据 (200+ 公司)');
    
    // 先清理数据库
    await this.updateTaskStatus(taskId, 'running', '数据清理中...');
    await this.runClearDatabase(taskId);
    await this.log(taskId, 'info', '数据清理完成');

    // 生成海外公司数据
    await this.updateTaskStatus(taskId, 'running', '生成海外公司数据中...');
    const overseasResult = await this.generateOverseasCompanies(taskId);
    await this.log(taskId, 'info', `海外公司数据生成完成: ${overseasResult.count} 家`);

    // 生成国内公司数据
    await this.updateTaskStatus(taskId, 'running', '生成国内公司数据中...');
    const domesticResult = await this.generateDomesticCompanies(taskId);
    await this.log(taskId, 'info', `国内公司数据生成完成: ${domesticResult.count} 家`);

    return {
      summary: `完整数据生成完成。处理了 ${overseasResult.count + domesticResult.count} 家公司。`,
      overseas: overseasResult,
      domestic: domesticResult,
    };
  }

  private async runReconfigure(taskId: string) {
    await this.log(taskId, 'info', '开始重新配置 (40 家公司)');
    await this.updateTaskStatus(taskId, 'running', '重新配置步骤执行中...');
    
    // 生成40家公司的数据
    const overseasResult = await this.generateOverseasCompanies(taskId, 20);
    const domesticResult = await this.generateDomesticCompanies(taskId, 20);
    
    await this.log(taskId, 'info', '重新配置完成', { overseasResult, domesticResult });
    return { overseasResult, domesticResult };
  }

  private async runClearDatabase(taskId: string) {
    await this.log(taskId, 'info', '开始清理数据库');
    await this.updateTaskStatus(taskId, 'running', '数据库清理中...');
    
    const tablesToClear = ['companies', 'tools', 'fundings', 'stories'];
    let clearedCount = 0;
    let errorCount = 0;

    for (const table of tablesToClear) {
      try {
        const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) {
          await this.log(taskId, 'warning', `清理表 ${table} 时出现错误: ${error.message}`);
          errorCount++;
        } else {
          await this.log(taskId, 'info', `成功清理表: ${table}`);
          clearedCount++;
        }
      } catch (err: any) {
        await this.log(taskId, 'error', `清理表 ${table} 失败: ${err.message}`);
        errorCount++;
      }
    }

    await this.log(taskId, 'info', `数据库清理完成: ${clearedCount} 个表成功, ${errorCount} 个表失败`);
    return { clearedCount, errorCount, totalTables: tablesToClear.length };
  }

  private async generateOverseasCompanies(taskId: string, limit: number = 100) {
    const companies = [
      'OpenAI', 'Anthropic', 'Google DeepMind', 'Microsoft AI', 'Meta AI',
      'Tesla AI', 'NVIDIA', 'Intel AI', 'IBM Watson', 'Amazon AI',
      'Apple AI', 'Salesforce Einstein', 'Adobe AI', 'Oracle AI', 'SAP AI',
      'Palantir', 'Databricks', 'Snowflake', 'Hugging Face', 'Stability AI',
      'Midjourney', 'Runway', 'Character.AI', 'Jasper', 'Copy.ai',
      'Grammarly', 'Notion AI', 'Figma AI', 'Canva AI', 'Zapier AI',
      'HubSpot AI', 'Mailchimp AI', 'Shopify AI', 'Stripe AI', 'Square AI',
      'PayPal AI', 'Venmo AI', 'Cash App AI', 'Robinhood AI', 'Coinbase AI',
      'Binance AI', 'Kraken AI', 'Gemini AI', 'Crypto.com AI', 'FTX AI',
      'Alchemy', 'Infura', 'QuickNode', 'Moralis', 'Thirdweb',
      'Polygon', 'Avalanche', 'Solana', 'Cardano', 'Polkadot',
      'Chainlink', 'Uniswap', 'Aave', 'Compound', 'MakerDAO',
      'Curve', 'Yearn', 'SushiSwap', 'PancakeSwap', '1inch',
      'dYdX', 'Perpetual Protocol', 'GMX', 'Gains Network', 'Ribbon Finance',
      'Opyn', 'Primitive', 'Hegic', 'Charm', 'Lyra',
      'Synthetix', 'Kwenta', 'Polynomial', 'Thales', 'Pods',
      'BarnBridge', 'Indexed Finance', 'PieDAO', 'PowerPool', 'Set Protocol',
      'Enzyme', 'Harvest Finance', 'Badger DAO', 'Convex', 'Frax',
      'Liquity', 'Reflexer', 'Rai', 'Float Protocol', 'Bancor',
      'Balancer', 'Curve', 'Saddle', 'Shell Protocol', 'Element Finance'
    ];

    let processedCount = 0;
    const totalCount = Math.min(limit, companies.length);

    for (let i = 0; i < totalCount; i++) {
      const companyName = companies[i];
      try {
        await this.updateTaskStatus(taskId, 'running', `处理海外公司: ${companyName}`, { 
          current: processedCount, 
          total: totalCount 
        });
        await this.log(taskId, 'info', `处理海外公司: ${companyName} (${processedCount + 1}/${totalCount})`);

        // 生成公司数据
        await this.generateCompanyData(companyName, true);
        processedCount++;

        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        await this.log(taskId, 'error', `处理公司 ${companyName} 失败: ${error.message}`);
      }
    }

    return { count: processedCount };
  }

  private async generateDomesticCompanies(taskId: string, limit: number = 100) {
    const companies = [
      '百度', '阿里巴巴', '腾讯', '字节跳动', '华为',
      '小米', '美团', '滴滴', '京东', '拼多多',
      '网易', '新浪', '搜狐', '360', '金山',
      '用友', '金蝶', '东软', '中软', '浪潮',
      '科大讯飞', '商汤科技', '旷视科技', '依图科技', '云从科技',
      '第四范式', '明略科技', '思必驰', '云知声', '出门问问',
      '小冰', '竹间智能', '追一科技', '来也科技', '容联云',
      '声网', '即构科技', '融云', '环信', '网易云信',
      '腾讯云', '阿里云', '华为云', '百度云', '京东云',
      '金山云', '七牛云', '又拍云', 'UCloud', '青云',
      '深信服', '奇安信', '绿盟科技', '启明星辰', '安恒信息',
      '山石网科', '迪普科技', '安博通', '恒安嘉新', '安天',
      '微步在线', '长亭科技', '默安科技', '青藤云', '悬镜安全',
      '梆梆安全', '爱加密', '娜迦信息', '通付盾', '顶象',
      '同盾科技', '百融云创', '冰鉴科技', '数美科技', '极光',
      '个推', '友盟', 'TalkingData', '神策数据', 'GrowingIO',
      '易观', '阿拉丁', '七麦数据', 'App Annie', 'Sensor Tower',
      'MobData', 'QuestMobile', '艾瑞咨询', '易观智库', '艾媒咨询'
    ];

    let processedCount = 0;
    const totalCount = Math.min(limit, companies.length);

    for (let i = 0; i < totalCount; i++) {
      const companyName = companies[i];
      try {
        await this.updateTaskStatus(taskId, 'running', `处理国内公司: ${companyName}`, { 
          current: processedCount, 
          total: totalCount 
        });
        await this.log(taskId, 'info', `处理国内公司: ${companyName} (${processedCount + 1}/${totalCount})`);

        // 生成公司数据
        await this.generateCompanyData(companyName, false);
        processedCount++;

        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        await this.log(taskId, 'error', `处理公司 ${companyName} 失败: ${error.message}`);
      }
    }

    return { count: processedCount };
  }

  private async generateCompanyData(companyName: string, isOverseas: boolean) {
    try {
      // 生成公司详细信息
      const companyDetails = await this.getCompanyDetails(companyName, isOverseas);
      
      // 插入公司数据
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          description: companyDetails.description,
          founded_year: companyDetails.founded_year,
          headquarters: companyDetails.headquarters,
          website: companyDetails.website,
          employee_count: companyDetails.employee_count,
          valuation: companyDetails.valuation,
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
        for (const product of companyDetails.products) {
          await supabase.from('tools').insert({
            company_id: company.id,
            name: product.name,
            description: product.description,
            url: product.url,
            category: 'AI工具',
            created_at: new Date().toISOString()
          });
        }
      }

      // 生成融资数据
      if (companyDetails.funding_rounds && companyDetails.funding_rounds.length > 0) {
        for (const funding of companyDetails.funding_rounds) {
          await supabase.from('fundings').insert({
            company_id: company.id,
            round: funding.round,
            amount: funding.amount,
            investors: funding.investors,
            valuation: funding.valuation,
            date: funding.date,
            created_at: new Date().toISOString()
          });
        }
      }

      // 生成新闻故事
      const newsStory = await this.generateNewsStory(companyName, isOverseas);
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

    } catch (error) {
      console.error(`Failed to generate data for ${companyName}:`, error);
      throw error;
    }
  }

  private async getCompanyDetails(companyName: string, isOverseas: boolean) {
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
  }

  private async generateNewsStory(companyName: string, isOverseas: boolean) {
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
  }
}

export default BackgroundTaskManager;