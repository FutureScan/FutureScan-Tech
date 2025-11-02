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
  FileCode,
  Minus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function InsidersPage() {
  const [signals, setSignals] = useState<InsiderSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSignals();
  }, []);

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
        return <FileCode size={18} />;
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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Whale Activity Monitor
              </h1>
              <p className="text-gray-400">
                Real-time tracking of large wallet movements across multiple activity types
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
          <div className="card p-4 bg-gradient-to-r from-[#ff6b35]/10 to-purple-500/10 border-[#ff6b35]/20">
            <p className="text-sm text-orange-200">
              <strong>🐋 Live Whale Tracking:</strong> We monitor exchange deposits/withdrawals, staking, DEX trades, cross-chain bridges, DeFi interactions, and large transfers. Each activity type provides unique insights into whale behavior and market positioning.
            </p>
          </div>
        </div>

        {/* Signals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-6 bg-gray-800 rounded w-1/2 mb-4" />
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                <div className="h-16 bg-gray-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : signals.length === 0 ? (
          <div className="card p-12 text-center">
            <TrendingUp className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 text-lg mb-2">No whale activity detected</p>
            <p className="text-sm text-gray-500">
              Check back later for whale movement updates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signals.map((signal) => {
              return (
                <div
                  key={signal.id}
                  className={`card p-6 border-2 transition-all hover:scale-105 ${getActionColor(
                    signal.action
                  )}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{signal.coin}</h3>
                      <span className="text-sm text-gray-500 uppercase">{signal.symbol}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${getActionBadge(signal.action)} flex items-center gap-1.5`}>
                      {signal.action === 'bullish' && <TrendingUp size={14} />}
                      {signal.action === 'bearish' && <TrendingDown size={14} />}
                      {signal.action === 'neutral' && <Minus size={14} />}
                      <span className="text-xs font-bold uppercase">{signal.action}</span>
                    </div>
                  </div>

                  {/* Activity Type */}
                  <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] rounded-lg border border-[#ff6b35]/20">
                    <div className="text-[#ff6b35]">
                      {getActivityIcon(signal.activity_type)}
                    </div>
                    <span className="text-sm font-semibold text-[#ff6b35]">
                      {getActivityLabel(signal.activity_type)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mb-4 p-3 bg-[#0a0a0a] rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-300 whitespace-pre-line leading-relaxed">
                      {signal.details}
                    </div>
                  </div>

                  {/* Whale Address */}
                  <div className="mb-3 flex items-center gap-2 text-xs">
                    <Wallet size={14} className="text-gray-500" />
                    <span className="font-mono text-gray-400">{signal.whale_address}</span>
                  </div>

                  {/* Confidence */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-500">Confidence</span>
                      <span className="text-sm font-bold text-[#ff6b35]">{signal.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] transition-all"
                        style={{ width: `${signal.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>{formatDistanceToNow(signal.timestamp, { addSuffix: true })}</span>
                    </div>
                    <span className="font-mono">${signal.price_at_signal.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{signal.coin}</h3>
                      <span className="text-sm text-gray-500 uppercase">
                        {signal.symbol}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                        isAccumulation
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {isAccumulation ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      <span className="text-xs font-semibold uppercase">
                        {signal.action}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Confidence</span>
                      <span className="text-sm font-semibold">
                        {signal.confidence}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          signal.confidence > 70
                            ? 'bg-green-500'
                            : signal.confidence > 50
                            ? 'bg-yellow-500'
                            : 'bg-orange-500'
                        }`}
                        style={{ width: `${signal.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Price at Signal</span>
                      <span className="font-mono font-semibold">
                        ${signal.price_at_signal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Volume</span>
                      <span className="font-mono">
                        ${(signal.volume / 1e6).toFixed(2)}M
                      </span>
                    </div>

                    {signal.whale_address && (
                      <div className="flex items-start gap-2 text-sm">
                        <Wallet className="text-gray-500 mt-0.5 flex-shrink-0" size={14} />
                        <span className="font-mono text-gray-400 break-all text-xs">
                          {signal.whale_address}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t border-gray-800">
                      <Clock size={14} />
                      <span>
                        {formatDistanceToNow(signal.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Action hint */}
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500">
                      {isAccumulation
                        ? '📈 Whales are accumulating - potential bullish signal'
                        : '📉 Whales are distributing - potential bearish signal'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
