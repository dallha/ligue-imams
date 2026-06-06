import type { Metadata } from 'next';
import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import AgendaSection from '@/components/lips/agenda';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';

export const metadata: Metadata = {
  title: 'Agenda & Calendrier — LIPS',
  description:
    'Calendrier grégorien et hégirien, dates islamiques importantes et événements organisés par la Ligue des Imams et Prédicateurs du Sénégal.',
  openGraph: {
    title: 'Agenda & Calendrier — LIPS',
    description:
      'Consultez le calendrier hégirien, les fêtes islamiques et les événements LIPS à travers le Sénégal.',
  },
};

export default function AgendaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label="Agenda"
          title="Calendrier & Événements"
          titleAr="التقويم والفعاليات"
          description="Consultez le calendrier grégorien et hégirien, les dates islamiques importantes et les événements organisés par la LIPS à travers les 14 régions du Sénégal."
        />
        <AgendaSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
