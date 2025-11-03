'use client';

import { useState } from 'react';

export default function QRPOS() {
  const [amount, setAmount] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);

  const generateQR = () => {
    if (parseFloat(amount) > 0) {
      setQrGenerated(true);
    }
  };

  const reset = () => {
    setAmount('');
    setQrGenerated(false);
  };

  const addDigit = (digit: string) => {
    setAmount(prev => prev + digit);
  };

  const clear = () => {
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">💳 Solana POS Terminal</h1>
          <p className="text-xl text-gray-600">
            QR Code payments powered by Stakefy x402
          </p>
        </div>

        {!qrGenerated ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Amount Display */}
            <div className="mb-8">
              <div className="text-center text-6xl font-bold text-gray-900 mb-2 min-h-[80px] flex items-center justify-center">
                ${amount || '0.00'}
              </div>
              <div className="text-center text-gray-500">USDC Amount</div>
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
                <button
                  key={key}
                  onClick={() => key === '⌫' ? clear() : addDigit(key)}
                  className="bg-gray-100 hover:bg-gray-200 text-2xl font-bold py-6 rounded-xl transition"
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQR}
              disabled={!amount || parseFloat(amount) === 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-xl font-bold py-6 rounded-xl transition"
            >
              Generate QR Code
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            {/* QR Code Display */}
            <div className="bg-gray-100 p-8 rounded-xl mb-6 inline-block">
              <div className="w-64 h-64 bg-white flex items-center justify-center text-8xl">
                📱
              </div>
            </div>

            <div className="text-4xl font-bold text-gray-900 mb-2">
              ${amount} USDC
            </div>
            <p className="text-gray-600 mb-8">
              Customer scans QR code with Solana wallet
            </p>

            {/* Payment Status */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
              <div className="text-green-600 font-bold mb-2">✅ Payment Received!</div>
              <div className="text-sm text-gray-600">
                Transaction confirmed in 400ms
              </div>
            </div>

            {/* Receipt */}
            <div className="bg-gray-50 rounded-xl p-6 text-left mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Receipt</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-mono">${amount} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee (0.1%):</span>
                  <span className="font-mono">${(parseFloat(amount) * 0.001).toFixed(4)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="font-mono">${amount}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-4">
                  <span>Time:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition"
            >
              New Transaction
            </button>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold mb-2">Instant Settlement</h3>
            <p className="text-sm text-gray-600">400ms on Solana vs 3-5 days traditional</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-bold mb-2">0.1% Fees</h3>
            <p className="text-sm text-gray-600">vs 2.9% + $0.30 on credit cards</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="font-bold mb-2">Global Payments</h3>
            <p className="text-sm text-gray-600">Accept USDC from anywhere</p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Powered by Stakefy x402 • QR Code POS Terminal</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="https://github.com/JaspSoe/stakefy-x402" className="hover:text-green-600">GitHub</a>
            <span>•</span>
            <a href="https://npmjs.com/package/x402-stakefy-sdk" className="hover:text-green-600">NPM</a>
          </div>
        </div>
      </div>
    </div>
  );
}
