#!/usr/bin/env node

import https from 'https';

// Simple test configuration
const ADMIN_TOKEN = 'R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn';
const DEEPSEEK_API_KEY = 'sk-55e94a8cacc041e29b3d43310575e2dd';

// Simple test prompt
const SIMPLE_PROMPT = `Generate basic OpenAI company info in JSON:

{
  "name": "OpenAI",
  "description": "AI research company focused on AGI",
  "website": "https://openai.com",
  "founded_year": 2015,
  "headquarters": "San Francisco, CA, USA",
  "employee_count_range": "1000-5000",
  "valuation_usd": 80000000000,
  "industry_tags": ["AI Research", "LLM", "AGI"],
  "tier": "Tier 1 - Tech Giants",
  "company_type": "AI Company",
  "business_model": ["B2B", "Enterprise"],
  "key_technologies": ["LLM", "AI Research"],
  "market_focus": ["Enterprise", "Developer"],
  "geographic_presence": ["North America", "Global"],
  "partnerships": ["Microsoft"],
  "research_papers": 50,
  "patents": 100,
  "open_source_projects": 10
}`;

// DeepSeek API call
async function callDeepSeek(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 1000
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
  if (jsonStart !== -1) {
    cleaned = cleaned.substring(jsonStart);
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
async function testSimpleGeneration() {
  console.log('🧪 Testing Simple Enhanced Generation');
  console.log('🎯 Testing company: OpenAI');
  console.log('');
  
  try {
    // Step 1: Generate company details
    console.log('🔬 Step 1: Generating company details...');
    const detailsContent = await callDeepSeek(SIMPLE_PROMPT);
    console.log('✅ Company details generated');
    console.log('📊 Content length:', detailsContent?.length || 0, 'characters');
    
    // Step 2: Parse JSON
    console.log('🔧 Step 2: Parsing JSON...');
    console.log('📄 Raw content:', detailsContent.substring(0, 200));
    
    const cleanedContent = cleanJSONContent(detailsContent);
    console.log('🧹 Cleaned content:', cleanedContent.substring(0, 200));
    
    const companyDetails = JSON.parse(cleanedContent);
    console.log('✅ JSON parsing successful');
    
    // Step 3: Display data
    console.log('📊 Step 3: Generated data:');
    console.log(`   Name: ${companyDetails.name}`);
    console.log(`   Description: ${companyDetails.description}`);
    console.log(`   Website: ${companyDetails.website}`);
    console.log(`   Founded: ${companyDetails.founded_year}`);
    console.log(`   Valuation: $${companyDetails.valuation_usd?.toLocaleString()}`);
    
    // Step 4: Insert into database
    console.log('💾 Step 4: Inserting into database...');
    const testData = {
      name: companyDetails.name,
      data: companyDetails
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
    console.log('🎉 Simple Test Complete!');
    console.log('📋 Next: Run full generation if this works');
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
    console.log('');
    console.log('🔧 Error details:', error);
  }
}

// Run the simple test
testSimpleGeneration().catch(console.error);
