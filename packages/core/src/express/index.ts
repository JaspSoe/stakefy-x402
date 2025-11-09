import { Request, Response, NextFunction } from 'express';
import { Connection } from '@solana/web3.js';
import { StakefyX402Client } from '../client';
import { StakefyErrors, isStakefyError } from '../errors';
import { verifyPayment, extractPaymentHeader, extractSessionId } from '../verify';

export interface StakefyMiddlewareOptions {
  amount: number;
  merchantId: string;
  apiUrl?: string;
  network?: 'mainnet-beta' | 'devnet';
  description?: string;
  verifyOnChain?: boolean;  // NEW: Enable on-chain verification
  onSuccess?: (req: Request, sessionId: string) => void;
  onError?: (req: Request, error: Error) => void;
}

/**
 * Express middleware for x402 payment paywalls
 */
export function stakefyPaywall(options: StakefyMiddlewareOptions) {
  const client = new StakefyX402Client({
    apiUrl: options.apiUrl || 'https://stakefy-x402-production.up.railway.app',
    network: options.network || 'mainnet-beta',
  });

  const connection = new Connection(
    options.network === 'mainnet-beta'
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.mainnet-beta.solana.com',
    'confirmed'
  );

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract payment proof from headers
      const paymentHeader = extractPaymentHeader(req.headers);
      const sessionId = extractSessionId(req.headers);

      // If payment proof exists, verify it
      if (paymentHeader && sessionId) {
        // Option 1: On-chain verification (more secure, slower)
        if (options.verifyOnChain) {
          const verificationResult = await verifyPayment(
            paymentHeader,
            {
              amount: options.amount,
              recipient: options.merchantId,
              sessionId,
            },
            connection
          );

          if (!verificationResult.verified) {
            return res.status(402).json({
              error: 'Payment verification failed',
              message: verificationResult.error,
            });
          }
        }
        
        // Option 2: Trust the session (faster, for development)
        // In production, you should verify via facilitator or on-chain
        
        if (options.onSuccess) {
          options.onSuccess(req, sessionId);
        }
        
        return next();
      }

      // No payment proof - return 402 with payment request
      const paymentRequest = await client.createPayment({
        amount: options.amount,
        merchantId: options.merchantId,
        reference: `api_${Date.now()}`,
        metadata: {
          endpoint: req.path,
          method: req.method,
          description: options.description,
        },
      });

      // Return 402 Payment Required with payment details
      res.status(402).json({
        error: 'Payment Required',
        message: options.description || `Payment of ${options.amount} SOL required`,
        payment: {
          sessionId: paymentRequest.sessionId,
          amount: paymentRequest.amount,
          merchantId: paymentRequest.merchantId,
          depositAddress: paymentRequest.depositAddress,
          qrCode: paymentRequest.qrCode,
          solanaPayUrl: paymentRequest.solanaPayUrl,
          expiresAt: paymentRequest.expiresAt,
        },
        instructions: 'Include X-Payment and X-Session-Id headers with your next request',
      });
    } catch (error) {
      if (options.onError) {
        options.onError(req, error as Error);
      }

      if (isStakefyError(error)) {
        res.status(500).json({
          error: 'Payment System Error',
          message: error.userMessage,
          code: error.code,
        });
      } else {
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to process payment request',
        });
      }
    }
  };
}

/**
 * Middleware for session-based budgets
 */
export function stakefyBudget(options: {
  budget: number;
  duration: number;
  merchantId: string;
  apiUrl?: string;
  network?: 'mainnet-beta' | 'devnet';
}) {
  const client = new StakefyX402Client({
    apiUrl: options.apiUrl || 'https://stakefy-x402-production.up.railway.app',
    network: options.network || 'mainnet-beta',
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = extractSessionId(req.headers);

      if (!sessionId) {
        // No session - return 402 with session creation details
        res.status(402).json({
          error: 'Session Required',
          message: `Create a session with ${options.budget} SOL budget`,
          budget: options.budget,
          duration: options.duration,
          merchantId: options.merchantId,
          instructions: 'Create a budget session and include X-Session-Id header',
        });
        return;
      }

      // TODO: Verify session budget and track spending
      // For now, just pass through
      next();
    } catch (error) {
      res.status(500).json({
        error: 'Session Error',
        message: 'Failed to verify session',
      });
    }
  };
}

/**
 * Helper to extract payment info from request
 */
export function getPaymentInfo(req: Request) {
  return {
    sessionId: extractSessionId(req.headers),
    paymentProof: extractPaymentHeader(req.headers),
    hasPaid: !!(extractPaymentHeader(req.headers) && extractSessionId(req.headers)),
  };
}

// Export types
export type { Request, Response, NextFunction } from 'express';
