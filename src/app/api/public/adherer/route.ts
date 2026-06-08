import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { syncSupabaseAuthUser } from '@/lib/supabase/admin-auth-sync'

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
    const { email, password, nom, prenom, telephone, role, region, mosque } = body

    // ─── Validation ───────────────────────────────────────
    const errors: string[] = []

    if (!email || typeof email !== 'string') {
      errors.push('Email requis')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Format d'email invalide")
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

    // ─── Generate matricule ───────────────────────────────
    const matricule = await generateMatricule()

    // ─── Hash password ────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12)

    // ─── Resolve Role ─────────────────────────────────────
    let dbRoleId: number | null = null
    if (role) {
      const dbRole = await db.role.upsert({
        where: { name: role.toUpperCase().trim() },
        update: {},
        create: {
          name: role.toUpperCase().trim(),
          description: `Rôle ${role}`,
        },
      })
      dbRoleId = dbRole.id
    }

    // ─── Resolve Region ───────────────────────────────────
    let dbRegionId: number | null = null
    if (region) {
      const dbRegion = await db.region.findFirst({
        where: {
          nom: {
            equals: region.trim(),
            mode: 'insensitive',
          },
        },
      })
      if (dbRegion) {
        dbRegionId = dbRegion.id
      }
    }

    if (!dbRegionId) {
      return NextResponse.json({ error: 'Région requise ou invalide. Veuillez sélectionner une région valide parmi les 14 régions du Sénégal.' }, { status: 400 })
    }

    // ─── Resolve Mosque ───────────────────────────────────
    let dbMosqueId: number | null = null
    if (mosque && dbRegionId) {
      const dbMosque = await db.mosque.findFirst({
        where: {
          nom: {
            equals: mosque.trim(),
            mode: 'insensitive',
          },
          regionId: dbRegionId,
        },
      })
      if (dbMosque) {
        dbMosqueId = dbMosque.id
      } else {
        const newMosque = await db.mosque.create({
          data: {
            nom: mosque.trim(),
            adresse: mosque.trim(),
            regionId: dbRegionId,
          },
        })
        dbMosqueId = newMosque.id
      }
    }

    // ─── Create user in DB ────────────────────────────────
    const user = await db.user.create({
      data: {
        matricule,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        nom: nom.trim().toUpperCase(),
        prenom: prenom.trim(),
        telephone,
        status: 'EN_ATTENTE',
        roleId: dbRoleId,
        regionId: dbRegionId,
        mosqueId: dbMosqueId,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    })

    // ─── Synchroniser dans Supabase Auth ──────────────────
    try {
      await syncSupabaseAuthUser({
        email: user.email.toLowerCase().trim(),
        password,
        userMetadata: {
          role: role?.toUpperCase().trim() || '',
          status: 'EN_ATTENTE',
          nom: user.nom,
          prenom: user.prenom,
          matricule,
          source: 'lips-public',
        },
      })
    } catch (syncError) {
      console.warn('Supabase Auth sync warning (non-bloquant):', syncError)
      // Non bloquant — la synchro se fera à la première connexion via /api/membre/login
    }

    // ─── Return success ───────────────────────────────────
    return NextResponse.json({
      success: true,
      message: `Votre demande d'adhésion a été soumise avec succès. Votre matricule est ${matricule}. Un administrateur validera votre compte sous peu.`,
      matricule,
    }, { status: 201 })

  } catch (error) {
    console.error('Adhesion error:', error)
    return NextResponse.json({ error: "Erreur serveur lors de l'inscription" }, { status: 500 })
  }
}
