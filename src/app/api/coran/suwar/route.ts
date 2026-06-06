import { NextResponse } from 'next/server'

const API_BASE = 'https://www.mp3quran.net/api/v3'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/suwar?language=fr`, {
      next: { revalidate: 86400 }, // Cache 24h
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)

    const data = await res.json()

    const suwar = (data.suwar || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      startPage: s.start_page,
      endPage: s.end_page,
      makkia: s.makkia === 1,
    }))

    return NextResponse.json({ suwar })
  } catch (error) {
    console.error('Suwar API error:', error)
    return NextResponse.json({ error: 'Failed to fetch suwar' }, { status: 500 })
  }
}
