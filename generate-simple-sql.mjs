#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取迁移数据
const data = JSON.parse(fs.readFileSync('migrated-aiverse-companies-optimized.json', 'utf8'));

console.log(`📊 发现 ${data.length} 家公司数据`);

// 生成简化的SQL插入脚本（只使用现有字段）
let sql = `-- 简化AIverse数据插入脚本 - ${data.length}家公司
-- 在Supabase SQL Editor中执行
-- 只使用现有字段：companies(name, description), projects(company_id, name, description, category, website)

-- 1. 插入所有公司数据
INSERT INTO companies (name, description) VALUES\n`;

// 生成公司插入语句
const companyInserts = data.map((item, index) => {
  const name = item.company.name.replace(/'/g, "''"); // 转义单引号
  const description = item.company.description.replace(/'/g, "''"); // 转义单引号
  return `('${name}', '${description}')`;
});

sql += companyInserts.join(',\n') + ';\n\n';

// 生成项目插入语句（只使用现有字段）
sql += `-- 2. 插入所有项目数据（简化版）
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN (${data.map(item => `'${item.company.name.replace(/'/g, "''")}'`).join(', ')})
)
INSERT INTO projects (company_id, name, description, category, website)
SELECT 
  ci.id,
  p.name,
  p.description,
  p.category,
  p.website
FROM company_ids ci
CROSS JOIN LATERAL (
  VALUES\n`;

// 为每个公司生成项目数据（只使用现有字段）
const projectValues = [];
data.forEach((item, index) => {
  if (item.projects && item.projects.length > 0) {
    item.projects.forEach((project, pIndex) => {
      const name = project.name.replace(/'/g, "''");
      const description = project.description.replace(/'/g, "''");
      const category = project.category.replace(/'/g, "''");
      const website = project.website.replace(/'/g, "''");
      
      projectValues.push(`    ('${item.company.name.replace(/'/g, "''")}', '${name}', '${description}', '${category}', '${website}')`);
    });
  }
});

sql += projectValues.join(',\n') + '\n';
sql += `) AS p(company_name, name, description, category, website)
WHERE ci.name = p.company_name;\n\n`;

// 生成融资插入语句
sql += `-- 3. 插入所有融资数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN (${data.map(item => `'${item.company.name.replace(/'/g, "''")}'`).join(', ')})
)
INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT 
  ci.id,
  f.round,
  f.amount,
  f.investors,
  f.valuation,
  f.date,
  f.lead_investor
FROM company_ids ci
CROSS JOIN LATERAL (
  VALUES\n`;

// 为每个公司生成融资数据
const fundingValues = [];
data.forEach((item, index) => {
  if (item.fundings && item.fundings.length > 0) {
    item.fundings.forEach((funding, fIndex) => {
      const round = funding.round.replace(/'/g, "''");
      const investors = funding.investors.replace(/'/g, "''");
      const leadInvestor = funding.lead_investor.replace(/'/g, "''");
      
      fundingValues.push(`    ('${item.company.name.replace(/'/g, "''")}', '${round}', ${funding.amount}, '${investors}', ${funding.valuation}, ${funding.date}, '${leadInvestor}')`);
    });
  }
});

sql += fundingValues.join(',\n') + '\n';
sql += `) AS f(company_name, round, amount, investors, valuation, date, lead_investor)
WHERE ci.name = f.company_name;\n\n`;

// 生成新闻插入语句
sql += `-- 4. 插入所有新闻数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN (${data.map(item => `'${item.company.name.replace(/'/g, "''")}'`).join(', ')})
)
INSERT INTO stories (company_id, title, summary, source_url, published_date, category, tags)
SELECT 
  ci.id,
  s.title,
  s.summary,
  s.source_url,
  s.published_date,
  s.category,
  s.tags
FROM company_ids ci
CROSS JOIN LATERAL (
  VALUES\n`;

// 为每个公司生成新闻数据
const storyValues = [];
data.forEach((item, index) => {
  if (item.stories && item.stories.length > 0) {
    item.stories.forEach((story, sIndex) => {
      const title = story.title.replace(/'/g, "''");
      const summary = story.summary.replace(/'/g, "''");
      const sourceUrl = story.source_url.replace(/'/g, "''");
      const category = story.category.replace(/'/g, "''");
      const tags = JSON.stringify(story.tags).replace(/'/g, "''");
      
      storyValues.push(`    ('${item.company.name.replace(/'/g, "''")}', '${title}', '${summary}', '${sourceUrl}', '${story.published_date}', '${category}', '${tags}')`);
    });
  }
});

sql += storyValues.join(',\n') + '\n';
sql += `) AS s(company_name, title, summary, source_url, published_date, category, tags)
WHERE ci.name = s.company_name;\n\n`;

sql += `-- 完成
SELECT 'AIverse简化数据插入完成！共${data.length}家公司' as status;`;

// 写入文件
fs.writeFileSync('insert-aiverse-data-simple.sql', sql);

console.log(`✅ 简化SQL脚本已生成: insert-aiverse-data-simple.sql`);
console.log(`📊 包含 ${data.length} 家公司数据`);
console.log(`📊 包含 ${projectValues.length} 个项目`);
console.log(`📊 包含 ${fundingValues.length} 轮融资`);
console.log(`📊 包含 ${storyValues.length} 篇新闻`);
