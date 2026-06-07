import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { CoranService } from '@/services/coran.service'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const reciters = await CoranService.getReciters()
    return NextResponse.json({ data: reciters })
  } catch (error) {
    console.error('Get reciters error:', error)
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
    
    if (!body.name) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }

    const reciter = await CoranService.createReciter(body)
    return NextResponse.json({ data: reciter }, { status: 201 })
  } catch (error) {
    console.error('Create reciter error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
