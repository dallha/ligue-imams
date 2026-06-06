import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const ressources = await db.coranResource.findMany({
      orderBy: { id: 'desc' },
    })

    return NextResponse.json({ data: ressources })
  } catch (error) {
    console.error('Get ressources error:', error)
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
    const { title, description, url, icon, published } = body

    if (!title) {
      return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 })
    }

    const ressource = await db.coranResource.create({
      data: {
        title,
        description: description || null,
        url: url || null,
        icon: icon || 'BookOpen',
        published: published ?? false,
      },
    })

    return NextResponse.json({ data: ressource }, { status: 201 })
  } catch (error) {
    console.error('Create ressource error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
