# Express.js API Example - Stakefy x402 SDK

REST API built with Express.js using `x402-stakefy-sdk`.

## Features

- ✅ Create payments with QR codes
- ✅ Verify payments
- ✅ Register @usernames
- ✅ Session budgets
- ✅ Webhook handling (merchant features)

## Setup
```bash
npm install
npm run dev
```

## API Endpoints

### Create Payment
```bash
curl -X POST http://localhost:3001/api/payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10,
    "merchantId": "my-store",
    "reference": "order-123"
  }'
```

### Verify Payment
```bash
curl http://localhost:3001/api/payment/{sessionId}/verify
```

### Register Username
```bash
curl -X POST http://localhost:3001/api/username \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "publicKey": "YOUR_WALLET_ADDRESS"
  }'
```

### Get User Profile
```bash
curl http://localhost:3001/api/username/alice
```

### Create Budget
```bash
curl -X POST http://localhost:3001/api/budget \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "duration": 3600,
    "userPublicKey": "YOUR_WALLET",
    "merchantId": "my-store"
  }'
```

## Tech Stack

- Express.js
- TypeScript
- x402-stakefy-sdk
- Cors

## License

MIT
