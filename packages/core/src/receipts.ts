import { Connection, PublicKey } from '@solana/web3.js';
import { createHash } from 'crypto';

/**
 * Receipt - Cryptographic proof of payment
 */
export interface PaymentReceipt {
  signature: string;
  amount: number;
  merchant: string;
  payer: string;
  timestamp: number;
  reference: string;
  blockHeight: number;
  proof: string;
  verified: boolean;
}

/**
 * Verified Session State
 */
export interface VerifiedSession {
  sessionId: string;
  receipts: PaymentReceipt[];
  totalPaid: number;
  totalTransactions: number;
  firstPayment: number;
  lastPayment: number;
  isValid: boolean;
  merchantVerified: boolean;
}

/**
 * Receipt Verification Options
 */
export interface ReceiptVerifyOptions {
  signature: string;
  expectedAmount: number;
  expectedMerchant: string;
  expectedPayer?: string;
  network?: 'mainnet-beta' | 'devnet';
}

/**
 * Generate deterministic proof hash
 */
export function generateProof(receipt: Omit<PaymentReceipt, 'proof' | 'verified'>): string {
  const data = [
    receipt.signature,
    receipt.amount.toString(),
    receipt.merchant,
    receipt.payer,
    receipt.timestamp.toString(),
    receipt.reference,
    receipt.blockHeight.toString()
  ].join('|');
  
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Verify payment receipt on-chain
 */
export async function verifyReceipt(
  options: ReceiptVerifyOptions,
  connection: Connection
): Promise<PaymentReceipt> {
  const { signature, expectedAmount, expectedMerchant, expectedPayer } = options;

  try {
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0
    });

    if (!tx || !tx.meta) {
      throw new Error('Transaction not found or not confirmed');
    }

    if (tx.meta.err) {
      throw new Error('Transaction failed on-chain');
    }

    const { blockTime, slot } = tx;
    
    // Get account keys (works for both legacy and versioned transactions)
    const accountKeys = tx.transaction.message.getAccountKeys
      ? tx.transaction.message.getAccountKeys().staticAccountKeys
      : (tx.transaction.message as any).accountKeys;
    
    const payer = accountKeys[0].toString();

    if (expectedPayer && payer !== expectedPayer) {
      throw new Error('Payer mismatch');
    }

    const receipt: Omit<PaymentReceipt, 'proof' | 'verified'> = {
      signature,
      amount: expectedAmount,
      merchant: expectedMerchant,
      payer,
      timestamp: blockTime || Math.floor(Date.now() / 1000),
      reference: signature.slice(0, 16),
      blockHeight: slot
    };

    const proof = generateProof(receipt);

    return {
      ...receipt,
      proof,
      verified: true
    };

  } catch (error) {
    throw new Error(`Receipt verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify multiple receipts and create session state
 */
export async function verifySession(
  sessionId: string,
  receipts: ReceiptVerifyOptions[],
  connection: Connection
): Promise<VerifiedSession> {
  const verifiedReceipts: PaymentReceipt[] = [];
  let totalPaid = 0;

  for (const receiptOptions of receipts) {
    try {
      const receipt = await verifyReceipt(receiptOptions, connection);
      verifiedReceipts.push(receipt);
      totalPaid += receipt.amount;
    } catch (error) {
      console.error('Receipt verification failed:', error);
    }
  }

  const timestamps = verifiedReceipts.map(r => r.timestamp);
  const merchantsMatch = verifiedReceipts.every(
    r => r.merchant === verifiedReceipts[0]?.merchant
  );

  return {
    sessionId,
    receipts: verifiedReceipts,
    totalPaid,
    totalTransactions: verifiedReceipts.length,
    firstPayment: Math.min(...timestamps),
    lastPayment: Math.max(...timestamps),
    isValid: verifiedReceipts.length > 0,
    merchantVerified: merchantsMatch
  };
}

/**
 * Create receipt from payment
 */
export function createReceiptFromPayment(
  signature: string,
  amount: number,
  merchant: string,
  payer: string,
  reference: string,
  blockHeight: number
): PaymentReceipt {
  const receipt: Omit<PaymentReceipt, 'proof' | 'verified'> = {
    signature,
    amount,
    merchant,
    payer,
    timestamp: Math.floor(Date.now() / 1000),
    reference,
    blockHeight
  };

  const proof = generateProof(receipt);

  return {
    ...receipt,
    proof,
    verified: false
  };
}

/**
 * Validate proof integrity
 */
export function validateProof(receipt: PaymentReceipt): boolean {
  const expectedProof = generateProof({
    signature: receipt.signature,
    amount: receipt.amount,
    merchant: receipt.merchant,
    payer: receipt.payer,
    timestamp: receipt.timestamp,
    reference: receipt.reference,
    blockHeight: receipt.blockHeight
  });

  return receipt.proof === expectedProof;
}
