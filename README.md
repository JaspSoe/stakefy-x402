# Stakefy x402 - Complete Solana Payment Infrastructure

[![NPM Core SDK](https://img.shields.io/npm/v/x402-stakefy-sdk.svg)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/JaspSoe/stakefy-x402?style=social)](https://github.com/JaspSoe/stakefy-x402)

🚀 **The most complete Solana x402 payment SDK** - Better than alternatives, 100% open source.

👉 **[⚡️ 5-Minute Quickstart Guide](./QUICKSTART.md)** - Get started in 5 minutes!

## 🎯 Why Stakefy?

| Feature | Stakefy | PayAI/Others |
|---------|---------|--------------|
| **Fees** | 0.1% | 1-2% |
| **One-line Init** | ✅ `auto()` | ❌ |
| **Payment Verification** | ✅ On-chain | ⚠️ Limited |
| **Fetch Interceptor** | ✅ Auto-402 | ⚠️ Manual |
| **USDC Support** | ✅ | ✅ |
| **React Hooks** | ✅ | ❌ |
| **Express Middleware** | ✅ | ❌ |
| **Payment Channels** | ✅ | ❌ |
| **Session Budgets** | ✅ | ❌ |
| **@Username Payments** | ✅ | ❌ |
| **Open Source** | ✅ 100% | ⚠️ Partial |

[📊 Full Comparison →](./COMPARISON.md)

## 📦 Installation
```bash
# One package, everything included
npm install x402-stakefy-sdk

# Optional: React hooks (included in core)
# Optional: Express middleware (included in core)
```

## ⚡️ Quick Start

### 1️⃣ Initialize (One Line!)
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

// Dead simple initialization!
const client = StakefyX402Client.auto();
```

### 2️⃣ Create Payment
```typescript
const payment = await client.createPayment({
  amount: 0.01,
  merchantId: 'YOUR_WALLET',
  reference: 'order-123'
});

console.log('Pay here:', payment.solanaPayUrl);
```

### 3️⃣ Verify Payment (Server-side)
```typescript
import { verifyPayment } from 'x402-stakefy-sdk';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

const result = await verifyPayment(
  paymentHeader,
  { amount: 0.01, recipient: 'merchant-wallet' },
  connection
);

if (result.verified) {
  // Payment confirmed on-chain!
}
```

### 4️⃣ Auto-Handle 402 Responses (Client)
```typescript
import { createX402Fetch } from 'x402-stakefy-sdk';

const x402fetch = createX402Fetch({ wallet });

// Automatically handles payment if 402 received!
const response = await x402fetch('/api/premium');
const data = await response.json();
```

### 5️⃣ Express API Paywall
```typescript
import express from 'express';
import { stakefyPaywall } from 'x402-stakefy-sdk';

const app = express();

app.get('/api/premium',
  stakefyPaywall({
    amount: 0.01,
    merchantId: 'YOUR_WALLET',
    verifyOnChain: true  // Real verification!
  }),
  (req, res) => {
    res.json({ data: 'Premium content!' });
  }
);
```

### 6️⃣ React Content Paywall
```typescript
import { usePaywall } from 'x402-stakefy-sdk';

function PremiumArticle() {
  const paywall = usePaywall({
    contentId: 'article-123',
    amount: 0.01,
    merchantId: 'YOUR_WALLET'
  });

  if (!paywall.hasAccess) {
    return <button onClick={paywall.unlock}>Unlock for 0.01 SOL</button>;
  }

  return <article>Premium content here!</article>;
}
```

## 🚀 Features

### Core SDK
- ✅ **One-line initialization** - `StakefyX402Client.auto()`
- ✅ **Multi-token support** - SOL, USDC, BONK
- ✅ **Payment verification** - On-chain transaction verification
- ✅ **Fetch interceptor** - Auto-handle 402 responses
- ✅ **Session budgets** - Pay once, use multiple times
- ✅ **Payment channels** - Off-chain micro-payments
- ✅ **@Username payments** - Pay to Twitter handles
- ✅ **QR codes & Solana Pay** - Easy mobile payments
- ✅ **Error handling** - 30+ error codes with recovery
- ✅ **TypeScript** - Full type safety

### React Hooks
- ✅ `useStakefyPayment` - Simple payments
- ✅ `usePaywall` - Content paywalls
- ✅ `useSessionBudget` - Budget management
- ✅ `usePaymentChannel` - Channel state
- ✅ `useUsername` - Username resolution

### Express Middleware
- ✅ `stakefyPaywall()` - Per-endpoint payments
- ✅ `stakefyBudget()` - Session-based access
- ✅ HTTP 402 compliant responses
- ✅ On-chain verification option
- ✅ Built-in error handling

### Utilities
- ✅ `usdToMicroUsdc()` - USDC conversions
- ✅ `solToLamports()` - SOL conversions
- ✅ `verifyPayment()` - Server verification
- ✅ `createX402Fetch()` - Smart fetch wrapper
- ✅ Token mint helpers

## 📚 Documentation

- [⚡️ Quickstart Guide](./QUICKSTART.md) - Get started in 5 minutes
- [📖 API Reference](#api-reference)
- [🔒 Security Policy](./SECURITY.md)
- [📊 SDK Comparison](./COMPARISON.md)
- [💻 Working Demo](./examples/express-api-demo)

## 🎯 Use Cases

### API Metering
```typescript
app.post('/api/ai/generate',
  stakefyPaywall({ amount: 0.001, merchantId: 'xxx' }),
  async (req, res) => {
    const result = await generateAI(req.body.prompt);
    res.json({ result });
  }
);
```

### Content Paywalls
```typescript
const paywall = usePaywall({
  contentId: 'premium-video',
  amount: 0.05,
  merchantId: 'creator-wallet'
});
```

### AI Agent Payments
```typescript
const x402fetch = createX402Fetch({ wallet: agentWallet });
const data = await x402fetch('https://api.example.com/premium-data');
```

### Session Budgets
```typescript
const session = await client.createBudget({
  amount: 1.0,
  duration: 3600,
  merchantId: 'api-provider'
});
```

## 🔧 API Reference

### Core Client

#### `StakefyX402Client.auto()`
One-line initialization with smart defaults.
```typescript
const client = StakefyX402Client.auto();

// Or with overrides
const client = StakefyX402Client.auto({
  network: 'mainnet-beta'
});
```

#### `createPayment()`
Create a payment request.
```typescript
const payment = await client.createPayment({
  amount: 0.01,              // Amount in SOL or token units
  token?: TokenType.USDC,    // Optional: USDC, BONK, etc.
  merchantId: 'wallet',      // Your wallet address
  reference: 'unique-id',    // Unique reference
  metadata?: { ... }         // Optional metadata
});
```

#### `verifyPayment()`
Verify payment on-chain (server-side).
```typescript
import { verifyPayment } from 'x402-stakefy-sdk';

const result = await verifyPayment(
  paymentHeader,              // X-Payment header
  { amount, recipient },      // Requirements
  connection                  // Solana connection
);

console.log(result.verified); // true/false
```

### Fetch Interceptor

#### `createX402Fetch()`
Create fetch wrapper with automatic 402 handling.
```typescript
import { createX402Fetch } from 'x402-stakefy-sdk';

const x402fetch = createX402Fetch({
  wallet,                     // Wallet adapter
  autoRetry: true,           // Auto-pay on 402
  maxRetries: 3,             // Max retry attempts
  onPaymentRequired: (p) => console.log('Payment needed:', p)
});

const response = await x402fetch('/api/endpoint');
```

### Express Middleware

#### `stakefyPaywall()`
Protect endpoints with payments.
```typescript
import { stakefyPaywall } from 'x402-stakefy-sdk';

app.get('/api/premium',
  stakefyPaywall({
    amount: 0.01,
    merchantId: 'wallet',
    verifyOnChain: true,      // Enable on-chain verification
    description: 'Premium data',
    onSuccess: (req, sessionId) => console.log('Paid!')
  }),
  handler
);
```

### React Hooks

#### `usePaywall()`
Content paywall hook.
```typescript
const {
  hasAccess,    // User has paid?
  loading,      // Checking...
  paying,       // Payment in progress
  unlock,       // Trigger payment
  error         // Any errors
} = usePaywall({
  contentId: 'article-123',
  amount: 0.01,
  merchantId: 'wallet'
});
```

### Token Utilities
```typescript
import {
  TokenType,
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

## 🔒 Security

- ✅ No private key handling
- ✅ On-chain payment verification
- ✅ Transaction signing in user's wallet
- ✅ HTTPS only
- ✅ Rate limiting
- ✅ Input validation
- ✅ Comprehensive threat model

[📖 Security Policy →](./SECURITY.md)

## 🎮 Working Demo

Try our [Express API demo](./examples/express-api-demo) with 5 payment patterns:
```bash
cd examples/express-api-demo
npm install
npm run dev
```

Visit http://localhost:3000 to see it in action!

## 🔗 Links

- **NPM Package:** https://npmjs.com/package/x402-stakefy-sdk
- **GitHub:** https://github.com/JaspSoe/stakefy-x402
- **Facilitator API:** https://stakefy-x402-production.up.railway.app
- **Twitter:** [@stakefy](https://twitter.com/stakefy)
- **Email:** sayhello@stakefy.io

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guide](./CONTRIBUTING.md).

## 📄 License

MIT © Stakefy

---

**Built with ❤️ by [@stakefy](https://twitter.com/stakefy)**

**Ready to build? Start with our [⚡️ Quickstart Guide](./QUICKSTART.md)!**
