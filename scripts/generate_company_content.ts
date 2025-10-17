import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string;
const openaiKey = process.env.OPENAI_API_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or Service Key environment variables.');
}
if (!openaiKey) {
  throw new Error('Missing OPENAI_API_KEY environment variable.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function generateDescription(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: '你是资深AI行业分析师, 用中英双语简洁撰写, 先中文后英文, 各2-3句。' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.6,
  });
  return completion.choices[0]?.message?.content?.trim() || '';
}

async function enrichCompanies() {
  const { data: companies, error } = await supabase
    .from('companies')
    .select('*')
    .limit(500);
  if (error) throw error;

  for (const c of companies || []) {
    const need = !c.description || c.description.length < 40;
    if (!need) continue;
    const prompt = `为AI公司撰写简介: 名称: ${c.name}; 官网: ${c.website || ''}; 标签: ${(c.industry_tags || []).join(', ')}。重点: 产品/工具套件, 行业定位, 典型应用场景, 差异化优势。`;
    const desc = await generateDescription(prompt);
    const { error: upErr } = await supabase.from('companies').update({ description: desc }).eq('id', c.id);
    if (upErr) console.error('Update company failed', c.name, upErr.message);
  }
}

async function enrichTools() {
  const { data: tools, error } = await supabase
    .from('tools')
    .select('*')
    .limit(1000);
  if (error) throw error;

  for (const t of tools || []) {
    const need = !t.description || t.description.length < 40;
    if (!need) continue;
    const prompt = `为AI工具撰写简介: 名称: ${t.name}; 类别: ${t.category}; 官网: ${t.website || ''}; 特性: ${(t.features || []).join(', ')}; 标签: ${(t.industry_tags || []).join(', ')}。重点: 能力, 典型使用场景, 目标用户, 定价与API(如适用)。`;
    const desc = await generateDescription(prompt);
    const { error: upErr } = await supabase.from('tools').update({ description: desc }).eq('id', t.id);
    if (upErr) console.error('Update tool failed', t.name, upErr.message);
  }
}

async function main() {
  console.log('Enriching companies...');
  await enrichCompanies();
  console.log('Enriching tools...');
  await enrichTools();
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


