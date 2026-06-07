import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer les infos de l'utilisateur dans notre DB
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { role: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 })
    }

    const userRole = typeof user.role === 'string'
      ? user.role
      : (user.role as { name?: string } | null)?.name || ''

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: userRole,
      },
    })
  } catch (error) {
    console.error('Get admin session error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
