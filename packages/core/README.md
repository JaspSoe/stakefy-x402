# x402-stakefy-sdk

[![npm version](https://img.shields.io/npm/v/x402-stakefy-sdk.svg?style=flat-square)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![npm downloads](https://img.shields.io/npm/dm/x402-stakefy-sdk.svg?style=flat-square)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**The only x402 SDK with enterprise features, cryptographic receipts, and 90% lower fees than competitors.**

[🚀 Live Demo](https://stakefy-x402-demo-1twf7cczm-jasper-soes-projects.vercel.app) · [📖 GitHub](https://github.com/JaspSoe/stakefy-x402) · [�� 6 Examples](https://github.com/JaspSoe/stakefy-x402/tree/main/examples)

---

## 🔥 Why Stakefy Beats PayAI

| Feature | Stakefy | PayAI |
|---------|:-------:|:-----:|
| **Fees** | **0.1%** | 1-2% |
| **Receipt Verification** | ✅ SHA-256 | ❌ |
| **Enterprise Features** | ✅ Full | ❌ |
| **Social Payments** | ✅ `payToX()` | ❌ |
| **Budget Presets** | ✅ 4 types | ❌ |
| **Solana Primitives** | ✅ Escrow, Drift | ❌ |
| **Live Examples** | ✅ 6 apps | ❌ |

**[Full Comparison →](https://github.com/JaspSoe/stakefy-x402/blob/main/FEATURES.md)**

---

## ⚡ Quick Start
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

### Social Payments
```typescript
import { payToX } from 'x402-stakefy-sdk';

// Pay by username!
await payToX(client, '@creator', 0.25);
```

### Budget Presets
```typescript
import { oneShot, perMinute, perMonth } from 'x402-stakefy-sdk';

await oneShot(client, merchant, user, 100, 0.01);  // 100 payments
await perMinute(client, merchant, user, 0.1, 60);  // $0.10/min
await perMonth(client, merchant, user, 9.99);      // $9.99/month
```

---

## 🏢 NEW: Enterprise Features
```typescript
import { createEnterpriseClient } from 'x402-stakefy-sdk';

const enterprise = createEnterpriseClient(API_URL);

// Organization badges
const badge = await enterprise.getOrgBadge('org-123');

// Usage quotas
const quota = await enterprise.getQuota('org-123', 'project');

// Analytics
const metrics = await enterprise.getMetrics('org-123', 'project', 'month');

// Invoices
const invoice = await enterprise.generateInvoice('org-123', '2024-10', receipts);
```

**[Enterprise Docs →](https://github.com/JaspSoe/stakefy-x402/blob/main/ENTERPRISE.md)**

---

## 🔐 NEW: Receipt Verification
```typescript
import { verifyReceipt, verifySession } from 'x402-stakefy-sdk';

// Cryptographic proof with SHA-256
const receipt = await verifyReceipt({
  signature: 'TX_SIG',
  expectedAmount: 0.1,
  expectedMerchant: 'WALLET'
}, connection);

console.log(receipt.proof);     // SHA-256 hash
console.log(receipt.verified);  // true
```

**[Receipt Spec →](https://github.com/JaspSoe/stakefy-x402/blob/main/RECEIPT-SPEC.md)**

---

## 🚀 NEW: Solana Primitives

### Fast Escrow
```typescript
import { FastEscrow } from 'x402-stakefy-sdk';

const escrow = new FastEscrow(connection);
await escrow.create({ buyer, seller, amount: 10, timeout: 3600 });
await escrow.release(escrowId);
```

### Partial Settlement
```typescript
import { PartialSettler } from 'x402-stakefy-sdk';

const settler = new PartialSettler();
await settler.settle({ channelId, amount: 1.0, nonce: 1, merchant });
```

### Drift Protocol
```typescript
import { DriftX402 } from 'x402-stakefy-sdk';

const drift = new DriftX402('MERCHANT', 0.01);
const trade = await drift.trade({ market: 'SOL-PERP', side: 'long', size: 1, leverage: 10 });
```

---

## 🎮 6 Live Examples

Copy-paste ready applications:

1. **[Next.js Paywall](https://github.com/JaspSoe/stakefy-x402/tree/main/examples/nextjs-paywall)** - Content paywall
2. **[Stripe Clone](https://github.com/JaspSoe/stakefy-x402/tree/main/examples/stripe-clone)** - Subscription billing
3. **[Content Paywall](https://github.com/JaspSoe/stakefy-x402/tree/main/examples/content-paywall)** - Pay-per-view + tips
4. **[Gaming Microtx](https://github.com/JaspSoe/stakefy-x402/tree/main/examples/gaming-microtx)** - Session budgets
5. **[QR POS](https://github.com/JaspSoe/stakefy-x402/tree/main/examples/qr-pos)** - Point-of-sale
6. **[SaaS Seats](https://github.com/JaspSoe/stakefy-x402/tree/main/examples/saas-seats)** - Team billing

**[View All Examples →](https://github.com/JaspSoe/stakefy-x402/tree/main/examples)**

---

## 📦 What's Included
```typescript
// Core
import { StakefyX402Client, payToX, oneShot, perMinute, perMonth } from 'x402-stakefy-sdk';

// Enterprise
import { createEnterpriseClient, OrganizationBadge, UsageQuota } from 'x402-stakefy-sdk';

// Receipts
import { verifyReceipt, verifySession, PaymentReceipt } from 'x402-stakefy-sdk';

// Solana Primitives
import { FastEscrow, PartialSettler, DriftX402 } from 'x402-stakefy-sdk';

// React
import { PaymentButton, Paywall, usePayment } from 'x402-stakefy-sdk';

// Express
import { stakefyPaywall, stakefyBudget } from 'x402-stakefy-sdk';
```

---

## 💰 Pricing Comparison

| Monthly Volume | Stakefy (0.1%) | PayAI (1-2%) | You Save |
|----------------|:--------------:|:------------:|:--------:|
| $10,000 | $10 | $100-200 | **$1,080-2,280/year** |
| $100,000 | $100 | $1,000-2,000 | **$10,800-22,800/year** |

---

## 📖 Documentation

- **[GitHub Repository](https://github.com/JaspSoe/stakefy-x402)** - Main docs
- **[Feature Comparison](https://github.com/JaspSoe/stakefy-x402/blob/main/FEATURES.md)** - vs PayAI
- **[Receipt Spec](https://github.com/JaspSoe/stakefy-x402/blob/main/RECEIPT-SPEC.md)** - SHA-256 proofs
- **[Enterprise Guide](https://github.com/JaspSoe/stakefy-x402/blob/main/ENTERPRISE.md)** - Badges, quotas, analytics
- **[Examples](https://github.com/JaspSoe/stakefy-x402/tree/main/examples)** - 6 production apps

---

## 🎯 What's New in v3.0.0

✅ Enterprise features (badges, quotas, analytics, invoices)  
✅ Receipt verification (SHA-256 cryptographic proofs)  
✅ Budget presets (oneShot, perMinute, perMonth, nonceOnce)  
✅ Social payments (payToX)  
✅ Fast escrow for secure transactions  
✅ Partial settlement for streaming payments  
✅ Drift Protocol integration  
✅ 6 production-ready examples  

---

## 💬 Support

- 📧 sayhello@stakefy.io
- 🐦 [@stakefy](https://twitter.com/stakefy)
- 💬 [GitHub Issues](https://github.com/JaspSoe/stakefy-x402/issues)

---

## 📄 License

MIT © Stakefy Team

---

**The only x402 SDK built for enterprises. 90% lower fees. 10x more features.**

*PayAI doesn't have receipts, enterprise features, or our Solana primitives. [See why →](https://github.com/JaspSoe/stakefy-x402/blob/main/FEATURES.md)*
