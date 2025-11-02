# Stakefy x402

Open-source x402 payment facilitator for Solana. Better than PayAI.

**🚀 LIVE API:** https://stakefy-x402-production.up.railway.app

## 🎯 Features

- **0.1% fees** (vs PayAI's 1-2%)
- **Open source** (vs closed)
- **USDC payments** on Solana devnet
- **Simple integration** with SDKs
- **Production ready**

## 📦 Packages

- `@stakefy-x402/facilitator-api` - Payment facilitator backend
- `@stakefy-x402/client-sdk` - Client SDK for payers
- `@stakefy-x402/merchant-sdk` - Merchant SDK for receivers

## 🚀 Quick Start

### Test the API
```bash
# Health check
curl https://stakefy-x402-production.up.railway.app/health

# Create payment session
curl -X POST https://stakefy-x402-production.up.railway.app/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "merchantId": "your_merchant_id",
    "amount": 10,
    "reference": "order_123"
  }'
```

### For Merchants
```typescript
import { StakefyX402Merchant } from '@stakefy-x402/merchant-sdk';

const merchant = new StakefyX402Merchant({
  facilitatorUrl: 'https://stakefy-x402-production.up.railway.app',
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

**Request:**
```json
{
  "merchantId": "merchant_123",
  "amount": 10,
  "reference": "order_456"
}
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
| Documentation | Excellent | Limited |
| Blockchain | Solana | Multiple |
| SDK Quality | Simple & Clean | Basic |

## �� Development
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

## 🚀 Deployment

The API is deployed on Railway. To deploy your own:

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
- **Stakefy**: https://stakefy.io
