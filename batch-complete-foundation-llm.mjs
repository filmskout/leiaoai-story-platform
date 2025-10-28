#!/usr/bin/env node
/**
 * Batch complete company foundation data (founded_year, headquarters) using LLM
 * Fetches companies missing data and generates SQL updates via OpenAI/Qwen API
 */

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

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY || 'default-key';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o';

async function callOpenAI(companyName) {
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
- For Chinese companies, use "Beijing, China" or similar
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
      console.error(`❌ OpenAI API error for ${companyName}: ${response.status} ${error}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Try to extract JSON from code blocks
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*({[\s\S]*})\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const result = JSON.parse(jsonStr);
    return result;
  } catch (error) {
    console.error(`❌ Error calling OpenAI for ${companyName}:`, error.message);
    return null;
  }
}

async function generateSQLUpdates() {
  console.log('🚀 Starting batch foundation data completion using OpenAI...\n');
  console.log(`📊 Total companies: ${companies.length}\n`);

  const results = [];
  
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    console.log(`[${i + 1}/${companies.length}] Processing: ${company}`);
    
    const data = await callOpenAI(company);
    
    if (data && data.founded_year && data.headquarters) {
      results.push({ company, ...data });
      console.log(`  ✅ ${company}: ${data.founded_year}, ${data.headquarters}`);
    } else {
      console.log(`  ⚠️  ${company}: No data found or invalid response`);
    }

    // Rate limiting: wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Results: ${results.length}/${companies.length} companies processed successfully\n`);

  // Generate SQL file
  const sqlContent = `-- Batch foundation data completion (generated via LLM)
-- Generated: ${new Date().toISOString()}
-- Total companies: ${companies.length}
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

SELECT name, founded_year, headquarters 
FROM companies 
WHERE founded_year IS NOT NULL AND headquarters IS NOT NULL
ORDER BY name;
`;

  // Write SQL file
  const fs = await import('fs');
  fs.writeFileSync('COMPLETE-ALL-116-FOUNDATION-LLM.sql', sqlContent);
  console.log('✅ Generated: COMPLETE-ALL-116-FOUNDATION-LLM.sql');
  
  // Also write a summary file
  const summary = `# Foundation Data Completion Summary

Generated: ${new Date().toISOString()}
Total companies: ${companies.length}
Successfully processed: ${results.length}
Success rate: ${(results.length / companies.length * 100).toFixed(1)}%

## Companies without data:
${companies.filter(c => !results.find(r => r.company === c)).map(c => `- ${c}`).join('\n')}

## Companies with data:
${results.map(r => `- ${r.company}: ${r.founded_year}, ${r.headquarters}`).join('\n')}
`;
  
  fs.writeFileSync('FOUNDATION-COMPLETION-SUMMARY.md', summary);
  console.log('✅ Generated: FOUNDATION-COMPLETION-SUMMARY.md');
}

if (!OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY not found in environment variables');
  console.log('Please set VERCEL_OPENAI_API_KEY in your environment');
  process.exit(1);
}

generateSQLUpdates().catch(console.error);

