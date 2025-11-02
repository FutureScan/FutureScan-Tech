'use client';

import { NewsArticle } from '@/types';
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const getSentimentIcon = () => {
    switch (article.sentiment) {
      case 'bullish':
        return <TrendingUp className="text-green-500" size={16} />;
      case 'bearish':
        return <TrendingDown className="text-red-500" size={16} />;
      default:
        return <Minus className="text-gray-500" size={16} />;
    }
  };

  const getSentimentColor = () => {
    switch (article.sentiment) {
      case 'bullish':
        return 'bg-green-500/20 text-green-500';
      case 'bearish':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="card p-5 hover:border-[#3a3a3a] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSentimentColor()} flex items-center gap-1`}>
            {getSentimentIcon()}
            {article.sentiment || 'neutral'}
          </span>
          <span className="text-xs text-gray-500">{article.source}</span>
        </div>
        <span className="text-xs text-gray-600 whitespace-nowrap">
          {formatDistanceToNow(article.published_at, { addSuffix: true })}
        </span>
      </div>

      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
        {article.title}
      </h3>

      <p className="text-sm text-gray-400 mb-4 line-clamp-3">
        {article.description}
      </p>

      {article.related_coins && article.related_coins.length > 0 && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {article.related_coins.slice(0, 3).map((coin) => (
            <span
              key={coin}
              className="px-2 py-1 bg-[#0a0a0a] rounded text-xs text-gray-400"
            >
              {coin}
            </span>
          ))}
        </div>
      )}

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-[#ff6b35] hover:text-[#e85a26] transition-colors"
      >
        Read more
        <ExternalLink size={14} />
      </a>
    </div>
  );
}

interface NewsListProps {
  articles: NewsArticle[];
  loading?: boolean;
  limit?: number;
}

export function NewsList({ articles, loading, limit }: NewsListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-1/4 mb-3" />
            <div className="h-6 bg-gray-800 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-800 rounded w-full mb-2" />
            <div className="h-4 bg-gray-800 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  const displayArticles = limit ? articles.slice(0, limit) : articles;

  return (
    <div className="space-y-4">
      {displayArticles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
