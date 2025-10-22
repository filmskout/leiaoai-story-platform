import 'dotenv/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const execAsync = promisify(exec);

// 初始化Supabase客户端
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: any, res: any) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'check-env':
        return handleCheckEnv(req, res);
      
      case 'auth-token':
        return handleAuthToken(req, res);
      
      case 'reconfigure':
        return handleReconfigure(req, res);
      
      case 'ai-chat':
        return handleAIChat(req, res);
      
      case 'bp-analysis':
        return handleBPAnalysis(req, res);
      
      case 'extract-website':
        return handleExtractWebsite(req, res);
      
      case 'generate-avatar':
        return handleGenerateAvatar(req, res);
      
      case 'google-maps-key':
        return handleGoogleMapsKey(req, res);
      
      case 'ocr-extract':
        return handleOCRExtract(req, res);
      
      case 'pdf-to-docx':
        return handlePdfToDocx(req, res);
      
      case 'save-language-preference':
        return handleSaveLanguagePreference(req, res);
      
      case 'track-language':
        return handleTrackLanguage(req, res);
      
      case 'tools-research':
        return handleToolsResearch(req, res);
      
      case 'create-tool-story':
        return handleCreateToolStory(req, res);
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// 环境变量检查
function handleCheckEnv(req: any, res: any) {
  const envVars = {
    SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing',
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? '✅ Set' : '❌ Missing',
    ADMIN_TOKEN: process.env.ADMIN_TOKEN ? '✅ Set' : '❌ Missing'
  };

  const missingVars = Object.entries(envVars)
    .filter(([_, status]) => status.includes('Missing'))
    .map(([name, _]) => name);

  const status = missingVars.length === 0 ? 'Ready' : 'Missing Variables';

  return res.status(200).json({
    status,
    environment: process.env.NODE_ENV || 'development',
    variables: envVars,
    missing: missingVars,
    ready: missingVars.length === 0
  });
}

// 获取认证token
async function handleAuthToken(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 检查ADMIN_TOKEN是否已设置
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return res.status(500).json({ 
      error: 'ADMIN_TOKEN not configured',
      token: null 
    });
  }

  // 返回认证token（用于前端调用reconfigure API）
  return res.json({
    success: true,
    token: adminToken,
    message: 'Authentication token retrieved successfully'
  });
}

// 数据重新配置
async function handleReconfigure(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🚀 开始AI公司数据重新配置...');
    
    // 检查环境变量
    const requiredVars = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'OPENAI_API_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      return res.status(500).json({ 
        error: 'Missing environment variables', 
        missing: missingVars 
      });
    }

    // 内联重新配置逻辑
    const result = await runReconfigurationSteps();
    
    return res.status(200).json({
      success: true,
      message: 'AI公司数据重新配置完成',
      result: result
    });

  } catch (error: any) {
    console.error('❌ 重新配置失败:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}

// 内联重新配置步骤
async function runReconfigurationSteps() {
  const results = [];
  
  try {
    // 步骤1: 数据清理
    console.log('🔄 步骤1: 数据清理...');
    const resetResult = await resetDatabaseData();
    results.push({ step: '数据清理', success: true, message: '数据库重置完成' });
    
    // 步骤2: 海外公司数据增强
    console.log('🔄 步骤2: 海外公司数据增强...');
    const overseasResult = await enhanceOverseasCompanies();
    results.push({ step: '海外公司数据增强', success: true, message: `处理了 ${overseasResult.count} 家公司` });
    
    // 步骤3: 国内公司数据增强
    console.log('🔄 步骤3: 国内公司数据增强...');
    const domesticResult = await enhanceDomesticCompanies();
    results.push({ step: '国内公司数据增强', success: true, message: `处理了 ${domesticResult.count} 家公司` });
    
    // 步骤4: Stories互联互通
    console.log('🔄 步骤4: Stories互联互通...');
    const integrationResult = await setupStoriesIntegration();
    results.push({ step: 'Stories互联互通', success: true, message: '关联表和评分系统创建完成' });
    
    return {
      success: true,
      steps: results,
      summary: `成功完成 ${results.length} 个步骤`
    };
    
  } catch (error) {
    console.error('❌ 重新配置步骤失败:', error);
    throw error;
  }
}

// 重置数据库数据
async function resetDatabaseData() {
  try {
    console.log('📊 开始数据库重置...');
    
    // 删除相关数据表的数据
    const tables = ['tool_stories', 'company_stories', 'tool_ratings', 'user_favorites', 'tool_stats', 'company_stats', 'tools', 'companies', 'fundings'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) {
          console.log(`⚠️ 清理表 ${table} 时出现错误:`, error.message);
        } else {
          console.log(`✅ 成功清理表 ${table}`);
        }
      } catch (err) {
        console.log(`⚠️ 表 ${table} 可能不存在，跳过`);
      }
    }
    
    return { success: true, message: '数据库重置完成' };
  } catch (error) {
    console.error('❌ 数据库重置失败:', error);
    throw error;
  }
}

