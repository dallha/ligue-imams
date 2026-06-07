import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { db } from '@/lib/db'
import { compare } from 'bcryptjs'
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit'

// Rate limit config: 5 attempts per 15 minutes, then 30 min lockout
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,   // 15 minutes
  lockoutMs: 30 * 60 * 1000,   // 30 minutes lockout (stricter for admin)
}

// Minimum time for a login response to prevent timing attacks (ms)
const MIN_RESPONSE_TIME = 300

async function timingSafeDelay(start: number): Promise<void> {
  const elapsed = Date.now() - start
  if (elapsed < MIN_RESPONSE_TIME) {
    await new Promise((r) => setTimeout(r, MIN_RESPONSE_TIME - elapsed))
  }
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

    // ── 3. Look up user in our database ───────────────────────────
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { region: true, role: true },
    })

    if (!user) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Identifiants invalides', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // ── 4. Check role ─────────────────────────────────────────────
    const userRole = typeof user.role === 'string'
      ? user.role
      : (user.role as { name?: string } | null)?.name || ''

    if (!['ADMIN', 'PRESIDENT', 'RESPONSABLE_REGIONAL'].includes(userRole)) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Accès non autorisé', code: 'UNAUTHORIZED_ROLE' },
        { status: 403 }
      )
    }

    // ── 5. Check status ───────────────────────────────────────────
    if (user.status !== 'ACTIF') {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Compte désactivé. Contactez l\'administrateur.', code: 'ACCOUNT_DISABLED' },
        { status: 403 }
      )
    }

    // ── 6. Verify password (bcrypt) ───────────────────────────────
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

    // ── 7. Try Supabase Auth (create session) ─────────────────────
    const supabase = await createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    // Si l'utilisateur n'existe pas dans Supabase Auth, on le crée avec la service role key
    if (signInError) {
      console.error('Supabase signIn error:', signInError.message)

      // Créer l'utilisateur dans Supabase Auth via la service role key
      try {
        const serviceClient = createServiceClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { autoRefreshToken: false, persistSession: false } }
        )

        const { error: createError } = await serviceClient.auth.admin.createUser({
          email: email.toLowerCase().trim(),
          password,
          email_confirm: true, // Confirmer l'email automatiquement
        })

        if (createError) {
          console.error('Supabase createUser error:', createError.message)
          // Si la création échoue, on continue avec la session locale
        } else {
          // Réessayer la connexion Supabase
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase().trim(),
            password,
          })
          if (retryError) {
            console.error('Supabase retry signIn error:', retryError.message)
          }
        }
      } catch (serviceError) {
        console.error('Service client error:', serviceError)
      }
    }

    // ── 8. Success ────────────────────────────────────────────────
    resetRateLimit(rateLimitKey)

    const normalizedRole = typeof user.role === 'string'
      ? user.role
      : (user.role as { name?: string } | null)?.name || 'ADMIN'

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
