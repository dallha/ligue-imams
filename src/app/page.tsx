import LipsHeader from '@/components/lips/header';
import PrayerTimesWidget from '@/components/lips/prayer-times';
import Preloader from '@/components/lips/preloader';
import HeroSection from '@/components/lips/hero';
import HomeServices from '@/components/lips/home-services';
import HomeAboutNarrative from '@/components/lips/home-about-narrative';
import StatsSection from '@/components/lips/stats';
import HomeAbout from '@/components/lips/home-about';
import HomeActualites from '@/components/lips/home-actualites';
import HomeRegions from '@/components/lips/home-regions';
import HomeCTA from '@/components/lips/home-cta';
import NewsletterSection from '@/components/lips/newsletter';
import LipsFooter from '@/components/lips/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Preloader />
      <LipsHeader />
      <PrayerTimesWidget />
      <main className="flex-1">
        <HeroSection />
        <HomeServices />
        <HomeAboutNarrative />
        <StatsSection />
        <HomeAbout />
        <HomeActualites />
        <HomeRegions />
        <HomeCTA />
        <NewsletterSection />
      </main>
      <LipsFooter />
    </div>
  );
}
