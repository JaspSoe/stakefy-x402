# Gaming Microtransactions with Stakefy x402

In-game purchases using session budgets.

## Features
- Session budgets (approve once, buy multiple items)
- Instant settlement (400ms on Solana)
- Item inventory system
- No wallet popup spam

## Usage
```typescript
import { oneShot } from 'x402-stakefy-sdk';

// Approve 100 item purchases
await oneShot(client, merchantWallet, 100, 0.01);
// Each item costs $0.01, total $1 budget
```

## Demo
Coming soon - Game with coins, powerups, cosmetics.
