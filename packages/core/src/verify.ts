/**
 * Payment verification utilities
 * Server-side helpers to verify x402 payments
 */

import { Connection, PublicKey } from '@solana/web3.js';

export interface PaymentVerificationResult {
  verified: boolean;
  signature?: string;
  amount?: number;
  sender?: string;
  recipient?: string;
  timestamp?: number;
  error?: string;
}

export interface PaymentRequirements {
  amount: number;
  recipient: string;
  token?: string;
  sessionId?: string;
}

/**
 * Verify a payment transaction on-chain
 * @param signature - Transaction signature
 * @param requirements - Expected payment details
 * @param connection - Solana connection
 * @returns Verification result
 */
export async function verifyPaymentTransaction(
  signature: string,
  requirements: PaymentRequirements,
  connection: Connection
): Promise<PaymentVerificationResult> {
  try {
    // Fetch transaction from blockchain
    const tx = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      return {
        verified: false,
        error: 'Transaction not found on-chain',
      };
    }

    // Check if transaction was successful
    if (tx.meta?.err) {
      return {
        verified: false,
        error: 'Transaction failed on-chain',
      };
    }

    // Extract payment details from transaction
    const preBalances = tx.meta?.preBalances || [];
    const postBalances = tx.meta?.postBalances || [];
    
    // Find the recipient account index
    const recipientPubkey = new PublicKey(requirements.recipient);
    const recipientIndex = tx.transaction.message.staticAccountKeys.findIndex(
      (key) => key.equals(recipientPubkey)
    );

    if (recipientIndex === -1) {
      return {
        verified: false,
        error: 'Recipient not found in transaction',
      };
    }

    // Calculate amount transferred to recipient
    const amountReceived = postBalances[recipientIndex] - preBalances[recipientIndex];
    const amountInSOL = amountReceived / 1_000_000_000; // Convert lamports to SOL

    // Verify amount (allow small difference for fees)
    const amountMatches = Math.abs(amountInSOL - requirements.amount) < 0.000001;

    if (!amountMatches) {
      return {
        verified: false,
        error: `Amount mismatch: expected ${requirements.amount} SOL, got ${amountInSOL} SOL`,
        amount: amountInSOL,
      };
    }

    // Get sender address
    const senderPubkey = tx.transaction.message.staticAccountKeys[0];

    return {
      verified: true,
      signature,
      amount: amountInSOL,
      sender: senderPubkey.toBase58(),
      recipient: requirements.recipient,
      timestamp: tx.blockTime || Date.now() / 1000,
    };
  } catch (error) {
    return {
      verified: false,
      error: `Verification failed: ${(error as Error).message}`,
    };
  }
}

/**
 * Verify payment from x402 headers
 * @param paymentHeader - X-Payment header value
 * @param requirements - Expected payment details
 * @param connection - Solana connection
 * @returns Verification result
 */
export async function verifyPayment(
  paymentHeader: string,
  requirements: PaymentRequirements,
  connection: Connection
): Promise<PaymentVerificationResult> {
  try {
    // Parse payment header (base64 encoded signature)
    const signature = Buffer.from(paymentHeader, 'base64').toString('utf-8');

    // Verify the transaction on-chain
    return await verifyPaymentTransaction(signature, requirements, connection);
  } catch (error) {
    return {
      verified: false,
      error: `Invalid payment header: ${(error as Error).message}`,
    };
  }
}

/**
 * Extract payment header from request headers
 * @param headers - HTTP headers object
 * @returns Payment header value or null
 */
export function extractPaymentHeader(
  headers: Record<string, string | string[] | undefined>
): string | null {
  const paymentHeader = headers['x-payment'] || headers['X-Payment'];
  
  if (!paymentHeader) {
    return null;
  }

  return Array.isArray(paymentHeader) ? paymentHeader[0] : paymentHeader;
}

/**
 * Extract session ID from request headers
 * @param headers - HTTP headers object
 * @returns Session ID or null
 */
export function extractSessionId(
  headers: Record<string, string | string[] | undefined>
): string | null {
  const sessionId = headers['x-session-id'] || headers['X-Session-Id'];
  
  if (!sessionId) {
    return null;
  }

  return Array.isArray(sessionId) ? sessionId[0] : sessionId;
}
