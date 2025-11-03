# Stakefy x402 - Live Examples

6 production-ready examples showing Stakefy x402 in action.

## 🚀 All Examples

| Example | Description | Features | Status |
|---------|-------------|----------|:------:|
| **[Next.js Paywall](./nextjs-paywall)** | Content paywall | Instant unlock, beautiful UI | ✅ LIVE |
| **[Stripe Clone](./stripe-clone)** | Subscription billing | 3 tiers, auto-renewal | ✅ LIVE |
| **[Content Paywall](./content-paywall)** | Pay-per-view platform | Tips, @username payments | ✅ LIVE |
| **[Gaming Microtx](./gaming-microtx)** | In-game purchases | Session budgets, no popups | ✅ LIVE |
| **[QR POS](./qr-pos)** | Point-of-sale terminal | QR codes, instant settlement | ✅ LIVE |
| **[SaaS Seats](./saas-seats)** | Team subscription | Pay-per-seat, dynamic billing | ✅ LIVE |

---

## Quick Start

Each example is standalone. Pick one and run:
```bash
cd nextjs-paywall  # or any example
npm install
npm run dev
```

Open http://localhost:3000

---

## Features Demonstrated

### Budget Presets
- **oneShot()** - Gaming Microtx example
- **perMinute()** - Can be added to any example
- **perMonth()** - Stripe Clone, SaaS Seats

### Social Payments
- **payToX()** - Content Paywall example

### Enterprise
- **Receipt verification** - All examples
- **Session tracking** - Gaming Microtx

---

## Integration Patterns

### 1. Content Paywall Pattern
```typescript
const payment = await client.createPayment({
  amount: 0.10,
  merchantId: MERCHANT_WALLET,
  reference: `content-${id}`
});
```

**Used in:** Next.js Paywall, Content Paywall

### 2. Subscription Pattern
```typescript
await perMonth(client, merchant, user, 29.99);
```

**Used in:** Stripe Clone, SaaS Seats

### 3. Session Budget Pattern
```typescript
await oneShot(client, merchant, user, 100, 0.01);
```

**Used in:** Gaming Microtx

### 4. QR Code Pattern
```typescript
const payment = await client.createPayment({...});
console.log(payment.qrCode);      // Display QR
console.log(payment.solanaPayUrl); // Solana Pay URL
```

**Used in:** QR POS

---

## Deployment

All examples are Vercel-ready:
```bash
# Deploy any example
cd stripe-clone
vercel deploy
```

Or use the deploy button in each example's README.

---

## Learn More

- [Stakefy SDK Documentation](../packages/core/README.md)
- [Feature Comparison](../FEATURES.md)
- [Enterprise Guide](../ENTERPRISE.md)

---

**Copy, customize, ship. That's it.**
