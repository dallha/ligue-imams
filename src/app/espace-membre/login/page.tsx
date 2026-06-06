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

const loginSchema = z.object({
  email: z.string().min(1, 'Email ou matricule requis'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function MemberLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const redirect = searchParams.get('redirect') || '/espace-membre'

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
        setError(resData.error || 'Erreur de connexion')
        return
      }

      router.push(redirect)
      router.refresh()
    } catch {
      setError('Erreur de connexion au serveur')
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
          <h1 className="text-2xl font-bold text-white">Espace Membre</h1>
          <p className="font-arabic text-lips-gold/80 text-xl mt-1">الفضاء الخاص</p>
          <p className="text-white/60 text-sm mt-2">
            Connectez-vous pour accéder à votre espace personnel
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
                Connexion Membre
              </CardTitle>
              <CardDescription>
                Entrez vos identifiants pour accéder à votre espace
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
                          Les comptes admin ne peuvent pas accéder à l&apos;espace membre. Utilisez un compte membre (Imam, Prédicateur, etc.).
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email ou Matricule</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="text"
                      placeholder="email@exemple.sn ou LIPS-2025-DKR-000124"
                      className="pl-10"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
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
                    Mot de passe oublié ?
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
                      Connexion...
                    </span>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>

              <div className="mt-5 pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Pas encore membre ?{' '}
                  <Link
                    href="/adherer"
                    className="text-lips-green hover:text-lips-green-dark font-semibold transition-colors"
                  >
                    Adhérer
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
          © 2026 LIPS — Ligue des Imams et Prédicateurs du Sénégal
        </motion.p>
      </div>
    </div>
  )
}

export default function MemberLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-lips-green-dark">
        <div className="text-white/60 text-sm">Chargement...</div>
      </div>
    }>
      <MemberLoginForm />
    </Suspense>
  )
}
