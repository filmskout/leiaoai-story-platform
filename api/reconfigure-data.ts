import 'dotenv/config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req: any, res: any) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 简单的认证（可选）
  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN) {
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
