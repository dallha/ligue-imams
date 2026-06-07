'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Shield,
  Handshake,
  Target,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/lib/lips/i18n/language-context';
import { cn } from '@/lib/utils';

export default function HomeAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { t, p } = useLanguage();

  const PILLARS_PREVIEW = [
    {
      icon: Shield,
      title: p.mission.pillars.defense.title,
      description: p.mission.pillars.defense.desc,
      color: 'from-sky-500/20 to-sky-600/5',
      iconColor: 'text-sky-500',
    },
    {
      icon: Handshake,
      title: p.mission.pillars.unity.title,
      description: p.mission.pillars.unity.desc,
      color: 'from-emerald-500/20 to-emerald-600/5',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Target,
      title: p.mission.pillars.values.title,
      description: p.mission.pillars.values.desc,
      color: 'from-[#E5BE5A]/20 to-[#C9962A]/5',
      iconColor: 'text-[#E5BE5A]',
    },
    {
      icon: MessageCircle,
      title: p.mission.pillars.cohesion.title,
      description: p.mission.pillars.cohesion.desc,
      color: 'from-lips-green/20 to-[#0D3B1F]/5',
      iconColor: 'text-lips-green',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="apropos"
      className="py-24 lg:py-32 relative overflow-hidden bg-muted/60"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.02]" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lips-green/10 border border-lips-green/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-lips-gold animate-pulse" />
            <span className="text-xs font-bold text-lips-green tracking-widest uppercase">
              {p.mission.sectionTag}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            {p.mission.sectionTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {p.mission.sectionDesc}
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PILLARS_PREVIEW.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card rounded-[2rem] p-8 h-full transition-all duration-500 border border-border/50 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0",
                pillar.color
              )} />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                    pillar.color
                  )}>
                    <pillar.icon className={cn("h-7 w-7", pillar.iconColor)} />
                  </div>
                </div>
                
                <h3 className="font-bold text-xl text-foreground mb-3 group-hover:text-lips-green transition-colors duration-300">
                  {pillar.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link to full page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16 sm:mt-20"
        >
          <Button asChild size="lg" className="bg-transparent border-2 border-lips-green text-lips-green hover:bg-lips-green hover:text-white font-bold rounded-full px-8 py-6 text-base transition-all hover:shadow-lg hover:shadow-lips-green/20">
            <Link href="/a-propos">
              {t.aboutNarrative.cta}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
