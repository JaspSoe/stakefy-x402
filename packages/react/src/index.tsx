// Provider
export { StakefyProvider, useStakefyClient } from './StakefyProvider';

// Hooks
export { useStakefyPayment } from './useStakefyPayment';
export { useSessionBudget } from './useSessionBudget';
export { useUsername } from './useUsername';
export { usePaymentChannel } from './usePaymentChannel';

// Re-export types from core SDK
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
} from 'x402-stakefy-sdk';

// Re-export client
export { StakefyX402Client } from 'x402-stakefy-sdk';
