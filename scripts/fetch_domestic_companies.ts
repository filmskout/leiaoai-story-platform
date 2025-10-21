import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface DomesticCompany {
  name: string;
  name_en: string;
  name_zh_hans: string;
  name_zh_hant: string;
  description: string;
  description_en: string;
  description_zh_hans: string;
  description_zh_hant: string;
  logo_url: string;
  website: string;
  headquarters: string;
  company_type: 'AI Giant' | 'Independent AI' | 'AI Company';
  company_tier: 'Tier 1' | 'Tier 2' | 'Independent' | 'Emerging';
  company_category: string;
  focus_areas: string[];
  industry_tags: string[];
  social_links: {
    weibo?: string;
    zhihu?: string;
    douyin?: string;
    bilibili?: string;
    github?: string;
  };
  valuation_usd: number | null;
  funding_status: string;
  tools: DomesticTool[];
}

interface DomesticTool {
  name: string;
  name_en: string;
  name_zh_hans: string;
  name_zh_hant: string;
  description: string;
  description_en: string;
  description_zh_hans: string;
  description_zh_hant: string;
  logo_url: string;
  website: string;
  tool_category: string;
  tool_subcategory: string;
  focus_areas: string[];
  industry_tags: string[];
  pricing_model: string;
  launch_date: string;
  features: string[];
  api_available: boolean;
  free_tier: boolean;
}

async function fetchDomesticCompaniesWithDeepSeek(): Promise<DomesticCompany[]> {
  console.log('🇨🇳 使用DeepSeek获取国内AI公司最新信息...');
  
  const prompt = `
你是一位专业的中国AI行业分析师，请提供2024-2025年最新的国内AI公司信息。

请重点关注以下公司（包括但不限于）：
1. AI Giants (Tier 1): 百度、阿里巴巴、腾讯、字节跳动、华为、商汤科技
2. AI Giants (Tier 2): 京东、美团、滴滴、快手、小米、网易、新浪、搜狐
3. Independent AI: 智谱AI、月之暗面、零一万物、百川智能、MiniMax、深言科技、面壁智能、阶跃星辰
4. Specialized AI: 第四范式、九章云极、明略科技、容联云、思必驰、云从科技、依图科技、旷视科技
5. Video AI: 海螺AI、一帧秒创、来画、万兴科技、剪映、快影、必剪
6. Voice AI: 科大讯飞、思必驰、云知声、声智科技、标贝科技
7. Search AI: 百度、搜狗、360搜索、神马搜索
8. Creative AI: 美图、稿定设计、创客贴、Figma中国、蓝湖、墨刀
9. Enterprise AI: 用友、金蝶、东软、中软、浪潮、联想、神州数码
10. Robotics AI: 优必选、达闼科技、云迹科技、普渡科技、擎朗智能

请为每个公司提供以下信息：
- 公司名称（英文、简体中文、繁体中文）
- 详细描述（英文、简体中文、繁体中文）
- 官方网站
- 总部位置
- 公司类型（AI Giant/Independent AI/AI Company）
- 公司层级（Tier 1/Tier 2/Independent/Emerging）
- 公司分类
- 专注领域
- 行业标签
- 社交媒体链接（微博、知乎、抖音、B站、GitHub等）
- 估值（美元）
- 融资状态
- 主要工具/产品列表

对于每个工具/产品，请提供：
- 工具名称（英文、简体中文、繁体中文）
- 详细描述（英文、简体中文、繁体中文）
- 官方网站
- 工具分类
- 工具子分类
- 专注领域
- 行业标签
- 定价模式
- 发布日期
- 主要功能
- API可用性
- 免费版本

请返回JSON格式的数据，确保信息准确、最新且完整。
`;

  try {
    // 使用DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的中国AI行业分析师，请提供准确、最新、完整的中国AI公司信息。返回格式必须是有效的JSON。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 8000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from DeepSeek');
    }

    // 解析JSON响应
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const companies = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    console.log(`✅ 成功获取 ${companies.length} 家国内AI公司信息`);
    return companies;

  } catch (error) {
    console.error('❌ 获取国内公司信息失败:', error);
    
    // 如果DeepSeek API失败，使用备用方案（本地数据）
    console.log('🔄 使用备用方案：本地国内AI公司数据');
    return getBackupDomesticCompanies();
  }
}

