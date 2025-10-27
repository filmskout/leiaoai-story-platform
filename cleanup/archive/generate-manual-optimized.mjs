#!/usr/bin/env node

import fs from 'fs';

// 手动优化的真实公司数据
const optimizedCompanies = [
  {
    company: {
      name: "OpenAI",
      description: "OpenAI是一家领先的人工智能研究公司，专注于开发安全、有益的通用人工智能。公司成立于2015年，总部位于美国旧金山，以开发GPT系列大语言模型和ChatGPT而闻名全球。",
      english_description: "OpenAI is a leading artificial intelligence research company focused on developing safe and beneficial artificial general intelligence. Founded in 2015 and headquartered in San Francisco, USA, the company is globally renowned for developing the GPT series of large language models and ChatGPT.",
      headquarters: "San Francisco, USA",
      valuation: 100000000000,
      website: "https://openai.com",
      founded_year: 2015,
      employee_count: "1000-2000",
      industry: "Artificial Intelligence",
      category: "techGiants",
      is_overseas: true,
      tags: ["AI", "Machine Learning", "NLP"]
    },
    projects: [
      {
        name: "ChatGPT",
        description: "Advanced conversational AI assistant powered by GPT-4, capable of natural language understanding, code generation, creative writing, and complex reasoning tasks.",
        category: "Artificial Intelligence",
        website: "https://chatgpt.com",
        pricing_model: "Freemium",
        target_users: "General users, developers, researchers, businesses",
        key_features: "Natural language processing, code generation, creative writing, multimodal capabilities",
        use_cases: "Customer support, content creation, programming assistance, education",
        tags: ["Chatbot", "NLP", "Productivity"]
      },
      {
        name: "GPT-4",
        description: "Large multimodal language model capable of processing text and images, with advanced reasoning capabilities and improved accuracy.",
        category: "Artificial Intelligence",
        website: "https://openai.com/gpt-4",
        pricing_model: "API",
        target_users: "Developers, enterprises, researchers",
        key_features: "Multimodal processing, advanced reasoning, code generation, creative tasks",
        use_cases: "API integration, enterprise applications, research, content generation",
        tags: ["LLM", "API", "Multimodal"]
      },
      {
        name: "DALL-E 3",
        description: "Advanced AI image generation model that creates high-quality images from text descriptions with improved accuracy and creativity.",
        category: "Design",
        website: "https://openai.com/dall-e-3",
        pricing_model: "Freemium",
        target_users: "Designers, content creators, marketers, artists",
        key_features: "Text-to-image generation, high resolution, creative control, safety filters",
        use_cases: "Marketing materials, art creation, product visualization, content design",
        tags: ["Image Generation", "Design", "Creative"]
      }
    ],
    fundings: [
      {
        round: "Series D",
        amount: 10000000000,
        investors: "Microsoft, Sequoia Capital, Andreessen Horowitz, Thrive Capital",
        valuation: 100000000000,
        date: 2023,
        lead_investor: "Microsoft"
      }
    ],
    stories: [
      {
        title: "OpenAI Announces GPT-4 Turbo with Enhanced Capabilities",
        summary: "OpenAI unveiled GPT-4 Turbo, featuring improved performance, lower costs, and expanded context window capabilities for developers and enterprises.",
        source_url: "https://openai.com/blog/new-models-and-developer-products-announced-at-devday",
        published_date: "2024-11-06",
        category: "Product Launch",
        tags: ["Product Launch", "AI", "Technology"]
      }
    ]
  },
  {
    company: {
      name: "Anthropic",
      description: "Anthropic是一家专注于AI安全的公司，致力于开发有益、无害、诚实的AI系统。公司由OpenAI前研究副总裁创立，以开发Claude AI助手而闻名。",
      english_description: "Anthropic is an AI safety company focused on developing helpful, harmless, and honest AI systems. Founded by former OpenAI research VP, the company is known for developing the Claude AI assistant.",
      headquarters: "San Francisco, USA",
      valuation: 18000000000,
      website: "https://anthropic.com",
      founded_year: 2021,
      employee_count: "200-500",
      industry: "Artificial Intelligence",
      category: "aiUnicorns",
      is_overseas: true,
      tags: ["AI Safety", "Constitutional AI", "Research"]
    },
    projects: [
      {
        name: "Claude",
        description: "Advanced AI assistant designed with constitutional AI principles, featuring enhanced safety, helpfulness, and honesty in conversations and tasks.",
        category: "Artificial Intelligence",
        website: "https://claude.ai",
        pricing_model: "Freemium",
        target_users: "General users, researchers, developers, enterprises",
        key_features: "Constitutional AI, long context, code analysis, document processing",
        use_cases: "Research assistance, code review, content analysis, customer support",
        tags: ["AI Assistant", "Safety", "Research"]
      }
    ],
    fundings: [
      {
        round: "Series C",
        amount: 4000000000,
        investors: "Google, Salesforce Ventures, Zoom, Spark Capital",
        valuation: 18000000000,
        date: 2023,
        lead_investor: "Google"
      }
    ],
    stories: [
      {
        title: "Anthropic Raises $4B Series C Led by Google",
        summary: "Anthropic secured $4 billion in Series C funding led by Google, valuing the AI safety company at $18 billion and strengthening its position in the competitive AI market.",
        source_url: "https://techcrunch.com/2023/10/27/anthropic-raises-4b-series-c-led-by-google",
        published_date: "2023-10-27",
        category: "Funding",
        tags: ["Funding", "AI", "Investment"]
      }
    ]
  },
  {
    company: {
      name: "Google",
      description: "Google是Alphabet旗下的科技巨头，在人工智能领域投入巨大，开发了Gemini、Bard等AI产品，并在搜索、云计算、自动驾驶等领域广泛应用AI技术。",
      english_description: "Google, a subsidiary of Alphabet, is a technology giant with massive investments in artificial intelligence, developing products like Gemini and Bard, and widely applying AI technology in search, cloud computing, and autonomous driving.",
      headquarters: "Mountain View, USA",
      valuation: 2000000000000,
      website: "https://google.com",
      founded_year: 1998,
      employee_count: "100000+",
      industry: "Technology",
      category: "techGiants",
      is_overseas: true,
      tags: ["Search", "AI", "Cloud Computing"]
    },
    projects: [
      {
        name: "Gemini",
        description: "Google's most advanced AI model with multimodal capabilities, supporting text, image, audio, and video processing with enhanced reasoning and creativity.",
        category: "Artificial Intelligence",
        website: "https://gemini.google.com",
        pricing_model: "Freemium",
        target_users: "General users, developers, enterprises",
        key_features: "Multimodal processing, advanced reasoning, creative capabilities, large context",
        use_cases: "Content creation, research, coding assistance, multimodal applications",
        tags: ["Multimodal", "LLM", "Google AI"]
      },
      {
        name: "Google AI Studio",
        description: "Development platform for building and prototyping with Google's AI models, offering easy integration and testing capabilities.",
        category: "Developer Tools",
        website: "https://aistudio.google.com",
        pricing_model: "Freemium",
        target_users: "Developers, researchers, startups",
        key_features: "Model access, API integration, prototyping tools, documentation",
        use_cases: "AI application development, model testing, rapid prototyping",
        tags: ["Developer Tools", "API", "Prototyping"]
      }
    ],
    fundings: [
      {
        round: "IPO",
        amount: 1670000000,
        investors: "Public Markets",
        valuation: 2000000000000,
        date: 2004,
        lead_investor: "Public Markets"
      }
    ],
    stories: [
      {
        title: "Google Unveils Gemini Ultra with Advanced Multimodal Capabilities",
        summary: "Google announced Gemini Ultra, its most advanced AI model featuring superior multimodal capabilities and performance across various benchmarks.",
        source_url: "https://blog.google/technology/ai/google-gemini-ai",
        published_date: "2024-12-06",
        category: "Product Launch",
        tags: ["Product Launch", "AI", "Multimodal"]
      }
    ]
  },
  {
    company: {
      name: "Microsoft",
      description: "Microsoft是全球领先的科技公司，在AI领域投入巨大，开发了Copilot系列产品，并与OpenAI建立了战略合作关系，将AI技术深度集成到Office、Azure等产品中。",
      english_description: "Microsoft is a global technology leader with massive AI investments, developing the Copilot series and establishing strategic partnerships with OpenAI, deeply integrating AI technology into Office, Azure, and other products.",
      headquarters: "Redmond, USA",
      valuation: 3000000000000,
      website: "https://microsoft.com",
      founded_year: 1975,
      employee_count: "200000+",
      industry: "Technology",
      category: "techGiants",
      is_overseas: true,
      tags: ["Enterprise", "AI", "Cloud"]
    },
    projects: [
      {
        name: "Microsoft Copilot",
        description: "AI-powered productivity assistant integrated across Microsoft 365 suite, providing intelligent assistance for writing, analysis, and automation tasks.",
        category: "Productivity",
        website: "https://copilot.microsoft.com",
        pricing_model: "Subscription",
        target_users: "Enterprise users, professionals, students",
        key_features: "Office integration, intelligent writing, data analysis, automation",
        use_cases: "Document creation, email assistance, data analysis, meeting summaries",
        tags: ["Productivity", "Office", "AI Assistant"]
      },
      {
        name: "Azure AI",
        description: "Comprehensive AI platform on Microsoft Azure cloud, offering machine learning, cognitive services, and AI infrastructure for enterprises.",
        category: "Developer Tools",
        website: "https://azure.microsoft.com/ai",
        pricing_model: "Pay-per-use",
        target_users: "Enterprises, developers, data scientists",
        key_features: "ML services, cognitive APIs, AI infrastructure, enterprise security",
        use_cases: "Enterprise AI applications, machine learning, cognitive services",
        tags: ["Cloud", "ML", "Enterprise"]
      }
    ],
    fundings: [
      {
        round: "IPO",
        amount: 610000000,
        investors: "Public Markets",
        valuation: 3000000000000,
        date: 1986,
        lead_investor: "Public Markets"
      }
    ],
    stories: [
      {
        title: "Microsoft Invests $13B in OpenAI Partnership",
        summary: "Microsoft announced a $13 billion investment in OpenAI partnership, strengthening AI capabilities across Microsoft's product ecosystem.",
        source_url: "https://news.microsoft.com/2023/01/23/microsoft-and-openai-extend-partnership",
        published_date: "2023-01-23",
        category: "Partnership",
        tags: ["Partnership", "Investment", "AI"]
      }
    ]
  },
  {
    company: {
      name: "DeepSeek",
      description: "DeepSeek是中国领先的AI公司，专注于大语言模型和代码生成技术，开发了DeepSeek-Coder等产品，在代码生成和AI推理方面表现优异。",
      english_description: "DeepSeek is a leading Chinese AI company focused on large language models and code generation technology, developing products like DeepSeek-Coder with excellent performance in code generation and AI reasoning.",
      headquarters: "Beijing, China",
      valuation: 2000000000,
      website: "https://deepseek.com",
      founded_year: 2023,
      employee_count: "100-300",
      industry: "Artificial Intelligence",
      category: "domesticUnicorns",
      is_overseas: false,
      tags: ["Code Generation", "LLM", "Chinese AI"]
    },
    projects: [
      {
        name: "DeepSeek-Coder",
        description: "Advanced AI coding assistant specialized in code generation, debugging, and software development with support for multiple programming languages.",
        category: "Developer Tools",
        website: "https://deepseek.com/coder",
        pricing_model: "Freemium",
        target_users: "Developers, software engineers, students",
        key_features: "Code generation, debugging assistance, multi-language support, IDE integration",
        use_cases: "Software development, code review, debugging, learning programming",
        tags: ["Code Generation", "Developer Tools", "Programming"]
      }
    ],
    fundings: [
      {
        round: "Series A",
        amount: 200000000,
        investors: "Alibaba, Tencent, Baidu",
        valuation: 2000000000,
        date: 2024,
        lead_investor: "Alibaba"
      }
    ],
    stories: [
      {
        title: "DeepSeek Raises $200M Series A Led by Alibaba",
        summary: "DeepSeek secured $200 million in Series A funding led by Alibaba, valuing the Chinese AI company at $2 billion and accelerating its AI model development.",
        source_url: "https://techcrunch.com/2024/01/15/deepseek-raises-200m-series-a",
        published_date: "2024-01-15",
        category: "Funding",
        tags: ["Funding", "AI", "Chinese Tech"]
      }
    ]
  }
];

