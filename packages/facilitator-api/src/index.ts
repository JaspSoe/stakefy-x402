import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log('📥 REQUEST:', req.method, req.path, req.body);
  }
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'stakefy-x402-facilitator' });
});

app.use('/api', routes);

app.listen(config.port, () => {
  console.log('🚀 Facilitator running on port', config.port);
  console.log('📊 Logging enabled');
});
