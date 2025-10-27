#!/usr/bin/env node

import https from 'https';
import fs from 'fs';

// Configuration
const ADMIN_TOKEN = 'R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const QWEN_API_KEY = process.env.QWEN_API_KEY;

const API_BASE_URL = 'https://leiao.ai/api/unified';

// Comprehensive company categorization by tiers
const COMPANY_TIERS = {
  'Tier 1 - Tech Giants': [
    'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Apple AI', 
    'Amazon AI', 'Tesla AI', 'NVIDIA', 'IBM Watson', 'Intel AI'
  ],
  'Tier 2 - AI Unicorns': [
    'Anthropic', 'Cohere', 'Stability AI', 'Midjourney', 'Hugging Face',
    'Jasper', 'Copy.ai', 'Notion', 'Figma', 'Canva', 'Character.AI',
    'Runway', 'Replicate', 'Together AI', 'Perplexity'
  ],
  'Tier 3 - Enterprise AI': [
    'Salesforce Einstein', 'Adobe AI', 'SAP AI', 'ServiceNow AI', 'Workday AI',
    'Oracle AI', 'Cisco AI', 'HubSpot', 'Intercom', 'Freshworks', 'Zendesk',
    'Slack', 'Microsoft Copilot', 'Google Workspace AI', 'Zoom AI'
  ],
  'Tier 4 - Chinese Tech Giants': [
    '百度AI', '腾讯AI', '阿里巴巴AI', '字节跳动AI', '美团AI', '滴滴AI',
    '京东AI', '拼多多AI', '小米AI', '华为AI', 'OPPO AI', 'vivo AI',
    '一加AI', 'realme AI', '魅族AI', '联想AI'
  ],
  'Tier 5 - Chinese AI Unicorns': [
    '商汤科技', '旷视科技', '依图科技', '云从科技', '第四范式', '明略科技',
    '思必驰', '科大讯飞', '海康威视', '寒武纪', '地平线', 'Momenta',
    '驭势科技', '小马智行', '文远知行', '百度Apollo'
  ],
  'Tier 6 - Autonomous Driving': [
    'Waymo', 'Cruise', 'Argo AI', 'Aurora', 'Tesla Autopilot', 'Mobileye',
    'NVIDIA Drive', 'Qualcomm Snapdragon Ride', 'Intel Mobileye', 'Bosch',
    'Continental', 'Magna', 'Aptiv', 'Veoneer', 'Luminar', 'Innoviz'
  ],
  'Tier 7 - AI Infrastructure': [
    'Databricks', 'Snowflake', 'Palantir', 'Scale AI', 'Labelbox', 'Weights & Biases',
    'MLflow', 'Kubeflow', 'Ray', 'Apache Spark', 'TensorFlow', 'PyTorch',
    'Hugging Face Transformers', 'LangChain', 'LlamaIndex', 'Pinecone'
  ],
  'Tier 8 - AI Applications': [
    'Grammarly', 'Zoom', 'Twilio', 'Discord', 'SendGrid', 'Pardot',
    'Loom', 'Calendly', 'Notion', 'Airtable', 'Monday.com', 'Asana',
    'Trello', 'Miro', 'Figma', 'Canva', 'Adobe Creative Suite', 'Framer'
  ],
  'Tier 9 - AI Research Labs': [
    'DeepMind', 'OpenAI Research', 'Anthropic Research', 'Google Research',
    'Microsoft Research', 'Meta AI Research', 'Apple Machine Learning',
    'Amazon Science', 'IBM Research', 'Intel AI Lab', 'NVIDIA Research',
    'Stanford AI Lab', 'MIT CSAIL', 'CMU AI', 'Berkeley AI Research'
  ],
  'Tier 10 - AI Hardware': [
    'NVIDIA', 'AMD', 'Intel', 'Qualcomm', 'Apple Silicon', 'Google TPU',
    'Tesla Dojo', 'Cerebras', 'Graphcore', 'SambaNova', 'Groq',
    'Mythic', 'Syntiant', 'Hailo', 'Kneron', 'Horizon Robotics'
  ]
};

