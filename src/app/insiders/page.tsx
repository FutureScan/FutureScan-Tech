'use client';

import { useEffect, useState } from 'react';
import { InsiderSignal } from '@/types';
import { getInsiderSignals } from '@/lib/signals-api';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Wallet,
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
  Coins,
  Shuffle,
  Network,
  Database,
  Minus,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function InsidersPage() {
  const [signals, setSignals] = useState<InsiderSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

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

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  async function loadSignals() {
    try {
      setLoading(true);
      const data = await getInsiderSignals();
      setSignals(data);
    } catch (error) {
      console.error('Error loading insider signals:', error);
    } finally {
      setLoading(false);
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exchange_deposit':
        return <ArrowDownToLine size={18} />;
      case 'exchange_withdrawal':
        return <ArrowUpFromLine size={18} />;
      case 'staking':
        return <Coins size={18} />;
      case 'dex_trade':
        return <Shuffle size={18} />;
      case 'bridge':
        return <Network size={18} />;
      case 'smart_contract':
        return <Database size={18} />;
      case 'transfer':
        return <Wallet size={18} />;
      default:
        return <Minus size={18} />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'exchange_deposit':
        return 'Exchange Deposit';
      case 'exchange_withdrawal':
        return 'Exchange Withdrawal';
      case 'staking':
        return 'Staking';
      case 'dex_trade':
        return 'DEX Trade';
      case 'bridge':
        return 'Cross-Chain Bridge';
      case 'smart_contract':
        return 'DeFi Interaction';
      case 'transfer':
        return 'Wallet Transfer';
      default:
        return type;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'bullish':
        return 'border-green-500/30 hover:border-green-500/50';
      case 'bearish':
        return 'border-red-500/30 hover:border-red-500/50';
      default:
        return 'border-yellow-500/30 hover:border-yellow-500/50';
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'bullish':
        return 'bg-green-500/20 text-green-500';
      case 'bearish':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-yellow-500/20 text-yellow-500';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
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
                <span className="gradient-text neon-text">Whale Activity Monitor</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Real-time tracking of large wallet movements across multiple activity types
              </p>
              <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-[#ff6b35] via-blue-500 to-transparent rounded-full"></div>
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
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-2xl pulse-ring">
                🐋
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">Live Whale Tracking</h3>
                <p className="text-sm text-gray-300">
                  We monitor exchange deposits/withdrawals, staking, DEX trades, cross-chain bridges, DeFi interactions, and large transfers. Each activity type provides unique insights into whale behavior and market positioning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Signals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg w-2/3 mb-4" />
                <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-full mb-2" />
                <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg" />
              </div>
            ))}
          </div>
        ) : signals.length === 0 ? (
          <div className="glass-card neon-border p-16 text-center">
            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/10 mb-8 pulse-ring">
              <TrendingUp className="text-blue-400" size={56} />
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
            </div>
            <p className="text-gray-300 text-xl font-bold mb-2">No whale activity detected</p>
            <p className="text-sm text-gray-500">
              Check back later for whale movement updates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signals.map((signal) => {
              const isExpanded = expandedCards.has(signal.id);
              return (
                <div
                  key={signal.id}
                  className={`card-3d p-6 shine group transition-all ${getActionColor(signal.action)}`}
                  style={{ minHeight: '220px' }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-black gradient-text">{signal.coin}</h3>
                      <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">{signal.symbol}</span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full glass-card border flex items-center gap-1.5 ${
                      signal.action === 'bullish'
                        ? 'border-green-500/30 text-green-400'
                        : signal.action === 'bearish'
                        ? 'border-red-500/30 text-red-400'
                        : 'border-yellow-500/30 text-yellow-400'
                    }`}>
                      {signal.action === 'bullish' && <TrendingUp size={13} />}
                      {signal.action === 'bearish' && <TrendingDown size={13} />}
                      {signal.action === 'neutral' && <Minus size={13} />}
                      <span className="text-xs font-bold uppercase">{signal.action}</span>
                    </div>
                  </div>

                  {/* Activity Type */}
                  <div className="mb-4 flex items-center gap-2 px-3 py-2 glass-card rounded-xl border border-[#ff6b35]/30">
                    <div className="text-[#ff6b35]">
                      {getActivityIcon(signal.activity_type)}
                    </div>
                    <span className="text-xs font-bold text-[#ff6b35] uppercase tracking-wider">
                      {getActivityLabel(signal.activity_type)}
                    </span>
                  </div>

                  {/* Data Source */}
                  <div className="mb-4 flex items-center gap-2 px-3 py-2 glass-card rounded-xl border border-green-500/30">
                    <Database size={14} className="text-green-400" />
                    <div className="flex-1">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">Data Source</span>
                      <span className="text-xs font-bold text-green-400">{signal.source}</span>
                    </div>
                  </div>

                  {/* Volume & Price */}
                  <div className="mb-4 text-xs space-y-2">
                    <div className="flex justify-between items-center p-2 glass-card rounded-lg border border-gray-700/30">
                      <span className="text-gray-400 font-semibold">Volume:</span>
                      <span className="font-mono font-black text-white">${(signal.volume / 1e6).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between items-center p-2 glass-card rounded-lg border border-gray-700/30">
                      <span className="text-gray-400 font-semibold">Price:</span>
                      <span className="font-mono font-black text-white">${signal.price_at_signal.toLocaleString()}</span>
                    </div>
                    {signal.destination && (
                      <div className="flex justify-between items-center p-2 glass-card rounded-lg border border-[#ff6b35]/30">
                        <span className="text-gray-400 font-semibold">Destination:</span>
                        <span className="font-bold text-[#ff6b35]">{signal.destination}</span>
                      </div>
                    )}
                  </div>

                  {/* Whale Address - Always visible and copyable */}
                  <div className="mb-4 p-3 glass-card rounded-xl border border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Wallet size={13} className="text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Whale Address</div>
                          <span className="font-mono text-xs text-blue-300 truncate font-semibold block">
                            {signal.whale_address.slice(0, 10)}...{signal.whale_address.slice(-8)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => copyAddress(signal.whale_address)}
                        className="flex-shrink-0 p-1.5 glass-card rounded-lg border border-gray-700/30 hover:border-blue-500/50 transition-all ml-2 hover:scale-110"
                        title="Copy full whale address"
                      >
                        {copiedAddress === signal.whale_address ? (
                          <Check size={13} className="text-green-400" />
                        ) : (
                          <Copy size={13} className="text-gray-400 hover:text-blue-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-semibold">Confidence</span>
                      <span className="text-sm font-black gradient-text">{signal.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-900/50 rounded-full h-2 overflow-hidden border border-[#ff6b35]/20">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff6b35] via-[#f7931e] to-[#ff6b35] transition-all glow-orange"
                        style={{ width: `${signal.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="mb-4 space-y-3">
                      {/* Why Listed */}
                      <div className="p-4 glass-card rounded-xl border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <span className="text-purple-400 text-sm">💡</span>
                          </div>
                          <span className="text-sm font-bold text-purple-300">Why This Signal?</span>
                        </div>
                        <div className="text-xs text-gray-300 leading-relaxed space-y-2">
                          <p><strong className="text-white">• Significance:</strong> Large {getActivityLabel(signal.activity_type).toLowerCase()} detected with ${(signal.volume / 1e6).toFixed(1)}M volume</p>
                          <p><strong className="text-white">• Action Context:</strong> {
                            signal.action === 'bullish'
                              ? `Whale accumulation pattern - ${signal.activity_type === 'exchange_withdrawal' ? 'moving to cold storage (long-term hold signal)' : 'increasing position (bullish sentiment)'}`
                              : signal.action === 'bearish'
                              ? `Potential distribution - ${signal.activity_type === 'exchange_deposit' ? 'moving to exchange (sell pressure expected)' : 'reducing exposure (bearish sentiment)'}`
                              : 'Neutral movement - monitoring for directional confirmation'
                          }</p>
                          <p><strong className="text-white">• Timing:</strong> Activity detected {formatDistanceToNow(signal.timestamp, { addSuffix: true })}</p>
                        </div>
                      </div>

                      {/* Moves Made */}
                      <div className="p-4 glass-card rounded-xl border border-blue-500/30">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <span className="text-blue-400 text-sm">📊</span>
                          </div>
                          <span className="text-sm font-bold text-blue-300">Transaction Details</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                            <span className="text-gray-400">Activity Type</span>
                            <span className="font-bold text-white">{getActivityLabel(signal.activity_type)}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                            <span className="text-gray-400">Volume Moved</span>
                            <span className="font-bold text-[#ff6b35]">${(signal.volume / 1e6).toFixed(2)}M</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                            <span className="text-gray-400">Price at Activity</span>
                            <span className="font-bold text-white">${signal.price_at_signal.toLocaleString()}</span>
                          </div>
                          {signal.destination && (
                            <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                              <span className="text-gray-400">Destination</span>
                              <span className="font-bold text-[#ff6b35]">{signal.destination}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                            <span className="text-gray-400">Confidence Level</span>
                            <span className="font-bold text-green-400">{signal.confidence}% {signal.confidence >= 80 ? '(High)' : signal.confidence >= 60 ? '(Medium)' : '(Low)'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Analysis */}
                      <div className="p-4 glass-card rounded-xl border border-green-500/30">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <span className="text-green-400 text-sm">🎯</span>
                          </div>
                          <span className="text-sm font-bold text-green-300">Actionable Insights</span>
                        </div>
                        <div className="text-xs text-gray-300 leading-relaxed">
                          {signal.details || `This ${signal.action} signal suggests ${
                            signal.action === 'bullish'
                              ? 'potential upward price movement. Consider monitoring for entry opportunities if other indicators align.'
                              : signal.action === 'bearish'
                              ? 'potential downward pressure. Watch for confirmation before taking positions.'
                              : 'whale repositioning. Monitor for clearer directional signals.'
                          }`}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer with Expand Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#ff6b35]/20">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                      <Clock size={12} />
                      <span>{formatDistanceToNow(signal.timestamp, { addSuffix: true })}</span>
                    </div>
                    <button
                      onClick={() => toggleCard(signal.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-lg border border-[#ff6b35]/30 text-xs text-[#ff6b35] hover:text-[#ff8c5a] hover:border-[#ff6b35]/50 transition-all hover:scale-105 font-bold"
                    >
                      {isExpanded ? (
                        <>
                          <span>Less</span>
                          <ChevronUp size={14} />
                        </>
                      ) : (
                        <>
                          <span>Details</span>
                          <ChevronDown size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
