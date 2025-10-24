// 渐进式数据更新：先处理5家头部AI公司
const SUPABASE_URL = 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

// 5家高质量的真实AI公司数据
const PHASE1_COMPANIES = [
  {
    name: "OpenAI",
    description: "领先的AI研究公司，开发ChatGPT和GPT系列模型",
    detailed_description: "OpenAI成立于2015年，是一家专注于人工智能研究的公司，致力于确保人工智能造福全人类。公司最著名的产品是ChatGPT，这是一个基于大型语言模型的对话AI系统。OpenAI还开发了GPT系列模型，包括GPT-3、GPT-4等，这些模型在自然语言处理领域取得了突破性进展。",
    headquarters: "San Francisco, CA, USA",
    founded_year: 2015,
    employee_count_range: "1000-5000",
    valuation_usd: 80000000000,
    website: "https://openai.com",
    industry_tags: ["LLM", "AI Research", "Natural Language Processing"],
    company_type: "AI Giant",
    company_tier: "Tier 1",
    company_category: "AI Giant",
    products: ["ChatGPT", "GPT-4", "DALL-E", "Codex", "Whisper"]
  },
  {
    name: "Google DeepMind",
    description: "谷歌旗下AI研究实验室，专注于深度学习和强化学习",
    detailed_description: "Google DeepMind是谷歌旗下的AI研究实验室，成立于2010年，总部位于伦敦。该公司在深度学习和强化学习领域取得了重大突破，最著名的成就是开发了AlphaGo，这是第一个击败人类围棋世界冠军的AI系统。DeepMind还开发了AlphaFold，能够准确预测蛋白质结构，对生物医学研究具有重要意义。",
    headquarters: "London, UK",
    founded_year: 2010,
    employee_count_range: "1000-5000",
    valuation_usd: 50000000000,
    website: "https://deepmind.google",
    industry_tags: ["Deep Learning", "Reinforcement Learning", "AI Research"],
    company_type: "AI Giant",
    company_tier: "Tier 1",
    company_category: "AI Giant",
    products: ["AlphaGo", "AlphaFold", "Gemini", "Bard", "TensorFlow"]
  },
  {
    name: "Microsoft AI",
    description: "微软的AI部门，开发Copilot和Azure AI服务",
    detailed_description: "Microsoft AI是微软公司的AI部门，致力于将人工智能技术集成到微软的各个产品和服务中。公司开发了GitHub Copilot，这是一个AI编程助手，能够帮助开发者编写代码。Microsoft还提供Azure AI服务，包括机器学习、认知服务和AI工具。",
    headquarters: "Redmond, WA, USA",
    founded_year: 1975,
    employee_count_range: "200000+",
    valuation_usd: 3000000000000,
    website: "https://microsoft.com/ai",
    industry_tags: ["AI Platform", "Cloud AI", "Developer Tools"],
    company_type: "AI Giant",
    company_tier: "Tier 1",
    company_category: "AI Giant",
    products: ["GitHub Copilot", "Azure AI", "Microsoft Copilot", "Bing AI", "Office AI"]
  },
  {
    name: "Anthropic",
    description: "AI安全公司，开发Claude AI助手",
    detailed_description: "Anthropic是一家专注于AI安全的公司，成立于2021年，由OpenAI的前研究人员创立。公司开发了Claude AI助手，这是一个安全、有用、诚实的AI系统。Anthropic专注于AI对齐研究，确保AI系统按照人类价值观行事。",
    headquarters: "San Francisco, CA, USA",
    founded_year: 2021,
    employee_count_range: "500-1000",
    valuation_usd: 18000000000,
    website: "https://anthropic.com",
    industry_tags: ["AI Safety", "LLM", "AI Alignment", "AI Ethics"],
    company_type: "AI Unicorn",
    company_tier: "Tier 2",
    company_category: "AI Unicorn",
    products: ["Claude", "Claude API", "Constitutional AI", "AI Safety Research"]
  },
  {
    name: "NVIDIA",
    description: "GPU和AI计算领导者，提供AI硬件和软件平台",
    detailed_description: "NVIDIA是全球领先的GPU和AI计算公司，成立于1993年。公司不仅提供高性能的GPU硬件，还开发了CUDA编程平台和AI软件框架。NVIDIA的GPU被广泛用于机器学习训练和推理，是AI基础设施的重要组成部分。",
    headquarters: "Santa Clara, CA, USA",
    founded_year: 1993,
    employee_count_range: "25000+",
    valuation_usd: 2000000000000,
    website: "https://nvidia.com",
    industry_tags: ["AI Hardware", "GPU Computing", "CUDA", "AI Infrastructure"],
    company_type: "AI Giant",
    company_tier: "Tier 1",
    company_category: "AI Giant",
    products: ["CUDA", "TensorRT", "Jetson", "Drive", "Omniverse"]
  }
];

