/**
 * Stakefy x402 Error Taxonomy
 * Comprehensive error codes with recovery suggestions
 */

export enum StakefyErrorCode {
  // Network Errors (1xxx)
  NETWORK_REQUEST_FAILED = 1001,
  NETWORK_TIMEOUT = 1002,
  NETWORK_INVALID_RESPONSE = 1003,
  NETWORK_CONNECTION_LOST = 1004,

  // Validation Errors (2xxx)
  VALIDATION_INVALID_AMOUNT = 2001,
  VALIDATION_INVALID_ADDRESS = 2002,
  VALIDATION_INVALID_SIGNATURE = 2003,
  VALIDATION_INVALID_MEMO = 2004,
  VALIDATION_INVALID_USERNAME = 2005,
  VALIDATION_MISSING_REQUIRED_FIELD = 2006,

  // Payment Errors (3xxx)
  PAYMENT_INSUFFICIENT_FUNDS = 3001,
  PAYMENT_TRANSACTION_FAILED = 3002,
  PAYMENT_ALREADY_PROCESSED = 3003,
  PAYMENT_EXPIRED = 3004,
  PAYMENT_REJECTED = 3005,
  PAYMENT_CANCELLED = 3006,
  PAYMENT_AMOUNT_MISMATCH = 3007,

  // Facilitator Errors (4xxx)
  FACILITATOR_UNAVAILABLE = 4001,
  FACILITATOR_INVALID_RESPONSE = 4002,
  FACILITATOR_RATE_LIMITED = 4003,
  FACILITATOR_UNAUTHORIZED = 4004,
  FACILITATOR_INVALID_CONFIG = 4005,

  // Session Errors (5xxx)
  SESSION_NOT_FOUND = 5001,
  SESSION_EXPIRED = 5002,
  SESSION_BUDGET_EXCEEDED = 5003,
  SESSION_INVALID_STATE = 5004,
  SESSION_CHANNEL_CLOSED = 5005,

  // Wallet Errors (6xxx)
  WALLET_NOT_CONNECTED = 6001,
  WALLET_CONNECTION_REJECTED = 6002,
  WALLET_SIGNATURE_REJECTED = 6003,
  WALLET_UNSUPPORTED = 6004,
  WALLET_LOCKED = 6005,

  // Merchant Errors (7xxx)
  MERCHANT_NOT_FOUND = 7001,
  MERCHANT_INVALID_CONFIG = 7002,
  MERCHANT_PAYMENT_REJECTED = 7003,
  MERCHANT_WEBHOOK_FAILED = 7004,

  // Unknown/Internal Errors (9xxx)
  UNKNOWN_ERROR = 9001,
  INTERNAL_ERROR = 9002,
  NOT_IMPLEMENTED = 9003,
}

export interface StakefyErrorDetails {
  code: StakefyErrorCode;
  message: string;
  userMessage: string;
  recovery?: string;
  metadata?: Record<string, any>;
}

export class StakefyError extends Error {
  public readonly code: StakefyErrorCode;
  public readonly userMessage: string;
  public readonly recovery?: string;
  public readonly metadata?: Record<string, any>;
  public readonly timestamp: Date;

  constructor(details: StakefyErrorDetails) {
    super(details.message);
    this.name = 'StakefyError';
    this.code = details.code;
    this.userMessage = details.userMessage;
    this.recovery = details.recovery;
    this.metadata = details.metadata;
    this.timestamp = new Date();

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StakefyError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      recovery: this.recovery,
      metadata: this.metadata,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

// Error Factory Functions
export const StakefyErrors = {
  // Network Errors
  networkRequestFailed: (url: string, error: any): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.NETWORK_REQUEST_FAILED,
      message: `Network request failed: ${url}`,
      userMessage: 'Failed to connect to payment network',
      recovery: 'Check your internet connection and try again',
      metadata: { url, originalError: error.message },
    }),

