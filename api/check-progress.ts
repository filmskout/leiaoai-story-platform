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
    console.log('🔍 检查数据生成进度...');
    
    // 检查companies表
    const { count: companiesCount, error: companiesError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    
    if (companiesError) {
      console.error('❌ Companies表错误:', companiesError);
    }
    
    // 检查tools表
    const { count: toolsCount, error: toolsError } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });
    
    if (toolsError) {
      console.error('❌ Tools表错误:', toolsError);
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
    
    const result = {
      success: true,
      message: '数据生成进度检查',
      data: {
        companies: companiesCount || 0,
        tools: toolsCount || 0,
        fundings: fundingsCount || 0,
        stories: storiesCount || 0,
        total: (companiesCount || 0) + (toolsCount || 0) + (fundingsCount || 0) + (storiesCount || 0)
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
