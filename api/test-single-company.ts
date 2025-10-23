import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// 安全的环境变量检查
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

// 延迟初始化客户端
let supabase: any = null;
let openai: any = null;

function initClients() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase配置缺失');
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

// 生成单个公司数据
async function generateSingleCompany() {
  try {
    initClients();
    
    console.log('🚀 开始生成单个公司数据...');
    
    // 插入公司数据
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'OpenAI',
        description: 'OpenAI是一家专注于人工智能研究的公司，开发了GPT系列模型和ChatGPT等产品。',
        founded_year: 2015,
        headquarters: 'San Francisco, CA',
        website: 'https://openai.com',
        employee_count: 1500,
        valuation: '$29B',
        is_overseas: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (companyError) {
      throw new Error(`Failed to insert company: ${companyError.message}`);
    }

    console.log('✅ 公司数据插入成功:', company.name);

    // 插入工具数据
    const { error: toolError } = await supabase.from('tools').insert({
      company_id: company.id,
      name: 'ChatGPT',
      description: 'AI聊天助手，基于GPT模型',
      url: 'https://chat.openai.com',
      category: 'AI工具',
      created_at: new Date().toISOString()
    });

    if (toolError) {
      console.error('⚠️ 工具数据插入失败:', toolError.message);
    } else {
      console.log('✅ 工具数据插入成功');
    }

    // 插入融资数据
    const { error: fundingError } = await supabase.from('fundings').insert({
      company_id: company.id,
      round: 'Series C',
      amount: '$10B',
      investors: 'Microsoft',
      valuation: '$29B',
      date: new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    if (fundingError) {
      console.error('⚠️ 融资数据插入失败:', fundingError.message);
    } else {
      console.log('✅ 融资数据插入成功');
    }

    // 插入新闻故事
    const { error: storyError } = await supabase.from('stories').insert({
      company_id: company.id,
      title: 'OpenAI发布GPT-4模型',
      content: 'OpenAI发布了最新的GPT-4模型，在多个基准测试中表现优异...',
      source: 'TechCrunch',
      url: 'https://techcrunch.com/openai-gpt4',
      published_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    if (storyError) {
      console.error('⚠️ 新闻故事插入失败:', storyError.message);
    } else {
      console.log('✅ 新闻故事插入成功');
    }

    return { success: true, companyId: company.id };
  } catch (error) {
    console.error('❌ 生成公司数据失败:', error);
    throw error;
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

  try {
    const result = await generateSingleCompany();
    
    return res.status(200).json({
      success: true,
      message: '单个公司数据生成成功',
      result
    });
    
  } catch (error: any) {
    console.error('❌ API错误:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
