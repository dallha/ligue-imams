import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'

const MEMBER_ROLES = ['IMAM', 'PREDICATEUR', 'RESPONSABLE_REGIONAL', 'MEMBRE_CHOURA', 'AUTRE'] as const

export interface MemberSession {
  id: number
  email: string
  nom: string
  prenom: string
  role: string
  matricule: string
}

export async function getMemberSession(): Promise<MemberSession | null> {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const metadata = (session?.user?.user_metadata ?? {}) as Record<string, unknown>
    const metadataRole = typeof metadata.role === 'string' ? metadata.role : ''
    const metadataStatus = typeof metadata.status === 'string' ? metadata.status : ''
    const metadataNom = typeof metadata.nom === 'string' ? metadata.nom : ''
    const metadataPrenom = typeof metadata.prenom === 'string' ? metadata.prenom : ''
    const metadataMatricule = typeof metadata.matricule === 'string' ? metadata.matricule : ''

    if (session?.user?.email) {
      try {
        const user = await db.user.findUnique({
          where: { email: session.user.email },
          include: { role: true },
        })

        if (user) {
          const userRole = typeof user.role === 'string'
            ? user.role
            : (user.role as { name?: string } | null)?.name || ''

          if (!MEMBER_ROLES.includes(userRole as typeof MEMBER_ROLES[number])) {
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
            role: userRole || 'IMAM',
            matricule: user.matricule,
          }
        }
      } catch (dbError) {
        console.warn('Supabase member session DB fallback failed:', dbError)
      }

      if (MEMBER_ROLES.includes(metadataRole as typeof MEMBER_ROLES[number])) {
        if (metadataStatus && metadataStatus !== 'ACTIF') {
          return null
        }

        return {
          id: 0,
          email: session.user.email,
          nom: metadataNom,
          prenom: metadataPrenom,
          role: metadataRole || 'IMAM',
          matricule: metadataMatricule,
        }
      }
    }
  } catch (error) {
    console.error('Supabase member session lookup failed:', error)
  }

  return null
}

export async function clearMemberCookie() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Supabase member signOut failed:', error)
  }
}
