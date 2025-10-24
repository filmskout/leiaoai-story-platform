import https from 'https';

// 直接查询数据库测试
async function testDatabaseDirect() {
  const supabaseUrl = 'https://your-project.supabase.co'; // 需要替换为实际的URL
  const supabaseKey = 'your-service-role-key'; // 需要替换为实际的key
  
  // 这里我们直接调用API来检查数据库
  const response = await fetch('https://leiao.ai/api/unified?action=data-progress', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  
  if (data.success && data.data.companies.list) {
    const testCompany = data.data.companies.list.find(c => c.name === '调试测试公司');
    if (testCompany) {
      console.log('🔍 数据库中的实际数据:');
      console.log('ID:', testCompany.id);
      console.log('Name:', testCompany.name);
      console.log('Description:', testCompany.description);
      console.log('Website:', testCompany.website);
      console.log('Founded Year:', testCompany.founded_year);
      console.log('Headquarters:', testCompany.headquarters);
      console.log('Valuation USD:', testCompany.valuation_usd);
      console.log('Industry Tags:', testCompany.industry_tags);
      console.log('Logo URL:', testCompany.logo_url);
      console.log('Created At:', testCompany.created_at);
      
      // 检查所有字段
      console.log('\n📊 所有字段:');
      Object.keys(testCompany).forEach(key => {
        console.log(`${key}: ${testCompany[key]} (${typeof testCompany[key]})`);
      });
    }
  }
}

testDatabaseDirect().catch(console.error);
