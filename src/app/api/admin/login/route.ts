import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { compare } from 'bcryptjs'
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit'
import { syncSupabaseAuthUser } from '@/lib/supabase/admin-auth-sync'

const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 30 * 60 * 1000,
}

const MIN_RESPONSE_TIME = 300

async function timingSafeDelay(start: number): Promise<void> {
  const elapsed = Date.now() - start
  if (elapsed < MIN_RESPONSE_TIME) {
    await new Promise((r) => setTimeout(r, MIN_RESPONSE_TIME - elapsed))
  }
}

function getMetadataString(metadata: unknown, key: string): string {
  if (!metadata || typeof metadata !== 'object') return ''
  const value = (metadata as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : ''
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // ── 1. Rate limiting ──────────────────────────────────────────
    const clientIp = getClientIp(request)
    const rateLimitKey = `admin-login:${clientIp}`
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIG)

    if (!rateLimitResult.allowed) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        {
          error: 'Trop de tentatives. Compte temporairement verrouillé.',
          lockoutRemaining: rateLimitResult.lockoutRemaining,
          code: 'RATE_LIMITED',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              rateLimitResult.lockedUntil
                ? Math.ceil((rateLimitResult.lockedUntil - Date.now()) / 1000)
                : RATE_LIMIT_CONFIG.lockoutMs / 1000
            ),
          },
        }
      )
    }

    // ── 2. Validate input ─────────────────────────────────────────
    let email: string, password: string
    try {
      const body = await request.json()
      email = body.email
      password = body.password
    } catch {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Requête invalide', code: 'INVALID_REQUEST' },
        { status: 400 }
      )
    }

    if (!email || !password) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Email et mot de passe requis', code: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Identifiants invalides', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    if (password.length < 4 || password.length > 128) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Identifiants invalides', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const normalizedEmail = email.toLowerCase().trim()
    const authResult = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    const authUser = authResult.data.user
    const authRole = getMetadataString(authUser?.user_metadata, 'role')
    const authStatus = getMetadataString(authUser?.user_metadata, 'status')

    if (
      authUser &&
      ['ADMIN', 'PRESIDENT', 'RESPONSABLE_REGIONAL'].includes(authRole) &&
      (!authStatus || authStatus === 'ACTIF')
    ) {
      resetRateLimit(rateLimitKey)

      return NextResponse.json({
        user: {
          id: 0,
          email: authUser.email ?? normalizedEmail,
          nom: getMetadataString(authUser.user_metadata, 'nom') || '',
          prenom: getMetadataString(authUser.user_metadata, 'prenom') || '',
          role: authRole,
        },
      })
    }

    let user: any = null
    try {
      user = await db.user.findUnique({
        where: { email: normalizedEmail },
        include: { region: true, role: true },
      })
    } catch (dbError) {
      console.warn('Admin login DB lookup failed:', dbError)
    }

    if (!user) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        {
          error: authResult.error ? 'Identifiants invalides' : 'Accès non autorisé',
          code: authResult.error ? 'INVALID_CREDENTIALS' : 'UNAUTHORIZED_ROLE',
        },
        { status: authResult.error ? 401 : 403 }
      )
    }

    const userRole = typeof user.role === 'string'
      ? user.role
      : (user.role as { name?: string } | null)?.name || ''
    const normalizedRole = userRole || 'ADMIN'

    if (!['ADMIN', 'PRESIDENT', 'RESPONSABLE_REGIONAL'].includes(normalizedRole)) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Accès non autorisé', code: 'UNAUTHORIZED_ROLE' },
        { status: 403 }
      )
    }

    if (user.status !== 'ACTIF') {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Compte désactivé. Contactez l\'administrateur.', code: 'ACCOUNT_DISABLED' },
        { status: 403 }
      )
    }

    const passwordValid = await compare(password, user.password)
    if (!passwordValid) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        {
          error: 'Identifiants invalides',
          code: 'INVALID_CREDENTIALS',
          remaining: rateLimitResult.remaining - 1,
        },
        { status: 401 }
      )
    }

    let signInError = authResult.error

    if (signInError) {
      try {
        await syncSupabaseAuthUser({
          email: normalizedEmail,
          password,
          userMetadata: {
            role: normalizedRole,
            status: user.status,
            nom: user.nom,
            prenom: user.prenom,
            source: 'lips-admin',
          },
        })

        const retry = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        })
        signInError = retry.error ?? null
      } catch (syncError) {
        console.error('Supabase sync error:', syncError)
      }
    }

    if (signInError) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        {
          error: 'Impossible de créer la session Supabase',
          code: 'SUPABASE_SESSION_FAILED',
        },
        { status: 500 }
      )
    }

    resetRateLimit(rateLimitKey)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: normalizedRole,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    await timingSafeDelay(startTime)
    return NextResponse.json(
      { error: 'Erreur serveur', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
