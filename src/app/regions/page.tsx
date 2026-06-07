'use client';

import LipsHeader from '@/components/lips/header';
import PageBanner from '@/components/lips/page-banner';
import SenegalMap from '@/components/lips/senegal-map';
import RegionsSection from '@/components/lips/regions';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function RegionsPage() {
  const { p } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
            <main className="flex-1">
        <PageBanner
          label={p.pages.regions.label}
          title={p.pages.regions.title}
          description={p.pages.regions.description}
        />

        {/* Interactive Map Section */}
        <section className="py-12 sm:py-16 bg-background relative overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-5" />
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
                {p.regionsPage.interactiveMap}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-lips-green-dark mt-2 mb-2">
                {p.regionsPage.exploreTitle}
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                {p.regionsPage.exploreDesc}
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
