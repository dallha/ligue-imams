'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Mail, Eye, EyeOff, AlertCircle, Shield, Fingerprint, BadgeCheck, Clock, KeyRound, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/lips/i18n/language-context'

// ─── Brute-force protection ────────────────────────────────────
const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15 // Admin lockout is longer

function getLockoutInfo(): { locked: boolean; remaining: number } {
  try {
    const data = localStorage.getItem('lips-admin-lockout')
    if (!data) return { locked: false, remaining: 0 }
    const { attempts, lockedUntil } = JSON.parse(data)
    if (lockedUntil && Date.now() < lockedUntil) {
      return { locked: true, remaining: Math.ceil((lockedUntil - Date.now()) / 60000) }
    }
    if (attempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_MINUTES * 60_000
      localStorage.setItem('lips-admin-lockout', JSON.stringify({ attempts, lockedUntil: until }))
      return { locked: true, remaining: LOCKOUT_MINUTES }
    }
    return { locked: false, remaining: 0 }
  } catch {
    return { locked: false, remaining: 0 }
  }
}

function recordFailedAttempt() {
  try {
    const data = localStorage.getItem('lips-admin-lockout')
    const current = data ? JSON.parse(data) : { attempts: 0, lockedUntil: null }
    current.attempts = (current.attempts || 0) + 1
    localStorage.setItem('lips-admin-lockout', JSON.stringify(current))
  } catch {}
}

function resetAttempts() {
  try { localStorage.removeItem('lips-admin-lockout') } catch {}
}

// ─── Password strength ─────────────────────────────────────────
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { score: 1, label: 'Faible', color: 'bg-red-500' }
  if (score <= 2) return { score: 2, label: 'Moyen', color: 'bg-amber-500' }
  if (score <= 3) return { score: 3, label: 'Bon', color: 'bg-lips-green' }
  return { score: 4, label: 'Fort', color: 'bg-emerald-500' }
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lockout, setLockout] = useState<{ locked: boolean; remaining: number }>({ locked: false, remaining: 0 })
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const redirect = searchParams.get('redirect') || '/admin'
  const strength = getPasswordStrength(password)

  // Check lockout on mount
  useEffect(() => {
    const info = getLockoutInfo()
    setLockout(info)
    try {
      const data = localStorage.getItem('lips-admin-lockout')
      if (data) {
        const { attempts } = JSON.parse(data)
        setAttemptsLeft(Math.max(0, MAX_ATTEMPTS - (attempts || 0)))
      }
    } catch {}
  }, [])

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockout.locked) return
    const interval = setInterval(() => {
      const info = getLockoutInfo()
      setLockout(info)
      if (!info.locked) {
        resetAttempts()
        setAttemptsLeft(MAX_ATTEMPTS)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [lockout.locked])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (lockout.locked) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        recordFailedAttempt()
        const info = getLockoutInfo()
        setLockout(info)
        setAttemptsLeft(Math.max(0, attemptsLeft - 1))
        setError(data.error || 'Erreur de connexion')
        return
      }

      resetAttempts()
      router.push(redirect)
      router.refresh()
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060e09] islamic-pattern relative overflow-hidden">
      {/* Dark, more serious background for admin */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0f] via-[#0d1f13] to-[#050c07]" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.04]" />

      {/* Decorative elements — more subtle for admin */}
      <div className="hidden lg:block absolute top-16 left-16 w-32 h-32 border border-lips-gold/8 rotate-45 rounded-sm" />
      <div className="hidden lg:block absolute bottom-20 right-20 w-20 h-20 border border-white/5 rotate-12 rounded-sm" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lips-gold/20 to-transparent" />

      <div className="relative w-full max-w-md mx-4 z-10">
        {/* LIPS Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border-2 border-lips-gold/30 shadow-lg shadow-lips-gold/5 overflow-hidden p-2">
            <img src="/logo.png" alt="LIPS" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">LIPS Admin</h1>
          <p className="text-white/40 text-sm mt-1">
            Système d&apos;Information Institutionnel National
          </p>
        </motion.div>

        {/* Admin Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Card className="border border-white/8 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-black/30 rounded-2xl overflow-hidden">
            {/* Admin security band — gold accent */}
            <div className="h-1 bg-gradient-to-r from-lips-gold via-lips-green to-lips-gold" />

            <CardHeader className="text-center pb-3 pt-5">
              <div className="mx-auto w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                <ShieldAlert className="h-6 w-6 text-red-400" />
              </div>
              <CardTitle className="text-xl text-white font-bold">
                Administration
              </CardTitle>
              <CardDescription className="text-white/40 text-sm">
                Accès réservé aux administrateurs autorisés
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2.5 p-3.5 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Lockout warning */}
                <AnimatePresence>
                  {lockout.locked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2.5 p-3.5 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                    >
                      <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span>Compte verrouillé. Réessayez dans {lockout.remaining} min.</span>
                        <p className="text-xs text-amber-400/50 mt-1">Sécurité anti-intrusion activée.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    Email administrateur
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@lips.sn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-lips-gold/40 focus:ring-lips-gold/15 h-11 rounded-xl"
                      disabled={lockout.locked}
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-lips-gold/40 focus:ring-lips-gold/15 h-11 rounded-xl"
                      disabled={lockout.locked}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password strength */}
                  <AnimatePresence>
                    {passwordFocused && password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5 pt-1"
                      >
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                strength.score >= level ? strength.color : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-white/35">
                          Force : <span className={strength.score >= 3 ? 'text-emerald-400' : strength.score >= 2 ? 'text-amber-400' : 'text-red-400'}>{strength.label}</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full bg-lips-gold hover:bg-lips-gold-light text-lips-green-dark font-bold h-11 rounded-xl shadow-lg shadow-lips-gold/15 transition-all duration-200"
                  disabled={loading || lockout.locked}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-lips-green-dark/30 border-t-lips-green-dark rounded-full animate-spin" />
                      Connexion...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Se connecter
                    </span>
                  )}
                </Button>

                {/* Security badges — more emphasis for admin */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/25">
                    <Shield className="h-3 w-3" />
                    <span>SSL/TLS</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/25">
                    <Fingerprint className="h-3 w-3" />
                    <span>JWT Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/25">
                    <BadgeCheck className="h-3 w-3" />
                    <span>Anti-intrusion</span>
                  </div>
                </div>

                {/* Attempts remaining */}
                {attemptsLeft < MAX_ATTEMPTS && !lockout.locked && (
                  <p className="text-center text-[10px] text-amber-400/50">
                    {attemptsLeft} tentative{attemptsLeft !== 1 ? 's' : ''} restante{attemptsLeft !== 1 ? 's' : ''}
                  </p>
                )}
              </form>

              {/* Restricted access warning */}
              <div className="mt-5 pt-4 border-t border-white/5 text-center">
                <p className="text-xs text-white/25 flex items-center justify-center gap-1.5">
                  <ShieldAlert className="h-3 w-3" />
                  Accès strictement réservé au personnel autorisé
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-white/20 text-xs mt-6"
        >
          © {new Date().getFullYear()} LIPS — Système d&apos;Information Institutionnel National
        </motion.p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#060e09]">
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <span className="h-4 w-4 border-2 border-white/15 border-t-white/50 rounded-full animate-spin" />
          Chargement...
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
