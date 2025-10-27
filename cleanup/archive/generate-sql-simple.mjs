#!/usr/bin/env node
/**
 * 简化版本：直接生成SQL，不调用API
 * 生成后由你手动填入真实数据
 */

const COMPANIES = [
  'Adobe', 'Vercel', 'Anthropic', 'OpenAI', 'Google DeepMind',
  'Microsoft AI', 'Meta AI', 'Amazon AI', 'Tesla AI', 'NVIDIA',
  'IBM Watson', 'Stability AI', 'Hugging Face', 'Midjourney', 'Runway',
  'Perplexity AI', 'Character.AI', 'Jasper', 'Copy.ai', 'Notion AI'
];

console.log('// =========================================');
console.log('// 补齐公司数据的 SQL 脚本');
console.log('// 请手动填入真实数据');
console.log('// =========================================\n');
console.log('BEGIN;\n');

COMPANIES.forEach((name, index) => {
  console.log(`-- ${index + 1}. ${name}`);
  console.log(`UPDATE companies 
SET 
  website = 'https://www.example.com',  -- TODO: 填入真实URL
  description = '公司简介（100字内）',     -- TODO: 填入真实简介
  headquarters = 'City, Country',        -- TODO: 填入真实地址
  founded_year = 2020,                  -- TODO: 填入真实年份
  employee_count = '500-1000人'          -- TODO: 填入真实规模
WHERE name = '${name}';
`);
});

console.log('COMMIT;\n');
console.log('// TODO: 请手动查找并填入真实数据');
console.log('// 可以使用搜索引擎或LLM工具');
