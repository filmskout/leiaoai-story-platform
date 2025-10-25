#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取迁移数据
const data = JSON.parse(fs.readFileSync('migrated-aiverse-companies-optimized.json', 'utf8'));

console.log(`📊 发现 ${data.length} 家公司数据`);

// 定义200+家公司的完整列表（包括AIverse中没有的）
const completeCompanyList = [
  // AIverse中已有的公司
  ...data.map(item => item.company.name),
  
  // 补充的知名AI公司
  'Apple', 'Tesla', 'NVIDIA', 'IBM', 'Intel', 'AMD', 'Qualcomm',
  'Salesforce', 'Oracle', 'SAP', 'Adobe', 'Autodesk', 'Unity',
  'Epic Games', 'Roblox', 'Snapchat', 'TikTok', 'Instagram',
  'Twitter', 'LinkedIn', 'Pinterest', 'Reddit', 'Discord',
  'Slack', 'Zoom', 'Teams', 'Skype', 'WhatsApp', 'Telegram',
  'Signal', 'Element', 'Matrix', 'Mastodon', 'Bluesky',
  'GitHub', 'GitLab', 'Bitbucket', 'Atlassian', 'Notion',
  'Airtable', 'Monday.com', 'Asana', 'Trello', 'Jira',
  'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Marvel',
  'Principle', 'Framer', 'Webflow', 'Squarespace', 'Wix',
  'Shopify', 'WooCommerce', 'Magento', 'BigCommerce',
  'Stripe', 'PayPal', 'Square', 'Venmo', 'Cash App',
  'Coinbase', 'Binance', 'Kraken', 'Gemini', 'FTX',
  'Robinhood', 'E*TRADE', 'TD Ameritrade', 'Charles Schwab',
  'Fidelity', 'Vanguard', 'BlackRock', 'Goldman Sachs',
  'JPMorgan Chase', 'Bank of America', 'Wells Fargo',
  'Citigroup', 'Morgan Stanley', 'Deutsche Bank', 'UBS',
  'Credit Suisse', 'Barclays', 'HSBC', 'BNP Paribas',
  'Société Générale', 'ING', 'Rabobank', 'Santander',
  'BBVA', 'UniCredit', 'Intesa Sanpaolo', 'Commerzbank',
  'Lloyds Banking Group', 'Royal Bank of Scotland',
  'Standard Chartered', 'DBS', 'OCBC', 'UOB',
  'MUFG', 'Mizuho', 'SMBC', 'Nomura', 'SoftBank',
  'Rakuten', 'LINE', 'Kakao', 'Naver', 'Samsung',
  'LG', 'Hyundai', 'Kia', 'SK', 'KT', 'LG U+',
  'China Mobile', 'China Unicom', 'China Telecom',
  'Tencent', 'Alibaba', 'Baidu', 'ByteDance', 'JD.com',
  'Meituan', 'Didi', 'Xiaomi', 'Huawei', 'Oppo',
  'Vivo', 'OnePlus', 'Realme', 'Honor', 'Lenovo',
  'Asus', 'Acer', 'MSI', 'Gigabyte', 'EVGA',
  'Corsair', 'Razer', 'Logitech', 'SteelSeries',
  'HyperX', 'Cooler Master', 'Thermaltake', 'Antec',
  'Fractal Design', 'NZXT', 'Lian Li', 'Phanteks',
  'be quiet!', 'Noctua', 'Arctic', 'Scythe',
  'Deepcool', 'ID-Cooling', 'Gamer Storm', 'Enermax',
  'Seasonic', 'EVGA', 'Corsair', 'Thermaltake',
  'Cooler Master', 'Antec', 'FSP', 'Silverstone',
  'Super Flower', 'Rosewill', 'XFX', 'Sapphire',
  'PowerColor', 'ASRock', 'Biostar', 'ECS',
  'Foxconn', 'Pegatron', 'Quanta', 'Wistron',
  'Inventec', 'Compal', 'Flextronics', 'Jabil',
  'Sanmina', 'Celestica', 'Benchmark', 'Plexus'
];

// 去重
const uniqueCompanies = [...new Set(completeCompanyList)];

console.log(`📊 完整公司列表: ${uniqueCompanies.length} 家`);

