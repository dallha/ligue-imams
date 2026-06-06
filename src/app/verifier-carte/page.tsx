import type { Metadata } from 'next';
import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import VerificationSection from '@/components/lips/verification';
import FAQSection from '@/components/lips/faq';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';

export const metadata: Metadata = {
  title: 'Vérifier une Carte — LIPS',
  description:
    'Vérifiez l\'authenticité d\'une carte membre de la LIPS. Saisissez le numéro de matricule pour vérifier instantanément la validité de la carte nationale.',
  openGraph: {
    title: 'Vérifier une Carte Membre — LIPS',
    description:
      'Système de vérification sécurisé des cartes membres de la LIPS.',
  },
};

export default function VerifierCartePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label="Vérification"
          title="Vérifier une Carte Membre"
          titleAr="التحقق من بطاقة العضوية"
          description="Saisissez le numéro de matricule figurant sur la carte membre pour vérifier instantanément sa validité. Le format est LIPS-ANNÉE-RÉGION-NUMÉRO."
        />
        <VerificationSection />
        <FAQSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
