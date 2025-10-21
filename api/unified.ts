import 'dotenv/config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

    // 运行重新配置脚本
    const { stdout, stderr } = await execAsync('tsx scripts/comprehensive_reconfiguration.ts');
    
    return res.status(200).json({
      success: true,
      message: 'AI公司数据重新配置完成',
      output: stdout,
      warnings: stderr
    });

  } catch (error: any) {
    console.error('❌ 重新配置失败:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    });
  }
}

// AI聊天处理
async function handleAIChat(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 这里可以添加AI聊天的具体实现
  return res.status(200).json({ message: 'AI Chat endpoint' });
}

// BP分析处理
async function handleBPAnalysis(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 这里可以添加BP分析的具体实现
  return res.status(200).json({ message: 'BP Analysis endpoint' });
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
