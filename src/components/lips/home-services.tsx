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

export default function HomeServices() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const SERVICES = [
    {
      icon: Clock,
      title: t.services.items.prayerTimes.title,
      titleAr: 'مواعيد الصلاة',
      description: t.services.items.prayerTimes.desc,
      href: '/agenda',
      color: 'from-sky-500/20 to-sky-600/10',
      iconColor: 'text-sky-600',
      borderColor: 'hover:border-sky-200',
    },
    {
      icon: BookOpen,
      title: t.services.items.coran.title,
      titleAr: 'القرآن الكريم',
      description: t.services.items.coran.desc,
      href: '/coran',
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-600',
      borderColor: 'hover:border-emerald-200',
    },
    {
      icon: CalendarDays,
      title: t.services.items.agenda.title,
      titleAr: 'الأجندة والتقويم',
      description: t.services.items.agenda.desc,
      href: '/agenda',
      color: 'from-amber-500/20 to-amber-600/10',
      iconColor: 'text-amber-600',
      borderColor: 'hover:border-amber-200',
    },
    {
      icon: CreditCard,
      title: t.services.items.memberCard.title,
      titleAr: 'بطاقة العضوية',
      description: t.services.items.memberCard.desc,
      href: '/a-propos#carte-membre',
      color: 'from-lips-gold/20 to-lips-gold/10',
      iconColor: 'text-lips-gold',
      borderColor: 'hover:border-lips-gold/30',
    },
    {
      icon: Heart,
      title: t.services.items.donate.title,
      titleAr: 'التبرع',
      description: t.services.items.donate.desc,
      href: '/faire-un-don',
      color: 'from-rose-500/20 to-rose-600/10',
      iconColor: 'text-rose-600',
      borderColor: 'hover:border-rose-200',
    },
    {
      icon: UserPlus,
      title: t.services.items.join.title,
      titleAr: 'الانضمام',
      description: t.services.items.join.desc,
      href: '/adherer',
      color: 'from-lips-green/20 to-lips-green/10',
      iconColor: 'text-lips-green',
      borderColor: 'hover:border-lips-green/30',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-12 sm:py-20 lg:py-28 bg-white relative overflow-hidden"
    >
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lips-gold/30 to-transparent" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            {t.services.sectionTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            {t.services.sectionTitle}
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
            {t.services.sectionDesc}
          </p>
        </motion.div>

        {/* Services grid — 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={service.href}
                className={`group block bg-white border border-border/50 rounded-2xl p-6 sm:p-7 hover:shadow-xl hover:shadow-lips-green/5 transition-all duration-300 ${service.borderColor} h-full`}
              >
                {/* Icon + Arabic title */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                    <service.icon className={`h-6 w-6 ${service.iconColor}`} />
                  </div>
                  <span className="font-arabic text-sm text-lips-gold/60 mt-1">
                    {service.titleAr}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-lips-green-dark mb-2 group-hover:text-lips-green transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Arrow CTA */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-lips-green opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{t.services.explore}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
          className="text-center mt-10 sm:mt-14"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-lips-cream border border-lips-gold/20">
            <span className="text-sm text-muted-foreground">
              {t.services.memberSpaceNote}
            </span>
            <Link
              href="/espace-membre"
              className="text-sm font-semibold text-lips-green hover:text-lips-green-dark transition-colors inline-flex items-center gap-1"
            >
              {t.services.memberSpaceLink}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
