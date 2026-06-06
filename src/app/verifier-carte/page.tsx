'use client';

import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import PageBanner from '@/components/lips/page-banner';
import VerificationSection from '@/components/lips/verification';
import FAQSection from '@/components/lips/faq';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function VerifierCartePage() {
  const { p } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <PageBanner
          label={p.pages.verify.label}
          title={p.pages.verify.title}
          titleAr="التحقق من بطاقة العضوية"
          description={p.pages.verify.description}
        />
        <VerificationSection />
        <FAQSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
