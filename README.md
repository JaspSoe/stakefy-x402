# Stakefy x402 - Complete Solana Payment Infrastructure

[![npm version](https://img.shields.io/npm/v/x402-stakefy-sdk.svg?style=flat-square)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![npm downloads](https://img.shields.io/npm/dm/x402-stakefy-sdk.svg?style=flat-square)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

**The only x402 SDK with enterprise features, cryptographic receipts, and 10x lower fees.**

[🚀 Live Demo](https://stakefy-x402-demo-1twf7cczm-jasper-soes-projects.vercel.app) · [📦 NPM](https://npmjs.com/package/x402-stakefy-sdk) · [📊 vs PayAI](./FEATURES.md) · [💡 6 Examples](./examples)

---

## 🔥 Why Stakefy Dominates

| Feature | Stakefy x402 | PayAI x402-solana |
|---------|:------------:|:-----------------:|
| **Fees** | **0.1%** | 1-2% |
| **Receipt Verification** | ✅ SHA-256 proofs | ❌ |
| **Enterprise Features** | ✅ Full suite | ❌ |
| **Social Payments** | ✅ `payToX('@user')` | ❌ |
| **Budget Presets** | ✅ 4 presets | ❌ |
| **Solana Primitives** | ✅ Escrow, Drift, Partial Settle | ❌ |
| **React Library** | ✅ Complete | ❌ |
| **Live Examples** | ✅ 6 working apps | ❌ |

**[📊 Full Comparison →](./FEATURES.md)**

---

## �� Real Savings

| Monthly Volume | Stakefy (0.1%) | PayAI (1-2%) | **You Save** |
|----------------|:--------------:|:------------:|:------------:|
| $10,000 | $10 | $100-200 | **$1,080-2,280/year** |
| $100,000 | $100 | $1,000-2,000 | **$10,800-22,800/year** |
| $1,000,000 | $1,000 | $10,000-20,000 | **$108,000-228,000/year** |

---

## ⚡ Quick Start (30 seconds)
```bash
npm install x402-stakefy-sdk@3.0.0
```

### Basic Payment
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
```

### Social Payments (Killer Feature!)
```typescript
import { payToX } from 'x402-stakefy-sdk';

// Pay by username - no wallet address needed!
await payToX(client, '@creator', 0.25);
```

### Budget Presets (No Popup Spam!)
```typescript
import { oneShot, perMinute, perMonth } from 'x402-stakefy-sdk';

// Approve once, pay 100 times
await oneShot(client, merchant, user, 100, 0.01);

// Per-minute billing
await perMinute(client, merchant, user, 0.1, 60);

// Monthly subscription
await perMonth(client, merchant, user, 9.99);
```

---

## 🎮 6 Live Examples (Copy & Deploy)

### 1. [Next.js Paywall](./examples/nextjs-paywall) ✅
Content paywall with instant unlock.
```bash
cd examples/nextjs-paywall && npm install && npm run dev
```

### 2. [Stripe Clone](./examples/stripe-clone) ✅
Monthly subscription billing with 3 tiers.
```bash
cd examples/stripe-clone && npm install && npm run dev
```

### 3. [Content Paywall](./examples/content-paywall) ✅
OnlyFans-style pay-per-view with tipping.
```bash
cd examples/content-paywall && npm install && npm run dev
```

### 4. [Gaming Microtransactions](./examples/gaming-microtx) ✅
In-game shop with session budgets (no wallet popups).
```bash
cd examples/gaming-microtx && npm install && npm run dev
```

### 5. [QR POS Terminal](./examples/qr-pos) ✅
Point-of-sale with QR code payments.
```bash
cd examples/qr-pos && npm install && npm run dev
```

### 6. [SaaS Team Seats](./examples/saas-seats) ✅
Pay-per-seat billing with dynamic team management.
```bash
cd examples/saas-seats && npm install && npm run dev
```

**[View All Examples →](./examples)**

---

## 🏢 Enterprise Features

**Stakefy is the ONLY x402 SDK built for enterprises.**
```typescript
import { createEnterpriseClient } from 'x402-stakefy-sdk';

const enterprise = createEnterpriseClient(API_URL);

// Organization verification
const badge = await enterprise.getOrgBadge('org-123');

// Usage quotas
const quota = await enterprise.getQuota('org-123', 'project-456');

// Real-time analytics
const metrics = await enterprise.getMetrics('org-123', 'project-456', 'month');

// Invoice generation
const invoice = await enterprise.generateInvoice('org-123', '2024-10', receipts);
```

**Features PayAI doesn't have:**
- ✅ Verified organization badges
- ✅ Per-project usage quotas
- ✅ Real-time analytics & metrics
- ✅ Automated invoice generation
- ✅ Usage data export (CSV/JSON/PDF)

**[📖 Enterprise Docs →](./ENTERPRISE.md)**

---

## 🔐 Receipt Verification

**Cryptographic proof of payment with SHA-256.**
```typescript
import { verifyReceipt, verifySession } from 'x402-stakefy-sdk';

// Verify single payment
const receipt = await verifyReceipt({
  signature: 'TX_SIG',
  expectedAmount: 0.1,
  expectedMerchant: 'WALLET'
}, connection);

console.log(receipt.proof);     // SHA-256 hash
console.log(receipt.verified);  // true

// Verify entire session
const session = await verifySession('session-123', receipts, connection);
console.log(session.totalPaid);          // 15.50 USDC
console.log(session.merchantVerified);   // true
```

**[🔐 Receipt Specification →](./RECEIPT-SPEC.md)**

---

## 🚀 Advanced Solana Features

### Fast Escrow
```typescript
import { FastEscrow } from 'x402-stakefy-sdk';

const escrow = new FastEscrow(connection);
const state = await escrow.create({
  buyer: 'BUYER_WALLET',
  seller: 'SELLER_WALLET',
  amount: 10.0,
  timeout: 3600 // 1 hour
});

await escrow.release(state.escrowId); // Release to seller
```

### Partial Settlement
```typescript
import { PartialSettler } from 'x402-stakefy-sdk';

const settler = new PartialSettler();

// Settle incrementally
await settler.settle({
  channelId: 'channel-123',
  amount: 1.0,
  nonce: 1,
  merchant: 'WALLET'
});
```

### Drift Protocol Integration
```typescript
import { DriftX402 } from 'x402-stakefy-sdk';

const drift = new DriftX402('MERCHANT_WALLET', 0.01);

// Pay $0.01 and execute trade
const trade = await drift.trade({
  market: 'SOL-PERP',
  side: 'long',
  size: 1.0,
  leverage: 10
});
```

---

## 📦 Complete Package
```typescript
// Core Features
import { 
  StakefyX402Client,
  payToX,
  oneShot, perMinute, perMonth, nonceOnce
} from 'x402-stakefy-sdk';

// Enterprise
import {
  createEnterpriseClient,
  OrganizationBadge,
  UsageQuota
} from 'x402-stakefy-sdk';

// Receipt Verification
import {
  verifyReceipt,
  verifySession,
  PaymentReceipt
} from 'x402-stakefy-sdk';

// Solana Primitives
import {
  FastEscrow,
  PartialSettler,
  DriftX402
} from 'x402-stakefy-sdk';

// React Components
import {
  PaymentButton,
  Paywall,
  usePayment
} from 'x402-stakefy-sdk';

// Express Middleware
import {
  stakefyPaywall,
  stakefyBudget
} from 'x402-stakefy-sdk';
```

---

## 📖 Documentation

- **[Getting Started](./packages/core/README.md)** - Full SDK documentation
- **[Feature Comparison](./FEATURES.md)** - Detailed vs PayAI
- **[Receipt Specification](./RECEIPT-SPEC.md)** - SHA-256 proof system
- **[Enterprise Guide](./ENTERPRISE.md)** - Badges, quotas, analytics
- **[Deployment Guide](./DEPLOYMENT.md)** - Mainnet/devnet setup
- **[Examples](./examples)** - 6 production-ready apps
- **[Launch Summary](./LAUNCH.md)** - What we shipped

---

## 🎯 What We Shipped (v3.0.0)

✅ **Core SDK** - Payments, verification, sessions
✅ **Receipt Verification** - SHA-256 cryptographic proofs
✅ **Enterprise Features** - Badges, quotas, analytics, invoices
✅ **Budget Presets** - oneShot, perMinute, perMonth, nonceOnce
✅ **Social Payments** - payToX(@username)
✅ **Solana Primitives** - Escrow, partial settle, Drift
✅ **React Library** - Complete hooks + components
✅ **Express Middleware** - Drop-in paywalls
✅ **6 Live Examples** - Copy-paste ready code
✅ **Mainnet + Devnet** - Production ready

---

## 🏆 Comparison: Stakefy vs PayAI

### What PayAI Has:
- Core SDK ✅
- Multi-chain (EVM + Solana) ✅
- Basic payment verification ✅

### What Stakefy Has (Everything Above PLUS):
- **90% lower fees** (0.1% vs 1-2%) ⭐
- **Receipt verification** with SHA-256 proofs ⭐
- **Enterprise features** (badges, quotas, analytics) ⭐
- **Social payments** (@username) ⭐
- **Budget presets** (oneShot, perMinute, perMonth) ⭐
- **Solana primitives** (escrow, Drift, partial settle) ⭐
- **Complete React library** ⭐
- **6 live examples** ⭐

**[📊 Read Full Comparison →](./FEATURES.md)**

---

## 💬 Support

- 📧 **Email:** sayhello@stakefy.io
- 🐦 **Twitter:** [@stakefy](https://twitter.com/stakefy)
- 💬 **GitHub:** [Issues](https://github.com/JaspSoe/stakefy-x402/issues)
- 📖 **Docs:** [Full Documentation](./packages/core/README.md)

---

## 🚀 Roadmap

- [x] Core SDK with all features
- [x] Receipt verification (SHA-256)
- [x] Enterprise features
- [x] Budget presets
- [x] Social payments
- [x] Solana primitives
- [x] 6 live examples
- [ ] Documentation site (docs.stakefy.io)
- [ ] Mobile SDK (React Native)
- [ ] Multi-chain support (EVM)
- [ ] Advanced analytics dashboard

---

## 📄 License

MIT © Stakefy Team

---

**The only x402 SDK built for enterprises.**

**Ship payments that scale. Start with 0.1% fees.**

*PayAI charges 10-20x more and has none of our exclusive features. [See why we're better →](./FEATURES.md)*
