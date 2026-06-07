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

    const updatedPage = await prisma.staticPage.update({
      where: { id },
      data: {
        slug: data.slug,
        title: data.title,
        titleAr: data.titleAr !== undefined ? data.titleAr : undefined,
        content: data.content !== undefined ? data.content : undefined,
        contentAr: data.contentAr !== undefined ? data.contentAr : undefined,
        published: data.published !== undefined ? data.published : undefined,
      },
    })

    revalidatePath('/', 'layout')

    return NextResponse.json({ data: updatedPage })
  } catch (error) {
    console.error('Erreur pages PUT:', error)
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

    await prisma.staticPage.delete({ where: { id } })

    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur pages DELETE:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
