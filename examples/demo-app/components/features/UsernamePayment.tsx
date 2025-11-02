'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export const UsernamePayment = () => {
  const { publicKey } = useWallet();
  const [username, setUsername] = useState('');
  const [payUsername, setPayUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterUsername = async () => {
    if (!publicKey || !username) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://stakefy-x402-production.up.railway.app/api/username/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          walletAddress: publicKey.toString(),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus(`Username @${username} registered! 🎉`);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayToUsername = async () => {
    if (!publicKey || !payUsername || !amount) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://stakefy-x402-production.up.railway.app/api/username/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: payUsername,
          amount: parseFloat(amount),
          senderAddress: publicKey.toString(),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus(`Sent ${amount} USDC to @${payUsername} ✅`);
      } else {
        setError(data.error || 'Payment failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-2">@Username Payments</h2>
      <p className="text-gray-500 mb-8">Pay to @username instead of wallet addresses</p>
      
      <div className="space-y-8">
        {/* Register Username Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Register Username</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-6 py-4 bg-gray-100 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={!publicKey}
            />
            
            <button
              onClick={handleRegisterUsername}
              disabled={loading || !publicKey || !username}
              className="px-12 py-4 bg-black text-white rounded-2xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Registering...' : 'Register @Username'}
            </button>
          </div>
        </div>
        
        {/* Pay to Username Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Pay to Username</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="@username"
              value={payUsername}
              onChange={(e) => setPayUsername(e.target.value)}
              className="flex-1 px-6 py-4 bg-gray-100 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={!publicKey}
            />
            
            <input
              type="number"
              placeholder="Amount (USDC)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-64 px-6 py-4 bg-gray-100 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={!publicKey}
            />
            
            <button
              onClick={handlePayToUsername}
              disabled={loading || !publicKey || !payUsername || !amount}
              className="px-12 py-4 bg-black text-white rounded-2xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Pay to @Username'}
            </button>
          </div>
        </div>
      </div>
      
      {status && (
        <div className="mt-4 p-4 bg-green-50 rounded-2xl">
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
