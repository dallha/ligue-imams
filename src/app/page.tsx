import LipsHeader from '@/components/lips/header';
import Preloader from '@/components/lips/preloader';
import HeroSection from '@/components/lips/hero';
import HomeServices from '@/components/lips/home-services';

import dynamic from 'next/dynamic';

const HomeAboutNarrative = dynamic(() => import('@/components/lips/home-about-narrative'));
const StatsSection = dynamic(() => import('@/components/lips/stats'));
const HomeAbout = dynamic(() => import('@/components/lips/home-about'));
const HomeActualites = dynamic(() => import('@/components/lips/home-actualites'));
const HomeRegions = dynamic(() => import('@/components/lips/home-regions'));
const HomeCTA = dynamic(() => import('@/components/lips/home-cta'));
const NewsletterSection = dynamic(() => import('@/components/lips/newsletter'));
const LipsFooter = dynamic(() => import('@/components/lips/footer'));

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Preloader />
      <LipsHeader />
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
