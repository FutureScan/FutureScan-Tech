'use client';

import { useEffect, useState } from 'react';
import { NewsArticle } from '@/types';
import { getCryptoNews } from '@/lib/news-api';
import { NewsList } from '@/components/NewsList';
import { useAppStore } from '@/store/app-store';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';

export default function NewsPage() {
  const { newsFilter, setNewsFilter } = useAppStore();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      setLoading(true);
      const data = await getCryptoNews(100);
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredNews =
    newsFilter === 'all'
      ? news
      : news.filter((article) => article.sentiment === newsFilter);

  const filterButtons = [
    { value: 'all' as const, label: 'All News', icon: null },
    { value: 'bullish' as const, label: 'Bullish', icon: TrendingUp, color: 'text-green-500' },
    { value: 'neutral' as const, label: 'Neutral', icon: Minus, color: 'text-gray-500' },
    { value: 'bearish' as const, label: 'Bearish', icon: TrendingDown, color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Crypto News</h1>
              <p className="text-gray-400">
                Real-time crypto news with AI-powered sentiment analysis
              </p>
            </div>
            <button
              onClick={loadNews}
              disabled={loading}
              className="p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors disabled:opacity-50"
              title="Refresh news"
            >
              <RefreshCw
                size={20}
                className={loading ? 'animate-spin text-[#ff6b35]' : 'text-gray-400'}
              />
            </button>
          </div>

          {/* Sentiment Filters */}
          <div className="flex flex-wrap gap-3">
            {filterButtons.map((filter) => {
              const Icon = filter.icon;
              const isActive = newsFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  onClick={() => setNewsFilter(filter.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  {Icon && <Icon size={16} className={!isActive ? filter.color : ''} />}
                  {filter.label}
                  {!loading && (
                    <span className="text-xs opacity-70">
                      (
                      {filter.value === 'all'
                        ? news.length
                        : news.filter((a) => a.sentiment === filter.value).length}
                      )
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 bg-gray-800 rounded w-1/4 mb-3" />
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                <div className="h-4 bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-400 text-lg">No news articles found for this filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNews.map((article) => (
              <div key={article.id}>
                <NewsList articles={[article]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
