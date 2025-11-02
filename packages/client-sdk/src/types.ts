export interface X402Config {
  facilitatorUrl: string;
  merchantId: string;
}

export interface PaymentOptions {
  amount: number;
  reference: string;
  metadata?: any;
}

export interface PaymentSession {
  sessionId: string;
  depositAddress: string;
  amount: number;
  feeAmount: number;
  expiresAt: string;
}

export interface BudgetOptions {
  amount: number;
  duration: number;
  userPublicKey: string;
  metadata?: any;
}

export interface Budget {
  budgetId: string;
  merchantId: string;
  totalAmount: number;
  remainingAmount: number;
  feeAmount: number;
  status: 'active' | 'depleted' | 'expired' | 'cancelled';
  expiresAt: string;
}

export interface BudgetPaymentOptions {
  budgetId: string;
  amount: number;
  reference: string;
  metadata?: any;
}

export interface RegisterUsernameOptions {
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

export interface PayToUsernameOptions {
  username: string;
  amount: number;
  reference: string;
  metadata?: any;
}

export interface CreateChannelOptions {
  userPublicKey: string;
  depositAmount: number;
  duration: number;
  metadata?: any;
}

export interface Channel {
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
  settledAt?: string;
}

export interface ChannelPaymentOptions {
  channelId: string;
  amount: number;
  nonce: number;
  signature: string;
  reference: string;
  metadata?: any;
}

export interface SettleChannelOptions {
  channelId: string;
  merchantAddress: string;
}
