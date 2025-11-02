import { useState, useCallback } from 'react';
import { StakefyX402Client, ChannelRequest, ChannelResponse, ChannelPaymentRequest } from 'x402-stakefy-sdk';

export interface UsePaymentChannelOptions {
  client: StakefyX402Client;
}

export function usePaymentChannel({ client }: UsePaymentChannelOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<ChannelResponse | null>(null);

  const createChannel = useCallback(
    async (request: ChannelRequest) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.createChannel(request);
        setChannel(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Channel creation failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const makeChannelPayment = useCallback(
    async (request: ChannelPaymentRequest) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.makeChannelPayment(request);
        
        // Refresh channel status after payment
        if (channel?.channelId) {
          const updatedChannel = await client.getChannelStatus(channel.channelId);
          setChannel(updatedChannel);
        }
        
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Channel payment failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client, channel]
  );

  const settleChannel = useCallback(
    async (channelId: string, merchantAddress: string) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.settleChannel(channelId, merchantAddress);
        
        // Refresh channel status after settlement
        const updatedChannel = await client.getChannelStatus(channelId);
        setChannel(updatedChannel);
        
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Channel settlement failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const getChannelStatus = useCallback(
    async (channelId: string) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await client.getChannelStatus(channelId);
        setChannel(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get channel status';
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
    channel,
    createChannel,
    makeChannelPayment,
    settleChannel,
    getChannelStatus,
  };
}
