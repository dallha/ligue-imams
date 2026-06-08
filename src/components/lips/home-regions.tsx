'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Building,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { REGIONS_DATA } from '@/lib/lips/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SenegalMap from '@/components/lips/senegal-map';
import { useLanguage } from '@/lib/lips/i18n/language-context';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function HomeRegions() {
  const { t, locale, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [dbRegions, setDbRegions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/public/regions')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          setDbRegions(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const regionsToDisplay = dbRegions.length > 0 
    ? dbRegions.map(r => ({ ...r, mosqueCount: r._count?.mosques || r.mosqueCount || 0 })).slice(0, 6)
    : REGIONS_DATA.slice(0, 6);

  const totalRegions = dbRegions.length > 0 ? dbRegions.length : 14;
  const totalMosques = dbRegions.reduce((acc, r) => acc + (r._count?.mosques || r.mosqueCount || 0), 0);
  const totalMembers = dbRegions.reduce((acc, r) => acc + (r._count?.members || 0), 0);

  return (
    <section
      ref={sectionRef}
      id="regions"
      className="py-24 lg:py-32 bg-muted/20 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 islamic-pattern opacity-[0.02]" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-lips-emerald/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-lips-gold/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lips-emerald/10 border border-lips-emerald/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-lips-emerald animate-pulse" />
            <span className="text-xs font-bold text-lips-emerald tracking-widest uppercase">
              {t.regions.sectionTag}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            {t.regions.sectionTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {t.regions.sectionDesc}
          </p>
        </motion.div>

        {/* Map + Cards layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
          
          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block w-full max-w-xl lg:flex-1 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-lips-emerald/5 to-transparent rounded-[3rem] blur-xl" />
            <div className="bg-card p-8 rounded-[3rem] shadow-2xl border border-border/50 relative">
              <SenegalMap compact scrollToCard={false} className="w-full h-auto drop-shadow-lg" />
            </div>
          </motion.div>

          {/* Region cards grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {regionsToDisplay.map((region, index) => (
                <motion.div
                  key={region.code}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/regions#${region.code}`}>
                    <div className="group bg-card rounded-2xl p-5 border border-border/50 hover:shadow-xl hover:-translate-y-1 hover:border-lips-emerald/30 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-lips-emerald/0 via-lips-emerald/0 to-lips-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-lips-emerald/10 group-hover:text-lips-emerald transition-colors text-muted-foreground">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-lips-emerald mb-0.5 tracking-wider">
                              {region.code}
                            </div>
                            <div className="font-bold text-foreground text-base group-hover:text-lips-emerald transition-colors">
                              {isRTL ? region.nomAr : region.nom}
                            </div>
                          </div>
                        </div>
                        
                        {region.mosqueCount && (
                          <div className="flex flex-col items-end">
                            <Badge variant="outline" className="bg-muted/50 border-border font-bold text-xs">
                              {region.mosqueCount?.toLocaleString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR')}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{t.regions.mosquesLabel}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 flex justify-center lg:justify-start"
            >
              <Button asChild size="lg" className="bg-lips-emerald hover:bg-emerald-700 text-white font-bold rounded-full px-8 py-6 shadow-lg shadow-lips-emerald/20 transition-all hover:-translate-y-1">
                <Link href="/regions">
                  {t.regions.exploreAll}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 bg-card/60 backdrop-blur-md rounded-full px-8 py-6 border border-border/50 shadow-sm max-w-4xl mx-auto">
            <div className="text-center flex flex-col items-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lips-emerald to-emerald-400">{totalRegions}</div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1">{t.regions.regionsLabel}</div>
            </div>
            <div className="hidden sm:block w-px h-16 bg-border" />
            <div className="text-center flex flex-col items-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lips-gold to-[#C9962A]">{totalMosques > 0 ? totalMosques.toLocaleString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR') : '—'}</div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1">{t.regions.mosquesLabel}</div>
            </div>
            <div className="hidden sm:block w-px h-16 bg-border" />
            <div className="text-center flex flex-col items-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lips-green to-[#1B6B3A]">{totalMembers > 0 ? totalMembers.toLocaleString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR') : '—'}</div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1">{t.regions.membersLabel}</div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
