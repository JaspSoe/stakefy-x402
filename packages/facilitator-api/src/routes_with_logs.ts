// Add these console.log statements to your existing routes.ts

// In /payment/create endpoint (around line where you validate inputs):
console.log('💰 NEW PAYMENT REQUEST:', {
  merchant: merchantId,
  amount: `${amount} USDC`,
  reference,
  timestamp: new Date().toISOString()
});

// In /payment/verify endpoint (after isPaid check succeeds):
console.log('✅ PAYMENT VERIFIED:', {
  sessionId,
  amount: `${session.amount} USDC`,
  merchant: session.merchantId,
  depositAddress: session.depositAddress,
  timestamp: new Date().toISOString()
});

// Add this to the webhook success block:
console.log('📨 WEBHOOK SENT:', {
  url: session.webhookUrl,
  event: 'payment.completed',
  sessionId
});
