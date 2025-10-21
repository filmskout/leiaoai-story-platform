import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req: any, res: any) {
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
    const { domains, models } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
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

      // Generate research data using Cursor AI (simulated)
      const researchData = {
        company_domain: domain,
        company_name: domain.charAt(0).toUpperCase() + domain.slice(1),
        description: `AI company specializing in ${domain} domain`,
        industry_tags: [domain, 'AI', 'Technology'],
        funding_status: 'Unknown',
        valuation_usd: null,
        headquarters: 'Unknown',
        website: `https://${domain}.com`,
        social_links: {},
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      // Save to cache
      const { error: upsertError } = await supabase
        .from('company_research')
        .upsert(researchData, { onConflict: 'company_domain' });

      if (upsertError) {
        console.error('Upsert error:', upsertError);
      }

      results[domain] = researchData;
    }

    res.status(200).json({ results });
  } catch (error: any) {
    console.error('Research error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}