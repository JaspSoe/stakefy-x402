'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { BasicPayment } from '@/components/features/BasicPayment';
import { SessionBudget } from '@/components/features/SessionBudget';
import { UsernamePayment } from '@/components/features/UsernamePayment';
import { PaymentChannel } from '@/components/features/PaymentChannel';
import Image from 'next/image';

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-12 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden">
              <Image src="/stakefy-logo.png" alt="Stakefy" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Stakefy x402 Demo Site</h1>
              <p className="text-sm text-gray-400">Open-source x402 Solana Payment Infrastructure</p>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <a href="#" className="text-sm font-medium hover:text-gray-600">Website</a>
            <a href="https://github.com/JaspSoe/stakefy-x402" className="text-sm font-medium hover:text-gray-600">Github</a>
            <a href="#" className="text-sm font-medium hover:text-gray-600">Npm Packages</a>
            <a href="#" className="text-sm font-medium hover:text-gray-600">Client SDK</a>
            <a href="#" className="text-sm font-medium hover:text-gray-600">Merchant SDK</a>
            <div className="wallet-button-wrapper ml-4">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-12 py-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-8 mb-24">
          <div className="bg-[#f5f5f5] rounded-[32px] p-12">
            <h3 className="text-[56px] font-semibold leading-none mb-4">0.1% Fee</h3>
            <p className="text-sm text-gray-500 font-medium">Competition: 1-2%</p>
          </div>
          
          <div className="bg-[#f5f5f5] rounded-[32px] p-12">
            <h3 className="text-[56px] font-semibold leading-none mb-4">100%</h3>
            <p className="text-sm text-gray-500 font-medium">Open-Source</p>
          </div>
          
          <div className="bg-[#f5f5f5] rounded-[32px] p-12">
            <h3 className="text-[56px] font-semibold leading-none mb-4">x402</h3>
            <p className="text-sm text-gray-500 font-medium">Compliant</p>
          </div>
          
          <div className="bg-[#f5f5f5] rounded-[32px] p-12">
            <h3 className="text-[56px] font-semibold leading-none mb-4">@username</h3>
            <p className="text-sm text-gray-500 font-medium">instead of AbC13415...</p>
          </div>
        </div>

        {/* Feature Sections */}
        {publicKey ? (
          <div className="space-y-24">
            <BasicPayment />
            <SessionBudget />
            <UsernamePayment />
            <PaymentChannel />
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Connect Your Wallet to Get Started
            </h2>
            <p className="text-gray-600">
              Try all 4 features: Payments, Budgets, Usernames, and Channels
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
