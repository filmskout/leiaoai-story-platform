#!/usr/bin/env node
/**
 * Generate foundation data for companies missing founded_year or headquarters
 * Uses OpenAI API to fetch accurate data
 */

import fs from 'fs';
import 'dotenv/config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_VERCEL_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o';

// Function to call OpenAI API
async function getFoundationData(companyName) {
  const prompt = `You are a database expert. For the AI company "${companyName}", provide accurate founding year and headquarters location.

Format your response as JSON:
{
  "founded_year": YYYY,
  "headquarters": "City, State/Province, Country"
}

Requirements:
- Use real data only, based on publicly available information
- Founded year should be an integer (e.g., 2015, 2012)
- Headquarters format: "City, State, Country" for US (e.g., "San Francisco, California, USA"), "City, Country" for others (e.g., "London, United Kingdom")
- For Chinese companies, use "City, China" (e.g., "Beijing, China")
- For open source projects, indicate "(Open Source)" after the organization
- Use English format for all locations

Company: ${companyName}`;

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that provides accurate data in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ API error for ${companyName}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Extract JSON from code blocks if present
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*({[\s\S]*})\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const result = JSON.parse(jsonStr);
    return result;
  } catch (error) {
    console.error(`❌ Error for ${companyName}:`, error.message);
    return null;
  }
}

// Read existing SQL file to get all company names
const companies = [
  '01.AI', 'Adept AI', 'Adobe', 'AgentGPT', 'Aleph Alpha', 'Alibaba Cloud AI',
  'Amazon AI', 'Anthropic', 'Apple AI', 'Argo AI', 'Aurora', 'AutoGPT',
  'Baidu AI', 'Banana', 'Beautiful.ai', 'Brev.dev', 'ByteDance AI', 'Cerebras',
  'Character.AI', 'Chroma', 'Civitai', 'ClearML', 'CloudWalk', 'Codeium',
  'Cohere', 'Comet ML', 'ComfyUI', 'Copy.ai', 'Cruise', 'Cursor',
  'DeepSeek', 'Descript', 'Determined AI', 'Determined AI Platform', 'DiDi AI',
  'ElevenLabs', 'GitHub Copilot', 'Glean', 'Google DeepMind', 'Gradio',
  'Grammarly', 'Haystack', 'Haystack AutoGPT', 'Hugging Face', 'IBM Watson',
  'Invoke AI', 'JAX', 'JD AI', 'Jasper', 'Kaggle', 'Kaimu AI', 'Kuaibo AI',
  'Kuaishou AI', 'Labelbox', 'LangChain', 'LangFlow', 'LangSmith', 'Lightning AI',
  'LlamaIndex', 'Loom', 'Megvii', 'Meituan AI', 'Meta AI', 'Microsoft AI',
  'Midjourney', 'Milvus', 'MiniMax', 'Modal', 'Mojo AI', 'Moonshot AI',
  'Moveworks', 'NVIDIA', 'Neptune', 'Notion', 'Notion AI', 'OpenAI',
  'OpenAI Triton', 'Otter.ai', 'PDD AI', 'Perplexity AI', 'Pinecone',
  'Polyaxon', 'Pony.ai', 'PyTorch', 'Qdrant', 'Replicate', 'Replit',
  'Resemble AI', 'Runway', 'Scale AI', 'Second', 'Semantic Kernel',
  'SenseTime', 'Snorkel AI', 'Stability AI', 'Streamlit', 'SuperAnnotate',
  'Synthesia', 'Tabnine', 'Tencent AI Lab', 'Tencent Cloud AI', 'TensorFlow',
  'Tesla', 'Tesla AI', 'Vecto', 'Vercel', 'Waymo', 'Weaviate',
  'Weights & Biases', 'Yitu', 'Zapier', 'Zhipu AI', 'Zilliz', 'iFlytek'
];

async function generateMissingSQL() {
  console.log('🚀 Starting foundation data generation for missing companies...\n');
  console.log(`📊 Total companies: ${companies.length}\n`);

  const results = [];
  const errors = [];

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    console.log(`[${i + 1}/${companies.length}] Processing: ${company}`);
    
    const data = await getFoundationData(company);
    
    if (data && data.founded_year && data.headquarters) {
      results.push({ company, ...data });
      console.log(`  ✅ ${company}: ${data.founded_year}, ${data.headquarters}`);
    } else {
      errors.push(company);
      console.log(`  ⚠️  ${company}: Failed to get data`);
    }

    // Rate limiting: wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Results: ${results.length}/${companies.length} companies processed\n`);
  console.log(`⚠️  Errors: ${errors.length} companies failed\n`);

  // Generate SQL file
  const sqlContent = `-- Complete foundation data for all ${companies.length} companies
-- Generated: ${new Date().toISOString()}
-- Successfully processed: ${results.length}

BEGIN;

${results.map(r => `UPDATE companies SET 
  founded_year = COALESCE(founded_year, ${r.founded_year}),
  headquarters = COALESCE(headquarters, '${r.headquarters.replace(/'/g, "''")}')
WHERE name = '${r.company.replace(/'/g, "''")}';

`).join('')}

COMMIT;

-- Verification query
SELECT 
    COUNT(*) as total_companies,
    COUNT(founded_year) as with_founded_year,
    COUNT(headquarters) as with_headquarters,
    ROUND(COUNT(founded_year)::numeric / COUNT(*) * 100, 2) as founded_year_pct,
    ROUND(COUNT(headquarters)::numeric / COUNT(*) * 100, 2) as headquarters_pct
FROM companies;

${errors.length > 0 ? `\n-- ⚠️  Companies that failed to fetch data:\n-- ${errors.join(', ')}\n` : ''}
`;

  fs.writeFileSync('COMPLETE-MISSING-FOUNDATION-LLM.sql', sqlContent);
  console.log('✅ Generated: COMPLETE-MISSING-FOUNDATION-LLM.sql');
  
  // Write summary file
  const summary = `# Foundation Data Completion Summary

Generated: ${new Date().toISOString()}
Total companies: ${companies.length}
Successfully processed: ${results.length}
Success rate: ${(results.length / companies.length * 100).toFixed(1)}%

${errors.length > 0 ? `## Companies that failed: ${errors.join(', ')}` : ''}

## Sample of completed companies:
${results.slice(0, 20).map(r => `- ${r.company}: ${r.founded_year}, ${r.headquarters}`).join('\n')}
`;
  
  fs.writeFileSync('FOUNDATION-SUMMARY.md', summary);
  console.log('✅ Generated: FOUNDATION-SUMMARY.md');
}

if (!OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY not found');
  console.log('Please set OPENAI_API_KEY or VERCEL_OPENAI_API_KEY in your environment');
  process.exit(1);
}

generateMissingSQL().catch(console.error);

