  'use server';

import { getDateRange, validateArticle, formatArticle, getTodayString } from '@/lib/utils';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const headers: HeadersInit = {};
  const options: RequestInit & { next?: { revalidate?: number } } = revalidateSeconds
    ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
    : { cache: 'no-store' };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

type FinnhubNews = RawNewsArticle[];

export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
  try {
    const token = NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) throw new Error('Missing FINNHUB API key');

    const { from, to } = getDateRange(5);

    const uniqueSymbols = (symbols || [])
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    const MAX_ITEMS = 6;

    if (uniqueSymbols.length > 0) {
      const collected: MarketNewsArticle[] = [];
      const perSymbolCache: Record<string, FinnhubNews> = {};
      const seen = new Set<string>();

      for (let round = 0; round < MAX_ITEMS; round++) {
        for (let i = 0; i < uniqueSymbols.length && collected.length < MAX_ITEMS; i++) {
          const sym = uniqueSymbols[i];
          if (!perSymbolCache[sym]) {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(sym)}&from=${from}&to=${to}&token=${token}`;
            perSymbolCache[sym] = await fetchJSON<FinnhubNews>(url, 300);
          }

          const list = perSymbolCache[sym];
          const pick = list.find((a, idx) => {
            if (!validateArticle(a)) return false;
            const key = `${a.id}-${a.url}-${a.headline}`;
            if (seen.has(key)) return false;
            // Also avoid taking more than one per round per symbol by using first valid non-seen
            // Index check not required beyond first valid
            return true;
          });

          if (pick) {
            const key = `${pick.id}-${pick.url}-${pick.headline}`;
            seen.add(key);
            collected.push(
              formatArticle(pick, true, sym, collected.length)
            );
          }
        }
        if (collected.length >= MAX_ITEMS) break;
      }

      // Sort by datetime desc
      collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));

      // Fallback to general if nothing collected
      if (collected.length > 0) return collected.slice(0, MAX_ITEMS);
    }

    // General market news fallback
    const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`;
    const general = await fetchJSON<FinnhubNews>(generalUrl, 300);

    const seenGeneral = new Set<string>();
    const formatted: MarketNewsArticle[] = [];
    for (let i = 0; i < general.length && formatted.length < MAX_ITEMS; i++) {
      const a = general[i];
      if (!validateArticle(a)) continue;
      const key = `${a.id}-${a.url}-${a.headline}`;
      if (seenGeneral.has(key)) continue;
      seenGeneral.add(key);
      formatted.push(formatArticle(a, false, undefined, i));
    }

    return formatted.slice(0, MAX_ITEMS);
  } catch (err) {
    console.error('Failed to fetch news:', err);
    throw new Error('Failed to fetch news');
  }
}

// no named exports besides async server actions to comply with Next.js "use server" constraints
