import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const faqs = await db.fAQ.findMany({
      where: { published: true },
      orderBy: { ordre: 'asc' },
    })
    return NextResponse.json({ data: faqs })
  } catch (error) {
    console.error('Public FAQ error:', error)
    return NextResponse.json({ data: [] })
  }
}
