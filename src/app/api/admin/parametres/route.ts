import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const configs = await db.siteConfig.findMany()
    const settings: Record<string, string> = {}
    for (const config of configs) {
      settings[config.key] = config.value
    }

    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error('Get parametres error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { settings } = body as { settings: Record<string, string> }

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const operations = Object.entries(settings).map(([key, value]) =>
      db.siteConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )

    await Promise.all(operations)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update parametres error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
