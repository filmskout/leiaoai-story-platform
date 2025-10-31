#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load env
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // optional
const PPLX_API_KEY = process.env.PPLX_API_KEY;     // preferred for web browsing

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const OUT_DIR = path.resolve(process.cwd(), 'OUT');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

// Helpers
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchCompaniesNeedingEnrichment(limit = 60) {
  // Missing: website OR valuation_usd OR company_tier
  const { data, error } = await supabase
    .from('companies')
    .select('id,name,website,valuation_usd,headquarters,founded_year,company_tier')
    .or('website.is.null,website.eq.' + encodeURIComponent('') + ',valuation_usd.is.null,company_tier.is.null')
    .order('name')
    .limit(limit);
  if (error) throw error;
  return data || [];
}

function buildPrompt(companyName) {
  return `You are a precise AI research assistant. Find authoritative, up-to-date, official information for the company: "${companyName}".
Return a strict JSON object with keys:
- website: official homepage URL (https only)
- founded_year: 4-digit year or null
- headquarters: City, Country or null
- valuation_usd: latest known valuation as an integer USD (no decimals, no commas) or null
- tier: one of [Giant, Unicorn, Independent, Emerging] based on these rules:
  - Giant: Big Tech and Chinese giants like Google, OpenAI, Microsoft, Meta, Amazon, Apple, ByteDance, Baidu, Tencent, Alibaba, NVIDIA, Tesla, xAI, etc.
  - Unicorn: valuation >= $1B (include Adobe as Unicorn)
  - Otherwise: Emerging if founded >= 2019, else Independent.
Only output JSON.`;
}

async function callPerplexity(prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PPLX_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        temperature: 0.2,
        max_tokens: 512,
        messages: [
          { role: 'system', content: 'You browse the web and cite reliable, official sources. Output JSON only.' },
          { role: 'user', content: prompt }
        ]
      }),
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`Perplexity ${res.status}: ${await res.text()}`);
    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content || '{}';
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

async function callOpenAI(prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 512,
        messages: [
          { role: 'system', content: 'Output JSON only.' },
          { role: 'user', content: prompt }
        ]
      }),
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content || '{}';
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeTier(raw, fallback) {
  const v = String(raw || '').toLowerCase();
  if (v.includes('giant')) return 'Giant';
  if (v.includes('unicorn')) return 'Unicorn';
  if (v.includes('emerging')) return 'Emerging';
  if (v.includes('independent')) return 'Independent';
  return fallback;
}

function clampValuation(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^0-9]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function ensureHttps(url) {
  if (!url) return null;
  let u = String(url).trim();
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  u = u.replace('http://', 'https://');
  return u;
}

function computeTierByRules(name, valuation, foundedYear, suggested) {
  const GIANTS = new Set(['openai','google','google deepmind','deepmind','microsoft','meta','facebook','amazon','apple','bytedance','tiktok','baidu','tencent','alibaba','aliyun','nvidia','tesla','xai']);
  const nm = name.toLowerCase();
  if (Array.from(GIANTS).some(g => nm.startsWith(g))) return 'Giant';
  if (nm.startsWith('adobe')) return 'Unicorn';
  if (valuation && valuation >= 1_000_000_000) return 'Unicorn';
  if (foundedYear && foundedYear >= 2019) return 'Emerging';
  return suggested || 'Independent';
}

function toSqlUpdate(c, enriched) {
  const sets = [];
  if (enriched.website) sets.push(`website = '${enriched.website.replace(/'/g, "''")}'`);
  if (enriched.founded_year) sets.push(`founded_year = ${enriched.founded_year}`);
  if (enriched.headquarters) sets.push(`headquarters = '${enriched.headquarters.replace(/'/g, "''")}'`);
  if (enriched.valuation_usd) sets.push(`valuation_usd = ${enriched.valuation_usd}`);
  if (enriched.tier) sets.push(`company_tier = '${enriched.tier}'`);
  if (sets.length === 0) return null;
  return `UPDATE companies SET ${sets.join(', ')} WHERE id = '${c.id}';`;
}

async function main() {
  const companies = await fetchCompaniesNeedingEnrichment(200);
  if (companies.length === 0) {
    console.log('No companies need enrichment.');
    return;
  }
  console.log(`Need enrichment: ${companies.length}`);

  const updates = [];
  const report = [];
  for (const c of companies) {
    const prompt = buildPrompt(c.name);
    let raw = null;
    try {
      if (PPLX_API_KEY) raw = await callPerplexity(prompt);
      else if (OPENAI_API_KEY) raw = await callOpenAI(prompt);
      else throw new Error('Missing PPLX_API_KEY or OPENAI_API_KEY');

      let parsed = {};
      try { parsed = JSON.parse(raw); } catch {
        // attempt to extract JSON
        const m = raw.match(/\{[\s\S]*\}/);
        parsed = m ? JSON.parse(m[0]) : {};
      }

      const website = ensureHttps(parsed.website);
      const founded_year = parsed.founded_year ? Number(parsed.founded_year) : null;
      const headquarters = parsed.headquarters || null;
      const valuation_usd = clampValuation(parsed.valuation_usd);
      const suggestedTier = normalizeTier(parsed.tier, null);
      const finalTier = computeTierByRules(c.name, valuation_usd, founded_year, suggestedTier);

      const enriched = { website, founded_year, headquarters, valuation_usd, tier: finalTier };
      const sql = toSqlUpdate(c, enriched);
      if (sql) updates.push(sql);
      report.push({ name: c.name, ...enriched });
    } catch (e) {
      console.error(`Enrich failed: ${c.name}:`, e.message);
    }
    // respectful pacing
    await sleep(1200);
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const sqlPath = path.join(OUT_DIR, `enriched_companies_${ts}.sql`);
  const csvPath = path.join(OUT_DIR, `enriched_companies_${ts}.csv`);

  const sqlContent = updates.length ? updates.join('\n') + '\n' : '-- no updates generated\n';
  fs.writeFileSync(sqlPath, sqlContent, 'utf8');

  const csvLines = [
    'name,website,founded_year,headquarters,valuation_usd,tier',
    ...report.map(r => [
      r.name?.replace(/,/g,' '),
      r.website || '',
      r.founded_year || '',
      (r.headquarters||'').replace(/,/g,' '),
      r.valuation_usd || '',
      r.tier || ''
    ].join(','))
  ];
  fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf8');

  console.log('Generated:');
  console.log('  SQL:', sqlPath);
  console.log('  CSV:', csvPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
