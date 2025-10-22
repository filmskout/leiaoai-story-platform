import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { searchCompanyNews } from './web_search_api';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface CompanyData {
  name: string;
  name_en: string;
  name_zh_hans: string;
  description_en: string;
  description_zh_hans: string;
  website: string;
  founded_year?: number;
  headquarters?: string;
  employee_count_range?: string;
  valuation_usd?: number;
  industry_tags: string[];
  company_type: 'AI Giant' | 'Independent AI' | 'AI Company';
  company_tier: 'Tier 1' | 'Tier 2' | 'Independent' | 'Emerging';
  company_category: string;
  focus_areas: string[];
}

interface NewsArticle {
  title: string;
  content: string;
  url: string;
  published_date: string;
  source: string;
}

// 国内主流AI公司列表（大厂）
const MAJOR_CHINESE_AI_COMPANIES = [
  '百度', '阿里巴巴', '腾讯', '字节跳动', '华为', '小米', '京东', '美团',
  '百度AI', '阿里云', '腾讯云', '华为云', '字节AI', '小米AI', '京东AI',
  '文心一言', '通义千问', '混元', '盘古', 'ChatGLM', 'Qwen', 'Baichuan'
];

// 国内普通AI公司列表
const REGULAR_CHINESE_AI_COMPANIES = [
  '商汤科技', '旷视科技', '依图科技', '云从科技', '第四范式', '明略科技',
  '思必驰', '科大讯飞', '海康威视', '大华股份', '优必选', '图森未来',
  'Momenta', 'Pony.ai', '小马智行', '文远知行', 'AutoX', '元戎启行'
];

// 国内新晋AI公司列表
const EMERGING_CHINESE_AI_COMPANIES = [
  '月之暗面', 'MiniMax', '智谱AI', '百川智能', '零一万物', '面壁智能',
  '深言科技', '澜舟科技', '循环智能', '聆心智能', '西湖心辰', '西湖大学',
  '清华大学', '北京大学', '中科院', '上海AI实验室', '北京AI研究院'
];

// 国内科技媒体列表
const CHINESE_TECH_MEDIA_SOURCES = [
  '36氪', '虎嗅', '钛媒体', '雷锋网', '机器之心', 'AI科技大本营',
  '量子位', '新智元', 'AI前线', 'InfoQ', 'CSDN', '开源中国',
  '极客公园', '爱范儿', '数字尾巴', '少数派', '品玩', 'PingWest',
  '新浪科技', '网易科技', '搜狐科技', '腾讯科技', '凤凰科技'
];

async function searchChineseCompanyNews(companyName: string, articleCount: number): Promise<NewsArticle[]> {
  console.log(`🔍 搜索 ${companyName} 的新闻 (${articleCount}篇)...`);
  
  try {
    // 使用真实的网络搜索API
    const searchResults = await searchCompanyNews({
      companyName,
      language: 'zh',
      articleCount,
      timeRange: 'month'
    });
    
    // 转换为NewsArticle格式
    return searchResults.map(result => ({
      title: result.title,
      content: result.content,
      url: result.url,
      published_date: result.published_date,
      source: result.source
    }));
    
  } catch (error) {
    console.error(`❌ 搜索 ${companyName} 新闻失败:`, error);
    return [];
  }
}

