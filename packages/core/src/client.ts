import { StakefyConfig, PaymentRequest, PaymentResponse, BudgetRequest, BudgetResponse, BudgetPaymentRequest, UsernameRequest, UserProfile, UsernamePaymentRequest, ChannelRequest, ChannelResponse, ChannelPaymentRequest, PaymentRequestSchema, BudgetRequestSchema, UsernameRequestSchema, ChannelRequestSchema } from './types';

export class StakefyX402Client {
  private apiUrl: string;
  private network: string;
  private timeout: number;

  constructor(config: StakefyConfig) {
    this.apiUrl = config.apiUrl;
    this.network = config.network || 'mainnet-beta';
    this.timeout = config.timeout || 30000;
  }

  // Internal fetch wrapper
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText })) as { error?: string };
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json() as T;
    } catch (err) {
      clearTimeout(timeoutId);
      const error = err as Error;
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // ============================================
  // BASIC PAYMENTS
  // ============================================

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    PaymentRequestSchema.parse(request);
    return this.request<PaymentResponse>('/api/payment/create', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async verifyPayment(sessionId: string): Promise<{ verified: boolean; transaction?: string }> {
    return this.request<{ verified: boolean; transaction?: string }>('/api/payment/verify', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  async getPaymentStatus(sessionId: string): Promise<PaymentResponse> {
    return this.request<PaymentResponse>(`/api/payment/status/${sessionId}`);
  }

  async settlePayment(sessionId: string, merchantAddress: string): Promise<{ success: boolean; signature: string }> {
    return this.request<{ success: boolean; signature: string }>('/api/payment/settle', {
      method: 'POST',
      body: JSON.stringify({ sessionId, merchantAddress }),
    });
  }

  async pollPaymentUntilComplete(
    sessionId: string,
    options: { maxAttempts?: number; intervalMs?: number } = {}
  ): Promise<PaymentResponse> {
    const { maxAttempts = 60, intervalMs = 2000 } = options;
    
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getPaymentStatus(sessionId);
      
      if (status.status === 'completed') {
        return status;
      }
      
      if (status.status === 'failed') {
        throw new Error('Payment failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    
    throw new Error('Payment timeout - max attempts reached');
  }

  // ============================================
  // SESSION BUDGETS
  // ============================================

  async createBudget(request: BudgetRequest): Promise<BudgetResponse> {
    BudgetRequestSchema.parse(request);
    return this.request<BudgetResponse>('/api/budget/create', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async makeBudgetPayment(request: BudgetPaymentRequest): Promise<{ success: boolean; transactionId: string }> {
    return this.request<{ success: boolean; transactionId: string }>('/api/budget/payment', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getBudgetStatus(budgetId: string): Promise<BudgetResponse> {
    return this.request<BudgetResponse>(`/api/budget/${budgetId}`);
  }

  // ============================================
  // USERNAME SYSTEM
  // ============================================

  async registerUsername(request: UsernameRequest): Promise<{ success: boolean; username: string }> {
    UsernameRequestSchema.parse(request);
    return this.request<{ success: boolean; username: string }>('/api/username/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getUserProfile(username: string): Promise<UserProfile> {
    return this.request<UserProfile>(`/api/username/${username}`);
  }

  async payToUsername(request: UsernamePaymentRequest): Promise<PaymentResponse> {
    return this.request<PaymentResponse>('/api/username/pay', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // ============================================
  // PAYMENT CHANNELS
  // ============================================

  async createChannel(request: ChannelRequest): Promise<ChannelResponse> {
    ChannelRequestSchema.parse(request);
    return this.request<ChannelResponse>('/api/channel/create', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async makeChannelPayment(request: ChannelPaymentRequest): Promise<{ success: boolean; transactionId: string }> {
    return this.request<{ success: boolean; transactionId: string }>('/api/channel/payment', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async settleChannel(channelId: string, merchantAddress: string): Promise<{ success: boolean; transaction: string }> {
    return this.request<{ success: boolean; transaction: string }>('/api/channel/settle', {
      method: 'POST',
      body: JSON.stringify({ channelId, merchantAddress }),
    });
  }

  async getChannelStatus(channelId: string): Promise<ChannelResponse> {
    return this.request<ChannelResponse>(`/api/channel/${channelId}`);
  }

  // ============================================
  // X402 PROTOCOL
  // ============================================

  async getSupported(): Promise<any> {
    return this.request<any>('/api/supported');
  }

  // ============================================
  // WEBHOOK UTILITIES
  // ============================================

  verifyWebhookSignature(payload: any, signature: string): boolean {
    const expectedSignature = Buffer.from(JSON.stringify(payload)).toString('base64');
    return signature === expectedSignature;
  }

  /**
   * Auto-initialize with smart defaults
   * Detects network from environment and uses default facilitator
   */
  static auto(overrides?: Partial<StakefyConfig>): StakefyX402Client {
    const network = (process.env.SOLANA_NETWORK as 'mainnet-beta' | 'devnet') || 'mainnet-beta';
    const apiUrl = process.env.STAKEFY_API_URL || 'https://stakefy-x402-production.up.railway.app';

    return new StakefyX402Client({
      apiUrl,
      network,
      ...overrides,
    });
  }
}
