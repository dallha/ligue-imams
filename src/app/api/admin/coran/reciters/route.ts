import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const reciters = await db.coranReciter.findMany({
      orderBy: { ordre: 'asc' },
    })

    return NextResponse.json({ data: reciters })
  } catch (error) {
    console.error('Get reciters error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { name, bio, ordre, published } = body

    if (!name) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }

    const reciter = await db.coranReciter.create({
      data: {
        name,
        bio: bio || null,
        ordre: ordre ?? 0,
        published: published ?? false,
      },
    })

    return NextResponse.json({ data: reciter }, { status: 201 })
  } catch (error) {
    console.error('Create reciter error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
