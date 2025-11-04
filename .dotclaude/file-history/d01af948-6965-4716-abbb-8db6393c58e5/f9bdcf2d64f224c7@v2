'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { CryptoAsset } from '@/types';
import { getTopCryptos, searchCrypto } from '@/lib/crypto-api';
import { Search, Plus, Trash2, Star } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CryptoAsset[]>([]);
  const [topCryptos, setTopCryptos] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadTopCryptos();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 1) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  async function loadTopCryptos() {
    try {
      setLoading(true);
      const cryptos = await getTopCryptos(50);
      setTopCryptos(cryptos);
    } catch (error) {
      console.error('Error loading top cryptos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const results = await searchCrypto(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching cryptos:', error);
    } finally {
      setSearching(false);
    }
  }

  const displayCryptos = searchQuery.length > 1 ? searchResults : topCryptos;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your watchlist and preferences</p>
        </div>

        {/* Current Watchlist */}
        <div className="card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-[#ff6b35]" size={20} />
            <h2 className="text-xl font-bold">Your Watchlist</h2>
            <span className="text-sm text-gray-500">
              ({watchlist.length} coins)
            </span>
          </div>

          {watchlist.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Your watchlist is empty. Add coins below to track them.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {watchlist.map((item) => (
                <div
                  key={item.coin_id}
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg"
                >
                  <span className="font-medium uppercase">{item.symbol}</span>
                  <button
                    onClick={() => removeFromWatchlist(item.coin_id)}
                    className="p-1 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-500 transition-colors"
                    title="Remove from watchlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search & Add */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Add Coins to Watchlist</h2>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg pl-12 pr-4 py-3 outline-none focus:border-[#ff6b35] transition-colors"
            />
            {searching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#ff6b35] border-t-transparent" />
              </div>
            )}
          </div>

          {/* Crypto List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-lg animate-pulse"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-800 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-gray-800 rounded w-1/3" />
                  </div>
                  <div className="h-10 w-24 bg-gray-800 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {displayCryptos.map((crypto) => {
                const inWatchlist = isInWatchlist(crypto.id);

                return (
                  <div
                    key={crypto.id}
                    className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-lg hover:bg-[#1a1a1a] transition-colors"
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
                      <h3 className="font-semibold">{crypto.name}</h3>
                      <p className="text-sm text-gray-500 uppercase">
                        {crypto.symbol}
                      </p>
                    </div>

                    <div className="text-right mr-4">
                      <p className="font-mono font-semibold">
                        ${crypto.current_price.toLocaleString()}
                      </p>
                      <p
                        className={`text-sm ${
                          crypto.price_change_percentage_24h >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        inWatchlist
                          ? removeFromWatchlist(crypto.id)
                          : addToWatchlist(crypto.id, crypto.symbol)
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        inWatchlist
                          ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                          : 'bg-[#ff6b35] text-white hover:bg-[#e85a26]'
                      }`}
                    >
                      {inWatchlist ? (
                        <>
                          <Trash2 size={16} />
                          Remove
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          Add
                        </>
                      )}
                    </button>
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
