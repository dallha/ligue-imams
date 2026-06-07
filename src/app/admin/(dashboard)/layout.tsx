import AdminSidebar from '@/components/admin/sidebar';
import AdminHeader from '@/components/admin/header';
import { AdminAuthGuard } from './auth-guard';

/**
 * Layout du dashboard admin (groupe de routes protégées).
 * La vérification d'authentification est déléguée au composant AuthGuard
 * qui utilise le middleware côté serveur et vérifie la session côté client.
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-muted/20">
        <AdminSidebar />
        <div className="flex flex-col min-h-screen md:pl-64">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
