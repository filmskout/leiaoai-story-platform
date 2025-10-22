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

// 主流AI公司列表（大厂）
const MAJOR_AI_COMPANIES = [
  'OpenAI', 'Google', 'Microsoft', 'Meta', 'Apple', 'Amazon', 'NVIDIA', 
  'Tesla', 'Anthropic', 'Cohere', 'Hugging Face', 'Stability AI', 
  'Midjourney', 'Character.AI', 'Perplexity', 'Claude', 'ChatGPT',
  'DeepMind', 'Google AI', 'Microsoft AI', 'Meta AI', 'Apple Intelligence'
];

// 普通AI公司列表
const REGULAR_AI_COMPANIES = [
  'Runway', 'Jasper', 'Copy.ai', 'Grammarly', 'Notion', 'Figma', 
  'Canva', 'Loom', 'Calendly', 'Zoom', 'Slack', 'Discord',
  'GitHub', 'GitLab', 'Vercel', 'Netlify', 'Railway', 'Supabase'
];

// 新晋AI公司列表
const EMERGING_AI_COMPANIES = [
  'Replicate', 'Together AI', 'Modal', 'Baseten', 'Banana', 
  'Cerebras', 'SambaNova', 'Graphcore', 'Groq', 'Lightmatter'
];

// 科技媒体列表
const TECH_MEDIA_SOURCES = [
  'TechCrunch', 'The Verge', 'Wired', 'Ars Technica', 'MIT Technology Review',
  'IEEE Spectrum', 'Nature Machine Intelligence', 'AI News', 'VentureBeat',
  'ZDNet', 'CNET', 'Engadget', 'Gizmodo', 'Mashable', 'Fast Company',
  'Forbes Technology', 'Bloomberg Technology', 'Reuters Technology',
  'Wall Street Journal Technology', 'New York Times Technology'
];

async function searchOverseasCompanyNews(companyName: string, articleCount: number): Promise<NewsArticle[]> {
  console.log(`🔍 搜索 ${companyName} 的新闻 (${articleCount}篇)...`);
  
  try {
    // 使用真实的网络搜索API
    const searchResults = await searchCompanyNews({
      companyName,
      language: 'en',
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

async function generateStoryFromArticle(article: NewsArticle, companyName: string, toolNames: string[]): Promise<any> {
  try {
    const prompt = `
Please generate a 350-500 word Stories content based on the following news article, with requirements:
1. Write in English
2. Professional and easy to understand content
3. Highlight AI technology and innovation points
4. Include company background information
5. Suitable for investors and technology enthusiasts
6. Strictly control word count between 350-500 words

News Title: ${article.title}
News Content: ${article.content}
Company Name: ${companyName}
Related Tools: ${toolNames.join(', ')}

Please generate title and content:
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
    const title = lines.find(line => line.includes('Title') || line.includes('标题'))?.replace(/Title[:：]\s*/, '') || article.title;
    const content = generatedContent.replace(/Title[:：].*\n/, '').trim();

    return {
      title: title.substring(0, 100),
      content: content.substring(0, 2000),
      tags: [companyName, ...toolNames, 'AI News', 'Technology Analysis'],
      category: 'ai_news',
      status: 'published'
    };
  } catch (error) {
    console.error('❌ 生成Stories失败:', error);
    return null;
  }
}

async function getCompanyTier(companyName: string): Promise<'Tier 1' | 'Tier 2' | 'Independent' | 'Emerging'> {
  if (MAJOR_AI_COMPANIES.includes(companyName)) return 'Tier 1';
  if (REGULAR_AI_COMPANIES.includes(companyName)) return 'Tier 2';
  if (EMERGING_AI_COMPANIES.includes(companyName)) return 'Emerging';
  return 'Independent';
}

async function getArticleCount(companyName: string): Promise<number> {
  const tier = await getCompanyTier(companyName);
  switch (tier) {
    case 'Tier 1': return Math.floor(Math.random() * 6) + 15; // 15-20篇
    case 'Tier 2': return Math.floor(Math.random() * 5) + 8;  // 8-12篇
    case 'Emerging': return Math.floor(Math.random() * 4) + 5; // 5-8篇
    default: return Math.floor(Math.random() * 5) + 8; // 8-12篇
  }
}

async function enhanceCompanyData(companyName: string): Promise<CompanyData | null> {
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
    const articleCount = await getArticleCount(companyName);
    const articles = await searchOverseasCompanyNews(companyName, articleCount);

    // 为每篇文章生成Stories
    for (const article of articles) {
      const story = await generateStoryFromArticle(article, companyName, toolNames);
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

    // 使用GPT-4生成英文描述
    const englishPrompt = `
请为AI公司 "${companyName}" 生成详细的英文描述，包括：
1. 公司背景和历史
2. 主要AI技术和产品
3. 市场地位和竞争优势
4. 最新发展和未来展望

要求：专业、准确、适合投资者阅读，300-400字。
`;

    const englishResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: englishPrompt }],
      max_tokens: 800,
      temperature: 0.7
    });

    const descriptionEn = englishResponse.choices[0]?.message?.content || '';

    // 翻译为简体中文
    const chinesePrompt = `
请将以下英文描述翻译为简体中文，保持专业性和准确性：

${descriptionEn}
`;

    const chineseResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: chinesePrompt }],
      max_tokens: 800,
      temperature: 0.3
    });

    const descriptionZhHans = chineseResponse.choices[0]?.message?.content || '';

    // 确定公司层级和类型
    const tier = await getCompanyTier(companyName);
    const companyType = tier === 'Tier 1' ? 'AI Giant' : 'Independent AI';

    return {
      name: companyName,
      name_en: companyName,
      name_zh_hans: companyName, // 可以后续翻译
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

async function updateCompanyInDatabase(companyData: CompanyData): Promise<void> {
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
  console.log('🚀 开始增强海外AI公司数据...');
  console.log('═'.repeat(60));

  try {
    // 获取所有海外公司
    const { data: companies } = await supabase
      .from('companies')
      .select('name')
      .not('headquarters', 'ilike', '%中国%')
      .not('headquarters', 'ilike', '%China%')
      .not('headquarters', 'ilike', '%香港%')
      .not('headquarters', 'ilike', '%Hong Kong%');

    if (!companies || companies.length === 0) {
      console.log('❌ 没有找到海外公司数据');
      return;
    }

    console.log(`📊 找到 ${companies.length} 家海外公司`);

    let processedCount = 0;
    let successCount = 0;

    for (const company of companies) {
      console.log(`\n🔄 处理 ${company.name} (${processedCount + 1}/${companies.length})`);
      
      try {
        const enhancedData = await enhanceCompanyData(company.name);
        
        if (enhancedData) {
          await updateCompanyInDatabase(enhancedData);
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
