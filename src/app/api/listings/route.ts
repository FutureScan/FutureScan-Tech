import { NextRequest, NextResponse } from 'next/server';
import type { Listing, PaymentToken } from '@/types/marketplace';
import { LISTINGS } from '@/lib/marketplace-store';

/**
 * POST /api/listings
 * Create new marketplace listing with USD pricing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.seller_wallet) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    if (!body.title || !body.description || !body.price_usd || !body.payment_token) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, price_usd, payment_token' },
        { status: 400 }
      );
    }

    // Validate payment token
    const validTokens: PaymentToken[] = ['SOL', 'USDC', 'BONK', 'USDT', 'RAY', 'ORCA'];
    if (!validTokens.includes(body.payment_token)) {
      return NextResponse.json(
        { error: 'Invalid payment token' },
        { status: 400 }
      );
    }

    // Validate USD price
    const priceUSD = parseFloat(body.price_usd);
    if (isNaN(priceUSD) || priceUSD <= 0) {
      return NextResponse.json(
        { error: 'Invalid price - must be a positive number in USD' },
        { status: 400 }
      );
    }

    const newListing: Listing = {
      id: `listing_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      title: body.title,
      description: body.description,
      category: body.category,
      price_usd: priceUSD,
      payment_token: body.payment_token,
      seller: body.seller,
      seller_wallet: body.seller_wallet,
      features: body.features || [],
      verified: false,
      created_at: Date.now(),
      updated_at: Date.now(),
      total_sales: 0,
      seller_rating: 0,
      delivery_type: body.delivery_type || 'instant',
      access_info: body.access_info,
    };

    // Store listing (use database in production)
    LISTINGS.push(newListing);

    return NextResponse.json(
      {
        success: true,
        listing: newListing,
        message: 'Listing created successfully',
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create listing' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/listings
 * Fetch all listings (no payment required)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const seller_wallet = searchParams.get('seller_wallet');

    let filtered = LISTINGS;

    if (category && category !== 'all') {
      filtered = filtered.filter(l => l.category === category);
    }

    if (seller_wallet) {
      filtered = filtered.filter(l => l.seller_wallet === seller_wallet);
    }

    return NextResponse.json({
      listings: filtered,
      total: filtered.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/listings
 * Update a listing (owner only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, seller_wallet, ...updates } = body;

    if (!id || !seller_wallet) {
      return NextResponse.json(
        { error: 'Listing ID and wallet address required' },
        { status: 400 }
      );
    }

    const listingIndex = LISTINGS.findIndex(l => l.id === id);

    if (listingIndex === -1) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (LISTINGS[listingIndex].seller_wallet !== seller_wallet) {
      return NextResponse.json(
        { error: 'Unauthorized - you can only edit your own listings' },
        { status: 403 }
      );
    }

    // Update listing
    LISTINGS[listingIndex] = {
      ...LISTINGS[listingIndex],
      ...updates,
      updated_at: Date.now(),
    };

    return NextResponse.json({
      success: true,
      listing: LISTINGS[listingIndex],
      message: 'Listing updated successfully',
    });
  } catch (error: any) {
    console.error('Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update listing' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/listings
 * Delete a listing (owner only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const seller_wallet = searchParams.get('seller_wallet');

    if (!id || !seller_wallet) {
      return NextResponse.json(
        { error: 'Listing ID and wallet address required' },
        { status: 400 }
      );
    }

    const listingIndex = LISTINGS.findIndex(l => l.id === id);

    if (listingIndex === -1) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (LISTINGS[listingIndex].seller_wallet !== seller_wallet) {
      return NextResponse.json(
        { error: 'Unauthorized - you can only delete your own listings' },
        { status: 403 }
      );
    }

    // Delete listing
    LISTINGS.splice(listingIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
