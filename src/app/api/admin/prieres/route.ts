import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

// Prayer config keys stored in SiteConfig
const PRAYER_CONFIG_KEYS = [
  'prayer_mode',          // 'auto' | 'manual' — auto = Aladhan API, manual = admin override
  'prayer_region',        // default region key (dakar, saint_louis, etc.)
  'prayer_fajr',          // HH:MM override
  'prayer_chourouk',      // HH:MM override
  'prayer_dhuhr',         // HH:MM override
  'prayer_asr',           // HH:MM override
  'prayer_maghrib',       // HH:MM override
  'prayer_isha',          // HH:MM override
  'hijri_mode',           // 'auto' | 'manual'
  'hijri_day',            // manual day number
  'hijri_month',          // manual month number (1-12)
  'hijri_year',           // manual year
  'hijri_month_name_fr',  // manual month name in French
  'hijri_month_name_ar',  // manual month name in Arabic
] as const

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const configs = await db.siteConfig.findMany({
      where: { key: { in: PRAYER_CONFIG_KEYS as unknown as string[] } },
    })

    const settings: Record<string, string> = {}
    for (const config of configs) {
      settings[config.key] = config.value
    }

    // Provide defaults for missing keys
    const defaults: Record<string, string> = {
      prayer_mode: 'auto',
      prayer_region: 'dakar',
      prayer_fajr: '05:42',
      prayer_chourouk: '06:58',
      prayer_dhuhr: '13:22',
      prayer_asr: '16:38',
      prayer_maghrib: '19:10',
      prayer_isha: '20:26',
      hijri_mode: 'auto',
      hijri_day: '',
      hijri_month: '',
      hijri_year: '',
      hijri_month_name_fr: '',
      hijri_month_name_ar: '',
    }

    for (const [key, def] of Object.entries(defaults)) {
      if (!settings[key]) settings[key] = def
    }

    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error('Get prayer config error:', error)
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

    // Only allow known prayer config keys
    const allowedKeys = new Set(PRAYER_CONFIG_KEYS as unknown as string[])
    const filteredEntries = Object.entries(settings).filter(([key]) => allowedKeys.has(key))

    if (filteredEntries.length === 0) {
      return NextResponse.json({ error: 'Aucune clé valide' }, { status: 400 })
    }

    const operations = filteredEntries.map(([key, value]) =>
      db.siteConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )

    await Promise.all(operations)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update prayer config error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
