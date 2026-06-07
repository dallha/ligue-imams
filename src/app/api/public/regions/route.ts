import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const regions = await db.region.findMany({
      orderBy: { nom: 'asc' },
      include: {
        _count: { select: { members: true, mosques: true } },
      },
    })
    return NextResponse.json({ data: regions })
  } catch (error) {
    console.error('Public regions error:', error)
    return NextResponse.json({ data: [] })
  }
}
