import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const [
      totalMembers,
      activeMembers,
      publishedContents,
      totalRegions,
      donsCeMois,
      cotisationsCeMois,
      recentContents,
      recentMembers,
      membersByRegion,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { status: 'ACTIF' } }),
      db.content.count({ where: { published: true } }),
      db.region.count(),
      db.paiement.count({
        where: {
          type: 'DON',
          datePaiement: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      db.paiement.count({
        where: {
          type: 'COTISATION',
          datePaiement: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      db.content.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, titre: true, type: true, published: true, createdAt: true },
      }),
      db.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nom: true,
          prenom: true,
          matricule: true,
          role: true,
          status: true,
          createdAt: true,
          region: { select: { nom: true } },
        },
      }),
      db.region.findMany({
        include: { _count: { select: { members: true } } },
        orderBy: { code: 'asc' },
      }),
    ])

    return NextResponse.json({
      stats: {
        totalMembers,
        activeMembers,
        publishedContents,
        totalRegions,
        donsCeMois,
        cotisationsCeMois,
      },
      recentContents,
      recentMembers,
      membersByRegion: membersByRegion.map((r) => ({
        nom: r.nom,
        code: r.code,
        members: r._count.members,
      })),
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
