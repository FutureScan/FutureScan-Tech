'use client';

import { CryptoAsset } from '@/types';
import { TrendingUp, TrendingDown, Plus, X } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import Image from 'next/image';

interface WatchlistProps {
  cryptos: CryptoAsset[];
  loading?: boolean;
}

export function Watchlist({ cryptos, loading }: WatchlistProps) {
  const { removeFromWatchlist } = useAppStore();

  if (loading) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Your Watchlist</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-800 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-800 rounded w-1/4" />
              </div>
              <div className="h-4 bg-gray-800 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Your Watchlist</h3>
        <div className="text-center py-8">
          <Plus className="mx-auto mb-2 text-gray-600" size={32} />
          <p className="text-gray-500">No coins in watchlist</p>
          <p className="text-sm text-gray-600 mt-1">
            Add coins from Settings to track them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Your Watchlist</h3>
      <div className="space-y-3">
        {cryptos.map((crypto) => {
          const isPositive = crypto.price_change_percentage_24h >= 0;

          return (
            <div
              key={crypto.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors"
            >
              {crypto.image && (
                <Image
                  src={crypto.image}
                  alt={crypto.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{crypto.name}</h4>
                  <span className="text-xs text-gray-500 uppercase">
                    {crypto.symbol}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  ${crypto.current_price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div
                    className={`flex items-center gap-1 ${
                      isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <span className="font-semibold">
                      {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">24h</p>
                </div>

                <button
                  onClick={() => removeFromWatchlist(crypto.id)}
                  className="p-1 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-500 transition-colors"
                  title="Remove from watchlist"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
