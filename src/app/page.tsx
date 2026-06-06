import LipsHeader from '@/components/lips/header';
import HeroSection from '@/components/lips/hero';
import StatsSection from '@/components/lips/stats';
import MissionSection from '@/components/lips/mission';
import CarteMembreSection from '@/components/lips/carte-membre';
import RegionsSection from '@/components/lips/regions';
import PublicationsSection from '@/components/lips/publications';
import VerificationSection from '@/components/lips/verification';
import LipsFooter from '@/components/lips/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LipsHeader />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <MissionSection />
        <CarteMembreSection />
        <RegionsSection />
        <PublicationsSection />
        <VerificationSection />
      </main>
      <LipsFooter />
    </div>
  );
}
