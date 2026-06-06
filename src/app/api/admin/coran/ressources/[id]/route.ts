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
    const { title, description, url, icon, published } = body

    const existing = await db.coranResource.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Ressource non trouvée' }, { status: 404 })
    }

    const ressource = await db.coranResource.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(url !== undefined && { url }),
        ...(icon !== undefined && { icon }),
        ...(published !== undefined && { published }),
      },
    })

    return NextResponse.json({ data: ressource })
  } catch (error) {
    console.error('Update ressource error:', error)
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
    const existing = await db.coranResource.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Ressource non trouvée' }, { status: 404 })
    }

    await db.coranResource.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete ressource error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
