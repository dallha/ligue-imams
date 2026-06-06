import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
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

    const existing = await db.concours.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Concours non trouvé' }, { status: 404 })
    }

    const concours = await db.concours.update({
      where: { id: parseInt(id) },
      data: {
        ...(nom !== undefined && { nom }),
        ...(type !== undefined && { type }),
        ...(dateDebut !== undefined && { dateDebut: new Date(dateDebut) }),
        ...(dateFin !== undefined && { dateFin: dateFin ? new Date(dateFin) : null }),
        ...(lieu !== undefined && { lieu }),
        ...(description !== undefined && { description }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(participantsEst !== undefined && { participantsEst }),
        ...(visiblePublic !== undefined && { visiblePublic }),
        ...(inscriptionsOuvertes !== undefined && { inscriptionsOuvertes }),
        ...(statut !== undefined && { statut }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    })

    return NextResponse.json({ data: concours })
  } catch (error) {
    console.error('Update concours error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const existing = await db.concours.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Concours non trouvé' }, { status: 404 })
    }

    await db.concours.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete concours error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
