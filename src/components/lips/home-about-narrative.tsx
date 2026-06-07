'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function HomeAboutNarrative() {
  const { t, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="about-narrative"
      className="py-24 lg:py-32 relative overflow-hidden bg-lips-cream"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />
      <div className="absolute -left-[400px] top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lips-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Mosque image & Decorative composition */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image container */}
            <div className="relative aspect-[4/5] sm:aspect-square rounded-[2rem] overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-lips-green-dark/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <Image
                src="/mosquee-exterieur.jpg"
                alt={t.aboutNarrative.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient overlay for text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

              {/* Caption on image */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-bold text-2xl mb-1 drop-shadow-md">
                  {t.aboutNarrative.mosqueName}
                </h3>
                <p className="text-lips-gold text-sm font-medium tracking-wide">
                  {t.aboutNarrative.mosqueLocation}
                </p>
              </div>
            </div>

            {/* Floating Glassmorphism Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 sm:bottom-12 sm:-right-12 bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-6 max-w-[240px] z-30"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-lips-gold/10 flex items-center justify-center shrink-0">
                  <Star className="h-5 w-5 text-lips-gold fill-lips-gold" />
                </div>
                <span className="text-sm font-bold text-foreground uppercase tracking-widest">{t.aboutNarrative.sinceLabel}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.aboutNarrative.sinceDesc}
              </p>
            </motion.div>

            {/* Golden decorative elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-[3px] border-l-[3px] border-lips-gold/30 rounded-tl-[3rem]" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-[3px] border-r-[3px] border-lips-gold/30 rounded-br-[3rem]" />
          </motion.div>

          {/* Right: Narrative text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lips-gold/10 border border-lips-gold/20 mb-6 self-start">
              <span className="text-xs font-bold text-lips-gold tracking-widest uppercase">
                {t.aboutNarrative.sectionTag}
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight leading-[1.1]">
              {t.aboutNarrative.sectionTitle1} <br/>
              <span className="text-lips-green">{t.aboutNarrative.sectionTitle2}</span>
            </h2>

            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed font-light">
              <p>
                {t.aboutNarrative.paragraph1}
              </p>
              <p>
                {t.aboutNarrative.paragraph2}
              </p>
              <p>
                {t.aboutNarrative.paragraph3}
              </p>
            </div>

            {/* Arabic motto Block */}
            {!isRTL && (
              <div className="mt-10 p-6 bg-card border border-border/50 rounded-2xl shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-lips-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <div className="hidden sm:flex w-12 h-12 rounded-full bg-lips-green/10 items-center justify-center shrink-0">
                    <span className="text-xl">🕌</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-arabic text-lips-gold text-2xl sm:text-3xl mb-2 drop-shadow-sm" dir="rtl">
                      {t.hero.arabicMotto}
                    </p>
                    <p className="text-sm text-muted-foreground italic font-medium">
                      &laquo; {t.aboutNarrative.mottoTranslation} &raquo;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-10">
              <Button asChild size="lg" className="bg-lips-green hover:bg-lips-green-dark text-white font-bold rounded-full px-8 py-6 text-lg shadow-lg shadow-lips-green/20 hover:-translate-y-1 transition-all">
                <Link href="/a-propos">
                  {t.aboutNarrative.cta}
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Link>
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
