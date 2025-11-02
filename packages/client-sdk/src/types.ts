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
