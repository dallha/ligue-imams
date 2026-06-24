import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const members = await db.bureauMember.findMany({
      where: { published: true },
      orderBy: { ordre: 'asc' },
    })
    return NextResponse.json({ data: members })
  } catch (error) {
    console.error('Public bureau error:', error)
    return NextResponse.json({ data: [] })
  }
}
