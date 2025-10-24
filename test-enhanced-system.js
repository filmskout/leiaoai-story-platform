#!/usr/bin/env node

import https from 'https';

// Test configuration
const ADMIN_TOKEN = 'R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn';
const DEEPSEEK_API_KEY = 'sk-55e94a8cacc041e29b3d43310575e2dd';

// Test company
const TEST_COMPANY = {
  name: 'Anthropic',
  tier: 'Tier 2 - AI Unicorns'
};

// Enhanced company details prompt
const ENHANCED_COMPANY_PROMPT = `You are an expert AI industry analyst conducting comprehensive deep research. Provide detailed information about the AI company "Anthropic" in English.

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
  "name": "Anthropic",
  "description": "Concise 60-word summary of core AI focus and market position",
  "detailed_description": "Comprehensive 500-700 word analysis covering all research areas",
  "website": "https://anthropic.com",
  "founded_year": 2021,
  "headquarters": "San Francisco, CA, USA",
  "employee_count_range": "100-500",
  "valuation_usd": 15000000000,
  "industry_tags": ["AI Safety", "Large Language Models", "AI Alignment", "Constitutional AI"],
  "tier": "Tier 2 - AI Unicorns",
  "company_type": "AI Company",
  "business_model": ["B2B", "Enterprise", "API-based"],
  "key_technologies": ["LLM", "AI Safety", "Constitutional AI", "NLP"],
  "market_focus": ["Enterprise", "Developer", "Research"],
  "geographic_presence": ["North America", "Global"],
  "partnerships": ["Google", "Salesforce Ventures", "Zoom Ventures"],
  "awards": ["AI Safety Research Recognition"],
  "research_papers": 15,
  "patents": 25,
  "open_source_projects": 5,
  "last_funding_date": "2023-05-23",
  "last_product_launch": "2024-03-04",
  "logo_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}

CONDUCT DEEP RESEARCH: Use multiple sources, verify facts, provide accurate data with specific numbers and dates.`;

// Enhanced projects prompt
const ENHANCED_PROJECTS_PROMPT = `You are an expert AI product analyst. Research and provide comprehensive information about AI projects, products, and services offered by "Anthropic".

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
    "name": "Claude",
    "description": "Detailed 150-200 word description including features and capabilities",
    "url": "https://claude.ai",
    "category": "AI Product",
    "project_type": "AI Product",
    "launch_date": "2023-03-14",
    "status": "Active",
    "pricing_model": "Freemium",
    "target_audience": ["Developers", "Enterprises", "Consumers"],
    "technology_stack": ["Large Language Models", "Constitutional AI", "NLP"],
    "use_cases": ["Content Generation", "Analysis", "Coding Assistance"],
    "integrations": ["REST API", "Python SDK", "JavaScript SDK"],
    "documentation_url": "https://docs.anthropic.com",
    "github_url": "https://github.com/anthropics",
    "demo_url": "https://claude.ai",
    "pricing_url": "https://www.anthropic.com/pricing"
  }
]

RESEARCH REQUIREMENTS: Provide 5-8 projects per company, focus on actual products with real URLs and detailed information.`;

// DeepSeek API call
async function callDeepSeek(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 5000
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
  return content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/```json/g, '')
    .trim();
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

// Main test function
async function testEnhancedSystem() {
  console.log('🧪 Testing Enhanced Deep Research Generation System');
  console.log(`🎯 Testing company: ${TEST_COMPANY.name} (${TEST_COMPANY.tier})`);
  console.log('');
  
  try {
    // Step 1: Generate enhanced company details
    console.log('🔬 Step 1: Generating enhanced company details with DeepSeek...');
    const detailsContent = await callDeepSeek(ENHANCED_COMPANY_PROMPT);
    console.log('✅ Enhanced company details generated');
    
    // Step 2: Generate enhanced projects
    console.log('📊 Step 2: Generating enhanced projects with DeepSeek...');
    const projectsContent = await callDeepSeek(ENHANCED_PROJECTS_PROMPT);
    console.log('✅ Enhanced projects generated');
    
    // Step 3: Parse and clean JSON
    console.log('🔧 Step 3: Parsing and cleaning JSON content...');
    const companyDetails = JSON.parse(cleanJSONContent(detailsContent));
    const projects = JSON.parse(cleanJSONContent(projectsContent));
    console.log('✅ JSON parsing successful');
    
    // Step 4: Display generated data
    console.log('📊 Step 4: Generated enhanced company data:');
    console.log(`   Name: ${companyDetails.name}`);
    console.log(`   Description: ${companyDetails.description}`);
    console.log(`   Website: ${companyDetails.website}`);
    console.log(`   Founded: ${companyDetails.founded_year}`);
    console.log(`   Headquarters: ${companyDetails.headquarters}`);
    console.log(`   Employees: ${companyDetails.employee_count_range}`);
    console.log(`   Valuation: $${companyDetails.valuation_usd?.toLocaleString()}`);
    console.log(`   Industry Tags: ${companyDetails.industry_tags?.join(', ')}`);
    console.log(`   Tier: ${companyDetails.tier}`);
    console.log(`   Company Type: ${companyDetails.company_type}`);
    console.log(`   Business Model: ${companyDetails.business_model?.join(', ')}`);
    console.log(`   Key Technologies: ${companyDetails.key_technologies?.join(', ')}`);
    console.log(`   Market Focus: ${companyDetails.market_focus?.join(', ')}`);
    console.log(`   Partnerships: ${companyDetails.partnerships?.join(', ')}`);
    console.log(`   Research Papers: ${companyDetails.research_papers}`);
    console.log(`   Patents: ${companyDetails.patents}`);
    console.log(`   Open Source Projects: ${companyDetails.open_source_projects}`);
    console.log('');
    
    console.log('📊 Generated Projects:');
    projects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.name}`);
      console.log(`      Description: ${project.description.substring(0, 100)}...`);
      console.log(`      URL: ${project.url}`);
      console.log(`      Category: ${project.category}`);
      console.log(`      Status: ${project.status}`);
      console.log(`      Pricing: ${project.pricing_model}`);
      console.log(`      Target: ${project.target_audience?.join(', ')}`);
      console.log(`      Tech Stack: ${project.technology_stack?.join(', ')}`);
      console.log('');
    });
    
    // Step 5: Insert into database
    console.log('💾 Step 5: Inserting enhanced data into database...');
    const testData = {
      name: companyDetails.name,
      data: {
        ...companyDetails,
        projects: projects
      }
    };
    
    const result = await insertCompanyData(testData);
    
    if (result.success) {
      console.log('✅ Enhanced data inserted successfully');
      console.log(`   Company ID: ${result.result.companyId}`);
      console.log(`   Action: ${result.result.action}`);
    } else {
      console.log('❌ Enhanced data insertion failed');
      console.log(`   Error: ${result.error}`);
    }
    
    console.log('');
    console.log('🎉 Enhanced Deep Research Test Complete!');
    console.log('📋 Next steps:');
    console.log('   1. Check Supabase dashboard for enhanced data structure');
    console.log('   2. Run full enhanced generation: node enhanced-deep-research-generator.js');
    console.log('   3. Verify projects table and enhanced company data');
    
  } catch (error) {
    console.error('💥 Enhanced test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check DeepSeek API key configuration');
    console.log('   2. Verify database schema updates');
    console.log('   3. Check network connectivity');
    console.log('   4. Review error logs');
  }
}

// Run the enhanced test
testEnhancedSystem().catch(console.error);
