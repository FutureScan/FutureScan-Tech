import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { PaymentToken } from '@/types/marketplace';
import { getTokenMint, TOKEN_CONFIGS } from './tokens';

/**
 * X402 Protocol Client Handler
 * Implements payment flow for Solana (SOL + SPL Tokens)
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

export interface DirectPaymentRequest {
  amount: number;
  token: PaymentToken;
  recipient: string;
  memo?: string;
}

export interface PaymentResult {
  success: boolean;
  signature?: string;
  error?: string;
}

/**
 * Execute direct payment (bypass HTTP 402, used for marketplace purchases)
 */
export async function executeDirectPayment(
  request: DirectPaymentRequest,
  wallet: WalletContextState,
  connection: Connection
): Promise<PaymentResult> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.sendTransaction) {
      throw new Error('Wallet not connected');
    }

    const recipientPubkey = new PublicKey(request.recipient);

    let signature: string;

    if (request.token === 'SOL') {
      // Native SOL transfer
      signature = await transferSOL(
        recipientPubkey,
        request.amount,
        wallet,
        connection,
        request.memo
      );
    } else {
      // SPL Token transfer
      signature = await transferSPLToken(
        recipientPubkey,
        request.amount,
        request.token,
        wallet,
        connection,
        request.memo
      );
    }

    return {
      success: true,
      signature,
    };
  } catch (error: any) {
    console.error('Payment Error:', error);

    // User-friendly error messages
    let errorMessage = 'Payment failed';
    if (error.message?.includes('User rejected') || error.message?.includes('cancelled')) {
      errorMessage = 'Payment cancelled by user';
    } else if (error.message?.includes('insufficient')) {
      errorMessage = `Insufficient ${request.token} balance`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Transfer native SOL
 */
async function transferSOL(
  recipient: PublicKey,
  amount: number,
  wallet: WalletContextState,
  connection: Connection,
  memo?: string
): Promise<string> {
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error('Wallet not connected');
  }

  const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: recipient,
      lamports,
    })
  );

  // Add memo if provided
  if (memo) {
    transaction.add(
      new TransactionInstruction({
        keys: [],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: Buffer.from(memo, 'utf-8'),
      })
    );
  }

  // Get latest blockhash
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash('finalized');

  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  // Send transaction
  const signature = await wallet.sendTransaction(transaction, connection, {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
  });

  // Confirm transaction
  await connection.confirmTransaction(
    {
      signature,
      blockhash,
      lastValidBlockHeight,
    },
    'confirmed'
  );

  return signature;
}

/**
 * Transfer SPL Token
 */
async function transferSPLToken(
  recipient: PublicKey,
  amount: number,
  token: PaymentToken,
  wallet: WalletContextState,
  connection: Connection,
  memo?: string
): Promise<string> {
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error('Wallet not connected');
  }

  const tokenMint = getTokenMint(token);
  const tokenConfig = TOKEN_CONFIGS[token];
  const tokenAmount = Math.floor(amount * Math.pow(10, tokenConfig.decimals));

  // Get sender's token account
  const senderTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    wallet.publicKey
  );

  // Check sender has token account and balance
  try {
    const senderAccount = await getAccount(connection, senderTokenAccount);
    if (Number(senderAccount.amount) < tokenAmount) {
      throw new Error(`Insufficient ${token} balance`);
    }
  } catch (error) {
    throw new Error(`No ${token} token account found. Please add ${token} to your wallet first.`);
  }

  // Get recipient's token account
  const recipientTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    recipient
  );

  const transaction = new Transaction();

  // Check if recipient token account exists, create if not
  try {
    await getAccount(connection, recipientTokenAccount);
  } catch (error) {
    // Account doesn't exist, create it
    transaction.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        recipientTokenAccount,
        recipient,
        tokenMint
      )
    );
  }

  // Add transfer instruction
  transaction.add(
    createTransferInstruction(
      senderTokenAccount,
      recipientTokenAccount,
      wallet.publicKey,
      tokenAmount,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  // Add memo if provided
  if (memo) {
    transaction.add(
      new TransactionInstruction({
        keys: [],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: Buffer.from(memo, 'utf-8'),
      })
    );
  }

  // Get latest blockhash
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash('finalized');

  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  // Send transaction
  const signature = await wallet.sendTransaction(transaction, connection, {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
  });

  // Confirm transaction
  await connection.confirmTransaction(
    {
      signature,
      blockhash,
      lastValidBlockHeight,
    },
    'confirmed'
  );

  return signature;
}

/**
 * Check if user has sufficient balance
 */
export async function checkBalance(
  amount: number,
  token: PaymentToken,
  wallet: WalletContextState,
  connection: Connection
): Promise<{ sufficient: boolean; balance: number; required: number }> {
  try {
    if (!wallet.publicKey) {
      return { sufficient: false, balance: 0, required: amount };
    }

    if (token === 'SOL') {
      const balance = await connection.getBalance(wallet.publicKey);
      const balanceSOL = balance / LAMPORTS_PER_SOL;
      // Add buffer for tx fees (0.00001 SOL)
      const required = amount + 0.00001;
      return {
        sufficient: balanceSOL >= required,
        balance: balanceSOL,
        required: amount,
      };
    } else {
      const tokenMint = getTokenMint(token);
      const tokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        wallet.publicKey
      );

      try {
        const account = await getAccount(connection, tokenAccount);
        const tokenConfig = TOKEN_CONFIGS[token];
        const balance = Number(account.amount) / Math.pow(10, tokenConfig.decimals);
        return {
          sufficient: balance >= amount,
          balance,
          required: amount,
        };
      } catch {
        return { sufficient: false, balance: 0, required: amount };
      }
    }
  } catch (error) {
    console.error('Balance check error:', error);
    return { sufficient: false, balance: 0, required: amount };
  }
}

/**
 * Get user's token balance
 */
export async function getBalance(
  token: PaymentToken,
  wallet: WalletContextState,
  connection: Connection
): Promise<number> {
  try {
    if (!wallet.publicKey) {
      return 0;
    }

    if (token === 'SOL') {
      const balance = await connection.getBalance(wallet.publicKey);
      return balance / LAMPORTS_PER_SOL;
    } else {
      const tokenMint = getTokenMint(token);
      const tokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        wallet.publicKey
      );

      try {
        const account = await getAccount(connection, tokenAccount);
        const tokenConfig = TOKEN_CONFIGS[token];
        return Number(account.amount) / Math.pow(10, tokenConfig.decimals);
      } catch {
        return 0;
      }
    }
  } catch (error) {
    console.error('Get balance error:', error);
    return 0;
  }
}
