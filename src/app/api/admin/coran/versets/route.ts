import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const versets = await db.dailyVerse.findMany({
      orderBy: { id: 'desc' },
    })

    return NextResponse.json({ data: versets })
  } catch (error) {
    console.error('Get versets error:', error)
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
    const { arabic, french, reference, published, dateActive } = body

    if (!arabic || !french || !reference) {
      return NextResponse.json(
        { error: 'Texte arabe, traduction et référence sont requis' },
        { status: 400 }
      )
    }

    const verset = await db.dailyVerse.create({
      data: {
        arabic,
        french,
        reference,
        published: published ?? false,
        dateActive: dateActive ? new Date(dateActive) : null,
      },
    })

    return NextResponse.json({ data: verset }, { status: 201 })
  } catch (error) {
    console.error('Create verset error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
