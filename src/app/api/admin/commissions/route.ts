import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const commissions = await db.commission.findMany({
      orderBy: { ordre: 'asc' },
    })

    return NextResponse.json({ data: commissions })
  } catch (error) {
    console.error('Get commissions error:', error)
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
    const { nom, nomAr, members, desc, icon, ordre } = body

    if (!nom) {
      return NextResponse.json(
        { error: 'Nom est requis' },
        { status: 400 }
      )
    }

    const commission = await db.commission.create({
      data: {
        nom,
        nomAr: nomAr || null,
        members: members ?? 0,
        desc: desc || null,
        icon: icon || null,
        ordre: ordre ?? 0,
      },
    })

    return NextResponse.json({ data: commission }, { status: 201 })
  } catch (error) {
    console.error('Create commission error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
