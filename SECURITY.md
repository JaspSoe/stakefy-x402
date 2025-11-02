# Security Policy

## 🔒 Overview

Stakefy x402 takes security seriously. This document outlines our security model, potential threats, mitigations, and responsible disclosure process.

## 🚨 Reporting Security Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

**Email:** sayhello@stakefy.io  
**Twitter DM:** [@stakefy](https://twitter.com/stakefy)  
**Response Time:** Within 24 hours

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

### Bug Bounty

We appreciate responsible disclosure and will acknowledge all valid reports:
- **Critical:** Public recognition + potential reward
- **High/Medium:** Public recognition
- **Low:** Acknowledgment

## 🎯 Threat Model

### 1. Payment Security

#### Threats

| Threat | Impact | Likelihood |
|--------|--------|------------|
| **Double-spending** | User pays twice for same item | Medium |
| **Payment replay** | Attacker reuses old payment | Medium |
| **Amount manipulation** | Changed payment amount | High |
| **Recipient swapping** | Payment sent to wrong address | High |

#### Mitigations

✅ **Transaction Verification**
- All payments verified on-chain
- Signature validation required
- Amount/recipient validation before execution

✅ **Idempotency Keys**
- Unique payment IDs prevent double-processing
- Facilitator tracks processed transactions
- Duplicate requests return original response

✅ **Time-bound Requests**
- Payment requests expire (default: 5 minutes)
- Timestamps validated to prevent replay attacks
- Session tokens have expiration
```typescript
// Example: Secure payment creation
const payment = await client.createPayment({
  amount: 0.1,
  recipient: merchantAddress,
  memo: `order-${orderId}`, // Unique identifier
  // Expires automatically after 5 minutes
});
```

### 2. Session Security

#### Threats

| Threat | Impact | Likelihood |
|--------|--------|------------|
| **Session hijacking** | Attacker uses stolen session | Medium |
| **Budget bypass** | Exceed session spending limits | Low |
| **Session fixation** | Attacker forces known session ID | Low |

#### Mitigations

✅ **Cryptographic Session IDs**
- Generated using crypto.randomUUID()
- 128-bit entropy, collision-resistant
- Not predictable or enumerable

✅ **Budget Enforcement**
- Server-side budget tracking
- Cannot be manipulated client-side
- Fails-closed on budget exceeded

✅ **Session Isolation**
- Each session bound to specific wallet
- Cannot transfer sessions between wallets
- Sessions invalidated on wallet disconnect
```typescript
// Secure session with budget
const session = await client.createBudgetSession({
  budget: 1.0,        // Max 1 SOL
  duration: 3600,     // 1 hour
  merchant: merchantId
});

// Budget enforced server-side
await client.budgetPayment(session.sessionId, { amount: 0.1 });
```

### 3. Wallet Security

#### Threats

| Threat | Impact | Likelihood |
|--------|--------|------------|
| **Private key exposure** | Complete wallet compromise | Critical |
| **Phishing signatures** | User signs malicious transaction | High |
| **Unauthorized transactions** | Wallet exploited by malware | Medium |

#### Mitigations

✅ **No Private Key Handling**
- SDK never touches private keys
- All signing done in user's wallet
- Wallet adapters handle key management

✅ **Clear Transaction Display**
- Amount and recipient shown before signing
- Human-readable memos
- No blind signing

✅ **User Confirmation Required**
- Every transaction requires explicit approval
- No auto-signing
- Users see exactly what they're signing

**NEVER DO THIS:**
```typescript
// ❌ DANGEROUS - Never expose private keys
const keypair = Keypair.fromSecretKey(privateKey);
```

**DO THIS:**
```typescript
// ✅ SAFE - Let wallet handle signing
const signature = await wallet.signTransaction(transaction);
```

### 4. API Security

#### Threats

| Threat | Impact | Likelihood |
|--------|--------|------------|
| **Rate limit abuse** | DoS on facilitator | High |
| **Data injection** | SQL/NoSQL injection | Low |
| **MITM attacks** | Intercept API requests | Medium |

#### Mitigations

✅ **Rate Limiting**
- 100 requests/minute per IP
- Progressive backoff on violations
- `retryAfter` header for 429 responses

✅ **Input Validation**
- Zod schemas validate all inputs
- Type checking at runtime
- Sanitization of user inputs

✅ **HTTPS Only**
- All API communication over TLS 1.3
- Certificate pinning recommended
- No plaintext communication

✅ **CORS Protection**
- Configurable allowed origins
- Credentials not included by default
- Preflight request validation

### 5. Smart Contract Security

#### Threats

| Threat | Impact | Likelihood |
|--------|--------|------------|
| **Reentrancy** | Drain contract funds | Low |
| **Integer overflow** | Incorrect calculations | Low |
| **Access control bypass** | Unauthorized actions | Low |

#### Mitigations

✅ **No Custom Contracts (Yet)**
- Currently using native Solana transfers
- No custom program deployment
- Future contracts will be audited

✅ **When We Add Contracts:**
- Professional security audit required
- Open source for community review
- Bug bounty program
- Gradual rollout with small limits

### 6. Username System Security

#### Threats

| Threat | Impact | Likelihood |
|--------|--------|------------|
| **Username squatting** | Impersonation | Medium |
| **Typosquatting** | Phishing attacks | High |
| **Account takeover** | Stolen username | Medium |

#### Mitigations

✅ **Wallet-bound Usernames**
- Each username tied to one wallet
- Cannot transfer without authorization
- Wallet signature required for changes

✅ **Verification System**
- Verified badges for known merchants
- Social media linking
- Domain verification

✅ **Similarity Detection**
- Prevent confusable characters (l vs 1, O vs 0)
- Block homograph attacks
- Case-insensitive uniqueness

### 7. Payment Channel Security

#### Threats

| Threat | Impact | Likelihood |
|--------|--------|------------|
| **Channel state manipulation** | Steal channel funds | Medium |
| **Early channel closure** | Loss of off-chain payments | Low |
| **Dispute exploitation** | Fraudulent dispute claims | Low |

#### Mitigations

✅ **Cryptographic State Updates**
- Each state signed by both parties
- Sequence numbers prevent replay
- Latest state always wins

✅ **Unilateral Closure**
- Either party can close channel
- Challenge period for disputes
- Final state settled on-chain

✅ **Balance Proofs**
- Merkle proofs for channel state
- Cannot forge balance updates
- Verifiable on-chain

## �� Best Practices for Developers

### 1. Never Store Private Keys
```typescript
// ❌ NEVER
localStorage.setItem('privateKey', secretKey);

// ✅ ALWAYS use wallet adapters
import { useWallet } from '@solana/wallet-adapter-react';
```

### 2. Validate All Inputs
```typescript
// ✅ Use Zod schemas
import { PaymentRequestSchema } from 'x402-stakefy-sdk';

const validated = PaymentRequestSchema.parse(userInput);
```

### 3. Handle Errors Properly
```typescript
// ✅ Don't expose internal errors to users
try {
  await payment();
} catch (error) {
  const stakefyError = handleStakefyError(error);
  // Show stakefyError.userMessage to user
  // Log stakefyError.toJSON() to server
}
```

### 4. Use Environment Variables
```typescript
// ❌ NEVER hardcode API keys
const client = new StakefyX402Client({
  apiKey: 'sk_live_abc123'
});

// ✅ Use environment variables
const client = new StakefyX402Client({
  apiKey: process.env.STAKEFY_API_KEY
});
```

### 5. Implement CSRF Protection
```typescript
// ✅ Verify request origin
app.use((req, res, next) => {
  const origin = req.get('origin');
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).send('Forbidden');
  }
  next();
});
```

## 🔍 Security Audits

### Current Status

- **Code Review:** Ongoing
- **External Audit:** Planned for Q1 2026
- **Penetration Testing:** Planned
- **Bug Bounty:** Active (report via email)

### Audit History

_No formal audits yet. Coming soon!_

## 📊 Security Metrics

We track:
- Failed authentication attempts
- Rate limit violations
- Invalid signature submissions
- Payment fraud attempts
- Session hijacking attempts

## 🛠️ Incident Response

### In Case of Security Incident

1. **Containment** - Immediate threat mitigation
2. **Assessment** - Impact analysis
3. **Communication** - Notify affected users
4. **Remediation** - Deploy fixes
5. **Post-mortem** - Public report

### Past Incidents

_No security incidents to date._ 🎉

## ✅ Security Checklist for Integrations

Before going to production:

- [ ] Use HTTPS only
- [ ] Validate all user inputs
- [ ] Never expose private keys
- [ ] Implement rate limiting
- [ ] Set up error monitoring
- [ ] Use environment variables
- [ ] Enable CORS protection
- [ ] Test with small amounts first
- [ ] Monitor for unusual activity
- [ ] Have incident response plan

## 📚 Additional Resources

- [Solana Security Best Practices](https://docs.solana.com/developing/programming-model/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web3 Security Library](https://github.com/Quillhash/Web3-Security-Library)

## 🤝 Security Contact

For security concerns:
- Email: sayhello@stakefy.io
- Twitter: [@stakefy](https://twitter.com/stakefy)
- GitHub: [Security Advisories](https://github.com/JaspSoe/stakefy-x402/security/advisories)

---

**Last Updated:** November 2, 2025  
**Version:** 1.0
