import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [reciters, verses, resources] = await Promise.all([
      db.coranReciter.findMany({
        where: { published: true },
        orderBy: { ordre: 'asc' },
      }),
      db.dailyVerse.findMany({
        where: { published: true },
        orderBy: { id: 'desc' },
      }),
      db.coranResource.findMany({
        where: { published: true },
        orderBy: { id: 'asc' },
      }),
    ])
    return NextResponse.json({ data: { reciters, verses, resources } })
  } catch (error) {
    console.error('Public coran error:', error)
    return NextResponse.json({ data: { reciters: [], verses: [], resources: [] } })
  }
}
