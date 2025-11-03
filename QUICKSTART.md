# 🚀 Stakefy Quickstart Guide

Get started with Stakefy x402 payments in **5 minutes**.

## 📦 Installation
```bash
npm install x402-stakefy-sdk
```

That's it! One package includes everything:
- ✅ Core payment SDK
- ✅ React hooks
- ✅ Express middleware
- ✅ Payment verification
- ✅ Fetch interceptor

## 🎯 Quick Examples

### 1️⃣ Simple Payment (Vanilla JS/TS)
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

// One-line initialization!
const client = StakefyX402Client.auto();

// Create a payment
const payment = await client.createPayment({
  amount: 0.01,           // 0.01 SOL
  merchantId: 'YOUR_WALLET_ADDRESS',
  reference: 'order-123'
});

console.log('Pay here:', payment.solanaPayUrl);
console.log('QR code:', payment.qrCode);
console.log('Deposit:', payment.depositAddress);
```

### 2️⃣ USDC Payments
```typescript
import { StakefyX402Client, TokenType, usdToMicroUsdc } from 'x402-stakefy-sdk';

const client = StakefyX402Client.auto();

// Pay with USDC
const payment = await client.createPayment({
  amount: usdToMicroUsdc(1.50),  // $1.50 in USDC
  token: TokenType.USDC,
  merchantId: 'YOUR_WALLET_ADDRESS',
  reference: 'usdc-payment-1'
});
```

### 3️⃣ Verify Payments (Server-side)
```typescript
import { verifyPayment } from 'x402-stakefy-sdk';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

// Extract payment header from request
const paymentHeader = req.headers['x-payment'];

// Verify on-chain
const result = await verifyPayment(
  paymentHeader,
  {
    amount: 0.01,
    recipient: 'YOUR_WALLET_ADDRESS'
  },
  connection
);

if (result.verified) {
  console.log('✅ Payment confirmed!');
  console.log('Sender:', result.sender);
  console.log('Amount:', result.amount);
  console.log('Signature:', result.signature);
} else {
  console.log('❌ Payment failed:', result.error);
}
```

### 4️⃣ Auto-Handle 402 Responses (Client)
```typescript
import { createX402Fetch } from 'x402-stakefy-sdk';
import { useWallet } from '@solana/wallet-adapter-react';

// Create smart fetch wrapper
const x402fetch = createX402Fetch({
  wallet,                      // Your wallet adapter
  autoRetry: true,            // Automatically pay on 402
  onPaymentRequired: (payment) => {
    console.log('Payment needed:', payment.amount);
  },
  onPaymentComplete: (signature) => {
    console.log('Payment sent:', signature);
  }
});

// Use it like normal fetch - it handles 402 automatically!
const response = await x402fetch('/api/premium-data');
const data = await response.json();
```

### 5️⃣ Accept Payments (Express API)
```typescript
import express from 'express';
import { stakefyPaywall } from 'x402-stakefy-sdk';

const app = express();

// Protect endpoint with payment + on-chain verification
app.get('/api/premium-data',
  stakefyPaywall({
    amount: 0.01,
    merchantId: 'YOUR_WALLET_ADDRESS',
    verifyOnChain: true,       // Real blockchain verification!
    description: 'Premium data access'
  }),
  (req, res) => {
    res.json({ data: 'This costs 0.01 SOL!' });
  }
);

app.listen(3000);
```

**First request (no payment):**
```json
{
  "error": "Payment Required",
  "message": "Payment of 0.01 SOL required",
  "payment": {
    "sessionId": "sess_abc123",
    "amount": 0.01,
    "depositAddress": "...",
    "qrCode": "data:image/png;base64,...",
    "solanaPayUrl": "solana:..."
  }
}
```

**Second request (with payment headers):**
```json
{
  "data": "This costs 0.01 SOL!"
}
```

### 6️⃣ Content Paywall (React)
```tsx
import { usePaywall } from 'x402-stakefy-sdk';

function PremiumArticle() {
  const paywall = usePaywall({
    contentId: 'article-123',
    amount: 0.01,
    merchantId: 'YOUR_WALLET_ADDRESS'
  });

  if (paywall.loading) {
    return <div>Checking access...</div>;
  }

  if (!paywall.hasAccess) {
    return (
      <div>
        <h2>🔒 Premium Content</h2>
        <p>Unlock this article for 0.01 SOL</p>
        <button 
          onClick={paywall.unlock}
          disabled={paywall.paying}
        >
          {paywall.paying ? 'Processing...' : 'Unlock for 0.01 SOL'}
        </button>
        {paywall.error && <p>Error: {paywall.error.message}</p>}
      </div>
    );
  }

  return (
    <article>
      <h1>Premium Article</h1>
      <p>You have access! Here's the premium content...</p>
    </article>
  );
}
```

### 7️⃣ Session Budgets (Multiple Calls)
```typescript
// Create a session with 0.1 SOL budget
const session = await client.createBudget({
  amount: 0.1,
  duration: 3600,  // 1 hour
  merchantId: 'YOUR_WALLET_ADDRESS'
});

