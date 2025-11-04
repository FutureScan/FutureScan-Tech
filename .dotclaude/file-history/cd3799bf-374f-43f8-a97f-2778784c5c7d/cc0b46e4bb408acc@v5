import { NextRequest, NextResponse } from 'next/server';
import type { Purchase } from '@/types/marketplace';
import { LISTINGS, PURCHASES } from '@/lib/marketplace-store';
import { convertUSDToToken } from '@/lib/price-conversion';
import { TOKEN_CONFIGS } from '@/lib/tokens';

/**
 * POST /api/purchases
 * x402 Protocol Implementation - Proper HTTP 402 Flow
 *
 * Based on official Coinbase x402 documentation:
 * - Returns HTTP 402 on initial request
 * - Accepts X-PAYMENT header with signed transaction
 * - Returns X-PAYMENT-RESPONSE header on success
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listing_id, buyer_wallet } = body;

    if (!listing_id || !buyer_wallet) {
      return NextResponse.json(
        { error: 'Listing ID and buyer wallet required' },
        { status: 400 }
      );
    }

    // Find listing
    const listing = LISTINGS.find(l => l.id === listing_id);

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check if already purchased
    const existingPurchase = PURCHASES.find(
      p => p.listing_id === listing_id && p.buyer_wallet === buyer_wallet
    );

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You have already purchased this product' },
        { status: 400 }
      );
    }

    // Convert USD to token amount
    const tokenAmount = convertUSDToToken(listing.price_usd, listing.payment_token);
    const tokenConfig = TOKEN_CONFIGS[listing.payment_token];

    // Check for X-PAYMENT header
    const xPaymentHeader = request.headers.get('x-payment');

    // ============================================================================
    // STEP 1: NO PAYMENT HEADER → RETURN HTTP 402 PAYMENT REQUIRED
    // ============================================================================
    if (!xPaymentHeader) {
      const paymentRequirements = {
        paymentRequirements: [
          {
            scheme: 'solana-transfer', // For Solana network
            network: 'solana', // or 'solana-devnet' for testnet
            price: {
              amount: (tokenAmount * Math.pow(10, tokenConfig.decimals)).toString(), // Convert to smallest unit
              asset: {
                address: tokenConfig.mint,
                decimals: tokenConfig.decimals,
                symbol: listing.payment_token,
              },
            },
            payTo: listing.seller_wallet, // Seller's wallet address
            maxTimeoutSeconds: 300, // 5 minutes to complete payment
            config: {
              description: `Purchase: ${listing.title}`,
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

      return NextResponse.json(paymentRequirements, {
        status: 402, // HTTP 402 Payment Required
        headers: {
          'Content-Type': 'application/json',
          'X-Payment-Required': 'true',
        },
      });
    }

    // ============================================================================
    // STEP 2: VALIDATE X-PAYMENT HEADER
    // ============================================================================
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
        { error: 'Missing required payment fields (signature, transaction)' },
        { status: 400 }
      );
    }

    // ============================================================================
    // STEP 3: VERIFY PAYMENT (In production, verify on-chain)
    // ============================================================================
    // TODO: Add on-chain verification using Solana Web3.js
    // For now, we trust the client sent valid payment
    const transaction_signature = paymentPayload.signature;

    // ============================================================================
    // STEP 4: CREATE PURCHASE RECORD
    // ============================================================================
    const purchase: Purchase = {
      id: `purchase_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      listing_id: listing.id,
      buyer_wallet,
      seller_wallet: listing.seller_wallet,
      amount_usd: listing.price_usd,
      amount_token: tokenAmount,
      payment_token: listing.payment_token,
      transaction_signature,
      purchased_at: Date.now(),
      status: 'completed',
      access_granted: true,
      access_key: `ACCESS_${listing.id}_${Math.random().toString(36).substring(7)}`,
      access_url: listing.access_info || 'Contact seller for access',
    };

    PURCHASES.push(purchase);

    // Update listing sales count
    const listingIndex = LISTINGS.findIndex(l => l.id === listing_id);
    if (listingIndex !== -1) {
      LISTINGS[listingIndex].total_sales += 1;
    }

    // ============================================================================
    // STEP 5: RETURN SUCCESS WITH X-PAYMENT-RESPONSE HEADER
    // ============================================================================
    const paymentResponse = {
      status: 'settled',
      transactionId: transaction_signature,
      timestamp: Date.now(),
      amount: tokenAmount.toString(),
      token: listing.payment_token,
      resource: '/api/purchases',
      metadata: {
        accessKey: purchase.access_key,
        listingTitle: listing.title,
      },
    };

    return NextResponse.json(
      {
        success: true,
        purchase,
        message: 'Purchase successful! Access granted.',
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
    console.error('Purchase Error:', error);
    return NextResponse.json(
      { error: error.message || 'Purchase failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/purchases
 * Get purchases for a buyer (no payment required)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buyer_wallet = searchParams.get('buyer_wallet');

    if (!buyer_wallet) {
      return NextResponse.json(
        { error: 'Buyer wallet address required' },
        { status: 400 }
      );
    }

    const myPurchases = PURCHASES.filter(p => p.buyer_wallet === buyer_wallet);

    // Enrich with listing details
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
