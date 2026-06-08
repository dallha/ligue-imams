'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useLanguage } from '@/lib/lips/i18n/language-context';
import { cn } from '@/lib/utils';

interface DbStatItem {
  id: number;
  key: string;
  icon: string | null;
  value: number;
  suffix: string | null;
  label: string;
  labelAr: string | null;
  desc: string | null;
  descAr: string | null;
  color?: string; // We'll add this dynamically or use a default
}

function AnimatedCounter({
  value,
  suffix,
  duration = 2000,
  trigger,
  locale,
}: {
  value: number;
  suffix: string;
  duration?: number;
  trigger: boolean;
  locale: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasStartedRef = useRef(false);

  const animate = useCallback(() => {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 4); // Quartic ease out
      const current = Math.round(easedProgress * value);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  useEffect(() => {
    if (trigger && !hasStartedRef.current) {
      hasStartedRef.current = true;
      animate();
    }
  }, [trigger, animate]);

  const formatted =
    value >= 1000
      ? displayValue.toLocaleString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR')
      : displayValue.toString();

  return (
    <span>
      {formatted}
      <span className="text-lips-gold">{trigger ? suffix : ''}</span>
    </span>
  );
}

export default function StatsSection() {
  const { t, p, locale, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [dbStats, setDbStats] = useState<DbStatItem[]>([]);

  useEffect(() => {
    fetch('/api/public/statistiques')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setDbStats(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const COLORS = [
    'from-lips-green-light to-lips-green',
    'from-emerald-400 to-emerald-600',
    'from-[#E5BE5A] to-[#C9962A]',
    'from-teal-400 to-teal-600',
    'from-lips-gold to-[#B08020]',
    'from-sky-400 to-sky-600',
  ];

  const FALLBACK_STATS: DbStatItem[] = [
    { id: 1, key: 'membres', icon: 'Users', value: 0, suffix: '', label: t.stats.items.members.label, labelAr: '', desc: t.stats.items.members.desc, descAr: '' },
    { id: 2, key: 'regions', icon: 'MapPin', value: 14, suffix: '', label: t.stats.items.regions.label, labelAr: '', desc: t.stats.items.regions.desc, descAr: '' },
    { id: 3, key: 'mosquees', icon: 'Building', value: 0, suffix: '', label: t.stats.items.mosques.label, labelAr: '', desc: t.stats.items.mosques.desc, descAr: '' },
    { id: 4, key: 'formations', icon: 'BookOpen', value: 0, suffix: '', label: t.stats.items.trainings.label, labelAr: '', desc: t.stats.items.trainings.desc, descAr: '' },
    { id: 5, key: 'annees', icon: 'Award', value: 18, suffix: '', label: t.stats.items.years.label, labelAr: '', desc: t.stats.items.years.desc, descAr: '' },
    { id: 6, key: 'renouvellement', icon: 'TrendingUp', value: 0, suffix: '%', label: t.stats.items.renewal.label, labelAr: '', desc: t.stats.items.renewal.desc, descAr: '' },
  ];

  const STATS = dbStats.length > 0 ? dbStats : FALLBACK_STATS;

  return (
    <section
      ref={sectionRef}
      id="chiffres"
      className="py-24 lg:py-32 relative overflow-hidden bg-[#0D3B1F]"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 islamic-pattern opacity-[0.05]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1B6B3A]/20 to-transparent" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lips-gold/10 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-lips-gold animate-pulse" />
            <span className="text-xs font-bold text-lips-gold tracking-widest uppercase">
              {t.stats.sectionTag}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {t.stats.sectionTitle}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            {t.stats.sectionDesc}
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {STATS.map((stat, index) => {
            // @ts-ignore
            const IconComponent = stat.icon && Icons[stat.icon] ? Icons[stat.icon] : Icons.TrendingUp;
            const color = COLORS[index % COLORS.length];

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 overflow-hidden"
              >
                {/* Glow effect */}
                <div className={cn(
                  "absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500",
                  `bg-gradient-to-br ${color}`
                )} />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                      `bg-gradient-to-br ${color}`
                    )}>
                      <IconComponent className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <Icons.TrendingUp className="h-4 w-4 text-white/50" />
                    </div>
                  </div>

                  <div className="text-5xl font-bold text-white mb-3 tracking-tight">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix || ''}
                      trigger={isInView}
                      locale={locale}
                    />
                  </div>
                  <div className="text-lg font-semibold text-white/90 mb-2">
                    {isRTL && stat.labelAr ? stat.labelAr : stat.label}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed font-light">
                    {isRTL && stat.descAr ? stat.descAr : stat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
