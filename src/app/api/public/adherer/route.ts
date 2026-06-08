import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { syncSupabaseAuthUser } from '@/lib/supabase/admin-auth-sync'
import bcrypt from 'bcryptjs'

// Generate next matricule in LIPS-XXXX format
async function generateMatricule(): Promise<string> {
  const lastUser = await db.user.findFirst({
    where: { matricule: { startsWith: 'LIPS-' } },
    orderBy: { matricule: 'desc' },
    select: { matricule: true },
  })

  if (!lastUser) return 'LIPS-0001'

  const match = lastUser.matricule.match(/^LIPS-(\d+)$/)
  if (!match) return 'LIPS-0001'

  const nextNum = parseInt(match[1], 10) + 1
  return `LIPS-${nextNum.toString().padStart(4, '0')}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, nom, prenom, telephone, regionId, mosque, role } = body

    // ─── Validation ───────────────────────────────────────
    const errors: string[] = []

    if (!email || typeof email !== 'string') {
      errors.push('Email requis')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Format d\'email invalide')
    }

    if (!password || typeof password !== 'string') {
      errors.push('Mot de passe requis')
    } else if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères')
    } else if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule')
    } else if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule')
    } else if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre')
    }

    if (!nom || typeof nom !== 'string' || nom.trim().length < 2) {
      errors.push('Nom requis (minimum 2 caractères)')
    }

    if (!prenom || typeof prenom !== 'string' || prenom.trim().length < 2) {
      errors.push('Prénom requis (minimum 2 caractères)')
    }

    if (!telephone || typeof telephone !== 'string') {
      errors.push('Téléphone requis')
    }

    const validRoles = ['IMAM', 'PREDICATEUR', 'RESPONSABLE_REGIONAL', 'MEMBRE_CHOURA', 'AUTRE']
    if (role && !validRoles.includes(role)) {
      errors.push('Rôle invalide')
    }

    if (regionId && isNaN(parseInt(regionId))) {
      errors.push('Région invalide')
    }


    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join('. ') }, { status: 400 })
    }

    // ─── Check for duplicates ─────────────────────────────
    const existingEmail = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existingEmail) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà' }, { status: 409 })
    }

    const existingPhone = await db.user.findFirst({ where: { telephone } })
    if (existingPhone) {
      return NextResponse.json({ error: 'Un compte avec ce numéro de téléphone existe déjà' }, { status: 409 })
    }

    // ─── Verify region exists (if provided) ───────────────
    if (regionId) {
      const region = await db.region.findUnique({ where: { id: parseInt(regionId) } })
      if (!region) {
        return NextResponse.json({ error: 'Région non trouvée' }, { status: 400 })
      }
    }


    // ─── Generate matricule ───────────────────────────────
    const matricule = await generateMatricule()

    // ─── Hash password ────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12)

    // ─── Create user in DB ────────────────────────────────
    const userData: any = {
      matricule,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      nom: nom.trim().toUpperCase(),
      prenom: prenom.trim(),
      telephone,
      status: 'EN_ATTENTE',
    }

    if (role) userData.role = role
    if (regionId) userData.regionId = parseInt(regionId)

    const user = await db.user.create({
      data: userData,
      include: {
        region: { select: { nom: true, code: true } },
      },
    })


    // ─── Sync with Supabase Auth ──────────────────────────
    try {
      await syncSupabaseAuthUser({
        email: user.email,
        password,
        userMetadata: {
          role,
          status: 'EN_ATTENTE',
          nom: user.nom,
          prenom: user.prenom,
          matricule,
          source: 'lips-adhesion',
        },
      })
    } catch (syncError) {
      console.error('Supabase auth sync error:', syncError)
      // Rollback user creation
      try {
        await db.user.delete({ where: { id: user.id } })
      } catch (rollbackError) {
        console.error('Rollback user delete error:', rollbackError)
      }

      return NextResponse.json(
        { error: 'Erreur lors de la création du compte. Veuillez réessayer.' },
        { status: 500 }
      )
    }

    // ─── Return success ───────────────────────────────────
    return NextResponse.json({
      success: true,
      message: `Votre demande d'adhésion a été soumise avec succès. Votre matricule est ${matricule}. Un administrateur validera votre compte sous peu.`,
      matricule,
    }, { status: 201 })

  } catch (error) {
    console.error('Adhesion error:', error)
    return NextResponse.json({ error: 'Erreur serveur lors de l\'inscription' }, { status: 500 })
  }
}
