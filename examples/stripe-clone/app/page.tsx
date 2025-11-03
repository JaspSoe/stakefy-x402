'use client';

import { useState } from 'react';

const PLANS = [
  { name: 'Starter', price: 9.99, features: ['10 projects', 'Basic support', '1 GB storage'] },
  { name: 'Pro', price: 29.99, features: ['Unlimited projects', 'Priority support', '10 GB storage', 'API access'] },
  { name: 'Enterprise', price: 99.99, features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'Unlimited storage'] }
];

export default function StripeCl one() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planIndex: number) => {
    setLoading(true);
    setSelectedPlan(planIndex);
    
    // Simulate subscription via Stakefy
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Stripe Clone 💳
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Powered by Stakefy x402 - Monthly recurring payments on Solana
          </p>
          <p className="text-sm text-gray-500">
            Using <code className="bg-gray-200 px-2 py-1 rounded">perMonth()</code> preset
          </p>
        </div>

        {!subscribed ? (
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {PLANS.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-xl p-8 transition-all ${index === 1 ? 'ring-4 ring-indigo-500 scale-105' : 'hover:shadow-2xl'}`}>
                {index === 1 && (
                  <div className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-indigo-600">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(index)}
                  disabled={loading && selectedPlan === index}
                  className={`w-full py-3 px-6 rounded-xl font-bold transition-all ${
                    index === 1 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  } disabled:opacity-50`}
                >
                  {loading && selectedPlan === index ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to {PLANS[selectedPlan!].name}!
              </h2>
              <p className="text-gray-600 mb-6">
                Your subscription is active. Billing ${PLANS[selectedPlan!].price}/month via Stakefy.
              </p>

              <div className="bg-indigo-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Your Features:</h3>
                <ul className="space-y-2">
                  {PLANS[selectedPlan!].features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-sm text-gray-500">
                <p>💳 Auto-renews monthly via Stakefy payment channel</p>
                <p>🔒 0.1% platform fee (vs 2.9% on Stripe)</p>
                <p>⚡ Settled on Solana in 400ms</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6">
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="font-bold mb-2">Choose Plan</h4>
              <p className="text-sm text-gray-600">Pick the subscription tier that fits your needs</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="font-bold mb-2">Pay with Solana</h4>
              <p className="text-sm text-gray-600">One-time approval for recurring monthly payments</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="font-bold mb-2">Auto-Renew</h4>
              <p className="text-sm text-gray-600">Payment channel handles monthly billing automatically</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>Powered by Stakefy x402 SDK</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="https://github.com/JaspSoe/stakefy-x402" className="hover:text-indigo-600">GitHub</a>
            <span>•</span>
            <a href="https://npmjs.com/package/x402-stakefy-sdk" className="hover:text-indigo-600">NPM</a>
          </div>
        </div>
      </div>
    </div>
  );
}
