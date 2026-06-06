import type { Metadata } from 'next';
import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import MissionSection from '@/components/lips/mission';
import GouvernanceSection from '@/components/lips/gouvernance';
import CarteMembreSection from '@/components/lips/carte-membre';
import FAQSection from '@/components/lips/faq';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';

export const metadata: Metadata = {
  title: 'À Propos — LIPS',
  description:
    'Découvrez la mission, la gouvernance et la carte membre de la Ligue des Imams et Prédicateurs du Sénégal. Notre vision, nos piliers stratégiques et notre bureau national.',
  openGraph: {
    title: 'À Propos — LIPS',
    description:
      'Découvrez la mission, la gouvernance et la carte membre de la Ligue des Imams et Prédicateurs du Sénégal.',
  },
};

export default function AProposPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label="À Propos"
          title="Qui sommes-nous ?"
          titleAr="من نحن؟"
          description="La Ligue des Imams et Prédicateurs du Sénégal est l'institution nationale de référence au service des imams, de la communauté et de la paix sociale. Découvrez notre mission, notre gouvernance et nos valeurs."
        />
        <MissionSection />
        <GouvernanceSection />
        <CarteMembreSection />
        <FAQSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
