'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  MapPin,
  Users,
  Building,
  ArrowRight,
} from 'lucide-react';
import { REGIONS_DATA } from '@/lib/lips/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomeRegions() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Show only 6 regions as preview
  const previewRegions = REGIONS_DATA.slice(0, 6);

  return (
    <section
      ref={sectionRef}
      id="regions"
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
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
            garantissant une couverture institutionnelle complète.
          </p>
        </motion.div>

        {/* Regions preview grid — 6 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {previewRegions.map((region, index) => (
            <motion.div
              key={region.code}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-lips-cream/50 border border-border/50 rounded-xl p-3 text-center hover:shadow-md hover:shadow-lips-green/5 hover:border-lips-green/30 transition-all duration-300 cursor-pointer"
            >
              <div className="text-xs font-mono text-lips-green font-semibold mb-1">
                {region.code}
              </div>
              <div className="font-semibold text-lips-green-dark text-sm mb-0.5">
                {region.nom}
              </div>
              <span className="font-arabic text-xs text-lips-gold">
                {region.nomAr}
              </span>
              {region.mosqueCount && (
                <div className="text-[10px] text-muted-foreground mt-1.5 flex items-center justify-center gap-1">
                  <Building className="h-2.5 w-2.5" />
                  {region.mosqueCount.toLocaleString('fr-FR')}
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
            + 8 autres régions
          </span>
        </motion.div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-grid grid-cols-3 gap-3 sm:gap-6 bg-lips-cream/80 rounded-xl px-4 sm:px-8 py-4 border border-border/50 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-lips-green">14</div>
              <div className="text-xs text-muted-foreground">Régions</div>
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

        {/* Link to full page */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-center"
        >
          <Button asChild variant="outline" className="border-lips-green/30 text-lips-green hover:bg-lips-green/5">
            <Link href="/regions">
              Explorer toutes les régions
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
