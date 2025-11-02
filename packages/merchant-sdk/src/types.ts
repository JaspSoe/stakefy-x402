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
  webhookUrl?: string;
}

export interface WebhookEvent {
  event: 'payment.created' | 'payment.completed' | 'payment.failed';
  sessionId: string;
  merchantId: string;
  amount: number;
  feeAmount: number;
  status: string;
  timestamp: string;
  depositAddress?: string;
  signature?: string;
}
