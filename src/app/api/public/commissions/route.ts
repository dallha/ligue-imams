import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const commissions = await db.commission.findMany({
      where: { published: true },
      orderBy: { ordre: 'asc' },
    })
    return NextResponse.json({ data: commissions })
  } catch (error) {
    console.error('Public commissions error:', error)
    return NextResponse.json({ data: [] })
  }
}
