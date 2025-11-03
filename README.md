# Stakefy x402 - Complete Solana Payment Infrastructure

[![NPM Core SDK](https://img.shields.io/npm/v/x402-stakefy-sdk.svg?style=flat-square)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![npm downloads](https://img.shields.io/npm/dm/x402-stakefy-sdk.svg?style=flat-square)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-14F195.svg?style=flat-square)](https://solana.com/)

**The most feature-rich x402 payment SDK for Solana** — Production-ready infrastructure with **10x lower fees** than competitors.

[🚀 Live Demo](https://stakefy-x402-demo-1twf7cczm-jasper-soes-projects.vercel.app) · [📦 NPM Package](https://npmjs.com/package/x402-stakefy-sdk) · [📊 Feature Comparison](./FEATURES.md) · [🐦 Twitter](https://twitter.com/stakefy)

---

## Why Stakefy x402?

| Feature | Stakefy x402 | PayAI x402-solana | Others |
|---------|:------------:|:-----------------:|:------:|
| **Transaction Fees** | **0.1%** | 1-2% | 1-2% |
| **Social Payments** | ✅ @username | ❌ | ❌ |
| **Session Budgets** | ✅ | ❌ | ❌ |
| **Payment Channels** | ✅ | ❌ | ❌ |
| **Auto-402 Handler** | ✅ | ❌ | ❌ |
| **React Hooks** | ✅ Complete | ❌ | Limited |
| **Express Middleware** | ✅ Drop-in | ❌ | Limited |
| **Live Demo** | ✅ | ❌ | ❌ |

**📊 [See Full Feature Comparison →](./FEATURES.md)**

**Save 90% on fees. Get 10x more features. Zero compromises.**

---

## Quick Start

### Installation
```bash
npm install x402-stakefy-sdk
```

### Basic Payment (30 seconds)
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'mainnet-beta'
});

const payment = await client.createPayment({
  amount: 0.1,
  merchantId: 'YOUR_WALLET',
  reference: 'order-123'
});

console.log('Payment URL:', payment.solanaPayUrl);
```

### Auto-402 Handler
```typescript
import { auto } from 'x402-stakefy-sdk';

// Initialize once - handles all 402 responses automatically
auto({
  wallet: yourSolanaWallet,
  network: 'mainnet-beta'
});

// Now all fetch requests handle payments automatically
const response = await fetch('https://api.example.com/protected');
```

---

## Package Ecosystem

| Package | Description | NPM | Status |
|---------|-------------|-----|--------|
| **x402-stakefy-sdk** | Core SDK with all features | [![npm](https://img.shields.io/npm/v/x402-stakefy-sdk)](https://npmjs.com/package/x402-stakefy-sdk) | ✅ Published |
| **x402-stakefy-react** | React hooks & components | [![npm](https://img.shields.io/npm/v/x402-stakefy-react)](https://npmjs.com/package/x402-stakefy-react) | ✅ Published |
| **stakefy-express** | Express middleware | [![npm](https://img.shields.io/npm/v/stakefy-express)](https://npmjs.com/package/stakefy-express) | ✅ Published |

---

## Core Features

### 🎯 Social Payments
Pay users by username instead of wallet addresses:
```typescript
const payment = await client.createPayment({
  amount: 1.0,
  recipient: '@username',
  reference: 'tip-123'
});
```

### 💰 Session Budgets
Pre-approve spending limits for seamless flows:
```typescript
const budget = await client.createSessionBudget({
  maxAmount: 10.0,
  duration: 3600,
  merchantId: 'WALLET'
});
```

### 🔄 Payment Channels
Enable recurring payments:
```typescript
const channel = await client.createPaymentChannel({
  amount: 5.0,
  frequency: 'daily',
  recipient: 'WALLET',
  duration: 30
});
```

### ⚡ Auto-402 Interceptor
Automatically handle HTTP 402 responses without manual code.

---

## Documentation

- 📖 **[Complete SDK Documentation](./packages/core/README.md)**
- 📊 **[Feature Comparison vs Competitors](./FEATURES.md)**
- 👉 **[Quickstart Guide](./QUICKSTART.md)**
- 🎮 **[Live Demo](https://stakefy-x402-demo-1twf7cczm-jasper-soes-projects.vercel.app)**
- 🔧 **[API Reference](./API.md)**
- 💡 **[Examples](./examples)**

---

## Examples

### React Integration
```typescript
import { PaymentButton } from 'x402-stakefy-react';

function App() {
  return (
    <PaymentButton
      amount={0.5}
      merchantId="WALLET"
      onSuccess={(sig) => console.log('Paid!', sig)}
    >
      Pay 0.5 USDC
    </PaymentButton>
  );
}
```

### Express Middleware
```typescript
import { stakefyPaywall } from 'stakefy-express';

app.get('/api/premium',
  stakefyPaywall({ amount: 0.1, merchantWallet: 'WALLET' }),
  (req, res) => res.json({ data: 'Premium content' })
);
```

### Next.js API Route
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

export default async function handler(req, res) {
  const client = new StakefyX402Client({
    apiUrl: process.env.STAKEFY_API_URL,
    network: 'mainnet-beta'
  });

  const paymentHeader = req.headers['x-payment'];
  
  if (!paymentHeader) {
    const payment = await client.createPayment({
      amount: 0.1,
      merchantId: process.env.MERCHANT_WALLET
    });
    return res.status(402).json({ paymentUrl: payment.solanaPayUrl });
  }

  const isValid = await client.verifyPayment(paymentHeader, 0.1, process.env.MERCHANT_WALLET);
  if (!isValid) return res.status(402).json({ error: 'Invalid payment' });

  return res.json({ data: 'Premium content' });
}
```

---

## Why Choose Stakefy?

### 💰 10x Lower Fees
- **Stakefy:** 0.1% transaction fee
- **Competitors:** 1-2% transaction fee
- **Savings:** For $10,000/month volume = $1,080-2,280/year saved

### 🚀 More Features
- Social payments (@username)
- Session budgets (pre-approved spending)
- Payment channels (recurring payments)
- Auto-402 interceptor (zero boilerplate)
- Complete React library (hooks + components)
- Drop-in Express middleware

### 🎯 Better Developer Experience
- 5-minute setup vs 30+ minutes
- 5 lines of code vs 50+ lines
- Live demo to test before building
- Comprehensive documentation
- Active development & support

### 🔒 Production Ready
- Deployed on Solana mainnet
- 99.9% uptime (Railway infrastructure)
- Battle-tested in production
- Full TypeScript support
- On-chain verification

**📊 [Read Full Comparison →](./FEATURES.md)**

---

## Architecture
```
┌─────────────────────────────────────────────────────┐
│                  Client Application                 │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────┐│
│  │ React Hooks  │  │  Auto-402   │  │  Wallet    ││
│  │ & Components │  │ Interceptor │  │ Adapter    ││
│  └──────────────┘  └─────────────┘  └────────────┘│
└─────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────┐
│            Stakefy x402 Core SDK (0.1% fee)         │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────┐│
│  │   Payment    │  │   Session   │  │  Payment   ││
│  │   Creation   │  │   Budgets   │  │  Channels  ││
│  └──────────────┘  └─────────────┘  └────────────┘│
└─────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────┐
│              Stakefy Facilitator API                │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────┐│
│  │ Verification │  │ Settlement  │  │  Username  ││
│  │   Service    │  │   Service   │  │  Registry  ││
│  └──────────────┘  └─────────────┘  └────────────┘│
└─────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────┐
│                 Solana Blockchain                   │
│           (Mainnet/Devnet - 400ms finality)         │
└─────────────────────────────────────────────────────┘
```

---

## Use Cases

### AI Chat Applications
Pay per message with session budgets - no wallet popup spam
```typescript
const budget = await client.createSessionBudget({ maxAmount: 1.0, duration: 3600 });
// 100 messages @ $0.01 each, only one approval needed
```

### Content Creator Tips
Social payments make tipping seamless
```typescript
await client.createPayment({ amount: 0.5, recipient: '@creator' });
// No wallet addresses needed
```

### SaaS Subscriptions
Native recurring payments on-chain
```typescript
const channel = await client.createPaymentChannel({ 
  amount: 10.0, 
  frequency: 'monthly',
  duration: 365 
});
```

### API Monetization
Drop-in Express middleware for instant paywalls
```typescript
app.use('/api/*', stakefyPaywall({ amount: 0.01, merchantWallet: 'WALLET' }));
```

---

## Roadmap

- [x] Core SDK with payment creation
- [x] React hooks & components
- [x] Express middleware
- [x] Auto-402 interceptor
- [x] Social payments (@username)
- [x] Session budgets
- [x] Payment channels
- [x] Mainnet deployment
- [ ] Documentation site (docs.stakefy.io)
- [ ] Multi-chain support (EVM)
- [ ] Advanced analytics dashboard
- [ ] Webhook system v2
- [ ] Mobile SDK (React Native)

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## Support

- 📧 **Email:** sayhello@stakefy.io
- 🐦 **Twitter:** [@stakefy](https://twitter.com/stakefy)
- 💬 **Issues:** [GitHub Issues](https://github.com/JaspSoe/stakefy-x402/issues)
- 📖 **Docs:** [Full Documentation](./packages/core/README.md)

---

## License

MIT © Stakefy Team

---

**Built with ❤️ by the Stakefy team**

*Competing with PayAI's x402-solana? We're 10x better. Try us.*
