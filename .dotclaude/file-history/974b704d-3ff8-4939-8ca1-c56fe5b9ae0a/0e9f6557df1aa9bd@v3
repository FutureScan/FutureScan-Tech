'use client';

import { CryptoAsset } from '@/types';
import { TrendingUp, TrendingDown, Plus, X, Star } from 'lucide-react';
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
      <div className="card p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent animate-pulse"></div>
        <div className="flex items-center gap-2 mb-6">
          <Star className="text-[#ff6b35]" size={24} fill="#ff6b35" />
          <h3 className="text-xl font-bold">Your Watchlist</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-xl bg-[#ff6b35]/5">
              <div className="w-12 h-12 bg-[#ff6b35]/20 rounded-full" />
              <div className="flex-1">
                <div className="h-5 bg-[#ff6b35]/20 rounded w-1/3 mb-2" />
                <div className="h-4 bg-[#ff6b35]/10 rounded w-1/4" />
              </div>
              <div className="h-6 bg-[#ff6b35]/20 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div className="card p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent"></div>
        <div className="flex items-center gap-2 mb-6">
          <Star className="text-[#ff6b35]" size={24} fill="#ff6b35" />
          <h3 className="text-xl font-bold">Your Watchlist</h3>
        </div>
        <div className="text-center py-12">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-[#ff6b35] blur-xl opacity-30"></div>
            <Plus className="relative text-[#ff6b35]" size={48} />
          </div>
          <p className="text-gray-400 text-lg mb-2">No coins in watchlist</p>
          <p className="text-sm text-gray-600">
            Add coins from Settings to track them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent"></div>
      <div className="scan-effect absolute inset-0 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Star className="text-[#ff6b35]" size={24} fill="#ff6b35" />
          <h3 className="text-xl font-bold">Your Watchlist</h3>
        </div>
        <span className="text-sm text-gray-500 font-mono">{cryptos.length} assets</span>
      </div>

      <div className="space-y-3">
        {cryptos.map((crypto) => {
          const isPositive = crypto.price_change_percentage_24h >= 0;
          const priceChangeClass = isPositive ? 'price-up' : 'price-down';

          return (
            <div
              key={crypto.id}
              className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#ff6b35]/5 to-transparent hover:from-[#ff6b35]/10 transition-all duration-300 border border-[#ff6b35]/10 hover:border-[#ff6b35]/30"
            >
              {/* Coin image with glow */}
              <div className="relative flex-shrink-0">
                {crypto.image && (
                  <>
                    <div className="absolute inset-0 bg-[#ff6b35] blur-lg opacity-0 group-hover:opacity-30 transition-opacity"></div>
                    <Image
                      src={crypto.image}
                      alt={crypto.name}
                      width={48}
                      height={48}
                      className="rounded-full relative z-10"
                    />
                  </>
                )}
              </div>

              {/* Coin info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-lg text-white">{crypto.name}</h4>
                  <span className="text-xs text-gray-500 uppercase font-mono px-2 py-0.5 rounded bg-[#ff6b35]/10">
                    {crypto.symbol}
                  </span>
                </div>
                <p className="text-sm font-mono font-semibold text-gray-300">
                  ${crypto.current_price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>

              {/* Price change */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`flex items-center gap-1 font-bold ${priceChangeClass}`}>
                    {isPositive ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                    <span className="font-mono">
                      {isPositive ? '+' : ''}
                      {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-1">24h</p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromWatchlist(crypto.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-500 transition-all duration-200 hover:scale-110"
                  title="Remove from watchlist"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
