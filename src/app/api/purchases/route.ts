import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import type { Purchase, Listing } from '@/types/marketplace';

// Storage (use database in production)
const PURCHASES: Purchase[] = [];

// Import listings storage from listings route
// In production, use shared database
import { LISTINGS } from '../listings/route';

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

/**
 * POST /api/purchases
 * Purchase a product using x402 protocol
 *
 * Payment is sent directly to the seller (peer-to-peer)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listing_id, buyer_wallet, transaction_signature } = body;

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

    // Check if already purchased by this buyer
    const existingPurchase = PURCHASES.find(
      p => p.listing_id === listing_id && p.buyer_wallet === buyer_wallet
    );

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You have already purchased this product' },
        { status: 400 }
      );
    }

    // PAYMENT DISABLED FOR NOW - Will implement x402 later
    // In production, verify transaction_signature on-chain here

    // Create purchase record
    const purchase: Purchase = {
      id: `purchase_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      listing_id: listing.id,
      buyer_wallet,
      seller_wallet: listing.seller_wallet,
      amount: listing.price,
      transaction_signature: transaction_signature || 'FREE_FOR_TESTING',
      purchased_at: Date.now(),
      status: 'completed',
      access_granted: true,
      // Generate access key/url
      access_key: `ACCESS_${listing.id}_${Math.random().toString(36).substring(7)}`,
      access_url: listing.access_info || 'Contact seller for access',
    };

    PURCHASES.push(purchase);

    // Update listing sales count
    const listingIndex = LISTINGS.findIndex(l => l.id === listing_id);
    if (listingIndex !== -1) {
      LISTINGS[listingIndex].total_sales += 1;
    }

    return NextResponse.json({
      success: true,
      purchase,
      message: 'Purchase successful! Access granted.',
    });

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
 * Get purchases for a buyer
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

/**
 * Verify Solana payment transaction (for future x402 implementation)
 */
async function verifyPurchaseTransaction(
  signature: string,
  sellerAddress: string,
  expectedAmount: number
): Promise<{ verified: boolean; error?: string }> {
  try {
    const connection = new Connection(SOLANA_RPC, 'confirmed');

    // Fetch transaction
    const txInfo = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });

    if (!txInfo) {
      return { verified: false, error: 'Transaction not found' };
    }

    if (txInfo.meta?.err) {
      return { verified: false, error: 'Transaction failed' };
    }

    // Verify recipient
    const recipientPubkey = new PublicKey(sellerAddress);
    const accountKeys = txInfo.transaction.message.staticAccountKeys ||
                        txInfo.transaction.message.accountKeys;

    const hasRecipient = accountKeys.some(key =>
      key.toString() === recipientPubkey.toString()
    );

    if (!hasRecipient) {
      return { verified: false, error: 'Wrong recipient' };
    }

    // Verify amount (convert price to lamports)
    const preBalances = txInfo.meta?.preBalances || [];
    const postBalances = txInfo.meta?.postBalances || [];
    const recipientIndex = accountKeys.findIndex(key =>
      key.toString() === recipientPubkey.toString()
    );

    if (recipientIndex >= 0) {
      const received = postBalances[recipientIndex] - preBalances[recipientIndex];
      const expectedLamports = expectedAmount * 1000000000; // Convert SOL to lamports

      if (received < expectedLamports) {
        return {
          verified: false,
          error: `Insufficient payment: received ${received}, expected ${expectedLamports}`
        };
      }
    }

    return { verified: true };

  } catch (error: any) {
    return {
      verified: false,
      error: error.message || 'Verification failed'
    };
  }
}

export { PURCHASES };
