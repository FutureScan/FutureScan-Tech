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
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SignalsPage() {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'hold'>('all');
  const [signalTypeFilter, setSignalTypeFilter] = useState<'all' | 'long-term' | 'medium-term' | 'short-term' | 'opportunity' | 'fundamental'>('all');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadSignals();
  }, []);

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

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

  const filteredSignals = signals
    .filter((s) => filter === 'all' || s.action === filter)
    .filter((s) => signalTypeFilter === 'all' || s.signal_type === signalTypeFilter);

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
          <div className="card p-4 bg-gradient-to-r from-[#ff6b35]/10 to-blue-500/10 border-[#ff6b35]/20 mb-6">
            <p className="text-sm text-orange-200">
              <strong>🌟 World's Most Comprehensive Crypto Signals:</strong> Institutional-grade analysis covering long-term holds, swing trades, momentum plays, technology opportunities, and fundamental value investments. Powered by real-time data from 9+ sources.
            </p>
          </div>

          {/* Action Filter Buttons */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Filter by Action:</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all' as const, label: 'All Actions' },
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

          {/* Signal Type Filter Buttons */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Filter by Signal Type:</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all' as const, label: 'All Types', icon: '🎯' },
                { value: 'long-term' as const, label: 'Long-Term Holds', icon: '💎' },
                { value: 'medium-term' as const, label: 'Swing Trades', icon: '📈' },
                { value: 'short-term' as const, label: 'Quick Plays', icon: '⚡' },
                { value: 'opportunity' as const, label: 'Tech Opportunities', icon: '🚀' },
                { value: 'fundamental' as const, label: 'Fundamental Value', icon: '🏆' },
              ].map((btn) => {
                const isActive = signalTypeFilter === btn.value;
                return (
                  <button
                    key={btn.value}
                    onClick={() => setSignalTypeFilter(btn.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white'
                        : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <span className="mr-1">{btn.icon}</span>
                    {btn.label}
                    {!loading && (
                      <span className="ml-2 text-xs opacity-70">
                        (
                        {btn.value === 'all'
                          ? signals.length
                          : signals.filter((s) => s.signal_type === btn.value).length}
                        )
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSignals.map((signal) => {
              const isExpanded = expandedCards.has(signal.id);
              return (
              <div
                key={signal.id}
                className="card p-5 border transition-all"
                style={{ minHeight: '220px' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{signal.coin}</h3>
                    <span className="text-xs text-gray-500 uppercase">
                      {signal.symbol}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full ${getActionColor(
                      signal.action
                    )}`}
                  >
                    {getActionIcon(signal.action)}
                    <span className="text-xs font-bold uppercase">
                      {signal.action}
                    </span>
                  </div>
                </div>

                {/* Signal Type Badge */}
                <div className="mb-3">
                  <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[#ff6b35]/20 to-[#f7931e]/20 text-xs font-semibold text-[#ff6b35]">
                    {signal.signal_type === 'long-term' && '💎 Long-Term'}
                    {signal.signal_type === 'medium-term' && '📈 Swing'}
                    {signal.signal_type === 'short-term' && '⚡ Quick'}
                    {signal.signal_type === 'opportunity' && '🚀 Tech'}
                    {signal.signal_type === 'fundamental' && '🏆 Value'}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">{signal.timeframe}</span>
                </div>

                {/* Confidence */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Confidence</span>
                    <span className="text-xs font-bold text-[#ff6b35]">
                      {signal.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] transition-all"
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Price Levels - Compact */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-[#0a0a0a] p-2 rounded">
                    <div className="text-gray-500 mb-0.5">Entry</div>
                    <div className="font-mono font-semibold text-xs">
                      ${(signal.entry_price).toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] p-2 rounded">
                    <div className="text-green-500 mb-0.5 flex items-center gap-0.5">
                      <Target size={10} />
                      <span>Target</span>
                    </div>
                    <div className="font-mono font-semibold text-green-500 text-xs">
                      ${(signal.target_price).toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] p-2 rounded">
                    <div className="text-red-500 mb-0.5 flex items-center gap-0.5">
                      <Shield size={10} />
                      <span>Stop</span>
                    </div>
                    <div className="font-mono font-semibold text-red-500 text-xs">
                      ${(signal.stop_loss).toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                  </div>
                </div>

                {/* Expandable Analysis */}
                {isExpanded && (
                  <>
                    {/* Use Case */}
                    {signal.use_case && (
                      <div className="mb-3 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                        <p className="text-xs text-blue-300">
                          <strong>Use Case:</strong> {signal.use_case}
                        </p>
                      </div>
                    )}

                    {/* Detailed Analysis */}
                    <div className="mb-3 p-3 bg-[#0a0a0a] rounded-lg border border-[#ff6b35]/10">
                      <h4 className="text-xs font-semibold text-[#ff6b35] mb-2 flex items-center gap-1">
                        <Activity size={12} />
                        Detailed Analysis
                      </h4>
                      <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
                        {signal.reasoning}
                      </div>
                    </div>

                    {/* Indicators */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div>
                        <span className="text-gray-500">RSI:</span>{' '}
                        <span className="font-mono">{signal.indicators.rsi?.toFixed(0)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">MACD:</span>{' '}
                        <span className="font-mono">{signal.indicators.macd}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Volume:</span>{' '}
                        <span className="font-mono">{signal.indicators.volume_trend}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Sentiment:</span>{' '}
                        <span className="font-mono">{signal.indicators.sentiment_score}/100</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Footer with Expand Button */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={11} />
                    <span>{formatDistanceToNow(signal.created_at, { addSuffix: true })}</span>
                  </div>
                  <button
                    onClick={() => toggleCard(signal.id)}
                    className="flex items-center gap-1 text-xs text-[#ff6b35] hover:text-[#ff8c5a] transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <span>Less</span>
                        <ChevronUp size={14} />
                      </>
                    ) : (
                      <>
                        <span>Analysis</span>
                        <ChevronDown size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
