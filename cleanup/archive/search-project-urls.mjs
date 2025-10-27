#!/usr/bin/env node
/**
 * 使用LLM为缺失URL的projects搜索和补齐链接
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 调用Qwen搜索项目URL
async function searchProjectUrl(projectName: string, companyName: string): Promise<string | null> {
  try {
    const prompt = `为"${companyName}"公司的AI产品"${projectName}"搜索并返回准确的官网URL。

要求：
1. 必须是官方网站URL（.com, .io, .ai, .tech等域名）
2. 可以是主域名或特定产品页面
3. 必须可以直接访问
4. 如果是开源项目，也可以是GitHub链接

返回格式（只返回URL，不要其他文字）：
https://example.com/product

如果需要多个可能的URL，用换行分隔。`;
    
    const response = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      console.error(`  ❌ Qwen API失败: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // 提取URL（可能是单个或多个）
    const urlMatch = content.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      return urlMatch[0];
    }
    
    return null;
  } catch (error: any) {
    console.error(`  ❌ 搜索URL失败:`, error.message);
    return null;
  }
}

// 验证URL是否可访问
async function validateUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      timeout: 5000,
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始为projects搜索和补齐URL...\n');
  
  try {
    // 获取所有缺失URL的projects
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        website,
        company_id,
        company:companies(name)
      `)
      .or('website.is.null,website.eq.')
      .order('created_at');
    
    if (error) throw error;
    
    console.log(`📊 找到 ${projects.length} 个缺失URL的projects\n`);
    
    if (projects.length === 0) {
      console.log('✅ 所有projects都有URL了！');
      return;
    }
    
    const results = {
      total: projects.length,
      completed: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    // 批量处理
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      const companyName = (project.company as any)?.name || '未知公司';
      
      console.log(`\n🏢 [${i + 1}/${projects.length}] ${companyName} - ${project.name}`);
      
      try {
        // 搜索URL
        const url = await searchProjectUrl(project.name, companyName);
        
        if (!url) {
          console.log(`  ⚠️ 未找到URL`);
          results.failed++;
          results.errors.push(`${project.name}: 未找到URL`);
          continue;
        }
        
        console.log(`  🔗 找到URL: ${url}`);
        
        // 验证URL（可选，耗时较长）
        // const isValid = await validateUrl(url);
        // if (!isValid) {
        //   console.log(`  ⚠️ URL不可访问，跳过`);
        //   results.failed++;
        //   continue;
        // }
        
        // 更新数据库
        const { error: updateError } = await supabase
          .from('projects')
          .update({ website: url })
          .eq('id', project.id);
        
        if (updateError) {
          throw updateError;
        }
        
        console.log(`  ✅ 更新成功`);
        results.completed++;
        
        // 添加延迟避免API限流
        if (i < projects.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error: any) {
        console.error(`  ❌ 处理失败:`, error.message);
        results.failed++;
        results.errors.push(`${project.name}: ${error.message}`);
      }
    }
    
    // 输出结果
    console.log('\n\n📊 批量补齐完成:');
    console.log(`  总计: ${results.total} 个`);
    console.log(`  成功: ${results.completed} 个`);
    console.log(`  失败: ${results.failed} 个`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ 失败的projects:');
      results.errors.forEach(e => console.log(`  - ${e}`));
    }
    
  } catch (error: any) {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  }
}

main();
