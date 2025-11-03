# SaaS Team Seats with Stakefy x402

Team subscription management with per-seat pricing.

## Features
- Pay per team member
- Add/remove seats dynamically
- Usage-based billing
- Team admin dashboard

## Usage
```typescript
// 5 team members @ $10/seat = $50/month
const presets = createBudgetPresets(client, merchantWallet, userWallet);
await presets.perMonth(50);
```

## Demo
Coming soon - Team management dashboard.
