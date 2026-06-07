import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { CoranService } from '@/services/coran.service'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const ressources = await CoranService.getResources()
    return NextResponse.json({ data: ressources })
  } catch (error) {
    console.error('Get ressources error:', error)
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
    
    if (!body.title) {
      return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 })
    }

    const ressource = await CoranService.createResource(body)
    return NextResponse.json({ data: ressource }, { status: 201 })
  } catch (error) {
    console.error('Create ressource error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
