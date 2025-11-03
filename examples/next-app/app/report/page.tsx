'use client'

import { Paywall, SessionBudget } from '@stakefy/x402/react'

export default function Page() {
  return (
    <main style={{ maxWidth: 600, margin: '60px auto', padding: 20 }}>
      <h1>Stakefy x402 Demo</h1>

      {/* Give the user a 300¢ budget for 60 minutes on scope "report" */}

      <Paywall endpoint="/api/report" scope="report">
        <div style={{ marginTop: 20, padding: 20, border: '1px solid #444', borderRadius: 12 }}>
          <strong>Unlocked!</strong><br/>
          Auto-unlocked by Session Budget when possible.
        </div>
      </Paywall>

      <p style={{ marginTop: 20 }}>
        (Demo) Session budget auto-pays if price ≤ remaining budget.
      </p>
    </main>
  )
}
