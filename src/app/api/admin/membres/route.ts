import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const regionId = searchParams.get('regionId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}
    if (role) where.role = role
    if (status) where.status = status
    if (regionId) where.regionId = parseInt(regionId)
    if (search) {
      where.OR = [
        { nom: { contains: search } },
        { prenom: { contains: search } },
        { matricule: { contains: search } },
        { email: { contains: search } },
      ]
    }

    const [members, total] = await Promise.all([
      db.user.findMany({
        where,
        include: { region: { select: { nom: true, code: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ])

    const safeMembers = members.map(({ password: _, ...rest }) => rest)

    return NextResponse.json({ data: safeMembers, total, page, limit })
  } catch (error) {
    console.error('Get members error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
