import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const client = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    res.status(500).json({ error: 'Supabase environment not configured' });
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    const { domains } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!Array.isArray(domains) || domains.length === 0) {
      res.status(400).json({ error: 'domains required' });
      return;
    }

    // Freshness window: 30 days
    const freshBefore = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const results: Record<string, any> = {};

    for (const domain of domains) {
      if (typeof domain !== 'string' || !domain) continue;

      // Check cache
      const { data: cached } = await supabase
        .from('company_research')
        .select('*')
        .eq('company_domain', domain)
        .maybeSingle();

      if (cached && cached.updated_at > freshBefore) {
        results[domain] = cached;
        continue;
      }

      if (!client) {
        // Without OpenAI, just keep previous cache
        if (cached) results[domain] = cached;
        continue;
      }

      const prompt = `You are an analyst. Research public information about the company behind domain: ${domain}.
Return a concise JSON with keys: 
- summary (<=120 words), 
- funding_highlights (<=3 bullet points as a single string),
- current_round (e.g., Seed/A/B/C/IPO/Private/Undisclosed),
- overall_score (0-100 integer, your overall quality/traction assessment based on public info).
If unknown, leave empty/null.`;

      let summary = '';
      let funding_highlights = '';
      let source_json: any = {};
      let current_round = '';
      let overall_score: number | null = null;

      try {
        const resp = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You output strict JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
        });
        const text = resp.choices?.[0]?.message?.content?.trim() || '{}';
        source_json = JSON.parse(text);
        summary = String(source_json.summary || '');
        funding_highlights = String(source_json.funding_highlights || '');
        current_round = String(source_json.current_round || '');
        const score = source_json.overall_score;
        overall_score = typeof score === 'number' ? Math.max(0, Math.min(100, Math.round(score))) : null;
      } catch (e: any) {
        // Fallback minimal record
        summary = summary || '';
        funding_highlights = funding_highlights || '';
        source_json = source_json || {};
        current_round = current_round || '';
        overall_score = overall_score ?? null;
      }

      // Upsert
      const { data: up } = await supabase
        .from('company_research')
        .upsert({ company_domain: domain, summary, funding_highlights, current_round, overall_score, source_json, updated_at: new Date().toISOString() }, { onConflict: 'company_domain' })
        .select('*')
        .single();

      results[domain] = up;
    }

    res.status(200).json({ ok: true, results });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'unknown error' });
  }
}


