# stakefy-express

[![NPM Version](https://img.shields.io/npm/v/stakefy-express.svg)](https://www.npmjs.com/package/stakefy-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Express middleware for Stakefy x402 payments. Add payment requirements to your API in **3 lines of code**.

> **🏠 Main Documentation:** [github.com/JaspSoe/stakefy-x402](https://github.com/JaspSoe/stakefy-x402)

## 📦 Stakefy Ecosystem

This is part of the complete Stakefy payment infrastructure:

| Package | Description | NPM |
|---------|-------------|-----|
| **x402-stakefy-sdk** | Core SDK | [![npm](https://img.shields.io/npm/v/x402-stakefy-sdk)](https://npmjs.com/package/x402-stakefy-sdk) |
| **x402-stakefy-react** | React hooks | [![npm](https://img.shields.io/npm/v/x402-stakefy-react)](https://npmjs.com/package/x402-stakefy-react) |
| **stakefy-express** | Express middleware (this package) | [![npm](https://img.shields.io/npm/v/stakefy-express)](https://npmjs.com/package/stakefy-express) |

## 🚀 Quick Start
```bash
npm install stakefy-express x402-stakefy-sdk express
```
```typescript
import express from 'express';
import { stakefyPaywall } from 'stakefy-express';

const app = express();

// Protected endpoint - requires 0.01 SOL payment
app.get('/api/premium', 
  stakefyPaywall({ 
    amount: 0.01, 
    merchantId: 'YOUR_MERCHANT_WALLET'
  }),
  (req, res) => {
    res.json({ data: 'premium content' });
  }
);

app.listen(3000);
```

## ✨ Features

- ✅ **3-line integration** - Add paywalls instantly
- ✅ **HTTP 402 compliant** - Standard payment required responses
- ✅ **Session budgets** - Multiple API calls per payment
- ✅ **TypeScript support** - Full type safety
- ✅ **Error handling** - Built-in error handling
- ✅ **Flexible** - Per-endpoint or global middleware

## 🎯 Examples

### API Metering
```typescript
app.get('/api/ai/generate', 
  stakefyPaywall({ amount: 0.001, merchantId: 'xxx' }),
  async (req, res) => {
    const result = await generateAI(req.body.prompt);
    res.json({ result });
  }
);
```

### Session Budget
```typescript
// Pay once, make multiple calls
app.use('/api/metered', 
  stakefyBudget({
    budget: 0.1,
    duration: 3600,
    merchantId: 'xxx'
  })
);
```

### Global Middleware
```typescript
// Apply to all routes
app.use('/api/v2', 
  stakefyPaywall({ amount: 0.005, merchantId: 'xxx' })
);
```

## 📖 Full Documentation

For complete documentation, API reference, and more examples:

👉 **[Complete Documentation](https://github.com/JaspSoe/stakefy-x402)**

Includes:
- Complete API reference
- Advanced examples
- Client integration
- Error handling
- Best practices

## 🔗 Links

- **Main Docs:** https://github.com/JaspSoe/stakefy-x402
- **Core SDK:** https://npmjs.com/package/x402-stakefy-sdk
- **React Package:** https://npmjs.com/package/x402-stakefy-react
- **Facilitator API:** https://stakefy-x402-production.up.railway.app
- **Twitter:** [@stakefy](https://twitter.com/stakefy)
- **Email:** sayhello@stakefy.io

## 📄 License

MIT © Stakefy