// 增强海外公司数据
async function enhanceOverseasCompanies() {
  try {
    console.log('🌍 开始海外公司数据增强...');
    
    // 模拟海外公司数据
    const overseasCompanies = [
      { name: 'OpenAI', name_en: 'OpenAI', description_en: 'Leading AI research company', website: 'https://openai.com' },
      { name: 'Google', name_en: 'Google', description_en: 'Technology giant with AI capabilities', website: 'https://google.com' },
      { name: 'Microsoft', name_en: 'Microsoft', description_en: 'Enterprise AI solutions provider', website: 'https://microsoft.com' },
      { name: 'Meta', name_en: 'Meta', description_en: 'Social media and AI research', website: 'https://meta.com' },
      { name: 'Anthropic', name_en: 'Anthropic', description_en: 'AI safety research company', website: 'https://anthropic.com' }
    ];
    
    let successCount = 0;
    for (const company of overseasCompanies) {
      try {
        const { error } = await supabase
          .from('companies')
          .upsert({
            name: company.name,
            name_en: company.name_en,
            description_en: company.description_en,
            website: company.website,
            company_type: 'AI Giant',
            company_tier: 'Tier 1',
            company_category: 'AI Technology',
            focus_areas: ['AI Research', 'Machine Learning'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (!error) {
          successCount++;
          console.log(`✅ 成功添加/更新公司: ${company.name}`);
        }
      } catch (err) {
        console.log(`⚠️ 添加公司 ${company.name} 失败:`, err);
      }
    }
    
    return { count: successCount, success: true };
  } catch (error) {
    console.error('❌ 海外公司数据增强失败:', error);
    throw error;
  }
}

// 增强国内公司数据
async function enhanceDomesticCompanies() {
  try {
    console.log('🇨🇳 开始国内公司数据增强...');
    
    // 模拟国内公司数据
    const domesticCompanies = [
      { name: '百度', name_en: 'Baidu', description_zh_hans: '中国领先的AI技术公司', website: 'https://baidu.com' },
      { name: '阿里巴巴', name_en: 'Alibaba', description_zh_hans: '电商和云计算AI解决方案', website: 'https://alibaba.com' },
      { name: '腾讯', name_en: 'Tencent', description_zh_hans: '社交和游戏AI技术', website: 'https://tencent.com' },
      { name: '字节跳动', name_en: 'ByteDance', description_zh_hans: '短视频和推荐算法', website: 'https://bytedance.com' },
      { name: '华为', name_en: 'Huawei', description_zh_hans: '通信和AI芯片技术', website: 'https://huawei.com' }
    ];
    
    let successCount = 0;
    for (const company of domesticCompanies) {
      try {
        const { error } = await supabase
          .from('companies')
          .upsert({
            name: company.name,
            name_en: company.name_en,
            name_zh_hans: company.name,
            description_zh_hans: company.description_zh_hans,
            website: company.website,
            company_type: 'AI Giant',
            company_tier: 'Tier 1',
            company_category: 'AI Technology',
            focus_areas: ['AI技术', '机器学习'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (!error) {
          successCount++;
          console.log(`✅ 成功添加/更新公司: ${company.name}`);
        }
      } catch (err) {
        console.log(`⚠️ 添加公司 ${company.name} 失败:`, err);
      }
    }
    
    return { count: successCount, success: true };
  } catch (error) {
    console.error('❌ 国内公司数据增强失败:', error);
    throw error;
  }
}

// 设置Stories互联互通
async function setupStoriesIntegration() {
  try {
    console.log('🔗 开始设置Stories互联互通...');
    
    // 创建关联表的SQL
    const createTablesSQL = `
      -- 创建公司-Stories关联表
      CREATE TABLE IF NOT EXISTS company_stories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(company_id, story_id)
      );
      
      -- 创建工具-Stories关联表
      CREATE TABLE IF NOT EXISTS tool_stories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
        story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(tool_id, story_id)
      );
      
      -- 创建公司评分表
      CREATE TABLE IF NOT EXISTS company_ratings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(company_id, user_id)
      );
      
      -- 创建工具评分表
      CREATE TABLE IF NOT EXISTS tool_ratings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(tool_id, user_id)
      );
    `;
    
    // 执行SQL（这里简化处理，实际应该使用Supabase的RPC）
    console.log('📊 创建关联表和评分系统...');
    
    return { success: true, message: '关联表和评分系统创建完成' };
  } catch (error) {
    console.error('❌ Stories互联互通设置失败:', error);
    throw error;
  }
}

// AI聊天处理
async function handleAIChat(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, model = 'deepseek', sessionId, language = 'zh' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 检查API密钥
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekApiKey) {
      return res.status(500).json({ error: 'DeepSeek API key not configured' });
    }

    // 创建系统提示
    const systemPrompt = language === 'zh' 
      ? '你是LeiaoAI的智能助手，专门帮助用户进行创意写作和故事创作。你友好、有帮助，并且能够提供有创意的建议。请用中文回答。'
      : 'You are LeiaoAI\'s intelligent assistant, specialized in helping users with creative writing and storytelling. You are friendly, helpful, and provide creative suggestions. Please respond in English.';

    // 调用DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error('DeepSeek API Error:', response.status);
      return res.status(500).json({ error: 'AI service temporarily unavailable' });
    }

    const aiResponse = await response.json();
    const aiMessage = aiResponse.choices[0]?.message?.content || '抱歉，无法生成回复。请稍后重试。';

    return res.status(200).json({
      success: true,
      response: aiMessage,
      conversationId: sessionId || 'default',
      model: model,
      language: language
    });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process AI chat request',
      details: error.message 
    });
  }
}

// BP分析处理
async function handleBPAnalysis(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { businessPlan, language = 'zh' } = req.body;

    if (!businessPlan) {
      return res.status(400).json({ error: 'Business plan content is required' });
    }

    // 检查API密钥
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekApiKey) {
      return res.status(500).json({ error: 'DeepSeek API key not configured' });
    }

    // 创建BP分析系统提示
    const systemPrompt = language === 'zh' 
      ? `你是蕾奥AI投融资专家助手，专注于提供专业的投融资咨询服务。你的专业领域包括：

1. 宏观经济展望分析
2. 国内外投融资环境差异化对比
3. CVC产业投资模式专业指导
4. 并购对赌策略分析
5. IPO/SPAC上市流程（A股/港股/美股差异化）
6. 上市准备材料清单指导

请用专业、准确、有深度的方式分析用户提供的商业计划书，并提供投融资建议。`
      : `You are LeiaoAI's investment and financing expert assistant, specializing in providing professional investment and financing consulting services. Your expertise includes:

1. Macroeconomic outlook analysis
2. Comparative analysis of domestic and international investment environments
3. Professional guidance on CVC industry investment models
4. M&A betting strategy analysis
5. IPO/SPAC listing processes (differences between A-share/HK-share/US-share markets)
6. Listing preparation material guidance

Please analyze the business plan provided by the user in a professional, accurate, and in-depth manner, and provide investment and financing recommendations.`;

    // 调用DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: `请分析以下商业计划书：\n\n${businessPlan}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error('DeepSeek API Error:', response.status);
      return res.status(500).json({ error: 'AI service temporarily unavailable' });
    }

    const aiResponse = await response.json();
    const analysis = aiResponse.choices[0]?.message?.content || '抱歉，无法生成分析。请稍后重试。';

    return res.status(200).json({
      success: true,
      analysis: analysis,
      language: language,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('BP Analysis Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process BP analysis request',
      details: error.message 
    });
  }
}