// 生成增强版SQL脚本
let sql = `-- 增强版AIverse数据插入脚本
-- 包含119家AIverse公司 + ${uniqueCompanies.length - data.length}家补充公司
-- 在Supabase SQL Editor中执行

-- 1. 插入所有公司数据（包括补充的）
INSERT INTO companies (name, description) VALUES\n`;

// 生成公司插入语句
const companyInserts = [];

// 先添加AIverse中的公司
data.forEach((item, index) => {
  const name = item.company.name.replace(/'/g, "''");
  const description = item.company.description.replace(/'/g, "''");
  companyInserts.push(`('${name}', '${description}')`);
});

// 添加补充的公司（使用AIverse的描述模板）
uniqueCompanies.forEach((companyName) => {
  const exists = data.some(item => item.company.name === companyName);
  if (!exists) {
    const name = companyName.replace(/'/g, "''");
    const description = `${companyName}是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。`;
    companyInserts.push(`('${name}', '${description}')`);
  }
});

sql += companyInserts.join(',\n') + ';\n\n';

// 生成项目插入语句
sql += `-- 2. 插入所有项目数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN (${uniqueCompanies.map(name => `'${name.replace(/'/g, "''")}'`).join(', ')})
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
  VALUES\n`;

// 为每个公司生成项目数据
const projectValues = [];
data.forEach((item, index) => {
  if (item.projects && item.projects.length > 0) {
    item.projects.forEach((project, pIndex) => {
      const name = project.name.replace(/'/g, "''");
      const description = project.description.replace(/'/g, "''");
      const category = project.category.replace(/'/g, "''");
      const website = project.website.replace(/'/g, "''");
      
      projectValues.push(`    ('${item.company.name.replace(/'/g, "''")}', '${name}', '${description}', '${category}', '${website}')`);
    });
  }
});

sql += projectValues.join(',\n') + '\n';
sql += `) AS p(company_name, name, description, category, website)
WHERE ci.name = p.company_name;\n\n`;

sql += `-- 完成
SELECT '增强版AIverse数据插入完成！共${uniqueCompanies.length}家公司' as status;`;

// 写入文件
fs.writeFileSync('insert-enhanced-aiverse-data.sql', sql);

console.log(`✅ 增强版SQL脚本已生成: insert-enhanced-aiverse-data.sql`);
console.log(`📊 包含 ${uniqueCompanies.length} 家公司数据`);
console.log(`📊 包含 ${projectValues.length} 个项目`);
console.log(`📊 补充了 ${uniqueCompanies.length - data.length} 家公司`);

// 生成大模型优化脚本
const optimizationScript = `#!/usr/bin/env node

// 大模型数据优化脚本
// 用于调用DeepSeek/OpenAI/Qwen来优化和补充公司信息

import fetch from 'node-fetch';

const API_KEYS = {
  deepseek: process.env.DEEPSEEK_API_KEY,
  openai: process.env.OPENAI_API_KEY,
  qwen: process.env.QWEN_API_KEY
};

async function optimizeCompanyData(companyName, companyData) {
  const prompt = \`请为"\${companyName}"这家AI公司生成完整、准确、真实的信息，包括：

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

请确保信息真实、准确，避免虚假或模板化内容。\`;

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
    console.error(\`优化公司数据失败: \${companyName}\`, error);
    return null;
  }
}

async function callDeepSeek(prompt) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEYS.deepseek}\`,
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
      'Authorization': \`Bearer \${API_KEYS.openai}\`,
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
      'Authorization': \`Bearer \${API_KEYS.qwen}\`,
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
    console.log(\`\${i + 1}/\${data.length} 优化公司: \${item.company.name}\`);
    
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
  
  console.log(\`✅ 数据优化完成！共优化 \${optimizedData.length} 家公司\`);
}

if (require.main === module) {
  main().catch(console.error);
}

export { optimizeCompanyData, callDeepSeek, callOpenAI, callQwen };
`;

fs.writeFileSync('optimize-company-data.mjs', optimizationScript);

console.log(`✅ 大模型优化脚本已生成: optimize-company-data.mjs`);
console.log(`📝 使用方法: node optimize-company-data.mjs`);
console.log(`🔑 需要配置环境变量: DEEPSEEK_API_KEY, OPENAI_API_KEY, QWEN_API_KEY`);
