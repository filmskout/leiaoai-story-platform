import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const qwenApiKey = process.env.QWEN_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 调用LLM查找项目URL
async function findProjectUrl(projectName, companyName) {
  if (!qwenApiKey) {
    console.warn('⚠️  QWEN_API_KEY未配置，跳过URL查找');
    return null;
  }

  const endpoint = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';
  
  const prompt = `查找项目"${projectName}"（所属公司：${companyName}）的官方网站URL。

要求：
1. 必须是项目的官方真实网站
2. 只返回URL，不要其他文字
3. 格式示例：https://chat.openai.com
4. 如果找不到，返回 "null"

只返回URL或null：`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${qwenApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          { role: 'system', content: '你是一个专业的AI研究助手，准确提供项目官网URL。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      console.error(`❌ Qwen API错误: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const url = data.choices[0].message.content.trim();
    
    // 验证URL格式
    if (url && url !== 'null' && (url.startsWith('http://') || url.startsWith('https://'))) {
      return url;
    }
    
    return null;
  } catch (error) {
    console.error(`❌ ${projectName} URL查找失败:`, error.message);
    return null;
  }
}

// 生成SQL脚本
async function generateSQLScripts() {
  console.log('🚀 开始生成项目URL补齐SQL脚本...\n');
  
  // 获取所有项目和关联公司
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      website,
      company_id,
      company:companies!inner(
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ 获取项目列表失败:', error);
    return;
  }
  
  console.log(`📊 找到 ${projects.length} 个项目\n`);
  
  const batchSize = 30;
  const batches = [];
  
  for (let i = 0; i < projects.length; i += batchSize) {
    const batch = projects.slice(i, i + batchSize);
    batches.push(batch);
  }
  
  console.log(`📦 将分为 ${batches.length} 批处理\n`);
  
  // 生成SQL文件
  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];
    const batchNumber = batchIdx + 1;
    const sqlStatements = [];
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📝 生成第 ${batchNumber} 批 SQL（项目 ${batchIdx * batchSize + 1}-${Math.min((batchIdx + 1) * batchSize, projects.length)}）`);
    console.log(`${'='.repeat(60)}\n`);
    
    for (const project of batch) {
      // 已有URL的跳过
      if (project.website) {
        console.log(`⏭️  跳过: ${project.name}（已有URL: ${project.website}）`);
        continue;
      }
      
      console.log(`🔍 查找: ${project.name} (${project.company?.name})`);
      
      const url = await findProjectUrl(project.name, project.company?.name);
      
      if (url) {
        sqlStatements.push(`UPDATE projects SET website = '${url}' WHERE id = '${project.id}';`);
        console.log(`  ✅ 找到URL: ${url}`);
      } else {
        console.log(`  ❌ 未找到URL`);
      }
      
      // 每处理一个后等待1秒（避免API限流）
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 保存SQL文件
    if (sqlStatements.length > 0) {
      const fs = require('fs');
      const fileName = `update-project-urls-batch${batchNumber}.sql`;
      const sqlContent = sqlStatements.join('\n');
      
      fs.writeFileSync(fileName, sqlContent, 'utf-8');
      console.log(`\n✅ 已生成 ${sqlStatements.length} 条SQL语句 → ${fileName}`);
    } else {
      console.log(`\n⏭️  本批无需更新URL`);
    }
  }
  
  console.log(`\n\n${'='.repeat(60)}`);
  console.log('📋 执行说明：');
  console.log('1. 打开 Supabase SQL Editor');
  console.log('2. 按批次号顺序执行生成的SQL文件');
  console.log('3. 例如：先执行 update-project-urls-batch1.sql');
  console.log('4. 再执行 update-project-urls-batch2.sql，以此类推');
  console.log(`\n共 ${batches.length} 个SQL文件已生成`);
  console.log(`${'='.repeat(60)}\n`);
}

// 运行脚本
generateSQLScripts().catch(error => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});

