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
  contract_address?: string; // Optional contract address for the token
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

// x402 Protocol Types
export type X402Chain = 'solana' | 'base' | 'ethereum' | 'polygon';
export type X402Currency = 'USDC' | 'SOL' | 'ETH' | 'USDT';

export interface X402PaymentIntent {
  intent_id: string;
  listing_id: string;
  amount: number; // Amount in USD
  currency: X402Currency;
  chain: X402Chain;
  recipient_address: string;
  expires_at: number; // Unix timestamp
  metadata?: {
    listing_title: string;
    seller: string;
    buyer_address?: string;
  };
}

export interface X402PaymentProof {
  intent_id: string;
  transaction_signature: string;
  chain: X402Chain;
  timestamp: number;
}

export interface X402PaymentResponse {
  success: boolean;
  payment_verified: boolean;
  access_granted: boolean;
  transaction_id?: string;
  error?: string;
  retry_after?: number; // Seconds to wait before retry
}

// HTTP 402 Response Headers
export interface X402Headers {
  'X-Payment-Required': 'true';
  'X-Payment-Amount': string;
  'X-Payment-Currency': X402Currency;
  'X-Payment-Chain': X402Chain;
  'X-Payment-Address': string;
  'X-Payment-Intent-Id': string;
  'X-Payment-Expires': string; // ISO 8601 timestamp
}
