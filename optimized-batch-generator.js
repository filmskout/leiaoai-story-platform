#!/usr/bin/env node

import https from 'https';
import fs from 'fs';

// Configuration
const ADMIN_TOKEN = 'R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const API_BASE_URL = 'https://leiao.ai/api/unified';

// Optimized company list for batch processing
const COMPANY_BATCHES = [
  // Batch 1: Tech Giants (5 companies)
  [
    'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Apple AI'
  ],
  // Batch 2: AI Unicorns (5 companies)  
  [
    'Anthropic', 'Stability AI', 'Midjourney', 'Character.AI', 'Hugging Face'
  ],
  // Batch 3: Enterprise AI (5 companies)
  [
    'Palantir', 'C3.ai', 'DataRobot', 'H2O.ai', 'Dataiku'
  ],
  // Batch 4: AI Tools (5 companies)
  [
    'Jasper AI', 'Copy.ai', 'Grammarly', 'Notion AI', 'Canva AI'
  ],
  // Batch 5: Chinese AI Giants (5 companies)
  [
    '百度AI', '腾讯云AI', '阿里巴巴AI', '字节跳动AI', '商汤科技'
  ],
  // Batch 6: AI Infrastructure (5 companies)
  [
    'NVIDIA', 'AMD', 'Intel AI', 'IBM Watson', 'Oracle AI'
  ],
  // Batch 7: AI Applications (5 companies)
  [
    'Tesla AI', 'Waymo', 'Cruise', 'Argo AI', 'Zoox'
  ],
  // Batch 8: AI Research (5 companies)
  [
    'DeepMind', 'OpenAI Research', 'Anthropic Research', 'Cohere', 'AI21 Labs'
  ]
];

// Token-optimized prompts
const PROMPTS = {
  companyDetails: `Generate comprehensive company data for these AI companies: {COMPANIES}

For each company, provide:
1. Basic Info: name, description (50 words), detailed_description (400-600 words), website, founded_year, headquarters, employee_count_range, valuation_usd
2. Industry Tags: 5-8 relevant tags
3. Projects: 3-5 key AI products/projects with name, description, url, category, project_type, pricing_model, target_audience, technology_stack, use_cases, integrations, documentation_url, github_url, demo_url, pricing_url, launch_date, status
4. Fundings: 2-3 funding rounds with round, amount_usd, investors, announced_on
5. Stories: 2-3 news stories with title, content (200-300 words), source_url, published_at

Format as JSON array with this structure:
[
  {
    "name": "Company Name",
    "description": "Brief description",
    "detailed_description": "Comprehensive description",
    "website": "https://company.com",
    "founded_year": 2020,
    "headquarters": "City, Country",
    "employee_count_range": "100-500",
    "valuation_usd": 1000000000,
    "industry_tags": ["AI", "Machine Learning"],
    "projects": [
      {
        "name": "Product Name",
        "description": "Product description",
        "url": "https://product.com",
        "category": "AI Product",
        "project_type": "SaaS",
        "pricing_model": "Freemium",
        "target_audience": "Developers",
        "technology_stack": ["Python", "TensorFlow"],
        "use_cases": ["Text Generation", "Code Completion"],
        "integrations": ["API", "SDK"],
        "documentation_url": "https://docs.com",
        "github_url": "https://github.com",
        "demo_url": "https://demo.com",
        "pricing_url": "https://pricing.com",
        "launch_date": "2023-01-01",
        "status": "Active"
      }
    ],
    "fundings": [
      {
        "round": "Series A",
        "amount_usd": 50000000,
        "investors": ["VC Firm"],
        "announced_on": "2023-01-01"
      }
    ],
    "stories": [
      {
        "title": "News Title",
        "content": "News content...",
        "source_url": "https://news.com",
        "published_at": "2023-01-01"
      }
    ]
  }
]`,

  logoSearch: `Generate search keywords for company logos for these companies: {COMPANIES}

For each company, provide 3-5 specific search terms that would find their official logo.
Format as JSON:
[
  {
    "company": "Company Name",
    "search_terms": ["company name logo", "company official logo", "company brand logo"]
  }
]`
};

