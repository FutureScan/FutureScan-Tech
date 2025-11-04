'use client';

import { useEffect, useState } from 'react';
import { CryptoAsset, NewsArticle, MarketSentiment } from '@/types';
import { getTopCryptos, getCryptoDetails } from '@/lib/crypto-api';
import { getCryptoNews, getFearGreedIndex } from '@/lib/news-api';
import { useAppStore } from '@/store/app-store';
import { SentimentCard } from '@/components/SentimentCard';
import { Watchlist } from '@/components/Watchlist';
import { NewsList } from '@/components/NewsList';
import Link from 'next/link';
import { ArrowRight, Zap, TrendingUp, Newspaper, Activity, ShoppingCart, DollarSign, Shield } from 'lucide-react';
import Image from 'next/image';

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
      const promises = [
        getFearGreedIndex().catch(() => null),
        getCryptoNews(10).catch(() => []),
        ...watchlist.map(item => getCryptoDetails(item.coin_id).catch(() => null)),
      ];

      const [sentimentData, newsData, ...watchlistData] = await Promise.all(promises);

      setSentiment(sentimentData as MarketSentiment | null);
      setNews(newsData as NewsArticle[]);
      setWatchlistCryptos(watchlistData.filter(Boolean) as CryptoAsset[]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-[#ff6b35]/20">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff6b35] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#e85a26] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#ff6b35] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Text content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20 mb-6">
                  <Activity className="text-[#ff6b35]" size={16} />
                  <span className="text-sm font-mono text-[#ff6b35]">Live Data • v1.0</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Welcome to{' '}
                  <span className="gradient-text block md:inline mt-2 md:mt-0">
                    FutureScan
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-400 mb-6 max-w-2xl">
                  AI-Powered Crypto Intelligence for{' '}
                  <span className="text-[#ff6b35] font-semibold">Swing Traders</span>
                </p>

                <p className="text-gray-500 max-w-xl leading-relaxed">
                  Real-time market analysis, sentiment tracking, insider signals, and AI trading recommendations—all without looking at charts.
                </p>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 max-w-md">
                  <div className="stat-card p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-[#ff6b35] mb-1">9+</div>
                    <div className="text-xs text-gray-500">Data Sources</div>
                  </div>
                  <div className="stat-card p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-[#ff6b35] mb-1">24/7</div>
                    <div className="text-xs text-gray-500">Live Updates</div>
                  </div>
                  <div className="stat-card p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-[#ff6b35] mb-1">2-4w</div>
                    <div className="text-xs text-gray-500">Target Period</div>
                  </div>
                </div>
              </div>

              {/* Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#ff6b35] blur-3xl opacity-40 animate-pulse"></div>
                <Image
                  src="/logo.png"
                  alt="FutureScan"
                  width={280}
                  height={280}
                  className="relative z-10"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>

      {/* Main content */}
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Sentiment */}
          <SentimentCard sentiment={sentiment} loading={loading} />

          {/* Watchlist */}
          <Watchlist cryptos={watchlistCryptos} loading={loading} />

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/insiders"
              className="group card p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#e85a26]/10 group-hover:from-[#ff6b35]/30 group-hover:to-[#e85a26]/20 transition-all">
                  <TrendingUp className="text-[#ff6b35]" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-[#ff6b35] transition-colors">
                    Insider Signals
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Track whale movements and accumulation patterns
                  </p>
                </div>
                <ArrowRight className="text-gray-600 group-hover:text-[#ff6b35] transition-colors" size={20} />
              </div>
            </Link>

            <Link
              href="/signals"
              className="group card p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#e85a26]/10 group-hover:from-[#ff6b35]/30 group-hover:to-[#e85a26]/20 transition-all">
                  <Zap className="text-[#ff6b35]" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-[#ff6b35] transition-colors">
                    AI Trading Signals
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Get data-driven buy/sell recommendations
                  </p>
                </div>
                <ArrowRight className="text-gray-600 group-hover:text-[#ff6b35] transition-colors" size={20} />
              </div>
            </Link>

            <Link
              href="/news"
              className="group card p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#e85a26]/10 group-hover:from-[#ff6b35]/30 group-hover:to-[#e85a26]/20 transition-all">
                  <Newspaper className="text-[#ff6b35]" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-[#ff6b35] transition-colors">
                    News & Sentiment
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    AI-powered sentiment analysis on crypto news
                  </p>
                </div>
                <ArrowRight className="text-gray-600 group-hover:text-[#ff6b35] transition-colors" size={20} />
              </div>
            </Link>
          </div>

          {/* x402 Marketplace Advertisement - Professional Banner */}
          <div className="relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35]/10 via-purple-500/10 to-blue-500/10 animate-gradient"></div>

            <div className="relative card p-8 md:p-12 border-2 border-[#ff6b35]/30">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left: Content */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6b35]/20 border border-[#ff6b35]/40 mb-4">
                    <Shield className="text-[#ff6b35]" size={16} />
                    <span className="text-sm font-mono text-[#ff6b35] font-semibold">x402 Protocol • Powered by Solana</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black mb-4">
                    <span className="gradient-text">Decentralized Marketplace</span>
                  </h2>

                  <p className="text-gray-400 text-lg leading-relaxed mb-6">
                    Buy and sell crypto intelligence products with <span className="text-[#ff6b35] font-semibold">instant payment settlement</span> using the official x402 protocol. Trade signals, research, data feeds, and more.
                  </p>

                  {/* Features grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#ff6b35]/20 flex items-center justify-center">
                        <Shield size={16} className="text-[#ff6b35]" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-1">Secure Payments</div>
                        <div className="text-xs text-gray-500">Blockchain-verified transactions</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <DollarSign size={16} className="text-purple-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-1">Multiple Tokens</div>
                        <div className="text-xs text-gray-500">SOL, USDC, BONK & more</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Zap size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-1">Instant Access</div>
                        <div className="text-xs text-gray-500">Immediate product delivery</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <TrendingUp size={16} className="text-green-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-1">No Middleman</div>
                        <div className="text-xs text-gray-500">Direct peer-to-peer</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/marketplace"
                      className="group relative px-8 py-4 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-[#ff6b35]/30 flex items-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Browse Marketplace
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/marketplace/dashboard"
                      className="px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-[#ff6b35]/50 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"
                    >
                      Start Selling
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>

                {/* Right: Visual with Logo */}
                <div className="relative">
                  {/* Background glow effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35]/20 via-purple-500/20 to-blue-500/20 blur-3xl animate-pulse"></div>

                  {/* Card with stats */}
                  <div className="relative glass-card p-8 border border-[#ff6b35]/30">
                    {/* Logo at top */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#ff6b35] blur-2xl opacity-50 animate-pulse"></div>
                        <Image
                          src="/logo.png"
                          alt="FutureScan"
                          width={120}
                          height={120}
                          className="relative z-10"
                        />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-center mb-6 gradient-text">Marketplace Stats</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#ff6b35]/10 to-transparent">
                        <span className="text-gray-400">Active Listings</span>
                        <span className="text-2xl font-black gradient-text">Live</span>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent">
                        <span className="text-gray-400">Payment Methods</span>
                        <span className="text-2xl font-black text-purple-400">6 Tokens</span>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent">
                        <span className="text-gray-400">Settlement</span>
                        <span className="text-2xl font-black text-blue-400">Instant</span>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent">
                        <span className="text-gray-400">Fees</span>
                        <span className="text-2xl font-black text-green-400">0%</span>
                      </div>
                    </div>

                    {/* Protocol badge */}
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#ff6b35]/20 to-purple-500/20 border border-[#ff6b35]/30 text-center">
                      <div className="text-xs text-gray-400 mb-1">Powered by</div>
                      <div className="font-mono font-bold text-[#ff6b35]">x402 Protocol</div>
                      <div className="text-xs text-gray-500 mt-1">Official Coinbase Implementation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <style jsx>{`
              @keyframes gradient {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              .animate-gradient {
                background-size: 200% 200%;
                animation: gradient 5s ease infinite;
              }
            `}</style>
          </div>

          {/* Latest News */}
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Newspaper className="text-[#ff6b35]" size={24} />
                <h2 className="text-2xl font-bold">Latest News</h2>
              </div>
              <Link
                href="/news"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6b35]/10 hover:bg-[#ff6b35]/20 text-[#ff6b35] font-medium transition-all hover:scale-105"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-5 rounded-xl bg-[#ff6b35]/5 animate-pulse">
                    <div className="h-4 bg-[#ff6b35]/20 rounded w-1/4 mb-3" />
                    <div className="h-6 bg-[#ff6b35]/20 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-[#ff6b35]/10 rounded w-full mb-2" />
                    <div className="h-4 bg-[#ff6b35]/10 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : news.length > 0 ? (
              <NewsList articles={news} limit={4} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Newspaper className="mx-auto mb-4 opacity-20" size={48} />
                <p>No news available at the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

