# 🚀 Stakefy Quickstart Guide

Get started with Stakefy x402 payments in **5 minutes**.

## 📦 Installation
```bash
npm install x402-stakefy-sdk
```

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
```

### 2️⃣ Accept Payments (Express API)
```bash
npm install x402-stakefy-sdk stakefy-express express
```
```typescript
import express from 'express';
import { stakefyPaywall } from 'stakefy-express';

const app = express();

// Protect endpoint with payment
app.get('/api/premium-data',
  stakefyPaywall({
    amount: 0.01,
    merchantId: 'YOUR_WALLET_ADDRESS'
  }),
  (req, res) => {
    res.json({ data: 'This costs 0.01 SOL!' });
  }
);

app.listen(3000);
```

**Response (402 Payment Required):**
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

### 3️⃣ Content Paywall (React)
```bash
npm install x402-stakefy-sdk x402-stakefy-react @solana/wallet-adapter-react
```
```tsx
import { usePaywall } from 'x402-stakefy-react';

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
      <button 
        onClick={paywall.unlock}
        disabled={paywall.paying}
      >
        {paywall.paying ? 'Processing...' : 'Unlock for 0.01 SOL'}
      </button>
    );
  }

  return <article>Premium content here!</article>;
}
```

### 4️⃣ USDC Payments
```typescript
import { StakefyX402Client, TokenType, usdToMicroUsdc } from 'x402-stakefy-sdk';

const client = StakefyX402Client.auto();

// Pay with USDC
const payment = await client.createPayment({
  amount: usdToMicroUsdc(1.50),  // $1.50 in USDC micro-units
  token: TokenType.USDC,
  merchantId: 'YOUR_WALLET_ADDRESS',
  reference: 'usdc-payment-1'
});
```

### 5️⃣ Session Budgets (Multiple Calls)
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
```

### 6️⃣ @Username Payments
```typescript
// Pay to a Twitter handle
const payment = await client.payToUsername({
  username: '@stakefy',
  amount: 0.1,
  memo: 'Thanks for the awesome SDK!'
});
```

## 🔧 Environment Variables

Optional - set these for auto-configuration:
```bash
SOLANA_NETWORK=devnet  # or mainnet-beta
STAKEFY_API_URL=https://stakefy-x402-production.up.railway.app
```

## 📚 API Reference

### Core Client
```typescript
// Auto-initialize (recommended)
const client = StakefyX402Client.auto();

// Or manual config
const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'devnet'
});
```

### Payment Methods
```typescript
// Simple payment
client.createPayment({ amount, merchantId, reference })

// USDC payment
client.createPayment({ amount, token: TokenType.USDC, merchantId, reference })

// Username payment
client.payToUsername({ username, amount, memo })

// Session budget
client.createBudget({ amount, duration, merchantId })
client.makeBudgetPayment({ budgetId, amount, reference })

// Payment channels
client.createChannel({ amount, merchantId })
client.makeChannelPayment({ channelId, amount })
```

### Utility Functions
```typescript
import {
  usdToMicroUsdc,
  microUsdcToUsd,
  solToLamports,
  lamportsToSol
} from 'x402-stakefy-sdk';

// USDC conversions
const microUnits = usdToMicroUsdc(1.50);  // "1500000"
const usd = microUsdcToUsd("1500000");    // 1.50

// SOL conversions
const lamports = solToLamports(0.5);      // 500000000
const sol = lamportsToSol(500000000);     // 0.5
```

## 🎯 Use Cases

- **API Metering** - Charge per API call
- **Content Paywalls** - Lock premium content
- **AI Agent Payments** - Autonomous micro-payments
- **Data Access** - Pay-per-query
- **Premium Features** - Tiered access

## 🔗 Links

- [Full Documentation](https://github.com/JaspSoe/stakefy-x402)
- [NPM Package](https://npmjs.com/package/x402-stakefy-sdk)
- [GitHub](https://github.com/JaspSoe/stakefy-x402)
- [Facilitator API](https://stakefy-x402-production.up.railway.app)

## 💬 Support

- Twitter: [@stakefy](https://twitter.com/stakefy)
- Email: sayhello@stakefy.io

---

**Ready to build?** Start with example 1 or 2 above! 🚀
