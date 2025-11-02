import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  usdcMint: process.env.USDC_MINT || 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
  feePercentage: parseFloat(process.env.FEE_PERCENTAGE || '0.5'),
};
