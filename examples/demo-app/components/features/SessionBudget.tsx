'use client';

import { useState } from 'react';
import { useSessionBudget } from 'stakefy-x402-react';
import { useWallet } from '@solana/wallet-adapter-react';

export const SessionBudget = () => {
  const { publicKey } = useWallet();
  const { createBudget, makeBudgetPayment, loading, error } = useSessionBudget();
  const [totalAmount, setTotalAmount] = useState('');
  const [budgetId, setBudgetId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleCreateBudget = async () => {
    if (!publicKey || !totalAmount) return;
    
    const budget = await createBudget({
      totalAmount: parseFloat(totalAmount),
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    });
    
    if (budget) {
      setBudgetId(budget.id);
      setStatus(`Budget created: ${totalAmount} USDC`);
    }
  };

  const handleBudgetPayment = async () => {
    if (!budgetId || !recipient || !paymentAmount) return;
    
    const payment = await makeBudgetPayment({
      budgetId,
      amount: parseFloat(paymentAmount),
      recipient,
    });
    
    if (payment) {
      setStatus(`Payment sent: ${paymentAmount} USDC (no wallet popup!)`);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-2">Session Budget</h2>
      <p className="text-gray-500 mb-8">Pre-approve spending limit, pay without popups</p>
      
      {!budgetId ? (
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Total budget (USDC)"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="flex-1 px-6 py-4 bg-gray-100 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            disabled={!publicKey}
          />
          
          <button
            onClick={handleCreateBudget}
            disabled={loading || !publicKey || !totalAmount}
            className="px-12 py-4 bg-black text-white rounded-2xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Budget'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-2xl">
            <p className="text-sm font-semibold text-green-600">✅ Budget Active</p>
          </div>
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Recipient address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="flex-1 px-6 py-4 bg-gray-100 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            
            <input
              type="number"
              placeholder="Payment amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-64 px-6 py-4 bg-gray-100 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            
            <button
              onClick={handleBudgetPayment}
              disabled={loading || !recipient || !paymentAmount}
              className="px-12 py-4 bg-black text-white rounded-2xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Pay from Budget
            </button>
          </div>
        </div>
      )}
      
      {status && (
        <div className="mt-4 p-4 bg-purple-50 rounded-2xl">
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
