import { useState } from 'react';
import { StakefyX402Client } from '../client';
import type { UserProfile } from '../types';

export function useUsername() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const client = new StakefyX402Client({
    apiUrl: 'https://stakefy-x402-production.up.railway.app',
    network: 'mainnet-beta',
  });

  const resolveUsername = async (username: string) => {
    try {
      setLoading(true);
      setError(null);

      const userProfile = await client.getUserProfile(username);
      setProfile(userProfile);
      return userProfile;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    resolveUsername,
    profile,
    loading,
    error,
  };
}
