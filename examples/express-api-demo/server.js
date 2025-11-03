import express from 'express';
import cors from 'cors';
import { stakefyPaywall, stakefyBudget } from 'stakefy-express';
import { StakefyX402Client, usdToMicroUsdc, TokenType } from 'x402-stakefy-sdk';

const app = express();
const PORT = 3000;

// Merchant wallet (replace with your own!)
const MERCHANT_WALLET = process.env.MERCHANT_WALLET || 'DEMO_WALLET_ADDRESS';

app.use(cors());
app.use(express.json());

// Initialize Stakefy client with one line!
const client = StakefyX402Client.auto();

// ============================================
// DEMO ENDPOINTS
// ============================================

// 1. Free endpoint (no payment required)
app.get('/api/free', (req, res) => {
  res.json({
    message: '🎉 This endpoint is FREE!',
    data: {
      timestamp: new Date().toISOString(),
      tip: 'Try the /api/premium endpoint to see payments in action'
    }
  });
});

// 2. Premium endpoint (requires 0.01 SOL)
app.get('/api/premium',
  stakefyPaywall({
    amount: 0.01,
    merchantId: MERCHANT_WALLET,
    description: 'Premium data access - 0.01 SOL'
  }),
  (req, res) => {
    res.json({
      message: '💎 Welcome to premium content!',
      data: {
        secretData: 'This is only visible after payment',
        timestamp: new Date().toISOString(),
        paidAmount: '0.01 SOL'
      }
    });
  }
);

// 3. AI endpoint (requires 0.001 SOL per call)
app.post('/api/ai/generate',
  stakefyPaywall({
    amount: 0.001,
    merchantId: MERCHANT_WALLET,
    description: 'AI generation - 0.001 SOL per request'
  }),
  (req, res) => {
    const { prompt } = req.body;
    res.json({
      message: '🤖 AI Response Generated',
      prompt: prompt || 'No prompt provided',
      response: 'This is a mock AI response. In production, this would call a real AI API.',
      cost: '0.001 SOL',
      timestamp: new Date().toISOString()
    });
  }
);

// 4. Session-based endpoint (pay once, use multiple times)
app.use('/api/metered',
  stakefyBudget({
    budget: 0.1,
    duration: 3600,
    merchantId: MERCHANT_WALLET
  })
);

app.get('/api/metered/data', (req, res) => {
  res.json({
    message: '📊 Metered data access',
    data: {
      value: Math.random(),
      timestamp: new Date().toISOString()
    },
    note: 'Part of your 0.1 SOL session budget'
  });
});

// 5. Demo payment creation (for testing)
app.post('/api/demo/create-payment', async (req, res) => {
  try {
    const { amount = 0.01, token = 'SOL' } = req.body;
    
    const payment = await client.createPayment({
      amount: token === 'USDC' ? usdToMicroUsdc(amount) : amount,
      token: token === 'USDC' ? TokenType.USDC : TokenType.SOL,
      merchantId: MERCHANT_WALLET,
      reference: `demo-${Date.now()}`
    });

    res.json({
      message: '✅ Payment request created',
      payment: {
        sessionId: payment.sessionId,
        amount: payment.amount,
        depositAddress: payment.depositAddress,
        qrCode: payment.qrCode,
        solanaPayUrl: payment.solanaPayUrl,
        expiresAt: payment.expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create payment',
      message: error.message
    });
  }
});

// ============================================
// INFO ENDPOINTS
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Stakefy x402 Demo API',
    version: '1.0.0',
    endpoints: {
      free: {
        url: '/api/free',
        method: 'GET',
        cost: 'FREE',
        description: 'Free endpoint, no payment required'
      },
      premium: {
        url: '/api/premium',
        method: 'GET',
        cost: '0.01 SOL',
        description: 'Premium content behind paywall'
      },
      ai: {
        url: '/api/ai/generate',
        method: 'POST',
        cost: '0.001 SOL',
        description: 'AI generation endpoint',
        body: { prompt: 'Your prompt here' }
      },
      metered: {
        url: '/api/metered/data',
        method: 'GET',
        cost: '0.1 SOL session budget',
        description: 'Session-based metered access'
      },
      createPayment: {
        url: '/api/demo/create-payment',
        method: 'POST',
        cost: 'FREE',
        description: 'Create a demo payment',
        body: { amount: 0.01, token: 'SOL' }
      }
    },
    docs: 'https://github.com/JaspSoe/stakefy-x402',
    howToUse: [
      '1. Call any paid endpoint without payment headers',
      '2. Receive 402 Payment Required with payment details',
      '3. Make payment and include X-Session-Id header',
      '4. Access protected content'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    merchant: MERCHANT_WALLET
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Stakefy x402 Demo API Running!                      ║
║                                                           ║
║   📍 URL: http://localhost:${PORT}                          ║
║   💰 Merchant: ${MERCHANT_WALLET.slice(0, 20)}...        ║
║                                                           ║
║   🎯 Try these endpoints:                                ║
║   • GET  /                    - API info                 ║
║   • GET  /api/free           - Free endpoint             ║
║   • GET  /api/premium        - 0.01 SOL paywall         ║
║   • POST /api/ai/generate    - 0.001 SOL per call       ║
║   • GET  /api/metered/data   - Session budget           ║
║                                                           ║
║   📚 Docs: https://github.com/JaspSoe/stakefy-x402      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
