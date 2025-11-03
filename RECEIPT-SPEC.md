# Stakefy x402 Receipt Specification v1.0

## Overview

Stakefy's receipt system provides **cryptographic proof of payment** with deterministic verification. Unlike competitors, our receipts are:

1. **Deterministic** - Same input = same proof hash
2. **On-chain verified** - Every receipt validated against Solana blockchain
3. **Tamper-proof** - SHA-256 hash prevents modification
4. **Enterprise-grade** - Session state tracking for compliance

---

## Receipt Structure
```typescript
interface PaymentReceipt {
  signature: string;      // Solana transaction signature
  amount: number;          // Amount paid in USDC
  merchant: string;        // Merchant wallet address
  payer: string;           // Payer wallet address
  timestamp: number;       // Unix timestamp (seconds)
  reference: string;       // Payment reference ID
  blockHeight: number;     // Solana block height
  proof: string;           // SHA-256 deterministic proof
  verified: boolean;       // On-chain verification status
}
```

---

## Proof Generation Algorithm

The proof is a **SHA-256 hash** of concatenated payment data:
```typescript
function generateProof(receipt): string {
  const data = [
    receipt.signature,
    receipt.amount.toString(),
    receipt.merchant,
    receipt.payer,
    receipt.timestamp.toString(),
    receipt.reference,
    receipt.blockHeight.toString()
  ].join('|');
  
  return sha256(data);
}
```

### Example
```typescript
Input:
  signature: "5xKm...abc"
  amount: 0.1
  merchant: "7xKX...ABC"
  payer: "9yPQ...XYZ"
  timestamp: 1699123456
  reference: "order-123"
  blockHeight: 234567890

Proof String:
  "5xKm...abc|0.1|7xKX...ABC|9yPQ...XYZ|1699123456|order-123|234567890"

SHA-256 Hash:
  "a1b2c3d4e5f6..."
```

---

## Verification Process

### 1. Single Receipt Verification
```typescript
import { verifyReceipt } from 'x402-stakefy-sdk';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');

const receipt = await verifyReceipt({
  signature: 'TRANSACTION_SIGNATURE',
  expectedAmount: 0.1,
  expectedMerchant: 'MERCHANT_WALLET',
  expectedPayer: 'PAYER_WALLET', // Optional
}, connection);

console.log(receipt.verified); // true
console.log(receipt.proof);    // SHA-256 hash
```

**Verification Steps:**
1. Fetch transaction from Solana blockchain
2. Confirm transaction success (no errors)
3. Validate payer and merchant addresses
4. Extract block height and timestamp
5. Generate deterministic proof hash
6. Return verified receipt

---

### 2. Session State Verification

For multiple payments in a session:
```typescript
import { verifySession } from 'x402-stakefy-sdk';

const session = await verifySession(
  'session-123',
  [
    { signature: 'SIG1', expectedAmount: 0.1, expectedMerchant: 'WALLET' },
    { signature: 'SIG2', expectedAmount: 0.2, expectedMerchant: 'WALLET' },
    { signature: 'SIG3', expectedAmount: 0.3, expectedMerchant: 'WALLET' },
  ],
  connection
);

console.log(session.totalPaid);           // 0.6 USDC
console.log(session.totalTransactions);   // 3
console.log(session.merchantVerified);    // true (all same merchant)
console.log(session.isValid);             // true
```

**Session State:**
```typescript
interface VerifiedSession {
  sessionId: string;
  receipts: PaymentReceipt[];
  totalPaid: number;
  totalTransactions: number;
  firstPayment: number;        // Unix timestamp
  lastPayment: number;          // Unix timestamp
  isValid: boolean;
  merchantVerified: boolean;    // All receipts same merchant
}
```

---

## Proof Validation

Validate proof integrity without blockchain query:
```typescript
import { validateProof } from 'x402-stakefy-sdk';

const isValid = validateProof(receipt);
// Returns true if proof matches recalculated hash
```

**Use cases:**
- Offline validation
- Cache verification
- Audit trails
- Compliance checks

---

## Security Properties

