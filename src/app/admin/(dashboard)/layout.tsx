import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import AdminSidebar from '@/components/admin/sidebar';
import AdminHeader from '@/components/admin/header';

/**
 * Layout du dashboard admin (groupe de routes protégées).
 * Ce layout :
 * 1. Vérifie l'authentification côté serveur AVANT d'afficher quoi que ce soit
 * 2. Redirige vers /admin/login si l'utilisateur n'est pas connecté
 * 3. Affiche la sidebar et le header UNIQUEMENT pour les utilisateurs authentifiés
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérification de la session admin côté serveur
  const session = await getAdminSession();

  if (!session) {
    // Rediriger vers la page de login si non authentifié
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminSidebar />
      <div className="flex flex-col min-h-screen md:pl-64">
        <AdminHeader user={session} />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
