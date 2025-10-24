#!/usr/bin/env node

import https from 'https';

// Configuration
const ADMIN_TOKEN = 'R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn';
const API_BASE_URL = 'https://leiao.ai/api/unified';

// 简化的公司列表 - 先生成10家公司测试
const TEST_COMPANIES = [
  'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Apple AI',
  'Anthropic', 'Stability AI', 'Midjourney', 'Character.AI', 'Hugging Face'
];

// 生成单个公司数据
async function generateCompanyData(companyName) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      action: 'generate-single-company',
      adminToken: ADMIN_TOKEN,
      companyName: companyName,
      includeLogo: true,
      isOverseas: true
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
      timeout: 60000
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
    req.setTimeout(60000);
    req.write(postData);
    req.end();
  });
}

// 检查进度
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

// 主函数
async function main() {
  console.log('🚀 Starting simplified company generation...');
  console.log(`📊 Target companies: ${TEST_COMPANIES.length}`);
  
  // 检查初始进度
  const initialProgress = await checkProgress();
  console.log(`📊 Initial progress: ${initialProgress.data.companies.total} companies`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < TEST_COMPANIES.length; i++) {
    const companyName = TEST_COMPANIES[i];
    console.log(`\n📝 Generating ${i + 1}/${TEST_COMPANIES.length}: ${companyName}`);
    
    try {
      const result = await generateCompanyData(companyName);
      if (result.success) {
        console.log(`✅ ${companyName} generated successfully`);
        successCount++;
      } else {
        console.log(`⚠️ ${companyName} generation failed: ${result.message}`);
        failCount++;
      }
    } catch (error) {
      console.log(`❌ ${companyName} generation error: ${error.message}`);
      failCount++;
    }
    
    // 检查进度
    const progress = await checkProgress();
    console.log(`📊 Progress: ${progress.data.companies.total} companies, ${progress.data.projects} projects`);
    
    // 延迟避免API限制
    if (i < TEST_COMPANIES.length - 1) {
      console.log('⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log(`\n🎉 Generation completed!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  // 最终进度检查
  const finalProgress = await checkProgress();
  console.log('\n📊 Final Progress:');
  console.log(`Companies: ${finalProgress.data.companies.total}`);
  console.log(`Projects: ${finalProgress.data.projects}`);
  console.log(`Fundings: ${finalProgress.data.fundings}`);
  console.log(`Stories: ${finalProgress.data.stories}`);
}

// 运行脚本
main().catch(console.error);
