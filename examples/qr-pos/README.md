# QR Code POS Terminal

Point-of-sale system with QR code payments on Solana.

## Features

- 📱 Generate payment QR codes
- ⚡ Instant settlement (400ms)
- 🧾 Digital receipts
- 💰 0.1% fees vs 2.9% cards

## Quick Start
```bash
npm install
npm run dev
```

## Code Highlights
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

const payment = await client.createPayment({
  amount: 25.00,
  merchantId: 'MERCHANT_WALLET',
  reference: `pos-${Date.now()}`
});

// Display QR code
console.log(payment.qrCode);      // Base64 QR image
console.log(payment.solanaPayUrl); // Solana Pay URL
```

## Why This Beats Traditional POS

| Feature | Stakefy | Square/Stripe |
|---------|:-------:|:-------------:|
| **Fees** | 0.1% | 2.9% + $0.30 |
| **Settlement** | 400ms | 1-3 days |
| **Chargebacks** | None | Yes (costly) |
| **Global** | ✅ | Limited |

## License

MIT
