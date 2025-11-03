# SaaS Team Seats - Pay-Per-Seat Billing

B2B SaaS with dynamic seat management and monthly billing.

## Features

- 👥 Pay-per-seat pricing ($10/seat/month)
- ➕ Add/remove seats dynamically
- 📊 Real-time team management
- 💰 Prorated billing

## Quick Start
```bash
npm install
npm run dev
```

## Code Highlights
```typescript
import { perMonth } from 'x402-stakefy-sdk';

// Subscribe for 5 team members
const seats = 5;
const pricePerSeat = 10;
const totalMonthly = seats * pricePerSeat;

await perMonth(client, merchant, user, totalMonthly);

// Add more seats later - automatically prorated
await perMonth(client, merchant, user, (seats + 1) * pricePerSeat);
```

## Why This Beats Traditional SaaS Billing

| Feature | Stakefy | Stripe/Chargebee |
|---------|:-------:|:----------------:|
| **Setup Complexity** | 1 function call | Hours of integration |
| **Fees** | 0.1% | 2.9% + $0.30 |
| **Settlement** | 400ms | 2-7 days |
| **Seat Changes** | Instant | Manual/delayed |

## License

MIT
