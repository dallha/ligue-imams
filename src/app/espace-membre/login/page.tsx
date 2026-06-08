'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lock, Eye, EyeOff, AlertCircle, User, Shield, Fingerprint, KeyRound, BadgeCheck, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/lips/i18n/language-context'

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

function MemberLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { p } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lockout, setLockout] = useState<{ locked: boolean; remaining: number }>({ locked: false, remaining: 0 })
  const [passwordFocused, setPasswordFocused] = useState(false)

  const redirect = searchParams.get('redirect') || '/espace-membre'

  useEffect(() => {
    if (!lockout.locked) return

    const interval = setInterval(() => {
      setLockout((current) => {
        if (!current.locked) return current
        if (current.remaining <= 1) {
          setError('')
          return { locked: false, remaining: 0 }
        }
        return { ...current, remaining: current.remaining - 1 }
      })
    }, 60_000)

    return () => clearInterval(interval)
  }, [lockout.locked])

  const loginSchema = z.object({
    email: z.string().min(1, p.pages.memberLogin.emailRequired),
    password: z.string().min(1, p.pages.memberLogin.passwordRequired),
  })

  type LoginFormValues = z.infer<typeof loginSchema>

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const passwordValue = watch('password') || ''
  const strength = getPasswordStrength(passwordValue)

  async function onSubmit(data: LoginFormValues) {
    if (lockout.locked) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/membre/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })

      const resData = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setLockout({
            locked: true,
            remaining: resData.lockoutRemaining || 5,
          })
          setError('Trop de tentatives. Veuillez patienter avant de réessayer.')
        } else {
          setLockout({ locked: false, remaining: 0 })
          setError(resData.error || p.pages.memberLogin.loginError)
        }
        return
      }

      setLockout({ locked: false, remaining: 0 })
      router.push(redirect)
      router.refresh()
    } catch {
      setError(p.pages.memberLogin.serverError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lips-green-dark islamic-pattern relative overflow-hidden">
      {/* Multi-layer decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-lips-green-dark via-lips-green-dark/90 to-[#071a0f]" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.06]" />

      {/* Decorative geometric accents */}
      <div className="hidden lg:block absolute top-20 left-20 w-40 h-40 border border-lips-gold/10 rotate-45 rounded-sm" />
      <div className="hidden lg:block absolute bottom-24 right-24 w-28 h-28 border border-white/5 rotate-12 rounded-sm" />
      <div className="hidden lg:block absolute top-1/3 right-16 w-16 h-16 border border-lips-gold/8 rotate-45 rounded-full" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lips-gold/30 to-transparent" />

      <div className="relative w-full max-w-md mx-4 z-10">
        {/* LIPS Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border-2 border-lips-gold/40 shadow-lg shadow-lips-gold/10 overflow-hidden p-2">
            <img src="/logo.png" alt="LIPS" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{p.pages.memberLogin.spaceTitle}</h1>
          <p className="font-arabic text-lips-gold/70 text-lg mt-1">الفضاء الخاص</p>
          <p className="text-white/50 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
            {p.pages.memberLogin.spaceDesc}
          </p>
        </motion.div>

        {/* Login Card — glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/20 rounded-2xl overflow-hidden">
            {/* Security header band */}
            <div className="h-1 bg-gradient-to-r from-lips-green via-lips-gold to-lips-green" />

            <CardHeader className="text-center pb-3 pt-5">
              <div className="mx-auto w-12 h-12 rounded-xl bg-lips-green/10 flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-lips-green" />
              </div>
              <CardTitle className="text-xl text-white font-bold">
                {p.pages.memberLogin.cardTitle}
              </CardTitle>
              <CardDescription className="text-white/50 text-sm">
                {p.pages.memberLogin.cardDesc}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        {error.includes('non autorisé') && (
                          <p className="text-xs text-red-400/70 mt-1">
                            {p.pages.memberLogin.adminError}
                          </p>
                        )}
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
                        <span>Trop de tentatives. Réessayez dans {lockout.remaining} min.</span>
                        <p className="text-xs text-amber-400/60 mt-1">Compte temporairement verrouillé pour sécurité.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email / Matricule field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/70 text-xs font-medium uppercase tracking-wider">
                    {p.pages.memberLogin.emailOrMatricule}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input
                      id="email"
                      type="text"
                      placeholder={p.pages.memberLogin.placeholder}
                      className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-lips-green/50 focus:ring-lips-green/20 h-11 rounded-xl"
                      disabled={lockout.locked}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/70 text-xs font-medium uppercase tracking-wider">
                    {p.pages.memberLogin.password}
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-lips-green/50 focus:ring-lips-green/20 h-11 rounded-xl"
                      disabled={lockout.locked}
                      onFocus={() => setPasswordFocused(true)}
                      {...register('password', { onBlur: () => setPasswordFocused(false) })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.password.message}
                    </p>
                  )}

                  {/* Password strength indicator */}
                  <AnimatePresence>
                    {passwordFocused && passwordValue && (
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
                        <p className="text-[10px] text-white/40">
                          Force : <span className={strength.score >= 3 ? 'text-emerald-400' : strength.score >= 2 ? 'text-amber-400' : 'text-red-400'}>{strength.label}</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <Link
                    href="#"
                    className="text-xs text-lips-gold/70 hover:text-lips-gold transition-colors"
                  >
                    {p.pages.memberLogin.forgotPassword}
                  </Link>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full bg-lips-green hover:bg-lips-green-light text-white font-semibold h-11 rounded-xl shadow-lg shadow-lips-green/20 transition-all duration-200"
                  disabled={loading || lockout.locked}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {p.pages.memberLogin.connecting}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      {p.pages.memberLogin.login}
                    </span>
                  )}
                </Button>

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <Shield className="h-3 w-3" />
                    <span>SSL/TLS</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <Fingerprint className="h-3 w-3" />
                    <span>Supabase Auth</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <BadgeCheck className="h-3 w-3" />
                    <span>Session sécurisée</span>
                  </div>
                </div>
              </form>

              {/* Divider + not a member */}
              <div className="mt-5 pt-4 border-t border-white/5 text-center">
                <p className="text-sm text-white/40">
                  {p.pages.memberLogin.notMember}{' '}
                  <Link
                    href="/adherer"
                    className="text-lips-gold hover:text-lips-gold-light font-semibold transition-colors"
                  >
                    {p.pages.memberLogin.joinLink}
                  </Link>
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
          className="text-center text-white/25 text-xs mt-6"
        >
          © {new Date().getFullYear()} LIPS — Système d&apos;Information Institutionnel National
        </motion.p>
      </div>
    </div>
  )
}

export default function MemberLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-lips-green-dark">
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <span className="h-4 w-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          Chargement...
        </div>
      </div>
    }>
      <MemberLoginForm />
    </Suspense>
  )
}
