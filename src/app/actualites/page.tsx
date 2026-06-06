import type { Metadata } from 'next';
import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import ActualitesSection from '@/components/lips/actualites';
import EvenementsSection from '@/components/lips/evenements';
import GalerieSection from '@/components/lips/galerie';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';

export const metadata: Metadata = {
  title: 'Actualités — LIPS',
  description:
    'Communiqués, fatwas, événements et galerie photos de la Ligue des Imams et Prédicateurs du Sénégal. Restez informé des dernières nouvelles institutionnelles.',
  openGraph: {
    title: 'Actualités — LIPS',
    description:
      'Communiqués, fatwas, événements et galerie photos de la LIPS.',
  },
};

export default function ActualitesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label="Actualités"
          title="Communiqués & Publications"
          titleAr="البيانات والمنشورات"
          description="Restez informé des positions officielles, avis juridiques, formations, événements et annonces de la LIPS à travers les 14 régions du Sénégal."
        />
        <ActualitesSection />
        <EvenementsSection />
        <GalerieSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
