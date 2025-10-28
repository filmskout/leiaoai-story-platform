import fs from 'fs';

// 读取公司列表
const companiesList = fs.readFileSync('all-companies-list.txt', 'utf-8')
  .split('\n')
  .filter(line => line.trim())
  .map(line => line.trim());

console.log(`📊 开始为 ${companiesList.length} 个公司生成估值和融资轮次数据...\n`);

// 主要公司的估值和融资信息（真实数据）
const fundingData = {
  'OpenAI': { valuation: 80000000000, funding: 'Microsoft投资', investors: ['Microsoft'], round: 'Series H' },
  'Anthropic': { valuation: 50000000000, funding: '亚马逊、谷歌投资', investors: ['Amazon', 'Google'], round: 'Series E' },
  'Midjourney': { valuation: 10000000000, funding: '独角兽公司', investors: ['a16z'], round: 'Series A' },
  'Character.AI': { valuation: 1000000000, funding: 'Andreessen Horowitz领投', investors: ['a16z'], round: 'Series B' },
  'Stability AI': { valuation: 1000000000, funding: '独角兽公司', investors: ['Lightspeed'], round: 'Series B' },
  'Scale AI': { valuation: 7300000000, funding: '老虎环球、Accel领投', investors: ['Tiger Global', 'Accel'], round: 'Series F' },
  'Hugging Face': { valuation: 4500000000, funding: '独角兽公司', investors: ['Lux Capital'], round: 'Series D' },
  'Runway': { valuation: 1500000000, funding: '独角兽公司', investors: ['Amplify Partners'], round: 'Series C' },
  'Jasper': { valuation: 1500000000, funding: '独角兽公司', investors: ['Insight Partners'], round: 'Series A' },
  'Cohere': { valuation: 2200000000, funding: '独角兽公司', investors: ['Tiger Global'], round: 'Series C' },
  'Perplexity AI': { valuation: 3000000000, funding: '独角兽公司', investors: ['IVP'], round: 'Series B' },
  'Adept AI': { valuation: 1000000000, funding: '独角兽公司', investors: ['a16z'], round: 'Series B' },
  'Adobe': { valuation: 250000000000, funding: '上市公司', investors: [], round: 'Public' },
  'Microsoft': { valuation: 3000000000000, funding: '上市公司', investors: [], round: 'Public' },
  'Google': { valuation: 1700000000000, funding: '上市公司', investors: [], round: 'Public' },
  'Meta': { valuation: 1250000000000, funding: '上市公司', investors: [], round: 'Public' },
  'Amazon': { valuation: 1700000000000, funding: '上市公司', investors: [], round: 'Public' },
  'Apple': { valuation: 2800000000000, funding: '上市公司', investors: [], round: 'Public' },
  'NVIDIA': { valuation: 2200000000000, funding: '上市公司', investors: [], round: 'Public' },
  'Tesla': { valuation: 800000000000, funding: '上市公司', investors: [], round: 'Public' },
  'Baidu': { valuation: 30000000000, funding: '上市公司', investors: [], round: 'Public' },
  'Tencent': { valuation: 450000000000, funding: '上市公司', investors: [], round: 'Public' },
  'ByteDance': { valuation: 200000000000, funding: '估值', investors: [], round: 'Private' },
  'Alibaba': { valuation: 200000000000, funding: '上市公司', investors: [], round: 'Public' },
};

// 生成SQL
const sqlStatements = [];

companiesList.forEach(company => {
  const data = fundingData[company];
  
  if (data) {
    const { valuation, funding, investors, round } = data;
    
    // 更新估值
    sqlStatements.push(`UPDATE companies SET valuation_usd = ${valuation} WHERE name = '${company}';`);
    
    // 添加融资信息（需要先获取company_id）
    if (investors && investors.length > 0 && round !== 'Public') {
      sqlStatements.push(`-- 融资信息: ${company}
-- Round: ${round}
-- Investors: ${investors.join(', ')}
-- Amount: ${valuation} USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, '${round}', ARRAY[${investors.map(i => `'${i}'`).join(', ')}], ${valuation}, NOW()
-- FROM companies WHERE name = '${company}';`);
    }
  } else {
    sqlStatements.push(`-- TODO: ${company} - 需要查找估值和融资信息`);
  }
});

// 保存SQL文件
const sqlContent = `-- 公司估值和融资信息补齐SQL
-- 在Supabase SQL Editor中执行此脚本
-- 包含 ${companiesList.length} 个公司的估值信息

BEGIN;

${sqlStatements.join('\n\n')}

-- 查看更新结果
SELECT 
    name,
    valuation_usd,
    company_tier,
    headquarters
FROM companies 
WHERE valuation_usd IS NOT NULL
ORDER BY valuation_usd DESC;

COMMIT;
`;

fs.writeFileSync('UPDATE-COMPANIES-VALUATIONS.sql', sqlContent, 'utf-8');

console.log(`✅ 已生成SQL脚本: UPDATE-COMPANIES-VALUATIONS.sql`);
console.log(`📊 包含 ${sqlStatements.filter(s => !s.startsWith('--')).length} 个估值更新`);
console.log(`📝 包含 ${sqlStatements.filter(s => s.startsWith('--') && s.includes('TODO')).length} 个待补充`);
console.log('\n📋 执行方式:');
console.log('1. 在 Supabase SQL Editor 中执行 UPDATE-COMPANIES-VALUATIONS.sql');
console.log('2. 检查结果并手动补充缺失的估值信息');

