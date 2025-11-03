import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { StakefyX402Client } from '../client';
import type { BudgetRequest, BudgetResponse } from '../types';

export function useSessionBudget() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [session, setSession] = useState<BudgetResponse | null>(null);

  const client = new StakefyX402Client({
    apiUrl: 'https://stakefy-x402-production.up.railway.app',
    network: 'devnet',
  });

  const createSession = async (request: Omit<BudgetRequest, 'userPublicKey'>) => {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const budgetSession = await client.createBudget({
        ...request,
        userPublicKey: wallet.publicKey.toBase58(),
      });

      setSession(budgetSession);
      return budgetSession;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSession,
    session,
    loading,
    error,
    wallet,
  };
}
