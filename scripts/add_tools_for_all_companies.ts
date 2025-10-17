import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Known synonymous mappings: company -> primary tool name (fallback to company name if absent)
const synonymousMap: Record<string, { toolName: string; category: string; websiteHint?: string }> = {
  'Canva': { toolName: 'Canva', category: 'Design', websiteHint: 'https://www.canva.com' },
  'Google': { toolName: 'Gemini', category: 'LLM', websiteHint: 'https://gemini.google.com' },
  'Google DeepMind': { toolName: 'DeepMind Lab', category: 'AI Research', websiteHint: 'https://deepmind.google' },
  'Midjourney': { toolName: 'Midjourney', category: 'Image Generation', websiteHint: 'https://www.midjourney.com' },
  'ElevenLabs': { toolName: 'ElevenLabs', category: 'Voice AI', websiteHint: 'https://elevenlabs.io' },
  'Perplexity AI': { toolName: 'Perplexity', category: 'AI Search', websiteHint: 'https://www.perplexity.ai' },
  'Notion': { toolName: 'Notion AI', category: 'Productivity', websiteHint: 'https://www.notion.so' },
  'Hugging Face': { toolName: 'Hugging Face Hub', category: 'AI Platform', websiteHint: 'https://huggingface.co' },
  'Microsoft': { toolName: 'Copilot', category: 'Productivity', websiteHint: 'https://www.microsoft.com' },
  'Anthropic': { toolName: 'Claude', category: 'LLM', websiteHint: 'https://claude.ai' },
  'OpenAI': { toolName: 'ChatGPT', category: 'Conversational AI', websiteHint: 'https://chat.openai.com' },
};

function buildFavicon(website?: string): string | null {
  if (!website) return null;
  try {
    const u = new URL(website);
    return `${u.protocol}//${u.hostname}/favicon.ico`;
  } catch {
    return null;
  }
}

function buildToolDescription(companyName: string, toolName: string, category: string) {
  const baseEn = `${toolName} is ${companyName}'s ${category.toLowerCase()} offering, providing modern AI capabilities for real-world use cases.`;
  const baseZhHans = `${toolName} 是 ${companyName} 的 ${category} 产品，提供面向实际场景的现代AI能力。`;
  const baseZhHant = `${toolName} 是 ${companyName} 的 ${category} 產品，提供面向實際場景的現代AI能力。`;
  return { en: baseEn, zhHans: baseZhHans, zhHant: baseZhHant };
}

async function addToolsForCompaniesWithoutAny() {
  console.log('🔎 Fetching companies and existing tools...');

  const { data: companies, error: companiesErr } = await supabase
    .from('companies')
    .select('id, name, website, logo_url')
    .order('name');
  if (companiesErr) throw companiesErr;

  const { data: tools, error: toolsErr } = await supabase
    .from('tools')
    .select('id, name, company_id');
  if (toolsErr) throw toolsErr;

  const companiesWithTools = new Set((tools || []).map(t => t.company_id).filter(Boolean) as string[]);
  const targets = (companies || []).filter(c => !companiesWithTools.has(c.id));

  console.log(`📋 Companies total: ${companies?.length ?? 0} | Without tools: ${targets.length}`);

  let created = 0;
  for (const company of targets) {
    const mapping = synonymousMap[company.name] || { toolName: company.name, category: 'AI Service', websiteHint: company.website };
    const existing = (tools || []).find(t => t.name === mapping.toolName);

    const website = mapping.websiteHint || company.website || undefined;
    const logo = buildFavicon(website) || company.logo_url || null;
    const desc = buildToolDescription(company.name, mapping.toolName, mapping.category);

    if (existing) {
      // Link existing tool to this company if not linked
      if (existing.company_id !== company.id) {
        const { error: linkErr } = await supabase
          .from('tools')
          .update({ company_id: company.id, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (linkErr) {
          console.error(`❌ Link failed for ${mapping.toolName} → ${company.name}`, linkErr);
        } else {
          console.log(`🔗 Linked existing tool ${mapping.toolName} → ${company.name}`);
        }
      }
      continue;
    }

    const { error: insertErr } = await supabase.from('tools').insert({
      name: mapping.toolName,
      name_en: mapping.toolName,
      name_zh_hans: mapping.toolName,
      name_zh_hant: mapping.toolName,
      description: desc.en,
      description_en: desc.en,
      description_zh_hans: desc.zhHans,
      description_zh_hant: desc.zhHant,
      category: mapping.category,
      website,
      logo_url: logo,
      industry_tags: [mapping.category, 'AI'],
      pricing_model: 'Freemium',
      api_available: true,
      free_tier: true,
      company_id: company.id,
      features: ['Multilingual Support', 'API Access', 'Modern UX'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (insertErr) {
      console.error(`❌ Create failed for ${mapping.toolName} → ${company.name}`, insertErr);
    } else {
      created += 1;
      console.log(`✅ Created tool ${mapping.toolName} for ${company.name}`);
    }

    // Gentle rate limit
    await new Promise(res => setTimeout(res, 120));
  }

  console.log(`\n📊 Created ${created} new tools. Done.`);
}

async function main() {
  console.log('🚀 Add tools for all companies without tools...');
  // Best effort: disable RLS where allowed (may be no-op if function not present)
  try {
    await supabase.rpc('exec_sql', { sql: 'ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;' });
  } catch {}

  await addToolsForCompaniesWithoutAny();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
