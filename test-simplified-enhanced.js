#!/usr/bin/env node

import https from 'https';

// Test configuration
const ADMIN_TOKEN = 'R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn';
const DEEPSEEK_API_KEY = 'sk-55e94a8cacc041e29b3d43310575e2dd';

// Simplified test prompt
const SIMPLE_TEST_PROMPT = `Generate basic information about Anthropic AI company in JSON format:

{
  "name": "Anthropic",
  "description": "AI safety company focused on developing safe AI systems",
  "website": "https://anthropic.com",
  "founded_year": 2021,
  "headquarters": "San Francisco, CA, USA",
  "employee_count_range": "100-500",
  "valuation_usd": 15000000000,
  "industry_tags": ["AI Safety", "Large Language Models", "AI Alignment"],
  "tier": "Tier 2 - AI Unicorns",
  "company_type": "AI Company",
  "business_model": ["B2B", "Enterprise", "API-based"],
  "key_technologies": ["LLM", "AI Safety", "Constitutional AI"],
  "market_focus": ["Enterprise", "Developer", "Research"],
  "geographic_presence": ["North America", "Global"],
  "partnerships": ["Google", "Salesforce Ventures"],
  "research_papers": 15,
  "patents": 25,
  "open_source_projects": 5
}`;

// Simple projects prompt
const SIMPLE_PROJECTS_PROMPT = `Generate Anthropic's main products in JSON array format:

[
  {
    "name": "Claude",
    "description": "AI assistant focused on helpfulness, harmlessness, and honesty",
    "url": "https://claude.ai",
    "category": "AI Product",
    "project_type": "AI Product",
    "status": "Active",
    "pricing_model": "Freemium",
    "target_audience": ["Developers", "Enterprises", "Consumers"],
    "technology_stack": ["Large Language Models", "Constitutional AI"],
    "use_cases": ["Content Generation", "Analysis", "Coding Assistance"]
  },
  {
    "name": "Claude API",
    "description": "API for integrating Claude into applications",
    "url": "https://console.anthropic.com",
    "category": "AI Service",
    "project_type": "AI Service",
    "status": "Active",
    "pricing_model": "API-based",
    "target_audience": ["Developers", "Enterprises"],
    "technology_stack": ["REST API", "Large Language Models"],
    "use_cases": ["Application Integration", "Custom AI Solutions"]
  }
]`;

// DeepSeek API call with timeout
async function callDeepSeek(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 2000
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
  // Remove markdown code blocks
  let cleaned = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/```json/g, '')
    .trim();
  
  // Find JSON object/array boundaries
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
async function testSimplifiedSystem() {
  console.log('🧪 Testing Simplified Enhanced System');
  console.log('🎯 Testing company: Anthropic (Tier 2 - AI Unicorns)');
  console.log('');
  
  try {
    // Step 1: Generate company details
    console.log('🔬 Step 1: Generating company details...');
    const detailsContent = await callDeepSeek(SIMPLE_TEST_PROMPT);
    console.log('✅ Company details generated');
    
    // Step 2: Generate projects
    console.log('📊 Step 2: Generating projects...');
    const projectsContent = await callDeepSeek(SIMPLE_PROJECTS_PROMPT);
    console.log('✅ Projects generated');
    
    // Step 3: Parse JSON
    console.log('🔧 Step 3: Parsing JSON...');
    console.log('📄 Raw details content:', detailsContent.substring(0, 200));
    console.log('📄 Raw projects content:', projectsContent.substring(0, 200));
    
    const cleanedDetails = cleanJSONContent(detailsContent);
    const cleanedProjects = cleanJSONContent(projectsContent);
    
    console.log('🧹 Cleaned details:', cleanedDetails.substring(0, 200));
    console.log('🧹 Cleaned projects:', cleanedProjects.substring(0, 200));
    
    const companyDetails = JSON.parse(cleanedDetails);
    const projects = JSON.parse(cleanedProjects);
    console.log('✅ JSON parsing successful');
    
    // Step 4: Display data
    console.log('📊 Step 4: Generated data:');
    console.log(`   Name: ${companyDetails.name}`);
    console.log(`   Description: ${companyDetails.description}`);
    console.log(`   Website: ${companyDetails.website}`);
    console.log(`   Founded: ${companyDetails.founded_year}`);
    console.log(`   Valuation: $${companyDetails.valuation_usd?.toLocaleString()}`);
    console.log(`   Projects: ${projects.length}`);
    projects.forEach((project, index) => {
      console.log(`     ${index + 1}. ${project.name} - ${project.description.substring(0, 50)}...`);
    });
    
    // Step 5: Insert into database
    console.log('💾 Step 5: Inserting into database...');
    const testData = {
      name: companyDetails.name,
      data: {
        ...companyDetails,
        projects: projects
      }
    };
    
    const result = await insertCompanyData(testData);
    
    if (result.success) {
      console.log('✅ Data inserted successfully');
      console.log(`   Company ID: ${result.result.companyId}`);
      console.log(`   Action: ${result.result.action}`);
    } else {
      console.log('❌ Data insertion failed');
      console.log(`   Error: ${result.error}`);
    }
    
    console.log('');
    console.log('🎉 Simplified Test Complete!');
    console.log('📋 Next: Run full enhanced generation');
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
    console.log('');
    console.log('🔧 Error details:', error);
  }
}

// Run the simplified test
testSimplifiedSystem().catch(console.error);
