import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const qwenApiKey = process.env.QWEN_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function callQwen(prompt, language = 'zh') {
  const endpoint = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${qwenApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen-turbo-latest',
      messages: [
        { role: 'system', content: '你是一个专业的AI研究助手，提供准确、结构化的公司信息。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 3000
    })
  });
  
  if (!response.ok) {
    throw new Error(`Qwen API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function enrichCompanyData(company) {
  console.log(`\n🔍 正在研究: ${company.name}`);
  
  const prompt = `深度研究AI公司"${company.name}"，返回JSON格式：
{
  "website": "公司官网URL，必须真实",
  "description": "公司简介（100字内，中文，突出核心业务）",
  "detailed_description": "详细描述（400+字，中文，包含技术特色、主要产品、市场定位、竞争优势）",
  "headquarters": "总部地址（格式：城市, 国家，海外用英文，国内用中文）",
  "founded_year": 成立年份（数字）,
  "employee_count": "员工规模（如：1000-5000人或10万+人）",
  "valuation": 估值数字（单位：美元，如1000000000表示$1B，如果没有则为0）,
  "industry": "所属行业（如：AI基础模型/AI应用/云服务）"
}

要求：
1. 所有信息必须基于真实公开资料
2. website必须是官方真实网站（如https://www.anthropic.com）
3. description简洁专业（100字内）
4. detailed_description详实深入（400+字以上）
5. headquarters准确到城市和国家
6. founded_year是真实成立年份
7. employee_count要符合公司规模
8. valuation要最新真实估值（单位美元）
9. 只返回JSON，不要任何其他文字

示例输出：
{
  "website": "https://www.anthropic.com",
  "description": "Anthropic是专注于AI安全的公司，开发了Claude助手，致力于构建可控、可解释的AI系统。",
  "detailed_description": "Anthropic是一家成立于2021年的AI安全公司，总部位于旧金山。公司致力于开发安全、可控、可解释的人工智能系统。其旗舰产品Claude是一个通用AI助手，在AI对话、编程辅助、文档分析等多个领域展现出强大能力。Anthropic的核心技术包括Constitutional AI（宪章AI）和federated learning（联邦学习），这些技术使得AI系统能够更好地遵循人类价值观和道德准则。公司的使命是确保AI技术的安全发展和负责任应用，为人类带来积极影响。主要投资者包括Google、Salesforce等知名企业。",
  "headquarters": "San Francisco, USA",
  "founded_year": 2021,
  "employee_count": "200-500人",
  "valuation": 15000000000,
  "industry": "AI基础模型"
}`;

  try {
    const response = await callQwen(prompt);
    const match = response.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('No valid JSON found in response');
    }
    const data = JSON.parse(match);
    return data;
  } catch (error) {
    console.error(`❌ ${company.name} 生成失败:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 开始批量补齐公司数据...\n');
  
  // 获取所有公司
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, name, website, valuation')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ 获取公司列表失败:', error);
    return;
  }
  
  console.log(`📊 找到 ${companies.length} 家公司`);
  
  const results = { success: 0, failed: 0, skipped: 0 };
  
  for (const company of companies) {
    // 跳过已有完整数据的公司
    if (company.website && company.valuation) {
      console.log(`⏭️  跳过: ${company.name}（数据已完整）`);
      results.skipped++;
      continue;
    }
    
    const enriched = await enrichCompanyData(company);
    
    if (!enriched) {
      results.failed++;
      continue;
    }
    
    // 更新数据库
    const { error: updateError } = await supabase
      .from('companies')
      .update({
        website: enriched.website,
        description: enriched.description,
        detailed_description: enriched.detailed_description,
        headquarters: enriched.headquarters,
        founded_year: enriched.founded_year,
        employee_count: enriched.employee_count,
        valuation: enriched.valuation,
        industry: enriched.industry
      })
      .eq('id', company.id);
    
    if (updateError) {
      console.error(`❌ ${company.name} 更新失败:`, updateError.message);
      results.failed++;
    } else {
      console.log(`✅ ${company.name} 已更新`);
      results.success++;
    }
    
    // 每处理一家后等待1秒，避免API限流
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 处理完成:');
  console.log(`✅ 成功: ${results.success}`);
  console.log(`❌ 失败: ${results.failed}`);
  console.log(`⏭️  跳过: ${results.skipped}`);
}

main().catch(console.error);

