export function extractDomain(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const d = new URL(url).hostname.replace(/^www\./, '');
    return d;
  } catch {
    return undefined;
  }
}

export function getLogoUrlFromLink(link?: string, fallback?: string): string | undefined {
  const domain = extractDomain(link);
  if (fallback) return fallback;
  if (!domain) return undefined;
  return `https://logo.clearbit.com/${domain}`;
}


