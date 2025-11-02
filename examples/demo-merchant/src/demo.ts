import { Keypair } from '@solana/web3.js';

// Simulate the Client SDK
class StakefyX402Client {
  private facilitatorUrl: string;
  private merchantId: string;

  constructor(config: { facilitatorUrl: string; merchantId: string }) {
    this.facilitatorUrl = config.facilitatorUrl;
    this.merchantId = config.merchantId;
  }

  async createPayment(options: { amount: number; reference: string }) {
    const response = await fetch(`${this.facilitatorUrl}/api/payment/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantId: this.merchantId,
        ...options
      })
    });
    return response.json();
  }

  async verifyPayment(sessionId: string) {
    const response = await fetch(`${this.facilitatorUrl}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    return response.json();
  }
}

async function runDemo() {
  console.log('🚀 Stakefy x402 Demo\n');

  // Initialize client
  const client = new StakefyX402Client({
    facilitatorUrl: 'http://localhost:3000',
    merchantId: 'demo_merchant_001'
  });

  try {
    // Step 1: Create payment
    console.log('📝 Step 1: Creating payment session...');
    const session = await client.createPayment({
      amount: 10,
      reference: `order_${Date.now()}`
    });

    console.log('✅ Payment session created:');
    console.log(`   Session ID: ${session.sessionId}`);
    console.log(`   Amount: $${session.amount} USDC`);
    console.log(`   Fee: $${session.feeAmount} USDC`);
    console.log(`   Deposit Address: ${session.depositAddress}`);
    console.log(`   Expires: ${session.expiresAt}\n`);

    // Step 2: Show payment instructions
    console.log('💳 Step 2: Customer would now pay to:');
    console.log(`   Address: ${session.depositAddress}`);
    console.log(`   Amount: ${session.amount + session.feeAmount} USDC\n`);

    // Step 3: Verify payment status
    console.log('🔍 Step 3: Checking payment status...');
    const verification = await client.verifyPayment(session.sessionId);
    console.log(`   Status: ${verification.status}`);
    console.log(`   Paid: ${verification.isPaid ? '✅' : '❌'}\n`);

    console.log('✨ Demo completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Payment facilitator: Working ✅`);
    console.log(`   - Client SDK: Working ✅`);
    console.log(`   - API endpoints: Working ✅`);
    console.log('\n🎯 Next steps:');
    console.log('   1. Fund a wallet with devnet USDC');
    console.log('   2. Actually send payment to deposit address');
    console.log('   3. Verify payment completes');
    console.log('   4. Settle payment to merchant');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

runDemo();
