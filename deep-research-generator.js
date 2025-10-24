#!/usr/bin/env node

import https from 'https';
import fs from 'fs';

// Configuration
const ADMIN_TOKEN = 'R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-55e94a8cacc041e29b3d43310575e2dd';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const QWEN_API_KEY = process.env.QWEN_API_KEY;

const API_BASE_URL = 'https://leiao.ai/api/unified';

// Company categorization by tiers
const COMPANY_TIERS = {
  'Tier 1 - Tech Giants': [
    'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Apple AI', 
    'Amazon AI', 'Tesla AI', 'NVIDIA', 'IBM Watson', 'Intel AI'
  ],
  'Tier 2 - AI Unicorns': [
    'Anthropic', 'Cohere', 'Stability AI', 'Midjourney', 'Hugging Face',
    'Jasper', 'Copy.ai', 'Notion', 'Figma', 'Canva'
  ],
  'Tier 3 - Enterprise AI': [
    'Salesforce Einstein', 'Adobe AI', 'SAP AI', 'ServiceNow AI', 'Workday AI',
    'Oracle AI', 'Cisco AI', 'HubSpot', 'Intercom', 'Freshworks'
  ],
  'Tier 4 - Chinese Tech Giants': [
    '百度AI', '腾讯AI', '阿里巴巴AI', '字节跳动AI', '美团AI', '滴滴AI',
    '京东AI', '拼多多AI', '小米AI', '华为AI'
  ],
  'Tier 5 - Chinese AI Unicorns': [
    '商汤科技', '旷视科技', '依图科技', '云从科技', '第四范式', '明略科技',
    '思必驰', '科大讯飞', '海康威视', '寒武纪'
  ],
  'Tier 6 - Autonomous Driving': [
    '地平线', 'Momenta', '驭势科技', '小马智行', '文远知行', '百度Apollo',
    'Waymo', 'Cruise', 'Argo AI', 'Aurora'
  ],
  'Tier 7 - AI Tools & Applications': [
    'Grammarly', 'Zoom', 'Twilio', 'Discord', 'SendGrid', 'Pardot', 'Zendesk',
    'OPPO AI', 'vivo AI', '一加AI', 'realme AI', '魅族AI'
  ]
};

// Deep research prompts for different content types
const DEEP_RESEARCH_PROMPTS = {
  companyDetails: `You are an expert AI industry analyst conducting deep research. Provide comprehensive information about the AI company "{companyName}" in English.

REQUIRED RESEARCH AREAS (conduct thorough investigation):
1. Company Overview & Mission
2. Core AI Products & Services
3. Technology Stack & Innovation
4. Market Position & Competitors
5. Business Model & Revenue Streams
6. Key Leadership & Team
7. Funding History & Investors
8. Recent Developments & News
9. Industry Impact & Recognition
10. Future Roadmap & Vision
11. Technical Capabilities & Patents
12. Partnerships & Collaborations
13. Geographic Presence & Markets
14. Employee Count & Culture
15. Regulatory & Ethical Approach
16. Research Publications & Papers
17. Open Source Contributions
18. Customer Base & Use Cases
19. Pricing Strategy & Accessibility
20. Competitive Advantages

OUTPUT FORMAT (JSON):
{
  "name": "Exact company name",
  "description": "Concise 50-word summary of core AI focus",
  "detailed_description": "Comprehensive 400-600 word analysis covering all research areas",
  "website": "Official website URL",
  "founded_year": YYYY,
  "headquarters": "City, Country",
  "employee_count_range": "e.g., 1000-5000, 10000+",
  "valuation_usd": 1234567890,
  "industry_tags": ["tag1", "tag2", "tag3"],
  "tier": "Tier X - Category",
  "logo_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}

CONDUCT DEEP RESEARCH: Use multiple sources, verify facts, provide accurate data.`,

  tools: `You are an expert AI product analyst. Research and provide detailed information about AI tools and services offered by "{companyName}".

REQUIRED RESEARCH AREAS:
1. Primary AI Products & Platforms
2. Specific AI Tools & APIs
3. Software & Applications
4. Hardware & Infrastructure
5. Cloud Services & Platforms
6. Developer Tools & SDKs
7. Enterprise Solutions
8. Consumer Applications
9. Research Tools & Datasets
10. Open Source Projects

OUTPUT FORMAT (JSON array):
[
  {
    "name": "Tool/Product name",
    "description": "Detailed 100-150 word description",
    "url": "Official URL or documentation",
    "category": "AI Platform|AI Tool|AI Application|AI Infrastructure|AI Research|AI Hardware|AI Software|AI Service"
  }
]

RESEARCH REQUIREMENTS: Provide 3-8 tools per company, focus on actual products, include official URLs.`,

  funding: `You are an expert venture capital analyst. Research the funding history of "{companyName}".

REQUIRED RESEARCH AREAS:
1. Seed & Early Stage Funding
2. Series A, B, C, D+ Rounds
3. Strategic Investments
4. Corporate Partnerships
5. Government Grants
6. IPO Information (if applicable)
7. Acquisition Details (if applicable)
8. Current Valuation & Status

OUTPUT FORMAT (JSON array):
[
  {
    "round": "Seed|Series A|Series B|Series C|Series D|Series E|IPO|Acquisition",
    "amount_usd": 1234567890,
    "investors": ["Investor 1", "Investor 2"],
    "announced_on": "YYYY-MM-DD"
  }
]

RESEARCH REQUIREMENTS: Include 2-5 funding rounds, verify amounts and dates, list major investors.`,

  news: `You are an expert tech journalist. Research and write a comprehensive news story about recent developments at "{companyName}".

REQUIRED RESEARCH AREAS:
1. Recent Product Launches
2. Major Partnerships & Collaborations
3. Funding Announcements
4. Leadership Changes
5. Technology Breakthroughs
6. Market Expansion
7. Regulatory Developments
8. Competitive Moves
9. Industry Recognition
10. Future Announcements

OUTPUT FORMAT (JSON):
{
  "title": "Compelling news headline (80-120 characters)",
  "content": "Comprehensive 500-700 word news story with proper journalistic structure",
  "source_url": "Link to original news source or company announcement",
  "published_at": "YYYY-MM-DD"
}

WRITING REQUIREMENTS: Use journalistic style, include quotes if available, provide context and analysis, ensure accuracy.`
};

