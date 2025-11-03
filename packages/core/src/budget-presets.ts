import { StakefyX402Client } from './client';

export class SessionBudgetPresets {
  constructor(private client: StakefyX402Client, private merchantId: string, private userPublicKey: string) {}

  /**
   * One-shot budget - Pay for N requests
   */
  async oneShot(requests: number, pricePerRequest: number = 0.01) {
    const totalAmount = requests * pricePerRequest;
    return this.client.createBudget({
      amount: totalAmount,
      duration: 3600, // 1 hour default
      userPublicKey: this.userPublicKey,
      merchantId: this.merchantId,
    });
  }

  /**
   * Per-minute budget - Continuous payment flow
   */
  async perMinute(amountPerMinute: number, durationMinutes: number = 60) {
    const totalAmount = amountPerMinute * durationMinutes;
    return this.client.createBudget({
      amount: totalAmount,
      duration: durationMinutes * 60,
      userPublicKey: this.userPublicKey,
      merchantId: this.merchantId,
    });
  }

  /**
   * Monthly subscription budget
   */
  async perMonth(monthlyAmount: number) {
    return this.client.createChannel({
      depositAmount: monthlyAmount,
      duration: 365, // 1 year
      userPublicKey: this.userPublicKey,
      merchantId: this.merchantId,
    });
  }

  /**
   * Single-use nonce - One payment only
   */
  async nonceOnce(amount: number) {
    return this.client.createPayment({
      amount,
      merchantId: this.merchantId,
      reference: `nonce-${Date.now()}-${Math.random()}`,
    });
  }
}

// Helper to create presets
export function createBudgetPresets(client: StakefyX402Client, merchantId: string, userPublicKey: string) {
  return new SessionBudgetPresets(client, merchantId, userPublicKey);
}
