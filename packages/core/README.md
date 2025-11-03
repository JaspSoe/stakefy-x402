# x402-stakefy-sdk

[![npm version](https://img.shields.io/npm/v/x402-stakefy-sdk.svg?style=flat-square)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![npm downloads](https://img.shields.io/npm/dm/x402-stakefy-sdk.svg?style=flat-square)](https://www.npmjs.com/package/x402-stakefy-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-14F195.svg?style=flat-square)](https://solana.com/)

**The most feature-rich x402 payment SDK for Solana** — Production-ready infrastructure with 10x lower fees than competitors.

[🚀 Live Demo](https://stakefy-x402-demo-1twf7cczm-jasper-soes-projects.vercel.app) · [📖 Full Docs](https://github.com/JaspSoe/stakefy-x402) · [🐦 Twitter](https://twitter.com/stakefy)

---

## Why Stakefy x402?

Built for developers who need more than basic payment verification. Stakefy delivers a complete payment infrastructure with features that matter for production applications.

| Feature | Stakefy x402 | Competitors |
|---------|:------------:|:-----------:|
| **Transaction Fees** | **0.1%** | 1-2% |
| **Social Payments** | ✅ @username support | ❌ |
| **Session Budgets** | ✅ Full implementation | ❌ |
| **Payment Channels** | ✅ Recurring payments | ❌ |
| **Auto-402 Handler** | ✅ Fetch interceptor | ❌ |
| **React Hooks** | ✅ Complete library | Limited |
| **Express Middleware** | ✅ Drop-in integration | Limited |
| **USDC Support** | ✅ Native | ✅ |
| **Production Ready** | ✅ Mainnet deployed | Varies |

**Save 90% on fees. Get 10x more features.**

---

## Installation
```bash
npm install x402-stakefy-sdk
```

Optional packages:
```bash
npm install x402-stakefy-react      # React hooks & components
npm install stakefy-express         # Express middleware
```

---

## Quick Start

### Basic Payment (Client)
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'mainnet-beta'
});

// Create payment request
const payment = await client.createPayment({
  amount: 0.1,                    // 0.1 USDC
  merchantId: 'YOUR_WALLET_ADDRESS',
  reference: 'order-123'
});

console.log('Payment URL:', payment.solanaPayUrl);
console.log('QR Code:', payment.qrCode);
```

### Auto-402 Interceptor

Automatically handle 402 Payment Required responses:
```typescript
import { auto } from 'x402-stakefy-sdk';

// Initialize once - handles all 402s automatically
auto({
  wallet: yourSolanaWallet,
  network: 'mainnet-beta'
});

// All fetch requests now handle payments automatically
const response = await fetch('https://api.example.com/protected');
// If 402 received → payment processed → request retried seamlessly
```

### Server-Side Verification
```typescript
import { StakefyX402Client } from 'x402-stakefy-sdk';

const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'mainnet-beta'
});

// Verify on-chain payment
const isValid = await client.verifyPayment(
  paymentSignature,
  expectedAmount,
  merchantWallet
);

if (isValid) {
  // Serve protected content
  return res.json({ data: 'Premium content' });
}
```

---

## Core Features

### Social Payments

Send payments to users by username instead of wallet addresses:
```typescript
const payment = await client.createPayment({
  amount: 1.0,
  recipient: '@username',    // Pay by social handle
  reference: 'tip-2024'
});
```

### Session Budgets

Pre-approve spending limits for seamless multi-request flows:
```typescript
const budget = await client.createSessionBudget({
  maxAmount: 10.0,           // Max 10 USDC
  duration: 3600,            // Valid for 1 hour
  merchantId: 'MERCHANT_WALLET'
});

// Client makes multiple requests without re-approving each payment
```

### Payment Channels

Enable recurring payments with pre-authorized channels:
```typescript
const channel = await client.createPaymentChannel({
  amount: 5.0,
  frequency: 'daily',
  recipient: 'MERCHANT_WALLET',
  duration: 30               // 30 days
});
```

---

## React Integration

### Payment Button Component
```typescript
import { PaymentButton } from 'x402-stakefy-react';

function CheckoutPage() {
  return (
    <PaymentButton
      amount={0.5}
      merchantId="MERCHANT_WALLET"
      onSuccess={(signature) => console.log('Paid!', signature)}
      onError={(error) => console.error(error)}
    >
      Pay 0.5 USDC
    </PaymentButton>
  );
}
```

### usePayment Hook
```typescript
import { usePayment } from 'x402-stakefy-react';

function MyComponent() {
  const { createPayment, loading, error } = usePayment({
    network: 'mainnet-beta'
  });

  const handlePay = async () => {
    const result = await createPayment({
      amount: 1.0,
      merchantId: 'MERCHANT_WALLET'
    });
    console.log('Payment URL:', result.solanaPayUrl);
  };

  return <button onClick={handlePay}>Pay Now</button>;
}
```

---

## Express Integration

### Paywall Middleware
```typescript
import express from 'express';
import { stakefyPaywall } from 'stakefy-express';

const app = express();

