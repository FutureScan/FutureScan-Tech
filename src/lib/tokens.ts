import { PublicKey } from '@solana/web3.js';
import { PaymentToken } from '@/types/marketplace';

export interface TokenConfig {
  symbol: PaymentToken;
  name: string;
  mint: string; // SPL Token Mint Address
  decimals: number;
  icon: string;
}

// Mainnet SPL Token Addresses
export const TOKEN_CONFIGS: Record<PaymentToken, TokenConfig> = {
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    mint: 'So11111111111111111111111111111111111111112', // Wrapped SOL
    decimals: 9,
    icon: '◎',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC on Solana
    decimals: 6,
    icon: '$',
  },
  BONK: {
    symbol: 'BONK',
    name: 'Bonk',
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
    decimals: 5,
    icon: '🐕',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT on Solana
    decimals: 6,
    icon: '₮',
  },
  RAY: {
    symbol: 'RAY',
    name: 'Raydium',
    mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', // RAY
    decimals: 6,
    icon: '⚡',
  },
  ORCA: {
    symbol: 'ORCA',
    name: 'Orca',
    mint: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE', // ORCA
    decimals: 6,
    icon: '🐋',
  },
};

export function getTokenConfig(token: PaymentToken): TokenConfig {
  return TOKEN_CONFIGS[token];
}

export function getTokenMint(token: PaymentToken): PublicKey {
  return new PublicKey(TOKEN_CONFIGS[token].mint);
}

export function formatTokenAmount(amount: number, token: PaymentToken): string {
  const config = TOKEN_CONFIGS[token];
  const formatted = amount.toFixed(token === 'SOL' ? 4 : token === 'BONK' ? 0 : 2);
  return `${config.icon}${formatted} ${token}`;
}
