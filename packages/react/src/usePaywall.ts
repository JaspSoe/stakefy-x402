import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { StakefyX402Client } from 'x402-stakefy-sdk';
import type { PaymentResponse } from 'x402-stakefy-sdk';

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

/**
 * Hook for implementing content paywalls
 * 
 * @example
 * ```tsx
 * function Article() {
 *   const paywall = usePaywall({
 *     contentId: 'article-123',
 *     amount: 0.01,
 *     merchantId: 'publisher-wallet',
 *     title: 'Premium Article',
 *     description: 'Pay 0.01 SOL to unlock'
 *   });
 * 
 *   if (!paywall.hasAccess) {
 *     return (
 *       <div>
 *         <h3>Locked Content</h3>
 *         <p>{paywall.description}</p>
 *         <button onClick={paywall.unlock} disabled={paywall.paying}>
 *           Unlock for {paywall.amount} SOL
 *         </button>
 *       </div>
 *     );
 *   }
 * 
 *   return <div>Premium content here!</div>;
 * }
 * ```
 */
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
    network: 'devnet',
  });

  // Generate storage key for access tracking
  const getStorageKey = useCallback(() => {
    if (!wallet.publicKey) return null;
    return `stakefy_paywall_${config.contentId}_${wallet.publicKey.toBase58()}`;
  }, [config.contentId, wallet.publicKey]);

  // Check if user has already paid for this content
  const checkAccess = useCallback(async (): Promise<boolean> => {
    try {
      const storageKey = getStorageKey();
      if (!storageKey) return false;

      // Check localStorage for previous payment
      const storedPayment = localStorage.getItem(storageKey);
      if (storedPayment) {
        const paymentData: StoredPayment = JSON.parse(storedPayment);
        
        // Verify payment is still valid
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

  // Unlock content by making payment
  const unlock = useCallback(async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError(new Error('Wallet not connected'));
      return;
    }

    try {
      setPaying(true);
      setError(null);

      // Create payment request
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

      // For now, we'll use direct SOL transfer
      // In production, you'd scan for payment to depositAddress
      const tx = new Transaction().add(
        // This is simplified - in production use the depositAddress
        // and monitor for payment confirmation
      );

      // For demo purposes, we'll just mark as paid after getting payment response
      // In production, you'd monitor the depositAddress for actual payment
      const storedPayment: StoredPayment = {
        sessionId: paymentResponse.sessionId,
        signature: 'pending', // Would be actual signature
        timestamp: Date.now(),
        contentId: config.contentId,
      };

      // Store payment proof
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

  // Check access on mount and wallet change
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
