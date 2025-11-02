import express from 'express';
import cors from 'cors';
import { StakefyX402Client } from 'x402-stakefy-sdk';

const app = express();
const port = 3003;

// Initialize Stakefy client
const stakefyClient = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'devnet',
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Stakefy x402 Express API',
    sdk: 'x402-stakefy-sdk',
    version: '1.0.4'
  });
});

// Create payment
app.post('/api/payment', async (req, res) => {
  try {
    const { amount, merchantId, reference } = req.body;
    
    const payment = await stakefyClient.createPayment({
      amount,
      merchantId,
      reference,
    });
    
    res.json({
      success: true,
      payment: {
        sessionId: payment.sessionId,
        qrCode: payment.qrCode,
        depositAddress: payment.depositAddress,
        amount: payment.amount,
        expiresAt: payment.expiresAt,
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Verify payment
app.get('/api/payment/:sessionId/verify', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const result = await stakefyClient.verifyPayment(sessionId);
    
    res.json({
      success: true,
      verified: result.verified,
      transaction: result.transaction,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Register username
app.post('/api/username', async (req, res) => {
  try {
    const { username, publicKey } = req.body;
    
    const result = await stakefyClient.registerUsername({
      username,
      publicKey,
    });
    
    res.json({
      success: true,
      username: result.username,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user profile
app.get('/api/username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const profile = await stakefyClient.getUserProfile(username);
    
    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create session budget
app.post('/api/budget', async (req, res) => {
  try {
    const { amount, duration, userPublicKey, merchantId } = req.body;
    
    const budget = await stakefyClient.createBudget({
      amount,
      duration,
      userPublicKey,
      merchantId,
    });
    
    res.json({
      success: true,
      budget,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Webhook endpoint (merchant feature)
app.post('/api/webhook', (req, res) => {
  try {
    const signature = req.headers['x-stakefy-signature'] as string;
    const payload = req.body;
    
    // Verify webhook signature
    const isValid = stakefyClient.verifyWebhookSignature(payload, signature);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Process webhook event
    console.log('Webhook received:', payload);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Stakefy x402 Express API running on http://localhost:${port}`);
  console.log(`📦 Using SDK: x402-stakefy-sdk v1.0.4`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST   /api/payment - Create payment`);
  console.log(`  GET    /api/payment/:id/verify - Verify payment`);
  console.log(`  POST   /api/username - Register username`);
  console.log(`  GET    /api/username/:username - Get profile`);
  console.log(`  POST   /api/budget - Create session budget`);
  console.log(`  POST   /api/webhook - Receive webhooks`);
});
