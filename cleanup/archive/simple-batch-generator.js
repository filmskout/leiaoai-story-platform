// 简化的批量数据生成脚本 - 使用Vercel环境变量
// 直接调用API端点进行数据生成

import https from 'https';

// 环境变量配置
const ADMIN_TOKEN = 'R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn';
const API_BASE_URL = 'https://leiao.ai/api/unified';

// 公司分类和优先级
const COMPANY_TIERS = {
  'Tier 1 - AI巨头': [
    'OpenAI', 'Anthropic', 'Google DeepMind', 'Microsoft AI', 'Meta AI',
    'Tesla AI', 'NVIDIA', 'Intel AI', 'IBM Watson', 'Amazon AI',
    'Apple AI', 'Salesforce Einstein', 'Adobe AI', 'Oracle AI', 'SAP AI',
    'Palantir', 'Databricks', 'Snowflake', 'Hugging Face', 'Stability AI'
  ],
  'Tier 2 - AI独角兽': [
    'Midjourney', 'Runway', 'Character.AI', 'Jasper', 'Copy.ai',
    'Grammarly', 'Notion AI', 'Figma AI', 'Canva AI', 'Zapier AI',
    'Cohere', 'Mistral AI', 'Aleph Alpha', 'Scale AI', 'Labelbox',
    'DeepL', 'Replika', 'Synthesia', 'Graphcore', 'Improbable',
    'Darktrace', 'Onfido', 'Tractable', 'Element AI', 'Layer 6 AI',
    'Deep Genomics', 'BlueDot', 'Alchemy', 'Infura', 'QuickNode',
    'Moralis', 'Thirdweb', 'SuperAnnotate', 'Hive', 'Appen',
    'Babbel', 'Lingoda', 'HubSpot AI', 'Mailchimp AI', 'Shopify AI',
    'Stripe AI', 'Square AI', 'PayPal AI', 'Venmo AI', 'Cash App AI',
    'Robinhood AI', 'Coinbase AI', 'Binance AI', 'Kraken AI', 'Gemini AI'
  ]
};

// 生成统计
let generationStats = {
  totalCompanies: 0,
  completed: 0,
  failed: 0,
  startTime: new Date(),
  errors: []
};

// API调用函数
async function callAPI(url, options, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(new Error(`JSON解析失败: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// 清理数据库
async function clearDatabase() {
  console.log('🧹 清理数据库...');
  
  const url = `${API_BASE_URL}?action=clear-database`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: ADMIN_TOKEN })
  };

  try {
    const response = await callAPI(url, options);
    if (response.success) {
      console.log('✅ 数据库清理成功');
      return true;
    } else {
      console.error('❌ 数据库清理失败:', response.error);
      return false;
    }
  } catch (error) {
    console.error('❌ 数据库清理失败:', error.message);
    return false;
  }
}

// 生成单个公司数据
async function generateSingleCompany(companyName, isOverseas = true) {
  console.log(`🔄 生成公司数据: ${companyName}`);
  
  const url = `${API_BASE_URL}?action=generate-single-company`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: ADMIN_TOKEN,
      companyName: companyName,
      isOverseas: isOverseas,
      includeLogo: false
    })
  };

  try {
    const response = await callAPI(url, options);
    if (response.success) {
      console.log(`✅ 成功生成: ${companyName}`);
      generationStats.completed++;
      return true;
    } else {
      console.error(`❌ 生成失败: ${companyName} - ${response.error}`);
      generationStats.failed++;
      generationStats.errors.push(`${companyName}: ${response.error}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 生成失败: ${companyName}`, error.message);
    generationStats.failed++;
    generationStats.errors.push(`${companyName}: ${error.message}`);
    return false;
  }
}

// 检查数据进度
async function checkDataProgress() {
  const url = `${API_BASE_URL}?action=data-progress`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: ADMIN_TOKEN })
  };

  try {
    const response = await callAPI(url, options);
    if (response.success) {
      console.log('📊 当前数据统计:');
      console.log(`   公司: ${response.companies || 0}`);
      console.log(`   项目: ${response.projects || 0}`);
      console.log(`   融资: ${response.fundings || 0}`);
      console.log(`   故事: ${response.stories || 0}`);
      return response;
    } else {
      console.error('❌ 获取数据进度失败:', response.error);
      return null;
    }
  } catch (error) {
    console.error('❌ 获取数据进度失败:', error.message);
    return null;
  }
}

// 批量生成数据
async function batchGenerateData() {
  console.log('🚀 开始批量生成AI公司数据');
  console.log('📊 目标: 前两个层级的公司');
  console.log('🔬 方法: 通过API端点生成');
  console.log('⏰ 开始时间:', new Date().toLocaleString());
  console.log('');
  
  // 计算总公司数
  for (const [tier, companies] of Object.entries(COMPANY_TIERS)) {
    generationStats.totalCompanies += companies.length;
  }
  
  console.log(`📋 总计: ${generationStats.totalCompanies}家公司`);
  console.log('');
  
  // 1. 清理数据库
  const cleared = await clearDatabase();
  if (!cleared) {
    console.error('❌ 无法清理数据库，停止执行');
    return;
  }
  
  // 2. 按优先级分批生成
  for (const [tierName, companies] of Object.entries(COMPANY_TIERS)) {
    console.log(`\n🎯 开始处理: ${tierName} (${companies.length}家公司)`);
    
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const progress = ((generationStats.completed + generationStats.failed) / generationStats.totalCompanies * 100).toFixed(1);
      
      console.log(`\n[${i + 1}/${companies.length}] ${company} (总进度: ${progress}%)`);
      
      try {
        const success = await generateSingleCompany(company, true);
        
        if (success) {
          console.log(`✅ 成功: ${company}`);
        } else {
          console.log(`❌ 失败: ${company}`);
        }
        
        // 添加延迟避免API限制
        if (i < companies.length - 1) {
          console.log('⏳ 等待5秒...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        
      } catch (error) {
        console.error(`❌ 处理失败: ${company}`, error.message);
        generationStats.failed++;
        generationStats.errors.push(`${company}: ${error.message}`);
      }
    }
    
    console.log(`\n✅ ${tierName} 处理完成`);
    
    // 检查当前进度
    await checkDataProgress();
  }
  
  // 生成完成报告
  const endTime = new Date();
  const duration = Math.round((endTime - generationStats.startTime) / 1000 / 60);
  
  console.log('\n🎉 批量生成完成!');
  console.log('='.repeat(50));
  console.log(`📊 统计信息:`);
  console.log(`   总公司数: ${generationStats.totalCompanies}`);
  console.log(`   成功: ${generationStats.completed}`);
  console.log(`   失败: ${generationStats.failed}`);
  console.log(`   耗时: ${duration}分钟`);
  console.log(`   成功率: ${(generationStats.completed / generationStats.totalCompanies * 100).toFixed(1)}%`);
  
  if (generationStats.errors.length > 0) {
    console.log('\n❌ 错误列表:');
    generationStats.errors.slice(0, 10).forEach(error => console.log(`   - ${error}`));
    if (generationStats.errors.length > 10) {
      console.log(`   ... 还有 ${generationStats.errors.length - 10} 个错误`);
    }
  }
  
  // 最终数据统计
  console.log('\n📊 最终数据统计:');
  await checkDataProgress();
  
  console.log('\n✅ 数据生成完成，请检查前端页面!');
}

// 主函数
async function main() {
  try {
    await batchGenerateData();
  } catch (error) {
    console.error('❌ 批量生成失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  batchGenerateData,
  generateSingleCompany,
  COMPANY_TIERS,
  generationStats
};