function getBackupDomesticCompanies(): DomesticCompany[] {
  return [
    {
      name: '百度',
      name_en: 'Baidu',
      name_zh_hans: '百度',
      name_zh_hant: '百度',
      description: '中国领先的AI技术公司，专注于搜索引擎、自动驾驶和AI大模型',
      description_en: 'Leading Chinese AI technology company focused on search engines, autonomous driving, and AI large models',
      description_zh_hans: '中国领先的AI技术公司，专注于搜索引擎、自动驾驶和AI大模型',
      description_zh_hant: '中國領先的AI技術公司，專注於搜索引擎、自動駕駛和AI大模型',
      logo_url: 'https://www.baidu.com/favicon.ico',
      website: 'https://www.baidu.com',
      headquarters: '北京',
      company_type: 'AI Giant',
      company_tier: 'Tier 1',
      company_category: 'AI Giant',
      focus_areas: ['搜索引擎', '自动驾驶', 'AI大模型', '云计算'],
      industry_tags: ['AI', '搜索引擎', '自动驾驶', '大模型'],
      social_links: {
        weibo: 'https://weibo.com/baidu',
        zhihu: 'https://www.zhihu.com/org/baidu'
      },
      valuation_usd: 50000000000,
      funding_status: 'Public',
      tools: [
        {
          name: '文心一言',
          name_en: 'ERNIE Bot',
          name_zh_hans: '文心一言',
          name_zh_hant: '文心一言',
          description: '百度开发的AI对话助手',
          description_en: 'AI conversational assistant developed by Baidu',
          description_zh_hans: '百度开发的AI对话助手',
          description_zh_hant: '百度開發的AI對話助手',
          logo_url: 'https://www.baidu.com/favicon.ico',
          website: 'https://yiyan.baidu.com',
          tool_category: 'LLM & Language Models',
          tool_subcategory: 'Conversational AI',
          focus_areas: ['对话AI', '文本生成', '问答系统'],
          industry_tags: ['AI', '对话', '文本生成'],
          pricing_model: 'Freemium',
          launch_date: '2023-03-16',
          features: ['对话生成', '文本创作', '代码生成', '翻译'],
          api_available: true,
          free_tier: true
        }
      ]
    },
    {
      name: '阿里巴巴',
      name_en: 'Alibaba',
      name_zh_hans: '阿里巴巴',
      name_zh_hant: '阿里巴巴',
      description: '全球领先的电商和云计算公司，在AI领域有重要布局',
      description_en: 'Global leading e-commerce and cloud computing company with significant AI investments',
      description_zh_hans: '全球领先的电商和云计算公司，在AI领域有重要布局',
      description_zh_hant: '全球領先的電商和雲計算公司，在AI領域有重要佈局',
      logo_url: 'https://www.alibaba.com/favicon.ico',
      website: 'https://www.alibaba.com',
      headquarters: '杭州',
      company_type: 'AI Giant',
      company_tier: 'Tier 1',
      company_category: 'AI Giant',
      focus_areas: ['电商', '云计算', 'AI大模型', '金融科技'],
      industry_tags: ['AI', '电商', '云计算', '大模型'],
      social_links: {
        weibo: 'https://weibo.com/alibaba',
        zhihu: 'https://www.zhihu.com/org/alibaba'
      },
      valuation_usd: 200000000000,
      funding_status: 'Public',
      tools: [
        {
          name: '通义千问',
          name_en: 'Qwen',
          name_zh_hans: '通义千问',
          name_zh_hant: '通義千問',
          description: '阿里巴巴开发的AI大模型',
          description_en: 'AI large model developed by Alibaba',
          description_zh_hans: '阿里巴巴开发的AI大模型',
          description_zh_hant: '阿里巴巴開發的AI大模型',
          logo_url: 'https://www.alibaba.com/favicon.ico',
          website: 'https://tongyi.aliyun.com',
          tool_category: 'LLM & Language Models',
          tool_subcategory: 'Large Language Model',
          focus_areas: ['大模型', '文本生成', '代码生成'],
          industry_tags: ['AI', '大模型', '文本生成'],
          pricing_model: 'Freemium',
          launch_date: '2023-04-07',
          features: ['文本生成', '代码生成', '翻译', '问答'],
          api_available: true,
          free_tier: true
        }
      ]
    }
  ];
}

async function insertDomesticCompanies(companies: DomesticCompany[]) {
  console.log('💾 开始插入国内AI公司数据...');
  
  for (const company of companies) {
    try {
      // 插入公司
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: company.name,
          name_en: company.name_en,
          name_zh_hans: company.name_zh_hans,
          name_zh_hant: company.name_zh_hant,
          description: company.description,
          description_en: company.description_en,
          description_zh_hans: company.description_zh_hans,
          description_zh_hant: company.description_zh_hant,
          logo_url: company.logo_url,
          website: company.website,
          headquarters: company.headquarters,
          company_type: company.company_type,
          company_tier: company.company_tier,
          company_category: company.company_category,
          focus_areas: company.focus_areas,
          industry_tags: company.industry_tags,
          social_links: company.social_links,
          valuation_usd: company.valuation_usd,
          funding_status: company.funding_status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (companyError) {
        console.error(`❌ 插入公司 ${company.name} 失败:`, companyError);
        continue;
      }

      console.log(`✅ 成功插入公司: ${company.name}`);

      // 插入工具
      for (const tool of company.tools) {
        try {
          const { error: toolError } = await supabase
            .from('tools')
            .insert({
              name: tool.name,
              name_en: tool.name_en,
              name_zh_hans: tool.name_zh_hans,
              name_zh_hant: tool.name_zh_hant,
              description: tool.description,
              description_en: tool.description_en,
              description_zh_hans: tool.description_zh_hans,
              description_zh_hant: tool.description_zh_hant,
              logo_url: tool.logo_url,
              website: tool.website,
              company_id: companyData.id,
              tool_category: tool.tool_category,
              tool_subcategory: tool.tool_subcategory,
              focus_areas: tool.focus_areas,
              industry_tags: tool.industry_tags,
              pricing_model: tool.pricing_model,
              launch_date: tool.launch_date,
              features: tool.features,
              api_available: tool.api_available,
              free_tier: tool.free_tier,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (toolError) {
            console.error(`❌ 插入工具 ${tool.name} 失败:`, toolError);
          } else {
            console.log(`  ✅ 成功插入工具: ${tool.name}`);
          }
        } catch (error) {
          console.error(`❌ 插入工具 ${tool.name} 时出错:`, error);
        }
      }

    } catch (error) {
      console.error(`❌ 处理公司 ${company.name} 时出错:`, error);
    }
  }
}

async function main() {
  console.log('🚀 开始获取国内AI公司数据...');
  
  try {
    // 1. 获取国内公司数据
    const companies = await fetchDomesticCompaniesWithDeepSeek();
    
    // 2. 插入数据库
    await insertDomesticCompanies(companies);
    
    console.log('🎉 国内AI公司数据获取完成！');
    console.log('📋 下一步：运行数据验证和优化脚本');
    
  } catch (error) {
    console.error('❌ 国内AI公司数据获取失败:', error);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);
