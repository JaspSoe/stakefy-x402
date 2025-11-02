# Stakefy x402 React

React hooks for Stakefy x402 payment protocol on Solana.

## Installation
```bash
npm install stakefy-x402-react
```

## Usage

### Payment Hook
```typescript
import { useStakefyPayment } from 'stakefy-x402-react';

function MyComponent() {
  const { session, loading, error, createPayment, payWithWallet } = useStakefyPayment({
    facilitatorUrl: 'https://stakefy-x402-production.up.railway.app',
    merchantId: 'your-merchant-id'
  });

  const handlePayment = async () => {
    const session = await createPayment(100, 'order-123');
    // Show QR code: session.qrCode
  };

  return <button onClick={handlePayment}>Pay</button>;
}
```

### Session Budget Hook
```typescript
import { useSessionBudget } from 'stakefy-x402-react';

function BudgetComponent() {
  const { budget, loading, createBudget, payFromBudget } = useSessionBudget({
    facilitatorUrl: 'https://stakefy-x402-production.up.railway.app',
    merchantId: 'your-merchant-id'
  });

  const handleCreateBudget = async () => {
    await createBudget(
      1000, // amount
      3600, // duration in seconds
      'user-public-key'
    );
  };

  const handlePayment = async () => {
    await payFromBudget(budget.budgetId, 50, 'purchase-ref');
  };

  return (
    <div>
      <button onClick={handleCreateBudget}>Create Budget</button>
      {budget && <button onClick={handlePayment}>Pay from Budget</button>}
    </div>
  );
}
```

## Features

- ✅ Easy payment creation
- ✅ Session budget management
- ✅ TypeScript support
- ✅ Built on Solana
- ✅ 0.1% fees

## License

MIT
