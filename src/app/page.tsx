'use client';

import { useEffect, useState } from 'react';
import { CryptoAsset, NewsArticle, MarketSentiment } from '@/types';
import { getTopCryptos, getCryptoDetails } from '@/lib/crypto-api';
import { getCryptoNews, getFearGreedIndex } from '@/lib/news-api';
import { useAppStore } from '@/store/app-store';
import { SentimentCard } from '@/components/SentimentCard';
import { Watchlist } from '@/components/Watchlist';
import { NewsList } from '@/components/NewsList';
import { CryptoCalculator } from '@/components/CryptoCalculator';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { watchlist } = useAppStore();
  const [watchlistCryptos, setWatchlistCryptos] = useState<CryptoAsset[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [watchlist]);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // Load all data in parallel
      const [sentimentData, newsData, ...watchlistData] = await Promise.all([
        getFearGreedIndex(),
        getCryptoNews(10),
        ...watchlist.map(item => getCryptoDetails(item.coin_id)),
      ]);

      setSentiment(sentimentData);
      setNews(newsData);
      setWatchlistCryptos(watchlistData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome to <span className="gradient-text">FutureScan</span>
          </h1>
          <p className="text-gray-400">
            Your comprehensive crypto intelligence dashboard for swing trading
          </p>
        </div>

        {/* Top Section: Sentiment + Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SentimentCard sentiment={sentiment} loading={loading} />
          <CryptoCalculator />
        </div>

        {/* Watchlist */}
        <div className="mb-6">
          <Watchlist cryptos={watchlistCryptos} loading={loading} />
        </div>

        {/* Latest News Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Latest News</h2>
            <Link
              href="/news"
              className="flex items-center gap-2 text-[#ff6b35] hover:text-[#e85a26] transition-colors"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <NewsList articles={news} loading={loading} limit={4} />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link
            href="/insiders"
            className="card p-6 hover:border-[#ff6b35] transition-colors group"
          >
            <h3 className="text-lg font-semibold mb-2 group-hover:text-[#ff6b35] transition-colors">
              Insider Signals
            </h3>
            <p className="text-sm text-gray-400">
              Track whale movements and accumulation patterns
            </p>
          </Link>

          <Link
            href="/signals"
            className="card p-6 hover:border-[#ff6b35] transition-colors group"
          >
            <h3 className="text-lg font-semibold mb-2 group-hover:text-[#ff6b35] transition-colors">
              AI Trading Signals
            </h3>
            <p className="text-sm text-gray-400">
              Get data-driven buy/sell recommendations
            </p>
          </Link>

          <Link
            href="/settings"
            className="card p-6 hover:border-[#ff6b35] transition-colors group"
          >
            <h3 className="text-lg font-semibold mb-2 group-hover:text-[#ff6b35] transition-colors">
              Manage Watchlist
            </h3>
            <p className="text-sm text-gray-400">
              Add or remove coins from your watchlist
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

