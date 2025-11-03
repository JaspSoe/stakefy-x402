# 🚀 Stakefy Express API Demo

A **live, working demo** of Stakefy x402 payments with Express.js.

## 🎯 What This Demonstrates

This demo shows **5 different payment patterns**:

1. ✅ **Free endpoint** - No payment required
2. 💎 **Premium paywall** - Single payment (0.01 SOL)
3. 🤖 **AI API metering** - Pay per request (0.001 SOL)
4. 📊 **Session budgets** - Pay once, use multiple times (0.1 SOL)
5. 🔧 **Payment creation** - Create payments programmatically

## �� Installation
```bash
npm install
```

## 🔧 Configuration

Set your merchant wallet (optional, defaults to demo address):
```bash
export MERCHANT_WALLET=YOUR_SOLANA_WALLET_ADDRESS
```

## 🚀 Run the Demo
```bash
npm run dev
```

Server will start at **http://localhost:3000**

## 🎮 Try It Out

### 1. Check API Info
```bash
curl http://localhost:3000
```

### 2. Free Endpoint (No Payment)
```bash
curl http://localhost:3000/api/free
```

**Response:**
```json
{
  "message": "🎉 This endpoint is FREE!",
  "data": {
    "timestamp": "2025-11-03T01:30:00.000Z",
    "tip": "Try the /api/premium endpoint to see payments in action"
  }
}
```

### 3. Premium Endpoint (Requires Payment)
```bash
curl http://localhost:3000/api/premium
```

**Response (402 Payment Required):**
```json
{
  "error": "Payment Required",
  "message": "Payment of 0.01 SOL required",
  "payment": {
    "sessionId": "sess_abc123",
    "amount": 0.01,
    "depositAddress": "...",
    "qrCode": "data:image/png;base64,...",
    "solanaPayUrl": "solana:...",
    "expiresAt": "2025-11-03T01:35:00.000Z"
  },
  "instructions": "Include X-Payment-Proof and X-Session-Id headers with your next request"
}
```

### 4. Create Payment Programmatically
```bash
curl -X POST http://localhost:3000/api/demo/create-payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 0.01, "token": "SOL"}'
```

### 5. AI API (Pay Per Request)
```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me a joke"}'
```

**First call returns 402 with payment details. After payment:**
```json
{
  "message": "🤖 AI Response Generated",
  "prompt": "Tell me a joke",
  "response": "This is a mock AI response...",
  "cost": "0.001 SOL",
  "timestamp": "2025-11-03T01:30:00.000Z"
}
```

### 6. Session Budget Endpoint
```bash
curl http://localhost:3000/api/metered/data
```

**First call returns 402 with session budget details. After creating session, make multiple calls:**
```json
{
  "message": "📊 Metered data access",
  "data": {
    "value": 0.7234,
    "timestamp": "2025-11-03T01:30:00.000Z"
  },
  "note": "Part of your 0.1 SOL session budget"
}
```

## 📊 Endpoints Summary

| Endpoint | Method | Cost | Description |
|----------|--------|------|-------------|
| `/` | GET | FREE | API info and documentation |
| `/api/free` | GET | FREE | Free endpoint |
| `/api/premium` | GET | 0.01 SOL | Premium content paywall |
| `/api/ai/generate` | POST | 0.001 SOL | AI generation per request |
| `/api/metered/data` | GET | 0.1 SOL budget | Session-based access |
| `/api/demo/create-payment` | POST | FREE | Create payment request |

## 🔧 How It Works

1. **Request protected endpoint** without payment
2. **Receive 402 Payment Required** with payment details
3. **Make payment** using Solana Pay URL or QR code
4. **Retry request** with `X-Session-Id` header
5. **Access granted** ✅

## 💻 Code Examples

### Basic Paywall
```javascript
import { stakefyPaywall } from 'stakefy-express';

app.get('/api/premium',
  stakefyPaywall({
    amount: 0.01,
    merchantId: 'YOUR_WALLET'
  }),
  (req, res) => {
    res.json({ data: 'Premium content' });
  }
);
```

### Session Budget
```javascript
import { stakefyBudget } from 'stakefy-express';

app.use('/api/metered',
  stakefyBudget({
    budget: 0.1,
    duration: 3600,
    merchantId: 'YOUR_WALLET'
  })
);
```

### Create Payment
```javascript
import { StakefyX402Client } from 'x402-stakefy-sdk';

const client = StakefyX402Client.auto();

const payment = await client.createPayment({
  amount: 0.01,
  merchantId: 'YOUR_WALLET',
  reference: 'order-123'
});
```

## 🎯 Use Cases

This demo shows patterns for:
- 💰 **Content paywalls** (blogs, articles, videos)
- 🤖 **API metering** (AI, data APIs, analytics)
- 📊 **Session-based access** (dashboards, tools)
- 🎮 **Pay-per-use services** (games, utilities)

## 🔗 Links

- [Stakefy Documentation](https://github.com/JaspSoe/stakefy-x402)
- [NPM Package](https://npmjs.com/package/x402-stakefy-sdk)
- [Express Middleware](https://npmjs.com/package/stakefy-express)
- [Quickstart Guide](../../QUICKSTART.md)

## 📄 License

MIT © Stakefy
