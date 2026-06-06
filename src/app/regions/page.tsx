import type { Metadata } from 'next';
import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
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
        <RegionsSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
