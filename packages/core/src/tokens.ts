/**
 * Supported tokens on Solana
 */

export enum TokenType {
  SOL = 'SOL',
  USDC = 'USDC',
  BONK = 'BONK',
}

export interface TokenMint {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
}

export const TOKENS = {
  SOL: {
    mainnet: {
      address: 'So11111111111111111111111111111111111111112', // Native SOL
      decimals: 9,
      symbol: 'SOL',
      name: 'Solana',
    },
    devnet: {
      address: 'So11111111111111111111111111111111111111112',
      decimals: 9,
      symbol: 'SOL',
      name: 'Solana',
    },
  },
  USDC: {
    mainnet: {
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
    },
    devnet: {
      address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
    },
  },
  BONK: {
    mainnet: {
      address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      decimals: 5,
      symbol: 'BONK',
      name: 'Bonk',
    },
    devnet: {
      address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // Using mainnet for devnet
      decimals: 5,
      symbol: 'BONK',
      name: 'Bonk',
    },
  },
} as const;

/**
 * Get token mint info for a specific network
 */
export function getTokenMint(
  token: TokenType,
  network: 'mainnet-beta' | 'devnet'
): TokenMint {
  const networkKey = network === 'mainnet-beta' ? 'mainnet' : 'devnet';
  return TOKENS[token][networkKey];
}

/**
 * Convert USD to token micro-units (for USDC)
 * @param usd - Dollar amount (e.g., 1.50)
 * @returns Micro-units as string (e.g., "1500000")
 */
export function usdToMicroUsdc(usd: number): string {
  return Math.floor(usd * 1_000_000).toString();
}

/**
 * Convert token micro-units to USD (for USDC)
 * @param microUsdc - Micro-units as string (e.g., "1500000")
 * @returns Dollar amount (e.g., 1.50)
 */
export function microUsdcToUsd(microUsdc: string): number {
  return parseInt(microUsdc) / 1_000_000;
}

/**
 * Convert SOL to lamports
 * @param sol - SOL amount (e.g., 0.5)
 * @returns Lamports (e.g., 500000000)
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * 1_000_000_000);
}

/**
 * Convert lamports to SOL
 * @param lamports - Lamports (e.g., 500000000)
 * @returns SOL amount (e.g., 0.5)
 */
export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

/**
 * Convert token amount to smallest units based on decimals
 * @param amount - Token amount (e.g., 100)
 * @param decimals - Token decimals (e.g., 6 for USDC)
 * @returns Smallest units
 */
export function toTokenUnits(amount: number, decimals: number): number {
  return Math.floor(amount * Math.pow(10, decimals));
}

/**
 * Convert smallest units to token amount
 * @param units - Smallest units
 * @param decimals - Token decimals (e.g., 6 for USDC)
 * @returns Token amount
 */
export function fromTokenUnits(units: number, decimals: number): number {
  return units / Math.pow(10, decimals);
}
