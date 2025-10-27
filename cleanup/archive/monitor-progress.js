#!/usr/bin/env node

import https from 'https';

// Configuration
const API_BASE_URL = 'https://leiao.ai/api/unified';

// Monitor data generation progress
async function monitorProgress() {
  console.log('📊 Enhanced Deep Research Generation Progress Monitor');
  console.log('🎯 Target: 200+ AI Companies with Complete Data');
  console.log('⏰ Started:', new Date().toLocaleString());
  console.log('');
  
  let lastCount = 0;
  let startTime = Date.now();
  
  const monitor = setInterval(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?action=data-progress`);
      const data = await response.json();
      
      if (data.success) {
        const companies = data.data.companies.total;
        const projects = data.data.projects;
        const fundings = data.data.fundings;
        const stories = data.data.stories;
        
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        
        console.log(`⏰ ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} | Companies: ${companies} | Projects: ${projects} | Fundings: ${fundings} | Stories: ${stories}`);
        
        if (companies > lastCount) {
          console.log(`🎉 New company added! Total: ${companies}`);
          lastCount = companies;
        }
        
        if (companies >= 200) {
          console.log('');
          console.log('🎉 Generation Complete!');
          console.log(`📊 Final Results:`);
          console.log(`   Companies: ${companies}`);
          console.log(`   Projects: ${projects}`);
          console.log(`   Fundings: ${fundings}`);
          console.log(`   Stories: ${stories}`);
          console.log(`   Total Time: ${hours}h ${minutes}m ${seconds}s`);
          clearInterval(monitor);
        }
      } else {
        console.log('❌ Error fetching progress:', data.error);
      }
    } catch (error) {
      console.log('❌ Monitor error:', error.message);
    }
  }, 30000); // Check every 30 seconds
  
  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Monitoring stopped by user');
    clearInterval(monitor);
    process.exit(0);
  });
}

// Run the monitor
monitorProgress().catch(console.error);
