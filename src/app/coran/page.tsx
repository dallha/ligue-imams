import type { Metadata } from 'next';
import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import CoranSection from '@/components/lips/coran';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';

export const metadata: Metadata = {
  title: 'Coran — LIPS',
  description:
    'Explorez le Saint Coran : récitations audio par les imams sénégalais, index des sourates, versets du jour et ressources coraniques. Ligue des Imams et Prédicateurs du Sénégal.',
  openGraph: {
    title: 'Coran — LIPS',
    description:
      'Le Saint Coran : écoutez, lisez et approfondissez votre foi avec les ressources de la LIPS.',
  },
};

export default function CoranPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <CoranSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
