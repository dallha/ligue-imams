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
    const { arabic, french, reference, published, dateActive } = body

    const existing = await db.dailyVerse.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Verset non trouvé' }, { status: 404 })
    }

    const verset = await db.dailyVerse.update({
      where: { id: parseInt(id) },
      data: {
        ...(arabic !== undefined && { arabic }),
        ...(french !== undefined && { french }),
        ...(reference !== undefined && { reference }),
        ...(published !== undefined && { published }),
        ...(dateActive !== undefined && { dateActive: dateActive ? new Date(dateActive) : null }),
      },
    })

    return NextResponse.json({ data: verset })
  } catch (error) {
    console.error('Update verset error:', error)
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
    const existing = await db.dailyVerse.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Verset non trouvé' }, { status: 404 })
    }

    await db.dailyVerse.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete verset error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
