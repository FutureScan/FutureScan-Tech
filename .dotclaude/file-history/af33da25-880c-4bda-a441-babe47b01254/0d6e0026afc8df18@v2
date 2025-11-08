// Zustand store for app state management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WatchlistItem } from '@/types';

interface AppState {
  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (coin_id: string, symbol: string) => void;
  removeFromWatchlist: (coin_id: string) => void;
  isInWatchlist: (coin_id: string) => boolean;

  // Settings
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  // News filters
  newsFilter: 'all' | 'bullish' | 'bearish' | 'neutral';
  setNewsFilter: (filter: 'all' | 'bullish' | 'bearish' | 'neutral') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Watchlist state
      watchlist: [
        { coin_id: 'bitcoin', symbol: 'BTC', added_at: Date.now() },
        { coin_id: 'ethereum', symbol: 'ETH', added_at: Date.now() },
        { coin_id: 'solana', symbol: 'SOL', added_at: Date.now() },
      ],

      addToWatchlist: (coin_id: string, symbol: string) => {
        const { watchlist } = get();
        if (!watchlist.find((item) => item.coin_id === coin_id)) {
          set({
            watchlist: [...watchlist, { coin_id, symbol, added_at: Date.now() }],
          });
        }
      },

      removeFromWatchlist: (coin_id: string) => {
        set({
          watchlist: get().watchlist.filter((item) => item.coin_id !== coin_id),
        });
      },

      isInWatchlist: (coin_id: string) => {
        return get().watchlist.some((item) => item.coin_id === coin_id);
      },

      // Theme state
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      // News filter state
      newsFilter: 'all',
      setNewsFilter: (filter) => set({ newsFilter: filter }),
    }),
    {
      name: 'futurescan-storage',
    }
  )
);
