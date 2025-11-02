export interface MerchantConfig {
  facilitatorUrl: string;
  merchantId: string;
  merchantWallet: string;
}

export interface PaymentSession {
  sessionId: string;
  amount: number;
  feeAmount: number;
  status: string;
  depositAddress: string;
}
