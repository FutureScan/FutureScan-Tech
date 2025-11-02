'use client';

import { MarketSentiment } from '@/types';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface SentimentCardProps {
  sentiment: MarketSentiment | null;
  loading?: boolean;
}

export function SentimentCard({ sentiment, loading }: SentimentCardProps) {
  if (loading || !sentiment) {
    return (
      <div className="card p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent animate-pulse"></div>
        <div className="animate-pulse">
          <div className="h-6 bg-[#ff6b35]/10 rounded w-1/3 mb-6"></div>
          <div className="h-32 bg-[#ff6b35]/10 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const getColor = () => {
    switch (sentiment.classification) {
      case 'extreme_fear':
        return '#ef4444';
      case 'fear':
        return '#f97316';
      case 'neutral':
        return '#eab308';
      case 'greed':
        return '#22c55e';
      case 'extreme_greed':
        return '#10b981';
      default:
        return '#gray-500';
    }
  };

  const getGradient = () => {
    const color = getColor();
    return `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`;
  };

  const getLabel = () => {
    return sentiment.classification.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const color = getColor();

  return (
    <div className="card p-8 relative overflow-hidden group">
      {/* Animated top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent"></div>

      {/* Scan line effect */}
      <div className="scan-effect absolute inset-0 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white/90 mb-1">Market Sentiment</h3>
          <p className="text-sm text-gray-500 font-mono">Fear & Greed Index</p>
        </div>
        <div className="relative">
          <div className={`absolute inset-0 blur-xl opacity-50`} style={{ backgroundColor: color }}></div>
          {sentiment.value > 50 ? (
            <TrendingUp className="relative z-10" size={28} style={{ color }} />
          ) : (
            <TrendingDown className="relative z-10" size={28} style={{ color }} />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center relative">
        {/* Main value with glow */}
        <div className="relative mb-4">
          <div
            className="absolute inset-0 blur-2xl opacity-60"
            style={{ backgroundColor: color }}
          ></div>
          <div
            className="relative text-7xl md:text-8xl font-bold font-mono"
            style={{
              color,
              textShadow: `0 0 30px ${color}80, 0 0 60px ${color}40`
            }}
          >
            {sentiment.value}
          </div>
        </div>

        {/* Classification badge */}
        <div
          className="px-6 py-3 rounded-full mb-6 border-2 backdrop-blur-sm relative overflow-hidden"
          style={{
            backgroundColor: `${color}15`,
            borderColor: `${color}40`
          }}
        >
          <span
            className="font-bold text-sm tracking-wider uppercase"
            style={{ color }}
          >
            {getLabel()}
          </span>
        </div>

        {/* Progress bar with gradient */}
        <div className="w-full bg-black/50 rounded-full h-4 overflow-hidden border border-[#ff6b35]/20 mb-4">
          <div
            className="h-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{
              width: `${sentiment.value}%`,
              background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full flex justify-between text-xs text-gray-500 font-mono mt-2">
          <span>0</span>
          <span>Extreme Fear</span>
          <span>Neutral</span>
          <span>Extreme Greed</span>
          <span>100</span>
        </div>

        <p className="text-sm text-gray-500 mt-6 text-center leading-relaxed">
          Measures market psychology from 0 (extreme fear) to 100 (extreme greed) using volatility, momentum, and sentiment data
        </p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
