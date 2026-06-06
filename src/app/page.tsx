import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import HeroSection from '@/components/lips/hero';
import StatsSection from '@/components/lips/stats';
import MissionSection from '@/components/lips/mission';
import GouvernanceSection from '@/components/lips/gouvernance';
import CarteMembreSection from '@/components/lips/carte-membre';
import ActualitesSection from '@/components/lips/actualites';
import EvenementsSection from '@/components/lips/evenements';
import RegionsSection from '@/components/lips/regions';
import DevenirMembreSection from '@/components/lips/devenir-membre';
import DonsSection from '@/components/lips/dons';
import GalerieSection from '@/components/lips/galerie';
import FAQSection from '@/components/lips/faq';
import VerificationSection from '@/components/lips/verification';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <MissionSection />
        <GouvernanceSection />
        <CarteMembreSection />
        <ActualitesSection />
        <EvenementsSection />
        <RegionsSection />
        <DevenirMembreSection />
        <DonsSection />
        <GalerieSection />
        <FAQSection />
        <VerificationSection />
        <NewsletterSection />
      </main>
      <LipsFooter />
    </div>
  );
}
