import { useState, useCallback } from 'react';
import { StakefyX402Client, BudgetRequest, BudgetResponse, BudgetPaymentRequest } from 'x402-stakefy-sdk';

export interface UseSessionBudgetOptions {
  client: StakefyX402Client;
}

export function useSessionBudget({ client }: UseSessionBudgetOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [budget, setBudget] = useState<BudgetResponse | null>(null);

  const createBudget = useCallback(
    async (request: BudgetRequest) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.createBudget(request);
        setBudget(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Budget creation failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const makeBudgetPayment = useCallback(
    async (request: BudgetPaymentRequest) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.makeBudgetPayment(request);
        
        // Refresh budget status after payment
        if (budget?.budgetId) {
          const updatedBudget = await client.getBudgetStatus(budget.budgetId);
          setBudget(updatedBudget);
        }
        
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Budget payment failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client, budget]
  );

  const getBudgetStatus = useCallback(
    async (budgetId: string) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.getBudgetStatus(budgetId);
        setBudget(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get budget status';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  return {
    loading,
    error,
    budget,
    createBudget,
    makeBudgetPayment,
    getBudgetStatus,
  };
}
