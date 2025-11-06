/**
 * Shared In-Memory Data Store
 *
 * IMPORTANT: This is for development/testing only
 * In production, use a real database (Postgres, MongoDB, etc.)
 */

import type { Listing, Purchase, SellerProfile } from '@/types/marketplace';

// Global stores
export const LISTINGS: Listing[] = [];
export const PURCHASES: Purchase[] = [];
export const SELLER_PROFILES: Map<string, SellerProfile> = new Map();

// Helper functions
export function getListingById(id: string): Listing | undefined {
  return LISTINGS.find(l => l.id === id);
}

export function getListingsBySeller(sellerWallet: string): Listing[] {
  return LISTINGS.filter(l => l.seller_wallet === sellerWallet);
}

export function getPurchasesByBuyer(buyerWallet: string): Purchase[] {
  return PURCHASES.filter(p => p.buyer_wallet === buyerWallet);
}

export function getPurchasesBySeller(sellerWallet: string): Purchase[] {
  return PURCHASES.filter(p => p.seller_wallet === sellerWallet);
}

export function getSellerStats(sellerWallet: string) {
  const listings = getListingsBySeller(sellerWallet);
  const sales = getPurchasesBySeller(sellerWallet);

  return {
    total_listings: listings.length,
    total_sales: sales.length,
    total_revenue: sales.reduce((sum, p) => sum + p.amount_usd, 0),
    active_listings: listings.filter(l => l.total_sales < 1000).length, // arbitrary active threshold
  };
}
