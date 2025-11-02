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
