'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Toaster } from 'sonner'
import {
  LayoutDashboard,
  User,
  CreditCard,
  LogOut,
  Menu,
} from 'lucide-react'
import { motion } from 'framer-motion'

interface MemberUser {
  id: number
  email: string
  nom: string
  prenom: string
  role: string
  matricule: string
  status: string
  photo: string | null
  region: { nom: string; nomAr: string | null } | null
}

const navItems = [
  { href: '/espace-membre', label: 'Tableau de Bord', icon: LayoutDashboard },
  { href: '/espace-membre#profil', label: 'Mon Profil', icon: User },
  { href: '/espace-membre#cotisations', label: 'Mes Cotisations', icon: CreditCard },
]

function TopNav({ memberUser, onLogout, mounted }: { memberUser: MemberUser | null; onLogout: () => void; mounted: boolean }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = memberUser
    ? `${memberUser.prenom[0]}${memberUser.nom[0]}`
    : 'M'

  const roleLabel: Record<string, string> = {
    IMAM: 'Imam',
    PREDICATEUR: 'Prédicateur',
    RESPONSABLE_REGIONAL: 'Resp. Régional',
    MEMBRE_CHOURA: 'Membre Choura',
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-lips-green/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/espace-membre" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo LIPS"
              className="w-9 h-9 rounded-lg object-contain shadow-md"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-lips-green-dark text-sm leading-tight">LIPS</div>
              <div className="text-[10px] text-muted-foreground leading-tight">Espace Membre</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.href === '/espace-membre'
                ? pathname === '/espace-membre'
                : pathname.startsWith(item.href.split('#')[0])

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'text-lips-green bg-lips-green/5'
                      : 'text-muted-foreground hover:text-lips-green hover:bg-lips-green/5'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: User + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <Avatar className="h-8 w-8 border border-lips-green/20">
                <AvatarFallback className="bg-lips-green/10 text-lips-green text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {memberUser ? `${memberUser.prenom} ${memberUser.nom}` : 'Membre'}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {memberUser ? (roleLabel[memberUser.role] || memberUser.role) : ''}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-red-600 hover:bg-red-50 gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>

            {/* Mobile Menu Button */}
            {mounted ? (
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-0">
                  <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
                  <div className="flex flex-col h-full">
                    {/* Mobile User Info */}
                    <div className="p-4 bg-lips-green-dark">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-white/20">
                          <AvatarFallback className="bg-white/10 text-white text-sm font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {memberUser ? `${memberUser.prenom} ${memberUser.nom}` : 'Membre'}
                          </p>
                          <p className="text-xs text-white/60">
                            {memberUser ? (roleLabel[memberUser.role] || memberUser.role) : ''}
                          </p>
                          {memberUser?.region && (
                            <p className="text-xs text-lips-gold/80 mt-0.5">
                              {memberUser.region.nom}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Mobile Nav Items */}
                    <nav className="flex-1 p-3 space-y-1">
                      {navItems.map((item) => {
                        const isActive = item.href === '/espace-membre'
                          ? pathname === '/espace-membre'
                          : pathname.startsWith(item.href.split('#')[0])

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                              isActive
                                ? 'text-lips-green bg-lips-green/5'
                                : 'text-muted-foreground hover:text-lips-green hover:bg-lips-green/5'
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </nav>

                    <Separator />

                    <div className="p-3">
                      <Button
                        variant="ghost"
                        onClick={onLogout}
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3"
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" size="icon" className="md:hidden" disabled aria-hidden>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default function EspaceMembreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [memberUser, setMemberUser] = useState<MemberUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    fetch('/api/membre/me')
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Not authenticated')
      })
      .then(data => setMemberUser(data.user))
      .catch(() => {
        // Not authenticated, redirect to login
        if (pathname !== '/espace-membre/login') {
          router.push('/espace-membre/login')
        }
      })
      .finally(() => setLoading(false))
  }, [pathname, router])

  async function handleLogout() {
    await fetch('/api/membre/logout', { method: 'POST' })
    router.push('/espace-membre/login')
    router.refresh()
  }

  // Login page should not have the nav bar
  if (pathname === '/espace-membre/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-lips-green/30 border-t-lips-green rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Chargement de votre espace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNav memberUser={memberUser} onLogout={handleLogout} mounted={mounted} />
      <main className="flex-1">
        {children}
      </main>
      <Toaster position="top-right" richColors />
    </div>
  )
}
