'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  KeyRound,
  Fingerprint,
  ScanFace,
  ChevronRight,
  Info,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Client-side lockout (complements server-side rate limiting) ───
const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 30

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
function getPasswordStrength(pw: string): { score: number; label: string; color: string; percent: number } {
  if (!pw) return { score: 0, label: '', color: '', percent: 0 }
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { score: 1, label: 'Faible', color: 'text-red-400', percent: 25 }
  if (score <= 2) return { score: 2, label: 'Moyen', color: 'text-amber-400', percent: 50 }
  if (score <= 3) return { score: 3, label: 'Bon', color: 'text-lips-green', percent: 75 }
  return { score: 4, label: 'Fort', color: 'text-emerald-400', percent: 100 }
}

// ─── Animation variants ─────────────────────────────────────────
const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorShake, setErrorShake] = useState(false)
  const [lockout, setLockout] = useState<{ locked: boolean; remaining: number }>({
    locked: false,
    remaining: 0,
  })
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [showSecurityInfo, setShowSecurityInfo] = useState(false)

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

  const triggerErrorShake = useCallback(() => {
    setErrorShake(true)
    setTimeout(() => setErrorShake(false), 600)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (lockout.locked) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        recordFailedAttempt()
        const info = getLockoutInfo()
        setLockout(info)
        setAttemptsLeft(Math.max(0, attemptsLeft - 1))

        if (res.status === 429) {
          setError('Trop de tentatives. Veuillez patienter avant de réessayer.')
          setLockout({
            locked: true,
            remaining: data.lockoutRemaining || LOCKOUT_MINUTES,
          })
        } else {
          setError(data.error || 'Erreur de connexion')
        }
        triggerErrorShake()
        return
      }

      resetAttempts()
      router.push(redirect)
      router.refresh()
    } catch {
      setError('Erreur de connexion au serveur')
      triggerErrorShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#040a06]">
      {/* ─── Background layers ──────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#081a0e] via-[#0a1f12] to-[#040c07]" />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(183,148,62,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(183,148,62,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Islamic pattern overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-lips-green/[0.04] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-lips-gold/[0.04] rounded-full blur-[120px]" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lips-gold/25 to-transparent" />

      {/* ─── Main content ──────────────────────────────────── */}
      <div className="relative w-full max-w-[440px] mx-4 z-10">
        {/* Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <div className="w-[72px] h-[72px] mx-auto rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-md flex items-center justify-center border border-lips-gold/20 shadow-xl shadow-black/20 overflow-hidden p-2.5">
              <img src="/logo.png" alt="LIPS" className="w-full h-full object-contain" />
            </div>
            {/* Verified badge */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-lips-green flex items-center justify-center border-2 border-[#040a06]">
              <ShieldCheck className="h-3 w-3 text-white" />
            </div>
          </div>
          <h1 className="text-[22px] font-bold text-white tracking-tight mt-4">
            LIPS Administration
          </h1>
          <p className="text-white/30 text-[13px] mt-1.5 leading-relaxed">
            Système d&apos;Information Institutionnel National
          </p>
        </motion.div>

        {/* ─── Login Card ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card
            className={`border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl shadow-2xl shadow-black/40 rounded-2xl overflow-hidden transition-transform ${
              errorShake ? 'animate-shake' : ''
            }`}
          >
            {/* Security accent band */}
            <div className="h-[3px] bg-gradient-to-r from-lips-gold via-lips-green to-lips-gold" />

            <CardHeader className="text-center pb-2 pt-6 px-6">
              {/* Security icon */}
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-lips-gold/10 to-lips-gold/5 border border-lips-gold/15 flex items-center justify-center mb-4 shadow-inner">
                <ShieldAlert className="h-7 w-7 text-lips-gold/80" />
              </div>
              <CardTitle className="text-[20px] text-white font-bold tracking-tight">
                Accès sécurisé
              </CardTitle>
              <CardDescription className="text-white/35 text-[13px] mt-1.5 leading-relaxed">
                Authentification requise pour accéder au panneau d&apos;administration
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-3">
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                {/* ── Error message ─────────────────────────── */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      variants={fadeIn}
                      className="flex items-start gap-3 p-3.5 text-[13px] text-red-300 bg-red-500/[0.08] border border-red-500/15 rounded-xl"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                      <div className="flex-1">
                        <p className="font-medium">{error}</p>
                        {error === 'Identifiants invalides' && (
                          <p className="text-[11px] text-red-400/50 mt-1">
                            Vérifiez votre email et mot de passe
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Lockout warning ────────────────────────── */}
                <AnimatePresence>
                  {lockout.locked && (
                    <motion.div
                      variants={fadeIn}
                      className="flex items-start gap-3 p-3.5 text-[13px] text-amber-300 bg-amber-500/[0.08] border border-amber-500/15 rounded-xl"
                    >
                      <Clock className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                      <div className="flex-1">
                        <p className="font-medium">
                          Accès temporairement bloqué
                        </p>
                        <p className="text-[11px] text-amber-400/50 mt-1">
                          Réessayez dans {lockout.remaining} minute{lockout.remaining > 1 ? 's' : ''}.
                          Sécurité anti-intrusion activée.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Email field ────────────────────────────── */}
                <motion.div variants={fadeIn} className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-white/50 text-[11px] font-semibold uppercase tracking-widest"
                  >
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@lips.sn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15 focus:border-lips-gold/30 focus:ring-lips-gold/10 h-11 rounded-xl transition-all duration-200"
                      disabled={lockout.locked || loading}
                      autoComplete="email"
                      required
                    />
                  </div>
                </motion.div>

                {/* ── Password field ─────────────────────────── */}
                <motion.div variants={fadeIn} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-white/50 text-[11px] font-semibold uppercase tracking-widest"
                    >
                      Mot de passe
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                      className="text-[10px] text-white/25 hover:text-white/40 transition-colors flex items-center gap-1"
                    >
                      <Info className="h-3 w-3" />
                      Sécurité
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15 focus:border-lips-gold/30 focus:ring-lips-gold/10 h-11 rounded-xl transition-all duration-200"
                      disabled={lockout.locked || loading}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setTimeout(() => setPasswordFocused(false), 200)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  <AnimatePresence>
                    {passwordFocused && password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 pt-1"
                      >
                        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${strength.percent}%` }}
                            transition={{ duration: 0.3 }}
                            className={`h-full rounded-full ${
                              strength.score <= 1
                                ? 'bg-red-500'
                                : strength.score <= 2
                                ? 'bg-amber-500'
                                : strength.score <= 3
                                ? 'bg-lips-green'
                                : 'bg-emerald-400'
                            }`}
                          />
                        </div>
                        <p className="text-[10px] text-white/30">
                          Force du mot de passe :{' '}
                          <span className={strength.color}>{strength.label}</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* ── Security info panel ────────────────────── */}
                <AnimatePresence>
                  {showSecurityInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3.5 space-y-2.5"
                    >
                      <p className="text-[11px] text-white/40 font-medium">
                        Mesures de sécurité actives :
                      </p>
                      {[
                        { icon: Shield, label: 'Chiffrement SSL/TLS', desc: 'Données chiffrées en transit' },
                        { icon: Fingerprint, label: 'Jetons JWT sécurisés', desc: 'Authentification par jeton signé' },
                        { icon: ShieldAlert, label: 'Protection anti-intrusion', desc: 'Verrouillage après 5 échecs' },
                        { icon: ScanFace, label: 'Audit de connexion', desc: 'Tentatives enregistrées' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <item.icon className="h-3.5 w-3.5 text-lips-gold/50 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] text-white/50">{item.label}</p>
                            <p className="text-[10px] text-white/25">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Submit button ──────────────────────────── */}
                <motion.div variants={fadeIn}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-lips-gold to-lips-gold-light hover:from-lips-gold-light hover:to-lips-gold text-lips-green-dark font-bold h-11 rounded-xl shadow-lg shadow-lips-gold/10 transition-all duration-300 group"
                    disabled={loading || lockout.locked}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2.5">
                        <span className="h-4 w-4 border-2 border-lips-green-dark/30 border-t-lips-green-dark rounded-full animate-spin" />
                        Authentification...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Se connecter
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    )}
                  </Button>
                </motion.div>

                {/* ── Attempts remaining ─────────────────────── */}
                <AnimatePresence>
                  {attemptsLeft < MAX_ATTEMPTS && !lockout.locked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <div className="flex gap-1">
                        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                              i < attemptsLeft
                                ? 'bg-lips-gold/40'
                                : 'bg-red-500/40'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-amber-400/40">
                        {attemptsLeft} tentative{attemptsLeft !== 1 ? 's' : ''} restante{attemptsLeft !== 1 ? 's' : ''}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>

              {/* ─── Bottom section ──────────────────────────── */}
              <div className="mt-5 pt-4 border-t border-white/[0.04]">
                {/* Security badges */}
                <div className="flex items-center justify-center gap-4">
                  {[
                    { icon: Shield, label: 'SSL/TLS' },
                    { icon: Fingerprint, label: 'JWT' },
                    { icon: ShieldAlert, label: 'Anti-intrusion' },
                  ].map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-[10px] text-white/20"
                    >
                      <badge.icon className="h-3 w-3" />
                      <span>{badge.label}</span>
                    </div>
                  ))}
                </div>

                {/* Restricted access notice */}
                <p className="text-center text-[10px] text-white/15 mt-3 flex items-center justify-center gap-1">
                  <ShieldAlert className="h-2.5 w-2.5" />
                  Accès strictement réservé au personnel autorisé — LIPS
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Footer ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-white/15 text-[11px]">
            © {new Date().getFullYear()} LIPS — Système d&apos;Information Institutionnel National
          </p>
        </motion.div>
      </div>

      {/* ─── CSS for shake animation ──────────────────────────── */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#040a06]">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="h-8 w-8 border-2 border-white/10 border-t-lips-gold/60 rounded-full animate-spin" />
            </div>
            <p className="text-white/25 text-xs">Chargement sécurisé...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
