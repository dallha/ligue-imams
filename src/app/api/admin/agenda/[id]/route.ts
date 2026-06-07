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

    const existing = await db.event.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 })
    }

    const { titre, titreAr, description, descriptionAr, dateDebut, dateFin, lieu, type, categorie, published, imageUrl } = body

    const event = await db.event.update({
      where: { id: parseInt(id) },
      data: {
        ...(titre !== undefined && { titre }),
        ...(titreAr !== undefined && { titreAr }),
        ...(description !== undefined && { description }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(dateDebut !== undefined && { dateDebut: new Date(dateDebut) }),
        ...(dateFin !== undefined && { dateFin: dateFin ? new Date(dateFin) : null }),
        ...(lieu !== undefined && { lieu }),
        ...(type !== undefined && { type }),
        ...(categorie !== undefined && { categorie }),
        ...(published !== undefined && { published }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    })

    return NextResponse.json({ data: event })
  } catch (error) {
    console.error('Update event error:', error)
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
    const existing = await db.event.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 })
    }

    await db.event.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete event error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
