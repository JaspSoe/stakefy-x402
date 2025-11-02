import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { SolanaService } from './solana';
import { WebhookService, WebhookPayload } from './webhooks';
import { QRCodeService } from './qrcode';
import { PaymentRequest, PaymentSession, VerifyRequest, SettleRequest, CreateBudgetRequest, SessionBudget, BudgetPaymentRequest, CreateUsernameRequest, UserProfile, UsernamePaymentRequest, CreateChannelRequest, PaymentChannel, ChannelPaymentRequest, SettleChannelRequest } from './types';
import { config } from './config';
import { verify as x402Verify, Supported } from 'x402';

const router = Router();
const solanaService = new SolanaService();
const webhookService = new WebhookService();
const qrCodeService = new QRCodeService();


// Budget storage (replace with DB in production)
const budgets = new Map<string, SessionBudget & { payments: string[] }>();

// Username storage (replace with DB in production)
const usernames = new Map<string, UserProfile>();

// Payment channels storage (replace with DB in production)
const channels = new Map<string, PaymentChannel & { payments: Array<{amount: number, reference: string, timestamp: Date}> }>();
const publicKeyToUsername = new Map<string, string>();
// In-memory storage (replace with DB in production)
const sessions = new Map<string, PaymentSession & { keypair: any }>();

