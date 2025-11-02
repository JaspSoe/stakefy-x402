# Stakefy x402

Open-source x402 payment facilitator for Solana. Better than PayAI.

## 🚀 Features

- **0.5% fees** (vs PayAI's 1-2%)
- **Open source** (vs closed)
- **USDC payments** on Solana
- **Simple integration** with SDKs
- **Full transparency**

## 📦 Packages

- `@stakefy-x402/facilitator-api` - Payment facilitator backend
- `@stakefy-x402/client-sdk` - Client SDK for payers
- `@stakefy-x402/merchant-sdk` - Merchant SDK for receivers

## 🎯 Quick Start

### For Merchants
```typescript
import { StakefyX402Merchant } from '@stakefy-x402/merchant-sdk';

const merchant = new StakefyX402Merchant({
  facilitatorUrl: 'https://api.stakefy.io',
  merchantId: 'your_merchant_id',
  merchantWallet: 'your_solana_wallet'
});

// Check payment status
const status = await merchant.getPaymentStatus(sessionId);

// Settle payment to your wallet
const result = await merchant.settlePayment(sessionId);
```

### For Clients
```typescript
import { StakefyX402Client } from '@stakefy-x402/client-sdk';

const client = new StakefyX402Client({
  facilitatorUrl: 'https://api.stakefy.io',
  merchantId: 'merchant_id'
});

// Create payment
const session = await client.createPayment({
  amount: 10,
  reference: 'order_123'
});

// Pay with wallet
const signature = await client.payWithWallet(session, payerKeypair);
```

## 🏗️ Architecture
```
┌─────────────┐      ┌──────────────────┐      ┌──────────────┐
│   Client    │─────▶│  Facilitator API │◀─────│   Merchant   │
│     SDK     │      │   (Backend)      │      │     SDK      │
└─────────────┘      └──────────────────┘      └──────────────┘
                              │
                              ▼
                        ┌──────────┐
                        │  Solana  │
                        │ Blockchain│
                        └──────────┘
```

## 🔧 Development
```bash
# Install dependencies
npm install

# Start API server
cd packages/facilitator-api
npm run dev

# Run demo
cd examples/demo-merchant
npm run demo
```

## 📖 API Endpoints

### POST /api/payment/create
Create a new payment session

### POST /api/payment/verify
Verify payment completion

### POST /api/payment/settle
Settle payment to merchant

### GET /api/payment/status/:sessionId
Get payment session status

## 🌟 Why Stakefy x402?

| Feature | Stakefy x402 | PayAI |
|---------|-------------|-------|
| Open Source | ✅ | ❌ |
| Fee | 0.5% | 1-2% |
| Documentation | ✅ | Limited |
| Blockchain | Solana | Multiple |
| SDK Quality | Excellent | Basic |

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Open an issue or PR.

## 🔗 Links

- Documentation: Coming soon
- Website: Coming soon
- Twitter: Coming soon
