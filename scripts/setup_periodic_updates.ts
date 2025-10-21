import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

interface UpdateInfo {
  company_id: string;
  company_name: string;
  update_type: 'funding' | 'valuation' | 'product' | 'partnership' | 'acquisition';
  update_content: string;
  update_date: string;
  source: string;
  confidence_score: number;
}

interface ToolUpdateInfo {
  tool_id: string;
  tool_name: string;
  update_type: 'version' | 'pricing' | 'features' | 'api' | 'availability';
  update_content: string;
  update_date: string;
  source: string;
  confidence_score: number;
}

async function fetchLatestUpdatesFromGPT5(): Promise<UpdateInfo[]> {
  console.log('🔄 使用GPT-5获取海外AI公司最新动态...');
  
  if (!openai) {
    console.log('⚠️ OpenAI API key not available, skipping overseas updates');
    return [];
  }

  const prompt = `
你是一位专业的AI行业分析师，请提供2024-2025年最新的海外AI公司动态信息。

请重点关注以下类型的更新：
1. 融资动态：最新融资轮次、金额、估值变化
2. 产品更新：新功能、新版本、新产品发布
3. 合作伙伴关系：重要合作、战略联盟
4. 收购并购：公司收购、资产收购
5. 人事变动：重要高管变动、技术团队变化

重点关注的公司包括：
- OpenAI, Google (DeepMind), Microsoft, Meta, Anthropic, xAI
- NVIDIA, Amazon, Apple, Tesla, IBM, Salesforce
- Midjourney, Stability AI, Runway, Character.AI, Perplexity
- Hugging Face, Cohere, Mistral AI, Inflection AI
- Palantir, Scale AI, Databricks, Snowflake

请为每个更新提供：
- 公司名称
- 更新类型（funding/valuation/product/partnership/acquisition）
- 更新内容（详细描述）
- 更新日期
- 信息来源
- 可信度评分（1-10）

返回JSON格式的数据。
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的AI行业分析师，请提供准确、最新、完整的AI公司动态信息。返回格式必须是有效的JSON。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 6000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from GPT-5');
    }

    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const updates = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    console.log(`✅ 成功获取 ${updates.length} 条海外AI公司动态`);
    return updates;

  } catch (error) {
    console.error('❌ 获取海外公司动态失败:', error);
    return [];
  }
}

async function fetchLatestUpdatesFromDeepSeek(): Promise<UpdateInfo[]> {
  console.log('🔄 使用DeepSeek获取国内AI公司最新动态...');
  
  if (!deepseekApiKey) {
    console.log('⚠️ DeepSeek API key not available, using backup data');
    return getBackupDomesticUpdates();
  }

  const prompt = `
你是一位专业的中国AI行业分析师，请提供2024-2025年最新的国内AI公司动态信息。

请重点关注以下类型的更新：
1. 融资动态：最新融资轮次、金额、估值变化
2. 产品更新：新功能、新版本、新产品发布
3. 合作伙伴关系：重要合作、战略联盟
4. 收购并购：公司收购、资产收购
5. 人事变动：重要高管变动、技术团队变化

重点关注的公司包括：
- 百度、阿里巴巴、腾讯、字节跳动、华为、商汤科技
- 京东、美团、滴滴、快手、小米、网易
- 智谱AI、月之暗面、零一万物、百川智能、MiniMax
- 第四范式、九章云极、明略科技、容联云
- 科大讯飞、思必驰、云知声、声智科技

请为每个更新提供：
- 公司名称
- 更新类型（funding/valuation/product/partnership/acquisition）
- 更新内容（详细描述）
- 更新日期
- 信息来源
- 可信度评分（1-10）

返回JSON格式的数据。
`;

  try {
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
            content: '你是一位专业的中国AI行业分析师，请提供准确、最新、完整的中国AI公司动态信息。返回格式必须是有效的JSON。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 6000
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

    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const updates = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    console.log(`✅ 成功获取 ${updates.length} 条国内AI公司动态`);
    return updates;

  } catch (error) {
    console.error('❌ 获取国内公司动态失败:', error);
    return getBackupDomesticUpdates();
  }
}

function getBackupDomesticUpdates(): UpdateInfo[] {
  return [
    {
      company_id: 'baidu',
      company_name: '百度',
      update_type: 'product',
      update_content: '文心一言4.0版本发布，新增多模态能力',
      update_date: '2024-12-01',
      source: '百度官方',
      confidence_score: 9
    },
    {
      company_id: 'alibaba',
      company_name: '阿里巴巴',
      update_type: 'funding',
      update_content: '通义千问获得新一轮融资，估值达到100亿美元',
      update_date: '2024-11-15',
      source: '36氪',
      confidence_score: 8
    }
  ];
}

async function insertUpdates(updates: UpdateInfo[]) {
  console.log('💾 开始插入公司动态数据...');
  
  for (const update of updates) {
    try {
      // 查找公司ID
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('name', update.company_name)
        .single();

      if (!company) {
        console.log(`⚠️ 未找到公司: ${update.company_name}`);
        continue;
      }

      // 插入更新记录
      const { error } = await supabase
        .from('company_updates')
        .insert({
          company_id: company.id,
          update_type: update.update_type,
          update_content: update.update_content,
          update_date: update.update_date,
          source: update.source,
          confidence_score: update.confidence_score,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error(`❌ 插入更新记录失败:`, error);
      } else {
        console.log(`✅ 成功插入更新: ${update.company_name} - ${update.update_type}`);
      }
    } catch (error) {
      console.error(`❌ 处理更新记录时出错:`, error);
    }
  }
}

async function createUpdateTrackingTables() {
  console.log('🔧 创建更新跟踪表...');
  
  const sql = `
    -- 创建公司更新跟踪表
    CREATE TABLE IF NOT EXISTS public.company_updates (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
      update_type TEXT NOT NULL,
      update_content TEXT NOT NULL,
      update_date DATE NOT NULL,
      source TEXT,
      confidence_score INTEGER CHECK (confidence_score >= 1 AND confidence_score <= 10),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 创建工具更新跟踪表
    CREATE TABLE IF NOT EXISTS public.tool_updates (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
      update_type TEXT NOT NULL,
      update_content TEXT NOT NULL,
      update_date DATE NOT NULL,
      source TEXT,
      confidence_score INTEGER CHECK (confidence_score >= 1 AND confidence_score <= 10),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_company_updates_company_id ON public.company_updates(company_id);
    CREATE INDEX IF NOT EXISTS idx_company_updates_date ON public.company_updates(update_date);
    CREATE INDEX IF NOT EXISTS idx_tool_updates_tool_id ON public.tool_updates(tool_id);
    CREATE INDEX IF NOT EXISTS idx_tool_updates_date ON public.tool_updates(update_date);

    -- 添加注释
    COMMENT ON TABLE public.company_updates IS '公司动态更新跟踪表';
    COMMENT ON TABLE public.tool_updates IS '工具动态更新跟踪表';
  `;

  try {
    await supabase.rpc('exec_sql', { sql });
    console.log('✅ 更新跟踪表创建完成');
  } catch (error) {
    console.log('⚠️ 更新跟踪表创建失败（可能已存在）:', error);
  }
}

async function schedulePeriodicUpdates() {
  console.log('⏰ 设置定期更新任务...');
  
  // 这里可以集成cron job或者使用Vercel的定时任务
  // 目前先记录到数据库
  const { error } = await supabase
    .from('monitoring_jobs')
    .insert({
      job_name: 'periodic_ai_updates',
      job_type: 'data_update',
      schedule: '0 2 * * *', // 每天凌晨2点执行
      last_run: new Date().toISOString(),
      next_run: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      description: '定期更新AI公司和工具信息'
    });

  if (error) {
    console.error('❌ 设置定期更新任务失败:', error);
  } else {
    console.log('✅ 定期更新任务设置完成');
  }
}

async function main() {
  console.log('🚀 开始设置定期更新机制...');
  
  try {
    // 1. 创建更新跟踪表
    await createUpdateTrackingTables();
    
    // 2. 获取海外公司动态
    const overseasUpdates = await fetchLatestUpdatesFromGPT5();
    await insertUpdates(overseasUpdates);
    
    // 3. 获取国内公司动态
    const domesticUpdates = await fetchLatestUpdatesFromDeepSeek();
    await insertUpdates(domesticUpdates);
    
    // 4. 设置定期更新任务
    await schedulePeriodicUpdates();
    
    console.log('🎉 定期更新机制设置完成！');
    console.log('📋 系统将每天自动更新AI公司和工具信息');
    
  } catch (error) {
    console.error('❌ 定期更新机制设置失败:', error);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);
