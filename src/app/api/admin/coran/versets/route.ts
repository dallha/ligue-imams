import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { CoranService } from '@/services/coran.service'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const versets = await CoranService.getVerses()
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
    
    if (!body.arabic || !body.french || !body.reference) {
      return NextResponse.json(
        { error: 'Texte arabe, traduction et référence sont requis' },
        { status: 400 }
      )
    }

    const verset = await CoranService.createVerse(body)
    return NextResponse.json({ data: verset }, { status: 201 })
  } catch (error) {
    console.error('Create verset error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
