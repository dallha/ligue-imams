'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  MapPin,
  Users,
  Building,
  ChevronRight,
} from 'lucide-react';
import { REGIONS_DATA } from '@/lib/lips/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RegionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

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
            Présence Nationale
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            Nos 14 Régions
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            La LIPS est implantée dans les 14 régions administratives du Sénégal,
            garantissant une couverture institutionnelle complète et un
            accompagnement de proximité pour tous les imams et prédicateurs du
            pays.
          </p>
        </motion.div>

        {/* Regions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {REGIONS_DATA.map((region, index) => (
            <motion.div
              key={region.code}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card id={`region-${region.code}`} className="group hover:shadow-lg hover:shadow-lips-green/10 transition-all duration-300 hover:border-lips-green/30 cursor-pointer border-border/50 bg-white/80 backdrop-blur-sm transition-shadow">
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
                        <span className="font-arabic text-sm text-lips-gold">
                          {region.nomAr}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lips-green-dark mt-1">
                        {region.nom}
                      </h3>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-lips-green group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {region.population && (
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3 text-lips-green-light" />
                        <span>
                          {region.population.toLocaleString('fr-FR')} hab.
                        </span>
                      </div>
                    )}
                    {region.mosqueCount && (
                      <div className="flex items-center gap-1.5">
                        <Building className="h-3 w-3 text-lips-gold" />
                        <span>
                          {region.mosqueCount.toLocaleString('fr-FR')} mosquées
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
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-white/80 backdrop-blur-sm rounded-xl px-4 sm:px-8 py-4 border border-border/50 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-green">14</div>
              <div className="text-xs text-muted-foreground">Régions</div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-green">46</div>
              <div className="text-xs text-muted-foreground">Départements</div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-gold">15 000+</div>
              <div className="text-xs text-muted-foreground">Mosquées</div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-emerald">5 000+</div>
              <div className="text-xs text-muted-foreground">Membres</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
