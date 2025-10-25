#!/usr/bin/env node

import fs from 'fs';
import fetch from 'node-fetch';

// 配置API密钥
const API_CONFIG = {
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    key: process.env.DEEPSEEK_API_KEY || 'sk-55e94a8cacc041e29b3d43310575e2dd',
    model: 'deepseek-chat'
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    key: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  },
  qwen: {
    url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    key: process.env.QWEN_API_KEY,
    model: 'qwen-turbo'
  }
};

// 选择API提供商
const API_PROVIDER = 'openai'; // 使用OpenAI优化数据

async function callLLM(prompt, retries = 3) {
  const config = API_CONFIG[API_PROVIDER];
  
  for (let i = 0; i < retries; i++) {
    try {
      let response;
      
      if (API_PROVIDER === 'qwen') {
        response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: config.model,
            input: { messages: [{ role: 'user', content: prompt }] },
            parameters: { 
              temperature: 0.3, 
              max_tokens: 3000,
              top_p: 0.8
            }
          })
        });
      } else {
        response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 3000,
            top_p: 0.8
          })
        });
      }
      
      const data = await response.json();
      
      if (API_PROVIDER === 'qwen') {
        return data.output.text;
      } else {
        return data.choices[0].message.content;
      }
    } catch (error) {
      console.error(`API调用失败 (尝试 ${i + 1}/${retries}):`, error.message);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}

async function optimizeCompanyData(companyName, companyData) {
  const prompt = `Please generate comprehensive, accurate, and real information for "${companyName}" AI company. Focus on English descriptions and ensure all information is factual and non-templated.

Please return data in the following JSON format:

{
  "company": {
    "name": "${companyName}",
    "description": "Detailed Chinese company description with specific business, technology features, market position, and competitive advantages",
    "english_description": "Comprehensive English company description with specific business model, technology stack, market position, competitive advantages, and recent developments",
    "headquarters": "Real headquarters city and country",
    "valuation": Specific valuation number (if publicly available),
    "website": "Real official website URL",
    "founded_year": Founding year,
    "employee_count": "Employee size range (e.g., '100-500', '1000-5000')",
    "industry": "Specific industry classification",
    "category": "Company type (techGiants/aiUnicorns/aiTools/aiApplications/domesticGiants/domesticUnicorns)",
    "is_overseas": true/false,
    "tags": ["relevant_tag1", "relevant_tag2", "relevant_tag3"]
  },
  "projects": [
    {
      "name": "Specific product/project name",
      "description": "Detailed product description in English with technical features, competitive advantages, and unique selling points",
      "category": "Product category",
      "website": "Product website URL",
      "pricing_model": "Pricing model (Freemium/Subscription/One-time/Enterprise)",
      "target_users": "Target user groups",
      "key_features": "Core feature capabilities",
      "use_cases": "Specific use cases and applications",
      "tags": ["product_tag1", "product_tag2", "product_tag3"]
    }
  ],
  "fundings": [
    {
      "round": "Funding round (Seed/Series A/Series B/etc.)",
      "amount": Funding amount in numbers,
      "investors": "Investor names",
      "valuation": "Valuation number",
      "date": Funding year,
      "lead_investor": "Lead investor"
    }
  ],
  "stories": [
    {
      "title": "News headline",
      "summary": "News summary in English",
      "source_url": "News source URL",
      "published_date": "Publication date (YYYY-MM-DD)",
      "category": "News category",
      "tags": ["news_tag1", "news_tag2"]
    }
  ]
}

Requirements:
1. All information must be real, accurate, and factual
2. Avoid templated or generic descriptions
3. Include specific numbers, dates, locations, and details
4. English descriptions should be comprehensive and professional
5. Product descriptions should highlight technical features and competitive advantages
6. Funding information should accurately reflect the company's funding history
7. News should focus on recent significant events and developments
8. Use proper English grammar and professional terminology`;

  try {
    const response = await callLLM(prompt);
    
    // 尝试解析JSON响应
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error(`JSON解析失败: ${companyName}`, parseError.message);
    }
    
    // 如果JSON解析失败，返回原始响应用于调试
    return {
      raw_response: response,
      company: { name: companyName },
      error: 'JSON解析失败'
    };
    
  } catch (error) {
    console.error(`优化公司数据失败: ${companyName}`, error.message);
    return {
      company: { name: companyName },
      error: error.message
    };
  }
}

