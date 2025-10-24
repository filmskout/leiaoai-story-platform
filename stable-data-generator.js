import https from 'https';

// 环境变量配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

// 精选的50家知名AI公司（减少数量提高质量）
const TOP_AI_COMPANIES = [
  // 美国AI巨头
  { name: "OpenAI", country: "US", category: "AI Giant", tier: "Tier 1", realName: "OpenAI" },
  { name: "Google DeepMind", country: "US", category: "AI Giant", tier: "Tier 1", realName: "Google DeepMind" },
  { name: "Microsoft AI", country: "US", category: "AI Giant", tier: "Tier 1", realName: "Microsoft" },
  { name: "Meta AI", country: "US", category: "AI Giant", tier: "Tier 1", realName: "Meta" },
  { name: "Apple AI", country: "US", category: "AI Giant", tier: "Tier 1", realName: "Apple" },
  { name: "Amazon AI", country: "US", category: "AI Giant", tier: "Tier 1", realName: "Amazon" },
  { name: "Tesla AI", country: "US", category: "AI Giant", tier: "Tier 1", realName: "Tesla" },
  { name: "NVIDIA", country: "US", category: "AI Giant", tier: "Tier 1", realName: "NVIDIA" },
  { name: "IBM Watson", country: "US", category: "AI Giant", tier: "Tier 1", realName: "IBM" },
  { name: "Intel AI", country: "US", category: "AI Giant", tier: "Tier 1", realName: "Intel" },

  // 美国AI独角兽
  { name: "Anthropic", country: "US", category: "AI Unicorn", tier: "Tier 2", realName: "Anthropic" },
  { name: "Cohere", country: "US", category: "AI Unicorn", tier: "Tier 2", realName: "Cohere" },
  { name: "Scale AI", country: "US", category: "AI Unicorn", tier: "Tier 2", realName: "Scale AI" },
  { name: "Hugging Face", country: "US", category: "AI Unicorn", tier: "Tier 2", realName: "Hugging Face" },
  { name: "Stability AI", country: "US", category: "AI Unicorn", tier: "Tier 2", realName: "Stability AI" },
  { name: "Midjourney", country: "US", category: "AI Unicorn", tier: "Tier 2", realName: "Midjourney" },
  { name: "Character.AI", country: "US", category: "AI Unicorn", tier: "Tier 2", realName: "Character.AI" },
  { name: "Runway", country: "US", category: "AI Unicorn", tier: "Tier 2", realName: "Runway" },
  { name: "Jasper AI", country: "US", category: "AI Unicorn", tier: "Tier 2", realName: "Jasper" },
  { name: "Copy.ai", country: "US", category: "AI Unicorn", tier: "Tier 2", realName: "Copy.ai" },

  // 中国AI巨头
  { name: "百度AI", country: "CN", category: "Domestic Giant", tier: "Tier 1", realName: "百度" },
  { name: "腾讯AI", country: "CN", category: "Domestic Giant", tier: "Tier 1", realName: "腾讯" },
  { name: "阿里巴巴AI", country: "CN", category: "Domestic Giant", tier: "Tier 1", realName: "阿里巴巴" },
  { name: "字节跳动AI", country: "CN", category: "Domestic Giant", tier: "Tier 1", realName: "字节跳动" },
  { name: "华为AI", country: "CN", category: "Domestic Giant", tier: "Tier 1", realName: "华为" },
  { name: "小米AI", country: "CN", category: "Domestic Giant", tier: "Tier 1", realName: "小米" },
  { name: "京东AI", country: "CN", category: "Domestic Giant", tier: "Tier 1", realName: "京东" },
  { name: "美团AI", country: "CN", category: "Domestic Giant", tier: "Tier 1", realName: "美团" },
  { name: "滴滴AI", country: "CN", category: "Domestic Giant", tier: "Tier 1", realName: "滴滴" },
  { name: "快手AI", country: "CN", category: "Domestic Giant", tier: "Tier 1", realName: "快手" },

  // 中国AI独角兽
  { name: "商汤科技", country: "CN", category: "Domestic Unicorn", tier: "Tier 2", realName: "商汤科技" },
  { name: "旷视科技", country: "CN", category: "Domestic Unicorn", tier: "Tier 2", realName: "旷视科技" },
  { name: "依图科技", country: "CN", category: "Domestic Unicorn", tier: "Tier 2", realName: "依图科技" },
  { name: "云从科技", country: "CN", category: "Domestic Unicorn", tier: "Tier 2", realName: "云从科技" },
  { name: "第四范式", country: "CN", category: "Domestic Unicorn", tier: "Tier 2", realName: "第四范式" },
  { name: "明略科技", country: "CN", category: "Domestic Unicorn", tier: "Tier 2", realName: "明略科技" },
  { name: "思必驰", country: "CN", category: "Domestic Unicorn", tier: "Tier 2", realName: "思必驰" },
  { name: "小i机器人", country: "CN", category: "Domestic Unicorn", tier: "Tier 2", realName: "小i机器人" },
  { name: "达观数据", country: "CN", category: "Domestic Unicorn", tier: "Tier 2", realName: "达观数据" },
  { name: "容联云通讯", country: "CN", category: "Domestic Unicorn", tier: "Tier 2", realName: "容联云通讯" },

  // 欧洲AI公司
  { name: "DeepMind", country: "UK", category: "AI Giant", tier: "Tier 1", realName: "DeepMind" },
  { name: "Aleph Alpha", country: "DE", category: "AI Unicorn", tier: "Tier 2", realName: "Aleph Alpha" },
  { name: "Mistral AI", country: "FR", category: "AI Unicorn", tier: "Tier 2", realName: "Mistral AI" },
  { name: "Graphcore", country: "UK", category: "AI Tools", tier: "Independent", realName: "Graphcore" },
  { name: "Darktrace", country: "UK", category: "AI Tools", tier: "Independent", realName: "Darktrace" },

  // 亚洲其他AI公司
  { name: "Samsung AI", country: "KR", category: "AI Giant", tier: "Tier 1", realName: "Samsung" },
  { name: "LG AI", country: "KR", category: "AI Giant", tier: "Tier 1", realName: "LG" },
  { name: "SoftBank AI", country: "JP", category: "AI Giant", tier: "Tier 1", realName: "SoftBank" },
  { name: "Sony AI", country: "JP", category: "AI Giant", tier: "Tier 1", realName: "Sony" },
  { name: "Panasonic AI", country: "JP", category: "AI Giant", tier: "Tier 1", realName: "Panasonic" }
];

