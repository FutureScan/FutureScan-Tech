import { MarketplaceListing } from '@/types';

// Platform configuration
export const MARKETPLACE_CONFIG = {
  POSTING_FEE_SOL: 0.1, // One-time fee to list a product (0.1 SOL)
  FEE_WALLET_ADDRESS: '6NXeYAn75nfunLCMbeEnBtrGJUb8tUs45ApbvPbdNRYD', // Solana wallet for posting fees
  PAYMENT_METHODS: ['crypto', 'card'],
  SUPPORTED_CHAINS: ['solana', 'ethereum', 'polygon', 'bsc'],
  TRANSACTION_CONFIRMATION_BLOCKS: 15, // Number of blocks to wait for confirmation
};

// Mock marketplace listings
const SAMPLE_LISTINGS: MarketplaceListing[] = [
  {
    id: 'ml-001',
    title: 'Premium AI Trading Signals - Monthly Subscription',
    description: 'Get access to our proprietary AI-powered trading signals covering 50+ cryptocurrencies. Includes real-time alerts, entry/exit prices, and risk management strategies.',
    category: 'signals',
    price: 99.99,
    seller: 'FutureScan Pro',
    seller_rating: 4.8,
    total_sales: 1247,
    preview: 'View sample signals from last week with 73% success rate',
    features: [
      'Real-time signal alerts via Telegram/Discord',
      '50+ coins covered daily',
      'Entry, target, and stop-loss levels',
      'Risk/reward analysis for each trade',
      'Historical performance tracking',
      'Money-back guarantee if not profitable'
    ],
    created_at: Date.now() - 30 * 24 * 60 * 60 * 1000,
    verified: true,
  },
  {
    id: 'ml-002',
    title: 'Whale Wallet Tracking Database - Real-time Access',
    description: 'Access our comprehensive database of 10,000+ verified whale wallets across all major chains. Track their movements, get alerts, and analyze patterns.',
    category: 'data',
    price: 149.99,
    seller: 'ChainAnalytics',
    seller_rating: 4.9,
    total_sales: 892,
    preview: 'Sample: Top 10 whale movements from yesterday',
    features: [
      '10,000+ verified whale wallets',
      'Cross-chain tracking (ETH, BSC, Polygon, Solana)',
      'Real-time movement alerts',
      'Historical transaction data',
      'Pattern recognition AI',
      'API access included'
    ],
    created_at: Date.now() - 45 * 24 * 60 * 60 * 1000,
    verified: true,
  },
  {
    id: 'ml-003',
    title: 'Institutional Research Reports - Weekly',
    description: 'Professional-grade research reports covering market analysis, macro trends, sector deep-dives, and investment opportunities. Written by ex-Goldman Sachs analysts.',
    category: 'research',
    price: 199.99,
    seller: 'Crypto Research Group',
    seller_rating: 5.0,
    total_sales: 634,
    preview: 'Download our latest free report: "Q1 2025 Crypto Outlook"',
    features: [
      'Weekly 30-50 page reports',
      'Institutional-grade analysis',
      'Macro + technical + on-chain data',
      'Investment theses with price targets',
      'Risk assessment frameworks',
      'Access to archived reports (200+)'
    ],
    created_at: Date.now() - 60 * 24 * 60 * 60 * 1000,
    verified: true,
  },
  {
    id: 'ml-004',
    title: 'DeFi Yield Farming Bot - Auto-compound & Rebalance',
    description: 'Automated bot that finds the best yields across 20+ DeFi protocols, auto-compounds rewards, and rebalances your portfolio based on risk parameters.',
    category: 'bots',
    price: 299.99,
    seller: 'DeFi Automation Labs',
    seller_rating: 4.7,
    total_sales: 421,
    preview: 'Live demo: See the bot in action on testnet',
    features: [
      'Multi-protocol support (Aave, Compound, Curve, etc.)',
      'Auto-compound rewards every 24h',
      'Gas optimization algorithms',
      'Risk management & stop-loss',
      'Supports $10k - $10M portfolios',
      'White-glove setup assistance'
    ],
    created_at: Date.now() - 20 * 24 * 60 * 60 * 1000,
    verified: true,
  },
  {
    id: 'ml-005',
    title: 'On-Chain Analytics API - Enterprise Grade',
    description: 'RESTful API providing real-time and historical on-chain data for 100+ blockchains. Used by hedge funds and trading firms.',
    category: 'api',
    price: 499.99,
    seller: 'BlockData Systems',
    seller_rating: 4.9,
    total_sales: 287,
    preview: 'API documentation + 1000 free calls',
    features: [
      '100+ blockchain networks',
      '99.9% uptime SLA',
      'Real-time WebSocket feeds',
      'Historical data back to genesis',
      '1M API calls/month included',
      'Dedicated technical support'
    ],
    created_at: Date.now() - 90 * 24 * 60 * 60 * 1000,
    verified: true,
  },
  {
    id: 'ml-006',
    title: 'Smart Money Flow Tracker - Institutional Order Flow',
    description: 'Track where institutional money is flowing. Identify accumulation zones, distribution patterns, and smart money positioning before major moves.',
    category: 'tools',
    price: 179.99,
    seller: 'SmartFlow Analytics',
    seller_rating: 4.6,
    total_sales: 563,
    preview: 'Last week: Identified BTC accumulation 3 days before 15% pump',
    features: [
      'Real-time institutional order flow',
      'Exchange netflow analysis',
      'OTC desk transaction tracking',
      'Smart money wallet clustering',
      'Accumulation/distribution zones',
      'Mobile app + desktop dashboard'
    ],
    created_at: Date.now() - 15 * 24 * 60 * 60 * 1000,
    verified: true,
  },
  {
    id: 'ml-007',
    title: 'NFT Trend Scanner - Early Alpha Finder',
    description: 'AI-powered scanner that identifies trending NFT projects before they moon. Analyzes social signals, whale activity, and mint patterns.',
    category: 'tools',
    price: 129.99,
    seller: 'NFT Alpha Hunters',
    seller_rating: 4.5,
    total_sales: 789,
    preview: 'Called 8/10 top collections in Q4 2024',
    features: [
      'Real-time Twitter/Discord sentiment',
      'Whale wallet NFT purchases',
      'Mint velocity tracking',
      'Floor price alerts',
      'Rarity sniper integration',
      'Community of 5000+ alpha hunters'
    ],
    created_at: Date.now() - 10 * 24 * 60 * 60 * 1000,
    verified: true,
  },
  {
    id: 'ml-008',
    title: 'Crypto Tax Optimization Strategies Report',
    description: 'Comprehensive guide on minimizing crypto taxes legally. Covers tax-loss harvesting, entity structuring, and jurisdiction optimization.',
    category: 'research',
    price: 79.99,
    seller: 'Crypto Tax Advisors',
    seller_rating: 4.8,
    total_sales: 1124,
    preview: 'Save thousands in taxes - Free tax calculator included',
    features: [
      '120-page comprehensive guide',
      'US + EU + Asia tax strategies',
      'Tax-loss harvesting playbook',
      'Entity structuring templates',
      'Quarterly tax planning checklist',
      '1-hour consultation call included'
    ],
    created_at: Date.now() - 40 * 24 * 60 * 60 * 1000,
    verified: true,
  },
];

// Get marketplace listings with optional filtering
export async function getMarketplaceListings(
  category?: MarketplaceListing['category']
): Promise<MarketplaceListing[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (category) {
    return SAMPLE_LISTINGS.filter(listing => listing.category === category);
  }

  return SAMPLE_LISTINGS;
}

// Get single listing by ID
export async function getMarketplaceListing(id: string): Promise<MarketplaceListing | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return SAMPLE_LISTINGS.find(listing => listing.id === id) || null;
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
    SAMPLE_LISTINGS.push(newListing);

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
