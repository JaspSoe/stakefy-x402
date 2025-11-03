import { NextRequest, NextResponse } from 'next/server';

const PRICE_CENTS = 25;

function newChallenge() {
  return { 
    challenge: { 
      priceCents: PRICE_CENTS, 
      memo: 'report:v1' 
    } 
  }
}

function isBudgetReceipt(b64?: string | null) {
  if (!b64) return false
  try {
    const obj = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
    return obj?.type === 'budget' && typeof obj.cents === 'number' && obj.cents >= PRICE_CENTS
  } catch { 
    return false 
  }
}

export async function GET(req: NextRequest) {
  const receipt = req.headers.get('x-402-receipt')
  const bypass = req.headers.get('x-402-bypass')
  
  // Only accept if bypass header is set (simulates payment)
  if (bypass === 'true' && receipt) {
    return NextResponse.json({ data: 'PAID content OK ✅' })
  }
  
  // Or if valid budget receipt with sufficient funds
  if (isBudgetReceipt(receipt)) {
    return NextResponse.json({ data: 'PAID via Session Budget ✅' })
  }
  
  // Otherwise, require payment
  return NextResponse.json(newChallenge(), { status: 402 })
}
