import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const published = searchParams.get('published')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}
    if (type) where.type = type
    if (published !== null && published !== undefined && published !== '') where.published = published === 'true'
    if (search) where.titre = { contains: search }

    const [contents, total] = await Promise.all([
      db.content.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.content.count({ where }),
    ])

    return NextResponse.json({ data: contents, total, page, limit })
  } catch (error) {
    console.error('Get contents error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { titre, titreAr, contenu, contenuAr, type, categorie, fichierUrl, imageUrl, published, dateEvenement, lieu } = body

    if (!titre || !contenu || !type) {
      return NextResponse.json(
        { error: 'Titre, contenu et type sont requis' },
        { status: 400 }
      )
    }

    const content = await db.content.create({
      data: {
        titre,
        titreAr: titreAr || null,
        contenu,
        contenuAr: contenuAr || null,
        type,
        categorie: categorie || null,
        fichierUrl: fichierUrl || null,
        imageUrl: imageUrl || null,
        published: published ?? false,
        dateEvenement: dateEvenement ? new Date(dateEvenement) : null,
        lieu: lieu || null,
        auteurId: session.id,
      },
    })

    return NextResponse.json({ data: content }, { status: 201 })
  } catch (error) {
    console.error('Create content error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
