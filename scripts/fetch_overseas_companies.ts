import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiApiKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

interface OverseasCompany {
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
    twitter?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  valuation_usd: number | null;
  funding_status: string;
  tools: OverseasTool[];
}

interface OverseasTool {
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

async function fetchOverseasCompaniesWithGPT5(): Promise<OverseasCompany[]> {
  console.log('🌍 使用GPT-5获取海外AI公司最新信息...');
  
  const prompt = `
你是一位专业的AI行业分析师，请提供2024-2025年最新的海外AI公司信息。

请重点关注以下公司（包括但不限于）：
1. AI Giants (Tier 1): OpenAI, Google (DeepMind), Microsoft, Meta, Anthropic, xAI
2. AI Giants (Tier 2): NVIDIA, Amazon, Apple, Tesla, IBM, Salesforce
3. Independent AI: Midjourney, Stability AI, Runway, Character.AI, Perplexity, Hugging Face, Cohere, Mistral AI, Inflection AI
4. Specialized AI: Palantir, Scale AI, Databricks, Snowflake, Databricks, Scale AI, Weights & Biases
5. Video AI: Pika Labs, Synthesia, D-ID, HeyGen, InVideo, Pictory
6. Voice AI: ElevenLabs, Murf, Speechify, Descript, Rev
7. Search AI: Perplexity, You.com, Neeva, Brave Search
8. Creative AI: Canva, Figma, Adobe, Notion, Grammarly
9. Enterprise AI: ServiceNow, Workday, Oracle, SAP, IBM Watson
10. Robotics AI: Boston Dynamics, Tesla Bot, Agility Robotics, Figure AI

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
- 社交媒体链接
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
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // 使用最新的GPT-4o模型
      messages: [
        {
          role: 'system',
          content: '你是一位专业的AI行业分析师，请提供准确、最新、完整的AI公司信息。返回格式必须是有效的JSON。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 8000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from GPT-5');
    }

    // 解析JSON响应
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const companies = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    console.log(`✅ 成功获取 ${companies.length} 家海外AI公司信息`);
    return companies;

  } catch (error) {
    console.error('❌ 获取海外公司信息失败:', error);
    throw error;
  }
}

async function insertOverseasCompanies(companies: OverseasCompany[]) {
  console.log('💾 开始插入海外AI公司数据...');
  
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
  console.log('🚀 开始获取海外AI公司数据...');
  
  try {
    // 1. 获取海外公司数据
    const companies = await fetchOverseasCompaniesWithGPT5();
    
    // 2. 插入数据库
    await insertOverseasCompanies(companies);
    
    console.log('🎉 海外AI公司数据获取完成！');
    console.log('📋 下一步：运行国内AI公司数据获取脚本');
    
  } catch (error) {
    console.error('❌ 海外AI公司数据获取失败:', error);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);
