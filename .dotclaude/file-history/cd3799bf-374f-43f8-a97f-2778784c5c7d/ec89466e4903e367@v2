// CoinGecko API integration (Free tier)
import { CryptoAsset, ChartDataPoint } from '@/types';
import { cache, rateLimiter, fetchWithRetry } from './api-client';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export async function getTopCryptos(limit = 50): Promise<CryptoAsset[]> {
  const cacheKey = `top-cryptos-${limit}`;
  const cached = cache.get<CryptoAsset[]>(cacheKey, 120000); // 2 min cache
  if (cached) return cached;

  await rateLimiter.waitForSlot('coingecko');

  const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=7d`;

  const data = await fetchWithRetry(url);
  cache.set(cacheKey, data);
  return data;
}

export async function getCryptoDetails(coinId: string): Promise<CryptoAsset> {
  const cacheKey = `crypto-${coinId}`;
  const cached = cache.get<CryptoAsset>(cacheKey, 60000); // 1 min cache
  if (cached) return cached;

  await rateLimiter.waitForSlot('coingecko');

  const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${coinId}&sparkline=true&price_change_percentage=7d`;

  const data = await fetchWithRetry(url);
  const result = data[0];
  cache.set(cacheKey, result);
  return result;
}

export async function getChartData(
  coinId: string,
  days: number = 7
): Promise<ChartDataPoint[]> {
  const cacheKey = `chart-${coinId}-${days}`;
  const cached = cache.get<ChartDataPoint[]>(cacheKey, 300000); // 5 min cache
  if (cached) return cached;

  await rateLimiter.waitForSlot('coingecko');

  const url = `${COINGECKO_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;

  const data = await fetchWithRetry(url);
  const chartData = data.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
  }));

  cache.set(cacheKey, chartData);
  return chartData;
}

export async function searchCrypto(query: string): Promise<CryptoAsset[]> {
  await rateLimiter.waitForSlot('coingecko');

  const url = `${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`;
  const data = await fetchWithRetry(url);

  // Get details for top 10 results
  const coinIds = data.coins.slice(0, 10).map((c: any) => c.id).join(',');
  if (!coinIds) return [];

  const detailsUrl = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${coinIds}`;
  return await fetchWithRetry(detailsUrl);
}
