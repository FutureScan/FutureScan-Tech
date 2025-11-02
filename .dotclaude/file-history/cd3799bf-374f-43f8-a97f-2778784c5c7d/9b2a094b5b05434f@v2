'use client';

import { useEffect, useState } from 'react';
import { InsiderSignal } from '@/types';
import { getInsiderSignals } from '@/lib/signals-api';
import { TrendingUp, TrendingDown, RefreshCw, Wallet, Clock } from 'lucide-react';
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Insider Trading Signals
              </h1>
              <p className="text-gray-400">
                Track whale wallet movements and accumulation patterns
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
          <div className="card p-4 bg-blue-500/10 border-blue-500/20">
            <p className="text-sm text-blue-300">
              <strong>How it works:</strong> We analyze blockchain data to detect large
              transactions (whale movements) that may indicate accumulation or distribution
              patterns. Higher confidence signals suggest stronger potential impacts.
            </p>
          </div>
        </div>

        {/* Signals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-6 bg-gray-800 rounded w-1/2 mb-4" />
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                <div className="h-4 bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : signals.length === 0 ? (
          <div className="card p-12 text-center">
            <TrendingUp className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 text-lg mb-2">No insider signals detected</p>
            <p className="text-sm text-gray-500">
              Check back later for whale movement updates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signals.map((signal) => {
              const isAccumulation = signal.action === 'accumulation';

              return (
                <div
                  key={signal.id}
                  className={`card p-6 border-2 transition-all hover:scale-105 ${
                    isAccumulation
                      ? 'border-green-500/30 hover:border-green-500/50'
                      : 'border-red-500/30 hover:border-red-500/50'
                  }`}
                >
                  {/* Header */}
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
