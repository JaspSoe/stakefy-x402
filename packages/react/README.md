# x402-stakefy-react

🚀 **React hooks for Stakefy x402 payments** - Better than PayAI, 100% open source.

## Installation
```bash
npm install x402-stakefy-react x402-stakefy-sdk
```

## Quick Start
```tsx
import { StakefyProvider, StakefyX402Client } from 'x402-stakefy-react';

// Create client
const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'devnet',
});

// Wrap your app
function App() {
  return (
    <StakefyProvider client={client}>
      <YourApp />
    </StakefyProvider>
  );
}
```

## Hooks

### useStakefyPayment
```tsx
import { useStakefyClient, useStakefyPayment } from 'x402-stakefy-react';

function PaymentButton() {
  const client = useStakefyClient();
  const { createPayment, loading, error, payment } = useStakefyPayment({ client });

  const handlePay = async () => {
    const result = await createPayment({
      amount: 10,
      merchantId: 'merchant-123',
      reference: 'order-456',
    });
    
    console.log(result.qrCode); // Display QR code
    console.log(result.solanaPayUrl); // Solana Pay URL
  };

  return (
    <button onClick={handlePay} disabled={loading}>
      {loading ? 'Processing...' : 'Pay 10 USDC'}
    </button>
  );
}
```

### useSessionBudget
```tsx
import { useStakefyClient, useSessionBudget } from 'x402-stakefy-react';

function BudgetPayments() {
  const client = useStakefyClient();
  const { createBudget, makeBudgetPayment, budget, loading } = useSessionBudget({ client });

  const setupBudget = async () => {
    await createBudget({
      amount: 100,
      duration: 3600, // 1 hour
      userPublicKey: 'user-wallet-address',
      merchantId: 'merchant-123',
    });
  };

  const pay = async () => {
    // No wallet popup!
    await makeBudgetPayment({
      budgetId: budget!.budgetId,
      amount: 5,
      reference: 'purchase-1',
    });
  };

  return (
    <div>
      {!budget ? (
        <button onClick={setupBudget}>Create Budget</button>
      ) : (
        <>
          <p>Remaining: {budget.remainingAmount} USDC</p>
          <button onClick={pay} disabled={loading}>
            Pay 5 USDC (No Popup!)
          </button>
        </>
      )}
    </div>
  );
}
```

### useUsername
```tsx
import { useStakefyClient, useUsername } from 'x402-stakefy-react';

function UsernamePayment() {
  const client = useStakefyClient();
  const { registerUsername, payToUsername, getUserProfile, profile, loading } = useUsername({ client });

  const register = async () => {
    await registerUsername({
      username: 'alice',
      publicKey: 'wallet-address',
    });
  };

  const pay = async () => {
    await payToUsername({
      username: 'alice',
      amount: 25,
      reference: 'tip-001',
    });
  };

  return (
    <div>
      <button onClick={register}>Register @username</button>
      <button onClick={pay}>Pay to @alice</button>
      {profile && <p>Reputation: {profile.reputation}</p>}
    </div>
  );
}
```

### usePaymentChannel
```tsx
import { useStakefyClient, usePaymentChannel } from 'x402-stakefy-react';

function MicroPayments() {
  const client = useStakefyClient();
  const { createChannel, makeChannelPayment, settleChannel, channel, loading } = usePaymentChannel({ client });

  const openChannel = async () => {
    await createChannel({
      depositAmount: 100,
      duration: 86400, // 24 hours
      userPublicKey: 'user-wallet',
      merchantId: 'merchant-123',
    });
  };

  const payOffChain = async () => {
    // Instant, no blockchain tx!
    await makeChannelPayment({
      channelId: channel!.channelId,
      amount: 1,
      nonce: 1,
      signature: 'signed-data',
      reference: 'micro-tx-1',
    });
  };

  const settle = async () => {
    // Batch 100 payments into 1 blockchain tx
    await settleChannel(channel!.channelId, 'merchant-wallet');
  };

  return (
    <div>
      {!channel ? (
        <button onClick={openChannel}>Open Channel</button>
      ) : (
        <>
          <p>Balance: {channel.remainingBalance} USDC</p>
          <button onClick={payOffChain}>Pay 1 USDC (Off-Chain)</button>
          <button onClick={settle}>Settle On-Chain</button>
        </>
      )}
    </div>
  );
}
```

## Features

✅ **useStakefyPayment** - Create and verify payments  
✅ **useSessionBudget** - Pre-approved spending (no popups!)  
✅ **useUsername** - Pay to @username instead of addresses  
✅ **usePaymentChannel** - Off-chain micro-payments  
✅ **Full TypeScript support**  
✅ **Automatic state management**  
✅ **Error handling built-in**

## Why Stakefy React Hooks?

- 🎣 **Modern React patterns** - Hooks-first API
- 🔄 **Auto state sync** - No manual state management
- 💪 **TypeScript native** - Full type safety
- ⚡ **0.1% fees** (vs PayAI's 1-2%)
- 🚀 **Better DX** - Cleaner than PayAI's API

## Links

- 📦 [Core SDK](https://npmjs.com/package/x402-stakefy-sdk)
- 🔗 [GitHub](https://github.com/JaspSoe/stakefy-x402)
- 📖 [Documentation](https://docs.stakefy.io)

## License

MIT - Built with ❤️ by the Stakefy team
