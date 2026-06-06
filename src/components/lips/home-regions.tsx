'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Building,
  ArrowRight,
} from 'lucide-react';
import { REGIONS_DATA } from '@/lib/lips/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SenegalMap from '@/components/lips/senegal-map';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function HomeRegions() {
  const { t, locale, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Show only 6 regions as preview
  const previewRegions = REGIONS_DATA.slice(0, 6);

  return (
    <section
      ref={sectionRef}
      id="regions"
      className="py-12 sm:py-20 lg:py-28 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            {t.regions.sectionTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            {t.regions.sectionTitle}
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            {t.regions.sectionDesc}
          </p>
        </motion.div>

        {/* Map + Cards layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Compact Map — hidden on small screens, visible on md+ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block lg:flex-1 w-full max-w-md"
          >
            <SenegalMap compact scrollToCard={false} className="w-full" />
          </motion.div>

          {/* Region cards grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {previewRegions.map((region, index) => (
                <motion.div
                  key={region.code}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group bg-card/50 border border-border/50 rounded-xl p-3 text-center hover:shadow-md hover:shadow-lips-green/5 hover:border-lips-green/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="text-xs font-mono text-lips-green font-semibold mb-1">
                    {region.code}
                  </div>
                  <div className="font-semibold text-foreground text-sm mb-0.5">
                    {isRTL ? region.nomAr : region.nom}
                  </div>
                  {region.mosqueCount && (
                    <div className="text-[10px] text-muted-foreground mt-1.5 flex items-center justify-center gap-1">
                      <Building className="h-2.5 w-2.5" />
                      {region.mosqueCount?.toLocaleString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR')}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* +8 more indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-center mt-4 mb-6"
            >
              <span className="text-sm text-muted-foreground">
                {t.regions.moreRegions}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-card/80 rounded-xl px-4 sm:px-8 py-4 border border-border/50 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-green">14</div>
              <div className="text-xs text-muted-foreground">{t.regions.regionsLabel}</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-gold">{(15000).toLocaleString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR')}+</div>
              <div className="text-xs text-muted-foreground">{t.regions.mosquesLabel}</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-emerald">{(5000).toLocaleString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR')}+</div>
              <div className="text-xs text-muted-foreground">{t.regions.membersLabel}</div>
            </div>
          </div>
        </motion.div>

        {/* Link to full page */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-center"
        >
          <Button asChild variant="outline" className="border-lips-green/30 text-lips-green hover:bg-lips-green/5">
            <Link href="/regions">
              {t.regions.exploreAll}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
