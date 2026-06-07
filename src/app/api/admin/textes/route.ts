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
            { key: { contains: search } },
            { value: { contains: search } },
          ],
        }
      : {}

    const textes = await prisma.uIText.findMany({
      where,
      orderBy: { key: 'asc' },
    })

    return NextResponse.json({ data: textes })
  } catch (error) {
    console.error('Erreur textes GET:', error)
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
    const { key, value, valueAr, description } = data

    if (!key || !value) {
      return NextResponse.json({ error: 'Clé et valeur requises' }, { status: 400 })
    }

    const newTexte = await prisma.uIText.create({
      data: {
        key,
        value,
        valueAr: valueAr || null,
        description: description || null,
      },
    })

    revalidatePath('/', 'layout')

    return NextResponse.json({ data: newTexte }, { status: 201 })
  } catch (error: any) {
    console.error('Erreur textes POST:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Cette clé existe déjà' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
