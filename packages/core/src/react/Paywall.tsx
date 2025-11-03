import React from 'react'
import { useEffect, useState } from 'react'

// Simple buyer for demo - no actual blockchain interaction yet
const buyer = { facilitator: "stakefy" }

export function Paywall({ 
  endpoint = '/api/report', 
  scope, 
  children 
}: { 
  endpoint?: string
  scope?: string
  children?: React.ReactNode 
}) {
  const [locked, setLocked] = useState(true)
  const [loading, setLoading] = useState(true)
  const [hasPaid, setHasPaid] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if already paid in this session
    const paidKey = "x402paid-" + scope
    const alreadyPaid = localStorage.getItem(paidKey) === 'true'
    
    if (alreadyPaid) {
      setHasPaid(true)
      setLocked(false)
      setLoading(false)
      return
    }
    
    // Otherwise start locked
    setLocked(true)
    setLoading(false)
  }, [endpoint, scope])

  async function pay() {
    if (typeof window === 'undefined') return;
    
    const extra: any = { 
      "x-402-buyer": JSON.stringify(buyer),
      "x-402-bypass": "true"
    }
    
    const r = scope ? localStorage.getItem("x402rec-" + scope) : null
    if (r) extra["x-402-receipt"] = r
    
    const res = await fetch(endpoint, { headers: extra })
    
    if (res.status === 200) {
      const PRICE_CENTS = 25
      const budKey = "x402bud-" + scope
      const paidKey = "x402paid-" + scope
      
      const old = Number(localStorage.getItem(budKey)) || 0
      localStorage.setItem(budKey, String(old - PRICE_CENTS))
      localStorage.setItem(paidKey, 'true')
      
      setHasPaid(true)
      setLocked(false)
    }
  }

  // Check for forcepay query param
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const qp = new URLSearchParams(location.search)
    if (qp.get("forcepay") === "1" && !hasPaid) {
      pay()
    }
  }, [hasPaid])

  if (loading) return <div>Loading...</div>
  
  if (locked) {
    return (
      <div className="p-6 border-2 border-gray-300 rounded">
        <h2 className="text-xl mb-2">🔒 Locked Content</h2>
        <p className="mb-4">This content requires payment to access.</p>
        <button 
          onClick={pay}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Pay & Unlock (Demo)
        </button>
      </div>
    )
  }
  
  return <>{children}</>
}

export function SessionBudget({ 
  scope, 
  maxCents, 
  ttlMinutes 
}: { 
  scope: string
  maxCents: number
  ttlMinutes: number 
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const budKey = "x402bud-" + scope
    const recKey = "x402rec-" + scope
    
    const c = Number(localStorage.getItem(budKey)) || maxCents
    localStorage.setItem(budKey, String(c))
    
    const base64 = btoa(JSON.stringify({
      type: "budget",
      cents: c,
      exp: Date.now() + ttlMinutes * 60000
    }))
    localStorage.setItem(recKey, base64)
  }, [scope, maxCents, ttlMinutes])
  
  return null
}
