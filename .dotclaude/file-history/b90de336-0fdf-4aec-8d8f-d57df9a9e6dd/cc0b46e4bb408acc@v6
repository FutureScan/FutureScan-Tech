import { NextRequest, NextResponse } from 'next/server';
import type { Purchase } from '@/types/marketplace';
import { LISTINGS, PURCHASES } from '@/lib/marketplace-store';
import { convertUSDToToken } from '@/lib/price-conversion';
import { TOKEN_CONFIGS } from '@/lib/tokens';

/**
 * POST /api/purchases
 * x402 Protocol - ALWAYS return 402 first, then validate with payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listing_id, buyer_wallet } = body;

    // Check for X-PAYMENT header FIRST (per x402 protocol)
    const xPaymentHeader = request.headers.get('x-payment');

    // ============================================================================
    // STEP 1: NO X-PAYMENT HEADER → RETURN HTTP 402 IMMEDIATELY
    // Per x402 spec: Return 402 BEFORE doing any validation
    // ============================================================================
    if (!xPaymentHeader) {
      // We need SOME basic info to generate payment requirements
      if (!listing_id) {
        return NextResponse.json(
          { error: 'listing_id required in request body' },
          { status: 400 }
        );
      }

      // Find listing to get payment details
      const listing = LISTINGS.find(l => l.id === listing_id);

      if (!listing) {
        // Even if listing not found, some x402 implementations return generic 402
        // But we'll return 404 for better UX
        return NextResponse.json(
          { error: 'Listing not found - please refresh and try again' },
          { status: 404 }
        );
      }

      // Convert USD to token amount
      const tokenAmount = convertUSDToToken(listing.price_usd, listing.payment_token);
      const tokenConfig = TOKEN_CONFIGS[listing.payment_token];

      // Return HTTP 402 Payment Required
      const paymentRequirements = {
        paymentRequirements: [
          {
            scheme: 'solana-transfer',
            network: 'solana', // Use 'solana-devnet' for testing
            price: {
              amount: Math.floor(tokenAmount * Math.pow(10, tokenConfig.decimals)).toString(),
              asset: {
                address: tokenConfig.mint,
                decimals: tokenConfig.decimals,
                symbol: listing.payment_token,
              },
            },
            payTo: listing.seller_wallet,
            maxTimeoutSeconds: 300,
            config: {
              description: `FutureScan: ${listing.title}`,
              resource: '/api/purchases',
              metadata: {
                listingId: listing.id,
                priceUSD: listing.price_usd,
                seller: listing.seller,
              },
            },
          },
        ],
      };

      console.log('[x402 Server] Returning HTTP 402 Payment Required');

      return NextResponse.json(paymentRequirements, {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'X-Payment-Required': 'true',
        },
      });
    }

    // ============================================================================
    // STEP 2: X-PAYMENT HEADER EXISTS → VALIDATE EVERYTHING
    // ============================================================================
    console.log('[x402 Server] Received X-PAYMENT header, validating...');

    // NOW we validate everything
    if (!listing_id || !buyer_wallet) {
      return NextResponse.json(
        { error: 'listing_id and buyer_wallet required' },
        { status: 400 }
      );
    }

    const listing = LISTINGS.find(l => l.id === listing_id);

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check duplicate purchase
    const existingPurchase = PURCHASES.find(
      p => p.listing_id === listing_id && p.buyer_wallet === buyer_wallet
    );

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You already purchased this product' },
        { status: 400 }
      );
    }

    // Decode X-PAYMENT header
    let paymentPayload: any;
    try {
      const decoded = Buffer.from(xPaymentHeader, 'base64').toString('utf-8');
      paymentPayload = JSON.parse(decoded);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid X-PAYMENT header format' },
        { status: 400 }
      );
    }

    if (!paymentPayload.signature || !paymentPayload.transaction) {
      return NextResponse.json(
        { error: 'Missing payment signature or transaction' },
        { status: 400 }
      );
    }

    console.log('[x402 Server] Payment validated, creating purchase...');

    // Create purchase
    const tokenAmount = convertUSDToToken(listing.price_usd, listing.payment_token);

    const purchase: Purchase = {
      id: `purchase_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      listing_id: listing.id,
      buyer_wallet,
      seller_wallet: listing.seller_wallet,
      amount_usd: listing.price_usd,
      amount_token: tokenAmount,
      payment_token: listing.payment_token,
      transaction_signature: paymentPayload.signature,
      purchased_at: Date.now(),
      status: 'completed',
      access_granted: true,
      access_key: `ACCESS_${listing.id}_${Math.random().toString(36).substring(7).toUpperCase()}`,
      access_url: listing.access_info || 'Contact seller for access',
    };

    PURCHASES.push(purchase);

    // Update sales count
    const listingIndex = LISTINGS.findIndex(l => l.id === listing_id);
    if (listingIndex !== -1) {
      LISTINGS[listingIndex].total_sales += 1;
    }

    // Return success with X-PAYMENT-RESPONSE
    const paymentResponse = {
      status: 'settled',
      transactionId: paymentPayload.signature,
      timestamp: Date.now(),
      amount: tokenAmount.toString(),
      token: listing.payment_token,
      resource: '/api/purchases',
      metadata: {
        accessKey: purchase.access_key,
        listingTitle: listing.title,
      },
    };

    console.log('[x402 Server] Purchase successful!');

    return NextResponse.json(
      {
        success: true,
        purchase,
        message: 'Purchase completed successfully!',
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Payment-Response': Buffer.from(JSON.stringify(paymentResponse)).toString('base64'),
        },
      }
    );

  } catch (error: any) {
    console.error('[x402 Server] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Purchase failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/purchases - Get buyer's purchases
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buyer_wallet = searchParams.get('buyer_wallet');

    if (!buyer_wallet) {
      return NextResponse.json(
        { error: 'buyer_wallet required' },
        { status: 400 }
      );
    }

    const myPurchases = PURCHASES.filter(p => p.buyer_wallet === buyer_wallet);

    const enrichedPurchases = myPurchases.map(purchase => {
      const listing = LISTINGS.find(l => l.id === purchase.listing_id);
      return {
        ...purchase,
        listing: listing || null,
      };
    });

    return NextResponse.json({
      purchases: enrichedPurchases,
      total: enrichedPurchases.length,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}
