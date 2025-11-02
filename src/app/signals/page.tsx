'use client';

import { useEffect, useState } from 'react';
import { TradingSignal } from '@/types';
import { getTradingSignals } from '@/lib/signals-api';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Target,
  Shield,
  Clock,
  Activity,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SignalsPage() {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'hold'>('all');

  useEffect(() => {
    loadSignals();
  }, []);

  async function loadSignals() {
    try {
      setLoading(true);
      const data = await getTradingSignals();
      setSignals(data);
    } catch (error) {
      console.error('Error loading trading signals:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredSignals =
    filter === 'all' ? signals : signals.filter((s) => s.action === filter);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy':
        return 'text-green-500 bg-green-500/20';
      case 'sell':
        return 'text-red-500 bg-red-500/20';
      default:
        return 'text-yellow-500 bg-yellow-500/20';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy':
        return <TrendingUp size={16} />;
      case 'sell':
        return <TrendingDown size={16} />;
      default:
        return <Minus size={16} />;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                AI Trading Signals
              </h1>
              <p className="text-gray-400">
                Data-driven trading recommendations for swing traders
              </p>
            </div>
            <button
              onClick={loadSignals}
              disabled={loading}
              className="p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors disabled:opacity-50"
              title="Refresh signals"
            >
              <RefreshCw
                size={20}
                className={loading ? 'animate-spin text-[#ff6b35]' : 'text-gray-400'}
              />
            </button>
          </div>

          {/* Info Banner */}
          <div className="card p-4 bg-blue-500/10 border-blue-500/20 mb-6">
            <p className="text-sm text-blue-300">
              <strong>Swing Trading Focus:</strong> All signals are optimized for 2-4 week
              holding periods. We analyze sentiment, volume, RSI, MACD, and market trends to
              generate actionable recommendations.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'all' as const, label: 'All Signals' },
              { value: 'buy' as const, label: 'Buy' },
              { value: 'hold' as const, label: 'Hold' },
              { value: 'sell' as const, label: 'Sell' },
            ].map((btn) => {
              const isActive = filter === btn.value;
              return (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  {btn.label}
                  {!loading && (
                    <span className="ml-2 text-xs opacity-70">
                      (
                      {btn.value === 'all'
                        ? signals.length
                        : signals.filter((s) => s.action === btn.value).length}
                      )
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Signals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-6 bg-gray-800 rounded w-1/2 mb-4" />
                <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-4" />
                <div className="h-20 bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="card p-12 text-center">
            <Activity className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 text-lg mb-2">No signals match this filter</p>
            <p className="text-sm text-gray-500">Try selecting a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSignals.map((signal) => (
              <div
                key={signal.id}
                className="card p-6 hover:border-[#3a3a3a] transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{signal.coin}</h3>
                    <span className="text-sm text-gray-500 uppercase">
                      {signal.symbol}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full ${getActionColor(
                      signal.action
                    )}`}
                  >
                    {getActionIcon(signal.action)}
                    <span className="text-sm font-bold uppercase">
                      {signal.action}
                    </span>
                  </div>
                </div>

                {/* Confidence */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      Confidence Score
                    </span>
                    <span className="text-lg font-bold text-[#ff6b35]">
                      {signal.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] transition-all"
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Price Levels */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#0a0a0a] p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Entry</div>
                    <div className="font-mono font-semibold">
                      ${signal.entry_price.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] p-3 rounded-lg">
                    <div className="text-xs text-green-500 mb-1 flex items-center gap-1">
                      <Target size={12} />
                      Target
                    </div>
                    <div className="font-mono font-semibold text-green-500">
                      ${signal.target_price.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] p-3 rounded-lg">
                    <div className="text-xs text-red-500 mb-1 flex items-center gap-1">
                      <Shield size={12} />
                      Stop Loss
                    </div>
                    <div className="font-mono font-semibold text-red-500">
                      ${signal.stop_loss.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Reasoning */}
                <div className="mb-4 p-4 bg-[#0a0a0a] rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">
                    Analysis
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {signal.reasoning}
                  </p>
                </div>

                {/* Indicators */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-500">RSI:</span>{' '}
                    <span className="font-mono">
                      {signal.indicators.rsi?.toFixed(0)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">MACD:</span>{' '}
                    <span className="font-mono">{signal.indicators.macd}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Volume:</span>{' '}
                    <span className="font-mono">
                      {signal.indicators.volume_trend}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Sentiment:</span>{' '}
                    <span className="font-mono">
                      {signal.indicators.sentiment_score}/100
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{signal.timeframe}</span>
                  </div>
                  <span>
                    {formatDistanceToNow(signal.created_at, { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
