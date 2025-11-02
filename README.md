# Stakefy x402 - Complete Solana Payment Infrastructure

[![NPM Core SDK](https://img.shields.io/npm/v/x402-stakefy-sdk.svg)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![NPM React](https://img.shields.io/npm/v/x402-stakefy-react.svg)](https://www.npmjs.com/package/x402-stakefy-react)
[![NPM Express](https://img.shields.io/npm/v/stakefy-express.svg)](https://www.npmjs.com/package/stakefy-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/JaspSoe/stakefy-x402?style=social)](https://github.com/JaspSoe/stakefy-x402)

🚀 **The most complete Solana x402 payment SDK** - Better than alternatives, 100% open source.

## 📦 Ecosystem Packages

Install what you need - all packages work together seamlessly:
```bash
# Core SDK (required for all)
npm install x402-stakefy-sdk

# React Hooks (for React apps)
npm install x402-stakefy-react

# Express Middleware (for Node.js APIs)
npm install stakefy-express
```

| Package | Description | NPM |
|---------|-------------|-----|
| **x402-stakefy-sdk** | Core payment infrastructure | [![npm](https://img.shields.io/npm/v/x402-stakefy-sdk)](https://npmjs.com/package/x402-stakefy-sdk) |
| **x402-stakefy-react** | React hooks for payments | [![npm](https://img.shields.io/npm/v/x402-stakefy-react)](https://npmjs.com/package/x402-stakefy-react) |
| **stakefy-express** | Express middleware | [![npm](https://img.shields.io/npm/v/stakefy-express)](https://npmjs.com/package/stakefy-express) |

## 🔥 Quick Start by Use Case

### 💻 Web App with React
```bash
npm install x402-stakefy-sdk x402-stakefy-react @solana/wallet-adapter-react
```
```tsx
import { usePaywall } from 'x402-stakefy-react';

function PremiumContent() {
  const paywall = usePaywall({
    contentId: 'premium-article',
    amount: 0.01,
    merchantId: 'YOUR_WALLET'
  });

  if (!paywall.hasAccess) {
    return <button onClick={paywall.unlock}>Unlock for 0.01 SOL</button>;
  }

  return <div>Premium content here!</div>;
}
```

[📖 Full React Docs →](./packages/react/README.md)

### 🌐 API Server with Express
```bash
npm install x402-stakefy-sdk stakefy-express express
```
```typescript
import express from 'express';
import { stakefyPaywall } from 'stakefy-express';

const app = express();

// Protected endpoint - requires payment
app.get('/api/premium', 
  stakefyPaywall({ 
    amount: 0.01, 
    merchantId: 'YOUR_WALLET' 
  }),
  (req, res) => {
    res.json({ data: 'premium content' });
  }
);

app.listen(3000);
```

[📖 Full Express Docs →](./packages/express/README.md)

### 🔧 Vanilla JavaScript/TypeScript
```bash
npm install x402-stakefy-sdk
```
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'devnet'
});

// Create payment
const payment = await client.createPayment({
  amount: 0.1,
  merchantId: 'YOUR_WALLET',
  reference: 'order-123'
});

console.log('Pay here:', payment.solanaPayUrl);
```

[📖 Full Core SDK Docs →](./packages/core/README.md)

## 🎯 Why Stakefy?

| Feature | Stakefy | Others |
|---------|---------|--------|
| **Fees** | 0.1% | 1-2% |
| **Payment Channels** | ✅ | ❌ |
| **@Username System** | ✅ | ❌ |
| **Session Budgets** | ✅ | ❌ |
| **React Hooks** | ✅ | ❌ |
| **Express Middleware** | ✅ | ❌ |
| **Open Source** | ✅ | ❌ |
| **Own Facilitator** | ✅ | ❌ |

[📊 Full Comparison →](./COMPARISON.md)

## 🚀 Features

### Core SDK (x402-stakefy-sdk)
- ✅ Simple payment creation
- ✅ @username payments
- ✅ Session budgets (multiple payments, one authorization)
- ✅ Payment channels (off-chain micro-payments)
- ✅ QR code generation
- ✅ Solana Pay URLs
- ✅ Webhook support
- ✅ Comprehensive error handling
- ✅ TypeScript support

### React Hooks (x402-stakefy-react)
- ✅ `useStakefyPayment` - Simple payments
- ✅ `usePaywall` - Content paywalls
- ✅ `useSessionBudget` - Budget management
- ✅ `usePaymentChannel` - Channel state
- ✅ `useUsername` - Username resolution
- ✅ Full TypeScript types
- ✅ Error state management

### Express Middleware (stakefy-express)
- ✅ `stakefyPaywall()` - Per-endpoint payments
- ✅ `stakefyBudget()` - Session-based access
- ✅ HTTP 402 compliant responses
- ✅ Built-in error handling
- ✅ TypeScript support

## 📚 Documentation

- [Core SDK Documentation](./packages/core/README.md)
- [React Hooks Documentation](./packages/react/README.md)
- [Express Middleware Documentation](./packages/express/README.md)
- [SDK Comparison](./COMPARISON.md)
- [Security Policy](./SECURITY.md)
- [Examples](./examples/)

## 🔗 Quick Links

- 🌐 **Facilitator API:** https://stakefy-x402-production.up.railway.app
- 📦 **Core SDK:** https://npmjs.com/package/x402-stakefy-sdk
- ⚛️ **React Hooks:** https://npmjs.com/package/x402-stakefy-react
- 🚀 **Express Middleware:** https://npmjs.com/package/stakefy-express
- 💬 **Twitter:** [@stakefy](https://twitter.com/stakefy)
- �� **Email:** sayhello@stakefy.io

## 🎯 Use Cases

### API Metering
```typescript
// Charge per API call
app.get('/api/ai/generate', 
  stakefyPaywall({ amount: 0.001, merchantId: 'xxx' }),
  async (req, res) => {
    const result = await generateAI(req.body.prompt);
    res.json({ result });
  }
);
```

### Content Paywalls
```tsx
function Article() {
  const paywall = usePaywall({
    contentId: 'article-123',
    amount: 0.01,
    merchantId: 'publisher-wallet'
  });

  return paywall.hasAccess ? <Content /> : <PayButton />;
}
```

### Session Budgets
```typescript
// Pay once, use multiple times
const session = await client.createBudgetSession({
  budget: 1.0,
  duration: 3600,
  merchantId: 'merchant-id'
});
```

### Payment Channels
```typescript
// Off-chain micro-payments
const channel = await client.createPaymentChannel({
  amount: 0.5,
  merchantId: 'merchant-id'
});
```

## 🚨 Error Handling

All packages include comprehensive error handling:
```typescript
import { StakefyErrors, isStakefyError } from 'x402-stakefy-sdk';

try {
  await client.createPayment({ amount, merchantId });
} catch (error) {
  if (isStakefyError(error)) {
    console.log(error.userMessage);  // User-friendly message
    console.log(error.recovery);     // Recovery suggestion
    console.log(error.code);         // Error code (1001-9999)
  }
}
```

[📖 Full Error Documentation →](./packages/core/README.md#-error-handling)

## 🔐 Security

- ✅ No private key handling
- ✅ All transactions signed in user's wallet
- ✅ HTTPS only
- ✅ Rate limiting
- ✅ Input validation
- ✅ Comprehensive threat model

[📖 Security Policy →](./SECURITY.md)

## 🛠️ Development
```bash
# Clone repo
git clone https://github.com/JaspSoe/stakefy-x402.git
cd stakefy-x402

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests (coming soon)
npm test
```

## 📄 License

MIT © Stakefy

---

**Built with ❤️ by [@stakefy](https://twitter.com/stakefy)**
