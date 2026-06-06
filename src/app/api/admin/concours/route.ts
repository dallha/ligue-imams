import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const concours = await db.concours.findMany({
      orderBy: { dateDebut: 'desc' },
    })

    return NextResponse.json({ data: concours })
  } catch (error) {
    console.error('Get concours error:', error)
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
    const {
      nom,
      type,
      dateDebut,
      dateFin,
      lieu,
      description,
      descriptionAr,
      participantsEst,
      visiblePublic,
      inscriptionsOuvertes,
      statut,
      imageUrl,
    } = body

    if (!nom || !type || !dateDebut) {
      return NextResponse.json(
        { error: 'Nom, type et date de début sont requis' },
        { status: 400 }
      )
    }

    const concours = await db.concours.create({
      data: {
        nom,
        type,
        dateDebut: new Date(dateDebut),
        dateFin: dateFin ? new Date(dateFin) : null,
        lieu: lieu || null,
        description: description || null,
        descriptionAr: descriptionAr || null,
        participantsEst: participantsEst ?? null,
        visiblePublic: visiblePublic ?? false,
        inscriptionsOuvertes: inscriptionsOuvertes ?? false,
        statut: statut || 'PLANIFIE',
        imageUrl: imageUrl || null,
      },
    })

    return NextResponse.json({ data: concours }, { status: 201 })
  } catch (error) {
    console.error('Create concours error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
