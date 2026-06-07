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
    const { nom, prenom, role, roleAr, region, bio, initiales, photo, ordre, published } = body

    const existing = await db.bureauMember.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 })
    }

    const member = await db.bureauMember.update({
      where: { id: parseInt(id) },
      data: {
        ...(nom !== undefined && { nom }),
        ...(prenom !== undefined && { prenom }),
        ...(role !== undefined && { role }),
        ...(roleAr !== undefined && { roleAr }),
        ...(region !== undefined && { region }),
        ...(bio !== undefined && { bio }),
        ...(initiales !== undefined && { initiales }),
        ...(photo !== undefined && { photo }),
        ...(ordre !== undefined && { ordre }),
        ...(published !== undefined && { published }),
      },
    })

    return NextResponse.json({ data: member })
  } catch (error) {
    console.error('Update bureau member error:', error)
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
    const existing = await db.bureauMember.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 })
    }

    await db.bureauMember.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete bureau member error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
