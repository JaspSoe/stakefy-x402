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

// Version
export const VERSION = '1.0.1';

// Default configurations
export const MAINNET_API = 'https://stakefy-x402-production.up.railway.app';
export const DEVNET_API = 'https://stakefy-x402-production.up.railway.app';

// Quick start helper
import { StakefyX402Client } from './client';

export function createClient(apiUrl?: string, network: 'mainnet-beta' | 'devnet' = 'devnet') {
  return new StakefyX402Client({
    apiUrl: apiUrl || DEVNET_API,
    network,
  });
}

// Error handling
export {
  StakefyError,
  StakefyErrors,
  StakefyErrorCode,
  isStakefyError,
  handleStakefyError,
} from './errors';
export type { StakefyErrorDetails } from './errors';
