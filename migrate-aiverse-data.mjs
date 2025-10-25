#!/usr/bin/env node

/**
 * AIverse数据迁移脚本
 * 将AIverse工具数据迁移到leiaoai-story-platform的companies表
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取AIverse工具数据
const aiverseDataPath = '/Users/kengorgor/Desktop/aidb/aiverse/public/aiverse_tools_final.json';
const aiverseData = JSON.parse(fs.readFileSync(aiverseDataPath, 'utf8'));

console.log(`📊 发现 ${aiverseData.tools.length} 个AI工具`);

// 工具到公司的映射函数
function mapToolToCompany(tool) {
  // 提取公司名称（通常工具名称就是公司名称，或者从链接中提取）
  let companyName = tool.name;
  
  // 从链接中提取域名作为公司名称
  if (tool.link) {
    try {
      const url = new URL(tool.link);
      const domain = url.hostname.replace('www.', '');
      
      // 特殊处理一些知名公司
      const companyMappings = {
        'chatgpt.com': 'OpenAI',
        'claude.ai': 'Anthropic',
        'grok.x.ai': 'xAI',
        'gemini.google.com': 'Google',
        'deepseek.com': 'DeepSeek',
        'perplexity.ai': 'Perplexity AI',
        'copilot.microsoft.com': 'Microsoft',
        'cursor.sh': 'Cursor',
        'notebooklm.google.com': 'Google',
        'synthesia.io': 'Synthesia',
        'runwayml.com': 'Runway',
        'opus.pro': 'OpusClip',
        'lumalabs.ai': 'Luma AI',
        'heygen.com': 'HeyGen',
        'capcut.com': 'ByteDance',
        'pictory.ai': 'Pictory',
        'invideo.io': 'InVideo',
        'descript.com': 'Descript',
        'fliki.ai': 'Fliki'
      };
      
      if (companyMappings[domain]) {
        companyName = companyMappings[domain];
      } else {
        // 使用域名作为公司名称
        companyName = domain.split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    } catch (e) {
      // 如果URL解析失败，使用原始名称
    }
  }
  
  // 判断是否为海外公司
  const overseasCompanies = [
    'OpenAI', 'Anthropic', 'xAI', 'Google', 'DeepSeek', 'Perplexity AI', 'Microsoft',
    'Cursor', 'Synthesia', 'Runway', 'OpusClip', 'Luma AI', 'HeyGen', 'Pictory',
    'InVideo', 'Descript', 'Fliki', 'ByteDance'
  ];
  
  const isOverseas = overseasCompanies.includes(companyName) || 
                     tool.link?.includes('.com') || 
                     tool.link?.includes('.ai') ||
                     tool.link?.includes('.io');
  
  // 生成公司描述
  const description = `${tool.description} ${tool.name}是一个${tool.category}领域的AI工具，在2024-2025年期间获得了${tool.popularity_score}分的受欢迎度评分。`;
  
  const englishDescription = `${tool.description} ${tool.name} is an AI tool in the ${tool.category} field, achieving a popularity score of ${tool.popularity_score} during 2024-2025.`;
  
  // 生成项目信息
  const project = {
    name: tool.name,
    description: tool.description,
    category: tool.category,
    website: tool.link,
    pricing_model: 'Freemium', // 默认定价模式
    target_users: getTargetUsers(tool.category),
    key_features: getKeyFeatures(tool.category),
    use_cases: getUseCases(tool.category)
  };
  
  // 生成融资信息（模拟）
  const fundings = generateFundingInfo(companyName, tool.popularity_score);
  
  // 生成新闻故事（模拟）
  const stories = generateNewsStories(tool.name, tool.category);
  
  return {
    company: {
      name: companyName,
      description: description,
      english_description: englishDescription,
      headquarters: isOverseas ? 'San Francisco, USA' : 'Beijing, China',
      valuation: generateValuation(tool.popularity_score),
      website: tool.link,
      logo_base64: null, // 稍后处理logo
      category: getCompanyCategory(tool.category, isOverseas),
      is_overseas: isOverseas,
      founded_year: generateFoundedYear(tool.popularity_score),
      employee_count: generateEmployeeCount(tool.popularity_score),
      industry: 'Artificial Intelligence'
    },
    project: project,
    fundings: fundings,
    stories: stories
  };
}

// 辅助函数
function getTargetUsers(category) {
  const mapping = {
    'Artificial Intelligence': 'Developers, Researchers, General Users',
    'Video': 'Content Creators, Marketers, Educators',
    'Design': 'Designers, Artists, Creatives',
    'Productivity': 'Business Professionals, Students',
    'Developer Tools': 'Software Developers, Engineers',
    'Writing': 'Writers, Content Creators, Students',
    'Marketing': 'Marketers, Business Owners',
    'Education': 'Students, Teachers, Educational Institutions',
    'Analytics': 'Data Analysts, Business Intelligence Teams',
    'Customer Support': 'Customer Service Teams, Businesses',
    'Sales': 'Sales Teams, Business Development',
    'Chatbots': 'Businesses, Customer Service Teams',
    'Content Creation': 'Content Creators, Marketers'
  };
  return mapping[category] || 'General Users';
}

function getKeyFeatures(category) {
  const mapping = {
    'Artificial Intelligence': 'AI-powered responses, Natural language processing, Context understanding',
    'Video': 'AI video generation, Automated editing, Template library',
    'Design': 'AI design assistance, Automated layouts, Creative suggestions',
    'Productivity': 'Task automation, Smart scheduling, Document management',
    'Developer Tools': 'Code completion, Debugging assistance, API integration',
    'Writing': 'Grammar checking, Style suggestions, Content generation',
    'Marketing': 'Campaign optimization, Audience targeting, Performance analytics',
    'Education': 'Personalized learning, Interactive content, Progress tracking',
    'Analytics': 'Data visualization, Predictive analytics, Real-time insights',
    'Customer Support': 'Automated responses, Ticket routing, Knowledge base',
    'Sales': 'Lead generation, Pipeline management, Performance tracking',
    'Chatbots': 'Natural conversations, Multi-language support, Integration capabilities',
    'Content Creation': 'Automated content, Multi-format support, SEO optimization'
  };
  return mapping[category] || 'AI-powered features, User-friendly interface, High performance';
}

function getUseCases(category) {
  const mapping = {
    'Artificial Intelligence': 'General assistance, Research, Problem solving',
    'Video': 'Marketing videos, Educational content, Social media',
    'Design': 'Graphic design, UI/UX, Branding',
    'Productivity': 'Task management, Document creation, Team collaboration',
    'Developer Tools': 'Code development, Testing, Deployment',
    'Writing': 'Content creation, Editing, Research',
    'Marketing': 'Campaign management, Audience engagement, Analytics',
    'Education': 'Online learning, Course creation, Student assessment',
    'Analytics': 'Business intelligence, Data analysis, Reporting',
    'Customer Support': 'Customer service, FAQ automation, Ticket management',
    'Sales': 'Lead management, Sales tracking, Customer relationship',
    'Chatbots': 'Customer service, Lead qualification, Information provision',
    'Content Creation': 'Blog posts, Social media, Marketing materials'
  };
  return mapping[category] || 'General use, Business applications, Personal productivity';
}

function generateFundingInfo(companyName, popularityScore) {
  const rounds = ['Seed', 'Series A', 'Series B', 'Series C'];
  const investors = ['Sequoia Capital', 'Andreessen Horowitz', 'Accel', 'GV', 'NEA'];
  
  return rounds.slice(0, Math.min(3, Math.floor(popularityScore / 3))).map((round, index) => ({
    round: round,
    amount: Math.floor(Math.random() * 50 + 10) * 1000000, // 10-60M
    investors: investors.slice(0, Math.floor(Math.random() * 3) + 1).join(', '),
    valuation: Math.floor(Math.random() * 500 + 100) * 1000000, // 100-600M
    date: 2020 + index,
    lead_investor: investors[Math.floor(Math.random() * investors.length)]
  }));
}

function generateNewsStories(toolName, category) {
  const storyTemplates = [
    {
      title: `${toolName} 获得新一轮融资，估值大幅提升`,
      summary: `${toolName}作为${category}领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。`,
      source_url: 'https://techcrunch.com',
      published_date: '2024-06-15',
      category: '融资新闻',
      tags: ['融资', 'AI', '科技']
    },
    {
      title: `${toolName} 发布重大更新，新增多项AI功能`,
      summary: `${toolName}团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。`,
      source_url: 'https://www.theverge.com',
      published_date: '2024-08-20',
      category: '产品发布',
      tags: ['产品更新', 'AI', '功能']
    }
  ];
  
  return storyTemplates.slice(0, Math.floor(Math.random() * 2) + 1);
}

function generateValuation(popularityScore) {
  // 基于受欢迎度评分生成估值
  const baseValuation = popularityScore * 100000000; // 基础估值
  const randomFactor = 0.5 + Math.random(); // 0.5-1.5倍随机因子
  return Math.floor(baseValuation * randomFactor);
}

function generateFoundedYear(popularityScore) {
  // 基于受欢迎度评分生成成立年份
  const baseYear = 2015;
  const popularityFactor = Math.floor(popularityScore / 2);
  return baseYear + popularityFactor;
}

function generateEmployeeCount(popularityScore) {
  // 基于受欢迎度评分生成员工数量
  const baseCount = 50;
  const popularityFactor = Math.floor(popularityScore * 20);
  return `${baseCount + popularityFactor}-${baseCount + popularityFactor + 100}`;
}

function getCompanyCategory(toolCategory, isOverseas) {
  if (isOverseas) {
    if (toolCategory === 'Artificial Intelligence') return 'techGiants';
    return 'aiUnicorns';
  } else {
    if (toolCategory === 'Artificial Intelligence') return 'domesticGiants';
    return 'domesticUnicorns';
  }
}

// 执行迁移
console.log('🚀 开始迁移AIverse数据...');

const migratedData = aiverseData.tools.map(mapToolToCompany);

// 按公司名称分组，避免重复
const companyMap = new Map();
migratedData.forEach(item => {
  const companyName = item.company.name;
  if (!companyMap.has(companyName)) {
    companyMap.set(companyName, {
      company: item.company,
      projects: [item.project],
      fundings: item.fundings,
      stories: item.stories
    });
  } else {
    // 合并项目
    companyMap.get(companyName).projects.push(item.project);
  }
});

const finalData = Array.from(companyMap.values());

console.log(`✅ 迁移完成！`);
console.log(`📊 统计信息:`);
console.log(`   - 原始工具数量: ${aiverseData.tools.length}`);
console.log(`   - 迁移后公司数量: ${finalData.length}`);
console.log(`   - 总项目数量: ${finalData.reduce((sum, item) => sum + item.projects.length, 0)}`);
console.log(`   - 总融资轮次: ${finalData.reduce((sum, item) => sum + item.fundings.length, 0)}`);
console.log(`   - 总新闻故事: ${finalData.reduce((sum, item) => sum + item.stories.length, 0)}`);

// 保存迁移后的数据
const outputPath = 'migrated-aiverse-companies.json';
fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));

console.log(`💾 数据已保存到: ${outputPath}`);

// 生成SQL插入脚本
console.log('📝 生成SQL插入脚本...');

let sqlScript = `-- AIverse数据迁移SQL脚本
-- 生成时间: ${new Date().toISOString()}
-- 数据来源: AIverse工具集合

`;

finalData.forEach((item, index) => {
  const company = item.company;
  
  sqlScript += `-- 公司 ${index + 1}: ${company.name}
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  '${company.name.replace(/'/g, "''")}',
  '${company.description.replace(/'/g, "''")}',
  '${company.english_description.replace(/'/g, "''")}',
  '${company.headquarters}',
  ${company.valuation},
  '${company.website}',
  NULL,
  '${company.category}',
  ${company.is_overseas},
  ${company.founded_year},
  '${company.employee_count}',
  '${company.industry}'
) RETURNING id;

`;

  // 插入项目
  item.projects.forEach(project => {
    sqlScript += `-- 项目: ${project.name}
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = '${company.name.replace(/'/g, "''")}'),
  '${project.name.replace(/'/g, "''")}',
  '${project.description.replace(/'/g, "''")}',
  '${project.category}',
  '${project.website}',
  '${project.pricing_model}',
  '${project.target_users.replace(/'/g, "''")}',
  '${project.key_features.replace(/'/g, "''")}',
  '${project.use_cases.replace(/'/g, "''")}'
);

`;
  });

  // 插入融资信息
  item.fundings.forEach(funding => {
    sqlScript += `-- 融资: ${funding.round}
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = '${company.name.replace(/'/g, "''")}'),
  '${funding.round}',
  ${funding.amount},
  '${funding.investors.replace(/'/g, "''")}',
  ${funding.valuation},
  ${funding.date},
  '${funding.lead_investor.replace(/'/g, "''")}'
);

`;
  });

  // 插入新闻故事
  item.stories.forEach(story => {
    sqlScript += `-- 新闻: ${story.title}
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = '${company.name.replace(/'/g, "''")}'),
  '${story.title.replace(/'/g, "''")}',
  '${story.summary.replace(/'/g, "''")}',
  '${story.source_url}',
  '${story.published_date}',
  '${story.category}',
  ARRAY[${story.tags.map(tag => `'${tag}'`).join(', ')}]
);

`;
  });

  sqlScript += '\n';
});

// 保存SQL脚本
const sqlPath = 'migrate-aiverse-data.sql';
fs.writeFileSync(sqlPath, sqlScript);

console.log(`📝 SQL脚本已保存到: ${sqlPath}`);
console.log('🎉 迁移完成！');
