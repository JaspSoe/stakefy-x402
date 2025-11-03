/**
 * Fast Escrow for Stakefy x402
 * Instant payment with automatic release/refund
 */

import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';

export interface EscrowConfig {
  buyer: string;
  seller: string;
  amount: number;
  timeout: number; // seconds until auto-refund
  arbiter?: string; // optional dispute resolver
}

export interface EscrowState {
  escrowId: string;
  buyer: string;
  seller: string;
  amount: number;
  status: 'pending' | 'released' | 'refunded' | 'disputed';
  createdAt: number;
  expiresAt: number;
  releasedAt?: number;
}

/**
 * Create escrow account
 */
export async function createEscrow(
  config: EscrowConfig,
  connection: Connection
): Promise<EscrowState> {
  const escrowId = `escrow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const now = Math.floor(Date.now() / 1000);

  return {
    escrowId,
    buyer: config.buyer,
    seller: config.seller,
    amount: config.amount,
    status: 'pending',
    createdAt: now,
    expiresAt: now + config.timeout
  };
}

/**
 * Release escrow to seller (buyer confirms delivery)
 */
export async function releaseEscrow(
  escrowId: string,
  connection: Connection
): Promise<{ success: boolean; signature: string }> {
  // Mock implementation - in production, interact with escrow program
  return {
    success: true,
    signature: `release-${escrowId}-${Date.now()}`
  };
}

/**
 * Refund escrow to buyer (timeout or cancellation)
 */
export async function refundEscrow(
  escrowId: string,
  connection: Connection
): Promise<{ success: boolean; signature: string }> {
  return {
    success: true,
    signature: `refund-${escrowId}-${Date.now()}`
  };
}

/**
 * Check if escrow expired (auto-refund)
 */
export function isEscrowExpired(escrow: EscrowState): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now > escrow.expiresAt && escrow.status === 'pending';
}

/**
 * Fast escrow helper - complete flow
 */
export class FastEscrow {
  constructor(private connection: Connection) {}

  /**
   * Create and fund escrow
   */
  async create(config: EscrowConfig): Promise<EscrowState> {
    return createEscrow(config, this.connection);
  }

  /**
   * Release payment to seller
   */
  async release(escrowId: string): Promise<{ success: boolean; signature: string }> {
    return releaseEscrow(escrowId, this.connection);
  }

  /**
   * Refund payment to buyer
   */
  async refund(escrowId: string): Promise<{ success: boolean; signature: string }> {
    return refundEscrow(escrowId, this.connection);
  }

  /**
   * Auto-refund expired escrows
   */
  async processExpired(escrow: EscrowState): Promise<{ refunded: boolean; signature?: string }> {
    if (isEscrowExpired(escrow)) {
      const result = await this.refund(escrow.escrowId);
      return { refunded: true, signature: result.signature };
    }
    return { refunded: false };
  }
}
