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
      MARKETPLACE_CONFIG.POSTING_FEE_SOL,
      MARKETPLACE_CONFIG.FEE_WALLET_ADDRESS
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
