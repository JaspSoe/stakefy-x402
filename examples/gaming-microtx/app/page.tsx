'use client';

import { useState } from 'react';

const ITEMS = [
  { id: 1, name: 'Health Potion', price: 0.01, emoji: '💊', type: 'consumable' },
  { id: 2, name: 'Sword Upgrade', price: 0.05, emoji: '⚔️', type: 'weapon' },
  { id: 3, name: 'Shield', price: 0.03, emoji: '🛡️', type: 'armor' },
  { id: 4, name: 'Magic Scroll', price: 0.02, emoji: '📜', type: 'spell' },
  { id: 5, name: 'Gold Coin Pack', price: 0.10, emoji: '💰', type: 'currency' },
  { id: 6, name: 'Legendary Skin', price: 0.50, emoji: '✨', type: 'cosmetic' }
];

export default function GamingMicrotx() {
  const [inventory, setInventory] = useState<number[]>([]);
  const [credits, setCredits] = useState(100);
  const [sessionActive, setSessionActive] = useState(false);

  const startSession = () => {
    setSessionActive(true);
    setCredits(100);
  };

  const buyItem = (itemId: number, price: number) => {
    if (credits > 0) {
      setInventory([...inventory, itemId]);
      setCredits(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">🎮 Web3 Game Shop</h1>
          <p className="text-xl text-blue-200 mb-2">
            In-game purchases with session budgets - No wallet popup spam!
          </p>
          <p className="text-sm text-blue-300">
            Using <code className="bg-blue-800 px-2 py-1 rounded">oneShot(100, 0.01)</code> - 100 items for $1
          </p>
        </div>

        {/* Session Status */}
        {!sessionActive ? (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-12 text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Start Gaming Session</h2>
            <p className="text-blue-100 mb-6">
              Approve once, buy 100 items without wallet popups
            </p>
            <button
              onClick={startSession}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition"
            >
              Start Session - Approve $1 Budget
            </button>
            <p className="text-sm text-blue-200 mt-4">
              ⚡ One approval = 100 purchases (average $0.01 each)
            </p>
          </div>
        ) : (
          <>
            {/* Credits Display */}
            <div className="bg-blue-900/50 rounded-xl p-6 mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Session Active</h3>
                <p className="text-blue-200">Buy items instantly - no popups!</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-yellow-400">{credits}</div>
                <div className="text-sm text-blue-200">Credits Remaining</div>
              </div>
            </div>

            {/* Item Shop */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {ITEMS.map((item) => {
                const owned = inventory.filter(id => id === item.id).length;
                
                return (
                  <div key={item.id} className="bg-blue-900/30 backdrop-blur rounded-xl p-6 border border-blue-500/30 hover:border-blue-400 transition">
                    <div className="text-6xl mb-3 text-center">{item.emoji}</div>
                    <h3 className="text-xl font-bold mb-2 text-center">{item.name}</h3>
                    <div className="text-center mb-4">
                      <span className="text-2xl font-bold text-yellow-400">${item.price}</span>
                      <span className="text-blue-300 text-sm ml-2">({Math.floor(item.price * 100)} credits)</span>
                    </div>
                    
                    {owned > 0 && (
                      <div className="bg-green-500/20 text-green-300 text-center py-1 px-3 rounded-lg mb-3 text-sm">
                        Owned: {owned}
                      </div>
                    )}
                    
                    <button
                      onClick={() => buyItem(item.id, item.price)}
                      disabled={credits === 0}
                      className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-bold transition"
                    >
                      {credits > 0 ? 'Buy Now' : 'No Credits'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Inventory */}
            <div className="bg-blue-900/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Your Inventory ({inventory.length} items)</h3>
              <div className="flex flex-wrap gap-2">
                {inventory.length === 0 ? (
                  <p className="text-blue-300">Buy items to see them here!</p>
                ) : (
                  inventory.map((itemId, index) => {
                    const item = ITEMS.find(i => i.id === itemId);
                    return (
                      <div key={index} className="bg-blue-800/50 px-3 py-2 rounded-lg text-sm">
                        {item?.emoji} {item?.name}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

        {/* How It Works */}
        <div className="mt-12 bg-blue-900/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Session Budgets Rock</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="font-bold mb-2">Approve Once</h3>
              <p className="text-sm text-blue-200">One wallet approval for entire session</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="font-bold mb-2">Buy 100 Items</h3>
              <p className="text-sm text-blue-200">No popup for each purchase</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="font-bold mb-2">Instant UX</h3>
              <p className="text-sm text-blue-200">Feels like Web2, secured by Web3</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-blue-300">
          <p>Powered by Stakefy x402 • Session budgets via oneShot()</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="https://github.com/JaspSoe/stakefy-x402" className="hover:text-white">GitHub</a>
            <span>•</span>
            <a href="https://npmjs.com/package/x402-stakefy-sdk" className="hover:text-white">NPM</a>
          </div>
        </div>
      </div>
    </div>
  );
}
