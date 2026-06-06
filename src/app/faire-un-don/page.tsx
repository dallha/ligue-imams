'use client';

import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import DonsSection from '@/components/lips/dons';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function FaireUnDonPage() {
  const { p } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label={p.pages.donate.label}
          title={p.pages.donate.title}
          description={p.pages.donate.description}
          gradient="from-lips-green-dark via-lips-green-dark to-lips-green"
        />
        <DonsSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