app.get('/api/premium', 
  stakefyPaywall({
    amount: 0.1,
    merchantWallet: 'YOUR_WALLET'
  }),
  (req, res) => {
    res.json({ data: 'Premium content unlocked!' });
  }
);
```

### Budget Middleware
```typescript
import { stakefyBudget } from 'stakefy-express';

app.use('/api/*', stakefyBudget({
  maxAmount: 5.0,
  duration: 3600
}));
```

---

## API Reference

### StakefyX402Client
```typescript
interface StakefyX402ClientConfig {
  apiUrl: string;              // Facilitator API URL
  network: 'mainnet-beta' | 'devnet';
  wallet?: WalletAdapter;      // Optional: for auto-signing
}
```

### Methods

#### `createPayment(options)`
Creates a payment request and returns Solana Pay URL + QR code.
```typescript
interface CreatePaymentOptions {
  amount: number;              // Amount in USDC
  merchantId: string;          // Recipient wallet address
  reference?: string;          // Optional transaction reference
  recipient?: string;          // Optional: @username for social payments
}
```

#### `verifyPayment(signature, amount, merchant)`
Verifies on-chain payment transaction.
```typescript
async verifyPayment(
  signature: string,           // Transaction signature
  expectedAmount: number,      // Expected amount in USDC
  merchantWallet: string       // Merchant's wallet address
): Promise<boolean>
```

#### `createSessionBudget(options)`
Creates a session budget for multiple payments.
```typescript
interface SessionBudgetOptions {
  maxAmount: number;           // Maximum spending limit
  duration: number;            // Valid duration in seconds
  merchantId: string;          // Merchant wallet
}
```

#### `createPaymentChannel(options)`
Sets up recurring payment channel.
```typescript
interface PaymentChannelOptions {
  amount: number;              // Payment amount
  frequency: 'daily' | 'weekly' | 'monthly';
  recipient: string;           // Recipient wallet
  duration: number;            // Channel duration in days
}
```

---

## Examples

### Next.js API Route
```typescript
// pages/api/content.ts
import { StakefyX402Client } from 'x402-stakefy-sdk';

export default async function handler(req, res) {
  const client = new StakefyX402Client({
    apiUrl: process.env.STAKEFY_API_URL,
    network: 'mainnet-beta'
  });

  const paymentHeader = req.headers['x-payment'];
  
  if (!paymentHeader) {
    const payment = await client.createPayment({
      amount: 0.1,
      merchantId: process.env.MERCHANT_WALLET
    });
    
    return res.status(402).json({
      error: 'Payment Required',
      paymentUrl: payment.solanaPayUrl
    });
  }

  const isValid = await client.verifyPayment(
    paymentHeader,
    0.1,
    process.env.MERCHANT_WALLET
  );

  if (!isValid) {
    return res.status(402).json({ error: 'Invalid payment' });
  }

  return res.json({ data: 'Premium content here' });
}
```

### React App with Auto-402
```typescript
// App.tsx
import { auto } from 'x402-stakefy-sdk';
import { useWallet } from '@solana/wallet-adapter-react';

function App() {
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connected) {
      auto({
        wallet: wallet,
        network: 'mainnet-beta'
      });
    }
  }, [wallet.connected]);

  return <YourApp />;
}
```

---

## Network Configuration

### Mainnet
```typescript
const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'mainnet-beta'
});
```

### Devnet
```typescript
const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'devnet'
});
```

---

## Error Handling
```typescript
try {
  const payment = await client.createPayment({
    amount: 0.1,
    merchantId: 'WALLET'
  });
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('User has insufficient USDC');
  } else if (error.code === 'PAYMENT_REJECTED') {
    console.error('User rejected payment');
  } else {
    console.error('Payment failed:', error.message);
  }
}
```

---

## Package Ecosystem

| Package | Description | NPM |
|---------|-------------|-----|
| **x402-stakefy-sdk** | Core SDK (this package) | [![npm](https://img.shields.io/npm/v/x402-stakefy-sdk)](https://npmjs.com/package/x402-stakefy-sdk) |
| **x402-stakefy-react** | React hooks & components | [![npm](https://img.shields.io/npm/v/x402-stakefy-react)](https://npmjs.com/package/x402-stakefy-react) |
| **stakefy-express** | Express middleware | [![npm](https://img.shields.io/npm/v/stakefy-express)](https://npmjs.com/package/stakefy-express) |

---

## Resources

- **Live Demo:** https://stakefy-x402-demo-1twf7cczm-jasper-soes-projects.vercel.app
- **Full Documentation:** https://github.com/JaspSoe/stakefy-x402
- **API Reference:** https://github.com/JaspSoe/stakefy-x402/blob/main/API.md
- **Examples:** https://github.com/JaspSoe/stakefy-x402/tree/main/examples
- **Twitter:** [@stakefy](https://twitter.com/stakefy)
- **Email:** sayhello@stakefy.io

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](https://github.com/JaspSoe/stakefy-x402/blob/main/CONTRIBUTING.md) for guidelines.

---

## License

MIT © Stakefy

---

**Built with ❤️ by the Stakefy team**
