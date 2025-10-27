#!/usr/bin/env node
/**
 * 使用 LLM 生成完整的 SQL 脚本
 * 生成后可直接复制到 SQL Editor 执行
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 调用Qwen API
async function callQwen(message: string, maxTokens: number = 2000): Promise<string> {
  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${QWEN_API_KEY}`
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      messages: [
        { role: 'user', content: message }
      ],
      temperature: 0.3,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    throw new Error(`Qwen API失败: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 生成单个公司的SQL
async function generateCompanySQL(company: any): Promise<string> {
  console.log(`🔄 为 ${company.name} 生成SQL...`);
  
  const prompt = `你是AI行业研究专家。请为AI公司"${company.name}"生成准确的SQL更新语句。

要求：
1. 生成完整的UPDATE SQL语句
2. 所有数据必须真实准确
3. website必须是官方真实网站
4. description（100字内，中文）
5. headquarters（城市, 国家）
6. founded_year（数字）
7. employee_count（格式：500-1000人）
8. logo_url（使用clearbit格式）

返回格式（只返回SQL语句，不要其他文字）：
UPDATE companies 
SET 
  website = 'https://www.example.com',
  description = '公司简介...',
  headquarters = 'City, Country',
  founded_year = 2020,
  employee_count = '500-1000人',
  logo_url = 'https://logo.clearbit.com/example.com'
WHERE name = '${company.name}';`;
  
  const response = await callQwen(prompt, 2000);
  
  // 提取SQL语句
  const sqlMatch = response.match(/UPDATE[\s\S]*?;/);
  if (sqlMatch) {
    return sqlMatch[0];
  }
  
  return `-- 无法为 ${company.name} 生成SQL: ${response}`;
}

// 主函数
async function main() {
  console.log('🚀 开始生成补齐公司数据的SQL脚本...\n');
  
  try {
    // 获取所有缺失数据的公司
    const { data: companies, error } = await supabase
      .from('companies')
      .select('id, name, website, description, headquarters, founded_year, employee_count')
      .or('website.is.null,website.eq.,description.is.null,description.eq.')
      .limit(50)
      .order('name');
    
    if (error) throw error;
    
    console.log(`📊 找到 ${companies.length} 个需要补齐的公司\n`);
    
    if (companies.length === 0) {
      console.log('✅ 所有公司数据完整！');
      return;
    }
    
    // 生成SQL脚本头
    console.log('// =========================================');
    console.log('// 补齐公司数据的 SQL 脚本');
    console.log('// 生成时间:', new Date().toISOString());
    console.log('// =========================================\n');
    
    console.log('BEGIN;\n');
    
    // 为每个公司生成SQL
    const sqlStatements: string[] = [];
    
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      console.log(`[${i + 1}/${companies.length}] ${company.name}`);
      
      try {
        const sql = await generateCompanySQL(company);
        console.log(sql + '\n');
        sqlStatements.push(sql);
        
        // 添加延迟避免API限流
        if (i < companies.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error: any) {
        console.error(`  ❌ 生成失败: ${error.message}`);
        sqlStatements.push(`-- 无法为 ${company.name} 生成SQL`);
      }
    }
    
    console.log('COMMIT;\n');
    
    // 生成检查语句
    console.log('-- ========================================');
    console.log('-- 执行结果检查');
    console.log('-- ========================================\n');
    
    const companyNames = companies.map(c => `'${c.name}'`).join(', ');
    console.log(`SELECT name, website, description, headquarters, founded_year, employee_count`);
    console.log(`FROM companies`);
    console.log(`WHERE name IN (${companyNames})`);
    console.log(`ORDER BY name;\n`);
    
    console.log('// =========================================');
    console.log(`// 已生成 ${sqlStatements.length} 条 SQL 语句`);
    console.log('// 请复制上方SQL到 Supabase SQL Editor 执行');
    console.log('// =========================================');
    
  } catch (error: any) {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  }
}

main();