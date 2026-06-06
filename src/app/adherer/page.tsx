'use client';

import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import DevenirMembreSection from '@/components/lips/devenir-membre';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function AdhererPage() {
  const { p } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label={p.pages.join.label}
          title={p.pages.join.title}
          description={p.pages.join.description}
        />
        <DevenirMembreSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
