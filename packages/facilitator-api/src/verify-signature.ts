import { Router, Request, Response } from 'express';
import { Connection } from '@solana/web3.js';

const router = Router();

// Verify payment by transaction signature
router.post('/api/verify', async (req: Request, res: Response) => {
  try {
    const { signature } = req.body;

    if (!signature) {
      return res.status(400).json({ error: 'Signature required' });
    }

    // Verify on-chain
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    );
    
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0
    });

    if (!tx) {
      return res.status(404).json({
        verified: false,
        message: 'Transaction not found on blockchain'
      });
    }

    if (tx.meta?.err) {
      return res.status(400).json({
        verified: false,
        message: 'Transaction failed',
        error: tx.meta.err
      });
    }

    // Calculate amount transferred
    const preBalance = tx.meta?.preBalances[1] || 0;
    const postBalance = tx.meta?.postBalances[1] || 0;
    const amount = (postBalance - preBalance) / 1e9;

    return res.json({
      verified: true,
      signature,
      block: tx.slot,
      timestamp: new Date(tx.blockTime! * 1000),
      amount,
      message: '✅ Payment verified through Stakefy facilitator'
    });
  } catch (error: any) {
    console.error('Verify error:', error);
    return res.status(500).json({
      verified: false,
      error: error.message
    });
  }
});

export default router;
