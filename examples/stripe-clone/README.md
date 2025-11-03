# Stripe Clone - Subscription Billing with Stakefy x402

Monthly recurring payments on Solana using payment channels.

## Features

- 💳 3 subscription tiers (Starter, Pro, Enterprise)
- 🔄 Auto-renewing monthly payments
- ⚡ 0.1% fees vs 2.9% on Stripe
- 🚀 Settled in 400ms on Solana

## Quick Start
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Code Highlights
```typescript
import { perMonth } from 'x402-stakefy-sdk';

// Subscribe to $29.99/month plan
await perMonth(client, merchantWallet, userWallet, 29.99);

// Auto-renews monthly via payment channel
// No wallet approval needed after initial setup
```

## Why This Beats Stripe

| Feature | Stakefy | Stripe |
|---------|:-------:|:------:|
| **Fees** | 0.1% | 2.9% + $0.30 |
| **Settlement** | 400ms | 2-7 days |
| **Currency** | USDC | Fiat only |
| **Blockchain** | ✅ On-chain | ❌ Off-chain |
| **No Chargebacks** | ✅ | ❌ |

## Integration
```typescript
import { StakefyX402Client, perMonth } from 'x402-stakefy-sdk';

const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'mainnet-beta'
});

// Create monthly subscription
const subscription = await perMonth(
  client,
  'MERCHANT_WALLET',
  'USER_WALLET',
  29.99  // $29.99/month
);
```

## Learn More

- [Stakefy x402 SDK](https://npmjs.com/package/x402-stakefy-sdk)
- [Full Documentation](https://github.com/JaspSoe/stakefy-x402)
- [Budget Presets Guide](https://github.com/JaspSoe/stakefy-x402/blob/main/README.md#budget-presets)

## License

MIT
