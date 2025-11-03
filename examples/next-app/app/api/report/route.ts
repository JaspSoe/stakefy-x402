import { NextRequest, NextResponse } from 'next/server';

const PRICE_CENTS = 25;

function newChallenge() {
  return { challenge: { priceCents: PRICE_CENTS, memo: 'report:v1' } }
}

function isBudgetReceipt(b64?: string | null) {
  if (!b64) return false
  try {
    const obj = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
    return obj?.type === 'budget' && typeof obj.cents === 'number' && obj.cents === PRICE_CENTS
  } catch { return false }
}

export async function GET(req: NextRequest) {
  const receipt = req.headers.get('x-402-receipt')

  // Accept session-budget receipts OR simulated payment receipts
  if (isBudgetReceipt(receipt)) {
    return NextResponse.json({ data: 'PAID via Session Budget ✅' })
  }

  if (receipt) {
    // Simulated payment receipt path (we accept any non-empty for the demo)
    return NextResponse.json({ data: 'PAID content OK ✅' })
  }

  return NextResponse.json(newChallenge(), { status: 402 })
}
