'use client';

import { useState } from 'react';
import { payToX } from 'x402-stakefy-sdk';

const CREATOR = '@creator';
const CONTENT_PRICE = 0.5; // $0.50 per content

const CONTENT_ITEMS = [
  { id: 1, title: 'Premium Tutorial Video', type: 'video', thumbnail: '��', preview: 'Learn advanced techniques...' },
  { id: 2, title: 'Exclusive Photos', type: 'image', thumbnail: '📸', preview: 'Behind the scenes content...' },
  { id: 3, title: 'Secret Strategy Guide', type: 'pdf', thumbnail: '📄', preview: 'My personal playbook...' }
];

export default function ContentPaywall() {
  const [unlocked, setUnlocked] = useState<number[]>([]);
  const [loading, setLoading] = useState<number | null>(null);

  const handleUnlock = async (contentId: number) => {
    setLoading(contentId);
    
    // Simulate payment to creator
    setTimeout(() => {
      setUnlocked([...unlocked, contentId]);
      setLoading(null);
    }, 2000);
  };

  const handleTip = async (amount: number) => {
    alert(`Tipped ${CREATOR} $${amount}! (via payToX)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Creator Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Content Creator
              </h1>
              <p className="text-gray-600 mb-4">
                {CREATOR} • Premium content, pay-per-view • Powered by Stakefy
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleTip(1)} className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600">
                  Tip $1 💝
                </button>
                <button onClick={() => handleTip(5)} className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
                  Tip $5 ⭐
                </button>
                <button onClick={() => handleTip(10)} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
                  Tip $10 🚀
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {CONTENT_ITEMS.map((item) => {
            const isUnlocked = unlocked.includes(item.id);
            const isLoading = loading === item.id;

            return (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`h-48 flex items-center justify-center text-6xl ${isUnlocked ? 'bg-gradient-to-br from-green-100 to-blue-100' : 'bg-gray-200 blur-sm'}`}>
                  {item.thumbnail}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.preview}</p>
                  
                  {!isUnlocked ? (
                    <button
                      onClick={() => handleUnlock(item.id)}
                      disabled={isLoading}
                      className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-pink-600 disabled:opacity-50"
                    >
                      {isLoading ? 'Unlocking...' : `Unlock for $${CONTENT_PRICE}`}
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="bg-green-100 text-green-800 py-2 px-4 rounded-lg font-bold mb-3">
                        ✅ Unlocked!
                      </div>
                      <button className="text-pink-600 hover:text-pink-700 font-medium">
                        View Content →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-white rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">👀</div>
              <h3 className="font-bold mb-2">Browse Content</h3>
              <p className="text-sm text-gray-600">See previews of premium content</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold mb-2">Pay to Unlock</h3>
              <p className="text-sm text-gray-600">Pay once, access forever</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💝</div>
              <h3 className="font-bold mb-2">Tip Creators</h3>
              <p className="text-sm text-gray-600">Support with payToX(@username)</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Powered by Stakefy x402 • 0.1% fees • Pay by @username</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="https://github.com/JaspSoe/stakefy-x402" className="hover:text-pink-600">GitHub</a>
            <span>•</span>
            <a href="https://npmjs.com/package/x402-stakefy-sdk" className="hover:text-pink-600">NPM</a>
          </div>
        </div>
      </div>
    </div>
  );
}
