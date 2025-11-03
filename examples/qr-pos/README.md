# QR Code POS System with Stakefy x402

Point-of-sale system with QR code payments.

## Features
- Generate payment QR codes
- Mobile wallet scanning
- Real-time payment verification
- Receipt generation

## Usage
```typescript
const payment = await client.createPayment({
  amount: 5.00,
  merchantId: MERCHANT_WALLET,
  reference: `order-${Date.now()}`
});

console.log(payment.qrCode); // Display QR code
console.log(payment.solanaPayUrl); // Solana Pay URL
```

## Demo
Coming soon - Full POS terminal with QR display.
