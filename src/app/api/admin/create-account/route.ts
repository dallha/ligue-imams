import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
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

  // Extract the numeric part after "LIPS-"
  const match = lastUser.matricule.match(/^LIPS-(\d+)$/)
  if (!match) return 'LIPS-0001'

  const nextNum = parseInt(match[1], 10) + 1
  return `LIPS-${nextNum.toString().padStart(4, '0')}`
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Only ADMIN and PRESIDENT can create accounts
    if (session.role !== 'ADMIN' && session.role !== 'PRESIDENT') {
      return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, nom, prenom, telephone, role, regionId, mosqueId } = body

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
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial')
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

    const validRoles = ['IMAM', 'PREDICATEUR', 'RESPONSABLE_REGIONAL', 'ADMIN', 'PRESIDENT', 'MEMBRE_CHOURA']
    if (!role || !validRoles.includes(role)) {
      errors.push('Rôle invalide')
    }

    if (!regionId || isNaN(parseInt(regionId))) {
      errors.push('Région requise')
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join('. ') }, { status: 400 })
    }

    // ─── Check for duplicates ─────────────────────────────
    const existingEmail = await db.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà' }, { status: 409 })
    }

    const existingPhone = await db.user.findFirst({ where: { telephone } })
    if (existingPhone) {
      return NextResponse.json({ error: 'Un compte avec ce numéro de téléphone existe déjà' }, { status: 409 })
    }

    // ─── Verify region exists ─────────────────────────────
    const region = await db.region.findUnique({ where: { id: parseInt(regionId) } })
    if (!region) {
      return NextResponse.json({ error: 'Région non trouvée' }, { status: 400 })
    }

    // ─── Verify mosque if provided ────────────────────────
    if (mosqueId) {
      const mosque = await db.mosque.findUnique({ where: { id: parseInt(mosqueId) } })
      if (!mosque) {
        return NextResponse.json({ error: 'Mosquée non trouvée' }, { status: 400 })
      }
    }

    // ─── Generate matricule ───────────────────────────────
    const matricule = await generateMatricule()

    // ─── Hash password ────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12)

    // ─── Create user ──────────────────────────────────────
    const user = await db.user.create({
      data: {
        matricule,
        email,
        password: hashedPassword,
        nom: nom.trim().toUpperCase(),
        prenom: prenom.trim(),
        telephone,
        role,
        status: 'EN_ATTENTE',
        regionId: parseInt(regionId),
        ...(mosqueId && { mosqueId: parseInt(mosqueId) }),
      },
      include: {
        region: { select: { nom: true, code: true } },
      },
    })

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
          source: 'lips-admin',
        },
      })
    } catch (syncError) {
      console.error('Supabase auth sync error:', syncError)
      try {
        await db.user.delete({ where: { id: user.id } })
      } catch (rollbackError) {
        console.error('Rollback user delete error:', rollbackError)
      }

      return NextResponse.json(
        { error: 'Compte créé en base locale, mais la synchronisation Supabase a échoué.' },
        { status: 500 }
      )
    }

    // ─── Return safe user (no password) ───────────────────
    const { password: _, ...safeUser } = user

    return NextResponse.json({
      data: safeUser,
      message: `Compte créé avec succès — Matricule : ${matricule}`,
    }, { status: 201 })

  } catch (error) {
    console.error('Create account error:', error)
    return NextResponse.json({ error: 'Erreur serveur lors de la création du compte' }, { status: 500 })
  }
}
