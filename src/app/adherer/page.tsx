import type { Metadata } from 'next';
import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import DevenirMembreSection from '@/components/lips/devenir-membre';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';

export const metadata: Metadata = {
  title: 'Adhérer — LIPS',
  description:
    'Rejoignez la Ligue des Imams et Prédicateurs du Sénégal. Formulaire d\'adhésion en ligne, conditions, avantages de la carte membre nationale et processus de candidature.',
  openGraph: {
    title: 'Devenir Membre — LIPS',
    description:
      'Rejoignez la communauté des imams et prédicateurs du Sénégal.',
  },
};

export default function AdhererPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label="Adhésion"
          title="Devenir Membre"
          titleAr="الانضمام"
          description="Rejoignez la communauté des imams et prédicateurs du Sénégal en quelques étapes simples. L'adhésion vous donne accès à la carte membre nationale, aux formations continues et au réseau institutionnel de la LIPS."
        />
        <DevenirMembreSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