// Make multiple payments within the budget
await client.makeBudgetPayment({
  budgetId: session.budgetId,
  amount: 0.01,
  reference: 'call-1'
});

await client.makeBudgetPayment({
  budgetId: session.budgetId,
  amount: 0.01,
  reference: 'call-2'
});

// No additional wallet prompts needed!
```

### 8️⃣ @Username Payments
```typescript
// Pay to a Twitter handle
const payment = await client.payToUsername({
  username: '@stakefy',
  amount: 0.1,
  memo: 'Thanks for the awesome SDK!'
});
```

### 9️⃣ Payment Channels (Off-chain)
```typescript
// Open a payment channel
const channel = await client.createChannel({
  amount: 0.5,
  merchantId: 'YOUR_WALLET_ADDRESS'
});

// Make off-chain micro-payments
await client.makeChannelPayment({
  channelId: channel.channelId,
  amount: 0.001
});

// Settle on-chain when done
await client.settleChannel(channel.channelId, 'YOUR_WALLET_ADDRESS');
```

### 🔟 API Metering (AI Services)
```typescript
import { stakefyPaywall } from 'x402-stakefy-sdk';

// Charge per AI generation
app.post('/api/ai/generate',
  stakefyPaywall({
    amount: 0.001,  // 0.001 SOL per request
    merchantId: 'YOUR_WALLET_ADDRESS',
    verifyOnChain: true
  }),
  async (req, res) => {
    const result = await generateAI(req.body.prompt);
    res.json({
      result,
      cost: '0.001 SOL'
    });
  }
);
```

## 🔧 Configuration

### Environment Variables (Optional)
```bash
SOLANA_NETWORK=devnet  # or mainnet-beta
STAKEFY_API_URL=https://stakefy-x402-production.up.railway.app
```

### Manual Configuration
```typescript
const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'devnet',  // or 'mainnet-beta'
  timeout: 30000      // Optional timeout
});
```

## 🎯 Common Patterns

### Free + Premium Endpoints
```typescript
// Free endpoint
app.get('/api/basic', (req, res) => {
  res.json({ data: 'Free data' });
});

// Premium endpoint
app.get('/api/premium',
  stakefyPaywall({ amount: 0.01, merchantId: 'xxx' }),
  (req, res) => {
    res.json({ data: 'Premium data' });
  }
);
```

### Tiered Pricing
```typescript
app.get('/api/tier1',
  stakefyPaywall({ amount: 0.01, merchantId: 'xxx' }),
  handler
);

app.get('/api/tier2',
  stakefyPaywall({ amount: 0.05, merchantId: 'xxx' }),
  handler
);

app.get('/api/tier3',
  stakefyPaywall({ amount: 0.1, merchantId: 'xxx' }),
  handler
);
```

### Rate Limiting Alternative
```typescript
// Instead of blocking after X requests, charge for more
app.get('/api/data', async (req, res, next) => {
  const freeCallsLeft = await checkFreeQuota(req.user);
  
  if (freeCallsLeft > 0) {
    return next();
  }
  
  // Switch to paid after free tier
  return stakefyPaywall({ amount: 0.001, merchantId: 'xxx' })(req, res, next);
}, handler);
```

## 🚨 Error Handling
```typescript
import { StakefyErrors, isStakefyError } from 'x402-stakefy-sdk';

try {
  await client.createPayment({ amount, merchantId });
} catch (error) {
  if (isStakefyError(error)) {
    console.log('Error code:', error.code);
    console.log('User message:', error.userMessage);
    console.log('Recovery:', error.recovery);
    console.log('Metadata:', error.metadata);
  }
}
```

## 🎮 Try the Demo
```bash
git clone https://github.com/JaspSoe/stakefy-x402.git
cd stakefy-x402/examples/express-api-demo
npm install
npm run dev
```

Visit http://localhost:3000 for a working demo!

## 📚 Next Steps

- [📖 Full Documentation](https://github.com/JaspSoe/stakefy-x402)
- [🔒 Security Guide](./SECURITY.md)
- [💻 API Reference](./README.md#api-reference)
- [📊 Compare with Others](./COMPARISON.md)

## 💬 Support

- Twitter: [@stakefy](https://twitter.com/stakefy)
- Email: sayhello@stakefy.io
- GitHub Issues: [Report a bug](https://github.com/JaspSoe/stakefy-x402/issues)

---

**Ready to build?** Pick an example above and start coding! 🚀
