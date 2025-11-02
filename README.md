# Stakefy x402 - Open Source Solana Payment Infrastructure

[![NPM Core SDK](https://img.shields.io/npm/v/x402-stakefy-sdk.svg)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![NPM React](https://img.shields.io/npm/v/x402-stakefy-react.svg)](https://www.npmjs.com/package/x402-stakefy-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/JaspSoe/stakefy-x402?style=social)](https://github.com/JaspSoe/stakefy-x402)

🚀 **The most feature-rich Solana x402 payment SDK** - Better than alternatives, 100% open source.

## Quick Links

- 📦 [Core SDK (NPM)](https://npmjs.com/package/x402-stakefy-sdk)
- ⚛️ [React Hooks (NPM)](https://npmjs.com/package/x402-stakefy-react)
- 🔍 [SDK Comparison](./COMPARISON.md)
- 💻 [Live Examples](#examples)
- 🌐 [Facilitator API](https://stakefy-x402-production.up.railway.app)

## Why Stakefy?

| Feature | Stakefy | Others |
|---------|---------|--------|
| **Fees** | 0.1% | 1-2% |
| **Payment Channels** | ✅ | ❌ |
| **@Username System** | ✅ | ❌ |
| **Session Budgets** | ✅ | ❌ |
| **Open Source** | ✅ | ❌ |
| **Own Facilitator** | ✅ | ❌ |

[📊 Full Comparison →](./COMPARISON.md)

## Installation
```bash
# Core SDK (works everywhere)
npm install x402-stakefy-sdk

# React Hooks (optional)
npm install x402-stakefy-react
```

## Quick Start (30 Seconds)
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

// Initialize
const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'devnet',
});

// Create payment
const payment = await client.createPayment({
  amount: 10, // 10 USDC
  merchantId: 'my-store',
  reference: 'order-123',
});

console.log(payment.qrCode); // Display QR code
console.log(payment.solanaPayUrl); // Solana Pay URL
```

## Unique Features

### 1. Payment Channels (Off-Chain Micro-Payments)

Make 100 payments, pay 1 transaction fee!
```typescript
const channel = await client.createChannel({
  depositAmount: 100,
  duration: 86400,
  userPublicKey: userWallet,
  merchantId: 'game-store',
});

// 100 instant off-chain payments
for (let i = 0; i < 100; i++) {
  await client.makeChannelPayment({
    channelId: channel.channelId,
    amount: 1,
    nonce: i + 1,
    signature: signData,
    reference: `tx-${i}`,
  });
}

// Settle once on-chain
await client.settleChannel(channel.channelId, merchantWallet);
```

### 2. @Username Payments (Better UX)

No more ugly wallet addresses!
```typescript
// Register @username
await client.registerUsername({
  username: 'alice',
  publicKey: walletAddress,
});

// Pay to @username
await client.payToUsername({
  username: 'alice',
  amount: 25,
  reference: 'tip',
});
```

### 3. Session Budgets (No Wallet Popups)

Perfect for subscriptions!
```typescript
// User approves $100 budget ONCE
const budget = await client.createBudget({
  amount: 100,
  duration: 3600,
  userPublicKey: userWallet,
  merchantId: 'streaming-service',
});

// Charge without popups!
await client.makeBudgetPayment({
  budgetId: budget.budgetId,
  amount: 15,
  reference: 'monthly-sub',
});
```

## Examples

### 🎯 [TipJar](./examples/tipjar) - React App
Creator tipping platform with @username system
- Next.js 14 + React hooks
- Wallet adapter integration
- Live demo ready

### ⚡ [Express API](./examples/express-api) - REST API
Full-featured payment API
- TypeScript + Express
- All SDK features exposed
- Webhook handling

### More Examples Coming:
- Vue.js e-commerce store
- Vanilla JS payment buttons
- Merchant dashboard
- Subscription service

## React Hooks
```bash
npm install x402-stakefy-react
```
```tsx
import { StakefyProvider, useStakefyPayment } from 'x402-stakefy-react';

function App() {
  return (
    <StakefyProvider client={client}>
      <PaymentButton />
    </StakefyProvider>
  );
}

function PaymentButton() {
  const { createPayment, loading, payment } = useStakefyPayment({ client });

  const handlePay = async () => {
    await createPayment({
      amount: 10,
      merchantId: 'store-123',
      reference: 'order-456',
    });
  };

  return <button onClick={handlePay}>{loading ? 'Processing...' : 'Pay 10 USDC'}</button>;
}
```

## Full API Reference

### Client + Merchant (Unified)

**Payments:**
- `createPayment()` - Create payment with QR code
- `verifyPayment()` - Verify completion
- `getPaymentStatus()` - Check status
- `settlePayment()` - Settle to merchant
- `pollPaymentUntilComplete()` - Wait for payment

**Budgets:**
- `createBudget()` - Pre-approve spending
- `makeBudgetPayment()` - Pay without popup
- `getBudgetStatus()` - Check remaining

**Usernames:**
- `registerUsername()` - Register @username
- `getUserProfile()` - Get profile & reputation
- `payToUsername()` - Pay to @username

**Channels:**
- `createChannel()` - Open payment channel
- `makeChannelPayment()` - Off-chain payment
- `settleChannel()` - Settle on-chain
- `getChannelStatus()` - Check status

[📖 Full Documentation →](./packages/core/README.md)

## Use Cases

✅ **NFT Marketplaces** - Pay with @username  
✅ **Gaming** - Micro-transactions via channels  
✅ **Content Platforms** - Subscriptions without popups  
✅ **Tipping** - QR codes for creators  
✅ **SaaS** - Recurring billing with budgets  
✅ **Point of Sale** - In-person payments  
✅ **Freelance** - Escrow with verification  

## Package Structure
```
stakefy-x402/
├── packages/
│   ├── core/                    # Core SDK (NPM: x402-stakefy-sdk)
│   ├── react/                   # React hooks (NPM: x402-stakefy-react)
│   └── facilitator-api/         # Backend API (Railway)
└── examples/
    ├── tipjar/                  # React demo app
    └── express-api/             # Express.js example
```

## Infrastructure

- **Facilitator API:** https://stakefy-x402-production.up.railway.app
- **Network:** Solana Devnet (Mainnet coming soon)
- **Protocol:** x402 compliant
- **Fees:** 0.1%
- **Uptime:** 99.9%

## Development
```bash
# Clone repo
git clone https://github.com/JaspSoe/stakefy-x402
cd stakefy-x402

# Install dependencies
npm install

# Build all packages
npm run build

# Run examples
cd examples/tipjar && npm run dev
cd examples/express-api && npm run dev
```

## Contributing

We're 100% open source! Contributions welcome:

- 🐛 [Report bugs](https://github.com/JaspSoe/stakefy-x402/issues)
- 💡 [Request features](https://github.com/JaspSoe/stakefy-x402/discussions)
- 🔧 [Submit PRs](https://github.com/JaspSoe/stakefy-x402/pulls)

## Roadmap

- [x] Core SDK with all features
- [x] React hooks package
- [x] Express.js example
- [x] TipJar demo app
- [ ] Mainnet launch
- [ ] Merchant dashboard
- [ ] Analytics API
- [ ] Vue.js examples
- [ ] React Native SDK
- [ ] Multi-chain support

## Community

- **GitHub:** [stakefy-x402](https://github.com/JaspSoe/stakefy-x402)
- **NPM Core:** [x402-stakefy-sdk](https://npmjs.com/package/x402-stakefy-sdk)
- **NPM React:** [x402-stakefy-react](https://npmjs.com/package/x402-stakefy-react)
- **x402 Protocol:** [x402.org](https://x402.org)

## License

MIT © Stakefy Team

---

**Built by developers, for developers. Ship faster with better features.** 🚀

*Lower fees. More features. 100% open source.*
