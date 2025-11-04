import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import type { Listing, PaymentToken } from '@/types/marketplace';
import { LISTINGS } from '@/lib/marketplace-store';

/**
 * POST /api/listings
 * Create new marketplace listing (no listing fee required)
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

    if (!body.title || !body.description || !body.price || !body.payment_token) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, price, payment_token' },
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

    const newListing: Listing = {
      id: `listing_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      title: body.title,
      description: body.description,
      category: body.category,
      price: body.price,
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
     *             listingTitle: body.title || 'New Product',
     *             category: body.category || 'unknown',
     *           },
     *         },
     *       },
     *     ],
     *   };
     *
     *   return NextResponse.json(paymentRequirements, {
     *     status: 402,
     *     headers: {
     *       'Content-Type': 'application/json',
     *       'X-Payment-Required': 'true',
     *     },
     *   });
     * }
     *
     * // STEP 2: Verify X-PAYMENT header
     * let paymentPayload: any;
     * try {
     *   const decoded = Buffer.from(xPaymentHeader, 'base64').toString('utf-8');
     *   paymentPayload = JSON.parse(decoded);
     * } catch (error) {
     *   return NextResponse.json(
     *     { error: 'Invalid X-PAYMENT header format' },
     *     { status: 400 }
     *   );
     * }
     *
     * if (!paymentPayload.signature || !paymentPayload.transaction) {
     *   return NextResponse.json(
     *     { error: 'Missing required payment fields' },
     *     { status: 400 }
     *   );
     * }
     *
     * // STEP 3: Verify payment on-chain
     * const verificationResult = await verifyPaymentOnChain(
     *   paymentPayload.signature,
     *   paymentPayload.transaction
     * );
     *
     * if (!verificationResult.verified) {
     *   return NextResponse.json(
     *     { error: verificationResult.error || 'Payment verification failed' },
     *     { status: 402 }
     *   );
     * }
     *
     * // Add payment signature to listing
     * newListing.payment_signature = paymentPayload.signature;
     *
     * // Create X-PAYMENT-RESPONSE header
     * const paymentResponse = {
     *   status: 'settled',
     *   transactionId: paymentPayload.signature,
     *   timestamp: Date.now(),
     *   amount: X402_CONFIG.LISTING_FEE_LAMPORTS.toString(),
     *   resource: '/api/listings',
     * };
     *
     * return NextResponse.json(
     *   { success: true, listing: newListing, message: 'Listing created successfully' },
     *   {
     *     status: 200,
     *     headers: {
     *       'X-PAYMENT-RESPONSE': Buffer.from(JSON.stringify(paymentResponse)).toString('base64'),
     *       'Content-Type': 'application/json',
     *     },
     *   }
     * );
     * ============================================================================
     */

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
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

/**
 * Verify Solana transaction on-chain
 */
async function verifyPaymentOnChain(
  signature: string,
  transactionBase58: string
): Promise<{ verified: boolean; error?: string }> {
  try {
    const connection = new Connection(X402_CONFIG.SOLANA_RPC, 'confirmed');

    // Verify signature format
    if (!signature || signature.length < 64) {
      return { verified: false, error: 'Invalid signature format' };
    }

    // Fetch transaction from blockchain
    const txInfo = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });

    if (!txInfo) {
      return { verified: false, error: 'Transaction not found on blockchain' };
    }

    // Verify transaction success
    if (txInfo.meta?.err) {
      return { verified: false, error: 'Transaction failed on-chain' };
    }

    // Verify recipient
    const recipientPubkey = new PublicKey(X402_CONFIG.FEE_WALLET_ADDRESS);
    const accountKeys = txInfo.transaction.message.staticAccountKeys ||
                        txInfo.transaction.message.accountKeys;

    const hasRecipient = accountKeys.some(key =>
      key.toString() === recipientPubkey.toString()
    );

    if (!hasRecipient) {
      return { verified: false, error: 'Transaction recipient mismatch' };
    }

    // Verify amount (check post-balances)
    const preBalances = txInfo.meta?.preBalances || [];
    const postBalances = txInfo.meta?.postBalances || [];

    const recipientIndex = accountKeys.findIndex(key =>
      key.toString() === recipientPubkey.toString()
    );

    if (recipientIndex >= 0) {
      const received = postBalances[recipientIndex] - preBalances[recipientIndex];

      if (received < X402_CONFIG.LISTING_FEE_LAMPORTS) {
        return {
          verified: false,
          error: `Insufficient payment: ${received} lamports (expected ${X402_CONFIG.LISTING_FEE_LAMPORTS})`
        };
      }
    }

    return { verified: true };
  } catch (error: any) {
    console.error('Verification error:', error);
    return {
      verified: false,
      error: error.message || 'Failed to verify payment on-chain'
    };
  }
}
