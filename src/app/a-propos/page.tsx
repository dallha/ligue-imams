'use client';

import LipsHeader from '@/components/lips/header';
import PageBanner from '@/components/lips/page-banner';
import MissionSection from '@/components/lips/mission';
import GouvernanceSection from '@/components/lips/gouvernance';
import CarteMembreSection from '@/components/lips/carte-membre';
import FAQSection from '@/components/lips/faq';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function AProposPage() {
  const { p } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
            <main className="flex-1">
        <PageBanner
          label={p.pages.about.label}
          title={p.pages.about.title}
          description={p.pages.about.description}
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
