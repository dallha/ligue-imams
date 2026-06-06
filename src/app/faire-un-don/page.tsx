import type { Metadata } from 'next';
import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import DonsSection from '@/components/lips/dons';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';

export const metadata: Metadata = {
  title: 'Faire un Don — LIPS',
  description:
    'Soutenez la Ligue des Imams et Prédicateurs du Sénégal par votre don. Contribuez à la formation des imams, à la solidarité communautaire et au maintien de la paix sociale.',
  openGraph: {
    title: 'Faire un Don — LIPS',
    description:
      'Soutenez la LIPS par votre don. Paiement sécurisé via CinetPay, Wave ou espèces.',
  },
};

export default function FaireUnDonPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label="Soutenir la LIPS"
          title="Faire un Don"
          titleAr="التبرع"
          description="Votre don contribue au fonctionnement de la LIPS, à la formation des imams, à la solidarité communautaire et au maintien de la paix sociale au Sénégal."
          gradient="from-lips-green-dark via-lips-green-dark to-lips-green"
        />
        <DonsSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
