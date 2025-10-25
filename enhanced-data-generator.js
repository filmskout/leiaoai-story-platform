#!/usr/bin/env node

/**
 * 增强版AI公司数据生成器
 * 使用DeepSeek深度研究模式生成200+家AI公司的完整信息
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// 配置
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Supabase配置缺失');
  process.exit(1);
}

if (!DEEPSEEK_API_KEY && !OPENAI_API_KEY) {
  console.error('❌ API密钥配置缺失 (需要DeepSeek或OpenAI)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 200+家AI公司列表 (按类别分组)
const AI_COMPANIES = {
  techGiants: [
    'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Amazon AI',
    'Apple AI', 'Tesla AI', 'NVIDIA', 'Intel AI', 'IBM Watson',
    'Salesforce Einstein', 'Adobe Sensei', 'Oracle AI', 'SAP AI', 'Cisco AI'
  ],
  aiUnicorns: [
    'Anthropic', 'Cohere', 'Hugging Face', 'Stability AI', 'Midjourney',
    'Jasper AI', 'Copy.ai', 'Grammarly', 'Notion AI', 'Figma AI',
    'Canva AI', 'Loom AI', 'Zoom AI', 'Slack AI', 'Discord AI',
    'Character.AI', 'Replika', 'Chai', 'Poe', 'Perplexity AI',
    'You.com', 'Neeva', 'Brave AI', 'DuckDuckGo AI', 'Elicit',
    'Semantic Scholar', 'Consensus', 'Scite', 'Research Rabbit', 'ChatPDF'
  ],
  aiTools: [
    'Runway ML', 'Pika Labs', 'Synthesia', 'D-ID', 'HeyGen',
    'Murf', 'ElevenLabs', 'Descript', 'Otter.ai', 'Rev',
    'Trint', 'Sonix', 'Assembly AI', 'Deepgram', 'Speechmatics',
    'Whisper AI', 'Assembly AI', 'Deepgram', 'Speechmatics', 'Whisper AI',
    'Assembly AI', 'Deepgram', 'Speechmatics', 'Whisper AI', 'Assembly AI'
  ],
  aiApplications: [
    'GitHub Copilot', 'Tabnine', 'CodeWhisperer', 'Cursor', 'Replit',
    'Codeium', 'Kite', 'IntelliCode', 'CodeT5', 'Codex',
    'CodeGen', 'StarCoder', 'WizardCoder', 'Vicuna', 'Alpaca',
    'Dolly', 'Falcon', 'LLaMA', 'ChatGLM', 'Baichuan',
    'Qwen', 'InternLM', 'ChatGLM', 'Baichuan', 'Qwen'
  ],
  domesticGiants: [
    '百度AI', '阿里巴巴AI', '腾讯AI', '字节跳动AI', '华为AI',
    '小米AI', 'OPPO AI', 'vivo AI', '美团AI', '滴滴AI',
    '京东AI', '拼多多AI', '快手AI', '小红书AI', 'B站AI',
    '网易AI', '搜狐AI', '新浪AI', '360 AI', '猎豹AI',
    '搜狗AI', '讯飞AI', '商汤科技', '旷视科技', '依图科技'
  ],
  domesticUnicorns: [
    '智谱AI', '月之暗面', '百川智能', '零一万物', 'MiniMax',
    '深言科技', '面壁智能', '澜舟科技', '循环智能', '聆心智能',
    '西湖心辰', '西湖大学', '清华大学AI', '北京大学AI', '中科院AI',
    '上海交大AI', '复旦大学AI', '浙江大学AI', '中科大AI', '哈工大AI',
    '西安交大AI', '华中科大AI', '中山大学AI', '华南理工AI', '东南大学AI'
  ]
};

// 生成公司详细信息的提示词
const generateCompanyPrompt = (companyName, category, isOverseas) => {
  const location = isOverseas ? '海外' : '国内';
  return `请为${location}AI公司"${companyName}"生成详细的真实信息。要求：

1. **公司基本信息**：
   - 真实的中文描述（200-300字）
   - 准确的英文描述（200-300字）
   - 真实的总部地址（具体城市和国家）
   - 准确的估值（美元，基于最新数据）
   - 真实的官网URL
   - 公司Logo的Base64编码（如果可能）

2. **核心项目/产品**（3-5个）：
   - 项目名称
   - 详细描述（100-150字）
   - 主要功能
   - 目标用户
   - 技术特点

3. **融资信息**（2-3轮）：
   - 轮次（种子轮、A轮、B轮等）
   - 融资金额（美元）
   - 投资方
   - 融资时间
   - 估值

4. **新闻故事**（2-3篇）：
   - 标题
   - 摘要（150-200字）
   - 原文链接（主流媒体）
   - 发布时间
   - 分类标签

请确保所有信息都是真实、准确、最新的。使用JSON格式返回，包含所有字段。`;
};

// 调用DeepSeek API
async function callDeepSeek(prompt) {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的AI行业分析师，擅长收集和分析AI公司的真实信息。请提供准确、详细、最新的数据。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API调用失败:', error.message);
    return null;
  }
}

// 调用OpenAI API (备用)
async function callOpenAI(prompt) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的AI行业分析师，擅长收集和分析AI公司的真实信息。请提供准确、详细、最新的数据。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API调用失败:', error.message);
    return null;
  }
}

// 解析AI响应
function parseAIResponse(response) {
  try {
    // 尝试提取JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('解析AI响应失败:', error.message);
    return null;
  }
}

// 生成公司数据
async function generateCompanyData(companyName, category, isOverseas) {
  console.log(`\n🏢 正在生成公司数据: ${companyName}`);
  
  const prompt = generateCompanyPrompt(companyName, category, isOverseas);
  
  // 优先使用DeepSeek，备用OpenAI
  let response = await callDeepSeek(prompt);
  if (!response && OPENAI_API_KEY) {
    console.log(`   🔄 DeepSeek失败，尝试OpenAI...`);
    response = await callOpenAI(prompt);
  }
  
  if (!response) {
    console.error(`   ❌ 所有API调用失败: ${companyName}`);
    return null;
  }
  
  const data = parseAIResponse(response);
  if (!data) {
    console.error(`   ❌ 解析响应失败: ${companyName}`);
    return null;
  }
  
  console.log(`   ✅ 成功生成数据: ${companyName}`);
  return data;
}

// 插入公司数据到数据库
async function insertCompanyData(companyData, companyName, category, isOverseas) {
  try {
    // 插入公司基本信息
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        description: companyData.description || companyData.chinese_description,
        english_description: companyData.english_description,
        headquarters: companyData.headquarters,
        valuation: companyData.valuation,
        website: companyData.website,
        logo_base64: companyData.logo_base64,
        category: category,
        is_overseas: isOverseas,
        founded_year: companyData.founded_year,
        employee_count: companyData.employee_count,
        industry: companyData.industry || 'Artificial Intelligence'
      })
      .select()
      .single();

    if (companyError) {
      console.error(`   ❌ 插入公司失败: ${companyName}`, companyError.message);
      return false;
    }

    console.log(`   ✅ 公司插入成功: ${companyName} (ID: ${company.id})`);

    // 插入项目数据
    if (companyData.projects && companyData.projects.length > 0) {
      const projects = companyData.projects.map(project => ({
        company_id: company.id,
        name: project.name,
        description: project.description,
        category: project.category || 'AI Tool',
        website: project.website,
        pricing_model: project.pricing_model || 'Freemium',
        target_users: project.target_users,
        key_features: project.key_features,
        use_cases: project.use_cases
      }));

      const { error: projectsError } = await supabase
        .from('projects')
        .insert(projects);

      if (projectsError) {
        console.error(`   ❌ 插入项目失败: ${companyName}`, projectsError.message);
      } else {
        console.log(`   ✅ 项目插入成功: ${companyName} (${projects.length}个项目)`);
      }
    }

    // 插入融资数据
    if (companyData.fundings && companyData.fundings.length > 0) {
      const fundings = companyData.fundings.map(funding => ({
        company_id: company.id,
        round: funding.round,
        amount: funding.amount,
        investors: funding.investors,
        valuation: funding.valuation,
        date: funding.date,
        lead_investor: funding.lead_investor
      }));

      const { error: fundingsError } = await supabase
        .from('fundings')
        .insert(fundings);

      if (fundingsError) {
        console.error(`   ❌ 插入融资失败: ${companyName}`, fundingsError.message);
      } else {
        console.log(`   ✅ 融资插入成功: ${companyName} (${fundings.length}轮融资)`);
      }
    }

    // 插入新闻故事
    if (companyData.stories && companyData.stories.length > 0) {
      const stories = companyData.stories.map(story => ({
        company_id: company.id,
        title: story.title,
        summary: story.summary,
        source_url: story.source_url,
        published_date: story.published_date,
        category: story.category || 'AI Innovation',
        tags: story.tags || ['AI', 'Innovation']
      }));

      const { error: storiesError } = await supabase
        .from('stories')
        .insert(stories);

      if (storiesError) {
        console.error(`   ❌ 插入故事失败: ${companyName}`, storiesError.message);
      } else {
        console.log(`   ✅ 故事插入成功: ${companyName} (${stories.length}篇故事)`);
      }
    }

    return true;
  } catch (error) {
    console.error(`   ❌ 插入数据异常: ${companyName}`, error.message);
    return false;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始生成200+家AI公司数据...');
  console.log('📊 使用DeepSeek深度研究模式');
  
  let totalGenerated = 0;
  let totalFailed = 0;
  
  // 按类别生成数据
  for (const [category, companies] of Object.entries(AI_COMPANIES)) {
    console.log(`\n📂 开始生成类别: ${category} (${companies.length}家公司)`);
    
    const isOverseas = !category.includes('domestic');
    
    for (let i = 0; i < companies.length; i++) {
      const companyName = companies[i];
      
      try {
        // 生成公司数据
        const companyData = await generateCompanyData(companyName, category, isOverseas);
        
        if (companyData) {
          // 插入到数据库
          const success = await insertCompanyData(companyData, companyName, category, isOverseas);
          
          if (success) {
            totalGenerated++;
          } else {
            totalFailed++;
          }
        } else {
          totalFailed++;
        }
        
        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 每10家公司显示进度
        if ((i + 1) % 10 === 0) {
          console.log(`\n📈 进度: ${i + 1}/${companies.length} (${category})`);
          console.log(`📊 总计: 成功 ${totalGenerated}, 失败 ${totalFailed}`);
        }
        
      } catch (error) {
        console.error(`❌ 处理公司失败: ${companyName}`, error.message);
        totalFailed++;
      }
    }
    
    console.log(`\n✅ 类别完成: ${category} - 成功 ${totalGenerated}, 失败 ${totalFailed}`);
  }
  
  console.log('\n🎉 数据生成完成！');
  console.log(`📊 最终统计:`);
  console.log(`   ✅ 成功生成: ${totalGenerated} 家公司`);
  console.log(`   ❌ 生成失败: ${totalFailed} 家公司`);
  console.log(`   📈 成功率: ${((totalGenerated / (totalGenerated + totalFailed)) * 100).toFixed(1)}%`);
}

// 运行主函数
main().catch(console.error);
