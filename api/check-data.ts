import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// 检查数据库中的数据
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase配置缺失');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🔍 检查数据库中的数据...');
    
    // 检查companies表
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, description, created_at')
      .limit(10);
    
    if (companiesError) {
      console.error('❌ Companies表错误:', companiesError);
      return res.status(500).json({
        success: false,
        error: `Companies表错误: ${companiesError.message}`,
        companiesCount: 0
      });
    }
    
    // 检查tools表
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, company_id')
      .limit(10);
    
    if (toolsError) {
      console.error('❌ Tools表错误:', toolsError);
    }
    
    // 检查fundings表
    const { data: fundings, error: fundingsError } = await supabase
      .from('fundings')
      .select('id, company_id, amount')
      .limit(10);
    
    if (fundingsError) {
      console.error('❌ Fundings表错误:', fundingsError);
    }
    
    // 检查stories表
    const { data: stories, error: storiesError } = await supabase
      .from('stories')
      .select('id, title, company_id')
      .limit(10);
    
    if (storiesError) {
      console.error('❌ Stories表错误:', storiesError);
    }
    
    const result = {
      success: true,
      message: '数据检查完成',
      data: {
        companies: {
          count: companies?.length || 0,
          sample: companies?.slice(0, 3) || []
        },
        tools: {
          count: tools?.length || 0,
          sample: tools?.slice(0, 3) || []
        },
        fundings: {
          count: fundings?.length || 0,
          sample: fundings?.slice(0, 3) || []
        },
        stories: {
          count: stories?.length || 0,
          sample: stories?.slice(0, 3) || []
        }
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 数据统计:', result.data);
    
    return res.status(200).json(result);
    
  } catch (error: any) {
    console.error('❌ 检查数据失败:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
