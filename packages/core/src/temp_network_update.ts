// Network configuration
export const MAINNET_API = 'https://stakefy-x402-production.up.railway.app';
export const DEVNET_API = 'https://stakefy-x402-production.up.railway.app';

// Quick start helper - NOW DEFAULTS TO MAINNET
export function createClient(apiUrl?: string, network: 'mainnet-beta' | 'devnet' = 'mainnet-beta') {
  return new StakefyX402Client({
    apiUrl: apiUrl || MAINNET_API,
    network,
  });
}
