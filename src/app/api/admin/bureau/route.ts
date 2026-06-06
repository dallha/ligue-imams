import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const members = await db.bureauMember.findMany({
      orderBy: { ordre: 'asc' },
    })

    return NextResponse.json({ data: members })
  } catch (error) {
    console.error('Get bureau error:', error)
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
    const { nom, prenom, role, roleAr, region, bio, initiales, photo, ordre } = body

    if (!nom || !prenom || !role) {
      return NextResponse.json(
        { error: 'Nom, prénom et rôle sont requis' },
        { status: 400 }
      )
    }

    const member = await db.bureauMember.create({
      data: {
        nom,
        prenom,
        role,
        roleAr: roleAr || null,
        region: region || null,
        bio: bio || null,
        initiales: initiales || null,
        photo: photo || null,
        ordre: ordre ?? 0,
      },
    })

    return NextResponse.json({ data: member }, { status: 201 })
  } catch (error) {
    console.error('Create bureau member error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
