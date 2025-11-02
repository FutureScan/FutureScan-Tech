// News and Sentiment API integration
import { NewsArticle, MarketSentiment } from '@/types';
import { cache, rateLimiter, fetchWithRetry } from './api-client';

// CryptoCompare News API (free)
const CRYPTOCOMPARE_BASE = 'https://min-api.cryptocompare.com/data/v2';

export async function getCryptoNews(limit = 50): Promise<NewsArticle[]> {
  const cacheKey = `crypto-news-${limit}`;
  const cached = cache.get<NewsArticle[]>(cacheKey, 300000); // 5 min cache
  if (cached) return cached;

  await rateLimiter.waitForSlot('cryptocompare');

  const url = `${CRYPTOCOMPARE_BASE}/news/?lang=EN&sortOrder=latest`;

  try {
    const data = await fetchWithRetry(url);
    if (!data || !data.Data) return [];

    const articles: NewsArticle[] = data.Data.slice(0, limit).map((article: any) => {
      // Analyze sentiment based on title keywords
      const sentiment = analyzeSentiment(article.title + ' ' + article.body);

      return {
        id: article.id,
        title: article.title,
        description: article.body,
        url: article.url,
        source: article.source_info?.name || article.source,
        published_at: article.published_on * 1000,
        sentiment,
        related_coins: article.categories?.split('|').slice(0, 3) || [],
        image_url: article.imageurl,
      };
    });

    cache.set(cacheKey, articles);
    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// Simple sentiment analysis based on keywords
function analyzeSentiment(text: string): 'bullish' | 'bearish' | 'neutral' {
  const lowerText = text.toLowerCase();

  const bullishKeywords = [
    'surge', 'rally', 'soar', 'gain', 'rise', 'up', 'bull', 'positive',
    'growth', 'increase', 'high', 'breakthrough', 'adoption', 'partnership'
  ];

  const bearishKeywords = [
    'crash', 'plunge', 'drop', 'fall', 'decline', 'down', 'bear', 'negative',
    'loss', 'decrease', 'low', 'concern', 'risk', 'warning', 'regulation'
  ];

  let bullishScore = 0;
  let bearishScore = 0;

  bullishKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) bullishScore++;
  });

  bearishKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) bearishScore++;
  });

  if (bullishScore > bearishScore) return 'bullish';
  if (bearishScore > bullishScore) return 'bearish';
  return 'neutral';
}

// Alternative.me Fear & Greed Index
export async function getFearGreedIndex(): Promise<MarketSentiment | null> {
  const cacheKey = 'fear-greed-index';
  const cached = cache.get<MarketSentiment>(cacheKey, 3600000); // 1 hour cache
  if (cached) return cached;

  await rateLimiter.waitForSlot('alternative');

  const url = 'https://api.alternative.me/fng/';

  try {
    const data = await fetchWithRetry(url);
    if (!data || !data.data || !data.data[0]) {
      return null;
    }

    const fng = data.data[0];
    const value = parseInt(fng.value);

    let classification: MarketSentiment['classification'];
    if (value <= 20) classification = 'extreme_fear';
    else if (value <= 40) classification = 'fear';
    else if (value <= 60) classification = 'neutral';
    else if (value <= 80) classification = 'greed';
    else classification = 'extreme_greed';

    const sentiment: MarketSentiment = {
      value,
      classification,
      timestamp: parseInt(fng.timestamp) * 1000,
    };

    cache.set(cacheKey, sentiment);
    return sentiment;
  } catch (error) {
    console.error('Error fetching fear & greed index:', error);
    return null;
  }
}
