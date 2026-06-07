'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  BadgeDollarSign,
  Newspaper,
  Settings,
  LogOut,
  ShieldCheck,
  Image as ImageIcon,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_LINKS = [
  { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Membres', href: '/admin/membres', icon: Users },
  { name: 'Commissions', href: '/admin/commissions', icon: Building2 },
  { name: 'Finances & Dons', href: '/admin/finances', icon: BadgeDollarSign },
  { name: 'Publications', href: '/admin/publications', icon: Newspaper },
  { name: 'Galerie', href: '/admin/galerie', icon: ImageIcon },
  { name: 'Chiffres Clés', href: '/admin/statistiques', icon: BarChart3 },
  { name: 'Rôles & Accès', href: '/admin/roles', icon: ShieldCheck },
  { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 flex-col z-50 shadow-2xl" style={{ backgroundColor: '#05180C' }}>
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
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

      <div className="p-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
