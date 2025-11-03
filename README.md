# Stakefy x402 - Complete Solana Payment Infrastructure

[![NPM Core SDK](https://img.shields.io/npm/v/x402-stakefy-sdk.svg)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/JaspSoe/stakefy-x402?style=social)](https://github.com/JaspSoe/stakefy-x402)

🚀 **The most complete Solana x402 payment SDK** - Better than alternatives, 100% open source.

---

## 🎮 Live Demo

**Try it now:** [https://stakefy-x402-demo.vercel.app/report](https://stakefy-x402-demo-hd6g5l1tf-jasper-soes-projects.vercel.app/report)

Click "Pay & Unlock (Demo)" to see the paywall in action! No wallet needed - it's a client-side demo showing how the components work.

---

## ⚡️ Quick Links

- 👉 **[5-Minute Quickstart Guide](./QUICKSTART.md)**
- 🎮 **[Live Demo](https://stakefy-x402-demo-hd6g5l1tf-jasper-soes-projects.vercel.app/report)**
- 📦 **[NPM Package](https://npmjs.com/package/x402-stakefy-sdk)**
- 📚 **[Full Documentation](#documentation)**

---

## 🎯 Why Stakefy?

| Feature | Stakefy | PayAI/Others |
|---------|---------|--------------|
| **Fees** | 0.1% | 1-2% |
| **One-line Init** | ✅ `auto()` | ❌ |
| **Payment Verification** | ✅ On-chain | ⚠️ Limited |
| **Fetch Interceptor** | ✅ Auto-402 | ⚠️ Manual |
| **USDC Support** | ✅ | ✅ |
| **React Components** | ✅ Paywall + SessionBudget | ❌ |
| **React Hooks** | ✅ | ❌ |
| **Express Middleware** | ✅ | ❌ |
| **Payment Channels** | ✅ | ❌ |
| **Session Budgets** | ✅ | ❌ |
| **@Username Payments** | ✅ | ❌ |
| **Live Demos** | ✅ | ⚠️ Limited |
| **Open Source** | ✅ 100% | ⚠️ Partial |

[📊 Full Comparison →](./COMPARISON.md)

---

## 📦 Installation
```bash
# One package, everything included
npm install x402-stakefy-sdk
```

That's it! You get:
- ✅ Core payment SDK
- ✅ React components (Paywall, SessionBudget)
- ✅ React hooks (usePaywall, useStakefyPayment, etc.)
- ✅ Express middleware
- ✅ Payment verification
- ✅ Fetch interceptor
- ✅ USDC support
- ✅ Everything!

---

## ⚡️ Quick Start

### 1️⃣ Initialize (One Line!)
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

// Dead simple initialization!
const client = StakefyX402Client.auto();
```

### 2️⃣ React Paywall Component
```tsx
import { Paywall, SessionBudget } from 'x402-stakefy-sdk';

function PremiumContent() {
  return (
    <>
      <SessionBudget scope="article" maxCents={300} ttlMinutes={60} />
      
      <Paywall endpoint="/api/premium" scope="article">
        <div>🎉 Premium content unlocked!</div>
      </Paywall>
    </>
  );
}
```

### 3️⃣ Express API Paywall
```typescript
import express from 'express';
import { stakefyPaywall } from 'x402-stakefy-sdk';

const app = express();

app.get('/api/premium',
  stakefyPaywall({
    amount: 0.01,
    merchantId: 'YOUR_WALLET',
    verifyOnChain: true
  }),
  (req, res) => {
    res.json({ data: 'Premium content!' });
  }
);
```

### 4️⃣ Verify Payments (Server-side)
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
  // ✅ Payment confirmed on-chain!
}
```

### 5️⃣ Auto-Handle 402 Responses
```typescript
import { createX402Fetch } from 'x402-stakefy-sdk';

const x402fetch = createX402Fetch({ 
  wallet,
  autoRetry: true
});

// Automatically handles payment if 402 received!
const response = await x402fetch('/api/premium');
```

---

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

### React Components
- ✅ `<Paywall>` - Lock/unlock content with demo payments
- ✅ `<SessionBudget>` - Track spending limits
- ✅ Client-side localStorage receipts
- ✅ Auto-unlock on payment

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

---

## 📚 Documentation

- [⚡️ Quickstart Guide](./QUICKSTART.md) - Get started in 5 minutes
- [🎮 Live Demo](https://stakefy-x402-demo-hd6g5l1tf-jasper-soes-projects.vercel.app/report) - Try it now
- [📖 API Reference](#api-reference)
- [🔒 Security Policy](./SECURITY.md)
- [📊 SDK Comparison](./COMPARISON.md)
- [💻 Express Demo](./examples/express-api-demo)
- [⚛️ Next.js Demo](./examples/next-app)

---

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
```tsx
<Paywall endpoint="/api/article" scope="premium">
  <Article />
</Paywall>
```

### AI Agent Payments
```typescript
const x402fetch = createX402Fetch({ wallet: agentWallet });
const data = await x402fetch('https://api.example.com/premium-data');
```

---

## 🔧 API Reference

[See full API documentation in QUICKSTART.md](./QUICKSTART.md)

---

## 🔗 Links

- **NPM Package:** https://npmjs.com/package/x402-stakefy-sdk
- **GitHub:** https://github.com/JaspSoe/stakefy-x402
- **Live Demo:** https://stakefy-x402-demo-hd6g5l1tf-jasper-soes-projects.vercel.app/report
- **Facilitator API:** https://stakefy-x402-production.up.railway.app
- **Twitter:** [@stakefy](https://twitter.com/stakefy)
- **Email:** sayhello@stakefy.io

---

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guide](./CONTRIBUTING.md).

---

## 📄 License

MIT © Stakefy

---

**Built with ❤️ by [@stakefy](https://twitter.com/stakefy)**

**Ready to build? Start with our [⚡️ Quickstart Guide](./QUICKSTART.md) or try the [🎮 Live Demo](https://stakefy-x402-demo-hd6g5l1tf-jasper-soes-projects.vercel.app/report)!**
