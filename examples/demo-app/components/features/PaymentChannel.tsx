'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export const PaymentChannel = () => {
  const { publicKey } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [deposit, setDeposit] = useState('');
  const [channelId, setChannelId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [payments, setPayments] = useState<number>(0);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateChannel = async () => {
    if (!publicKey || !recipient || !deposit) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://stakefy-x402-production.up.railway.app/api/channel/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: publicKey.toString(),
          recipient,
          depositAmount: parseFloat(deposit),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setChannelId(data.channelId);
        setStatus(`Channel created with ${deposit} USDC deposit`);
      } else {
        setError(data.error || 'Channel creation failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleChannelPayment = async () => {
    if (!channelId || !paymentAmount) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://stakefy-x402-production.up.railway.app/api/channel/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId,
          amount: parseFloat(paymentAmount),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPayments(prev => prev + 1);
        setStatus(`Off-chain payment #${payments + 1} sent (${paymentAmount} USDC)`);
        setPaymentAmount('');
      } else {
        setError(data.error || 'Payment failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSettleChannel = async () => {
    if (!channelId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://stakefy-x402-production.up.railway.app/api/channel/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus(`✅ Channel settled! ${payments} payments → 1 on-chain tx`);
      } else {
        setError(data.error || 'Settlement failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-2">Payment Channels</h2>
      <p className="text-gray-500 mb-8">Off-chain micro-payments with batch settlement</p>
      
      {!channelId ? (
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="flex-1 px-6 py-4 bg-gray-100 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            disabled={!publicKey}
          />
          
          <input
            type="number"
            placeholder="Deposit amount (USDC)"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="w-64 px-6 py-4 bg-gray-100 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            disabled={!publicKey}
          />
          
          <button
            onClick={handleCreateChannel}
            disabled={loading || !publicKey || !recipient || !deposit}
            className="px-12 py-4 bg-black text-white rounded-2xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Channel'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
            <p className="text-sm font-semibold text-green-600">✅ Channel Active</p>
            <p className="text-sm text-gray-600">{payments} payments sent</p>
          </div>
          
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Payment amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="flex-1 px-6 py-4 bg-gray-100 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            
            <button
              onClick={handleChannelPayment}
              disabled={loading || !paymentAmount}
              className="px-12 py-4 bg-black text-white rounded-2xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Send Off-Chain Payment
            </button>
            
            <button
              onClick={handleSettleChannel}
              disabled={loading || payments === 0}
              className="px-12 py-4 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Settle Channel
            </button>
          </div>
        </div>
      )}
      
      {status && (
        <div className="mt-4 p-4 bg-orange-50 rounded-2xl">
          <p className="text-sm">{status}</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-2xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
