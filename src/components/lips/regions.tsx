'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  MapPin,
  Users,
  Building,
  ChevronRight,
} from 'lucide-react';
import { REGIONS_DATA, RegionData, RegionCode } from '@/lib/lips/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function RegionsSection() {
  const { p, locale, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [dbRegions, setDbRegions] = useState<RegionData[] | null>(null);

  useEffect(() => {
    fetch('/api/public/regions')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: RegionData[] = json.data.map(
            (r: {
              code: string;
              nom: string;
              nomAr: string;
              population?: number;
              mosqueCount?: number;
              latitude?: number;
              longitude?: number;
              _count?: { members?: number; mosques?: number };
            }) => ({
              code: r.code as RegionCode,
              nom: r.nom,
              nomAr: r.nomAr,
              population: r.population,
              mosqueCount: r._count?.mosques ?? r.mosqueCount,
              ...(r.latitude != null && r.longitude != null
                ? { coordinates: { lat: r.latitude, lng: r.longitude } }
                : {}),
            })
          );
          setDbRegions(mapped);
        }
      })
      .catch(() => {
        // Silently fall back to static data
      });
  }, []);

  const regions = dbRegions ?? REGIONS_DATA;

  return (
    <section
      ref={sectionRef}
      id="regions"
      className="py-12 sm:py-20 lg:py-28 bg-lips-cream relative overflow-hidden"
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-10" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            {p.regionsPage.sectionTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            {p.regionsPage.sectionTitle}
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            {p.regionsPage.sectionDesc}
          </p>
        </motion.div>

        {/* Regions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {regions.map((region, index) => (
            <motion.div
              key={region.code}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card id={`region-${region.code}`} className="group hover:shadow-lg hover:shadow-lips-green/10 transition-all duration-300 hover:border-lips-green/30 cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-lips-green/10 text-lips-green text-xs font-mono"
                        >
                          {region.code}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lips-green-dark mt-1">
                        {isRTL ? region.nomAr : region.nom}
                      </h3>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-lips-green group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {region.population && (
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3 text-lips-green-light" />
                        <span>
                          {region.population.toLocaleString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR')} {p.regionsPage.inhabitants}
                        </span>
                      </div>
                    )}
                    {region.mosqueCount && (
                      <div className="flex items-center gap-1.5">
                        <Building className="h-3 w-3 text-lips-gold" />
                        <span>
                          {region.mosqueCount.toLocaleString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR')} {p.regionsPage.mosques}
                        </span>
                      </div>
                    )}
                    {region.coordinates && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-muted-foreground/40" />
                        <span>
                          {region.coordinates.lat.toFixed(2)}°N,{' '}
                          {Math.abs(region.coordinates.lng).toFixed(2)}°W
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Regional summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-card/80 backdrop-blur-sm rounded-xl px-4 sm:px-8 py-4 border border-border/50 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-green">14</div>
              <div className="text-xs text-muted-foreground">{p.regionsPage.summaryRegions}</div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-green">46</div>
              <div className="text-xs text-muted-foreground">{p.regionsPage.summaryDepartments}</div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-gold">0</div>
              <div className="text-xs text-muted-foreground">{p.regionsPage.summaryMosques}</div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-emerald">0</div>
              <div className="text-xs text-muted-foreground">{p.regionsPage.summaryMembers}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
