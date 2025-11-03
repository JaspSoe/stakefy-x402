'use client';

import { useState } from 'react';
import { StakefyX402Client } from 'x402-stakefy-sdk';

// Toggle between mainnet and devnet
const NETWORK: 'mainnet-beta' | 'devnet' = 'devnet'; // Change to 'mainnet-beta' for production

const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: NETWORK
});

const MERCHANT_WALLET = 'YOUR_WALLET_ADDRESS_HERE'; // Replace with your wallet

export default function Home() {
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const handlePaywall = async () => {
    setLoading(true);
    try {
      const payment = await client.createPayment({
        amount: 0.1,
        merchantId: MERCHANT_WALLET,
        reference: `article-${Date.now()}`
      });
      
      setPaymentUrl(payment.solanaPayUrl);
      
      setTimeout(() => {
        setIsPaid(true);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Network Badge */}
        <div className="mb-4 text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            NETWORK === 'mainnet-beta' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {NETWORK === 'mainnet-beta' ? '🟢 Mainnet' : '🟡 Devnet (Test Mode)'}
          </span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Premium Content 🔒
          </h1>
          <p className="text-xl text-gray-600">
            Powered by Stakefy x402 - Pay only 0.1 USDC to unlock
          </p>
          {NETWORK === 'devnet' && (
            <p className="text-sm text-yellow-600 mt-2">
              Running on devnet - Use devnet USDC for testing
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {!isPaid ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  The Secret to 10x Growth 🚀
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  This article reveals strategies used by top SaaS companies to achieve 
                  exponential growth. Learn about customer acquisition...
                </p>
                <div className="mt-4 h-32 bg-gradient-to-b from-transparent to-white relative">
                  <div className="absolute inset-0 backdrop-blur-sm" />
                </div>
              </div>

              <div className="border-t pt-8">
                <div className="bg-purple-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Unlock Full Article</h3>
                      <p className="text-gray-600">One-time payment, lifetime access</p>
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                      0.1 USDC
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>✅ Instant access after payment</div>
                    <div>✅ Powered by Solana (400ms settlement)</div>
                    <div>✅ Only 0.1% fee (vs 1-2% elsewhere)</div>
                  </div>
                </div>

                <button
                  onClick={handlePaywall}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all"
                >
                  {loading ? 'Processing...' : `Pay 0.1 USDC & Unlock ${NETWORK === 'devnet' ? '(Devnet)' : ''}`}
                </button>

                {paymentUrl && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">Payment URL:</p>
                    <a 
                      href={paymentUrl}
                      className="text-blue-600 hover:underline break-all text-sm"
                    >
                      {paymentUrl}
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-green-800 font-semibold">
                  ✅ Payment Verified! Welcome to premium content.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                The Secret to 10x Growth 🚀
              </h2>
              
              <div className="space-y-6 text-gray-700">
                <p>Full article content here...</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-8">1. Product-Market Fit First</h3>
                <p>Before scaling, ensure genuine PMF...</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-8">2. Distribution Beats Product</h3>
                <p>Winners have best distribution...</p>
              </div>

              <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
                Powered by <strong>Stakefy x402</strong> on {NETWORK === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Demo using Stakefy x402 SDK</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a href="https://github.com/JaspSoe/stakefy-x402" className="hover:text-purple-600">GitHub</a>
            <span>•</span>
            <a href="https://npmjs.com/package/x402-stakefy-sdk" className="hover:text-purple-600">NPM</a>
          </div>
        </div>
      </div>
    </div>
  );
}
