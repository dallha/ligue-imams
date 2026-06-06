import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { compare } from 'bcryptjs'
import { createMemberSession, setMemberCookie } from '@/lib/member-auth'
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit'

const MEMBER_ROLES = ['IMAM', 'PREDICATEUR', 'RESPONSABLE_REGIONAL', 'MEMBRE_CHOURA']

// Rate limit config: 5 attempts per 15 minutes, then 15 min lockout
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000,
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
    const rateLimitKey = `member-login:${clientIp}`
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
        { error: 'Email/Matricule et mot de passe requis', code: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    if (password.length < 4 || password.length > 128) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Identifiants invalides', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // ── 3. Find user by email or matricule ────────────────────────
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          { matricule: email.trim() },
        ],
      },
      include: { region: true, mosque: true, carteMembre: true },
    })

    if (!user) {
      await timingSafeDelay(startTime)
      return NextResponse.json(
        { error: 'Identifiants invalides', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // ── 4. Check role ─────────────────────────────────────────────
    if (!MEMBER_ROLES.includes(user.role)) {
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

    const token = await createMemberSession({
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      matricule: user.matricule,
    })

    await setMemberCookie(token)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        matricule: user.matricule,
        status: user.status,
        telephone: user.telephone,
        photo: user.photo,
        region: user.region ? { nom: user.region.nom, nomAr: user.region.nomAr } : null,
        mosque: user.mosque ? { nom: user.mosque.nom, adresse: user.mosque.adresse } : null,
        carteMembre: user.carteMembre ? {
          numeroCarte: user.carteMembre.numeroCarte,
          dateEmission: user.carteMembre.dateEmission,
          dateExpiration: user.carteMembre.dateExpiration,
        } : null,
      },
    })
  } catch (error) {
    console.error('Member login error:', error)
    await timingSafeDelay(startTime)
    return NextResponse.json(
      { error: 'Erreur serveur', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