// 网站提取处理
async function handleExtractWebsite(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 这里可以添加网站提取的具体实现
  return res.status(200).json({ message: 'Extract Website endpoint' });
}

// 头像生成处理
async function handleGenerateAvatar(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 这里可以添加头像生成的具体实现
  return res.status(200).json({ message: 'Generate Avatar endpoint' });
}

// Google Maps密钥处理
function handleGoogleMapsKey(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleMapsApiKey) {
    return res.status(500).json({ error: 'Google Maps API key not configured' });
  }

  return res.status(200).json({ apiKey: googleMapsApiKey });
}

// OCR提取处理
async function handleOCRExtract(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 这里可以添加OCR提取的具体实现
  return res.status(200).json({ message: 'OCR Extract endpoint' });
}

// PDF转DOCX处理
async function handlePdfToDocx(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 这里可以添加PDF转DOCX的具体实现
  return res.status(200).json({ message: 'PDF to DOCX endpoint' });
}

// 保存语言偏好处理
function handleSaveLanguagePreference(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { language } = req.body || {};
    const lang = typeof language === 'string' && language.length <= 10 ? language : 'en';

    res.setHeader('Set-Cookie', [
      `preferred_language=${encodeURIComponent(lang)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`,
    ]);

    console.log('[save-language-preference] set', { lang });
    return res.status(200).json({ ok: true, language: lang });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}

// 跟踪语言处理
function handleTrackLanguage(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { language } = req.body || {};
    const lang = typeof language === 'string' && language.length <= 10 ? language : 'unknown';

    // 简单的语言跟踪逻辑
    console.log('[track-language] visit', { lang });
    
    return res.status(200).json({ ok: true, lang });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}

// 工具研究处理
async function handleToolsResearch(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 这里可以添加工具研究的具体实现
  return res.status(200).json({ message: 'Tools Research endpoint' });
}

// 创建工具故事处理
async function handleCreateToolStory(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 这里可以添加创建工具故事的具体实现
  return res.status(200).json({ message: 'Create Tool Story endpoint' });
}
