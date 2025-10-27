#!/usr/bin/env node

import https from 'https';

const API_BASE_URL = 'https://leiao.ai/api/unified';

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

async function monitorProgress() {
  console.log('📊 Starting progress monitoring...');
  console.log('Press Ctrl+C to stop\n');

  while (true) {
    try {
      const progress = await checkProgress();
      const timestamp = new Date().toLocaleTimeString();
      
      console.log(`⏰ ${timestamp} | Companies: ${progress.data.companies.total} | Projects: ${progress.data.projects} | Fundings: ${progress.data.fundings} | Stories: ${progress.data.stories}`);
      
      if (progress.data.companies.total >= 200) {
        console.log('\n🎉 Target reached! 200+ companies generated.');
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 30000)); // Check every 30 seconds
    } catch (error) {
      console.log(`❌ Monitor error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds on error
    }
  }
}

monitorProgress().catch(console.error);
