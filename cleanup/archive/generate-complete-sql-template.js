#!/usr/bin/env node
/**
 * 生成补齐公司数据的SQL脚本
 * 使用 LLM 生成，输出可复制的 SQL 脚本
 */

const COMPANIES_TO_COMPLETE = [
  // 重点公司优先补齐
  'Adobe',
  'Vercel', 
  'Anthropic',
  'OpenAI',
  'Google DeepMind',
  'Microsoft AI',
  'Meta AI',
  'Amazon AI',
  'Tesla AI',
  'NVIDIA',
  'IBM Watson',
  'Stability AI',
  'Hugging Face',
  'Midjourney',
  'Runway',
  'Perplexity AI',
  'Character.AI',
  'Jasper',
  'Copy.ai',
  'Notion AI'
];

console.log('// 使用 LLM 补齐公司数据 - SQL 脚本\n');
console.log('// 生成时间:', new Date().toISOString());
console.log('//\n');

// 这个脚本会生成 SQL，但需要手动填充数据
// 实际使用时，需要用 LLM 生成每个公司的具体数据

console.log('-- ========================================');
console.log('-- 补齐公司数据的 SQL 脚本');
console.log('-- 使用说明：');
console.log('-- 1. 在 Supabase SQL Editor 中运行');
console.log('-- 2. 或者复制到数据库客户端执行');
console.log('-- ========================================\n');

console.log('BEGIN;\n');

// 为每个公司生成更新语句模板
COMPANIES_TO_COMPLETE.forEach((companyName, index) => {
  console.log(`-- ${index + 1}. ${companyName}`);
  console.log(`UPDATE companies 
SET 
  website = 'https://www.example.com',
  description = '公司简介（100字内）',
  headquarters = 'City, Country',
  founded_year = 2020,
  employee_count = '500-1000人',
  logo_url = 'https://logo.clearbit.com/example.com',
  logo_storage_url = 'https://logo.clearbit.com/example.com'
WHERE name = '${companyName}';
`);
});

console.log('COMMIT;\n');

console.log('-- ========================================');
console.log('-- 执行结果检查');
console.log('-- ========================================');
console.log('\nSELECT name, website, description, headquarters, founded_year, employee_count');
console.log('FROM companies');
console.log('WHERE name IN (');
COMPANIES_TO_COMPLETE.forEach((name, index) => {
  const comma = index < COMPANIES_TO_COMPLETE.length - 1 ? ',' : '';
  console.log(`  '${name}'${comma}`);
});
console.log(')\nORDER BY name;\n');

console.log('// =========================================');
console.log('// 下一步：使用 LLM 填充真实数据');
console.log('// =========================================');
