/**
 * In-memory rate limiter for API routes.
 *
 * Uses a sliding-window approach: each IP + key combination tracks
 * attempts within a configurable time window. When the limit is
 * exceeded the requester is locked out for a cooldown period.
 *
 * ⚠️ This store lives in process memory — it resets on server restart.
 * For multi-instance deployments, replace with Redis / Upstash / DB store.
 */

interface AttemptRecord {
  count: number
  firstAttemptAt: number
  lockedUntil: number | null
}

interface RateLimitConfig {
  /** Max attempts within the window before lockout */
  maxAttempts: number
  /** Window duration in milliseconds */
  windowMs: number
  /** Lockout duration in milliseconds after maxAttempts exceeded */
  lockoutMs: number
}

const store = new Map<string, AttemptRecord>()

// Periodic cleanup of expired entries (every 10 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of store) {
      const isExpired =
        now - record.firstAttemptAt > 60 * 60 * 1000 && // 1h since first attempt
        (!record.lockedUntil || now > record.lockedUntil)
      if (isExpired) store.delete(key)
    }
  }, 10 * 60 * 1000)
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean
  /** Remaining attempts before lockout */
  remaining: number
  /** Lockout expiry timestamp (ms) if currently locked out */
  lockedUntil: number | null
  /** Minutes remaining in lockout */
  lockoutRemaining: number
  /** Total attempts in current window */
  totalAttempts: number
}

/**
 * Check and record a rate-limited attempt.
 *
 * @param identifier - Unique identifier (e.g. IP address or IP+route)
 * @param config     - Rate limit configuration
 * @returns Result indicating whether the request is allowed
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  let record = store.get(key)

  // Clean up expired records
  if (record) {
    // If lockout has expired, reset
    if (record.lockedUntil && now > record.lockedUntil) {
      store.delete(key)
      record = undefined
    }
    // If window has expired, reset
    else if (now - record.firstAttemptAt > config.windowMs && !record.lockedUntil) {
      store.delete(key)
      record = undefined
    }
  }

  // If locked out
  if (record?.lockedUntil && now <= record.lockedUntil) {
    const remaining = Math.ceil((record.lockedUntil - now) / 60000)
    return {
      allowed: false,
      remaining: 0,
      lockedUntil: record.lockedUntil,
      lockoutRemaining: remaining,
      totalAttempts: record.count,
    }
  }

  // First attempt or within window
  if (!record) {
    record = {
      count: 1,
      firstAttemptAt: now,
      lockedUntil: null,
    }
    store.set(key, record)
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      lockedUntil: null,
      lockoutRemaining: 0,
      totalAttempts: 1,
    }
  }

  // Increment attempts
  record.count++

  // Check if limit exceeded
  if (record.count >= config.maxAttempts) {
    record.lockedUntil = now + config.lockoutMs
    store.set(key, record)
    return {
      allowed: false,
      remaining: 0,
      lockedUntil: record.lockedUntil,
      lockoutRemaining: Math.ceil(config.lockoutMs / 60000),
      totalAttempts: record.count,
    }
  }

  store.set(key, record)
  return {
    allowed: true,
    remaining: config.maxAttempts - record.count,
    lockedUntil: null,
    lockoutRemaining: 0,
    totalAttempts: record.count,
  }
}

/**
 * Reset rate limit for a given identifier (e.g. after successful login)
 */
export function resetRateLimit(identifier: string): void {
  store.delete(identifier)
}

/**
 * Get client IP from Next.js request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  return 'unknown'
}
