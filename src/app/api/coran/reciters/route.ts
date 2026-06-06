import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://www.mp3quran.net/api/v3'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'fr'
    const rewaya = searchParams.get('rewaya')
    const sura = searchParams.get('sura')

    let url = `${API_BASE}/reciters?language=${language}`
    if (rewaya) url += `&rewaya=${rewaya}`
    if (sura) url += `&sura=${sura}`

    const res = await fetch(url, { next: { revalidate: 86400 } }) // Cache 24h
    if (!res.ok) throw new Error(`API error: ${res.status}`)

    const data = await res.json()

    // Only keep Hafs reciters with murattal (moshaf_type 11) for simplicity
    // and who have all 114 surahs
    const filtered = (data.reciters || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      letter: r.letter,
      moshaf: (r.moshaf || [])
        .filter((m: any) => m.surah_total === 114)
        .map((m: any) => ({
          id: m.id,
          name: m.name,
          server: m.server,
          surahTotal: m.surah_total,
          rewayaId: m.rewaya_id,
          moshafType: m.moshaf_type,
        })),
    })).filter((r: any) => r.moshaf.length > 0)

    return NextResponse.json({ reciters: filtered })
  } catch (error) {
    console.error('Reciters API error:', error)
    return NextResponse.json({ error: 'Failed to fetch reciters' }, { status: 500 })
  }
}
