'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Users,
  MapPin,
  Building,
  BookOpen,
  Award,
  TrendingUp,
} from 'lucide-react';

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
}

const STATS: StatItem[] = [
  {
    icon: Users,
    value: 5000,
    suffix: '+',
    label: 'Membres Actifs',
    description:
      'Imams, prédicateurs et cadres religieux encadrés à travers tout le territoire national',
    color: 'text-lips-green',
  },
  {
    icon: MapPin,
    value: 14,
    suffix: '',
    label: 'Régions Couvertes',
    description:
      'Présence institutionnelle dans les 14 régions administratives du Sénégal',
    color: 'text-lips-emerald',
  },
  {
    icon: Building,
    value: 15000,
    suffix: '+',
    label: 'Mosquées Affiliées',
    description:
      'Réseau de mosquées partenaires pour la diffusion du message de paix et de concorde',
    color: 'text-lips-gold',
  },
  {
    icon: BookOpen,
    value: 200,
    suffix: '+',
    label: 'Formations Annuelles',
    description:
      'Cycles de formation continue en fiqh, aqida, daawa et gestion communautaire',
    color: 'text-lips-green-light',
  },
  {
    icon: Award,
    value: 18,
    suffix: '',
    label: "Années d'Excellence",
    description:
      'Depuis 2006, la LIPS œuvre pour l\'institutionnalisation de l\'imamat au Sénégal',
    color: 'text-lips-gold',
  },
  {
    icon: TrendingUp,
    value: 98,
    suffix: '%',
    label: 'Taux de Renouvellement',
    description:
      'Fidélité et engagement des membres au renouvellement annuel de leur carte',
    color: 'text-lips-emerald',
  },
];

function AnimatedCounter({
  value,
  suffix,
  duration = 2000,
  trigger,
}: {
  value: number;
  suffix: string;
  duration?: number;
  trigger: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasStartedRef = useRef(false);

  const animate = useCallback(() => {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
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
      ? displayValue.toLocaleString('fr-FR')
      : displayValue.toString();

  return (
    <span>
      {formatted}
      {trigger ? suffix : ''}
    </span>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="chiffres"
      className="py-20 lg:py-28 bg-white relative"
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lips-green via-lips-gold to-lips-green" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            En Chiffres
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            L&apos;Impact de la LIPS en Chiffres
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Des indicateurs concrets qui témoignent de l&apos;ampleur de notre
            action institutionnelle au service de la communauté musulmane du
            Sénégal.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white border border-border/50 rounded-xl p-6 hover:shadow-xl hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-xl">
                <div className="absolute top-0 right-0 w-28 h-28 -translate-y-14 translate-x-14 rotate-45 bg-lips-green/5 group-hover:bg-lips-green/10 transition-colors" />
              </div>

              <div className="relative">
                <stat.icon
                  className={`h-8 w-8 ${stat.color} mb-4`}
                  strokeWidth={1.5}
                />
                <div className="text-3xl md:text-4xl font-bold text-lips-green-dark mb-1">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    trigger={isInView}
                  />
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">
                  {stat.label}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
