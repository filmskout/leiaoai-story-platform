// Saves preferred language selection
// - Persists via cookie; if future auth/session is available, can sync to DB
export default async function handler(req: any, res: any) {
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


