'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lock, Eye, EyeOff, AlertCircle, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/lips/i18n/language-context'

function MemberLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { p } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const redirect = searchParams.get('redirect') || '/espace-membre'

  const loginSchema = z.object({
    email: z.string().min(1, p.pages.memberLogin.emailRequired),
    password: z.string().min(1, p.pages.memberLogin.passwordRequired),
  })

  type LoginFormValues = z.infer<typeof loginSchema>

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormValues) {
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
        setError(resData.error || p.pages.memberLogin.loginError)
        return
      }

      router.push(redirect)
      router.refresh()
    } catch {
      setError(p.pages.memberLogin.serverError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lips-green-dark islamic-pattern relative">
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-lips-green-dark/50 via-transparent to-lips-green-dark/80" />

      <div className="relative w-full max-w-md mx-4">
        {/* LIPS Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center border-2 border-lips-gold/50 backdrop-blur-sm overflow-hidden p-2">
            <img src="/logo.png" alt="LIPS" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">{p.pages.memberLogin.spaceTitle}</h1>
          <p className="font-arabic text-lips-gold/80 text-xl mt-1">الفضاء الخاص</p>
          <p className="text-white/60 text-sm mt-2">
            {p.pages.memberLogin.spaceDesc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl text-lips-green-dark">
                {p.pages.memberLogin.cardTitle}
              </CardTitle>
              <CardDescription>
                {p.pages.memberLogin.cardDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-start gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span>{error}</span>
                      {error.includes('non autorisé') && (
                        <p className="text-xs text-red-500 mt-1">
                          {p.pages.memberLogin.adminError}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{p.pages.memberLogin.emailOrMatricule}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="text"
                      placeholder={p.pages.memberLogin.placeholder}
                      className="pl-10"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{p.pages.memberLogin.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link
                    href="#"
                    className="text-sm text-lips-green hover:text-lips-green-dark transition-colors"
                  >
                    {p.pages.memberLogin.forgotPassword}
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-lips-green hover:bg-lips-green-dark text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {p.pages.memberLogin.connecting}
                    </span>
                  ) : (
                    p.pages.memberLogin.login
                  )}
                </Button>
              </form>

              <div className="mt-5 pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  {p.pages.memberLogin.notMember}{' '}
                  <Link
                    href="/adherer"
                    className="text-lips-green hover:text-lips-green-dark font-semibold transition-colors"
                  >
                    {p.pages.memberLogin.joinLink}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-white/40 text-xs mt-6"
        >
          {p.pages.memberLogin.copyright}
        </motion.p>
      </div>
    </div>
  )
}

export default function MemberLoginPage() {
  const { p } = useLanguage()
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-lips-green-dark">
        <div className="text-white/60 text-sm">Loading...</div>
      </div>
    }>
      <MemberLoginForm />
    </Suspense>
  )
}
