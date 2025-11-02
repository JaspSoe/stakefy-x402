export interface PaymentRequest {
  merchantId: string;
  amount: number;
  reference: string;
  metadata?: any;
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
}

export interface VerifyRequest {
  sessionId: string;
  signature: string;
}

export interface SettleRequest {
  sessionId: string;
  merchantAddress: string;
}
