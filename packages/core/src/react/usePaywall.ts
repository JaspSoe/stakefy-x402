import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { StakefyX402Client } from '../client';
import type { PaymentResponse } from '../types';

export interface PaywallConfig {
  contentId: string;
  amount: number;
  merchantId: string;
  title?: string;
  description?: string;
  apiUrl?: string;
}

export interface PaywallState {
  hasAccess: boolean;
  loading: boolean;
  paying: boolean;
  error: Error | null;
  payment: PaymentResponse | null;
  unlock: () => Promise<void>;
  checkAccess: () => Promise<boolean>;
}

interface StoredPayment {
  sessionId: string;
  signature: string;
  timestamp: number;
  contentId: string;
}

export function usePaywall(config: PaywallConfig): PaywallState {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);

  const client = new StakefyX402Client({
    apiUrl: config.apiUrl || 'https://stakefy-x402-production.up.railway.app',
    network: 'mainnet-beta',
  });

  const getStorageKey = useCallback(() => {
    if (!wallet.publicKey) return null;
    return `stakefy_paywall_${config.contentId}_${wallet.publicKey.toBase58()}`;
  }, [config.contentId, wallet.publicKey]);

  const checkAccess = useCallback(async (): Promise<boolean> => {
    try {
      const storageKey = getStorageKey();
      if (!storageKey) return false;

      const storedPayment = localStorage.getItem(storageKey);
      if (storedPayment) {
        const paymentData: StoredPayment = JSON.parse(storedPayment);
        
        if (paymentData.signature && paymentData.contentId === config.contentId) {
          setHasAccess(true);
          return true;
        }
      }

      return false;
    } catch (err) {
      console.error('Error checking access:', err);
      return false;
    }
  }, [getStorageKey, config.contentId]);

  const unlock = useCallback(async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError(new Error('Wallet not connected'));
      return;
    }

    try {
      setPaying(true);
      setError(null);

      const paymentResponse = await client.createPayment({
        amount: config.amount,
        merchantId: config.merchantId,
        reference: `unlock_${config.contentId}_${Date.now()}`,
        metadata: {
          contentId: config.contentId,
          title: config.title,
        },
      });

      setPayment(paymentResponse);

      const storedPayment: StoredPayment = {
        sessionId: paymentResponse.sessionId,
        signature: 'pending',
        timestamp: Date.now(),
        contentId: config.contentId,
      };

      const storageKey = getStorageKey();
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(storedPayment));
      }

      setHasAccess(true);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setPaying(false);
    }
  }, [wallet, connection, client, config, getStorageKey]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await checkAccess();
      setLoading(false);
    };

    init();
  }, [checkAccess]);

  return {
    hasAccess,
    loading,
    paying,
    error,
    payment,
    unlock,
    checkAccess,
  };
}
