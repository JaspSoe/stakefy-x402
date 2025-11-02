import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'stakefy-x402-facilitator' });
});

// API routes
app.use('/api', routes);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Stakefy x402 Facilitator API running on port ${config.port}`);
  console.log(`📡 Connected to: ${config.rpcUrl}`);
  console.log(`💰 Fee: ${config.feePercentage}%`);
});
