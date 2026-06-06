import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const regions = await db.region.findMany({
      include: {
        _count: { select: { members: true, mosques: true } },
      },
      orderBy: { code: 'asc' },
    })

    return NextResponse.json({ data: regions })
  } catch (error) {
    console.error('Get regions error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { id, nom, nomAr, population, mosqueCount, latitude, longitude } = body

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const existing = await db.region.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Région non trouvée' }, { status: 404 })
    }

    const region = await db.region.update({
      where: { id },
      data: {
        ...(nom !== undefined && { nom }),
        ...(nomAr !== undefined && { nomAr }),
        ...(population !== undefined && { population }),
        ...(mosqueCount !== undefined && { mosqueCount }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
      },
    })

    return NextResponse.json({ data: region })
  } catch (error) {
    console.error('Update regions error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