  networkTimeout: (url: string): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.NETWORK_TIMEOUT,
      message: `Request timeout: ${url}`,
      userMessage: 'Request took too long',
      recovery: 'The network is slow. Please try again',
      metadata: { url },
    }),

  // Validation Errors
  invalidAmount: (amount: number | string): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.VALIDATION_INVALID_AMOUNT,
      message: `Invalid amount: ${amount}`,
      userMessage: 'Payment amount is invalid',
      recovery: 'Amount must be a positive number',
      metadata: { amount },
    }),

  invalidAddress: (address: string): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.VALIDATION_INVALID_ADDRESS,
      message: `Invalid Solana address: ${address}`,
      userMessage: 'Invalid wallet address',
      recovery: 'Please check the wallet address and try again',
      metadata: { address },
    }),

  invalidUsername: (username: string): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.VALIDATION_INVALID_USERNAME,
      message: `Invalid username: ${username}`,
      userMessage: 'Username format is invalid',
      recovery: 'Username must start with @ and contain only letters, numbers, and underscores',
      metadata: { username },
    }),

  // Payment Errors
  insufficientFunds: (required: number, available: number): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.PAYMENT_INSUFFICIENT_FUNDS,
      message: `Insufficient funds: required ${required} SOL, available ${available} SOL`,
      userMessage: 'Not enough funds in your wallet',
      recovery: `You need ${required} SOL but only have ${available} SOL`,
      metadata: { required, available },
    }),

  transactionFailed: (signature?: string, error?: string): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.PAYMENT_TRANSACTION_FAILED,
      message: `Transaction failed: ${error || 'Unknown error'}`,
      userMessage: 'Payment transaction failed',
      recovery: 'Please try again or contact support if the issue persists',
      metadata: { signature, error },
    }),

  paymentExpired: (expiresAt: Date): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.PAYMENT_EXPIRED,
      message: `Payment expired at ${expiresAt.toISOString()}`,
      userMessage: 'Payment request has expired',
      recovery: 'Please request a new payment',
      metadata: { expiresAt: expiresAt.toISOString() },
    }),

  // Facilitator Errors
  facilitatorUnavailable: (url: string): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.FACILITATOR_UNAVAILABLE,
      message: `Facilitator unavailable: ${url}`,
      userMessage: 'Payment service is temporarily unavailable',
      recovery: 'Please try again in a few moments',
      metadata: { url },
    }),

  facilitatorRateLimited: (retryAfter?: number): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.FACILITATOR_RATE_LIMITED,
      message: 'Rate limit exceeded',
      userMessage: 'Too many requests',
      recovery: retryAfter
        ? `Please wait ${retryAfter} seconds before trying again`
        : 'Please wait a moment before trying again',
      metadata: { retryAfter },
    }),

  // Session Errors
  sessionNotFound: (sessionId: string): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.SESSION_NOT_FOUND,
      message: `Session not found: ${sessionId}`,
      userMessage: 'Payment session not found',
      recovery: 'Please start a new payment session',
      metadata: { sessionId },
    }),

  sessionExpired: (sessionId: string): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.SESSION_EXPIRED,
      message: `Session expired: ${sessionId}`,
      userMessage: 'Your payment session has expired',
      recovery: 'Please start a new session',
      metadata: { sessionId },
    }),

  sessionBudgetExceeded: (budget: number, spent: number): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.SESSION_BUDGET_EXCEEDED,
      message: `Budget exceeded: ${spent} SOL spent of ${budget} SOL budget`,
      userMessage: 'Session budget exceeded',
      recovery: 'Start a new session with a higher budget',
      metadata: { budget, spent },
    }),

  // Wallet Errors
  walletNotConnected: (): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.WALLET_NOT_CONNECTED,
      message: 'Wallet not connected',
      userMessage: 'Please connect your wallet',
      recovery: 'Click the connect button to link your Solana wallet',
    }),

  walletRejected: (action: string): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.WALLET_CONNECTION_REJECTED,
      message: `Wallet rejected ${action}`,
      userMessage: 'You rejected the wallet request',
      recovery: 'Please approve the request in your wallet',
      metadata: { action },
    }),

  // Merchant Errors
  merchantNotFound: (merchantId: string): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.MERCHANT_NOT_FOUND,
      message: `Merchant not found: ${merchantId}`,
      userMessage: 'Merchant not found',
      recovery: 'Please check the merchant ID',
      metadata: { merchantId },
    }),

  // Internal Errors
  unknownError: (error: any): StakefyError =>
    new StakefyError({
      code: StakefyErrorCode.UNKNOWN_ERROR,
      message: `Unknown error: ${error?.message || 'No details'}`,
      userMessage: 'An unexpected error occurred',
      recovery: 'Please try again or contact support',
      metadata: { originalError: error?.message },
    }),
};

// Type guard
export function isStakefyError(error: any): error is StakefyError {
  return error instanceof StakefyError;
}

// Error handler utility
export function handleStakefyError(error: unknown): StakefyError {
  if (isStakefyError(error)) {
    return error;
  }
  return StakefyErrors.unknownError(error);
}
