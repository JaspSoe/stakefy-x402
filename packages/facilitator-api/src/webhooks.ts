import axios from 'axios';

export interface WebhookPayload {
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

export class WebhookService {
  async sendWebhook(url: string, payload: WebhookPayload, retries = 3): Promise<boolean> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await axios.post(url, payload, {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
            'X-Stakefy-Event': payload.event,
            'X-Stakefy-Signature': this.generateSignature(payload)
          }
        });
        
        console.log(`✅ Webhook sent to ${url} (attempt ${attempt})`);
        return true;
      } catch (error: any) {
        console.error(`❌ Webhook failed (attempt ${attempt}/${retries}):`, error.message);
        
        if (attempt === retries) {
          return false;
        }
        
        // Exponential backoff
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }
    
    return false;
  }

  private generateSignature(payload: WebhookPayload): string {
    // Simple signature - in production use HMAC with secret
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
