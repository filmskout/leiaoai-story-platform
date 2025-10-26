#!/usr/bin/env node
/**
 * 批量补齐公司数据脚本
 * 使用 Qwen Turbo 调用大模型补齐所有公司的基本信息
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

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

// 补齐单个公司的数据
async function completeCompany(company: any): Promise<any> {
  console.log(`\n🏢 开始补齐: ${company.name}`);
  
  try {
    // 检查哪些字段需要补齐
    const missingFields = [];
    if (!company.website || company.website === '') missingFields.push('website');
    if (!company.description || company.description === '') missingFields.push('description');
    if (!company.headquarters) missingFields.push('headquarters');
    if (!company.founded_year) missingFields.push('founded_year');
    if (!company.employee_count) missingFields.push('employee_count');
    
    if (missingFields.length === 0) {
      console.log(`  ✅ ${company.name} 数据完整，跳过`);
      return { status: 'skipped', company };
    }
    
    // 调用Qwen补齐数据
    const prompt = `你是一名AI行业研究专家。请为AI公司"${company.name}"补齐真实准确的信息。

返回JSON格式：
{
  "website": "公司官网URL，必须是真实可访问的网站",
  "description": "公司简介（100字内，中文，包含核心业务、主要产品、技术特色）",
  "headquarters": "总部地址（格式：城市, 国家，海外公司用英文，国内公司用中文）",
  "founded_year": 成立年份（数字，如2015）,
  "employee_count": "员工规模（格式：1000-5000人或10万+人）"
}

要求：
1. 所有信息必须基于真实公开资料
2. website必须是官方真实网站，如https://www.example.com
3. description要简洁专业，突出核心竞争力（100字内）
4. headquarters准确到城市和国家
5. founded_year必须是真实成立年份
6. employee_count要符合公司规模
7. 只返回JSON，不要任何其他文字或解释

示例输出：
{
  "website": "https://www.anthropic.com",
  "description": "Anthropic是专注于AI安全的公司，开发了Claude AI助手，致力于构建可控、可解释的AI系统。",
  "headquarters": "San Francisco, USA",
  "founded_year": 2021,
  "employee_count": "200-500人"
}`;
    
    const response = await callQwen(prompt, 1500);
    
    // 解析JSON
    let completedData;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        completedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法从响应中提取JSON');
      }
    } catch (parseError) {
      console.error(`  ❌ 解析JSON失败: ${parseError}`);
      return { status: 'failed', error: parseError.message, company };
    }
    
    // 更新数据库
    const { data: updated, error: updateError } = await supabase
      .from('companies')
      .update(completedData)
      .eq('id', company.id)
      .select()
      .single();
    
    if (updateError) {
      throw updateError;
    }
    
    console.log(`  ✅ ${company.name} 数据补齐成功`);
    console.log(`     补齐字段: ${Object.keys(completedData).join(', ')}`);
    
    return { status: 'success', company: updated, fields: Object.keys(completedData) };
    
  } catch (error: any) {
    console.error(`  ❌ ${company.name} 补齐失败:`, error.message);
    return { status: 'failed', error: error.message, company };
  }
}

// 主函数
async function main() {
  console.log('🚀 开始批量补齐公司数据...\n');
  
  try {
    // 获取所有公司
    const { data: companies, error } = await supabase
      .from('companies')
      .select('id, name, website, description, headquarters, founded_year, employee_count')
      .order('name');
    
    if (error) throw error;
    
    console.log(`📊 找到 ${companies.length} 家公司\n`);
    
    const results = {
      total: companies.length,
      completed: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    // 批量处理
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const result = await completeCompany(company);
      
      if (result.status === 'success') {
        results.completed++;
      } else if (result.status === 'skipped') {
        results.skipped++;
      } else {
        results.failed++;
        results.errors.push(`${company.name}: ${result.error}`);
      }
      
      // 添加延迟避免API限流
      if (i < companies.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // 输出结果
    console.log('\n📊 批量补齐完成:');
    console.log(`  总计: ${results.total} 家`);
    console.log(`  成功: ${results.completed} 家`);
    console.log(`  跳过: ${results.skipped} 家`);
    console.log(`  失败: ${results.failed} 家`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ 失败的公司:');
      results.errors.forEach(e => console.log(`  - ${e}`));
    }
    
  } catch (error: any) {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  }
}

main();
