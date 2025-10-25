// 简化的AI Chat测试API
export default async function handler(req: any, res: any) {
  try {
    console.log('🧪 Test API called');
    
    // 检查环境变量
    const envCheck = {
      openai: !!process.env.OPENAI_API_KEY,
      deepseek: !!process.env.DEEPSEEK_API_KEY,
      qwen: !!process.env.QWEN_API_KEY,
      supabase: !!process.env.SUPABASE_URL,
      nodeEnv: process.env.NODE_ENV
    };
    
    console.log('🔑 Environment check:', envCheck);
    
    return res.status(200).json({
      success: true,
      message: 'Test API working',
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Test API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}