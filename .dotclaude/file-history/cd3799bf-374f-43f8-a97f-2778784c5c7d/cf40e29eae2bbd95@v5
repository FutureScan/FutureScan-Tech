// Core crypto data types
export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

// News types
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: number;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  related_coins?: string[];
  image_url?: string;
}

// Insider trading signal with diverse activity types
export interface InsiderSignal {
  id: string;
  coin: string;
  symbol: string;
  activity_type: 'transfer' | 'exchange_deposit' | 'exchange_withdrawal' | 'staking' | 'dex_trade' | 'bridge' | 'smart_contract';
  action: 'bullish' | 'bearish' | 'neutral';
  volume: number;
  timestamp: number;
  whale_address: string;
  destination?: string;
  confidence: number; // 0-100
  price_at_signal: number;
  details: string;
}

// AI trading signal
export interface TradingSignal {
  id: string;
  coin: string;
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  signal_type: 'long-term' | 'medium-term' | 'short-term' | 'opportunity' | 'fundamental';
  entry_price: number;
  target_price: number;
  stop_loss: number;
  confidence: number; // 0-100
  timeframe: string; // e.g., "2-4 weeks"
  reasoning: string;
  use_case?: string; // Technology/use case description
  catalysts?: string[]; // Upcoming events/catalysts
  indicators: {
    rsi?: number;
    macd?: string;
    volume_trend?: string;
    sentiment_score?: number;
  };
  created_at: number;
}

// Market sentiment
export interface MarketSentiment {
  value: number; // 0-100 (Fear & Greed Index)
  classification: 'extreme_fear' | 'fear' | 'neutral' | 'greed' | 'extreme_greed';
  timestamp: number;
}

// Watchlist
export interface WatchlistItem {
  coin_id: string;
  symbol: string;
  added_at: number;
}

// API response wrappers
export interface ApiResponse<T> {
  data: T;
  error?: string;
  timestamp: number;
}

// Chart data point
export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

// Marketplace types
export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: 'signals' | 'research' | 'data' | 'tools' | 'bots' | 'api';
  price: number; // in USD
  seller: string;
  seller_rating: number; // 0-5
  total_sales: number;
  preview?: string;
  features: string[];
  created_at: number;
  verified: boolean;
}

export interface MarketplaceTransaction {
  id: string;
  listing_id: string;
  buyer: string;
  seller: string;
  amount: number;
  platform_fee: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}
