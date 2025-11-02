'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useStakefyClient, useUsername, useStakefyPayment } from 'x402-stakefy-react';

export default function Home() {
  const { publicKey } = useWallet();
  const client = useStakefyClient();
  const { registerUsername, getUserProfile, profile, loading: usernameLoading, error: usernameError } = useUsername({ client });
  const { createPayment, loading: paymentLoading, payment, error: paymentError } = useStakefyPayment({ client });
  
  const [username, setUsername] = useState('');
  const [tipUsername, setTipUsername] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleRegister = async () => {
    if (!publicKey || !username) return;
    
    try {
      await registerUsername({
        username,
        publicKey: publicKey.toString(),
      });
      setRegistered(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTip = async () => {
    if (!tipUsername || !tipAmount) return;
    
    try {
      const result = await createPayment({
        amount: parseFloat(tipAmount),
        merchantId: `tipjar-${tipUsername}`,
        reference: `tip-${Date.now()}`,
        metadata: { type: 'tip', to: tipUsername }
      });
      
      console.log('Tip created:', result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">💰</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TipJar
            </h1>
          </div>
          <WalletMultiButton />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {!publicKey ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Support Creators with Crypto Tips</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Register your @username and start receiving tips on Solana
            </p>
            <WalletMultiButton />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Register Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Register Your @Username</h2>
              <p className="text-gray-600 mb-6">Create your tip page and start receiving support</p>
              
              {!registered ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                  />
                  
                  <button
                    onClick={handleRegister}
                    disabled={usernameLoading || !username}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {usernameLoading ? 'Registering...' : 'Register @Username'}
                  </button>
                  
                  {usernameError && (
                    <p className="text-red-500 text-sm">{usernameError}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                    <p className="text-green-800 font-semibold text-lg">✅ Registered!</p>
                    <p className="text-green-700 mt-2">Your tip page: <span className="font-mono">tipjar.stakefy.io/@{username}</span></p>
                  </div>
                  
                  {profile && (
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <p className="text-sm text-gray-700">Total Tips Received</p>
                      <p className="text-2xl font-bold text-purple-600">${profile.totalVolume} USDC</p>
                      <p className="text-xs text-gray-600 mt-1">{profile.totalTransactions} transactions</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Send Tip Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send a Tip</h2>
              <p className="text-gray-600 mb-6">Support your favorite creator</p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="@username"
                  value={tipUsername}
                  onChange={(e) => setTipUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                />
                
                <input
                  type="number"
                  placeholder="Amount (USDC)"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                />
                
                <button
                  onClick={handleCreateTip}
                  disabled={paymentLoading || !tipUsername || !tipAmount}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {paymentLoading ? 'Creating Tip...' : `Tip $${tipAmount || '0'} USDC`}
                </button>
                
                {paymentError && (
                  <p className="text-red-500 text-sm">{paymentError}</p>
                )}
                
                {payment && (
                  <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <p className="text-blue-800 font-semibold mb-3">💳 Payment Created!</p>
                    <p className="text-sm text-gray-700 mb-2">Scan QR code or use Solana Pay:</p>
                    <img src={payment.qrCode} alt="QR Code" className="w-48 h-48 mx-auto mb-3" />
                    <p className="text-xs text-gray-700 font-mono break-all">{payment.depositAddress}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">@Username System</h3>
            <p className="text-gray-600 text-sm">No more ugly wallet addresses. Just @yourname</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Instant Tips</h3>
            <p className="text-gray-600 text-sm">Powered by Solana - fast and cheap transactions</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">0.1% Fees</h3>
            <p className="text-gray-600 text-sm">Lower than any other payment platform</p>
          </div>
        </div>
      </main>
    </div>
  );
}
