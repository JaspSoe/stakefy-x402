import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { SolanaService } from './solana';
import { PaymentRequest, PaymentSession, VerifyRequest, SettleRequest } from './types';
import { config } from './config';

const router = Router();
const solanaService = new SolanaService();

// In-memory storage (replace with DB in production)
const sessions = new Map<string, PaymentSession & { keypair: any }>();

// Create payment session
router.post('/payment/create', async (req: Request, res: Response) => {
  try {
    const { merchantId, amount, reference, metadata }: PaymentRequest = req.body;

    if (!merchantId || !amount || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionId = uuidv4();
    const feeAmount = (amount * config.feePercentage) / 100;
    const keypair = await solanaService.generateDepositAddress();

    const session: PaymentSession & { keypair: any } = {
      sessionId,
      merchantId,
      amount,
      feeAmount,
      reference,
      status: 'pending',
      depositAddress: keypair.publicKey.toString(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min expiry
      keypair: Array.from(keypair.secretKey), // Store for settlement
    };

    sessions.set(sessionId, session);

    const { keypair: _, ...sessionResponse } = session;
    res.json(sessionResponse);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.post('/payment/verify', async (req: Request, res: Response) => {
  try {
    const { sessionId }: VerifyRequest = req.body;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const isPaid = await solanaService.checkPayment(
      session.depositAddress,
      session.amount + session.feeAmount
    );

    if (isPaid) {
      session.status = 'completed';
    }

    res.json({ 
      sessionId, 
      status: session.status,
      isPaid 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Settle payment
router.post('/payment/settle', async (req: Request, res: Response) => {
  try {
    const { sessionId, merchantAddress }: SettleRequest = req.body;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Recreate keypair from stored secret
    const { Keypair } = await import('@solana/web3.js');
    const keypair = Keypair.fromSecretKey(new Uint8Array(session.keypair));

    const signature = await solanaService.settlePayment(
      keypair,
      merchantAddress,
      session.amount,
      'YOUR_FEE_WALLET_ADDRESS', // TODO: Set this in config
      session.feeAmount
    );

    res.json({ 
      success: true,
      signature,
      merchantAmount: session.amount,
      feeAmount: session.feeAmount
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get session status
router.get('/payment/status/:sessionId', (req: Request, res: Response) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const { keypair, ...sessionData } = session;
  res.json(sessionData);
});

export default router;