// 插入公司数据
async function insertCompanyData(companyData) {
  try {
    console.log(`🔄 正在插入公司: ${companyData.name}`);
    
    // 插入公司信息
    const companyResponse = await fetch(`${SUPABASE_URL}/rest/v1/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        name: companyData.name,
        description: companyData.description,
        detailed_description: companyData.detailed_description,
        headquarters: companyData.headquarters,
        founded_year: companyData.founded_year,
        employee_count_range: companyData.employee_count_range,
        valuation_usd: companyData.valuation_usd,
        website: companyData.website,
        industry_tags: companyData.industry_tags,
        company_type: companyData.company_type,
        company_tier: companyData.company_tier,
        company_category: companyData.company_category
      })
    });

    if (!companyResponse.ok) {
      const errorText = await companyResponse.text();
      throw new Error(`Company insert failed: ${companyResponse.status} - ${errorText}`);
    }

    const company = await companyResponse.json();
    console.log(`✅ 公司 ${companyData.name} 插入成功，ID: ${company.id}`);

    // 插入项目信息
    if (companyData.products && companyData.products.length > 0) {
      console.log(`🔄 正在插入 ${companyData.products.length} 个项目...`);
      
      for (const productName of companyData.products) {
        const projectResponse = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            company_id: company.id,
            name: productName,
            description: `${productName} - ${companyData.name}的主要AI产品`,
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
          const errorText = await projectResponse.text();
          console.error(`❌ 项目 ${productName} 插入失败: ${projectResponse.status} - ${errorText}`);
        }
      }
    }

    return company.id;
  } catch (error) {
    console.error(`❌ 插入公司数据失败:`, error.message);
    return null;
  }
}

// 主函数
async function phase1DataInsert() {
  console.log('🚀 Phase 1: 开始插入5家头部AI公司数据...');
  console.log(`📊 总共需要处理 ${PHASE1_COMPANIES.length} 家公司`);

  let successCount = 0;
  let failCount = 0;

  // 逐个插入公司数据
  for (let i = 0; i < PHASE1_COMPANIES.length; i++) {
    const company = PHASE1_COMPANIES[i];
    console.log(`\n📦 处理 ${i + 1}/${PHASE1_COMPANIES.length}: ${company.name}`);
    
    try {
      const companyId = await insertCompanyData(company);
      if (companyId) {
        successCount++;
        console.log(`✅ ${company.name} 处理成功`);
      } else {
        failCount++;
        console.log(`❌ ${company.name} 插入失败`);
      }
    } catch (error) {
      console.error(`❌ 处理 ${company.name} 失败:`, error.message);
      failCount++;
    }

    // 每个公司之间延迟2秒
    if (i < PHASE1_COMPANIES.length - 1) {
      console.log('⏳ 等待 2 秒后处理下一家公司...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n🎉 Phase 1 数据插入完成！');
  console.log(`✅ 成功: ${successCount} 家公司`);
  console.log(`❌ 失败: ${failCount} 家公司`);
  console.log(`📊 总计: ${PHASE1_COMPANIES.length} 家公司`);
  
  // 验证结果
  console.log('\n🔍 验证插入结果...');
  try {
    const verifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/companies?select=name,headquarters,valuation_usd&limit=10`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (verifyResponse.ok) {
      const companies = await verifyResponse.json();
      console.log('📋 当前数据库中的公司:');
      companies.forEach(company => {
        console.log(`- ${company.name}: ${company.headquarters}, $${(company.valuation_usd / 1000000000).toFixed(1)}B`);
      });
    }
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
  }
}

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
  window.phase1DataInsert = phase1DataInsert;
  console.log('🚀 Phase 1 数据插入脚本已加载，请在浏览器控制台中运行: phase1DataInsert()');
} else {
  phase1DataInsert().catch(console.error);
}
