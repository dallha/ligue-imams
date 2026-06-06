'use client';

import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import ActualitesSection from '@/components/lips/actualites';
import EvenementsSection from '@/components/lips/evenements';
import GalerieSection from '@/components/lips/galerie';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function ActualitesPage() {
  const { p } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label={p.pages.news.label}
          title={p.pages.news.title}
          description={p.pages.news.description}
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
