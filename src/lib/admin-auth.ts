import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'

const ADMIN_ROLES = ['ADMIN', 'PRESIDENT', 'RESPONSABLE_REGIONAL'] as const

export interface AdminSession {
  id: number
  email: string
  nom: string
  prenom: string
  role: string
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user?.email) {
      const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: { role: true },
      })

      if (!user) return null

      const userRole = typeof user.role === 'string'
        ? user.role
        : (user.role as { name?: string } | null)?.name || ''

      if (!ADMIN_ROLES.includes(userRole as typeof ADMIN_ROLES[number])) {
        return null
      }

      if (user.status !== 'ACTIF') {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: userRole,
      }
    }
  } catch (error) {
    console.error('Supabase admin session lookup failed:', error)
  }

  return null
}

export async function clearAdminCookie() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Supabase signOut failed:', error)
  }
}