// Enhanced deep research prompts
const ENHANCED_PROMPTS = {
  companyDetails: `You are an expert AI industry analyst conducting comprehensive deep research. Provide detailed information about the AI company "{companyName}" in English.

REQUIRED RESEARCH AREAS (conduct thorough investigation):
1. Company Overview & Mission Statement
2. Core AI Products & Services Portfolio
3. Technology Stack & Innovation Capabilities
4. Market Position & Competitive Landscape
5. Business Model & Revenue Streams
6. Key Leadership & Founding Team
7. Funding History & Major Investors
8. Recent Developments & Strategic Moves
9. Industry Impact & Recognition
10. Future Roadmap & Vision
11. Technical Capabilities & Patents
12. Strategic Partnerships & Collaborations
13. Geographic Presence & Market Reach
14. Employee Count & Company Culture
15. Regulatory & Ethical Approach
16. Research Publications & Academic Contributions
17. Open Source Contributions & Community
18. Customer Base & Use Cases
19. Pricing Strategy & Market Accessibility
20. Competitive Advantages & Differentiators

OUTPUT FORMAT (JSON):
{
  "name": "Exact company name",
  "description": "Concise 60-word summary of core AI focus and market position",
  "detailed_description": "Comprehensive 500-700 word analysis covering all research areas",
  "website": "Official website URL",
  "founded_year": YYYY,
  "headquarters": "City, Country",
  "employee_count_range": "e.g., 1000-5000, 10000+",
  "valuation_usd": 1234567890,
  "industry_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "tier": "Tier X - Category",
  "company_type": "AI Company|Tech Giant|Startup|Research Lab",
  "business_model": ["B2B", "B2C", "Enterprise", "Freemium"],
  "key_technologies": ["LLM", "Computer Vision", "NLP", "Robotics"],
  "market_focus": ["Enterprise", "Consumer", "Developer", "Research"],
  "geographic_presence": ["North America", "Europe", "Asia", "Global"],
  "partnerships": ["Microsoft", "Google", "Amazon"],
  "awards": ["Industry Award 1", "Recognition 2"],
  "research_papers": 25,
  "patents": 150,
  "open_source_projects": 12,
  "last_funding_date": "2023-05-15",
  "last_product_launch": "2024-01-20",
  "logo_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}

CONDUCT DEEP RESEARCH: Use multiple sources, verify facts, provide accurate data with specific numbers and dates.`,

  projects: `You are an expert AI product analyst. Research and provide comprehensive information about AI projects, products, and services offered by "{companyName}".

REQUIRED RESEARCH AREAS:
1. Primary AI Products & Platforms
2. Specific AI Tools & Applications
3. Software & Development Platforms
4. Hardware & Infrastructure Solutions
5. Cloud Services & APIs
6. Developer Tools & SDKs
7. Enterprise Solutions & Services
8. Consumer Applications & Services
9. Research Tools & Datasets
10. Open Source Projects & Libraries

OUTPUT FORMAT (JSON array):
[
  {
    "name": "Project/Product name",
    "description": "Detailed 150-200 word description including features and capabilities",
    "url": "Official URL or documentation",
    "category": "AI Product|AI Platform|AI Service|AI Research|AI Infrastructure|AI Application",
    "project_type": "AI Product|AI Platform|AI Service|AI Research|AI Infrastructure",
    "launch_date": "YYYY-MM-DD",
    "status": "Active|Beta|Discontinued|Planned",
    "pricing_model": "Free|Freemium|Subscription|Enterprise|API-based",
    "target_audience": ["Developers", "Enterprises", "Consumers", "Researchers"],
    "technology_stack": ["Machine Learning", "Deep Learning", "NLP", "Computer Vision"],
    "use_cases": ["Content Generation", "Automation", "Analysis", "Prediction"],
    "integrations": ["REST API", "Python SDK", "JavaScript SDK", "Third-party services"],
    "documentation_url": "https://docs.example.com",
    "github_url": "https://github.com/company/project",
    "demo_url": "https://demo.example.com",
    "pricing_url": "https://pricing.example.com"
  }
]

RESEARCH REQUIREMENTS: Provide 5-12 projects per company, focus on actual products with real URLs and detailed information.`,

  funding: `You are an expert venture capital analyst. Research the comprehensive funding history of "{companyName}".

REQUIRED RESEARCH AREAS:
1. Seed & Early Stage Funding Rounds
2. Series A, B, C, D, E+ Funding Rounds
3. Strategic Investments & Corporate Partnerships
4. Government Grants & Research Funding
5. IPO Information & Public Market Data
6. Acquisition Details & Exit Information
7. Current Valuation & Market Cap
8. Major Investors & Board Members

OUTPUT FORMAT (JSON array):
[
  {
    "round": "Seed|Series A|Series B|Series C|Series D|Series E|IPO|Acquisition",
    "amount_usd": 1234567890,
    "investors": ["Investor 1", "Investor 2", "Investor 3"],
    "announced_on": "YYYY-MM-DD",
    "valuation_usd": 12345678900,
    "lead_investor": "Primary Investor Name",
    "use_of_funds": "Product development, market expansion, hiring"
  }
]

RESEARCH REQUIREMENTS: Include 3-8 funding rounds, verify amounts and dates, list major investors with specific details.`,

  news: `You are an expert tech journalist. Research and write a comprehensive news story about recent developments at "{companyName}".

REQUIRED RESEARCH AREAS:
1. Recent Product Launches & Updates
2. Major Partnerships & Strategic Collaborations
3. Funding Announcements & Investment News
4. Leadership Changes & Executive Moves
5. Technology Breakthroughs & Innovations
6. Market Expansion & Geographic Growth
7. Regulatory Developments & Compliance
8. Competitive Moves & Market Positioning
9. Industry Recognition & Awards
10. Future Announcements & Roadmap Updates

OUTPUT FORMAT (JSON):
{
  "title": "Compelling news headline (90-130 characters)",
  "content": "Comprehensive 600-800 word news story with proper journalistic structure, including quotes, context, and analysis",
  "source_url": "Link to original news source or company announcement",
  "published_at": "YYYY-MM-DD",
  "story_type": "Company News|Product Launch|Funding|Partnership|Research|Industry Analysis",
  "sentiment": "Positive|Negative|Neutral",
  "impact_score": 8,
  "tags": ["AI", "Funding", "Product", "Partnership", "Innovation"],
  "author": "Journalist Name",
  "word_count": 750,
  "reading_time": 3
}

WRITING REQUIREMENTS: Use professional journalistic style, include relevant quotes if available, provide context and industry analysis, ensure accuracy and timeliness.`
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
        max_tokens: 5000
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
        max_tokens: 5000
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
        parameters: { temperature: 0.2, max_tokens: 5000 }
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

// Generate comprehensive company data
async function generateCompanyData(companyName, tier) {
  console.log(`\n🏢 Generating comprehensive data for ${companyName} (${tier})`);
  
  try {
    // Generate company details
    const detailsPrompt = ENHANCED_PROMPTS.companyDetails.replace('{companyName}', companyName);
    const detailsContent = await generateWithFallback(detailsPrompt, 'company details');
    const companyDetails = JSON.parse(cleanJSONContent(detailsContent));
    
    // Add tier information
    companyDetails.tier = tier;
    
    // Generate projects
    const projectsPrompt = ENHANCED_PROMPTS.projects.replace('{companyName}', companyName);
    const projectsContent = await generateWithFallback(projectsPrompt, 'projects');
    const projects = JSON.parse(cleanJSONContent(projectsContent));
    
    // Generate funding
    const fundingPrompt = ENHANCED_PROMPTS.funding.replace('{companyName}', companyName);
    const fundingContent = await generateWithFallback(fundingPrompt, 'funding');
    const funding = JSON.parse(cleanJSONContent(fundingContent));
    
    // Generate news
    const newsPrompt = ENHANCED_PROMPTS.news.replace('{companyName}', companyName);
    const newsContent = await generateWithFallback(newsPrompt, 'news');
    const news = JSON.parse(cleanJSONContent(newsContent));
    
    return {
      company: companyDetails,
      projects,
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
    const postData = JSON.stringify({ token: ADMIN_TOKEN, forceClear: true });
    
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
  console.log('🚀 Starting Enhanced Deep Research AI Company Data Generation');
  console.log('📊 Target: 200+ AI Companies with Comprehensive English Content');
  console.log('🔬 Method: Enhanced Deep Research with DeepSeek -> OpenAI -> Qwen Fallback');
  console.log('📈 Structure: Projects instead of Tools, Enhanced Stories, Complete Data');
  
  try {
    // Step 1: Clear existing data
    console.log('\n📋 Step 1: Clearing existing data...');
    await clearAllData();
    console.log('✅ Data cleared successfully');
    
    // Step 2: Generate data by tiers
    let totalGenerated = 0;
    let totalFailed = 0;
    let totalProjects = 0;
    let totalFunding = 0;
    let totalStories = 0;
    
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
              console.log(`   📊 Projects: ${companyData.projects?.length || 0}`);
              console.log(`   💰 Funding: ${companyData.funding?.length || 0}`);
              console.log(`   📰 Stories: ${companyData.news ? 1 : 0}`);
              
              totalGenerated++;
              totalProjects += companyData.projects?.length || 0;
              totalFunding += companyData.funding?.length || 0;
              totalStories += companyData.news ? 1 : 0;
            } else {
              console.log(`❌ ${companyName}: Insert failed - ${result.error}`);
              totalFailed++;
            }
          } else {
            console.log(`❌ ${companyName}: Generation failed`);
            totalFailed++;
          }
          
          // Rate limiting - wait between requests
          await new Promise(resolve => setTimeout(resolve, 3000));
          
        } catch (error) {
          console.error(`❌ ${companyName}: Error - ${error.message}`);
          totalFailed++;
        }
      }
      
      console.log(`📊 ${tierName} completed: ${companies.length} companies processed`);
    }
    
    // Step 3: Final summary
    console.log('\n🎉 Enhanced Deep Research Generation Complete!');
    console.log(`📈 Total Companies Generated: ${totalGenerated}`);
    console.log(`📊 Total Projects Generated: ${totalProjects}`);
    console.log(`💰 Total Funding Records: ${totalFunding}`);
    console.log(`📰 Total News Stories: ${totalStories}`);
    console.log(`❌ Total Failed: ${totalFailed}`);
    console.log(`📊 Success Rate: ${((totalGenerated / (totalGenerated + totalFailed)) * 100).toFixed(1)}%`);
    
    // Step 4: Generate comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      totalGenerated,
      totalFailed,
      totalProjects,
      totalFunding,
      totalStories,
      successRate: ((totalGenerated / (totalGenerated + totalFailed)) * 100).toFixed(1),
      tiers: Object.keys(COMPANY_TIERS).map(tier => ({
        name: tier,
        companies: COMPANY_TIERS[tier].length
      })),
      dataStructure: {
        companies: 'Enhanced with detailed business info, partnerships, awards',
        projects: 'Comprehensive project details with URLs, pricing, integrations',
        funding: 'Detailed funding history with investors and valuations',
        stories: 'Professional news stories with sentiment analysis'
      }
    };
    
    fs.writeFileSync('enhanced-deep-research-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Comprehensive report saved to: enhanced-deep-research-report.json');
    
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
