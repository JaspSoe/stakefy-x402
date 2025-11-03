import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { challenge } = await req.json()

  // here we would call solana + sign receipt
  const receipt = {
    tx: "SIM-TX-" + Math.random().toString(36).slice(2),
    memo: challenge?.memo,
    amount: challenge?.priceCents,
    ts: Date.now()
  }

  const receiptB64 = Buffer.from(JSON.stringify(receipt)).toString('base64')
  return NextResponse.json({ receipt: receiptB64 })
}
