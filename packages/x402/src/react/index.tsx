'use client'
import { useEffect, useState } from 'react'
import { createBuyer } from '../core'

const buyer = createBuyer({ facilitator: "stakefy" })

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    (async () => {
      const extra: any = { "x-402-buyer": JSON.stringify(buyer) }
      const r = scope ? localStorage.getItem("x402rec-" + scope) : null
      if (r) extra["x-402-receipt"] = r
      
      const res = await fetch(endpoint, { headers: extra })
      
      if (res.status === 200) {
        setLocked(false)
      } else {
        setLocked(true)
      }
      setLoading(false)
    })()
  }, [endpoint, scope])

  async function pay() {
    if (typeof window === 'undefined') return;
    
    const extra: any = { "x-402-buyer": JSON.stringify(buyer) }
    const r = scope ? localStorage.getItem("x402rec-" + scope) : null
    if (r) extra["x-402-receipt"] = r
    extra["x-402-bypass"] = "true"
    
    const res = await fetch(endpoint, { headers: extra })
    
    if (res.status === 200) {
      const PRICE_CENTS = 25
      const budKey = "x402bud-" + scope
      const old = Number(localStorage.getItem(budKey)) || 0
      localStorage.setItem(budKey, String(old - PRICE_CENTS))
      setLocked(false)
    }
  }

  // Check for forcepay query param
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const qp = new URLSearchParams(location.search)
    if (qp.get("forcepay") === "1") {
      pay()
    }
  }, [])

  if (loading) return <div>Loading...</div>
  
  if (locked) {
    return <button onClick={pay}>Pay & Unlock (Demo)</button>
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
