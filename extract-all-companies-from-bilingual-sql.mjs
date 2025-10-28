import fs from 'fs';

// 从BILINGUAL SQL文件中提取所有公司名称
const files = [
  'BILINGUAL-BATCH-1-40-COMPANIES.sql',
  'BILINGUAL-BATCH-2-41-80-COMPANIES.sql',
  'BILINGUAL-BATCH-3-81-116-COMPANIES.sql'
];

const allCompanies = new Set();

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    
    // 提取UPDATE语句中的公司名称（WHERE name = '...' 或 WHERE name LIKE '%...%'）
    const nameMatches = content.matchAll(/WHERE name\s*=\s*['"]([^'"]+)['"]|WHERE name\s*LIKE\s*['"]%([^%]+)%['"]/g);
    
    for (const match of nameMatches) {
      const name = match[1] || match[2];
      if (name) {
        allCompanies.add(name);
      }
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
});

console.log(`\n📊 提取到 ${allCompanies.size} 个公司\n`);
console.log('公司列表：');
Array.from(allCompanies).sort().forEach((name, idx) => {
  console.log(`${idx + 1}. ${name}`);
});

// 保存到文件
fs.writeFileSync('all-companies-list.txt', Array.from(allCompanies).sort().join('\n'), 'utf-8');
console.log('\n✅ 已保存到 all-companies-list.txt');

