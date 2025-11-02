# Stakefy x402 Client SDK

Client SDK for Stakefy x402 - The best Solana payment facilitator with only 0.1% fees.

## Installation
```bash
npm install stakefy-x402-client
```

## Quick Start
```typescript
import { StakefyX402Client } from 'stakefy-x402-client';
import { Keypair } from '@solana/web3.js';

// Initialize client
const client = new StakefyX402Client({
  facilitatorUrl: 'https://stakefy-x402-production.up.railway.app',
  merchantId: 'your_merchant_id'
});

// Create payment session
const session = await client.createPayment({
  amount: 10,           // 10 USDC
  reference: 'order_123'
});

console.log('Pay to:', session.depositAddress);
console.log('Amount:', session.amount + session.feeAmount, 'USDC');

// Pay with wallet
const payerWallet = Keypair.fromSecretKey(/* your key */);
const signature = await client.payWithWallet(session, payerWallet);

// Verify payment
const status = await client.verifyPayment(session.sessionId);
console.log('Payment status:', status.isPaid ? 'Completed' : 'Pending');
```

## Features

- ✅ **0.1% fees** (10x cheaper than competitors)
- ✅ USDC payments on Solana
- ✅ Simple API
- ✅ TypeScript support
- ✅ Automatic retries

## API Reference

### `createPayment(options)`

Create a new payment session.

**Parameters:**
- `amount` (number): Payment amount in USDC
- `reference` (string): Your order/transaction reference
- `metadata` (object, optional): Additional data

**Returns:** Payment session with deposit address

### `payWithWallet(session, payerKeypair)`

Send payment from a Solana wallet.

**Parameters:**
- `session`: Payment session from createPayment
- `payerKeypair`: Solana keypair with USDC

**Returns:** Transaction signature

### `verifyPayment(sessionId)`

Check payment status.

**Parameters:**
- `sessionId`: Session ID from createPayment

**Returns:** Payment status and verification

### `getPaymentStatus(sessionId)`

Get full payment session details.

## Links

- [GitHub](https://github.com/JaspSoe/stakefy-x402)
- [Documentation](https://github.com/JaspSoe/stakefy-x402#readme)
- [Live API](https://stakefy-x402-production.up.railway.app)
- [Merchant SDK](https://www.npmjs.com/package/stakefy-x402-merchant)

## License

MIT
