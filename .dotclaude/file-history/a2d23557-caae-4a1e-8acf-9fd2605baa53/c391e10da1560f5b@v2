// Complete Marketplace Type Definitions

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: 'signals' | 'research' | 'data' | 'tools' | 'bots' | 'api';
  price: number;
  seller: string;
  seller_wallet: string; // Solana wallet address
  features: string[];
  verified: boolean;
  created_at: number;
  updated_at: number;
  total_sales: number;
  seller_rating: number;
  // Product delivery info
  delivery_type: 'instant' | 'manual' | 'subscription';
  access_info?: string; // Encrypted access keys/download links
}

export interface Purchase {
  id: string;
  listing_id: string;
  buyer_wallet: string;
  seller_wallet: string;
  amount: number;
  transaction_signature: string;
  purchased_at: number;
  status: 'completed' | 'pending' | 'refunded';
  access_granted: boolean;
  // Product access
  access_key?: string;
  access_url?: string;
}

export interface SellerProfile {
  wallet_address: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  total_listings: number;
  total_sales: number;
  total_revenue: number;
  average_rating: number;
  joined_at: number;
  verified: boolean;
}

export interface Order {
  purchase_id: string;
  listing_id: string;
  listing_title: string;
  buyer_wallet: string;
  buyer_name?: string;
  amount: number;
  purchased_at: number;
  status: 'completed' | 'pending' | 'refunded';
}

export interface UserStats {
  wallet_address: string;
  total_purchases: number;
  total_spent: number;
  total_listings: number;
  total_sales: number;
  total_earned: number;
}
