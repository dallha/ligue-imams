'use client';

import LipsHeader from '@/components/lips/header';
import CoranSection from '@/components/lips/coran';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function CoranPage() {
  const { p } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
            <main className="flex-1">
        <CoranSection />
      </main>
      <NewsletterSection />
      <LipsFooter />
    </div>
  );
}
