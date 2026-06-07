import { NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { revalidatePath } from 'next/cache'

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

    const data = await request.json()

    const updatedTexte = await prisma.uIText.update({
      where: { id },
      data: {
        key: data.key,
        value: data.value,
        valueAr: data.valueAr !== undefined ? data.valueAr : undefined,
        description: data.description !== undefined ? data.description : undefined,
      },
    })

    revalidatePath('/', 'layout')

    return NextResponse.json({ data: updatedTexte })
  } catch (error) {
    console.error('Erreur textes PUT:', error)
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

    await prisma.uIText.delete({ where: { id } })

    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur textes DELETE:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
