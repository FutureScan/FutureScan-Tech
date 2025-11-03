import { MarketplaceListing, X402PaymentIntent, X402PaymentProof, X402PaymentResponse, X402Chain, X402Currency } from '@/types';

// x402 Protocol Configuration
export const X402_CONFIG = {
  // Seller listing fee (one-time payment to list products)
  LISTING_FEE_SOL: 0.1,
  FEE_WALLET_ADDRESS: '6NXeYAn75nfunLCMbeEnBtrGJUb8tUs45ApbvPbdNRYD',

  // x402 micropayment settings
  SUPPORTED_CHAINS: ['solana', 'base', 'ethereum', 'polygon'] as X402Chain[],
  SUPPORTED_CURRENCIES: ['USDC', 'SOL', 'ETH', 'USDT'] as X402Currency[],
  DEFAULT_CHAIN: 'solana' as X402Chain,
  DEFAULT_CURRENCY: 'USDC' as X402Currency,

  // Payment intent expiration (5 minutes)
  PAYMENT_INTENT_TTL: 5 * 60 * 1000,

  // Transaction confirmation requirements
  CONFIRMATION_BLOCKS: {
    solana: 15,
    base: 12,
    ethereum: 12,
    polygon: 20,
  },

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000, // milliseconds
};

// Marketplace listings - starts empty, sellers will add their products
const MARKETPLACE_LISTINGS: MarketplaceListing[] = [];

// Active payment intents (in-memory store for demo)
const PAYMENT_INTENTS = new Map<string, X402PaymentIntent>();


// Get marketplace listings with optional filtering
export async function getMarketplaceListings(
  category?: MarketplaceListing['category']
): Promise<MarketplaceListing[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (category) {
    return MARKETPLACE_LISTINGS.filter(listing => listing.category === category);
  }

  return MARKETPLACE_LISTINGS;
}

// Get single listing by ID
export async function getMarketplaceListing(id: string): Promise<MarketplaceListing | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return MARKETPLACE_LISTINGS.find(listing => listing.id === id) || null;
}

// Verify Solana transaction on-chain
export async function verifySolanaTransaction(
  signature: string,
  expectedAmount: number,
  expectedRecipient: string
): Promise<{ verified: boolean; error?: string }> {
  try {
    // In production, this would use @solana/web3.js to verify the transaction
    // For now, we'll simulate the verification process

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock verification logic
    // In production, you would:
    // 1. Create a Connection to Solana mainnet
    // 2. Fetch the transaction using getTransaction(signature)
    // 3. Verify the recipient matches FEE_WALLET_ADDRESS
    // 4. Verify the amount matches POSTING_FEE_SOL
    // 5. Check transaction has sufficient confirmations

    // For demo purposes, validate signature format
    if (!signature || signature.length < 64) {
      return {
        verified: false,
        error: 'Invalid transaction signature format',
      };
    }

    // Simulate successful verification (95% success rate)
    if (Math.random() > 0.05) {
      return { verified: true };
    }

    return {
      verified: false,
      error: 'Transaction not found or not confirmed yet. Please wait a moment and try again.',
    };
  } catch (error) {
    return {
      verified: false,
      error: 'Failed to verify transaction. Please try again.',
    };
  }
}

// Submit a new listing (requires posting fee verification)
export async function submitListing(
  listing: Omit<MarketplaceListing, 'id' | 'created_at' | 'total_sales'>,
  transactionSignature: string
): Promise<{ success: boolean; listingId?: string; error?: string }> {
  try {
    // Step 1: Verify the Solana transaction
    const verification = await verifySolanaTransaction(
      transactionSignature,
      X402_CONFIG.LISTING_FEE_SOL,
      X402_CONFIG.FEE_WALLET_ADDRESS
    );

    if (!verification.verified) {
      return {
        success: false,
        error: verification.error || 'Transaction verification failed',
      };
    }

    // Step 2: Create the listing
    const newListing: MarketplaceListing = {
      ...listing,
      id: `ml-${Date.now()}`,
      created_at: Date.now(),
      total_sales: 0,
    };

    // In production, this would save to a database
    MARKETPLACE_LISTINGS.push(newListing);

    return {
      success: true,
      listingId: newListing.id,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to submit listing. Please try again.',
    };
  }
}

// Process purchase (no platform fee on purchases, just direct payment to seller)
export async function processPurchase(
  listingId: string,
  paymentMethod: 'crypto' | 'card',
  buyerAddress?: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  // In production, this would integrate with payment processors
  // For crypto: Web3 wallet integration (direct payment to seller)
  // For cards: Stripe/PayPal integration (direct payment to seller)

  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock successful purchase
  if (Math.random() > 0.05) { // 95% success rate
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };
  }

  return {
    success: false,
    error: 'Payment processing failed. Please try again.',
  };
}

// ============================================================================
// x402 Protocol Implementation
// ============================================================================

