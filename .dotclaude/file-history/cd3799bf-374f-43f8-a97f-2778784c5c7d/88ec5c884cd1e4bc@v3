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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <h1 className="text-5xl md:text-6xl font-black mb-3">
                <span className="gradient-text neon-text">Crypto News</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Real-time crypto news with AI-powered sentiment analysis
              </p>
              <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-[#ff6b35] via-cyan-500 to-transparent rounded-full"></div>
            </div>
            <button
              onClick={loadNews}
              disabled={loading}
              className="glass-card p-4 hover:bg-gray-800/80 rounded-xl transition-all hover:scale-110 disabled:opacity-50 pulse-ring"
              title="Refresh news"
            >
              <RefreshCw
                size={24}
                className={loading ? 'animate-spin text-[#ff6b35]' : 'text-gray-400 hover:text-[#ff6b35] transition-colors'}
              />
            </button>
          </div>

          {/* Sentiment Filters */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#ff6b35] mb-4 tracking-wider uppercase">Filter by Sentiment:</h3>
            <div className="flex flex-wrap gap-3">
              {filterButtons.map((filter) => {
                const Icon = filter.icon;
                const isActive = newsFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    onClick={() => setNewsFilter(filter.value)}
                    className={`group relative px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2 ${
                      isActive
                        ? 'cyber-button text-white glow-orange'
                        : 'glass-card hover:bg-gray-800/80 text-gray-300 hover:text-white'
                    }`}
                  >
                    {Icon && <Icon size={18} className={!isActive ? filter.color : ''} />}
                    {filter.label}
                    {!loading && (
                      <span className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                        (
                        {filter.value === 'all'
                          ? news.length
                          : news.filter((a) => a.sentiment === filter.value).length}
                        )
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg w-1/4 mb-4" />
                <div className="h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg w-3/4 mb-3" />
                <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="glass-card neon-border p-16 text-center">
            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500/20 to-pink-500/10 mb-8 pulse-ring">
              <TrendingUp className="text-cyan-400" size={56} />
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping"></div>
            </div>
            <p className="text-gray-300 text-xl font-bold mb-2">No news articles found</p>
            <p className="text-sm text-gray-500">Try selecting a different sentiment filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