// API call functions
async function callDeepSeek(prompt, companies) {
  return new Promise((resolve, reject) => {
    const formattedPrompt = prompt.replace('{COMPANIES}', companies.join(', '));
    
    const postData = JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert AI industry analyst. Provide accurate, detailed information about AI companies, their products, funding, and recent news. Always respond with valid JSON."
        },
        {
          role: "user", 
          content: formattedPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const options = {
      hostname: 'api.deepseek.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 120000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.choices && response.choices[0]) {
            resolve(response.choices[0].message.content);
          } else {
            reject(new Error('Invalid response format'));
          }
        } catch (error) {
          reject(new Error(`JSON parse error: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.setTimeout(120000);
    req.write(postData);
    req.end();
  });
}

async function callOpenAI(prompt, companies) {
  return new Promise((resolve, reject) => {
    const formattedPrompt = prompt.replace('{COMPANIES}', companies.join(', '));
    
    const postData = JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert AI industry analyst. Provide accurate, detailed information about AI companies, their products, funding, and recent news. Always respond with valid JSON."
        },
        {
          role: "user",
          content: formattedPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 120000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.choices && response.choices[0]) {
            resolve(response.choices[0].message.content);
          } else {
            reject(new Error('Invalid response format'));
          }
        } catch (error) {
          reject(new Error(`JSON parse error: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.setTimeout(120000);
    req.write(postData);
    req.end();
  });
}

function cleanJSONContent(content) {
  // Remove any non-JSON text before the actual JSON
  const jsonStart = content.indexOf('[');
  const jsonEnd = content.lastIndexOf(']') + 1;
  
  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    return content.substring(jsonStart, jsonEnd);
  }
  
  return content;
}

async function insertCompanyData(companyData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      action: 'insert-company-data',
      adminToken: ADMIN_TOKEN,
      companyData: companyData
    });

    const options = {
      hostname: 'leiao.ai',
      port: 443,
      path: '/api/unified',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error(`Response parse error: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.setTimeout(30000);
    req.write(postData);
    req.end();
  });
}

async function checkProgress() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'leiao.ai',
      port: 443,
      path: '/api/unified?action=data-progress',
      method: 'GET',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error(`Progress check error: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Progress check timeout')));
    req.setTimeout(10000);
    req.end();
  });
}

// Main execution
async function main() {
  console.log('🚀 Starting optimized batch generation...');
  console.log(`📊 Total batches: ${COMPANY_BATCHES.length}`);
  console.log(`🔑 DeepSeek API Key: ${DEEPSEEK_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔑 OpenAI API Key: ${OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  
  if (!DEEPSEEK_API_KEY && !OPENAI_API_KEY) {
    console.error('❌ No API keys configured!');
    process.exit(1);
  }

  let totalGenerated = 0;
  const logFile = 'optimized-generation-log.txt';
  
  // Clear previous log
  fs.writeFileSync(logFile, `🚀 Optimized Batch Generation Started: ${new Date().toISOString()}\n\n`);

  for (let batchIndex = 0; batchIndex < COMPANY_BATCHES.length; batchIndex++) {
    const companies = COMPANY_BATCHES[batchIndex];
    console.log(`\n📦 Processing Batch ${batchIndex + 1}/${COMPANY_BATCHES.length}: ${companies.join(', ')}`);
    
    try {
      // Generate company data
      let companyData;
      try {
        console.log('🤖 Calling DeepSeek API...');
        const response = await callDeepSeek(PROMPTS.companyDetails, companies);
        const cleanedResponse = cleanJSONContent(response);
        companyData = JSON.parse(cleanedResponse);
        console.log(`✅ DeepSeek response: ${companyData.length} companies`);
      } catch (deepseekError) {
        console.log(`⚠️ DeepSeek failed: ${deepseekError.message}`);
        if (OPENAI_API_KEY) {
          console.log('🔄 Falling back to OpenAI...');
          const response = await callOpenAI(PROMPTS.companyDetails, companies);
          const cleanedResponse = cleanJSONContent(response);
          companyData = JSON.parse(cleanedResponse);
          console.log(`✅ OpenAI response: ${companyData.length} companies`);
        } else {
          throw deepseekError;
        }
      }

      // Insert each company
      for (const company of companyData) {
        try {
          console.log(`📝 Inserting ${company.name}...`);
          const result = await insertCompanyData(company);
          if (result.success) {
            console.log(`✅ ${company.name} inserted successfully`);
            totalGenerated++;
          } else {
            console.log(`⚠️ ${company.name} insertion failed: ${result.message}`);
          }
        } catch (error) {
          console.log(`❌ ${company.name} insertion error: ${error.message}`);
        }
      }

      // Log progress
      const logEntry = `Batch ${batchIndex + 1}: ${companies.join(', ')} - Generated: ${companyData.length} companies\n`;
      fs.appendFileSync(logFile, logEntry);

      // Check overall progress
      const progress = await checkProgress();
      console.log(`📊 Progress: ${progress.data.companies.total} companies, ${progress.data.projects} projects, ${progress.data.fundings} fundings, ${progress.data.stories} stories`);

      // Rate limiting
      console.log('⏳ Waiting 5 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
      console.error(`❌ Batch ${batchIndex + 1} failed: ${error.message}`);
      const errorEntry = `Batch ${batchIndex + 1} ERROR: ${error.message}\n`;
      fs.appendFileSync(logFile, errorEntry);
    }
  }

  console.log(`\n🎉 Generation completed! Total companies generated: ${totalGenerated}`);
  console.log(`📝 Full log saved to: ${logFile}`);
  
  // Final progress check
  const finalProgress = await checkProgress();
  console.log('\n📊 Final Progress Report:');
  console.log(`Companies: ${finalProgress.data.companies.total}`);
  console.log(`Projects: ${finalProgress.data.projects}`);
  console.log(`Fundings: ${finalProgress.data.fundings}`);
  console.log(`Stories: ${finalProgress.data.stories}`);
}

// Run the script
main().catch(console.error);
