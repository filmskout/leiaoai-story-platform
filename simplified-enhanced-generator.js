#!/usr/bin/env node

import https from 'https';
import fs from 'fs';

// Configuration
const ADMIN_TOKEN = 'R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn';
const DEEPSEEK_API_KEY = 'sk-55e94a8cacc041e29b3d43310575e2dd';

const API_BASE_URL = 'https://leiao.ai/api/unified';

// Test with a smaller set of companies
const TEST_COMPANIES = [
  { name: 'OpenAI', tier: 'Tier 1 - Tech Giants' },
  { name: 'Anthropic', tier: 'Tier 2 - AI Unicorns' },
  { name: 'Google DeepMind', tier: 'Tier 1 - Tech Giants' },
  { name: 'Cohere', tier: 'Tier 2 - AI Unicorns' },
  { name: 'Stability AI', tier: 'Tier 2 - AI Unicorns' }
];

// Simplified prompts for faster generation
const SIMPLIFIED_PROMPTS = {
  companyDetails: `Generate comprehensive information about "{companyName}" in JSON format:

{
  "name": "{companyName}",
  "description": "Concise 60-word summary of core AI focus",
  "detailed_description": "Comprehensive 400-500 word analysis",
  "website": "Official website URL",
  "founded_year": YYYY,
  "headquarters": "City, Country",
  "employee_count_range": "e.g., 1000-5000",
  "valuation_usd": 1234567890,
  "industry_tags": ["tag1", "tag2", "tag3"],
  "tier": "{tier}",
  "company_type": "AI Company",
  "business_model": ["B2B", "Enterprise"],
  "key_technologies": ["LLM", "AI Research"],
  "market_focus": ["Enterprise", "Developer"],
  "geographic_presence": ["North America", "Global"],
  "partnerships": ["Major Partner"],
  "research_papers": 10,
  "patents": 50,
  "open_source_projects": 5
}`,

  projects: `Generate main products for "{companyName}" in JSON array:

[
  {
    "name": "Product Name",
    "description": "Detailed 100-150 word description",
    "url": "Official URL",
    "category": "AI Product",
    "project_type": "AI Product",
    "status": "Active",
    "pricing_model": "Freemium",
    "target_audience": ["Developers", "Enterprises"],
    "technology_stack": ["Machine Learning", "NLP"],
    "use_cases": ["Content Generation", "Analysis"]
  }
]`,

  funding: `Generate funding history for "{companyName}" in JSON array:

[
  {
    "round": "Series C",
    "amount_usd": 1000000000,
    "investors": ["Investor 1", "Investor 2"],
    "announced_on": "2023-01-01"
  }
]`,

  news: `Generate a news story about "{companyName}" in JSON format:

{
  "title": "Compelling news headline",
  "content": "Comprehensive 500-600 word news story",
  "source_url": "https://example.com/news",
  "published_at": "2023-01-01",
  "story_type": "Company News",
  "sentiment": "Positive",
  "impact_score": 7,
  "tags": ["AI", "Innovation"],
  "author": "Tech Journalist",
  "word_count": 550,
  "reading_time": 3
}`
};

