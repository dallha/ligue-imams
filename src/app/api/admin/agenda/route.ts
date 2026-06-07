import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const events = await db.event.findMany({
      orderBy: { dateDebut: 'asc' },
    })

    return NextResponse.json({ data: events })
  } catch (error) {
    console.error('Get events error:', error)
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
    const { titre, titreAr, description, descriptionAr, dateDebut, dateFin, lieu, type, categorie, published, imageUrl } = body

    if (!titre || !dateDebut) {
      return NextResponse.json({ error: 'Titre et date de début sont requis' }, { status: 400 })
    }

    const event = await db.event.create({
      data: {
        titre,
        titreAr: titreAr || null,
        description: description || null,
        descriptionAr: descriptionAr || null,
        dateDebut: new Date(dateDebut),
        dateFin: dateFin ? new Date(dateFin) : null,
        lieu: lieu || null,
        type: type || 'LIPS',
        categorie: categorie || null,
        published: published ?? false,
        imageUrl: imageUrl || null,
      },
    })

    return NextResponse.json({ data: event }, { status: 201 })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
