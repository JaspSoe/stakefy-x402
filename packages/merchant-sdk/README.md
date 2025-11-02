# Stakefy x402 Merchant SDK

Merchant SDK for Stakefy x402 - Accept Solana payments with only 0.1% fees.

## Installation
```bash
npm install stakefy-x402-merchant
```

## Quick Start
```typescript
import { StakefyX402Merchant } from 'stakefy-x402-merchant';

// Initialize merchant
const merchant = new StakefyX402Merchant({
  facilitatorUrl: 'https://stakefy-x402-production.up.railway.app',
  merchantId: 'your_merchant_id',
  merchantWallet: 'your_solana_wallet_address'
});

// Check payment status
const status = await merchant.getPaymentStatus(sessionId);
console.log('Status:', status.status);
console.log('Amount:', status.amount, 'USDC');

// Verify payment completion
const verification = await merchant.verifyPayment(sessionId);
if (verification.isPaid) {
  // Payment confirmed! Deliver goods/services
}

// Settle payment to your wallet
const result = await merchant.settlePayment(sessionId);
console.log('Settled! TX:', result.signature);
console.log('Received:', result.merchantAmount, 'USDC');

// Poll until payment completes (optional)
const completedSession = await merchant.pollPaymentUntilComplete(sessionId, {
  maxAttempts: 60,    // Try for 2 minutes
  intervalMs: 2000    // Check every 2 seconds
});
```

## Features

- ✅ **0.1% fees** (10x cheaper than competitors)
- ✅ Real-time payment verification
- ✅ Automatic settlement
- ✅ Poll for completion
- ✅ TypeScript support

## API Reference

### `getPaymentStatus(sessionId)`

Get current payment session details.

**Returns:** Full session object with status

### `verifyPayment(sessionId)`

Verify if payment has been completed.

**Returns:** Verification result with isPaid boolean

### `settlePayment(sessionId)`

Settle completed payment to your wallet.

**Returns:** Transaction signature and amounts

### `pollPaymentUntilComplete(sessionId, options)`

Wait for payment to complete.

**Parameters:**
- `maxAttempts`: Maximum number of checks (default: 60)
- `intervalMs`: Milliseconds between checks (default: 2000)

**Returns:** Completed session

## Integration Example
```typescript
// Express.js webhook endpoint
app.post('/payment/webhook', async (req, res) => {
  const { sessionId } = req.body;
  
  // Verify payment
  const verification = await merchant.verifyPayment(sessionId);
  
  if (verification.isPaid) {
    // Settle to your wallet
    await merchant.settlePayment(sessionId);
    
    // Fulfill order
    await fulfillOrder(sessionId);
  }
  
  res.json({ success: true });
});
```

## Links

- [GitHub](https://github.com/JaspSoe/stakefy-x402)
- [Documentation](https://github.com/JaspSoe/stakefy-x402#readme)
- [Live API](https://stakefy-x402-production.up.railway.app)
- [Client SDK](https://www.npmjs.com/package/stakefy-x402-client)

## License

MIT
