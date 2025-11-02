# x402-stakefy-sdk

[![npm version](https://img.shields.io/npm/v/x402-stakefy-sdk.svg)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-stakefy--x402-blue)](https://github.com/JaspSoe/stakefy-x402)

🚀 **The most feature-rich Solana x402 payment SDK** - Better than alternatives, 100% open source.

## Why Stakefy x402 SDK?

| Feature | Stakefy | Others |
|---------|---------|--------|
| **Fees** | 0.1% | 1-2% |
| **Payment Channels** | ✅ | ❌ |
| **@Username Payments** | ✅ | ❌ |
| **Session Budgets** | ✅ | ❌ |
| **Open Source** | ✅ | ❌ |
| **TypeScript** | ✅ Full types | Partial |
| **Framework Agnostic** | ✅ Works everywhere | ✅ |

## Installation
```bash
npm install x402-stakefy-sdk
```

## Quick Start (30 seconds)
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

// Initialize client
const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'devnet',
});

// Create a payment
const payment = await client.createPayment({
  amount: 10, // 10 USDC
  merchantId: 'your-merchant-id',
  reference: 'order-123',
});

console.log(payment.qrCode); // QR code data URL
console.log(payment.solanaPayUrl); // Solana Pay URL
```

## Unique Features (Not in Other SDKs)

### 1. Session Budgets (No Wallet Popups!)
```typescript
// User approves $100 budget ONCE
const budget = await client.createBudget({
  amount: 100,
  duration: 3600, // 1 hour
  userPublicKey: 'user-wallet-address',
  merchantId: 'merchant-123',
});

// Make payments without popups
await client.makeBudgetPayment({
  budgetId: budget.budgetId,
  amount: 5,
  reference: 'purchase-1',
});
```

### 2. @Username Payments (Better UX)
```typescript
// Register username
await client.registerUsername({
  username: 'alice',
  publicKey: 'wallet-address',
});

// Pay to @username instead of wallet address
await client.payToUsername({
  username: 'alice',
  amount: 25,
  reference: 'tip-001',
});
```

### 3. Payment Channels (Off-Chain Micro-Payments)
```typescript
// Open channel
const channel = await client.createChannel({
  depositAmount: 100,
  duration: 86400, // 24 hours
  userPublicKey: 'user-wallet',
  merchantId: 'merchant-123',
});

// Make 100 off-chain payments (instant, no fees per tx)
await client.makeChannelPayment({
  channelId: channel.channelId,
  amount: 1,
  nonce: 1,
  signature: 'signed-data',
  reference: 'micro-tx-1',
});

// Settle on-chain (100 payments = 1 blockchain tx)
await client.settleChannel(channel.channelId, 'merchant-wallet');
```

## Complete API Reference

### Client + Merchant Features (Unified)

**Payments:**
- `createPayment(request)` - Create payment session with QR code
- `verifyPayment(sessionId)` - Verify payment completion
- `getPaymentStatus(sessionId)` - Get payment status
- `settlePayment(sessionId, merchantAddress)` - Settle to merchant wallet
- `pollPaymentUntilComplete(sessionId, options?)` - Wait for payment

**Budgets:**
- `createBudget(request)` - Create pre-approved spending budget
- `makeBudgetPayment(request)` - Pay from budget (no popup)
- `getBudgetStatus(budgetId)` - Get budget status

**Usernames:**
- `registerUsername(request)` - Register @username
- `getUserProfile(username)` - Get user profile & reputation
- `payToUsername(request)` - Pay to @username

**Channels:**
- `createChannel(request)` - Open payment channel
- `makeChannelPayment(request)` - Off-chain payment
- `settleChannel(channelId, merchantAddress)` - Settle on-chain
- `getChannelStatus(channelId)` - Get channel status

**Webhooks (Merchant):**
- `verifyWebhookSignature(payload, signature)` - Verify webhook authenticity

## Real-World Use Cases

✅ **NFT Marketplaces** - Pay with @username instead of addresses  
✅ **Content Platforms** - Subscriptions with session budgets (no popups)  
✅ **Gaming** - Micro-transactions via payment channels  
✅ **Tipping Platforms** - QR codes for accepting tips  
✅ **SaaS Products** - Recurring billing with budgets  
✅ **Point of Sale** - Generate QR codes for in-person payments  
✅ **Freelance Platforms** - Escrow payments with verification  

## TypeScript Support

Full TypeScript support with auto-completion:
```typescript
import type { 
  PaymentRequest, 
  PaymentResponse,
  BudgetRequest,
  UserProfile 
} from 'x402-stakefy-sdk';
```

## Framework Support

Works with any JavaScript framework:
- ✅ Next.js / React
- ✅ Express / Node.js
- ✅ Vue / Nuxt
- ✅ Svelte / SvelteKit
- ✅ Vanilla JS

For React, use our hooks package:
```bash
npm install x402-stakefy-react
```

## Live Examples

- 🎯 [TipJar Demo](https://github.com/JaspSoe/stakefy-x402/tree/main/examples/tipjar) - Creator tipping platform
- 📦 [More examples](https://github.com/JaspSoe/stakefy-x402/tree/main/examples)

## Infrastructure

- **Facilitator API:** https://stakefy-x402-production.up.railway.app
- **Network:** Solana Devnet (Mainnet coming soon)
- **Protocol:** x402 compliant
- **Fees:** 0.1% (lowest in ecosystem)

## Links

- 📦 [NPM Package](https://npmjs.com/package/x402-stakefy-sdk)
- 📦 [React Hooks](https://npmjs.com/package/x402-stakefy-react)
- 🔗 [GitHub](https://github.com/JaspSoe/stakefy-x402)
- 📖 [API Documentation](https://github.com/JaspSoe/stakefy-x402#readme)
- 🌐 [x402 Protocol](https://x402.org)

## Comparison with x402-solana

| Feature | x402-stakefy-sdk | x402-solana |
|---------|------------------|-------------|
| Payment Channels | ✅ | ❌ |
| Username System | ✅ | ❌ |
| Session Budgets | ✅ | ❌ |
| Merchant Features | ✅ Built-in | Separate |
| Open Source | ✅ | ✅ |
| Fees | 0.1% | 1-2% |
| Own Facilitator | ✅ | ❌ (uses others) |

## Contributing

We're open source! Contributions welcome:
- Report bugs: [GitHub Issues](https://github.com/JaspSoe/stakefy-x402/issues)
- Feature requests: [Discussions](https://github.com/JaspSoe/stakefy-x402/discussions)

## License

MIT - Built with ❤️ by the Stakefy team

---

**Built by developers, for developers. Ship faster with better features.** 🚀
