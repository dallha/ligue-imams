import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = { published: true }
    if (type) where.type = type

    const contenus = await db.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return NextResponse.json({ data: contenus })
  } catch (error) {
    console.error('Public contenus error:', error)
    return NextResponse.json({ data: [] })
  }
}
