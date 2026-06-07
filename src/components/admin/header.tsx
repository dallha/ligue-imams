'use client';

import { Bell, Search, UserCircle, Menu, LayoutDashboard, Users, Building2, BadgeDollarSign, Newspaper, ShieldCheck, Settings, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const ADMIN_LINKS = [
  { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Membres', href: '/admin/membres', icon: Users },
  { name: 'Commissions', href: '/admin/commissions', icon: Building2 },
  { name: 'Finances & Dons', href: '/admin/finances', icon: BadgeDollarSign },
  { name: 'Publications', href: '/admin/publications', icon: Newspaper },
  { name: 'Rôles & Accès', href: '/admin/roles', icon: ShieldCheck },
  { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
];

interface AdminUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    ADMIN: 'Super Admin',
    PRESIDENT: 'Président',
    RESPONSABLE_REGIONAL: 'Responsable Régional',
  };
  return labels[role] || role;
}

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || data);
        }
      } catch {
        // Silently fail — user will be redirected by AuthGuard
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch {
      // Force redirect even if signOut fails
      router.push('/admin/login');
    }
  }

  return (
    <header className="h-16 md:h-20 bg-background/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Sidebar Toggle */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-[#05180C] border-r-white/5 border-l-0 text-white flex flex-col">
            <SheetTitle className="sr-only">Menu d'administration</SheetTitle>
            <div className="p-6 flex items-center gap-3 border-b border-white/5 shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-lips-gold/20 rounded-full blur-md" />
                <img src="/logo.png" alt="LIPS Logo" className="w-10 h-10 relative z-10" />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm">LIPS Admin</h1>
                <p className="text-[10px] text-lips-gold uppercase tracking-widest font-bold">Portail SIIN</p>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-4 px-3">Menu Principal</div>
              {ADMIN_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group",
                      isActive 
                        ? "bg-gradient-to-r from-lips-gold/20 to-transparent text-lips-gold border-l-2 border-lips-gold" 
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <link.icon className={cn("h-4 w-4", isActive ? "text-lips-gold" : "text-white/40 group-hover:text-white/80")} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/5 shrink-0">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un membre, un don..." 
              className="pl-10 bg-muted/50 border-border/50 rounded-full h-10 focus-visible:ring-lips-green/30"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-background" />
        </button>
        <div className="h-8 w-px bg-border/50 hidden sm:block" />
        <button className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-foreground">
              {user ? `${user.prenom} ${user.nom}` : 'Administrateur'}
            </div>
            <div className="text-[10px] font-bold text-lips-gold uppercase tracking-wider">
              {user ? getRoleLabel(user.role) : 'Chargement...'}
            </div>
          </div>
          <UserCircle className="h-8 w-8 md:h-9 md:w-9 text-lips-green" />
        </button>
      </div>
    </header>
  );
}
