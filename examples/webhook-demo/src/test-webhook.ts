import { StakefyX402Client } from 'stakefy-x402-client';

async function testWebhookFlow() {
  console.log('🧪 Testing Webhook Flow\n');

  const client = new StakefyX402Client({
    facilitatorUrl: 'https://stakefy-x402-production.up.railway.app',
    merchantId: 'demo_merchant'
  });

  // Step 1: Create payment with webhook URL
  console.log('📝 Step 1: Creating payment with webhook...');
  
  // Use ngrok URL or localhost for testing
  const webhookUrl = process.env.WEBHOOK_URL || 'http://localhost:4000/webhooks/stakefy';
  
  const session = await client.createPayment({
    amount: 10,
    reference: `test_${Date.now()}`,
    webhookUrl
  });

  console.log('✅ Payment created!');
  console.log(`   Session ID: ${session.sessionId}`);
  console.log(`   Deposit Address: ${session.depositAddress}`);
  console.log(`   Amount: ${session.amount + session.feeAmount} USDC`);
  console.log(`   Webhook URL: ${webhookUrl}\n`);

  console.log('📥 Your webhook should receive a "payment.created" event now!\n');
  console.log('💡 Next steps:');
  console.log('   1. Send USDC to the deposit address');
  console.log('   2. Call verify endpoint');
  console.log('   3. Webhook will receive "payment.completed" event');
  console.log('   4. Payment gets auto-settled to merchant\n');

  console.log(`🔗 Test the webhook endpoint directly:`);
  console.log(`   curl -X POST ${webhookUrl} -H "Content-Type: application/json" -d '{"event":"payment.created","sessionId":"test","merchantId":"demo","amount":10,"feeAmount":0.01,"status":"pending","timestamp":"${new Date().toISOString()}"}'`);
}

testWebhookFlow().catch(console.error);
