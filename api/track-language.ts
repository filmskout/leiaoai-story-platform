import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple language tracking endpoint
// - Increments a lightweight cookie-based counter per language
// - Logs to server for observability
// - Can be extended later to persist in Supabase

function getCookie(req: VercelRequest, name: string): string | undefined {
  const cookie = req.headers.cookie || '';
  const parts = cookie.split(/;\s*/);
  for (const part of parts) {
    const [k, v] = part.split('=');
    if (k === name) return decodeURIComponent(v || '');
  }
  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { language } = req.body || {};
    const lang = typeof language === 'string' && language.length <= 10 ? language : 'unknown';

    // Read current cookie counter map
    const raw = getCookie(req, 'lang_visits') || '{}';
    let map: Record<string, number> = {};
    try { map = JSON.parse(raw); } catch { map = {}; }

    map[lang] = (map[lang] || 0) + 1;

    // Log for basic observability
    console.log('[track-language] visit', { lang, total: map[lang] });

    res.setHeader('Set-Cookie', [
      // Keep a small cookie with visit counters (expires in ~30 days)
      `lang_visits=${encodeURIComponent(JSON.stringify(map))}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`,
    ]);

    res.status(200).json({ ok: true, lang, total: map[lang] });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { language } = req.body || {};
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';

    // 目前先记录到日志；后续可接入数据库做持久化统计
    console.log('[language_visit]', { language, ip, at: new Date().toISOString() });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'internal_error' });
  }
}


