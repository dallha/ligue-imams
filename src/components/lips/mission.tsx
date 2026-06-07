'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Target,
  Handshake,
  Shield,
  Lightbulb,
  Heart,
  Scale,
  Globe,
  MessageCircle,
} from 'lucide-react';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function MissionSection() {
  const { p } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const PILLARS = [
    {
      icon: Shield,
      title: p.mission.pillars.defense.title,
      titleAr: 'الدفاع عن الإسلام',
      description: p.mission.pillars.defense.desc,
    },
    {
      icon: Handshake,
      title: p.mission.pillars.unity.title,
      titleAr: 'توحيد الأئمة والدعاة',
      description: p.mission.pillars.unity.desc,
    },
    {
      icon: Lightbulb,
      title: p.mission.pillars.initiative.title,
      titleAr: 'تشجيع روح المبادرة',
      description: p.mission.pillars.initiative.desc,
    },
    {
      icon: Target,
      title: p.mission.pillars.values.title,
      titleAr: 'الحفاظ على القيم',
      description: p.mission.pillars.values.desc,
    },
    {
      icon: Heart,
      title: p.mission.pillars.promotion.title,
      titleAr: 'الترقية الاجتماعية',
      description: p.mission.pillars.promotion.desc,
    },
    {
      icon: Scale,
      title: p.mission.pillars.advocacy.title,
      titleAr: 'الدفاع عن مصالح المسلمين',
      description: p.mission.pillars.advocacy.desc,
    },
    {
      icon: Globe,
      title: p.mission.pillars.openness.title,
      titleAr: 'تطوير العلاقات',
      description: p.mission.pillars.openness.desc,
    },
    {
      icon: MessageCircle,
      title: p.mission.pillars.cohesion.title,
      titleAr: 'تشجيع الانفتاح والحوار',
      description: p.mission.pillars.cohesion.desc,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="apropos"
      className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-background"
    >
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lips-emerald/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lips-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lips-green/10 border border-lips-green/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-lips-green animate-pulse" />
            <span className="text-xs font-bold text-lips-green tracking-widest uppercase">
              {p.mission.sectionTag}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
            {p.mission.sectionTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {p.mission.sectionDesc}
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-lips-green/10 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lips-green/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lips-green/10 to-lips-emerald/5 border border-lips-green/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <pillar.icon className="h-6 w-6 text-lips-green" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">
                    {pillar.title}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
