import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    return NextResponse.json({
      user: session,
    })
  } catch (error) {
    console.error('Get admin session error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
