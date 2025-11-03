# Stakefy x402 - Enterprise Solana Payment Infrastructure

[![npm version](https://img.shields.io/npm/v/x402-stakefy-sdk.svg?style=flat-square)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![npm downloads](https://img.shields.io/npm/dm/x402-stakefy-sdk.svg?style=flat-square)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**The only x402 SDK with cryptographic receipt verification** — Enterprise-grade payment infrastructure with 10x lower fees.

[🚀 Live Demo](https://stakefy-x402-demo-1twf7cczm-jasper-soes-projects.vercel.app) · [�� NPM](https://npmjs.com/package/x402-stakefy-sdk) · [📊 Comparison](./FEATURES.md) · [🔐 Receipt Spec](./RECEIPT-SPEC.md)

---

## 🎯 Why Enterprises Choose Stakefy Over PayAI

| Feature | Stakefy x402 | PayAI | Winner |
|---------|:------------:|:-----:|:------:|
| **Transaction Fees** | **0.1%** | 1-2% | Stakefy (10x cheaper) |
| **Receipt Verification** | ✅ SHA-256 proofs | ❌ None | **Stakefy EXCLUSIVE** |
| **Session State Tracking** | ✅ Full audit trail | ❌ None | **Stakefy EXCLUSIVE** |
| **Social Payments** | ✅ `payToX()` | ❌ | **Stakefy EXCLUSIVE** |
| **Budget Presets** | ✅ 4 presets | ❌ | **Stakefy EXCLUSIVE** |
| **Auto-402 Handler** | ✅ Zero config | ❌ | **Stakefy EXCLUSIVE** |
| **React Library** | ✅ Complete | ❌ | **Stakefy EXCLUSIVE** |

**📊 [Full Comparison →](./FEATURES.md)** | **🔐 [Receipt Spec →](./RECEIPT-SPEC.md)**

---

## 🔐 NEW: Enterprise Receipt Verification

**Stakefy is the ONLY x402 SDK with cryptographic receipt verification.**
```typescript
import { verifyReceipt, verifySession } from 'x402-stakefy-sdk';

// Verify single payment with SHA-256 proof
const receipt = await verifyReceipt({
  signature: 'TRANSACTION_SIG',
  expectedAmount: 0.1,
  expectedMerchant: 'WALLET'
}, connection);

console.log(receipt.proof);     // SHA-256 hash
console.log(receipt.verified);  // true (on-chain confirmed)

// Verify entire session for compliance
const session = await verifySession('session-123', receipts, connection);

console.log(session.totalPaid);          // 15.50 USDC
console.log(session.totalTransactions);  // 155 payments
console.log(session.merchantVerified);   // true
```

**Use cases:**
- ✅ Tax compliance & auditing
- ✅ Dispute resolution
- ✅ Fraud prevention
- ✅ Enterprise invoicing

**[Read Receipt Specification →](./RECEIPT-SPEC.md)**

---

## 💰 Real Savings Calculator

Processing **$10,000/month**:
- **Stakefy:** $10/month = $120/year
- **PayAI:** $100-200/month = $1,200-2,400/year

**You save: $1,080-2,280 annually**

At **$100,000/month**: Save $10,800-22,800/year 🤯

---

## ⚡ Quick Start (30 seconds)
```bash
npm install x402-stakefy-sdk
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

---

## 🚀 Exclusive Features

### 1️⃣ Receipt Verification (Enterprise)
```typescript
// Cryptographic proof of payment
const receipt = await verifyReceipt(options, connection);
console.log(receipt.proof); // SHA-256 deterministic hash
```

### 2️⃣ Social Payments
```typescript
// Pay by username instead of wallet
await payToX(client, '@creator', 0.25);
```

### 3️⃣ Budget Presets
```typescript
import { oneShot, perMinute, perMonth } from 'x402-stakefy-sdk';

await oneShot(client, merchant, user, 100, 0.01);  // 100 payments
await perMinute(client, merchant, user, 0.1, 60);  // $0.10/min
await perMonth(client, merchant, user, 9.99);      // $9.99/month
```

### 4️⃣ Session State Tracking
```typescript
// Track entire payment session with audit trail
const session = await verifySession(sessionId, receipts, connection);
```

---

## 📦 What's Included
```typescript
// Core Features
import { 
  StakefyX402Client,
  payToX,
  oneShot, perMinute, perMonth, nonceOnce
} from 'x402-stakefy-sdk';

// Receipt Verification (NEW!)
import {
  verifyReceipt,
  verifySession,
  generateProof,
  validateProof
} from 'x402-stakefy-sdk';

// React Components
import {
  PaymentButton,
  Paywall,
  usePayment,
  useSessionBudget
} from 'x402-stakefy-sdk';

// Express Middleware
import {
  stakefyPaywall,
  stakefyBudget
} from 'x402-stakefy-sdk';
```

---

## 🎮 Live Examples

### [Next.js Paywall](./examples/nextjs-paywall) ✅ LIVE
Beautiful content paywall with instant unlock.

**[View Demo →](./examples/nextjs-paywall)**

### Coming This Week:
- Stripe Clone (subscriptions)
- Content Paywall (pay-per-view)
- Gaming Microtx (in-game purchases)
- QR POS (point-of-sale)
- SaaS Seats (team billing)

**[All Examples →](./examples)**

---

## 📖 Documentation

- **[Getting Started](./packages/core/README.md)** - Full SDK docs
- **[Receipt Specification](./RECEIPT-SPEC.md)** - Proof algorithm & verification
- **[Feature Comparison](./FEATURES.md)** - vs PayAI detailed breakdown
- **[Examples](./examples)** - Production code

---

## 🏆 What We Shipped Today

✅ **v2.6.0** - Receipt verification system  
✅ **SHA-256 deterministic proofs**  
✅ **Session state tracking**  
✅ **Budget presets** (oneShot, perMinute, perMonth)  
✅ **Social payments** (payToX)  
✅ **Live examples**  
✅ **Professional docs**  

---

## 🎯 Comparison: PayAI vs Stakefy

**PayAI has:**
- Core SDK ✅
- Multi-chain (EVM + Solana) ✅
- Basic payment verification ✅

**Stakefy has everything above PLUS:**
- 90% lower fees (0.1% vs 1-2%) ✨
- Receipt verification with SHA-256 proofs ✨
- Session state tracking ✨
- Social payments (@username) ✨
- Budget presets (oneShot, perMinute, perMonth) ✨
- Auto-402 interceptor ✨
- Complete React library ✨
- Drop-in Express middleware ✨
- Live production examples ✨

**[Read Full Comparison →](./FEATURES.md)**

---

## 💬 Support

- 📧 **Email:** sayhello@stakefy.io
- 🐦 **Twitter:** [@stakefy](https://twitter.com/stakefy)
- 💬 **Issues:** [GitHub](https://github.com/JaspSoe/stakefy-x402/issues)

---

## 📄 License

MIT © Stakefy Team

---

**The only x402 SDK built for enterprises. Ship payments that scale.**

*PayAI can't match our receipts. [See why →](./RECEIPT-SPEC.md)*