// DeepSeek API call
async function callDeepSeek(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 3000
    });
    
    const options = {
      hostname: 'api.deepseek.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
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
          if (response.error) {
            reject(new Error(`DeepSeek API Error: ${response.error.message}`));
          } else {
            const content = response.choices?.[0]?.message?.content;
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

// Clean JSON content
function cleanJSONContent(content) {
  let cleaned = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/```json/g, '')
    .trim();
  
  const jsonStart = cleaned.indexOf('{');
  const arrayStart = cleaned.indexOf('[');
  
  let startIndex = -1;
  if (jsonStart !== -1 && arrayStart !== -1) {
    startIndex = Math.min(jsonStart, arrayStart);
  } else if (jsonStart !== -1) {
    startIndex = jsonStart;
  } else if (arrayStart !== -1) {
    startIndex = arrayStart;
  }
  
  if (startIndex !== -1) {
    cleaned = cleaned.substring(startIndex);
  }
  
  return cleaned.trim();
}

// Generate company data
async function generateCompanyData(companyName, tier) {
  console.log(`\n🏢 Generating data for ${companyName} (${tier})`);
  
  try {
    // Generate company details
    const detailsPrompt = SIMPLIFIED_PROMPTS.companyDetails
      .replace('{companyName}', companyName)
      .replace('{tier}', tier);
    const detailsContent = await callDeepSeek(detailsPrompt);
    const companyDetails = JSON.parse(cleanJSONContent(detailsContent));
    
    // Generate projects
    const projectsPrompt = SIMPLIFIED_PROMPTS.projects.replace('{companyName}', companyName);
    const projectsContent = await callDeepSeek(projectsPrompt);
    const projects = JSON.parse(cleanJSONContent(projectsContent));
    
    // Generate funding
    const fundingPrompt = SIMPLIFIED_PROMPTS.funding.replace('{companyName}', companyName);
    const fundingContent = await callDeepSeek(fundingPrompt);
    const funding = JSON.parse(cleanJSONContent(fundingContent));
    
    // Generate news
    const newsPrompt = SIMPLIFIED_PROMPTS.news.replace('{companyName}', companyName);
    const newsContent = await callDeepSeek(newsPrompt);
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

// Insert company data via API
async function insertCompanyData(companyData) {
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

// Main execution function
async function main() {
  console.log('🚀 Starting Simplified Enhanced Deep Research Generation');
  console.log('📊 Target: 5 AI Companies for Testing');
  console.log('🔬 Method: Simplified Deep Research with DeepSeek');
  console.log('');
  
  try {
    let totalGenerated = 0;
    let totalFailed = 0;
    let totalProjects = 0;
    let totalFunding = 0;
    let totalStories = 0;
    
    for (const company of TEST_COMPANIES) {
      try {
        // Generate comprehensive data
        const companyData = await generateCompanyData(company.name, company.tier);
        
        if (companyData) {
          // Insert into database
          const testData = {
            name: companyData.company.name,
            data: {
              ...companyData.company,
              projects: companyData.projects,
              funding_rounds: companyData.funding
            }
          };
          
          const result = await insertCompanyData(testData);
          
          if (result.success) {
            console.log(`✅ ${company.name}: Generated and inserted successfully`);
            console.log(`   📊 Projects: ${companyData.projects?.length || 0}`);
            console.log(`   💰 Funding: ${companyData.funding?.length || 0}`);
            console.log(`   📰 Stories: ${companyData.news ? 1 : 0}`);
            
            totalGenerated++;
            totalProjects += companyData.projects?.length || 0;
            totalFunding += companyData.funding?.length || 0;
            totalStories += companyData.news ? 1 : 0;
          } else {
            console.log(`❌ ${company.name}: Insert failed - ${result.error}`);
            totalFailed++;
          }
        } else {
          console.log(`❌ ${company.name}: Generation failed`);
          totalFailed++;
        }
        
        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ ${company.name}: Error - ${error.message}`);
        totalFailed++;
      }
    }
    
    // Final summary
    console.log('\n🎉 Simplified Enhanced Generation Complete!');
    console.log(`📈 Total Companies Generated: ${totalGenerated}`);
    console.log(`📊 Total Projects Generated: ${totalProjects}`);
    console.log(`💰 Total Funding Records: ${totalFunding}`);
    console.log(`📰 Total News Stories: ${totalStories}`);
    console.log(`❌ Total Failed: ${totalFailed}`);
    console.log(`📊 Success Rate: ${((totalGenerated / (totalGenerated + totalFailed)) * 100).toFixed(1)}%`);
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      totalGenerated,
      totalFailed,
      totalProjects,
      totalFunding,
      totalStories,
      successRate: ((totalGenerated / (totalGenerated + totalFailed)) * 100).toFixed(1),
      companies: TEST_COMPANIES.map(c => c.name)
    };
    
    fs.writeFileSync('simplified-generation-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Report saved to: simplified-generation-report.json');
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
