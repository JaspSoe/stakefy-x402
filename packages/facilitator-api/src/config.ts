import dotenv from 'dotenv';
dotenv.config();
export const config = {
  port: process.env.PORT || 3000,
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  usdcMint: process.env.USDC_MINT || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  feePercentage: parseFloat(process.env.FEE_PERCENTAGE || '0.5'),
};
