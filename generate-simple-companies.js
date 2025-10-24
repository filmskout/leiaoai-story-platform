import https from 'https';
import fs from 'fs';

// 配置
const CONFIG = {
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || 'YOUR_DEEPSEEK_API_KEY_HERE',
  LOG_FILE: 'simple-generation-log.txt'
};

// 日志函数
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(CONFIG.LOG_FILE, logMessage + '\n');
}

// DeepSeek API调用
async function callDeepSeekAPI(companyName, isOverseas) {
  const prompt = `请为"${companyName}"公司生成详细的JSON格式信息：

{
  "description": "详细的公司描述（300-400字）",
  "founded_year": 年份,
  "headquarters": "总部地址",
  "website": "官方网站URL",
  "products": [
    {
      "name": "产品名称",
      "description": "产品描述",
      "url": "产品URL"
    }
  ],
  "funding_rounds": [
    {
      "round": "融资轮次",
      "amount_usd": 融资金额,
      "investors": ["投资方"],
      "announced_on": "宣布日期"
    }
  ],
  "employee_count_range": "员工数量范围",
  "valuation_usd": 估值金额,
  "industry_tags": ["行业标签"]
}`;

  const requestData = JSON.stringify({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 3000
  });

  const options = {
    hostname: 'api.deepseek.com',
    port: 443,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.DEEPSEEK_API_KEY}`,
      'Content-Length': Buffer.byteLength(requestData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.message?.content || '';
            
            // 清理markdown代码块标记
            let cleanContent = content.trim();
            if (cleanContent.startsWith('```json')) {
              cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (cleanContent.startsWith('```')) {
              cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }
            
            const jsonData = JSON.parse(cleanContent);
            resolve(jsonData);
          } catch (e) {
            reject(new Error(`API响应解析失败: ${e.message}`));
          }
        } else {
          reject(new Error(`API错误 (${res.statusCode}): ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(requestData);
    req.end();
  });
}

// 生成单个公司数据
async function generateCompanyData(companyName, isOverseas) {
  try {
    log(`🔬 生成公司数据: ${companyName} (${isOverseas ? '海外' : '国内'})`);
    
    const companyDetails = await callDeepSeekAPI(companyName, isOverseas);
    log(`✅ DeepSeek API调用成功: ${companyName}`);
    
    log(`📊 生成的数据:`);
    log(`   - 描述长度: ${companyDetails.description?.length || 0}`);
    log(`   - 网站: ${companyDetails.website || '无'}`);
    log(`   - 成立年份: ${companyDetails.founded_year || '无'}`);
    log(`   - 总部: ${companyDetails.headquarters || '无'}`);
    log(`   - 估值: ${companyDetails.valuation_usd || '无'}`);
    log(`   - 产品数量: ${companyDetails.products?.length || 0}`);
    log(`   - 融资轮次: ${companyDetails.funding_rounds?.length || 0}`);
    
    return { success: true, data: companyDetails };
  } catch (error) {
    log(`❌ 公司数据生成失败: ${companyName} - ${error.message}`);
    return { success: false, error: error.message };
  }
}

// 主生成函数
async function generateSimpleCompanies() {
  log('🚀 开始简单生成AI公司数据');
  
  // 测试公司列表
  const companies = [
    { name: 'OpenAI', isOverseas: true },
    { name: 'Google DeepMind', isOverseas: true },
    { name: '百度AI', isOverseas: false },
    { name: '腾讯AI', isOverseas: false },
    { name: 'Anthropic', isOverseas: true }
  ];
  
  const results = {
    total: companies.length,
    success: 0,
    failed: 0,
    errors: [],
    generatedData: []
  };
  
  // 串行处理
  for (const company of companies) {
    const result = await generateCompanyData(company.name, company.isOverseas);
    
    if (result.success) {
      results.success++;
      results.generatedData.push({
        name: company.name,
        isOverseas: company.isOverseas,
        data: result.data
      });
      log(`✅ ${company.name}: 生成成功`);
    } else {
      results.failed++;
      results.errors.push(`${company.name}: ${result.error}`);
      log(`❌ ${company.name}: 生成失败 - ${result.error}`);
    }
    
    // 延迟
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // 保存生成的数据到文件
  const outputFile = 'simple-generated-companies.json';
  fs.writeFileSync(outputFile, JSON.stringify(results.generatedData, null, 2));
  log(`💾 生成的数据已保存到: ${outputFile}`);
  
  // 最终统计
  log('🎉 简单生成完成!');
  log(`📊 最终统计:`);
  log(`   - 总数量: ${results.total}`);
  log(`   - 成功: ${results.success}`);
  log(`   - 失败: ${results.failed}`);
  log(`   - 成功率: ${((results.success / results.total) * 100).toFixed(2)}%`);
  
  if (results.errors.length > 0) {
    log(`❌ 失败详情:`);
    results.errors.forEach(error => log(`   - ${error}`));
  }
  
  return results;
}

// 运行脚本
generateSimpleCompanies()
  .then(results => {
    console.log('\n✅ 脚本执行完成');
    console.log(`📊 生成了 ${results.success} 家公司的完整数据`);
    console.log(`💾 数据已保存到 simple-generated-companies.json`);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ 脚本执行失败:', error.message);
    process.exit(1);
  });
