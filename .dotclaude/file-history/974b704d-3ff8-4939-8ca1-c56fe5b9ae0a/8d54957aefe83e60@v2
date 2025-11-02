// API Client with rate limiting and caching

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cacheDuration = 60000; // 1 minute default

  get<T>(key: string, maxAge?: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const duration = maxAge || this.cacheDuration;

    if (age > duration) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

class RateLimiter {
  private requests = new Map<string, number[]>();
  private limits = {
    coingecko: { calls: 10, window: 60000 }, // 10 per minute
    cryptocompare: { calls: 20, window: 60000 }, // 20 per minute
    alternative: { calls: 10, window: 60000 }, // 10 per minute
  };

  canMakeRequest(api: keyof typeof this.limits): boolean {
    const limit = this.limits[api];
    const now = Date.now();
    const apiRequests = this.requests.get(api) || [];

    // Remove old requests outside the window
    const recentRequests = apiRequests.filter(time => now - time < limit.window);
    this.requests.set(api, recentRequests);

    return recentRequests.length < limit.calls;
  }

  recordRequest(api: keyof typeof this.limits): void {
    const apiRequests = this.requests.get(api) || [];
    apiRequests.push(Date.now());
    this.requests.set(api, apiRequests);
  }

  async waitForSlot(api: keyof typeof this.limits): Promise<void> {
    while (!this.canMakeRequest(api)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    this.recordRequest(api);
  }
}

export const cache = new ApiCache();
export const rateLimiter = new RateLimiter();

// Generic fetch with error handling
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retries = 3
): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
