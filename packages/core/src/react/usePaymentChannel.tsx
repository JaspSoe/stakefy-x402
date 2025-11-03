import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { StakefyX402Client } from '../client';
import type { ChannelRequest, ChannelResponse } from '../types';

export function usePaymentChannel() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [channel, setChannel] = useState<ChannelResponse | null>(null);

  const client = new StakefyX402Client({
    apiUrl: 'https://stakefy-x402-production.up.railway.app',
    network: 'devnet',
  });

  const openChannel = async (request: Omit<ChannelRequest, 'userPublicKey'>) => {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const paymentChannel = await client.createChannel({
        ...request,
        userPublicKey: wallet.publicKey.toBase58(),
      });

      setChannel(paymentChannel);
      return paymentChannel;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    openChannel,
    channel,
    loading,
    error,
    wallet,
  };
}
