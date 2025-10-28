import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Use environment variables or defaults
const supabaseUrl = 'https://bfrsiwvzelbfqbuvlahc.supabase.co';
// Use service role key for server-side operations
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcnNpd3Z6ZWxiZnFidXZzYWxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDQwOTcwNywiZXhwIjoyMDQ5OTg1NzA3fQ.QKCtKfE8pP2M0hQb0uQeE-kLOH_JVk0zF7GqzxVXW_c';
const deepseekApiKey = 'sk-55e94a8cacc041e29b3d43310575e2dd';

const supabase = createClient(supabaseUrl, supabaseKey);

// DeepSeek API Configuration
const QWEN_API_KEY = deepseekApiKey;
const QWEN_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';

async function callQwen(prompt, systemPrompt = '') {
  try {
    console.log('📡 Calling Qwen API...');
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt || 'You are a helpful AI assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ Qwen API call failed:', error);
    throw error;
  }
}

async function generateBilingualDescription(company) {
  const prompt = `请为AI公司"${company.name}"生成详细的中文和英文描述。

要求：
1. 中文描述：100字内简洁版 + 400字以上详细版
2. 英文描述：100字内简洁版 + 400字以上详细版
3. 包括：公司业务、核心技术、主要产品、市场地位、融资情况等
4. 必须基于真实公开资料

返回JSON格式：
{
  "description_zh": "中文简洁描述（100字内）",
  "detailed_description_zh": "中文详细描述（400字以上）",
  "description_en": "English brief description (within 100 words)",
  "detailed_description_en": "English detailed description (400+ words)",
  "headquarters": "总部城市, 国家",
  "founded_year": 年份,
  "employee_count": "员工规模",
  "website": "官网URL"
}

只返回JSON，不要其他文字。`;

  try {
    const response = await callQwen(prompt);
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in response');
      return null;
    }
    
    const data = JSON.parse(jsonMatch[0]);
    return data;
  } catch (error) {
    console.error('❌ Failed to generate description:', error);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting bilingual description generation...\n');

  // Fetch all companies
  console.log('📊 Fetching companies from database...');
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, name, description, detailed_description')
    .order('name');

  if (error) {
    console.error('❌ Error fetching companies:', error);
    return;
  }

  if (!companies || companies.length === 0) {
    console.log('❌ No companies found in database');
    return;
  }

  console.log(`✅ Found ${companies.length} companies\n`);

  let sql = '-- Bilingual descriptions for ALL companies\n';
  sql += '-- Generated using LLM\n\n';
  sql += 'BEGIN;\n\n';

  let successCount = 0;
  let failCount = 0;

  // Process companies in batches
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    
    console.log(`\n[${i + 1}/${companies.length}] Processing: ${company.name}`);
    
    try {
      const data = await generateBilingualDescription(company);
      
      if (!data) {
        console.log('⚠️ Skipping due to generation failure');
        failCount++;
        continue;
      }

      // Escape single quotes for SQL
      const escapeSql = (str) => str ? str.replace(/'/g, "''") : '';

      sql += `-- ${company.name}\n`;
      sql += `UPDATE companies SET\n`;
      sql += `  description = '${escapeSql(data.description_zh)}',\n`;
      sql += `  detailed_description = '${escapeSql(data.detailed_description_zh)}',\n`;
      sql += `  headquarters = '${escapeSql(data.headquarters)}',\n`;
      sql += `  founded_year = ${data.founded_year || 'NULL'},\n`;
      sql += `  employee_count = '${escapeSql(data.employee_count)}',\n`;
      sql += `  website = '${escapeSql(data.website)}'\n`;
      sql += `WHERE id = '${company.id}';\n\n`;

      successCount++;
      console.log('✅ Generated successfully');
      
      // Add a small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to process ${company.name}:`, error);
      failCount++;
    }
  }

  sql += 'COMMIT;\n';

  // Save SQL file
  fs.writeFileSync('BILINGUAL-DESCRIPTIONS-ALL-COMPANIES.sql', sql);
  console.log('\n========================================');
  console.log(`✅ Generated SQL for ${successCount} companies`);
  console.log(`❌ Failed: ${failCount} companies`);
  console.log('\n📁 SQL saved to: BILINGUAL-DESCRIPTIONS-ALL-COMPANIES.sql');
  console.log('========================================\n');
}

main().catch(console.error);
