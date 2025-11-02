import { MerchantConfig, PaymentSession, WebhookEvent } from './types';

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

  /**
   * Verify webhook signature (for production use HMAC)
   */
  verifyWebhookSignature(payload: WebhookEvent, signature: string): boolean {
    const expectedSignature = Buffer.from(JSON.stringify(payload)).toString('base64');
    return signature === expectedSignature;
  }

  /**
   * Parse and validate webhook payload
   */
  parseWebhook(body: any, signature?: string): WebhookEvent {
    const payload = body as WebhookEvent;
    
    // Validate required fields
    if (!payload.event || !payload.sessionId || !payload.merchantId) {
      throw new Error('Invalid webhook payload');
    }

    // Verify signature if provided
    if (signature && !this.verifyWebhookSignature(payload, signature)) {
      throw new Error('Invalid webhook signature');
    }

    return payload;
  }
}

export * from './types';
