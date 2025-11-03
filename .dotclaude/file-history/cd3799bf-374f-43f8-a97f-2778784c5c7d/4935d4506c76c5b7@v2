import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';

/**
 * X402 Protocol Client Handler
 * Implements the official x402 payment flow for Solana
 */

export interface X402PaymentRequirement {
  scheme: string;
  network: string;
  price: {
    amount: string;
    asset: {
      address: string;
      decimals: number;
      symbol: string;
    };
  };
  payTo: string;
  maxTimeoutSeconds: number;
  config: {
    description: string;
    resource: string;
    metadata?: any;
  };
}

export interface X402PaymentPayload {
  scheme: string;
  network: string;
  signature: string;
  transaction: string;
  timestamp: number;
}

export interface X402Response<T> {
  success: boolean;
  data?: T;
  paymentRequired?: {
    paymentRequirements: X402PaymentRequirement[];
  };
  error?: string;
}

/**
 * Execute x402 payment flow
 * Automatically handles HTTP 402 responses and payment creation
 */
export async function executeX402Request<T>(
  url: string,
  body: any,
  wallet: WalletContextState,
  connection: Connection
): Promise<X402Response<T>> {
  try {
    // Step 1: Initial request (without payment)
    const initialResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // If not 402, return response
    if (initialResponse.status !== 402) {
      if (initialResponse.ok) {
        const data = await initialResponse.json();
        return { success: true, data };
      } else {
        const error = await initialResponse.json();
        return { success: false, error: error.error || 'Request failed' };
      }
    }

    // Step 2: HTTP 402 received - extract PaymentRequirements
    const paymentRequiredResponse = await initialResponse.json();
    const paymentRequirements = paymentRequiredResponse.paymentRequirements;

    if (!paymentRequirements || paymentRequirements.length === 0) {
      return { success: false, error: 'No payment requirements provided' };
    }

    // Use first payment requirement
    const requirement = paymentRequirements[0];

    // Step 3: Create and sign payment transaction
    const paymentResult = await createPaymentFromRequirement(
      requirement,
      wallet,
      connection
    );

    if (!paymentResult.success || !paymentResult.payload) {
      return {
        success: false,
        error: paymentResult.error || 'Failed to create payment'
      };
    }

    // Step 4: Retry request with X-PAYMENT header
    const xPaymentHeader = Buffer.from(JSON.stringify(paymentResult.payload)).toString('base64');

    const paidResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PAYMENT': xPaymentHeader,
      },
      body: JSON.stringify(body),
    });

    if (paidResponse.ok) {
      const data = await paidResponse.json();
      return { success: true, data };
    } else {
      const error = await paidResponse.json();
      return { success: false, error: error.error || 'Payment verification failed' };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'X402 request failed'
    };
  }
}

/**
 * Create payment transaction from x402 PaymentRequirement
 */
async function createPaymentFromRequirement(
  requirement: X402PaymentRequirement,
  wallet: WalletContextState,
  connection: Connection
): Promise<{ success: boolean; payload?: X402PaymentPayload; error?: string }> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    // Validate scheme
    if (requirement.scheme !== 'solana-transfer') {
      return { success: false, error: `Unsupported payment scheme: ${requirement.scheme}` };
    }

    // Parse amount and recipient
    const amountLamports = parseInt(requirement.price.amount);
    const recipientPubkey = new PublicKey(requirement.payTo);

    // Create transfer transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientPubkey,
        lamports: amountLamports,
      })
    );

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    // Sign transaction
    const signed = await wallet.signTransaction(transaction);

    // Send and confirm transaction
    const signature = await connection.sendRawTransaction(signed.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });

    // Wait for confirmation
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed');

    // Create X-PAYMENT payload
    const payload: X402PaymentPayload = {
      scheme: requirement.scheme,
      network: requirement.network,
      signature: signature,
      transaction: bs58.encode(signed.serialize()),
      timestamp: Date.now(),
    };

    return { success: true, payload };
  } catch (error: any) {
    console.error('Payment creation error:', error);

    // User-friendly error messages
    if (error.message?.includes('User rejected')) {
      return { success: false, error: 'Payment cancelled by user' };
    }

    if (error.message?.includes('insufficient funds')) {
      return { success: false, error: 'Insufficient SOL balance' };
    }

    return {
      success: false,
      error: error.message || 'Failed to create payment transaction'
    };
  }
}

/**
 * Check if wallet has sufficient balance for payment requirement
 */
export async function checkSufficientBalance(
  requirement: X402PaymentRequirement,
  wallet: WalletContextState,
  connection: Connection
): Promise<{ sufficient: boolean; balance: number; required: number }> {
  try {
    if (!wallet.publicKey) {
      return { sufficient: false, balance: 0, required: 0 };
    }

    const balance = await connection.getBalance(wallet.publicKey);
    const required = parseInt(requirement.price.amount);

    // Add some buffer for transaction fees
    const requiredWithFees = required + 5000; // ~0.000005 SOL for fees

    return {
      sufficient: balance >= requiredWithFees,
      balance: balance / LAMPORTS_PER_SOL,
      required: required / LAMPORTS_PER_SOL,
    };
  } catch (error) {
    return { sufficient: false, balance: 0, required: 0 };
  }
}
