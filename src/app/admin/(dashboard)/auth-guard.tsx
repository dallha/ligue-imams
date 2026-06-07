'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

/**
 * Composant de garde d'authentification côté client.
 * Vérifie que l'utilisateur est bien connecté en appelant /api/admin/me.
 * Si non connecté, redirige vers /admin/login.
 * Le middleware Next.js fait déjà la première protection côté serveur,
 * ce composant ajoute une couche de vérification supplémentaire.
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          const loginUrl = `/admin/login?redirect=${encodeURIComponent(pathname)}`;
          router.push(loginUrl);
        }
      } catch {
        setIsAuthenticated(false);
        const loginUrl = `/admin/login?redirect=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
      }
    }
    checkAuth();
  }, [router, pathname]);

  // Afficher un écran de chargement pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-foreground/20 border-t-lips-gold/60 rounded-full animate-spin" />
          <p className="text-muted-foreground text-xs">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
