# x402-stakefy-sdk

[![NPM Version](https://img.shields.io/npm/v/x402-stakefy-sdk.svg)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Core TypeScript SDK for Stakefy x402 payments on Solana.

> **🏠 Main Documentation:** [github.com/JaspSoe/stakefy-x402](https://github.com/JaspSoe/stakefy-x402)

## 📦 Stakefy Ecosystem

This is part of the complete Stakefy payment infrastructure:

| Package | Description | NPM |
|---------|-------------|-----|
| **x402-stakefy-sdk** | Core SDK (this package) | [![npm](https://img.shields.io/npm/v/x402-stakefy-sdk)](https://npmjs.com/package/x402-stakefy-sdk) |
| **x402-stakefy-react** | React hooks | [![npm](https://img.shields.io/npm/v/x402-stakefy-react)](https://npmjs.com/package/x402-stakefy-react) |
| **stakefy-express** | Express middleware | [![npm](https://img.shields.io/npm/v/stakefy-express)](https://npmjs.com/package/stakefy-express) |

## 🚀 Quick Start
```bash
npm install x402-stakefy-sdk
```
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'devnet'
});

// Create payment
const payment = await client.createPayment({
  amount: 0.1,
  merchantId: 'YOUR_MERCHANT_WALLET',
  reference: 'order-123'
});

console.log('Pay here:', payment.solanaPayUrl);
console.log('QR code:', payment.qrCode);
```

## ✨ Features

- ✅ Simple payment creation
- ✅ @username payments
- ✅ Session budgets
- ✅ Payment channels
- ✅ QR code generation
- ✅ Solana Pay URLs
- ✅ Webhook support
- ✅ Comprehensive error handling
- ✅ Full TypeScript support

## 📖 Full Documentation

For complete documentation, examples, and guides:

👉 **[Complete Documentation](https://github.com/JaspSoe/stakefy-x402)**

Includes:
- React hooks examples
- Express middleware examples
- API reference
- Error handling guide
- Security best practices
- Use case examples

## 🔗 Links

- **Main Docs:** https://github.com/JaspSoe/stakefy-x402
- **React Package:** https://npmjs.com/package/x402-stakefy-react
- **Express Package:** https://npmjs.com/package/stakefy-express
- **Facilitator API:** https://stakefy-x402-production.up.railway.app
- **Twitter:** [@stakefy](https://twitter.com/stakefy)
- **Email:** sayhello@stakefy.io

## 📄 License

MIT © Stakefy