// API call function with fallback mechanism
async function makeAPICall(prompt, model = 'deepseek') {
  const models = {
    deepseek: {
      url: 'https://api.deepseek.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 4000
      }
    },
    openai: {
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 4000
      }
    },
    qwen: {
      url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: {
        model: 'qwen-max',
        input: { messages: [{ role: 'user', content: prompt }] },
        parameters: { temperature: 0.2, max_tokens: 4000 }
      }
    }
  };

  const modelConfig = models[model];
  if (!modelConfig) {
    throw new Error(`Unknown model: ${model}`);
  }

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(modelConfig.body);
    
    const options = {
      hostname: modelConfig.url.includes('deepseek.com') ? 'api.deepseek.com' : 
                modelConfig.url.includes('openai.com') ? 'api.openai.com' : 'dashscope.aliyuncs.com',
      port: 443,
      path: modelConfig.url.includes('deepseek.com') ? '/v1/chat/completions' :
            modelConfig.url.includes('openai.com') ? '/v1/chat/completions' : '/api/v1/services/aigc/text-generation/generation',
      method: 'POST',
      headers: {
        ...modelConfig.headers,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(`API Error: ${response.error.message}`));
          } else {
            const content = response.choices?.[0]?.message?.content || 
                          response.output?.text || 
                          response.result?.output?.text;
            resolve(content);
          }
        } catch (error) {
          reject(new Error(`JSON Parse Error: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Fallback mechanism: DeepSeek -> OpenAI -> Qwen
async function generateWithFallback(prompt, contentType) {
  const models = ['deepseek', 'openai', 'qwen'];
  
  for (const model of models) {
    try {
      console.log(`🔄 Trying ${model.toUpperCase()} for ${contentType}...`);
      const result = await makeAPICall(prompt, model);
      console.log(`✅ ${model.toUpperCase()} succeeded for ${contentType}`);
      return result;
    } catch (error) {
      console.log(`❌ ${model.toUpperCase()} failed for ${contentType}: ${error.message}`);
      if (model === models[models.length - 1]) {
        throw new Error(`All models failed for ${contentType}`);
      }
    }
  }
}

// Clean JSON content (remove markdown code blocks)
function cleanJSONContent(content) {
  return content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/```json/g, '')
    .trim();
}

// Generate company data
async function generateCompanyData(companyName, tier) {
  console.log(`\n🏢 Generating data for ${companyName} (${tier})`);
  
  try {
    // Generate company details
    const detailsPrompt = DEEP_RESEARCH_PROMPTS.companyDetails.replace('{companyName}', companyName);
    const detailsContent = await generateWithFallback(detailsPrompt, 'company details');
    const companyDetails = JSON.parse(cleanJSONContent(detailsContent));
    
    // Add tier information
    companyDetails.tier = tier;
    
    // Generate tools
    const toolsPrompt = DEEP_RESEARCH_PROMPTS.tools.replace('{companyName}', companyName);
    const toolsContent = await generateWithFallback(toolsPrompt, 'tools');
    const tools = JSON.parse(cleanJSONContent(toolsContent));
    
    // Generate funding
    const fundingPrompt = DEEP_RESEARCH_PROMPTS.funding.replace('{companyName}', companyName);
    const fundingContent = await generateWithFallback(fundingPrompt, 'funding');
    const funding = JSON.parse(cleanJSONContent(fundingContent));
    
    // Generate news
    const newsPrompt = DEEP_RESEARCH_PROMPTS.news.replace('{companyName}', companyName);
    const newsContent = await generateWithFallback(newsPrompt, 'news');
    const news = JSON.parse(cleanJSONContent(newsContent));
    
    return {
      company: companyDetails,
      tools,
      funding,
      news
    };
  } catch (error) {
    console.error(`❌ Failed to generate data for ${companyName}:`, error.message);
    return null;
  }
}

// Insert data into database via API
async function insertCompanyData(companyData) {
  const url = `${API_BASE_URL}?action=insert-company-data`;
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      token: ADMIN_TOKEN,
      companyData: companyData
    });
    
    const options = {
      hostname: 'leiao.ai',
      port: 443,
      path: '/api/unified?action=insert-company-data',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error(`API Response Parse Error: ${error.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Clear all existing data
async function clearAllData() {
  console.log('🧹 Clearing all existing data...');
  
  const url = `${API_BASE_URL}?action=clear-database`;
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ token: ADMIN_TOKEN });
    
    const options = {
      hostname: 'leiao.ai',
      port: 443,
      path: '/api/unified?action=clear-database',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error(`API Response Parse Error: ${error.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Main execution function
async function main() {
  console.log('🚀 Starting Deep Research AI Company Data Generation');
  console.log('📊 Target: 200+ AI Companies with Complete English Content');
  console.log('🔬 Method: Deep Research with DeepSeek -> OpenAI -> Qwen Fallback');
  
  try {
    // Step 1: Clear existing data
    console.log('\n📋 Step 1: Clearing existing data...');
    await clearAllData();
    console.log('✅ Data cleared successfully');
    
    // Step 2: Generate data by tiers
    let totalGenerated = 0;
    let totalFailed = 0;
    
    for (const [tierName, companies] of Object.entries(COMPANY_TIERS)) {
      console.log(`\n📈 Processing ${tierName}: ${companies.length} companies`);
      
      for (const companyName of companies) {
        try {
          // Generate comprehensive data
          const companyData = await generateCompanyData(companyName, tierName);
          
          if (companyData) {
            // Insert into database
            const result = await insertCompanyData(companyData);
            
            if (result.success) {
              console.log(`✅ ${companyName}: Generated and inserted successfully`);
              totalGenerated++;
            } else {
              console.log(`❌ ${companyName}: Insert failed - ${result.error}`);
              totalFailed++;
            }
          } else {
            console.log(`❌ ${companyName}: Generation failed`);
            totalFailed++;
          }
          
          // Rate limiting - wait between requests
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.error(`❌ ${companyName}: Error - ${error.message}`);
          totalFailed++;
        }
      }
      
      console.log(`📊 ${tierName} completed: ${companies.length} companies processed`);
    }
    
    // Step 3: Final summary
    console.log('\n🎉 Deep Research Generation Complete!');
    console.log(`📈 Total Companies Generated: ${totalGenerated}`);
    console.log(`❌ Total Failed: ${totalFailed}`);
    console.log(`📊 Success Rate: ${((totalGenerated / (totalGenerated + totalFailed)) * 100).toFixed(1)}%`);
    
    // Step 4: Generate summary report
    const report = {
      timestamp: new Date().toISOString(),
      totalGenerated,
      totalFailed,
      successRate: ((totalGenerated / (totalGenerated + totalFailed)) * 100).toFixed(1),
      tiers: Object.keys(COMPANY_TIERS).map(tier => ({
        name: tier,
        companies: COMPANY_TIERS[tier].length
      }))
    };
    
    fs.writeFileSync('deep-research-generation-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Report saved to: deep-research-generation-report.json');
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main, generateCompanyData, insertCompanyData, clearAllData };
