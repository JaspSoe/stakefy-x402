import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { StakefyX402Client } from '../client';
import type { PaymentRequest, PaymentResponse } from '../types';

export function useStakefyPayment() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);

  const client = new StakefyX402Client({
    apiUrl: 'https://stakefy-x402-production.up.railway.app',
    network: 'mainnet-beta',
  });

  const pay = async (request: Omit<PaymentRequest, 'reference'>) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const paymentResponse = await client.createPayment({
        ...request,
        reference: `payment_${Date.now()}`,
      });

      setPayment(paymentResponse);
      return paymentResponse;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    pay,
    loading,
    error,
    payment,
    wallet,
  };
}
