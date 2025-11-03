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

  const filteredSignals = filter === 'all' ? signals : signals.filter((s) => s.action === filter);

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <h1 className="text-5xl md:text-6xl font-black mb-3">
                <span className="gradient-text neon-text">AI Trading Signals</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Data-driven trading recommendations for swing traders
              </p>
              <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-[#ff6b35] via-green-500 to-transparent rounded-full"></div>
            </div>
            <button
              onClick={loadSignals}
              disabled={loading}
              className="glass-card p-4 hover:bg-gray-800/80 rounded-xl transition-all hover:scale-110 disabled:opacity-50 pulse-ring"
              title="Refresh signals"
            >
              <RefreshCw
                size={24}
                className={loading ? 'animate-spin text-[#ff6b35]' : 'text-gray-400 hover:text-[#ff6b35] transition-colors'}
              />
            </button>
          </div>

          {/* Info Banner */}
          <div className="glass-card holographic p-5 rounded-2xl mb-6 border border-[#ff6b35]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-yellow-600 flex items-center justify-center flex-shrink-0 text-2xl pulse-ring">
                🌟
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">World's Most Comprehensive Crypto Signals</h3>
                <p className="text-sm text-gray-300">
                  Institutional-grade analysis covering long-term holds, swing trades, momentum plays, technology opportunities, and fundamental value investments. Powered by real-time data from 9+ sources.
                </p>
              </div>
            </div>
          </div>

          {/* Action Filter Buttons */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#ff6b35] mb-4 tracking-wider uppercase">Filter by Action:</h3>
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
                    className={`group relative px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 ${
                      isActive
                        ? 'cyber-button text-white glow-orange'
                        : 'glass-card hover:bg-gray-800/80 text-gray-300 hover:text-white'
                    }`}
                  >
                    {btn.label}
                    {!loading && (
                      <span className={`ml-2 text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                        (
                        {btn.value === 'all'
                          ? signals.length
                          : signals.filter((s) => s.action === btn.value).length}
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

        {/* Signals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg w-2/3 mb-4" />
                <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-3/4 mb-4" />
                <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="glass-card neon-border p-16 text-center">
            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-yellow-600/10 mb-8 pulse-ring">
              <Activity className="text-[#ff6b35]" size={56} />
              <div className="absolute inset-0 rounded-full bg-[#ff6b35]/20 animate-ping"></div>
            </div>
            <p className="text-gray-300 text-xl font-bold mb-2">No signals match this filter</p>
            <p className="text-sm text-gray-500">Try selecting a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSignals.map((signal) => {
              const isExpanded = expandedCards.has(signal.id);
              return (
              <div
                key={signal.id}
                className="card-3d p-6 shine group"
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