// Create payment session
router.post('/payment/create', async (req: Request, res: Response) => {
  try {
    const { merchantId, amount, reference, metadata, webhookUrl }: PaymentRequest = req.body;

    if (!merchantId || !amount || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionId = uuidv4();
    const feeAmount = (amount * config.feePercentage) / 100;
    const totalAmount = amount + feeAmount;
    const keypair = await solanaService.generateDepositAddress();
    const depositAddress = keypair.publicKey.toString();

    // Generate QR code
    const qrCode = await qrCodeService.generatePaymentQR({
      address: depositAddress,
      amount: totalAmount,
      token: config.usdcMint,
      label: `Stakefy Payment - ${merchantId}`,
      message: `Order: ${reference}`,
      reference: sessionId
    });

    const session: PaymentSession & { keypair: any } = {
      sessionId,
      merchantId,
      amount,
      feeAmount,
      reference,
      status: 'pending',
      depositAddress,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      webhookUrl,
      keypair: Array.from(keypair.secretKey),
    };

    sessions.set(sessionId, session);

    // Send webhook for payment.created
    if (webhookUrl) {
      const payload: WebhookPayload = {
        event: 'payment.created',
        sessionId,
        merchantId,
        amount,
        feeAmount,
        status: 'pending',
        timestamp: new Date().toISOString(),
        depositAddress
      };
      
      webhookService.sendWebhook(webhookUrl, payload).catch(err => 
        console.error('Webhook error:', err)
      );
    }

    const { keypair: _, ...sessionResponse } = session;
    res.json({
      ...sessionResponse,
      qrCode,
      solanaPayUrl: `solana:${depositAddress}?amount=${totalAmount}&spl-token=${config.usdcMint}&label=${encodeURIComponent(`Stakefy Payment - ${merchantId}`)}&message=${encodeURIComponent(`Order: ${reference}`)}&reference=${sessionId}`
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get QR code for existing session
router.get('/payment/:sessionId/qr', async (req: Request, res: Response) => {
  try {
    const session = sessions.get(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const totalAmount = session.amount + session.feeAmount;
    const qrCode = await qrCodeService.generatePaymentQR({
      address: session.depositAddress,
      amount: totalAmount,
      token: config.usdcMint,
      label: `Stakefy Payment - ${session.merchantId}`,
      message: `Order: ${session.reference}`,
      reference: session.sessionId
    });

    // Return as image
    const base64Data = qrCode.replace(/^data:image\/png;base64,/, '');
    const img = Buffer.from(base64Data, 'base64');
    
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
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

    if (isPaid && session.status === 'pending') {
      session.status = 'completed';
      
      // Send webhook for payment.completed
      if (session.webhookUrl) {
        const payload: WebhookPayload = {
          event: 'payment.completed',
          sessionId,
          merchantId: session.merchantId,
          amount: session.amount,
          feeAmount: session.feeAmount,
          status: 'completed',
          timestamp: new Date().toISOString()
        };
        
        webhookService.sendWebhook(session.webhookUrl, payload).catch(err =>
          console.error('Webhook error:', err)
        );
      }
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

    const { Keypair } = await import('@solana/web3.js');
    const keypair = Keypair.fromSecretKey(new Uint8Array(session.keypair));

    const signature = await solanaService.settlePayment(
      keypair,
      merchantAddress,
      session.amount,
      'YOUR_FEE_WALLET_ADDRESS',
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

// Webhook test endpoint
router.post('/webhook/test', (req: Request, res: Response) => {
  console.log('📥 Webhook received:', req.body);
  console.log('📋 Headers:', req.headers);
  res.json({ received: true });
});


// Create session budget
router.post('/budget/create', async (req: Request, res: Response) => {
  try {
    const { merchantId, amount, duration, userPublicKey, metadata }: CreateBudgetRequest = req.body;

    if (!merchantId || !amount || !duration || !userPublicKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const budgetId = uuidv4();
    const feeAmount = (amount * config.feePercentage) / 100;
    const totalAmount = amount + feeAmount;

    const budget: SessionBudget & { payments: string[] } = {
      budgetId,
      merchantId,
      userPublicKey,
      totalAmount,
      remainingAmount: amount,
      feeAmount,
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + duration * 1000),
      metadata,
      payments: []
    };

    budgets.set(budgetId, budget);

    res.json({
      budgetId,
      merchantId,
      totalAmount,
      remainingAmount: amount,
      feeAmount,
      status: 'active',
      expiresAt: budget.expiresAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Make payment from budget
router.post('/budget/payment', async (req: Request, res: Response) => {
  try {
    const { budgetId, amount, reference, metadata }: BudgetPaymentRequest = req.body;

    if (!budgetId || !amount || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const budget = budgets.get(budgetId);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Check budget status
    if (budget.status !== 'active') {
      return res.status(400).json({ error: `Budget is ${budget.status}` });
    }

    // Check expiration
    if (new Date() > budget.expiresAt) {
      budget.status = 'expired';
      return res.status(400).json({ error: 'Budget has expired' });
    }

    // Check remaining balance
    if (amount > budget.remainingAmount) {
      return res.status(400).json({ 
        error: 'Insufficient budget',
        remainingAmount: budget.remainingAmount
      });
    }

    // Deduct from budget
    budget.remainingAmount -= amount;
    
    // Update status if depleted
    if (budget.remainingAmount <= 0) {
      budget.status = 'depleted';
    }

    // Track payment
    budget.payments.push(reference);

    res.json({
      success: true,
      budgetId,
      amount,
      reference,
      remainingAmount: budget.remainingAmount,
      status: budget.status
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get budget status
router.get('/budget/:budgetId', (req: Request, res: Response) => {
  const budget = budgets.get(req.params.budgetId);
  if (!budget) {
    return res.status(404).json({ error: 'Budget not found' });
  }

  // Auto-expire if needed
  if (budget.status === 'active' && new Date() > budget.expiresAt) {
    budget.status = 'expired';
  }

  const { payments, ...budgetData } = budget;
  res.json({
    ...budgetData,
    paymentsCount: payments.length
  });
});

// Create session budget
router.post('/budget/create', async (req: Request, res: Response) => {
  try {
    const { merchantId, amount, duration, userPublicKey, metadata }: CreateBudgetRequest = req.body;

    if (!merchantId || !amount || !duration || !userPublicKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const budgetId = uuidv4();
    const feeAmount = (amount * config.feePercentage) / 100;
    const totalAmount = amount + feeAmount;

    const budget: SessionBudget & { payments: string[] } = {
      budgetId,
      merchantId,
      userPublicKey,
      totalAmount,
      remainingAmount: amount,
      feeAmount,
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + duration * 1000),
      metadata,
      payments: []
    };

    budgets.set(budgetId, budget);

    res.json({
      budgetId,
      merchantId,
      totalAmount,
      remainingAmount: amount,
      feeAmount,
      status: 'active',
      expiresAt: budget.expiresAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Make payment from budget
router.post('/budget/payment', async (req: Request, res: Response) => {
  try {
    const { budgetId, amount, reference, metadata }: BudgetPaymentRequest = req.body;

    if (!budgetId || !amount || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const budget = budgets.get(budgetId);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    if (budget.status !== 'active') {
      return res.status(400).json({ error: `Budget is ${budget.status}` });
    }

    if (new Date() > budget.expiresAt) {
      budget.status = 'expired';
      return res.status(400).json({ error: 'Budget has expired' });
    }

    if (amount > budget.remainingAmount) {
      return res.status(400).json({ 
        error: 'Insufficient budget',
        remainingAmount: budget.remainingAmount
      });
    }

    budget.remainingAmount -= amount;
    
    if (budget.remainingAmount <= 0) {
      budget.status = 'depleted';
    }

    budget.payments.push(reference);

    res.json({
      success: true,
      budgetId,
      amount,
      reference,
      remainingAmount: budget.remainingAmount,
      status: budget.status
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get budget status
router.get('/budget/:budgetId', (req: Request, res: Response) => {
  const budget = budgets.get(req.params.budgetId);
  if (!budget) {
    return res.status(404).json({ error: 'Budget not found' });
  }

  if (budget.status === 'active' && new Date() > budget.expiresAt) {
    budget.status = 'expired';
  }

  const { payments, ...budgetData } = budget;
  res.json({
    ...budgetData,
    paymentsCount: payments.length
  });
});


// Get supported x402 schemes and networks
router.get('/supported', (req: Request, res: Response) => {
  const supported: Supported = {
    x402Version: 1,
    kind: [
      {
        scheme: 'exact',
        networkId: 'solana-devnet',
        extra: {
          fees: '0.1%',
          minAmount: '0.01',
          maxAmount: '10000',
          supportedTokens: ['USDC']
        }
      }
    ]
  };
  res.json(supported);
});


// Get supported x402 schemes and networks
router.get('/supported', (req: Request, res: Response) => {
  const supported: Supported = {
    x402Version: 1,
    kind: [
      {
        scheme: 'exact',
        networkId: 'solana-devnet',
        extra: {
          fees: '0.1%',
          minAmount: '0.01',
          maxAmount: '10000',
          supportedTokens: ['USDC']
        }
      }
    ]
  };
  res.json(supported);
});


// Register username
router.post('/username/register', (req: Request, res: Response) => {
  try {
    const { username, publicKey, metadata }: CreateUsernameRequest = req.body;

    if (!username || !publicKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate username format (alphanumeric, underscore, 3-20 chars)
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({ error: 'Invalid username format. Use 3-20 alphanumeric characters or underscore' });
    }

    // Check if username already exists
    if (usernames.has(username.toLowerCase())) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Check if public key already has a username
    if (publicKeyToUsername.has(publicKey)) {
      return res.status(409).json({ error: 'Public key already has a username' });
    }

    const profile: UserProfile = {
      username: username.toLowerCase(),
      publicKey,
      reputation: 100, // Starting reputation
      totalTransactions: 0,
      totalVolume: 0,
      successfulPayments: 0,
      failedPayments: 0,
      createdAt: new Date(),
      lastActive: new Date(),
      metadata
    };

    usernames.set(username.toLowerCase(), profile);
    publicKeyToUsername.set(publicKey, username.toLowerCase());

    res.json({
      username: profile.username,
      publicKey: profile.publicKey,
      reputation: profile.reputation,
      createdAt: profile.createdAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile by username
router.get('/username/:username', (req: Request, res: Response) => {
  const username = req.params.username.toLowerCase();
  const profile = usernames.get(username);

  if (!profile) {
    return res.status(404).json({ error: 'Username not found' });
  }

  res.json(profile);
});

// Get username by public key
router.get('/publickey/:publicKey', (req: Request, res: Response) => {
  const username = publicKeyToUsername.get(req.params.publicKey);

  if (!username) {
    return res.status(404).json({ error: 'No username found for this public key' });
  }

  const profile = usernames.get(username);
  res.json(profile);
});

// Pay to username
router.post('/username/pay', async (req: Request, res: Response) => {
  try {
    const { username, amount, reference, metadata }: UsernamePaymentRequest = req.body;

    if (!username || !amount || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const profile = usernames.get(username.toLowerCase());
    if (!profile) {
      return res.status(404).json({ error: 'Username not found' });
    }

    // Create payment session using the user's public key
    const sessionId = uuidv4();
    const feeAmount = (amount * config.feePercentage) / 100;
    const totalAmount = amount + feeAmount;
    const keypair = await solanaService.generateDepositAddress();
    const depositAddress = keypair.publicKey.toString();

    const qrCode = await qrCodeService.generatePaymentQR({
      address: depositAddress,
      amount: totalAmount,
      token: config.usdcMint,
      label: `Payment to @${username}`,
      message: `Order: ${reference}`,
      reference: sessionId
    });

    const session: PaymentSession & { keypair: any; recipientUsername: string } = {
      sessionId,
      merchantId: `@${username}`,
      amount,
      feeAmount,
      reference,
      status: 'pending',
      depositAddress,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      keypair: Array.from(keypair.secretKey),
      recipientUsername: username
    };

    sessions.set(sessionId, session as any);

    // Update last active
    profile.lastActive = new Date();

    const { keypair: _, ...sessionResponse } = session;
    res.json({
      ...sessionResponse,
      recipientPublicKey: profile.publicKey,
      recipientReputation: profile.reputation,
      qrCode,
      solanaPayUrl: `solana:${depositAddress}?amount=${totalAmount}&spl-token=${config.usdcMint}&label=${encodeURIComponent(`Payment to @${username}`)}&message=${encodeURIComponent(`Order: ${reference}`)}&reference=${sessionId}`
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update reputation after payment (called internally after verify)
function updateReputation(username: string, success: boolean, amount: number) {
  const profile = usernames.get(username.toLowerCase());
  if (!profile) return;

  profile.totalTransactions++;
  profile.lastActive = new Date();

  if (success) {
    profile.successfulPayments++;
    profile.totalVolume += amount;
    // Increase reputation (max 1000)
    profile.reputation = Math.min(1000, profile.reputation + 5);
  } else {
    profile.failedPayments++;
    // Decrease reputation (min 0)
    profile.reputation = Math.max(0, profile.reputation - 10);
  }
}


// Create payment channel
router.post('/channel/create', async (req: Request, res: Response) => {
  try {
    const { userPublicKey, merchantId, depositAmount, duration, metadata }: CreateChannelRequest = req.body;

    if (!userPublicKey || !merchantId || !depositAmount || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const channelId = uuidv4();
    const feeAmount = (depositAmount * config.feePercentage) / 100;

    const channel: PaymentChannel & { payments: Array<{amount: number, reference: string, timestamp: Date}> } = {
      channelId,
      userPublicKey,
      merchantId,
      depositAmount,
      withdrawnAmount: 0,
      remainingBalance: depositAmount,
      status: 'open',
      nonce: 0,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + duration * 1000),
      metadata,
      payments: []
    };

    channels.set(channelId, channel);

    res.json({
      channelId,
      userPublicKey,
      merchantId,
      depositAmount,
      remainingBalance: depositAmount,
      status: 'open',
      nonce: 0,
      expiresAt: channel.expiresAt,
      message: 'Channel created. Deposit funds on-chain to activate.'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Make payment from channel (off-chain)
router.post('/channel/payment', (req: Request, res: Response) => {
  try {
    const { channelId, amount, nonce, signature, reference, metadata }: ChannelPaymentRequest = req.body;

    if (!channelId || !amount || nonce === undefined || !signature || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const channel = channels.get(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Check channel status
    if (channel.status !== 'open') {
      return res.status(400).json({ error: `Channel is ${channel.status}` });
    }

    // Check expiration
    if (new Date() > channel.expiresAt) {
      channel.status = 'closed';
      return res.status(400).json({ error: 'Channel has expired' });
    }

    // Verify nonce (must be greater than last nonce to prevent replay)
    if (nonce <= channel.nonce) {
      return res.status(400).json({ error: 'Invalid nonce. Must be greater than last nonce.' });
    }

    // Check balance
    const newWithdrawn = channel.withdrawnAmount + amount;
    if (newWithdrawn > channel.depositAmount) {
      return res.status(400).json({ 
        error: 'Insufficient channel balance',
        remainingBalance: channel.remainingBalance
      });
    }

    // TODO: Verify signature in production
    // Should verify: sign(channelId + amount + nonce) === signature

    // Update channel state (off-chain)
    channel.withdrawnAmount = newWithdrawn;
    channel.remainingBalance = channel.depositAmount - newWithdrawn;
    channel.nonce = nonce;
    channel.payments.push({
      amount,
      reference,
      timestamp: new Date()
    });

    res.json({
      success: true,
      channelId,
      amount,
      reference,
      withdrawnAmount: channel.withdrawnAmount,
      remainingBalance: channel.remainingBalance,
      nonce: channel.nonce,
      paymentsCount: channel.payments.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get channel status
router.get('/channel/:channelId', (req: Request, res: Response) => {
  const channel = channels.get(req.params.channelId);
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }

  // Auto-close if expired
  if (channel.status === 'open' && new Date() > channel.expiresAt) {
    channel.status = 'closed';
  }

  const { payments, ...channelData } = channel;
  res.json({
    ...channelData,
    paymentsCount: payments.length,
    totalProcessed: channel.withdrawnAmount
  });
});

// Settle channel on-chain
router.post('/channel/settle', async (req: Request, res: Response) => {
  try {
    const { channelId, merchantAddress }: SettleChannelRequest = req.body;

    if (!channelId || !merchantAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const channel = channels.get(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    if (channel.status === 'settled') {
      return res.status(400).json({ error: 'Channel already settled' });
    }

    // In production: execute on-chain settlement here
    // Transfer channel.withdrawnAmount to merchant
    // Return remaining balance to user

    channel.status = 'settled';
    channel.settledAt = new Date();

    res.json({
      success: true,
      channelId,
      withdrawnAmount: channel.withdrawnAmount,
      returnedToUser: channel.remainingBalance,
      paymentsProcessed: channel.payments.length,
      settledAt: channel.settledAt,
      message: 'Channel settled on-chain'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// Create payment channel
router.post('/channel/create', async (req: Request, res: Response) => {
  try {
    const { userPublicKey, merchantId, depositAmount, duration, metadata }: CreateChannelRequest = req.body;

    if (!userPublicKey || !merchantId || !depositAmount || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const channelId = uuidv4();
    const feeAmount = (depositAmount * config.feePercentage) / 100;

    const channel: PaymentChannel & { payments: Array<{amount: number, reference: string, timestamp: Date}> } = {
      channelId,
      userPublicKey,
      merchantId,
      depositAmount,
      withdrawnAmount: 0,
      remainingBalance: depositAmount,
      status: 'open',
      nonce: 0,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + duration * 1000),
      metadata,
      payments: []
    };

    channels.set(channelId, channel);

    res.json({
      channelId,
      userPublicKey,
      merchantId,
      depositAmount,
      remainingBalance: depositAmount,
      status: 'open',
      nonce: 0,
      expiresAt: channel.expiresAt,
      message: 'Channel created. Deposit funds on-chain to activate.'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Make payment from channel (off-chain)
router.post('/channel/payment', (req: Request, res: Response) => {
  try {
    const { channelId, amount, nonce, signature, reference, metadata }: ChannelPaymentRequest = req.body;

    if (!channelId || !amount || nonce === undefined || !signature || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const channel = channels.get(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Check channel status
    if (channel.status !== 'open') {
      return res.status(400).json({ error: `Channel is ${channel.status}` });
    }

    // Check expiration
    if (new Date() > channel.expiresAt) {
      channel.status = 'closed';
      return res.status(400).json({ error: 'Channel has expired' });
    }

    // Verify nonce (must be greater than last nonce to prevent replay)
    if (nonce <= channel.nonce) {
      return res.status(400).json({ error: 'Invalid nonce. Must be greater than last nonce.' });
    }

    // Check balance
    const newWithdrawn = channel.withdrawnAmount + amount;
    if (newWithdrawn > channel.depositAmount) {
      return res.status(400).json({ 
        error: 'Insufficient channel balance',
        remainingBalance: channel.remainingBalance
      });
    }

    // TODO: Verify signature in production
    // Should verify: sign(channelId + amount + nonce) === signature

    // Update channel state (off-chain)
    channel.withdrawnAmount = newWithdrawn;
    channel.remainingBalance = channel.depositAmount - newWithdrawn;
    channel.nonce = nonce;
    channel.payments.push({
      amount,
      reference,
      timestamp: new Date()
    });

    res.json({
      success: true,
      channelId,
      amount,
      reference,
      withdrawnAmount: channel.withdrawnAmount,
      remainingBalance: channel.remainingBalance,
      nonce: channel.nonce,
      paymentsCount: channel.payments.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get channel status
router.get('/channel/:channelId', (req: Request, res: Response) => {
  const channel = channels.get(req.params.channelId);
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }

  // Auto-close if expired
  if (channel.status === 'open' && new Date() > channel.expiresAt) {
    channel.status = 'closed';
  }

  const { payments, ...channelData } = channel;
  res.json({
    ...channelData,
    paymentsCount: payments.length,
    totalProcessed: channel.withdrawnAmount
  });
});

// Settle channel on-chain
router.post('/channel/settle', async (req: Request, res: Response) => {
  try {
    const { channelId, merchantAddress }: SettleChannelRequest = req.body;

    if (!channelId || !merchantAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const channel = channels.get(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    if (channel.status === 'settled') {
      return res.status(400).json({ error: 'Channel already settled' });
    }

    // In production: execute on-chain settlement here
    // Transfer channel.withdrawnAmount to merchant
    // Return remaining balance to user

    channel.status = 'settled';
    channel.settledAt = new Date();

    res.json({
      success: true,
      channelId,
      withdrawnAmount: channel.withdrawnAmount,
      returnedToUser: channel.remainingBalance,
      paymentsProcessed: channel.payments.length,
      settledAt: channel.settledAt,
      message: 'Channel settled on-chain'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
