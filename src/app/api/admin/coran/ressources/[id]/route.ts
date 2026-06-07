import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { CoranService } from '@/services/coran.service'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id: paramId } = await params
    const id = parseInt(paramId)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    const body = await request.json()
    const ressource = await CoranService.updateResource(id, body)

    return NextResponse.json({ data: ressource })
  } catch (error) {
    console.error('Update ressource error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id: paramId } = await params
    const id = parseInt(paramId)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    await CoranService.deleteResource(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete ressource error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
