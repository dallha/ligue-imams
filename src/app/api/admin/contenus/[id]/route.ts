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
    const { titre, titreAr, contenu, contenuAr, type, categorie, fichierUrl, imageUrl, published, dateEvenement, lieu } = body

    const existing = await db.content.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Contenu non trouvé' }, { status: 404 })
    }

    const content = await db.content.update({
      where: { id: parseInt(id) },
      data: {
        ...(titre !== undefined && { titre }),
        ...(titreAr !== undefined && { titreAr }),
        ...(contenu !== undefined && { contenu }),
        ...(contenuAr !== undefined && { contenuAr }),
        ...(type !== undefined && { type }),
        ...(categorie !== undefined && { categorie }),
        ...(fichierUrl !== undefined && { fichierUrl }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(published !== undefined && { published }),
        ...(dateEvenement !== undefined && { dateEvenement: dateEvenement ? new Date(dateEvenement) : null }),
        ...(lieu !== undefined && { lieu }),
      },
    })

    return NextResponse.json({ data: content })
  } catch (error) {
    console.error('Update content error:', error)
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
    const existing = await db.content.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Contenu non trouvé' }, { status: 404 })
    }

    await db.content.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete content error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
