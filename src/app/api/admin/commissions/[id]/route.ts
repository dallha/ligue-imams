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
    const { nom, nomAr, members, desc, icon, ordre } = body

    const existing = await db.commission.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Commission non trouvée' }, { status: 404 })
    }

    const commission = await db.commission.update({
      where: { id: parseInt(id) },
      data: {
        ...(nom !== undefined && { nom }),
        ...(nomAr !== undefined && { nomAr }),
        ...(members !== undefined && { members }),
        ...(desc !== undefined && { desc }),
        ...(icon !== undefined && { icon }),
        ...(ordre !== undefined && { ordre }),
      },
    })

    return NextResponse.json({ data: commission })
  } catch (error) {
    console.error('Update commission error:', error)
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
    const existing = await db.commission.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Commission non trouvée' }, { status: 404 })
    }

    await db.commission.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete commission error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
