import fetch from 'node-fetch';

// 环境变量配置
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

// 高质量的真实AI公司数据
const REAL_AI_COMPANIES = [
  {
    name: "OpenAI",
    description: "领先的AI研究公司，开发ChatGPT和GPT系列模型",
    detailed_description: "OpenAI成立于2015年，是一家专注于人工智能研究的公司，致力于确保人工智能造福全人类。公司最著名的产品是ChatGPT，这是一个基于大型语言模型的对话AI系统。OpenAI还开发了GPT系列模型，包括GPT-3、GPT-4等，这些模型在自然语言处理领域取得了突破性进展。公司采用了一种独特的公司结构，既有营利性子公司，也有非营利性母公司，以平衡商业利益和社会责任。",
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
    detailed_description: "Google DeepMind是谷歌旗下的AI研究实验室，成立于2010年，总部位于伦敦。该公司在深度学习和强化学习领域取得了重大突破，最著名的成就是开发了AlphaGo，这是第一个击败人类围棋世界冠军的AI系统。DeepMind还开发了AlphaFold，能够准确预测蛋白质结构，对生物医学研究具有重要意义。公司致力于解决科学和工程中的复杂问题，推动AI技术的发展。",
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
    detailed_description: "Microsoft AI是微软公司的AI部门，致力于将人工智能技术集成到微软的各个产品和服务中。公司开发了GitHub Copilot，这是一个AI编程助手，能够帮助开发者编写代码。Microsoft还提供Azure AI服务，包括机器学习、认知服务和AI工具。公司通过投资OpenAI和开发自己的AI模型，在AI领域保持领先地位。",
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
    name: "Meta AI",
    description: "Meta的AI研究部门，开发Llama和AI助手",
    detailed_description: "Meta AI是Meta公司（前Facebook）的AI研究部门，专注于开发先进的AI技术和产品。公司开发了Llama系列大型语言模型，这些模型在开源AI领域具有重要意义。Meta AI还致力于开发AI助手、计算机视觉技术和虚拟现实中的AI应用。公司通过开源策略推动AI技术的发展，为研究社区提供强大的工具和资源。",
    headquarters: "Menlo Park, CA, USA",
    founded_year: 2004,
    employee_count_range: "80000+",
    valuation_usd: 800000000000,
    website: "https://ai.meta.com",
    industry_tags: ["Open Source AI", "LLM", "Computer Vision", "VR AI"],
    company_type: "AI Giant",
    company_tier: "Tier 1",
    company_category: "AI Giant",
    products: ["Llama", "Meta AI Assistant", "Ray-Ban AI", "Quest AI", "WhatsApp AI"]
  },
  {
    name: "Anthropic",
    description: "AI安全公司，开发Claude AI助手",
    detailed_description: "Anthropic是一家专注于AI安全的公司，成立于2021年，由OpenAI的前研究人员创立。公司开发了Claude AI助手，这是一个安全、有用、诚实的AI系统。Anthropic专注于AI对齐研究，确保AI系统按照人类价值观行事。公司获得了亚马逊和谷歌等大型科技公司的投资，是AI安全领域的重要参与者。",
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
    detailed_description: "NVIDIA是全球领先的GPU和AI计算公司，成立于1993年。公司不仅提供高性能的GPU硬件，还开发了CUDA编程平台和AI软件框架。NVIDIA的GPU被广泛用于机器学习训练和推理，是AI基础设施的重要组成部分。公司还开发了自动驾驶AI平台、数据中心AI解决方案和专业AI工具。",
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
  },
  {
    name: "百度AI",
    description: "中国领先的AI公司，开发文心一言大模型",
    detailed_description: "百度是中国领先的AI公司，在人工智能领域投入巨大。公司开发了文心一言大模型，这是中国最先进的大型语言模型之一。百度在自动驾驶、语音识别、图像识别等领域都有重要突破。公司通过Apollo平台提供自动驾驶解决方案，在AI技术商业化方面处于领先地位。",
    headquarters: "北京, 中国",
    founded_year: 2000,
    employee_count_range: "40000+",
    valuation_usd: 50000000000,
    website: "https://baidu.com",
    industry_tags: ["LLM", "Autonomous Driving", "Speech Recognition", "Computer Vision"],
    company_type: "Domestic Giant",
    company_tier: "Tier 1",
    company_category: "Domestic Giant",
    products: ["文心一言", "Apollo", "百度AI开放平台", "小度", "百度地图AI"]
  },
  {
    name: "腾讯AI",
    description: "腾讯的AI部门，开发腾讯元宝和AI服务",
    detailed_description: "腾讯AI是腾讯公司的AI部门，致力于将人工智能技术应用到腾讯的各个业务中。公司开发了腾讯元宝AI助手，提供智能对话和内容生成服务。腾讯在游戏AI、社交AI、内容推荐等领域都有重要应用。公司通过腾讯云提供AI服务，为企业和开发者提供AI解决方案。",
    headquarters: "深圳, 中国",
    founded_year: 1998,
    employee_count_range: "100000+",
    valuation_usd: 400000000000,
    website: "https://tencent.com",
    industry_tags: ["AI Assistant", "Game AI", "Social AI", "Cloud AI"],
    company_type: "Domestic Giant",
    company_tier: "Tier 1",
    company_category: "Domestic Giant",
    products: ["腾讯元宝", "腾讯云AI", "游戏AI", "微信AI", "QQ AI"]
  },
  {
    name: "阿里巴巴AI",
    description: "阿里巴巴的AI部门，开发通义千问大模型",
    detailed_description: "阿里巴巴AI是阿里巴巴集团的AI部门，专注于开发和应用人工智能技术。公司开发了通义千问大模型，这是阿里巴巴的旗舰AI产品。阿里巴巴在电商AI、云计算AI、金融AI等领域都有重要应用。公司通过阿里云提供AI服务，为全球企业提供AI解决方案。",
    headquarters: "杭州, 中国",
    founded_year: 1999,
    employee_count_range: "250000+",
    valuation_usd: 200000000000,
    website: "https://alibaba.com",
    industry_tags: ["LLM", "E-commerce AI", "Cloud AI", "Financial AI"],
    company_type: "Domestic Giant",
    company_tier: "Tier 1",
    company_category: "Domestic Giant",
    products: ["通义千问", "阿里云AI", "淘宝AI", "支付宝AI", "钉钉AI"]
  },
  {
    name: "字节跳动AI",
    description: "字节跳动的AI部门，开发豆包AI助手",
    detailed_description: "字节跳动AI是字节跳动公司的AI部门，专注于开发AI技术和产品。公司开发了豆包AI助手，提供智能对话和内容创作服务。字节跳动在推荐算法、内容生成、视频AI等领域都有重要突破。公司通过抖音、今日头条等产品应用AI技术，为用户提供个性化体验。",
    headquarters: "北京, 中国",
    founded_year: 2012,
    employee_count_range: "150000+",
    valuation_usd: 300000000000,
    website: "https://bytedance.com",
    industry_tags: ["AI Assistant", "Recommendation AI", "Content AI", "Video AI"],
    company_type: "Domestic Giant",
    company_tier: "Tier 1",
    company_category: "Domestic Giant",
    products: ["豆包", "抖音AI", "今日头条AI", "TikTok AI", "飞书AI"]
  },
  {
    name: "商汤科技",
    description: "中国领先的AI视觉公司，专注于计算机视觉技术",
    detailed_description: "商汤科技是中国领先的AI视觉公司，成立于2014年，专注于计算机视觉和深度学习技术。公司开发了SenseCore AI平台，提供完整的AI解决方案。商汤在面部识别、图像识别、视频分析等领域都有重要应用，服务客户包括政府、企业和个人用户。",
    headquarters: "上海, 中国",
    founded_year: 2014,
    employee_count_range: "5000-10000",
    valuation_usd: 12000000000,
    website: "https://sensetime.com",
    industry_tags: ["Computer Vision", "Face Recognition", "Image Analysis", "AI Platform"],
    company_type: "Domestic Unicorn",
    company_tier: "Tier 2",
    company_category: "Domestic Unicorn",
    products: ["SenseCore", "人脸识别", "图像识别", "视频分析", "AI开放平台"]
  },
  {
    name: "旷视科技",
    description: "中国AI视觉独角兽，专注于人脸识别和计算机视觉",
    detailed_description: "旷视科技是中国领先的AI视觉公司，成立于2011年，专注于人脸识别和计算机视觉技术。公司开发了Brain++ AI平台，提供完整的AI解决方案。旷视在安防、金融、零售等领域都有重要应用，是中国AI视觉领域的重要参与者。",
    headquarters: "北京, 中国",
    founded_year: 2011,
    employee_count_range: "3000-5000",
    valuation_usd: 4000000000,
    website: "https://megvii.com",
    industry_tags: ["Face Recognition", "Computer Vision", "AI Platform", "Security AI"],
    company_type: "Domestic Unicorn",
    company_tier: "Tier 2",
    company_category: "Domestic Unicorn",
    products: ["Brain++", "人脸识别", "计算机视觉", "AI开放平台", "智能安防"]
  },
  {
    name: "Tesla AI",
    description: "特斯拉的AI部门，开发自动驾驶和机器人技术",
    detailed_description: "Tesla AI是特斯拉公司的AI部门，专注于开发自动驾驶和机器人技术。公司开发了FSD（完全自动驾驶）系统，这是目前最先进的自动驾驶技术之一。特斯拉还开发了Optimus机器人，展示了AI在机器人领域的应用。公司通过神经网络和机器学习技术，推动自动驾驶和AI技术的发展。",
    headquarters: "Austin, TX, USA",
    founded_year: 2003,
    employee_count_range: "100000+",
    valuation_usd: 800000000000,
    website: "https://tesla.com/ai",
    industry_tags: ["Autonomous Driving", "Robotics", "Neural Networks", "AI Hardware"],
    company_type: "AI Giant",
    company_tier: "Tier 1",
    company_category: "AI Giant",
    products: ["FSD", "Optimus", "Tesla Bot", "Neural Networks", "Dojo"]
  },
  {
    name: "Apple AI",
    description: "苹果的AI部门，开发Siri和机器学习技术",
    detailed_description: "Apple AI是苹果公司的AI部门，专注于开发AI技术和产品。公司开发了Siri语音助手，这是最早的消费级AI助手之一。苹果在机器学习、计算机视觉、自然语言处理等领域都有重要应用。公司通过Core ML框架为开发者提供AI工具，在隐私保护方面有独特优势。",
    headquarters: "Cupertino, CA, USA",
    founded_year: 1976,
    employee_count_range: "160000+",
    valuation_usd: 3000000000000,
    website: "https://apple.com/machine-learning",
    industry_tags: ["Voice AI", "Machine Learning", "Computer Vision", "Privacy AI"],
    company_type: "AI Giant",
    company_tier: "Tier 1",
    company_category: "AI Giant",
    products: ["Siri", "Core ML", "Create ML", "Vision Framework", "Natural Language"]
  },
  {
    name: "Amazon AI",
    description: "亚马逊的AI部门，开发Alexa和AWS AI服务",
    detailed_description: "Amazon AI是亚马逊公司的AI部门，专注于开发AI技术和产品。公司开发了Alexa语音助手，这是全球最受欢迎的智能音箱助手之一。亚马逊还通过AWS提供AI服务，包括机器学习、自然语言处理、计算机视觉等服务。公司在推荐系统、物流优化等领域都有重要应用。",
    headquarters: "Seattle, WA, USA",
    founded_year: 1994,
    employee_count_range: "1500000+",
    valuation_usd: 1500000000000,
    website: "https://aws.amazon.com/machine-learning",
    industry_tags: ["Voice AI", "Cloud AI", "Recommendation AI", "Logistics AI"],
    company_type: "AI Giant",
    company_tier: "Tier 1",
    company_category: "AI Giant",
    products: ["Alexa", "AWS AI", "SageMaker", "Rekognition", "Comprehend"]
  }
];

// 插入公司数据到数据库
async function insertCompanyData(companyData) {
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
      throw new Error(`Company insert failed: ${companyResponse.statusText}`);
    }

    const company = await companyResponse.json();
    console.log(`✅ 公司 ${companyData.name} 插入成功，ID: ${company.id}`);

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
          console.error(`❌ 项目 ${productName} 插入失败:`, projectResponse.statusText);
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
async function main() {
  console.log('🚀 开始插入高质量AI公司数据...');
  console.log(`📊 总共需要处理 ${REAL_AI_COMPANIES.length} 家公司`);

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

  // 逐个插入公司数据
  for (let i = 0; i < REAL_AI_COMPANIES.length; i++) {
    const company = REAL_AI_COMPANIES[i];
    console.log(`\n📦 处理 ${i + 1}/${REAL_AI_COMPANIES.length}: ${company.name}`);
    
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

    // 每个公司之间延迟1秒
    if (i < REAL_AI_COMPANIES.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n🎉 数据插入完成！');
  console.log(`✅ 成功: ${successCount} 家公司`);
  console.log(`❌ 失败: ${failCount} 家公司`);
  console.log(`📊 总计: ${REAL_AI_COMPANIES.length} 家公司`);
}

// 运行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };
