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
    const { status, role, nom, prenom, telephone } = body

    const existing = await db.user.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 })
    }

    let roleIdUpdate = {}
    if (role !== undefined) {
      if (role) {
        const dbRole = await db.role.upsert({
          where: { name: role.toUpperCase().trim() },
          update: {},
          create: {
            name: role.toUpperCase().trim(),
            description: `Rôle ${role}`,
          },
        })
        roleIdUpdate = { roleId: dbRole.id }
      } else {
        roleIdUpdate = { roleId: null }
      }
    }

    const user = await db.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(status !== undefined && { status }),
        ...roleIdUpdate,
        ...(nom !== undefined && { nom }),
        ...(prenom !== undefined && { prenom }),
        ...(telephone !== undefined && { telephone }),
        updatedAt: new Date(),
      },
    })

    const { password: _, ...safeUser } = user
    return NextResponse.json({ data: safeUser })
  } catch (error) {
    console.error('Update member error:', error)
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
    const existing = await db.user.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 })
    }

    await db.user.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete member error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