// 简化的DeepSeek API调用函数
async function callDeepSeekSimple(companyName) {
  return new Promise((resolve, reject) => {
    const prompt = `请为AI公司"${companyName}"提供基本信息：

1. 总部地址（真实城市和国家）
2. 成立年份
3. 员工数量范围
4. 估值（亿美元）
5. 简短描述（30字以内）
6. 详细描述（200字以内）
7. 官网URL
8. 3个主要AI产品名称

请用简洁的JSON格式返回：
{
  "headquarters": "城市, 国家",
  "founded_year": 年份,
  "employee_count": "员工数量范围",
  "valuation_usd": 估值数字,
  "description": "简短描述",
  "detailed_description": "详细描述",
  "website": "官网URL",
  "products": ["产品1", "产品2", "产品3"]
}`;

    const data = JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    const options = {
      hostname: 'api.deepseek.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Length': data.length
      },
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
            const content = parsed.choices[0].message.content;
            
            // 提取JSON部分
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const jsonStr = jsonMatch[0];
              const result = JSON.parse(jsonStr);
              resolve(result);
            } else {
              reject(new Error('No JSON found in response'));
            }
          } else {
            reject(new Error('Invalid response format'));
          }
        } catch (error) {
          reject(new Error(`JSON parse error: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(data);
    req.end();
  });
}

// 插入公司数据到数据库
async function insertCompanyData(company, companyData) {
  try {
    // 插入公司信息
    const companyResponse = await fetch(`${SUPABASE_URL}/rest/v1/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        name: company.realName,
        description: companyData.description,
        detailed_description: companyData.detailed_description,
        headquarters: companyData.headquarters,
        founded_year: companyData.founded_year,
        employee_count_range: companyData.employee_count,
        valuation_usd: companyData.valuation_usd * 100000000, // 转换为美元
        website: companyData.website,
        industry_tags: ["AI", "Machine Learning", "Technology"],
        company_type: company.category,
        company_tier: company.tier,
        company_category: company.category
      })
    });

    if (!companyResponse.ok) {
      throw new Error(`Company insert failed: ${companyResponse.statusText}`);
    }

    const companyResult = await companyResponse.json();
    console.log(`✅ 公司 ${company.realName} 插入成功，ID: ${companyResult.id}`);

    // 插入项目信息
    if (companyData.products && companyData.products.length > 0) {
      for (const productName of companyData.products) {
        const projectResponse = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            company_id: companyResult.id,
            name: productName,
            description: `${productName} - ${company.realName}的主要AI产品`,
            category: "AI Platform",
            website: companyData.website,
            pricing_model: 'Freemium',
            launch_date: '2023-01-01',
            status: 'Active'
          })
        });

        if (projectResponse.ok) {
          console.log(`✅ 项目 ${productName} 插入成功`);
        } else {
          console.error(`❌ 项目 ${productName} 插入失败:`, projectResponse.statusText);
        }
      }
    }

    return companyResult.id;
  } catch (error) {
    console.error(`❌ 插入公司数据失败:`, error.message);
    return null;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始生成高质量AI公司数据...');
  console.log(`📊 总共需要处理 ${TOP_AI_COMPANIES.length} 家公司`);

  if (!DEEPSEEK_API_KEY) {
    console.error('❌ 未找到 DEEPSEEK_API_KEY 环境变量');
    process.exit(1);
  }

  // 清空现有数据
  console.log('🧹 清空现有数据...');
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/companies`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    console.log('✅ 现有数据已清空');
  } catch (error) {
    console.error('❌ 清空数据失败:', error.message);
  }

  let successCount = 0;
  let failCount = 0;

  // 逐个处理公司（避免并发问题）
  for (let i = 0; i < TOP_AI_COMPANIES.length; i++) {
    const company = TOP_AI_COMPANIES[i];
    console.log(`\n📦 处理 ${i + 1}/${TOP_AI_COMPANIES.length}: ${company.realName}`);
    
    try {
      const companyData = await callDeepSeekSimple(company.realName);
      if (companyData) {
        const companyId = await insertCompanyData(company, companyData);
        if (companyId) {
          successCount++;
          console.log(`✅ ${company.realName} 处理成功`);
        } else {
          failCount++;
          console.log(`❌ ${company.realName} 插入失败`);
        }
      } else {
        failCount++;
        console.log(`❌ ${company.realName} 数据生成失败`);
      }
    } catch (error) {
      console.error(`❌ 处理 ${company.realName} 失败:`, error.message);
      failCount++;
    }

    // 每个公司之间延迟3秒
    if (i < TOP_AI_COMPANIES.length - 1) {
      console.log('⏳ 等待 3 秒后处理下一家公司...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n🎉 数据生成完成！');
  console.log(`✅ 成功: ${successCount} 家公司`);
  console.log(`❌ 失败: ${failCount} 家公司`);
  console.log(`📊 总计: ${TOP_AI_COMPANIES.length} 家公司`);
}

// 运行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };
