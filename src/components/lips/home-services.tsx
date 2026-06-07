'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Clock,
  BookOpen,
  CalendarDays,
  CreditCard,
  Heart,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/lips/i18n/language-context';
import { cn } from '@/lib/utils';

export default function HomeServices() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const SERVICES = [
    {
      icon: Clock,
      title: t.services.items.prayerTimes.title,
      description: t.services.items.prayerTimes.desc,
      href: '/agenda',
      color: 'from-sky-500 to-sky-600',
      shadowColor: 'hover:shadow-sky-500/20',
      borderColor: 'group-hover:border-sky-500/30',
    },
    {
      icon: BookOpen,
      title: t.services.items.coran.title,
      description: t.services.items.coran.desc,
      href: '/coran',
      color: 'from-emerald-500 to-emerald-600',
      shadowColor: 'hover:shadow-emerald-500/20',
      borderColor: 'group-hover:border-emerald-500/30',
    },
    {
      icon: CalendarDays,
      title: t.services.items.agenda.title,
      description: t.services.items.agenda.desc,
      href: '/agenda',
      color: 'from-amber-500 to-amber-600',
      shadowColor: 'hover:shadow-amber-500/20',
      borderColor: 'group-hover:border-amber-500/30',
    },
    {
      icon: CreditCard,
      title: t.services.items.memberCard.title,
      description: t.services.items.memberCard.desc,
      href: '/a-propos#carte-membre',
      color: 'from-[#E5BE5A] to-[#C9962A]',
      shadowColor: 'hover:shadow-[#C9962A]/20',
      borderColor: 'group-hover:border-[#C9962A]/30',
    },
    {
      icon: Heart,
      title: t.services.items.donate.title,
      description: t.services.items.donate.desc,
      href: '/faire-un-don',
      color: 'from-rose-500 to-rose-600',
      shadowColor: 'hover:shadow-rose-500/20',
      borderColor: 'group-hover:border-rose-500/30',
    },
    {
      icon: UserPlus,
      title: t.services.items.join.title,
      description: t.services.items.join.desc,
      href: '/adherer',
      color: 'from-[#1B6B3A] to-[#0D3B1F]',
      shadowColor: 'hover:shadow-[#1B6B3A]/20',
      borderColor: 'group-hover:border-[#1B6B3A]/30',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-24 lg:py-32 bg-muted/60 relative overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 islamic-pattern opacity-[0.02]" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-lips-green/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lips-gold/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

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
              {t.services.sectionTag}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            {t.services.sectionTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {t.services.sectionDesc}
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={service.href}
                className={cn(
                  "group relative block bg-card rounded-[2rem] p-8 h-full transition-all duration-500",
                  "border border-border/50 hover:-translate-y-2 hover:shadow-2xl overflow-hidden",
                  service.shadowColor,
                  service.borderColor
                )}
              >
                {/* Glow effect on hover */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500",
                  service.color
                )} />

                {/* Icon */}
                <div className="mb-6 relative">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                    service.color
                  )}>
                    <service.icon className="h-8 w-8" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-lips-green transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {service.description}
                </p>

                {/* Arrow CTA */}
                <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-lips-green group-hover:text-white transition-all duration-300 text-muted-foreground">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-16 sm:mt-24"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-2 pl-6 rounded-full bg-card border border-border/60 shadow-lg shadow-black/5">
            <span className="text-sm font-medium text-muted-foreground">
              {t.services.memberSpaceNote}
            </span>
            <Link
              href="/espace-membre"
              className="px-6 py-3 rounded-full bg-lips-green hover:bg-lips-green-dark text-white text-sm font-bold transition-colors inline-flex items-center gap-2 shadow-md"
            >
              {t.services.memberSpaceLink}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
