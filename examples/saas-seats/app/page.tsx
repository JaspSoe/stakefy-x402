'use client';

import { useState } from 'react';

const PRICE_PER_SEAT = 10; // $10 per seat per month

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function SaaSSeats() {
  const [seats, setSeats] = useState(5);
  const [subscribed, setSubscribed] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Member' },
  ]);

  const handleSubscribe = () => {
    setSubscribed(true);
  };

  const addSeat = () => {
    setSeats(prev => prev + 1);
  };

  const removeSeat = () => {
    if (seats > team.length) {
      setSeats(prev => prev - 1);
    }
  };

  const monthlyTotal = seats * PRICE_PER_SEAT;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            👥 Team Subscription Manager
          </h1>
          <p className="text-xl text-gray-600">
            Pay-per-seat billing with Stakefy x402
          </p>
        </div>

        {!subscribed ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Seat Selector */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Choose Team Size
              </h2>
              
              <div className="flex items-center justify-center gap-6 mb-8">
                <button
                  onClick={removeSeat}
                  disabled={seats <= 1}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 rounded-lg text-2xl font-bold"
                >
                  −
                </button>
                
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600">{seats}</div>
                  <div className="text-gray-600 mt-2">Team Members</div>
                </div>
                
                <button
                  onClick={addSeat}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-2xl font-bold"
                >
                  +
                </button>
              </div>

              {/* Pricing */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700">{seats} seats × ${PRICE_PER_SEAT}/month</span>
                  <span className="text-2xl font-bold text-blue-600">${monthlyTotal}/mo</span>
                </div>
                <div className="text-sm text-gray-600">
                  💳 Billed monthly via payment channel
                  <br />
                  ⚡ Auto-renews, cancel anytime
                  <br />
                  🎯 0.1% fee = ${(monthlyTotal * 0.001).toFixed(2)}/month
                </div>
              </div>

              {/* Features Included */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-bold text-gray-900 mb-2">✅ Included</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Unlimited projects</li>
                    <li>• Priority support</li>
                    <li>• API access</li>
                    <li>• Custom integrations</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-bold text-gray-900 mb-2">💰 Billing</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Add/remove seats anytime</li>
                    <li>• Prorated billing</li>
                    <li>• No commitments</li>
                    <li>• Cancel anytime</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={handleSubscribe}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition"
              >
                Subscribe - ${monthlyTotal}/month
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Subscription Status */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Active Subscription
                  </h2>
                  <p className="text-gray-600">
                    {seats} seats • ${monthlyTotal}/month
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold mb-2">
                    ✅ ACTIVE
                  </div>
                  <div className="text-sm text-gray-600">
                    Next billing: Dec 3, 2025
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addSeat}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
                >
                  + Add Seat
                </button>
                <button
                  onClick={removeSeat}
                  disabled={seats <= team.length}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 font-bold py-3 rounded-lg"
                >
                  − Remove Seat
                </button>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Team Members ({team.length}/{seats})
                </h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold">
                  + Invite Member
                </button>
              </div>

              <div className="space-y-3">
                {team.map((member) => (
                  <div key={member.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {member.role}
                      </span>
                      <button className="text-gray-400 hover:text-red-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                
                {seats > team.length && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                    {seats - team.length} seat{seats - team.length > 1 ? 's' : ''} available
                  </div>
                )}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{team.length}</div>
                <div className="text-gray-600">Active Members</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">${monthlyTotal}</div>
                <div className="text-gray-600">Monthly Cost</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">${(monthlyTotal * 0.001).toFixed(2)}</div>
                <div className="text-gray-600">Platform Fee (0.1%)</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>Powered by Stakefy x402 • Dynamic seat management with perMonth()</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="https://github.com/JaspSoe/stakefy-x402" className="hover:text-blue-600">GitHub</a>
            <span>•</span>
            <a href="https://npmjs.com/package/x402-stakefy-sdk" className="hover:text-blue-600">NPM</a>
          </div>
        </div>
      </div>
    </div>
  );
}
