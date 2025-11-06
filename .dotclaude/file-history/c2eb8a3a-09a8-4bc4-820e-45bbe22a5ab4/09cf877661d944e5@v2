import { NextRequest, NextResponse } from 'next/server';
import { getSellerStats, getListingsBySeller } from '@/lib/marketplace-store';

/**
 * GET /api/sellers/[address]
 * Get seller profile and stats
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const sellerWallet = params.address;

    if (!sellerWallet) {
      return NextResponse.json(
        { error: 'Seller wallet address required' },
        { status: 400 }
      );
    }

    const stats = getSellerStats(sellerWallet);
    const listings = getListingsBySeller(sellerWallet);

    // Calculate average rating from listings
    const ratingsSum = listings.reduce((sum, l) => sum + l.seller_rating, 0);
    const averageRating = listings.length > 0 ? ratingsSum / listings.length : 0;

    const profile = {
      wallet_address: sellerWallet,
      display_name: `${sellerWallet.slice(0, 4)}...${sellerWallet.slice(-4)}`,
      bio: 'Crypto product seller',
      total_listings: stats.total_listings,
      total_sales: stats.total_sales,
      total_revenue: stats.total_revenue,
      average_rating: averageRating,
      verified: false,
      joined_at: listings.length > 0 ? Math.min(...listings.map(l => l.created_at)) : Date.now(),
      listings: listings,
    };

    return NextResponse.json({
      success: true,
      profile,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch seller profile' },
      { status: 500 }
    );
  }
}