### 1. Tamper-Proof
Any modification to receipt data invalidates the proof:
```typescript
receipt.amount = 0.2; // Changed from 0.1
validateProof(receipt); // Returns false
```

### 2. Non-Repudiation
Receipts are tied to on-chain transactions:
```typescript
// Cannot fake a receipt without valid Solana transaction
verifyReceipt(fakeReceipt, connection); // Throws error
```

### 3. Deterministic
Same input always produces same proof:
```typescript
proof1 = generateProof(receipt);
proof2 = generateProof(receipt);
proof1 === proof2; // Always true
```

---

## Enterprise Use Cases

### 1. Compliance & Auditing
```typescript
// Generate audit trail for tax/compliance
const session = await verifySession(sessionId, receipts, connection);

const auditLog = {
  period: '2024-Q4',
  totalRevenue: session.totalPaid,
  transactionCount: session.totalTransactions,
  receipts: session.receipts.map(r => ({
    proof: r.proof,
    amount: r.amount,
    timestamp: r.timestamp
  }))
};
```

### 2. Dispute Resolution
```typescript
// Customer claims they didn't pay
const receipt = await verifyReceipt({
  signature: disputedTransaction,
  expectedAmount: 0.5,
  expectedMerchant: merchantWallet
}, connection);

if (receipt.verified) {
  // Proof of payment exists on-chain
  console.log('Payment confirmed:', receipt.proof);
}
```

### 3. Invoice Generation
```typescript
// Create verifiable invoice
const invoice = {
  invoiceId: 'INV-2024-001',
  receipts: verifiedReceipts,
  totalAmount: session.totalPaid,
  proof: session.receipts.map(r => r.proof)
};
```

---

## API Reference

### `verifyReceipt(options, connection)`
Verify single payment on-chain.

**Parameters:**
- `options.signature` - Transaction signature
- `options.expectedAmount` - Expected payment amount
- `options.expectedMerchant` - Merchant wallet address
- `options.expectedPayer` - (Optional) Payer wallet address
- `connection` - Solana connection object

**Returns:** `Promise<PaymentReceipt>`

---

### `verifySession(sessionId, receipts, connection)`
Verify multiple payments and create session state.

**Parameters:**
- `sessionId` - Session identifier
- `receipts` - Array of `ReceiptVerifyOptions`
- `connection` - Solana connection object

**Returns:** `Promise<VerifiedSession>`

---

### `generateProof(receipt)`
Generate deterministic SHA-256 proof.

**Parameters:**
- `receipt` - Receipt data (without proof/verified fields)

**Returns:** `string` (SHA-256 hash)

---

### `validateProof(receipt)`
Validate proof integrity.

**Parameters:**
- `receipt` - Full receipt with proof

**Returns:** `boolean`

---

### `createReceiptFromPayment(...)`
Create unverified receipt from payment data.

**Parameters:**
- `signature` - Transaction signature
- `amount` - Payment amount
- `merchant` - Merchant address
- `payer` - Payer address
- `reference` - Payment reference
- `blockHeight` - Block height

**Returns:** `PaymentReceipt` (verified: false)

---

## Comparison: Stakefy vs PayAI

| Feature | Stakefy | PayAI |
|---------|:-------:|:-----:|
| **Deterministic Proofs** | ✅ SHA-256 | ❌ |
| **On-chain Verification** | ✅ Full | ⚠️ Partial |
| **Session State Tracking** | ✅ Complete | ❌ |
| **Proof Validation API** | ✅ Yes | ❌ |
| **TypeScript Types** | ✅ Full | ⚠️ Partial |
| **Enterprise Audit Trail** | ✅ Yes | ❌ |

---

## Examples

See production examples:
- [Receipt Verification Demo](./examples/receipt-verification)
- [Audit Trail Generator](./examples/audit-trail)
- [Dispute Resolution](./examples/dispute-resolution)

---

## Specification Version

**Version:** 1.0  
**Date:** November 3, 2025  
**Status:** Production  
**License:** MIT

---

**This is not marketing. This is the standard.**
