import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

export interface PaymentResult {
  success: boolean;
  signature?: string;
  error?: string;
}

/**
 * Create and send a one-click SOL payment
 * Used for listing fees in x402 marketplace
 */
export async function sendOneClickPayment(
  wallet: WalletContextState,
  recipientAddress: string,
  amountSOL: number,
  connection: Connection
): Promise<PaymentResult> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return {
        success: false,
        error: 'Wallet not connected. Please connect your wallet first.',
      };
    }

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports: amountSOL * LAMPORTS_PER_SOL,
      })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    // Sign and send transaction
    const signed = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());

    // Wait for confirmation (fast confirmation for better UX)
    await connection.confirmTransaction(signature, 'confirmed');

    return {
      success: true,
      signature,
    };
  } catch (error: any) {
    console.error('Payment error:', error);

    // User-friendly error messages
    if (error.message?.includes('User rejected')) {
      return {
        success: false,
        error: 'Payment cancelled by user.',
      };
    }

    if (error.message?.includes('insufficient funds')) {
      return {
        success: false,
        error: `Insufficient SOL balance. You need at least ${amountSOL} SOL plus gas fees.`,
      };
    }

    return {
      success: false,
      error: error.message || 'Payment failed. Please try again.',
    };
  }
}

/**
 * Create and send USDC payment for micropayments
 * Used for buying products in x402 marketplace
 */
export async function sendUSDCPayment(
  wallet: WalletContextState,
  recipientAddress: string,
  amountUSD: number,
  connection: Connection
): Promise<PaymentResult> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return {
        success: false,
        error: 'Wallet not connected. Please connect your wallet first.',
      };
    }

    // In production, this would use SPL Token program to send USDC
    // For now, we'll simulate it
    // TODO: Implement real USDC transfer using @solana/spl-token

    // Simulating payment delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful payment
    const mockSignature = `usdc_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return {
      success: true,
      signature: mockSignature,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'USDC payment failed. Please try again.',
    };
  }
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(
  publicKey: PublicKey,
  connection: Connection
): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Failed to get balance:', error);
    return 0;
  }
}
