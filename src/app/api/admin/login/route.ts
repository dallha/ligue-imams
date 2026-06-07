import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit'

// Rate limit config: 5 attempts per 15 minutes, then 30 min lockout
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,   // 15 minutes
  lockoutMs: 30 * 60 * 1000,   // 30 minutes lockout (stricter for admin)
}

// Minimum time for a login response to prevent timing attacks (ms)
const MIN_RESPONSE_TIME = 300

/**
 * Add an artificial delay so that both "user not found" and
 * "wrong password" responses take roughly the same time, preventing
 * an attacker from distinguishing the two cases by response time.
 */
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

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Identifiants invalides', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // Password length check
    if (password.length < 4 || password.length > 128) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Identifiants invalides', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // ── 3. Authenticate with Supabase Auth ────────────────────────
    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (authError || !authData.user) {
      await timingSafeDelay(startTime)

      // Log l'erreur exacte pour le débogage
      console.error('Supabase auth error:', authError?.message, authError?.code, authError?.status)

      // Vérifier si l'email n'est pas confirmé
      const errorMessage = authError?.message?.toLowerCase() || ''
      const errorCode = authError?.code || ''

      if (
        errorMessage.includes('email not confirmed') ||
        errorMessage.includes('email not confirmed') ||
        errorCode === 'email_not_confirmed'
      ) {
        return NextResponse.json(
          { error: 'Email non confirmé. Veuillez vérifier votre boîte de réception.', code: 'EMAIL_NOT_CONFIRMED' },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { error: 'Identifiants invalides', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // ── 4. Look up user in our database ───────────────────────────
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { region: true, role: true },
    })

    if (!user) {
      // L'utilisateur existe dans Supabase Auth mais pas dans notre DB
      // On sign out pour nettoyer la session Supabase
      await supabase.auth.signOut()
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Compte non trouvé. Contactez l\'administrateur.', code: 'USER_NOT_FOUND' },
        { status: 401 }
      )
    }

    // ── 5. Check role ─────────────────────────────────────────────
    const userRole = typeof user.role === 'string'
      ? user.role
      : (user.role as { name?: string } | null)?.name || ''

    if (!['ADMIN', 'PRESIDENT', 'RESPONSABLE_REGIONAL'].includes(userRole)) {
      await supabase.auth.signOut()
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Accès non autorisé', code: 'UNAUTHORIZED_ROLE' },
        { status: 403 }
      )
    }

    // ── 6. Check status ───────────────────────────────────────────
    if (user.status !== 'ACTIF') {
      await supabase.auth.signOut()
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Compte désactivé. Contactez l\'administrateur.', code: 'ACCOUNT_DISABLED' },
        { status: 403 }
      )
    }

    // ── 7. Success ────────────────────────────────────────────────
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