/**
 * Create x402 payment intent for instant micropayments
 * Returns HTTP 402 Payment Required with payment details
 */
export async function createX402PaymentIntent(
  listingId: string,
  buyerAddress?: string,
  chain: X402Chain = X402_CONFIG.DEFAULT_CHAIN,
  currency: X402Currency = X402_CONFIG.DEFAULT_CURRENCY
): Promise<X402PaymentIntent> {
  const listing = await getMarketplaceListing(listingId);

  if (!listing) {
    throw new Error('Listing not found');
  }

  const intent_id = `x402_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const expires_at = Date.now() + X402_CONFIG.PAYMENT_INTENT_TTL;

  const paymentIntent: X402PaymentIntent = {
    intent_id,
    listing_id: listingId,
    amount: listing.price,
    currency,
    chain,
    recipient_address: listing.seller, // Direct payment to seller
    expires_at,
    metadata: {
      listing_title: listing.title,
      seller: listing.seller,
      buyer_address: buyerAddress,
    },
  };

  // Store intent in memory (in production, use database with TTL)
  PAYMENT_INTENTS.set(intent_id, paymentIntent);

  // Clean up expired intents
  setTimeout(() => {
    PAYMENT_INTENTS.delete(intent_id);
  }, X402_CONFIG.PAYMENT_INTENT_TTL);

  return paymentIntent;
}

/**
 * Verify x402 payment proof and grant access
 * Implements instant verification with retry logic
 */
export async function verifyX402Payment(
  proof: X402PaymentProof
): Promise<X402PaymentResponse> {
  try {
    // Step 1: Get payment intent
    const intent = PAYMENT_INTENTS.get(proof.intent_id);

    if (!intent) {
      return {
        success: false,
        payment_verified: false,
        access_granted: false,
        error: 'Payment intent not found or expired. Please create a new payment intent.',
      };
    }

    // Step 2: Check if intent expired
    if (Date.now() > intent.expires_at) {
      PAYMENT_INTENTS.delete(proof.intent_id);
      return {
        success: false,
        payment_verified: false,
        access_granted: false,
        error: 'Payment intent expired. Please create a new payment intent.',
      };
    }

    // Step 3: Verify transaction on-chain
    const verification = await verifyOnChainTransaction(
      proof.transaction_signature,
      intent.amount,
      intent.recipient_address,
      proof.chain
    );

    if (!verification.verified) {
      return {
        success: false,
        payment_verified: false,
        access_granted: false,
        error: verification.error || 'Transaction verification failed',
        retry_after: verification.retry_after,
      };
    }

    // Step 4: Grant access and clean up intent
    PAYMENT_INTENTS.delete(proof.intent_id);

    // Update listing stats
    const listing = await getMarketplaceListing(intent.listing_id);
    if (listing) {
      listing.total_sales++;
    }

    return {
      success: true,
      payment_verified: true,
      access_granted: true,
      transaction_id: proof.transaction_signature,
    };
  } catch (error) {
    return {
      success: false,
      payment_verified: false,
      access_granted: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Verify on-chain transaction with retry logic
 * Supports multiple chains (Solana, Base, Ethereum, Polygon)
 */
async function verifyOnChainTransaction(
  signature: string,
  expectedAmount: number,
  expectedRecipient: string,
  chain: X402Chain,
  retryCount: number = 0
): Promise<{ verified: boolean; error?: string; retry_after?: number }> {
  try {
    // In production, this would use chain-specific SDKs:
    // - Solana: @solana/web3.js
    // - Base/Ethereum/Polygon: ethers.js or viem

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate signature format
    if (!signature || signature.length < 32) {
      return {
        verified: false,
        error: 'Invalid transaction signature format',
      };
    }

    // Simulate verification with 95% success rate
    if (Math.random() > 0.05) {
      return { verified: true };
    }

    // If verification fails and retries available, suggest retry
    if (retryCount < X402_CONFIG.MAX_RETRIES) {
      return {
        verified: false,
        error: 'Transaction not confirmed yet. Please retry in a few seconds.',
        retry_after: X402_CONFIG.RETRY_DELAY / 1000,
      };
    }

    return {
      verified: false,
      error: 'Transaction verification failed after multiple attempts. Please check your transaction and try again.',
    };
  } catch (error) {
    return {
      verified: false,
      error: 'Failed to verify transaction. Please try again.',
      retry_after: retryCount < X402_CONFIG.MAX_RETRIES ? X402_CONFIG.RETRY_DELAY / 1000 : undefined,
    };
  }
}

/**
 * Get x402 payment intent by ID
 */
export async function getX402PaymentIntent(intent_id: string): Promise<X402PaymentIntent | null> {
  return PAYMENT_INTENTS.get(intent_id) || null;
}

/**
 * Check if listing supports x402 protocol
 * All listings support x402 by default
 */
export function supportsX402(listing: MarketplaceListing): boolean {
  return true; // All listings support instant x402 micropayments
}
