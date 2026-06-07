import AdminSidebar from '@/components/admin/sidebar';
import AdminHeader from '@/components/admin/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      <AdminSidebar />
      <div className="flex flex-col min-h-screen md:pl-64">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
