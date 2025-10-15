import type { VercelRequest, VercelResponse } from '@vercel/node';

// Saves preferred language selection
// - Persists via cookie; if future auth/session is available, can sync to DB
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { language } = req.body || {};
    const lang = typeof language === 'string' && language.length <= 10 ? language : 'en';

    // Set cookie for 1 year to remember user choice
    res.setHeader('Set-Cookie', [
      `preferred_language=${encodeURIComponent(lang)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`,
    ]);

    console.log('[save-language-preference] set', { lang });
    res.status(200).json({ ok: true, language: lang });
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
    if (!language || typeof language !== 'string') {
      return res.status(400).json({ error: 'language is required' });
    }

    // 简单做法：设置首选语言到Cookie（30天）
    res.setHeader('Set-Cookie', `preferred_language=${encodeURIComponent(language)}; Path=/; Max-Age=${30 * 24 * 60 * 60}`);

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'internal_error' });
  }
}


