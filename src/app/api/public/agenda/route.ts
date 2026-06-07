import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const events = await db.event.findMany({
      where: { published: true },
      orderBy: { dateDebut: 'asc' },
    })
    return NextResponse.json({ data: events })
  } catch (error) {
    console.error('Public agenda error:', error)
    return NextResponse.json({ data: [] })
  }
}
