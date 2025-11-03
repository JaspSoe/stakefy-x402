export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Stakefy x402
          </h1>
          <p className="text-xl text-gray-600">
            Complete Solana Payment Infrastructure
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-semibold mb-4">🚀 Live Demo</h2>
          <p className="text-gray-700 mb-6">
            This is a working demonstration of Stakefy's x402 payment components. 
            Try our interactive paywall to see how easy it is to monetize content!
          </p>
          
          <a 
            href="/report" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Try the Demo →
          </a>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">💎</div>
            <h3 className="text-xl font-semibold mb-2">React Components</h3>
            <p className="text-gray-600">
              Drop-in Paywall and SessionBudget components. Lock content with a single line of code.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">⚡️</div>
            <h3 className="text-xl font-semibold mb-2">One-Line Init</h3>
            <p className="text-gray-600">
              StakefyX402Client.auto() - that's it. No complex configuration needed.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-xl font-semibold mb-2">On-Chain Verification</h3>
            <p className="text-gray-600">
              Real blockchain verification. No trust required, all payments are verifiable.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-xl font-semibold mb-2">0.1% Fees</h3>
            <p className="text-gray-600">
              10x cheaper than alternatives. Keep more of what you earn.
            </p>
          </div>
        </div>

        {/* Installation */}
        <div className="bg-gray-900 text-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📦 Installation</h2>
          <div className="bg-gray-800 rounded p-4 font-mono text-sm mb-4">
            npm install x402-stakefy-sdk
          </div>
          <p className="text-gray-300">
            One package includes everything: Core SDK, React components, Express middleware, and more!
          </p>
        </div>

        {/* Quick Example */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">🎯 Quick Example</h2>
          <pre className="bg-gray-100 rounded p-4 overflow-x-auto text-sm">
{`import { Paywall, SessionBudget } from 'x402-stakefy-sdk';

function PremiumContent() {
  return (
    <>
      <SessionBudget 
        scope="article" 
        maxCents={300} 
        ttlMinutes={60} 
      />
      
      <Paywall endpoint="/api/premium" scope="article">
        <div>🎉 Premium content unlocked!</div>
      </Paywall>
    </>
  );
}`}
          </pre>
        </div>

        {/* Links */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-semibold mb-4">🔗 Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="https://github.com/JaspSoe/stakefy-x402" 
              target="_blank"
              className="bg-white/10 hover:bg-white/20 rounded p-4 transition"
            >
              <div className="font-semibold mb-1">📚 Documentation</div>
              <div className="text-sm text-blue-100">Full guides and API reference</div>
            </a>
            
            <a 
              href="https://npmjs.com/package/x402-stakefy-sdk" 
              target="_blank"
              className="bg-white/10 hover:bg-white/20 rounded p-4 transition"
            >
              <div className="font-semibold mb-1">📦 NPM Package</div>
              <div className="text-sm text-blue-100">View on NPM registry</div>
            </a>
            
            <a 
              href="https://github.com/JaspSoe/stakefy-x402/blob/main/QUICKSTART.md" 
              target="_blank"
              className="bg-white/10 hover:bg-white/20 rounded p-4 transition"
            >
              <div className="font-semibold mb-1">⚡️ Quickstart</div>
              <div className="text-sm text-blue-100">Get started in 5 minutes</div>
            </a>
            
            <a 
              href="https://twitter.com/stakefy" 
              target="_blank"
              className="bg-white/10 hover:bg-white/20 rounded p-4 transition"
            >
              <div className="font-semibold mb-1">🐦 Twitter</div>
              <div className="text-sm text-blue-100">Follow for updates</div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>Built with ❤️ by <a href="https://twitter.com/stakefy" className="text-blue-600 hover:underline">@stakefy</a></p>
        </div>
      </div>
    </div>
  );
}
