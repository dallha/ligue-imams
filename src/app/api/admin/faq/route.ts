import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const faqs = await db.fAQ.findMany({
      orderBy: { ordre: 'asc' },
    })

    return NextResponse.json({ data: faqs })
  } catch (error) {
    console.error('Get FAQ error:', error)
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
    const { question, reponse, ordre, published } = body

    if (!question || !reponse) {
      return NextResponse.json(
        { error: 'Question et réponse sont requises' },
        { status: 400 }
      )
    }

    const faq = await db.fAQ.create({
      data: {
        question,
        reponse,
        ordre: ordre ?? 0,
        published: published ?? true,
      },
    })

    return NextResponse.json({ data: faq }, { status: 201 })
  } catch (error) {
    console.error('Create FAQ error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
