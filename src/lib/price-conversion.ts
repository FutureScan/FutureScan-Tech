import { PaymentToken } from '@/types/marketplace';

/**
 * Price Conversion Service
 * Converts USD prices to crypto token amounts
 */

// Simulated exchange rates (in production, fetch from API like CoinGecko/Jupiter)
const EXCHANGE_RATES: Record<PaymentToken, number> = {
  SOL: 180.50,      // $180.50 per SOL
  USDC: 1.00,       // $1.00 per USDC (stablecoin)
  BONK: 0.00002,    // $0.00002 per BONK
  USDT: 1.00,       // $1.00 per USDT (stablecoin)
  RAY: 3.25,        // $3.25 per RAY
  ORCA: 1.85,       // $1.85 per ORCA
};

/**
 * Convert USD price to crypto token amount
 */
export function convertUSDToToken(usdAmount: number, token: PaymentToken): number {
  const rate = EXCHANGE_RATES[token];
  const tokenAmount = usdAmount / rate;

  // Round based on token type
  if (token === 'SOL') {
    return Math.ceil(tokenAmount * 100000) / 100000; // 5 decimals
  } else if (token === 'BONK') {
    return Math.ceil(tokenAmount); // Whole numbers
  } else {
    return Math.ceil(tokenAmount * 100) / 100; // 2 decimals
  }
}

/**
 * Convert crypto token amount to USD
 */
export function convertTokenToUSD(tokenAmount: number, token: PaymentToken): number {
  const rate = EXCHANGE_RATES[token];
  return Math.round(tokenAmount * rate * 100) / 100;
}

/**
 * Get current exchange rate for a token
 */
export function getExchangeRate(token: PaymentToken): number {
  return EXCHANGE_RATES[token];
}

/**
 * Format price display: $5.00 (0.0277 SOL)
 */
export function formatPriceDisplay(usdAmount: number, token: PaymentToken): string {
  const tokenAmount = convertUSDToToken(usdAmount, token);

  if (token === 'USDC' || token === 'USDT') {
    return `$${usdAmount.toFixed(2)} (${tokenAmount.toFixed(2)} ${token})`;
  } else if (token === 'BONK') {
    return `$${usdAmount.toFixed(2)} (${tokenAmount.toLocaleString()} ${token})`;
  } else {
    return `$${usdAmount.toFixed(2)} (${tokenAmount.toFixed(4)} ${token})`;
  }
}

/**
 * Fetch live exchange rates (for production)
 * This would call CoinGecko, Jupiter, or Pyth Network APIs
 */
export async function fetchLiveExchangeRates(): Promise<Record<PaymentToken, number>> {
  // TODO: Implement live price fetching
  // For now, return static rates
  return EXCHANGE_RATES;
}
