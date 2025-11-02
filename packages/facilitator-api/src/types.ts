export interface PaymentRequest {
  merchantId: string;
  amount: number;
  reference: string;
  metadata?: any;
  webhookUrl?: string;
}

export interface PaymentSession {
  sessionId: string;
  merchantId: string;
  amount: number;
  feeAmount: number;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  depositAddress: string;
  createdAt: Date;
  expiresAt: Date;
  webhookUrl?: string;
}

export interface VerifyRequest {
  sessionId: string;
  signature?: string;
}

export interface SettleRequest {
  sessionId: string;
  merchantAddress: string;
}

export interface CreateBudgetRequest {
  merchantId: string;
  amount: number;
  duration: number; // in seconds
  userPublicKey: string;
  metadata?: any;
}

export interface SessionBudget {
  budgetId: string;
  merchantId: string;
  userPublicKey: string;
  totalAmount: number;
  remainingAmount: number;
  feeAmount: number;
  status: 'active' | 'depleted' | 'expired' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
  metadata?: any;
}

export interface BudgetPaymentRequest {
  budgetId: string;
  amount: number;
  reference: string;
  metadata?: any;
}

export interface CreateUsernameRequest {
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
  createdAt: Date;
  lastActive: Date;
  metadata?: any;
}

export interface UsernamePaymentRequest {
  username: string;
  amount: number;
  reference: string;
  metadata?: any;
}
