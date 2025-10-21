import 'dotenv/config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface Step {
  name: string;
  script: string;
  description: string;
}

const steps: Step[] = [
  {
    name: '数据清理',
    script: 'tsx scripts/comprehensive_data_reset.ts',
    description: '清理现有凌乱的数据，重置数据库'
  },
  {
    name: '海外公司数据',
    script: 'tsx scripts/fetch_overseas_companies.ts',
    description: '使用GPT-5获取海外AI公司最新信息'
  },
  {
    name: '国内公司数据',
    script: 'tsx scripts/fetch_domestic_companies.ts',
    description: '使用DeepSeek获取国内AI公司最新信息'
  },
  {
    name: '定期更新机制',
    script: 'tsx scripts/setup_periodic_updates.ts',
    description: '设置定期更新机制和跟踪表'
  }
];

async function runStep(step: Step): Promise<boolean> {
  console.log(`\n🚀 开始执行: ${step.name}`);
  console.log(`📝 描述: ${step.description}`);
  console.log(`⚡ 命令: ${step.script}`);
  console.log('─'.repeat(60));
  
  try {
    const { stdout, stderr } = await execAsync(step.script);
    
    if (stdout) {
      console.log('📤 输出:', stdout);
    }
    
    if (stderr) {
      console.log('⚠️ 警告:', stderr);
    }
    
    console.log(`✅ ${step.name} 执行成功！`);
    return true;
    
  } catch (error: any) {
    console.error(`❌ ${step.name} 执行失败:`, error.message);
    if (error.stdout) {
      console.log('📤 输出:', error.stdout);
    }
    if (error.stderr) {
      console.log('📤 错误:', error.stderr);
    }
    return false;
  }
}

async function checkEnvironment() {
  console.log('🔍 检查环境变量...');
  
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'OPENAI_API_KEY'
  ];
  
  const optionalVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'DEEPSEEK_API_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  let allRequired = true;
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`❌ 缺少必需环境变量: ${varName}`);
      allRequired = false;
    } else {
      console.log(`✅ ${varName}: ${process.env[varName]?.substring(0, 20)}...`);
    }
  }
  
  for (const varName of optionalVars) {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: ${process.env[varName]?.substring(0, 20)}...`);
    } else {
      console.log(`⚠️ 可选环境变量未设置: ${varName}`);
    }
  }
  
  if (!allRequired) {
    console.error('❌ 环境变量检查失败，请设置必需的环境变量');
    process.exit(1);
  }
  
  console.log('✅ 环境变量检查通过');
}

async function main() {
  console.log('🎯 AI公司数据全面重新配置系统');
  console.log('═'.repeat(60));
  
  try {
    // 1. 检查环境
    await checkEnvironment();
    
    // 2. 执行所有步骤
    let successCount = 0;
    let failureCount = 0;
    
    for (const step of steps) {
      const success = await runStep(step);
      if (success) {
        successCount++;
      } else {
        failureCount++;
        console.log(`\n⚠️ 步骤 "${step.name}" 失败，是否继续？`);
        console.log('按 Ctrl+C 停止，或等待5秒后继续...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    // 3. 显示结果
    console.log('\n' + '═'.repeat(60));
    console.log('📊 执行结果汇总');
    console.log('═'.repeat(60));
    console.log(`✅ 成功: ${successCount} 个步骤`);
    console.log(`❌ 失败: ${failureCount} 个步骤`);
    console.log(`📈 成功率: ${((successCount / steps.length) * 100).toFixed(1)}%`);
    
    if (failureCount === 0) {
      console.log('\n🎉 所有步骤执行成功！');
      console.log('📋 下一步：');
      console.log('1. 检查数据库中的数据');
      console.log('2. 测试AI公司目录页面');
      console.log('3. 验证分类和筛选功能');
    } else {
      console.log('\n⚠️ 部分步骤执行失败，请检查错误信息');
      console.log('📋 建议：');
      console.log('1. 检查环境变量设置');
      console.log('2. 检查网络连接');
      console.log('3. 重新运行失败的步骤');
    }
    
  } catch (error) {
    console.error('❌ 主程序执行失败:', error);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);
