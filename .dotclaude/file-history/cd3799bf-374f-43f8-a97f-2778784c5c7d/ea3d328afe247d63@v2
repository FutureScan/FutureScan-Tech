'use client';

import { MarketSentiment } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SentimentCardProps {
  sentiment: MarketSentiment | null;
  loading?: boolean;
}

export function SentimentCard({ sentiment, loading }: SentimentCardProps) {
  if (loading || !sentiment) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-gray-800 rounded"></div>
      </div>
    );
  }

  const getColor = () => {
    switch (sentiment.classification) {
      case 'extreme_fear':
        return 'text-red-500';
      case 'fear':
        return 'text-orange-500';
      case 'neutral':
        return 'text-yellow-500';
      case 'greed':
        return 'text-green-400';
      case 'extreme_greed':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  const getBgColor = () => {
    switch (sentiment.classification) {
      case 'extreme_fear':
        return 'bg-red-500/20';
      case 'fear':
        return 'bg-orange-500/20';
      case 'neutral':
        return 'bg-yellow-500/20';
      case 'greed':
        return 'bg-green-400/20';
      case 'extreme_greed':
        return 'bg-green-500/20';
      default:
        return 'bg-gray-500/20';
    }
  };

  const getLabel = () => {
    return sentiment.classification.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-300">Market Sentiment</h3>
        {sentiment.value > 50 ? (
          <TrendingUp className="text-green-500" size={20} />
        ) : (
          <TrendingDown className="text-red-500" size={20} />
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className={`text-6xl font-bold mb-2 ${getColor()}`}>
          {sentiment.value}
        </div>

        <div className={`px-4 py-2 rounded-full ${getBgColor()} mb-4`}>
          <span className={`font-semibold ${getColor()}`}>
            {getLabel()}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              sentiment.value > 50 ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${sentiment.value}%` }}
          />
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Fear & Greed Index measures market sentiment from 0 (extreme fear) to 100 (extreme greed)
        </p>
      </div>
    </div>
  );
}
