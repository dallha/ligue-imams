import { NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { revalidatePath } from 'next/cache'

export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { slug: { contains: search } },
          ],
        }
      : {}

    const pages = await prisma.staticPage.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ data: pages })
  } catch (error) {
    console.error('Erreur pages GET:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { slug, title, titleAr, content, contentAr, published } = data

    if (!slug || !title) {
      return NextResponse.json({ error: 'Slug et titre requis' }, { status: 400 })
    }

    const newPage = await prisma.staticPage.create({
      data: {
        slug,
        title,
        titleAr: titleAr || null,
        content: content || null,
        contentAr: contentAr || null,
        published: published ?? true,
      },
    })

    revalidatePath('/', 'layout')

    return NextResponse.json({ data: newPage }, { status: 201 })
  } catch (error: any) {
    console.error('Erreur pages POST:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
