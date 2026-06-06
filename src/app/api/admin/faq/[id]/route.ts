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
    const { question, reponse, ordre, published } = body

    const existing = await db.fAQ.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'FAQ non trouvée' }, { status: 404 })
    }

    const faq = await db.fAQ.update({
      where: { id: parseInt(id) },
      data: {
        ...(question !== undefined && { question }),
        ...(reponse !== undefined && { reponse }),
        ...(ordre !== undefined && { ordre }),
        ...(published !== undefined && { published }),
      },
    })

    return NextResponse.json({ data: faq })
  } catch (error) {
    console.error('Update FAQ error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const existing = await db.fAQ.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'FAQ non trouvée' }, { status: 404 })
    }

    await db.fAQ.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete FAQ error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
