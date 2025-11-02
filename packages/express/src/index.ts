import { Request, Response, NextFunction } from 'express';
import { StakefyX402Client, StakefyErrors, isStakefyError } from 'x402-stakefy-sdk';

export interface StakefyMiddlewareOptions {
  amount: number;
  merchantId: string;
  apiUrl?: string;
  network?: 'mainnet-beta' | 'devnet';
  description?: string;
  onSuccess?: (req: Request, sessionId: string) => void;
  onError?: (req: Request, error: Error) => void;
}

/**
 * Express middleware for x402 payment paywalls
 * 
 * @example
 * ```typescript
 * import express from 'express';
 * import { stakefyPaywall } from '@stakefy/express';
 * 
 * const app = express();
 * 
 * app.get('/api/premium', 
 *   stakefyPaywall({ 
 *     amount: 0.01, 
 *     merchantId: 'YOUR_MERCHANT_ID' 
 *   }),
 *   (req, res) => {
 *     res.json({ data: 'Premium content!' });
 *   }
 * );
 * ```
 */
export function stakefyPaywall(options: StakefyMiddlewareOptions) {
  const client = new StakefyX402Client({
    apiUrl: options.apiUrl || 'https://stakefy-x402-production.up.railway.app',
    network: options.network || 'devnet',
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for existing payment proof in headers
      const paymentHeader = req.headers['x-payment-proof'] as string;
      const sessionId = req.headers['x-session-id'] as string;

      // If payment proof exists, verify it
      if (paymentHeader && sessionId) {
        // TODO: Add actual verification logic here
        // For now, we trust the header (in production, verify signature)
        
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
        instructions: 'Include X-Payment-Proof and X-Session-Id headers with your next request',
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
 * Allows multiple API calls within a budget
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
    network: options.network || 'devnet',
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.headers['x-session-id'] as string;

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
    sessionId: req.headers['x-session-id'] as string | undefined,
    paymentProof: req.headers['x-payment-proof'] as string | undefined,
    hasPaid: !!(req.headers['x-payment-proof'] && req.headers['x-session-id']),
  };
}

// Export types
export type { Request, Response, NextFunction } from 'express';
