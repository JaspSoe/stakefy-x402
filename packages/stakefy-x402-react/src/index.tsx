import { useState, useCallback, useEffect } from 'react';
import { StakefyX402Client, PaymentSession, Budget } from 'stakefy-x402-client';
import { Keypair } from '@solana/web3.js';

export interface UseStakefyConfig {
  facilitatorUrl: string;
  merchantId: string;
}

// Hook for creating and managing payments
export function useStakefyPayment(config: UseStakefyConfig) {
  const [client] = useState(() => new StakefyX402Client(config));
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(async (amount: number, reference: string, metadata?: any) => {
    setLoading(true);
    setError(null);
    try {
      const paymentSession = await client.createPayment({
        amount,
        reference,
        metadata
      });
      setSession(paymentSession);
      return paymentSession;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client]);

  const payWithWallet = useCallback(async (keypair: Keypair) => {
    if (!session) throw new Error('No payment session');
    setLoading(true);
    setError(null);
    try {
      const signature = await client.payWithWallet(session, keypair);
      return signature;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client, session]);

  const verifyPayment = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await client.verifyPayment(sessionId);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    session,
    loading,
    error,
    createPayment,
    payWithWallet,
    verifyPayment
  };
}

// Hook for session budgets
export function useSessionBudget(config: UseStakefyConfig) {
  const [client] = useState(() => new StakefyX402Client(config));
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBudget = useCallback(async (
    amount: number,
    duration: number,
    userPublicKey: string,
    metadata?: any
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newBudget = await client.createBudget({
        amount,
        duration,
        userPublicKey,
        metadata
      });
      setBudget(newBudget);
      return newBudget;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client]);

  const payFromBudget = useCallback(async (
    budgetId: string,
    amount: number,
    reference: string,
    metadata?: any
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await client.payFromBudget({
        budgetId,
        amount,
        reference,
        metadata
      });
      // Refresh budget status
      if (budget && budget.budgetId === budgetId) {
        const updatedBudget = await client.getBudgetStatus(budgetId);
        setBudget(updatedBudget);
      }
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client, budget]);

  const refreshBudget = useCallback(async (budgetId: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBudget = await client.getBudgetStatus(budgetId);
      setBudget(updatedBudget);
      return updatedBudget;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    budget,
    loading,
    error,
    createBudget,
    payFromBudget,
    refreshBudget
  };
}

// Re-export types from client
export type { PaymentSession, Budget } from 'stakefy-x402-client';
