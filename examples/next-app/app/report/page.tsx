'use client'
import { Paywall, SessionBudget } from 'x402-stakefy-sdk'

export default function ReportPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Protected Report</h1>
      
      <SessionBudget scope="report" maxCents={300} ttlMinutes={60} />
      
      <Paywall endpoint="/api/report" scope="report">
        <div className="bg-green-100 p-6 rounded">
          <h2 className="text-xl font-semibold mb-2">✅ Unlocked Content</h2>
          <p>This is premium content that requires payment to access.</p>
          <p className="mt-4">You have successfully unlocked this report!</p>
        </div>
      </Paywall>
    </div>
  )
}
