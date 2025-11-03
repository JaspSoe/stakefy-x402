// ============================================
// CORE SDK
// ============================================

// Main client
export { StakefyX402Client } from './client';

// Types and schemas
export type {
  StakefyConfig,
  PaymentRequest,
  PaymentResponse,
  BudgetRequest,
  BudgetResponse,
  BudgetPaymentRequest,
  UsernameRequest,
  UserProfile,
  UsernamePaymentRequest,
  ChannelRequest,
  ChannelResponse,
  ChannelPaymentRequest,
  WebhookEvent,
} from './types';

export {
  PaymentRequestSchema,
  BudgetRequestSchema,
  UsernameRequestSchema,
  ChannelRequestSchema,
} from './types';

// Error handling
export {
  StakefyError,
  StakefyErrors,
  StakefyErrorCode,
  isStakefyError,
  handleStakefyError,
} from './errors';
export type { StakefyErrorDetails } from './errors';

// Version
export const VERSION = '2.0.0';

// Default configurations
export const MAINNET_API = 'https://stakefy-x402-production.up.railway.app';
export const DEVNET_API = 'https://stakefy-x402-production.up.railway.app';

// Quick start helper
import { StakefyX402Client } from './client';
export function createClient(apiUrl?: string, network: 'mainnet-beta' | 'devnet' = 'mainnet-beta') {
  return new StakefyX402Client({
    apiUrl: apiUrl || MAINNET_API,
    network,
  });
}

// ============================================
// REACT HOOKS (Optional)
// ============================================

// Provider
export { StakefyProvider, useStakefyClient } from './react/StakefyProvider';

// Hooks
export { useStakefyPayment } from './react/useStakefyPayment';
export { useSessionBudget } from './react/useSessionBudget';
export { useUsername } from './react/useUsername';
export { usePaymentChannel } from './react/usePaymentChannel';
export { usePaywall } from './react/usePaywall';

// ============================================
// EXPRESS MIDDLEWARE (Optional)
// ============================================

export { stakefyPaywall, stakefyBudget, getPaymentInfo } from './express/index';
export type { StakefyMiddlewareOptions } from './express/index';

// ============================================
// TOKEN UTILITIES
// ============================================

export { 
  TokenType,
  TOKENS,
  getTokenMint,
  usdToMicroUsdc,
  microUsdcToUsd,
  solToLamports,
  lamportsToSol,
  toTokenUnits,
  fromTokenUnits
} from './tokens';

export type { TokenMint } from './tokens';

// ============================================
// PAYMENT VERIFICATION
// ============================================

export {
  verifyPaymentTransaction,
  verifyPayment,
  extractPaymentHeader,
  extractSessionId
} from './verify';

export type {
  PaymentVerificationResult,
  PaymentRequirements
} from './verify';

// ============================================
// FETCH INTERCEPTOR
// ============================================

export {
  createX402Fetch,
  fetchWith402Detection,
  createX402Interceptor
} from './interceptor';

export type {
  WalletAdapter,
  X402FetchOptions,
  X402FetchConfig,
  X402Interceptor
} from './interceptor';

// ============================================
// REACT COMPONENTS (Client-side)
// ============================================

export { Paywall, SessionBudget } from './react/Paywall';

// ============================================
// SESSION BUDGET PRESETS (New!)
// ============================================
export { SessionBudgetPresets, createBudgetPresets } from './budget-presets';

// ============================================
// PAY TO X HELPER (Killer Feature!)
// ============================================
export { payToX } from './payToX';

// ============================================
// RECEIPT VERIFICATION (Enterprise Feature!)
// ============================================
export {
  verifyReceipt,
  verifySession,
  generateProof,
  createReceiptFromPayment,
  validateProof
} from './receipts';

export type {
  PaymentReceipt,
  VerifiedSession,
  ReceiptVerifyOptions
} from './receipts';

// ============================================
// ENTERPRISE FEATURES (Verified Orgs, Quotas, Analytics)
// ============================================
export {
  EnterpriseClient,
  createEnterpriseClient
} from './enterprise';

export type {
  OrganizationBadge,
  UsageQuota,
  UsageMetrics,
  Invoice
} from './enterprise';
