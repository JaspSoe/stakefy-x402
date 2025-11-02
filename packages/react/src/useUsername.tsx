import { useState, useCallback } from 'react';
import { StakefyX402Client, UsernameRequest, UserProfile, UsernamePaymentRequest } from 'x402-stakefy-sdk';

export interface UseUsernameOptions {
  client: StakefyX402Client;
}

export function useUsername({ client }: UseUsernameOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const registerUsername = useCallback(
    async (request: UsernameRequest) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.registerUsername(request);
        
        // Fetch profile after registration
        if (result.success) {
          const userProfile = await client.getUserProfile(request.username);
          setProfile(userProfile);
        }
        
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Username registration failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const getUserProfile = useCallback(
    async (username: string) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.getUserProfile(username);
        setProfile(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get user profile';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const payToUsername = useCallback(
    async (request: UsernamePaymentRequest) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.payToUsername(request);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment to username failed';
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
    profile,
    registerUsername,
    getUserProfile,
    payToUsername,
  };
}