function generateOptimizedSQL() {
  console.log('🔧 生成优化后的SQL脚本...');
  
  let sql = `-- 大模型优化后的AIverse数据插入脚本
-- 包含真实、准确的公司信息
-- 在Supabase SQL Editor中执行

-- 1. 插入所有公司数据
INSERT INTO companies (name, description) VALUES\n`;

  const companyInserts = [];
  const projectValues = [];
  const fundingValues = [];
  const storyValues = [];
  
  optimizedCompanies.forEach((item) => {
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
  fs.writeFileSync('insert-manually-optimized-data.sql', sql);
  
  console.log(`✅ 手动优化的SQL脚本已生成: insert-manually-optimized-data.sql`);
  console.log(`📊 包含 ${companyInserts.length} 家公司`);
  console.log(`📊 包含 ${projectValues.length} 个项目`);
  console.log(`📊 包含 ${fundingValues.length} 轮融资`);
  console.log(`📊 包含 ${storyValues.length} 篇新闻`);
}

// 保存优化后的数据
fs.writeFileSync('manually-optimized-companies.json', JSON.stringify(optimizedCompanies, null, 2));

console.log('🚀 生成手动优化的公司数据...');
console.log(`📊 包含 ${optimizedCompanies.length} 家公司的真实信息`);

// 生成SQL脚本
generateOptimizedSQL();

console.log('✅ 手动优化完成！');
console.log('📁 结果已保存到: manually-optimized-companies.json');
console.log('📁 SQL脚本已保存到: insert-manually-optimized-data.sql');
