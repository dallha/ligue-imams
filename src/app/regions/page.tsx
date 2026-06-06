import type { Metadata } from 'next';
import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import SenegalMap from '@/components/lips/senegal-map';
import RegionsSection from '@/components/lips/regions';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';

export const metadata: Metadata = {
  title: 'Régions — LIPS',
  description:
    'La LIPS est implantée dans les 14 régions administratives du Sénégal. Découvrez notre présence nationale, les délégations régionales et les données par région.',
  openGraph: {
    title: 'Nos 14 Régions — LIPS',
    description:
      'Présence institutionnelle de la LIPS dans les 14 régions du Sénégal.',
  },
};

export default function RegionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label="Présence Nationale"
          title="Nos 14 Régions"
          titleAr="أقاليمنا الأربعة عشر"
          description="La LIPS est implantée dans les 14 régions administratives du Sénégal, garantissant une couverture institutionnelle complète et un accompagnement de proximité pour tous les imams et prédicateurs du pays."
        />

        {/* Interactive Map Section */}
        <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-5" />
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
                Carte Interactive
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-lips-green-dark mt-2 mb-2">
                Explorez les Régions du Sénégal
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Survolez ou cliquez sur une région pour découvrir ses données. La carte vous guidera vers la fiche détaillée ci-dessous.
              </p>
            </div>
            <SenegalMap scrollToCard />
          </div>
        </section>

        <RegionsSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
