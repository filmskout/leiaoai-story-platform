import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// 初始化Supabase客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase配置缺失');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req: any, res: any) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!supabase) {
    return res.status(500).json({
      success: false,
      error: '数据库配置缺失',
      timestamp: new Date().toISOString()
    });
  }

  try {
    console.log('🔍 检查数据生成详细进度...');
    
    // 检查companies表 - 获取详细信息
    const { data: companies, error: companiesError, count: companiesCount } = await supabase
      .from('companies')
      .select('id, name, created_at', { count: 'exact' });
    
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

    // 计算进度
    const totalExpected = 200; // 目标200家公司
    const currentProgress = companiesCount || 0;
    const progressPercentage = Math.round((currentProgress / totalExpected) * 100);
    
    // 分析数据完整性
    const companiesWithTools = companies ? companies.filter(c => {
      // 这里需要检查每个公司是否有工具数据
      return true; // 简化处理
    }).length : 0;
    
    const companiesWithStories = companies ? companies.filter(c => {
      // 这里需要检查每个公司是否有故事数据
      return true; // 简化处理
    }).length : 0;

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
        tools: toolsCount || 0,
        fundings: fundingsCount || 0,
        stories: storiesCount || 0,
        total_records: (companiesCount || 0) + (toolsCount || 0) + (fundingsCount || 0) + (storiesCount || 0)
      },
      completeness: {
        companies_with_tools: Math.round(((toolsCount || 0) / Math.max(companiesCount || 1, 1)) * 100),
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
      tools: toolsCount,
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
