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
    const { nom, nomAr, population, mosqueCount, latitude, longitude } = body

    const existing = await db.region.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Région non trouvée' }, { status: 404 })
    }

    const region = await db.region.update({
      where: { id: parseInt(id) },
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
    console.error('Update region error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
