#!/usr/bin/env node

// 大模型数据优化脚本
// 用于调用DeepSeek/OpenAI/Qwen来优化和补充公司信息

import fetch from 'node-fetch';

const API_KEYS = {
  deepseek: process.env.DEEPSEEK_API_KEY,
  openai: process.env.OPENAI_API_KEY,
  qwen: process.env.QWEN_API_KEY
};

async function optimizeCompanyData(companyName, companyData) {
  const prompt = `请为"${companyName}"这家AI公司生成完整、准确、真实的信息，包括：

1. 公司基本信息：
   - 真实的总部位置
   - 成立年份
   - 员工规模
   - 行业分类
   - 公司估值（如果公开）

2. 主要产品或项目：
   - 产品名称
   - 详细描述
   - 目标用户
   - 核心功能
   - 使用场景

3. 融资信息：
   - 融资轮次
   - 融资金额
   - 主要投资者
   - 估值
   - 融资时间

4. 最新新闻：
   - 新闻标题
   - 新闻摘要
   - 来源链接
   - 发布时间
   - 新闻分类

请确保信息真实、准确，避免虚假或模板化内容。`;

  try {
    // 优先使用DeepSeek
    if (API_KEYS.deepseek) {
      return await callDeepSeek(prompt);
    } else if (API_KEYS.openai) {
      return await callOpenAI(prompt);
    } else if (API_KEYS.qwen) {
      return await callQwen(prompt);
    }
  } catch (error) {
    console.error(`优化公司数据失败: ${companyName}`, error);
    return null;
  }
}

async function callDeepSeek(prompt) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.deepseek}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callOpenAI(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.openai}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callQwen(prompt) {
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.qwen}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      input: { messages: [{ role: 'user', content: prompt }] },
      parameters: { temperature: 0.3, max_tokens: 2000 }
    })
  });
  
  const data = await response.json();
  return data.output.text;
}

// 主函数
async function main() {
  console.log('🚀 开始优化公司数据...');
  
  // 读取现有数据
  const data = JSON.parse(fs.readFileSync('migrated-aiverse-companies-optimized.json', 'utf8'));
  
  const optimizedData = [];
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    console.log(`${i + 1}/${data.length} 优化公司: ${item.company.name}`);
    
    const optimized = await optimizeCompanyData(item.company.name, item);
    if (optimized) {
      optimizedData.push({
        ...item,
        optimized_info: optimized
      });
    }
    
    // 添加延迟避免API限制
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 保存优化后的数据
  fs.writeFileSync('optimized-aiverse-data.json', JSON.stringify(optimizedData, null, 2));
  
  console.log(`✅ 数据优化完成！共优化 ${optimizedData.length} 家公司`);
}

if (require.main === module) {
  main().catch(console.error);
}

export { optimizeCompanyData, callDeepSeek, callOpenAI, callQwen };