async function generateChineseStoryFromArticle(article: NewsArticle, companyName: string, toolNames: string[]): Promise<any> {
  try {
    const prompt = `
请基于以下新闻文章生成一篇350-500字的Stories内容，要求：
1. 用简体中文写作
2. 内容专业且易懂
3. 突出AI技术和创新点
4. 包含公司背景信息
5. 适合投资人和技术爱好者阅读
6. 严格控制字数在350-500字之间

新闻标题: ${article.title}
新闻内容: ${article.content}
公司名称: ${companyName}
相关工具: ${toolNames.join(', ')}

请生成标题和内容：
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    });

    const generatedContent = response.choices[0]?.message?.content || '';
    
    // 解析生成的标题和内容
    const lines = generatedContent.split('\n');
    const title = lines.find(line => line.includes('标题') || line.includes('Title'))?.replace(/标题[:：]\s*/, '') || article.title;
    const content = generatedContent.replace(/标题[:：].*\n/, '').trim();

    return {
      title: title.substring(0, 100),
      content: content.substring(0, 2000),
      tags: [companyName, ...toolNames, 'AI新闻', '技术分析'],
      category: 'ai_news',
      status: 'published'
    };
  } catch (error) {
    console.error('❌ 生成Stories失败:', error);
    return null;
  }
}

async function getChineseCompanyTier(companyName: string): Promise<'Tier 1' | 'Tier 2' | 'Independent' | 'Emerging'> {
  if (MAJOR_CHINESE_AI_COMPANIES.includes(companyName)) return 'Tier 1';
  if (REGULAR_CHINESE_AI_COMPANIES.includes(companyName)) return 'Tier 2';
  if (EMERGING_CHINESE_AI_COMPANIES.includes(companyName)) return 'Emerging';
  return 'Independent';
}

async function getChineseArticleCount(companyName: string): Promise<number> {
  const tier = await getChineseCompanyTier(companyName);
  switch (tier) {
    case 'Tier 1': return Math.floor(Math.random() * 6) + 15; // 15-20篇
    case 'Tier 2': return Math.floor(Math.random() * 5) + 8;  // 8-12篇
    case 'Emerging': return Math.floor(Math.random() * 4) + 5; // 5-8篇
    default: return Math.floor(Math.random() * 5) + 8; // 8-12篇
  }
}

async function enhanceChineseCompanyData(companyName: string): Promise<CompanyData | null> {
  try {
    console.log(`🔄 增强 ${companyName} 的数据...`);
    
    // 获取公司现有数据
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('*')
      .eq('name', companyName)
      .single();

    if (!existingCompany) {
      console.log(`⚠️ 公司 ${companyName} 不存在，跳过`);
      return null;
    }

    // 获取公司相关工具
    const { data: tools } = await supabase
      .from('tools')
      .select('name')
      .eq('company_id', existingCompany.id);

    const toolNames = tools?.map(t => t.name) || [];

    // 搜索新闻文章
    const articleCount = await getChineseArticleCount(companyName);
    const articles = await searchChineseCompanyNews(companyName, articleCount);

    // 为每篇文章生成Stories
    for (const article of articles) {
      const story = await generateChineseStoryFromArticle(article, companyName, toolNames);
      if (story) {
        // 保存Stories到数据库
        const { data: savedStory } = await supabase
          .from('stories')
          .insert({
            ...story,
            author_id: null, // 系统生成
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (savedStory) {
          // 创建公司-Stories关联
          await supabase
            .from('company_stories')
            .insert({
              company_id: existingCompany.id,
              story_id: savedStory.id
            });

          // 为每个相关工具创建工具-Stories关联
          for (const tool of tools || []) {
            const { data: toolData } = await supabase
              .from('tools')
              .select('id')
              .eq('name', tool.name)
              .eq('company_id', existingCompany.id)
              .single();

            if (toolData) {
              await supabase
                .from('tool_stories')
                .insert({
                  tool_id: toolData.id,
                  story_id: savedStory.id
                });
            }
          }
        }
      }
    }

    // 使用GPT-4生成中文描述
    const chinesePrompt = `
请为AI公司 "${companyName}" 生成详细的中文描述，包括：
1. 公司背景和历史
2. 主要AI技术和产品
3. 市场地位和竞争优势
4. 最新发展和未来展望

要求：专业、准确、适合投资者阅读，300-400字。
`;

    const chineseResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: chinesePrompt }],
      max_tokens: 800,
      temperature: 0.7
    });

    const descriptionZhHans = chineseResponse.choices[0]?.message?.content || '';

    // 翻译为英文
    const englishPrompt = `
请将以下中文描述翻译为英文，保持专业性和准确性：

${descriptionZhHans}
`;

    const englishResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: englishPrompt }],
      max_tokens: 800,
      temperature: 0.3
    });

    const descriptionEn = englishResponse.choices[0]?.message?.content || '';

    // 确定公司层级和类型
    const tier = await getChineseCompanyTier(companyName);
    const companyType = tier === 'Tier 1' ? 'AI Giant' : 'Independent AI';

    return {
      name: companyName,
      name_en: companyName, // 可以后续翻译
      name_zh_hans: companyName,
      description_en: descriptionEn,
      description_zh_hans: descriptionZhHans,
      website: existingCompany.website || '',
      founded_year: existingCompany.founded_year,
      headquarters: existingCompany.headquarters,
      employee_count_range: existingCompany.employee_count_range,
      valuation_usd: existingCompany.valuation_usd,
      industry_tags: existingCompany.industry_tags || [],
      company_type: companyType,
      company_tier: tier,
      company_category: 'AI Technology',
      focus_areas: existingCompany.focus_areas || []
    };

  } catch (error) {
    console.error(`❌ 增强 ${companyName} 数据失败:`, error);
    return null;
  }
}

async function updateChineseCompanyInDatabase(companyData: CompanyData): Promise<void> {
  try {
    const { error } = await supabase
      .from('companies')
      .update({
        name_en: companyData.name_en,
        name_zh_hans: companyData.name_zh_hans,
        description_en: companyData.description_en,
        description_zh_hans: companyData.description_zh_hans,
        company_type: companyData.company_type,
        company_tier: companyData.company_tier,
        company_category: companyData.company_category,
        focus_areas: companyData.focus_areas,
        updated_at: new Date().toISOString()
      })
      .eq('name', companyData.name);

    if (error) {
      console.error(`❌ 更新公司 ${companyData.name} 失败:`, error);
    } else {
      console.log(`✅ 成功更新公司 ${companyData.name}`);
    }
  } catch (error) {
    console.error(`❌ 数据库更新失败:`, error);
  }
}

async function main() {
  console.log('🚀 开始增强国内AI公司数据...');
  console.log('═'.repeat(60));

  try {
    // 获取所有国内公司
    const { data: companies } = await supabase
      .from('companies')
      .select('name')
      .or('headquarters.ilike.%中国%,headquarters.ilike.%China%,headquarters.ilike.%香港%,headquarters.ilike.%Hong Kong%');

    if (!companies || companies.length === 0) {
      console.log('❌ 没有找到国内公司数据');
      return;
    }

    console.log(`📊 找到 ${companies.length} 家国内公司`);

    let processedCount = 0;
    let successCount = 0;

    for (const company of companies) {
      console.log(`\n🔄 处理 ${company.name} (${processedCount + 1}/${companies.length})`);
      
      try {
        const enhancedData = await enhanceChineseCompanyData(company.name);
        
        if (enhancedData) {
          await updateChineseCompanyInDatabase(enhancedData);
          successCount++;
        }
        
        processedCount++;
        
        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ 处理 ${company.name} 失败:`, error);
        processedCount++;
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('📊 处理结果汇总');
    console.log('═'.repeat(60));
    console.log(`✅ 成功处理: ${successCount} 家公司`);
    console.log(`❌ 处理失败: ${processedCount - successCount} 家公司`);
    console.log(`📈 成功率: ${((successCount / processedCount) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ 主程序执行失败:', error);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);
