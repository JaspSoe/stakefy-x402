# Stakefy x402 Webhook Demo

Complete example of using webhooks with Stakefy x402 payment system.

## Features

- ✅ Real-time payment notifications
- ✅ Automatic retries (3 attempts with exponential backoff)
- ✅ Signature verification
- ✅ Event types: payment.created, payment.completed, payment.failed
- ✅ Auto-settlement on completion

## Quick Start

### 1. Start the webhook server
```bash
npm install
npm start
```

Server runs on http://localhost:4000

### 2. Expose to internet (for testing)
```bash
# Install ngrok if you don't have it
brew install ngrok  # or download from ngrok.com

# Expose your local server
ngrok http 4000
```

Copy your ngrok URL (e.g., `https://abc123.ngrok.io`)

### 3. Test webhook flow
```bash
# Set your ngrok URL
export WEBHOOK_URL=https://abc123.ngrok.io/webhooks/stakefy

# Run test
npm test
```

## Webhook Events

### payment.created
Sent when a new payment session is created.
```json
{
  "event": "payment.created",
  "sessionId": "uuid",
  "merchantId": "your_merchant_id",
  "amount": 10,
  "feeAmount": 0.01,
  "status": "pending",
  "timestamp": "2024-01-01T00:00:00Z",
  "depositAddress": "solana_address"
}
```

### payment.completed
Sent when payment is verified on-chain.
```json
{
  "event": "payment.completed",
  "sessionId": "uuid",
  "merchantId": "your_merchant_id",
  "amount": 10,
  "feeAmount": 0.01,
  "status": "completed",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### payment.failed
Sent when payment fails or expires.
```json
{
  "event": "payment.failed",
  "sessionId": "uuid",
  "merchantId": "your_merchant_id",
  "amount": 10,
  "feeAmount": 0.01,
  "status": "failed",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Headers

All webhooks include these headers:

- `Content-Type: application/json`
- `X-Stakefy-Event: payment.created|payment.completed|payment.failed`
- `X-Stakefy-Signature: base64_signature`

## Signature Verification
```typescript
import { StakefyX402Merchant } from 'stakefy-x402-merchant';

const merchant = new StakefyX402Merchant({...});

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-stakefy-signature'];
  const event = merchant.parseWebhook(req.body, signature);
  
  // Event is verified and safe to use
  console.log('Event:', event.event);
});
```

## Production Best Practices

1. **Always verify signatures** - Prevent webhook spoofing
2. **Use HTTPS** - Secure webhook endpoint
3. **Return 200 quickly** - Process async to avoid timeouts
4. **Handle retries** - System retries 3 times with backoff
5. **Log everything** - Debug webhook issues easily
6. **Idempotency** - Handle duplicate webhooks gracefully

## Example: E-commerce Integration
```typescript
app.post('/webhooks/stakefy', async (req, res) => {
  const event = merchant.parseWebhook(req.body, req.headers['x-stakefy-signature']);
  
  // Respond quickly
  res.json({ received: true });
  
  // Process async
  if (event.event === 'payment.completed') {
    // Settle payment
    await merchant.settlePayment(event.sessionId);
    
    // Update order status
    await db.orders.update({
      reference: event.sessionId,
      status: 'paid'
    });
    
    // Send confirmation email
    await sendEmail({
      to: customer.email,
      subject: 'Payment confirmed!',
      body: `Your order is confirmed. Amount: $${event.amount}`
    });
    
    // Fulfill order
    await fulfillOrder(event.sessionId);
  }
});
```

## Testing Without ngrok

You can test webhooks locally using the facilitator's test endpoint:
```bash
curl -X POST http://localhost:3000/api/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment.completed",
    "sessionId": "test-123",
    "merchantId": "demo",
    "amount": 10,
    "feeAmount": 0.01,
    "status": "completed",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'
```

## Links

- [Main Documentation](https://github.com/JaspSoe/stakefy-x402)
- [Client SDK](https://www.npmjs.com/package/stakefy-x402-client)
- [Merchant SDK](https://www.npmjs.com/package/stakefy-x402-merchant)
