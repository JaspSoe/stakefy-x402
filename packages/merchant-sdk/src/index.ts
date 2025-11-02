import { MerchantConfig, PaymentSession } from './types';

export class StakefyX402Merchant {
  private config: MerchantConfig;

  constructor(config: MerchantConfig) {
    this.config = config;
  }

  async getPaymentStatus(sessionId: string): Promise<PaymentSession> {
    const response = await fetch(
      `${this.config.facilitatorUrl}/api/payment/status/${sessionId}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }

    return response.json();
  }

  async verifyPayment(sessionId: string): Promise<{ status: string; isPaid: boolean }> {
    const response = await fetch(`${this.config.facilitatorUrl}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    return response.json();
  }

  async settlePayment(sessionId: string): Promise<{ success: boolean; signature: string }> {
    const response = await fetch(`${this.config.facilitatorUrl}/api/payment/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        merchantAddress: this.config.merchantWallet
      })
    });

    if (!response.ok) {
      throw new Error('Failed to settle payment');
    }

    return response.json();
  }

  async pollPaymentUntilComplete(
    sessionId: string,
    options: { maxAttempts?: number; intervalMs?: number } = {}
  ): Promise<PaymentSession> {
    const { maxAttempts = 60, intervalMs = 2000 } = options;

    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getPaymentStatus(sessionId);
      
      if (status.status === 'completed') {
        return status;
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error('Payment timeout - max attempts reached');
  }
}

export * from './types';
