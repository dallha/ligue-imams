import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { compare } from 'bcryptjs'
import { createAdminSession, setAdminCookie } from '@/lib/admin-auth'
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

    // Password length check (bcrypt won't hash >72 chars, and short ones are weak)
    if (password.length < 4 || password.length > 128) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Identifiants invalides', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // ── 3. Look up user ──────────────────────────────────────────
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { region: true },
    })

    if (!user) {
      // Generic error — don't reveal whether the email exists
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Identifiants invalides', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // ── 4. Check role ─────────────────────────────────────────────
    // Note: user.role peut être une chaîne (stockée directement) ou un objet Role (relation).
    // On gère les deux cas pour la compatibilité.
    const userRole = typeof user.role === 'string' 
      ? user.role 
      : (user.role as { name?: string } | null)?.name || '';

    if (!['ADMIN', 'PRESIDENT', 'RESPONSABLE_REGIONAL'].includes(userRole)) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Identifiants invalides', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // ── 5. Verify password ────────────────────────────────────────
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

    // ── 6. Success — create session ───────────────────────────────
    resetRateLimit(rateLimitKey)

    // Normaliser le rôle : si c'est un objet Role, extraire le nom
    const normalizedRole = typeof user.role === 'string' 
      ? user.role 
      : (user.role as { name?: string } | null)?.name || 'ADMIN';

    const token = await createAdminSession({
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: normalizedRole,
    })

    await setAdminCookie(token)

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
