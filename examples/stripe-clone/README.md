# Stripe Clone - Monthly Subscriptions with Stakefy x402

Recurring payments on Solana using payment channels.

## Features
- Monthly/yearly subscription plans
- Auto-renewal with payment channels
- Usage-based billing option
- Customer portal

## Usage
```typescript
import { createBudgetPresets } from 'x402-stakefy-sdk';

const presets = createBudgetPresets(client, merchantWallet, userWallet);
await presets.perMonth(9.99); // $9.99/month subscription
```

## Demo
Coming soon - Full Next.js implementation with subscription management.
