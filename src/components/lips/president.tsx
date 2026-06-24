'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Quote, UserCheck } from 'lucide-react';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function PresidentSection() {
  const { p } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border border-border/50 max-w-md mx-auto lg:mx-0 lg:max-w-none">
              <Image
                src="/images/president.jpg"
                alt={p.presidentSection.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">
                  {p.presidentSection.name}
                </h3>
                <p className="text-lips-gold font-medium">
                  {p.presidentSection.role}
                </p>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-lips-gold/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-lips-green/20 rounded-full blur-3xl -z-10" />
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lips-gold/10 border border-lips-gold/20 mb-6">
              <UserCheck className="h-4 w-4 text-lips-gold" />
              <span className="text-xs font-bold text-lips-gold tracking-widest uppercase">
                {p.presidentSection.sectionTag}
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-8 tracking-tight">
              {p.presidentSection.sectionTitle}
            </h2>
            
            <div className="relative">
              <Quote className="absolute -top-4 -left-6 h-12 w-12 text-lips-gold/20 rotate-180 -z-10" />
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed italic font-medium">
                "{p.presidentSection.bio}"
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border/50">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Le rôle du Président National est central dans l'orientation stratégique et la gouvernance de la Ligue. En tant que figure de proue, il incarne l'unité et la vision de l'institution, travaillant de concert avec le Bureau National pour renforcer la cohésion sociale et encadrer le corps des imams.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
