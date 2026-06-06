'use client';

import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import AgendaSection from '@/components/lips/agenda';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function AgendaPage() {
  const { p } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label={p.pages.agenda.label}
          title={p.pages.agenda.title}
          description={p.pages.agenda.description}
        />
        <AgendaSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
