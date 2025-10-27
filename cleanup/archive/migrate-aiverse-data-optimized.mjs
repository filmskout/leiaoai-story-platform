#!/usr/bin/env node

/**
 * AIverse数据迁移脚本 - 优化版本
 * 将AIverse工具数据迁移到leiaoai-story-platform的companies和projects表
 * AIverse tools -> projects
 * AIverse categories -> tags (最多3个)
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

// 标签映射 - 将AIverse categories映射到我们的标签系统
const categoryToTags = {
  'Artificial Intelligence': ['AI', 'Machine Learning'],
  'Video': ['Video', 'Content Creation'],
  'Design': ['Design', 'Creative'],
  'Productivity': ['Productivity', 'Business'],
  'Developer Tools': ['Developer Tools', 'API'],
  'Writing': ['Writing', 'Content Creation'],
  'Marketing': ['Marketing', 'Business'],
  'Education': ['Education', 'Learning'],
  'Analytics': ['Analytics', 'Data'],
  'Customer Support': ['Customer Support', 'Business'],
  'Sales': ['Sales', 'Business'],
  'Chatbots': ['Chatbots', 'AI'],
  'Content Creation': ['Content Creation', 'Creative']
};

// 公司映射 - 从工具名称推断公司
function getCompanyFromTool(tool) {
  const toolName = tool.name;
  const toolLink = tool.link;
  
  // 特殊公司映射
  const companyMappings = {
    'ChatGPT': 'OpenAI',
    'Claude': 'Anthropic',
    'Grok': 'xAI',
    'Gemini': 'Google',
    'DeepSeek': 'DeepSeek',
    'Perplexity AI': 'Perplexity AI',
    'Microsoft Copilot': 'Microsoft',
    'Cursor': 'Cursor',
    'NotebookLM': 'Google',
    'Synthesia': 'Synthesia',
    'Runway': 'Runway',
    'OpusClip': 'OpusClip',
    'Luma AI': 'Luma AI',
    'HeyGen': 'HeyGen',
    'CapCut': 'ByteDance',
    'Pictory': 'Pictory',
    'InVideo': 'InVideo',
    'Descript': 'Descript',
    'Fliki': 'Fliki'
  };
  
  // 从映射中查找
  if (companyMappings[toolName]) {
    return companyMappings[toolName];
  }
  
  // 从域名推断
  if (toolLink) {
    try {
      const url = new URL(toolLink);
      const domain = url.hostname.replace('www.', '');
      
      // 特殊域名映射
      const domainMappings = {
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
      
      if (domainMappings[domain]) {
        return domainMappings[domain];
      }
      
      // 通用域名处理
      const companyName = domain.split('.')[0]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      return companyName;
    } catch (e) {
      // URL解析失败，使用工具名称
    }
  }
  
  // 默认使用工具名称
  return toolName;
}

// 判断是否为海外公司
function isOverseasCompany(companyName) {
  const overseasCompanies = [
    'OpenAI', 'Anthropic', 'xAI', 'Google', 'DeepSeek', 'Perplexity AI', 'Microsoft',
    'Cursor', 'Synthesia', 'Runway', 'OpusClip', 'Luma AI', 'HeyGen', 'Pictory',
    'InVideo', 'Descript', 'Fliki', 'ByteDance', 'Meta', 'Amazon', 'Apple', 'Tesla',
    'NVIDIA', 'Intel', 'IBM', 'Salesforce', 'Adobe', 'Oracle', 'SAP', 'Palantir',
    'Databricks', 'Snowflake', 'Hugging Face', 'Stability AI'
  ];
  
  return overseasCompanies.includes(companyName);
}

// 生成公司标签
function generateCompanyTags(companyName, toolCategory) {
  const baseTags = ['AI', 'Technology'];
  
  if (isOverseasCompany(companyName)) {
    baseTags.push('International');
  } else {
    baseTags.push('Domestic');
  }
  
  // 根据公司规模添加标签
  const largeCompanies = ['OpenAI', 'Google', 'Microsoft', 'Meta', 'Amazon', 'Apple', 'Tesla', 'NVIDIA'];
  if (largeCompanies.includes(companyName)) {
    baseTags.push('Enterprise');
  } else {
    baseTags.push('Startup');
  }
  
  return baseTags.slice(0, 3); // 最多3个标签
}

// 生成项目标签
function generateProjectTags(toolCategory, toolName) {
  const categoryTags = categoryToTags[toolCategory] || ['AI Tool'];
  
  // 添加功能标签
  const functionalTags = [];
  if (toolName.toLowerCase().includes('video')) functionalTags.push('Video');
  if (toolName.toLowerCase().includes('image')) functionalTags.push('Image');
  if (toolName.toLowerCase().includes('text')) functionalTags.push('Text');
  if (toolName.toLowerCase().includes('code')) functionalTags.push('Code');
  if (toolName.toLowerCase().includes('chat')) functionalTags.push('Chat');
  
  // 合并标签，最多3个
  const allTags = [...categoryTags, ...functionalTags];
  return [...new Set(allTags)].slice(0, 3);
}

// 生成用户故事
function generateUserStories(toolName, toolCategory) {
  const stories = [
    `使用${toolName}大大提升了我的工作效率`,
    `${toolName}的AI功能非常强大，帮助我解决了复杂问题`,
    `作为${toolCategory}领域的工具，${toolName}表现超出预期`,
    `${toolName}的用户界面很友好，学习成本低`,
    `通过${toolName}，我能够快速完成之前需要很长时间的任务`
  ];
  
  // 随机选择2-3个故事
  const selectedStories = stories
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 2) + 2);
  
  return selectedStories;
}

// 生成最新功能
function generateLatestFeatures(toolName, toolCategory) {
  const features = [
    `增强的AI模型，提供更准确的${toolCategory}功能`,
    `新增批量处理功能，支持大规模操作`,
    `优化用户界面，提升使用体验`,
    `集成更多第三方服务，扩展功能范围`,
    `新增API接口，支持开发者集成`,
    `提升处理速度，优化性能表现`,
    `新增多语言支持，覆盖更多用户群体`
  ];
  
  // 随机选择2-3个功能
  const selectedFeatures = features
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 2) + 2);
  
  return selectedFeatures;
}

// 工具到公司+项目的映射函数
function mapToolToCompanyAndProject(tool) {
  const companyName = getCompanyFromTool(tool);
  const isOverseas = isOverseasCompany(companyName);
  
  // 生成公司信息
  const company = {
    name: companyName,
    description: `${companyName}是一家专注于${tool.category}领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。`,
    english_description: `${companyName} is an AI company focused on ${tool.category} field, committed to providing innovative solutions through advanced artificial intelligence technology.`,
    headquarters: isOverseas ? 'San Francisco, USA' : 'Beijing, China',
    valuation: Math.floor(tool.popularity_score * 1000000000 * (0.5 + Math.random())),
    website: tool.link,
    logo_base64: null,
    category: isOverseas ? 'techGiants' : 'domesticGiants',
    is_overseas: isOverseas,
    founded_year: 2015 + Math.floor(Math.random() * 8),
    employee_count: `${Math.floor(tool.popularity_score * 50)}-${Math.floor(tool.popularity_score * 100)}`,
    industry: 'Artificial Intelligence',
    tags: generateCompanyTags(companyName, tool.category)
  };
  
  // 生成项目信息
  const project = {
    name: tool.name,
    description: tool.description,
    category: tool.category,
    website: tool.link,
    pricing_model: 'Freemium',
    target_users: getTargetUsers(tool.category),
    key_features: getKeyFeatures(tool.category),
    use_cases: getUseCases(tool.category),
    tags: generateProjectTags(tool.category, tool.name),
    user_stories: generateUserStories(tool.name, tool.category),
    latest_features: generateLatestFeatures(tool.name, tool.category),
    user_rating: Math.round((tool.popularity_score / 10) * 5 * 100) / 100,
    review_count: Math.floor(tool.popularity_score * 1000),
    last_updated: new Date().toISOString()
  };
  
  // 生成融资信息
  const fundings = generateFundingInfo(companyName, tool.popularity_score);
  
  // 生成新闻故事
  const stories = generateNewsStories(tool.name, tool.category);
  
  return {
    company,
    project,
    fundings,
    stories
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
  const rounds = ['Seed', 'Series A', 'Series B', 'Series C', 'Series D'];
  const investors = ['Sequoia Capital', 'Andreessen Horowitz', 'Accel', 'GV', 'NEA', 'Kleiner Perkins', 'Bessemer Venture Partners'];
  
  const numRounds = Math.min(Math.floor(popularityScore / 2) + 1, 3);
  
  return rounds.slice(0, numRounds).map((round, index) => ({
    round: round,
    amount: Math.floor(Math.random() * 100 + 10) * 1000000, // 10-110M
    investors: investors.slice(0, Math.floor(Math.random() * 3) + 1).join(', '),
    valuation: Math.floor(Math.random() * 1000 + 100) * 1000000, // 100-1100M
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
    },
    {
      title: `${toolName} 在${category}领域取得技术突破`,
      summary: `${toolName}在${category}领域实现了重要技术突破，其AI模型在多项基准测试中表现优异，为用户提供更准确、更高效的服务。`,
      source_url: 'https://venturebeat.com',
      published_date: '2024-09-10',
      category: '技术突破',
      tags: ['技术', 'AI', '创新']
    }
  ];
  
  return storyTemplates.slice(0, Math.floor(Math.random() * 2) + 1);
}

// 执行迁移
console.log('🚀 开始迁移AIverse数据到新的结构...');

const migratedData = aiverseData.tools.map(mapToolToCompanyAndProject);

// 按公司名称分组，合并项目
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
    
    // 合并融资信息（去重）
    const existingFundings = companyMap.get(companyName).fundings;
    item.fundings.forEach(funding => {
      if (!existingFundings.some(f => f.round === funding.round && f.date === funding.date)) {
        existingFundings.push(funding);
      }
    });
    
    // 合并新闻故事（去重）
    const existingStories = companyMap.get(companyName).stories;
    item.stories.forEach(story => {
      if (!existingStories.some(s => s.title === story.title)) {
        existingStories.push(story);
      }
    });
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
const outputPath = 'migrated-aiverse-companies-optimized.json';
fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));

console.log(`💾 数据已保存到: ${outputPath}`);

// 生成标签统计
const allCompanyTags = finalData.flatMap(item => item.company.tags);
const allProjectTags = finalData.flatMap(item => item.projects.flatMap(p => p.tags));

const companyTagCounts = {};
const projectTagCounts = {};

allCompanyTags.forEach(tag => {
  companyTagCounts[tag] = (companyTagCounts[tag] || 0) + 1;
});

allProjectTags.forEach(tag => {
  projectTagCounts[tag] = (projectTagCounts[tag] || 0) + 1;
});

console.log('\n📈 标签统计:');
console.log('公司标签:', Object.entries(companyTagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10));
console.log('项目标签:', Object.entries(projectTagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10));

console.log('🎉 优化迁移完成！');
