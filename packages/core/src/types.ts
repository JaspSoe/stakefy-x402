import { z } from 'zod';

// Zod schemas for runtime validation
export const PaymentRequestSchema = z.object({
  amount: z.number().positive(),
  merchantId: z.string(),
  reference: z.string(),
  metadata: z.any().optional(),
  webhookUrl: z.string().url().optional(),
});

export const BudgetRequestSchema = z.object({
  amount: z.number().positive(),
  duration: z.number().positive(),
  userPublicKey: z.string(),
  merchantId: z.string(),
  metadata: z.any().optional(),
});

export const UsernameRequestSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  publicKey: z.string(),
  metadata: z.any().optional(),
});

export const ChannelRequestSchema = z.object({
  depositAmount: z.number().positive(),
  duration: z.number().positive(),
  userPublicKey: z.string(),
  merchantId: z.string(),
  metadata: z.any().optional(),
});

// TypeScript types
export interface PaymentRequest {
  amount: number;
  merchantId: string;
  reference: string;
  metadata?: any;
  webhookUrl?: string;
}

export interface PaymentResponse {
  sessionId: string;
  merchantId: string;
  amount: number;
  feeAmount: number;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  depositAddress: string;
  createdAt: string;
  expiresAt: string;
  qrCode: string;
  solanaPayUrl: string;
}

export interface BudgetRequest {
  amount: number;
  duration: number;
  userPublicKey: string;
  merchantId: string;
  metadata?: any;
}

export interface BudgetResponse {
  budgetId: string;
  merchantId: string;
  userPublicKey: string;
  totalAmount: number;
  remainingAmount: number;
  feeAmount: number;
  status: 'active' | 'depleted' | 'expired' | 'cancelled';
  createdAt: string;
  expiresAt: string;
}

export interface BudgetPaymentRequest {
  budgetId: string;
  amount: number;
  reference: string;
  metadata?: any;
}

export interface UsernameRequest {
  username: string;
  publicKey: string;
  metadata?: any;
}

export interface UserProfile {
  username: string;
  publicKey: string;
  reputation: number;
  totalTransactions: number;
  totalVolume: number;
  successfulPayments: number;
  failedPayments: number;
  createdAt: string;
  lastActive: string;
}

export interface UsernamePaymentRequest {
  username: string;
  amount: number;
  reference: string;
  metadata?: any;
}

export interface ChannelRequest {
  depositAmount: number;
  duration: number;
  userPublicKey: string;
  merchantId: string;
  metadata?: any;
}

export interface ChannelResponse {
  channelId: string;
  userPublicKey: string;
  merchantId: string;
  depositAmount: number;
  withdrawnAmount: number;
  remainingBalance: number;
  status: 'open' | 'closed' | 'settled';
  nonce: number;
  createdAt: string;
  expiresAt: string;
}

export interface ChannelPaymentRequest {
  channelId: string;
  amount: number;
  nonce: number;
  signature: string;
  reference: string;
  metadata?: any;
}

export interface StakefyConfig {
  apiUrl: string;
  network?: 'mainnet-beta' | 'devnet' | 'testnet';
  timeout?: number;
}

// Webhook types
export interface WebhookEvent {
  event: 'payment.created' | 'payment.completed' | 'payment.failed' | 'budget.created' | 'budget.depleted' | 'channel.opened' | 'channel.settled';
  sessionId?: string;
  budgetId?: string;
  channelId?: string;
  merchantId: string;
  amount?: number;
  feeAmount?: number;
  status?: string;
  timestamp: string;
  depositAddress?: string;
  transaction?: string;
}


// Token support
import { TokenType } from './tokens';
export type { TokenMint } from './tokens';
export { TokenType, TOKENS, getTokenMint } from './tokens';

// Extended payment request with token support
export interface TokenPaymentRequest extends Omit<PaymentRequest, 'amount'> {
  amount: number | string;
  token?: TokenType;
  tokenMint?: string;
}
