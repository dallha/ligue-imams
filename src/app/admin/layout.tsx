'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Toaster } from 'sonner'
import {
  LayoutDashboard,
  FileText,
  Users,
  Globe,
  Building2,
  Handshake,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
} from 'lucide-react'

const sidebarItems = [
  { href: '/admin', label: 'Tableau de Bord', icon: LayoutDashboard },
  { href: '/admin/contenus', label: 'Contenus', icon: FileText },
  { href: '/admin/membres', label: 'Membres', icon: Users },
  { href: '/admin/regions', label: 'Régions', icon: Globe },
  { href: '/admin/bureau', label: 'Bureau National', icon: Building2 },
  { href: '/admin/commissions', label: 'Commissions', icon: Handshake },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<{ nom: string; prenom: string; role: string } | null>(null)

  useEffect(() => {
    // Read admin session from cookie on client side
    fetch('/api/admin/me').then(res => {
      if (res.ok) return res.json()
      throw new Error('Not authenticated')
    }).then(data => setAdminUser(data.user)).catch(() => {
      // Not authenticated, will be redirected by middleware
    })
  }, [])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const initials = adminUser
    ? `${adminUser.prenom[0]}${adminUser.nom[0]}`
    : 'A'

  return (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-10 h-10 rounded-lg bg-lips-gold/20 flex items-center justify-center border border-lips-gold/30">
            <span className="text-lg font-bold text-lips-gold">L</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">LIPS</h2>
            <p className="text-xs text-white/50">Administration</p>
          </div>
        </Link>
      </div>

      <Separator className="bg-white/10" />

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-lips-gold')} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 text-lips-gold" />}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-white/10" />

      {/* User Profile & Logout */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3 px-2">
          <Avatar className="h-9 w-9 border border-white/20">
            <AvatarFallback className="bg-lips-gold/20 text-lips-gold text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {adminUser ? `${adminUser.prenom} ${adminUser.nom}` : 'Admin'}
            </p>
            <p className="text-xs text-white/40 truncate">
              {adminUser?.role || 'Administration'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5 gap-3"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Login page should not have sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-lips-green-dark">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-lips-green-dark border-0">
          <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
          <SidebarContent onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center h-16 px-4 lg:px-6">
            {/* Mobile Menu Button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
            </Sheet>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-muted-foreground">
              <Link href="/admin" className="hover:text-foreground transition-colors">
                Admin
              </Link>
              {pathname !== '/admin' && pathname !== '/admin/login' && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-foreground font-medium capitalize">
                    {pathname.replace('/admin/', '').replace(/-/g, ' ')}
                  </span>
                </>
              )}
            </nav>

            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Voir le site →
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  )
}
