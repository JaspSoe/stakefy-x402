'use client';

import { useState } from 'react';
import { useStakefyPayment } from 'stakefy-x402-react';
import { useWallet } from '@solana/wallet-adapter-react';

export const BasicPayment = () => {
  const { publicKey } = useWallet();
  const { createPayment, verifyPayment, loading, error } = useStakefyPayment();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [status, setStatus] = useState('');

  const handleCreatePayment = async () => {
    if (!publicKey || !recipient || !amount) return;
    
    const payment = await createPayment({
      amount: parseFloat(amount),
      recipient,
      description: 'Basic payment demo',
    });
    
    if (payment) {
      setPaymentId(payment.id);
      setStatus('Payment created');
    }
  };

  const handleVerifyPayment = async () => {
    if (!paymentId) return;
    
    const result = await verifyPayment(paymentId);
    setStatus(result.verified ? 'Payment verified ✅' : 'Payment failed ❌');
  };

  return (
    <div>
      <h2 className="text-4xl font-semibold mb-3">Basic Payment</h2>
      <p className="text-gray-400 mb-10">Send USDC directly to a wallet adress or just use the @username</p>
      
      <div className="grid grid-cols-[1.5fr,0.8fr,auto] gap-4 items-start">
        <input
          type="text"
          placeholder="Recipient wallet adress or X @username"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="px-6 py-5 bg-gray-50 rounded-2xl border-none text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          disabled={!publicKey}
        />
        
        <input
          type="number"
          placeholder="Amount (USDC)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-6 py-5 bg-gray-50 rounded-2xl border-none text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          disabled={!publicKey}
        />
        
        <button
          onClick={handleCreatePayment}
          disabled={loading || !publicKey || !recipient || !amount}
          className="px-16 py-5 bg-black text-white rounded-2xl font-medium text-base hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {loading ? 'Processing...' : 'Create Payment'}
        </button>
      </div>
      
      {paymentId && (
        <button
          onClick={handleVerifyPayment}
          disabled={loading}
          className="mt-4 px-10 py-4 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 disabled:bg-gray-300"
        >
          Verify Payment
        </button>
      )}
      
      {status && (
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
          <p className="text-sm">{status}</p>
          {paymentId && <p className="text-xs text-gray-600 mt-1">ID: {paymentId}</p>}
        </div>
      )}
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-2xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
