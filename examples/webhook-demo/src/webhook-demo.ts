import express from 'express';
import { StakefyX402Merchant } from 'stakefy-x402-merchant';

const app = express();
app.use(express.json());

const merchant = new StakefyX402Merchant({
  facilitatorUrl: 'https://stakefy-x402-production.up.railway.app',
  merchantId: 'demo_merchant',
  merchantWallet: 'YOUR_WALLET_ADDRESS'
});

// Webhook endpoint
app.post('/webhooks/stakefy', async (req, res) => {
  try {
    const signature = req.headers['x-stakefy-signature'] as string;
    
    // Parse and verify webhook
    const event = merchant.parseWebhook(req.body, signature);
    
    console.log('\n🎉 Webhook received!');
    console.log('Event:', event.event);
    console.log('Session ID:', event.sessionId);
    console.log('Amount:', event.amount, 'USDC');
    console.log('Status:', event.status);
    console.log('Timestamp:', event.timestamp);
    
    // Handle different event types
    switch (event.event) {
      case 'payment.created':
        console.log('💳 New payment created');
        console.log('Deposit Address:', event.depositAddress);
        break;
        
      case 'payment.completed':
        console.log('✅ Payment completed!');
        // Settle payment to your wallet
        const result = await merchant.settlePayment(event.sessionId);
        console.log('💰 Settled! TX:', result.signature);
        
        // TODO: Fulfill order, send confirmation email, etc.
        break;
        
      case 'payment.failed':
        console.log('❌ Payment failed');
        // TODO: Handle failed payment
        break;
    }
    
    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 Webhook server running on http://localhost:${PORT}`);
  console.log(`📥 Webhook endpoint: http://localhost:${PORT}/webhooks/stakefy`);
  console.log('\n💡 Use ngrok to expose this to the internet:');
  console.log('   ngrok http 4000\n');
});
