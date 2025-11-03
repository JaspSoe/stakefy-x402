# Gaming Microtransactions - Session Budget Demo

Web3 gaming with instant purchases - no wallet popup spam!

## Features

- 🎮 Session budgets (approve once, buy 100x)
- ⚡ Instant purchases without popups
- 💰 In-game shop with multiple items
- 📦 Real-time inventory tracking

## Quick Start
```bash
npm install
npm run dev
```

## Code Highlights
```typescript
import { oneShot } from 'x402-stakefy-sdk';

// Approve $1 for 100 purchases @ $0.01 each
await oneShot(client, merchant, user, 100, 0.01);

// Now buy items without wallet popups!
// Each purchase auto-deducts from session budget
```

## Why This Beats Traditional Gaming

| Feature | Stakefy | Traditional |
|---------|:-------:|:-----------:|
| **Wallet Popups** | 1 (for session) | 100 (per item) |
| **Settlement** | 400ms | 3-5 days |
| **Fees** | 0.1% | 30% (app stores) |
| **True Ownership** | ✅ On-chain | ❌ Centralized |

## License

MIT
