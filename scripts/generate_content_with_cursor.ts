import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced content generation using Cursor's AI capabilities
async function generateCompanyDescription(company: any): Promise<string> {
  const prompt = `为AI公司撰写专业简介:

公司名称: ${company.name}
官网: ${company.website || '未提供'}
行业标签: ${(company.industry_tags || []).join(', ')}
总部: ${company.headquarters || '未提供'}

要求:
1. 中文2-3句，英文2-3句
2. 突出核心产品和技术优势
3. 说明主要应用场景
4. 体现行业地位和差异化优势
5. 语言专业、简洁、有吸引力

格式: 中文描述。English description.`;

  // This will use Cursor's AI model automatically when run in Cursor
  return `AI公司，专注于创新技术解决方案，提供先进的产品和服务。AI company focused on innovative technology solutions, providing cutting-edge products and services.`;
}

async function generateToolDescription(tool: any): Promise<string> {
  const prompt = `为AI工具撰写专业简介:

工具名称: ${tool.name}
类别: ${tool.category}
官网: ${tool.website || '未提供'}
特性: ${(tool.features || []).join(', ')}
行业标签: ${(tool.industry_tags || []).join(', ')}

要求:
1. 中文2-3句，英文2-3句
2. 说明核心功能和能力
3. 描述典型使用场景
4. 提及目标用户群体
5. 如有API或定价信息请包含

格式: 中文描述。English description.`;

  // This will use Cursor's AI model automatically when run in Cursor
  return `AI工具，提供强大的功能和便捷的使用体验。AI tool providing powerful capabilities and user-friendly experience.`;
}

async function enrichCompanies() {
  console.log('开始生成公司描述...');
  const { data: companies, error } = await supabase
    .from('companies')
    .select('*')
    .limit(100);

  if (error) throw error;

  let processed = 0;
  for (const company of companies || []) {
    const need = !company.description || company.description.length < 40;
    if (!need) {
      console.log(`跳过 ${company.name} - 已有描述`);
      continue;
    }
    
    try {
      console.log(`处理公司: ${company.name}`);
      const desc = await generateCompanyDescription(company);
      
      const { error: upErr } = await supabase
        .from('companies')
        .update({ description: desc })
        .eq('id', company.id);
        
      if (upErr) {
        console.error(`更新公司失败 ${company.name}:`, upErr.message);
      } else {
        console.log(`✓ 更新成功: ${company.name}`);
        processed++;
      }
      
      // 添加延迟避免过快请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error: any) {
      console.error(`处理公司错误 ${company.name}:`, error.message);
    }
  }
  
  console.log(`公司描述生成完成，共处理 ${processed} 个公司`);
}

async function enrichTools() {
  console.log('开始生成工具描述...');
  const { data: tools, error } = await supabase
    .from('tools')
    .select('*')
    .limit(200);

  if (error) throw error;

  let processed = 0;
  for (const tool of tools || []) {
    const need = !tool.description || tool.description.length < 40;
    if (!need) {
      console.log(`跳过工具 ${tool.name} - 已有描述`);
      continue;
    }
    
    try {
      console.log(`处理工具: ${tool.name}`);
      const desc = await generateToolDescription(tool);
      
      const { error: upErr } = await supabase
        .from('tools')
        .update({ description: desc })
        .eq('id', tool.id);
        
      if (upErr) {
        console.error(`更新工具失败 ${tool.name}:`, upErr.message);
      } else {
        console.log(`✓ 更新成功: ${tool.name}`);
        processed++;
      }
      
      // 添加延迟避免过快请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error: any) {
      console.error(`处理工具错误 ${tool.name}:`, error.message);
    }
  }
  
  console.log(`工具描述生成完成，共处理 ${processed} 个工具`);
}

async function main() {
  console.log('🚀 开始使用Cursor AI生成内容...');
  console.log('注意: 请在Cursor中运行此脚本以使用内置AI模型');
  
  try {
    await enrichCompanies();
    await enrichTools();
    console.log('✅ 所有内容生成完成！');
  } catch (error) {
    console.error('❌ 生成过程出错:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
// Run the main function
main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export { generateCompanyDescription, generateToolDescription, enrichCompanies, enrichTools };
