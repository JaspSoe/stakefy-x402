# x402-stakefy-react

[![NPM Version](https://img.shields.io/npm/v/x402-stakefy-react.svg)](https://www.npmjs.com/package/x402-stakefy-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

React hooks for Stakefy x402 payments on Solana.

> **🏠 Main Documentation:** [github.com/JaspSoe/stakefy-x402](https://github.com/JaspSoe/stakefy-x402)

## 📦 Stakefy Ecosystem

This is part of the complete Stakefy payment infrastructure:

| Package | Description | NPM |
|---------|-------------|-----|
| **x402-stakefy-sdk** | Core SDK | [![npm](https://img.shields.io/npm/v/x402-stakefy-sdk)](https://npmjs.com/package/x402-stakefy-sdk) |
| **x402-stakefy-react** | React hooks (this package) | [![npm](https://img.shields.io/npm/v/x402-stakefy-react)](https://npmjs.com/package/x402-stakefy-react) |
| **stakefy-express** | Express middleware | [![npm](https://img.shields.io/npm/v/stakefy-express)](https://npmjs.com/package/stakefy-express) |

## 🚀 Quick Start
```bash
npm install x402-stakefy-react x402-stakefy-sdk @solana/wallet-adapter-react
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
    return (
      <button onClick={paywall.unlock} disabled={paywall.paying}>
        {paywall.paying ? 'Processing...' : 'Unlock for 0.01 SOL'}
      </button>
    );
  }

  return <div>Premium content here!</div>;
}
```

## ✨ Available Hooks

- ✅ `useStakefyPayment` - Simple payments
- ✅ `usePaywall` - Content paywalls
- ✅ `useSessionBudget` - Budget management
- ✅ `usePaymentChannel` - Channel state
- ✅ `useUsername` - Username resolution

## 🎯 Examples

### Content Paywall
```tsx
const paywall = usePaywall({
  contentId: 'article-123',
  amount: 0.01,
  merchantId: 'publisher-wallet'
});
```

### Simple Payment
```tsx
const { pay, loading, error } = useStakefyPayment();

await pay({
  amount: 0.5,
  merchantId: 'merchant-wallet',
  memo: 'Coffee payment'
});
```

### Session Budget
```tsx
const { session, pay } = useSessionBudget({
  budget: 1.0,
  duration: 3600,
  merchantId: 'merchant-id'
});
```

## 📖 Full Documentation

For complete documentation, API reference, and more examples:

👉 **[Complete Documentation](https://github.com/JaspSoe/stakefy-x402)**

Includes:
- All hook APIs
- Error handling
- TypeScript types
- Advanced examples
- Best practices

## 🔗 Links

- **Main Docs:** https://github.com/JaspSoe/stakefy-x402
- **Core SDK:** https://npmjs.com/package/x402-stakefy-sdk
- **Express Package:** https://npmjs.com/package/stakefy-express
- **Facilitator API:** https://stakefy-x402-production.up.railway.app
- **Twitter:** [@stakefy](https://twitter.com/stakefy)
- **Email:** sayhello@stakefy.io

## 📄 License

MIT © Stakefy
