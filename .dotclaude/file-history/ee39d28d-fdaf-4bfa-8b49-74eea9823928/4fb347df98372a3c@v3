import { NextRequest, NextResponse } from 'next/server';
import { getPurchasesBySeller, LISTINGS } from '@/lib/marketplace-store';
import type { Order } from '@/types/marketplace';

/**
 * GET /api/orders
 * Get orders (sales) for a seller
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seller_wallet = searchParams.get('seller_wallet');

    if (!seller_wallet) {
      return NextResponse.json(
        { error: 'Seller wallet address required' },
        { status: 400 }
      );
    }

    const purchases = getPurchasesBySeller(seller_wallet);

    // Transform to orders format
    const orders: Order[] = purchases.map(purchase => {
      const listing = LISTINGS.find(l => l.id === purchase.listing_id);

      return {
        purchase_id: purchase.id,
        listing_id: purchase.listing_id,
        listing_title: listing?.title || 'Unknown Product',
        buyer_wallet: purchase.buyer_wallet,
        buyer_name: `${purchase.buyer_wallet.slice(0, 4)}...${purchase.buyer_wallet.slice(-4)}`,
        amount: purchase.amount_usd,
        purchased_at: purchase.purchased_at,
        status: purchase.status,
      };
    });

    return NextResponse.json({
      orders,
      total: orders.length,
      total_revenue: orders.reduce((sum, o) => sum + o.amount, 0),
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
