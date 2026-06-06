'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Target,
  Handshake,
  GraduationCap,
  Scale,
  Globe,
  Heart,
} from 'lucide-react';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function MissionSection() {
  const { p } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const PILLARS = [
    {
      icon: Target,
      title: p.mission.pillars.unity.title,
      titleAr: 'الوحدة المؤسسية',
      description: p.mission.pillars.unity.desc,
    },
    {
      icon: GraduationCap,
      title: p.mission.pillars.formation.title,
      titleAr: 'التكوين المستمر',
      description: p.mission.pillars.formation.desc,
    },
    {
      icon: Scale,
      title: p.mission.pillars.peace.title,
      titleAr: 'السلم الاجتماعي',
      description: p.mission.pillars.peace.desc,
    },
    {
      icon: Handshake,
      title: p.mission.pillars.representation.title,
      titleAr: 'التمثيل الوطني',
      description: p.mission.pillars.representation.desc,
    },
    {
      icon: Globe,
      title: p.mission.pillars.sovereignty.title,
      titleAr: 'السيادة الروحية',
      description: p.mission.pillars.sovereignty.desc,
    },
    {
      icon: Heart,
      title: p.mission.pillars.solidarity.title,
      titleAr: 'التضامن المجتمعي',
      description: p.mission.pillars.solidarity.desc,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="apropos"
      className="py-12 sm:py-20 lg:py-28 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-lips-cream/50 to-white" />
      <div className="absolute inset-0 islamic-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            {p.mission.sectionTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            {p.mission.sectionTitle}
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            {p.mission.sectionDesc}
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white border border-border/50 rounded-xl p-6 hover:shadow-xl hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-lips-green/10 flex items-center justify-center group-hover:bg-lips-green/20 transition-colors">
                  <pillar.icon className="h-5 w-5 text-lips-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-lips-green-dark text-sm">
                    {pillar.title}
                  </h3>
                  <span className="font-arabic text-xs text-lips-gold">
                    {pillar.titleAr}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
