# Stakefy x402

Open-source x402 payment facilitator for Solana. Better than PayAI.

**🚀 LIVE API:** https://stakefy-x402-production.up.railway.app

## 🎯 Features

- **0.1% fees** (vs PayAI's 1-2%)
- **Open source** (vs closed)
- **NPM packages** for easy integration
- **USDC payments** on Solana
- **Production ready**

## 📦 Installation
```bash
# For clients/payers
npm install stakefy-x402-client

# For merchants
npm install stakefy-x402-merchant
```

## 🚀 Quick Start

### For Clients (Paying)
```typescript
import { StakefyX402Client } from 'stakefy-x402-client';

const client = new StakefyX402Client({
  facilitatorUrl: 'https://stakefy-x402-production.up.railway.app',
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

### For Merchants (Receiving)
```typescript
import { StakefyX402Merchant } from 'stakefy-x402-merchant';

const merchant = new StakefyX402Merchant({
  facilitatorUrl: 'https://stakefy-x402-production.up.railway.app',
  merchantId: 'your_merchant_id',
  merchantWallet: 'your_solana_wallet'
});

// Check payment status
const status = await merchant.getPaymentStatus(sessionId);

// Settle to your wallet
const result = await merchant.settlePayment(sessionId);
```

## 🏗️ Architecture
```
┌─────────────┐      ┌──────────────────┐      ┌──────────────┐
│   Client    │─────▶│  Facilitator API │◀─────│   Merchant   │
│     SDK     │      │   (Railway)      │      │     SDK      │
└─────────────┘      └──────────────────┘      └──────────────┘
                              │
                              ▼
                        ┌──────────┐
                        │  Solana  │
                        │  Devnet  │
                        └──────────┘
```

## 📖 API Endpoints

### POST /api/payment/create
Create a new payment session
```bash
curl -X POST https://stakefy-x402-production.up.railway.app/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "merchantId": "merchant_123",
    "amount": 10,
    "reference": "order_456"
  }'
```

**Response:**
```json
{
  "sessionId": "uuid",
  "depositAddress": "solana_address",
  "amount": 10,
  "feeAmount": 0.01,
  "expiresAt": "2024-01-01T00:00:00Z"
}
```

### POST /api/payment/verify
Verify payment completion

### POST /api/payment/settle
Settle payment to merchant

### GET /api/payment/status/:sessionId
Get payment session status

### GET /health
Health check endpoint

## 🌟 Why Stakefy x402?

| Feature | Stakefy x402 | PayAI |
|---------|-------------|-------|
| Open Source | ✅ | ❌ |
| Fee | **0.1%** | 1-2% |
| NPM Packages | ✅ | ❌ |
| Documentation | Excellent | Limited |
| Blockchain | Solana | Multiple |
| SDK Quality | Simple & Clean | Basic |

## 📦 NPM Packages

- [`stakefy-x402-client`](https://www.npmjs.com/package/stakefy-x402-client) - Client SDK for payers
- [`stakefy-x402-merchant`](https://www.npmjs.com/package/stakefy-x402-merchant) - Merchant SDK for receivers

## 🔧 Development
```bash
# Clone the repo
git clone https://github.com/JaspSoe/stakefy-x402.git
cd stakefy-x402

# Install dependencies
npm install

# Start API server locally
cd packages/facilitator-api
npm run dev

# Run demo
cd examples/demo-merchant
npm run demo
```

## 🚀 Self-Hosting

Deploy your own instance:

1. Fork this repo
2. Connect to Railway
3. Set root directory to `packages/facilitator-api`
4. Add environment variables:
   - `SOLANA_RPC_URL`
   - `USDC_MINT`
   - `FEE_PERCENTAGE`

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Open an issue or PR.

## 🔗 Links

- **Live API**: https://stakefy-x402-production.up.railway.app
- **GitHub**: https://github.com/JaspSoe/stakefy-x402
- **NPM - Client**: https://www.npmjs.com/package/stakefy-x402-client
- **NPM - Merchant**: https://www.npmjs.com/package/stakefy-x402-merchant
- **Stakefy**: https://stakefy.io

---

**Built with ❤️ by the Stakefy team**