async function main() {
  console.log('🚀 开始优化AIverse公司数据...');
  
  // 读取原始数据
  const originalData = JSON.parse(fs.readFileSync('migrated-aiverse-companies-optimized.json', 'utf8'));
  console.log(`📊 发现 ${originalData.length} 家公司需要优化`);
  
  const optimizedData = [];
  let successCount = 0;
  let errorCount = 0;
  
  // 先测试前5家公司
  const testCount = Math.min(5, originalData.length);
  for (let i = 0; i < testCount; i++) {
    const item = originalData[i];
    const companyName = item.company.name;
    
    console.log(`\n${i + 1}/${testCount} 正在优化: ${companyName}`);
    
    try {
      const optimized = await optimizeCompanyData(companyName, item);
      
      if (optimized.error) {
        console.error(`❌ 优化失败: ${companyName} - ${optimized.error}`);
        errorCount++;
      } else {
        console.log(`✅ 优化成功: ${companyName}`);
        successCount++;
      }
      
      optimizedData.push(optimized);
      
      // 添加延迟避免API限制
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ 处理失败: ${companyName}`, error.message);
      errorCount++;
      optimizedData.push({
        company: { name: companyName },
        error: error.message
      });
    }
  }
  
  // 保存优化后的数据
  fs.writeFileSync('optimized-aiverse-companies.json', JSON.stringify(optimizedData, null, 2));
  
  console.log(`\n🎉 数据优化完成！`);
  console.log(`📊 成功: ${successCount}, 失败: ${errorCount}`);
  console.log(`📁 结果已保存到: optimized-aiverse-companies.json`);
  
  // 生成SQL脚本
  await generateOptimizedSQL(optimizedData);
}

async function generateOptimizedSQL(optimizedData) {
  console.log('\n🔧 生成优化后的SQL脚本...');
  
  let sql = `-- 大模型优化后的AIverse数据插入脚本
-- 包含真实、准确的公司信息
-- 在Supabase SQL Editor中执行

-- 1. 插入所有公司数据
INSERT INTO companies (name, description) VALUES\n`;

  const companyInserts = [];
  const projectValues = [];
  const fundingValues = [];
  const storyValues = [];
  
  optimizedData.forEach((item, index) => {
    if (item.error) {
      console.log(`⚠️ 跳过有错误的公司: ${item.company.name}`);
      return;
    }
    
    const company = item.company;
    const name = company.name.replace(/'/g, "''");
    const description = company.description.replace(/'/g, "''");
    
    companyInserts.push(`('${name}', '${description}')`);
    
    // 收集项目数据
    if (item.projects && item.projects.length > 0) {
      item.projects.forEach(project => {
        const projectName = project.name.replace(/'/g, "''");
        const projectDesc = project.description.replace(/'/g, "''");
        const category = project.category.replace(/'/g, "''");
        const website = project.website.replace(/'/g, "''");
        
        projectValues.push(`    ('${name}', '${projectName}', '${projectDesc}', '${category}', '${website}')`);
      });
    }
    
    // 收集融资数据
    if (item.fundings && item.fundings.length > 0) {
      item.fundings.forEach(funding => {
        const round = funding.round.replace(/'/g, "''");
        const investors = funding.investors.replace(/'/g, "''");
        const leadInvestor = funding.lead_investor.replace(/'/g, "''");
        
        fundingValues.push(`    ('${name}', '${round}', ${funding.amount}, '${investors}', ${funding.valuation}, ${funding.date}, '${leadInvestor}')`);
      });
    }
    
    // 收集新闻数据
    if (item.stories && item.stories.length > 0) {
      item.stories.forEach(story => {
        const title = story.title.replace(/'/g, "''");
        const summary = story.summary.replace(/'/g, "''");
        const sourceUrl = story.source_url.replace(/'/g, "''");
        const category = story.category.replace(/'/g, "''");
        const tags = JSON.stringify(story.tags).replace(/'/g, "''");
        
        storyValues.push(`    ('${name}', '${title}', '${summary}', '${sourceUrl}', '${story.published_date}', '${category}', '${tags}')`);
      });
    }
  });
  
  sql += companyInserts.join(',\n') + ';\n\n';
  
  // 添加项目插入
  if (projectValues.length > 0) {
    sql += `-- 2. 插入所有项目数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN (${companyInserts.map(c => c.split("'")[1]).map(name => `'${name.replace(/'/g, "''")}'`).join(', ')})
)
INSERT INTO projects (company_id, name, description, category, website)
SELECT 
  ci.id,
  p.name,
  p.description,
  p.category,
  p.website
FROM company_ids ci
CROSS JOIN LATERAL (
  VALUES
${projectValues.join(',\n')}
) AS p(company_name, name, description, category, website)
WHERE ci.name = p.company_name;\n\n`;
  }
  
  // 添加融资插入
  if (fundingValues.length > 0) {
    sql += `-- 3. 插入所有融资数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN (${companyInserts.map(c => c.split("'")[1]).map(name => `'${name.replace(/'/g, "''")}'`).join(', ')})
)
INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT 
  ci.id,
  f.round,
  f.amount,
  f.investors,
  f.valuation,
  f.date,
  f.lead_investor
FROM company_ids ci
CROSS JOIN LATERAL (
  VALUES
${fundingValues.join(',\n')}
) AS f(company_name, round, amount, investors, valuation, date, lead_investor)
WHERE ci.name = f.company_name;\n\n`;
  }
  
  // 添加新闻插入
  if (storyValues.length > 0) {
    sql += `-- 4. 插入所有新闻数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN (${companyInserts.map(c => c.split("'")[1]).map(name => `'${name.replace(/'/g, "''")}'`).join(', ')})
)
INSERT INTO stories (company_id, title, summary, source_url, published_date, category, tags)
SELECT 
  ci.id,
  s.title,
  s.summary,
  s.source_url,
  s.published_date,
  s.category,
  s.tags
FROM company_ids ci
CROSS JOIN LATERAL (
  VALUES
${storyValues.join(',\n')}
) AS s(company_name, title, summary, source_url, published_date, category, tags)
WHERE ci.name = s.company_name;\n\n`;
  }
  
  sql += `-- 完成
SELECT '大模型优化后的AIverse数据插入完成！' as status;`;
  
  // 写入文件
  fs.writeFileSync('insert-optimized-aiverse-data.sql', sql);
  
  console.log(`✅ 优化后的SQL脚本已生成: insert-optimized-aiverse-data.sql`);
  console.log(`📊 包含 ${companyInserts.length} 家公司`);
  console.log(`📊 包含 ${projectValues.length} 个项目`);
  console.log(`📊 包含 ${fundingValues.length} 轮融资`);
  console.log(`📊 包含 ${storyValues.length} 篇新闻`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { optimizeCompanyData, callLLM };
