/**
 * Fetch interceptor for automatic x402 payment handling
 * Automatically detects 402 responses and handles payment flow
 */

import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import { StakefyX402Client } from './client';
import type { PaymentResponse } from './types';

export interface WalletAdapter {
  publicKey: { toBase58(): string } | null;
  signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
}

export interface X402FetchOptions extends RequestInit {
  wallet?: WalletAdapter;
  autoRetry?: boolean;
  maxRetries?: number;
  onPaymentRequired?: (payment: PaymentResponse) => void;
  onPaymentComplete?: (signature: string) => void;
}

export interface X402FetchConfig {
  wallet: WalletAdapter;
  client?: StakefyX402Client;
  connection?: Connection;
  autoRetry?: boolean;
  maxRetries?: number;
}

interface PaymentRequiredResponse {
  payment: PaymentResponse;
  error?: string;
  message?: string;
}

/**
 * Create an x402-aware fetch function
 * Automatically handles 402 Payment Required responses
 */
export function createX402Fetch(config: X402FetchConfig) {
  const client = config.client || StakefyX402Client.auto();
  const connection = config.connection || new Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  );

  return async function x402Fetch(
    url: string | URL,
    options: X402FetchOptions = {}
  ): Promise<Response> {
    const {
      wallet = config.wallet,
      autoRetry = config.autoRetry ?? true,
      maxRetries = config.maxRetries ?? 3,
      onPaymentRequired,
      onPaymentComplete,
      ...fetchOptions
    } = options;

    let retries = 0;
    let lastError: Error | null = null;

    while (retries < maxRetries) {
      try {
        // Make the initial request
        const response = await fetch(url, fetchOptions);

        // If not 402, return the response
        if (response.status !== 402) {
          return response;
        }

        // Handle 402 Payment Required
        const paymentData = await response.json() as PaymentRequiredResponse;
        
        if (!paymentData.payment) {
          throw new Error('Invalid 402 response: missing payment details');
        }

        // Notify about payment requirement
        if (onPaymentRequired) {
          onPaymentRequired(paymentData.payment);
        }

        // If autoRetry is false, return the 402 response
        if (!autoRetry) {
          return new Response(JSON.stringify(paymentData), {
            status: 402,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Check wallet is connected
        if (!wallet || !wallet.publicKey) {
          throw new Error('Wallet not connected for automatic payment');
        }

        // TODO: Implement automatic payment flow
        // For now, we'll simulate by adding headers
        // In production, this would:
        // 1. Create and sign transaction
        // 2. Submit to blockchain
        // 3. Wait for confirmation
        // 4. Retry request with payment proof

        const signature = 'demo-signature-' + Date.now();
        
        if (onPaymentComplete) {
          onPaymentComplete(signature);
        }

        // Retry request with payment headers
        const retryResponse = await fetch(url, {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            'X-Payment': Buffer.from(signature).toString('base64'),
            'X-Session-Id': paymentData.payment.sessionId,
          },
        });

        return retryResponse;

      } catch (error) {
        lastError = error as Error;
        retries++;
        
        if (retries >= maxRetries) {
          throw new Error(
            `X402 fetch failed after ${maxRetries} retries: ${lastError?.message}`
          );
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }

    throw lastError || new Error('X402 fetch failed');
  };
}

/**
 * Simple fetch wrapper that returns payment info for 402 responses
 */
export async function fetchWith402Detection(
  url: string | URL,
  options?: RequestInit
): Promise<{ response: Response; payment?: PaymentResponse }> {
  const response = await fetch(url, options);

  if (response.status === 402) {
    const paymentData = await response.json() as PaymentRequiredResponse;
    return {
      response,
      payment: paymentData.payment,
    };
  }

  return { response };
}

/**
 * Axios-style interceptor helper
 */
export interface X402Interceptor {
  request: (config: any) => any;
  response: (response: any) => any;
  responseError: (error: any) => any;
}

export function createX402Interceptor(config: X402FetchConfig): X402Interceptor {
  return {
    request: (requestConfig: any) => {
      // Add any pre-request modifications here
      return requestConfig;
    },
    response: (response: any) => {
      // Pass through successful responses
      return response;
    },
    responseError: async (error: any) => {
      // Handle 402 errors
      if (error.response?.status === 402) {
        // Payment required logic here
        const paymentData = error.response.data as PaymentRequiredResponse;
        
        // Could trigger payment UI or auto-payment
        console.log('Payment required:', paymentData.payment);
      }
      
      throw error;
    },
  };
}
