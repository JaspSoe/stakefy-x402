import { useState, useCallback } from 'react';
import { StakefyX402Client, PaymentRequest, PaymentResponse } from 'x402-stakefy-sdk';

export interface UseStakefyPaymentOptions {
  client: StakefyX402Client;
}

export function useStakefyPayment({ client }: UseStakefyPaymentOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);

  const createPayment = useCallback(
    async (request: PaymentRequest) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.createPayment(request);
        setPayment(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment creation failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const verifyPayment = useCallback(
    async (sessionId: string) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.verifyPayment(sessionId);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const getPaymentStatus = useCallback(
    async (sessionId: string) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.getPaymentStatus(sessionId);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get payment status';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const pollPayment = useCallback(
    async (sessionId: string, options?: { maxAttempts?: number; intervalMs?: number }) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.pollPaymentUntilComplete(sessionId, options);
        setPayment(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment polling failed';
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
    payment,
    createPayment,
    verifyPayment,
    getPaymentStatus,
    pollPayment,
  };
}
