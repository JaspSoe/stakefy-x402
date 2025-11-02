import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token';
import { createPaymentHeader, selectPaymentRequirements, verify } from 'x402';
import { X402Config, PaymentOptions, PaymentSession, BudgetOptions, Budget, BudgetPaymentOptions } from './types';
export class StakefyX402Client {
  private config: X402Config;
  private connection: Connection;
  private usdcMint = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'); // Devnet USDC

  constructor(config: X402Config) {
    this.config = config;
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  }

  async createPayment(options: PaymentOptions): Promise<PaymentSession> {
    const response = await fetch(`${this.config.facilitatorUrl}/api/payment/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantId: this.config.merchantId,
        ...options
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment');
    }

    return response.json();
  }

  async payWithWallet(
    session: PaymentSession,
    payerKeypair: Keypair
  ): Promise<string> {
    const depositPubkey = new PublicKey(session.depositAddress);
    const totalAmount = session.amount + session.feeAmount;

    const payerTokenAccount = await getAssociatedTokenAddress(
      this.usdcMint,
      payerKeypair.publicKey
    );

    const depositTokenAccount = await getAssociatedTokenAddress(
      this.usdcMint,
      depositPubkey
    );

    const transaction = new Transaction();

    // Create deposit token account if needed
    try {
      await this.connection.getAccountInfo(depositTokenAccount);
    } catch {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          payerKeypair.publicKey,
          depositTokenAccount,
          depositPubkey,
          this.usdcMint
        )
      );
    }

    // Transfer USDC
    transaction.add(
      createTransferInstruction(
        payerTokenAccount,
        depositTokenAccount,
        payerKeypair.publicKey,
        totalAmount * 1e6 // Convert to base units
      )
    );

    const signature = await this.connection.sendTransaction(transaction, [payerKeypair]);
    await this.connection.confirmTransaction(signature);

    return signature;
  }

  async verifyPayment(sessionId: string): Promise<{ status: string; isPaid: boolean }> {
    const response = await fetch(`${this.config.facilitatorUrl}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });

    return response.json();
  }

  async getPaymentStatus(sessionId: string): Promise<PaymentSession> {
    const response = await fetch(`${this.config.facilitatorUrl}/api/payment/status/${sessionId}`);
    return response.json();
  }

  async createBudget(options: BudgetOptions): Promise<Budget> {
    const response = await fetch(`${this.config.facilitatorUrl}/api/budget/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantId: this.config.merchantId,
        ...options
      })
    });
    if (!response.ok) {
      throw new Error('Failed to create budget');
    }
    return response.json();
  }

  async payFromBudget(options: BudgetPaymentOptions): Promise<any> {
    const response = await fetch(`${this.config.facilitatorUrl}/api/budget/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process budget payment');
    }
    return response.json();
  }

  async getBudgetStatus(budgetId: string): Promise<Budget> {
    const response = await fetch(`${this.config.facilitatorUrl}/api/budget/${budgetId}`);
    if (!response.ok) {
      throw new Error('Failed to get budget status');
    }
    return response.json();
  }
}

export * from './types';
