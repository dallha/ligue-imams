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
    const { name, bio, ordre, published } = body

    const existing = await db.coranReciter.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Récitateur non trouvé' }, { status: 404 })
    }

    const reciter = await db.coranReciter.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(ordre !== undefined && { ordre }),
        ...(published !== undefined && { published }),
      },
    })

    return NextResponse.json({ data: reciter })
  } catch (error) {
    console.error('Update reciter error:', error)
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
    const existing = await db.coranReciter.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Récitateur non trouvé' }, { status: 404 })
    }

    await db.coranReciter.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete reciter error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
