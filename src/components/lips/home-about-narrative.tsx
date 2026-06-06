'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomeAboutNarrative() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      id="about-narrative"
      className="py-12 sm:py-20 lg:py-28 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-lips-cream/80 via-white to-lips-cream/80" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.04]" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Mosque image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Image container with decorative frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-lips-green-dark/10">
              <img
                src="/mosquee-exterieur.jpg"
                alt="Grande Mosquée — Siège de la LIPS"
                className="w-full aspect-[4/3] object-cover"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-lips-green-dark/40 via-transparent to-transparent" />

              {/* Caption on image */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <p className="text-white font-semibold text-sm sm:text-base">
                  Grande Mosquée AN-NOUR
                </p>
                <p className="text-white/60 text-xs sm:text-sm">
                  Liberté II, Dakar — Siège de la LIPS
                </p>
              </div>
            </div>

            {/* Decorative floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-4 -right-4 sm:bottom-6 sm:-right-6 bg-white rounded-xl shadow-lg border border-lips-gold/20 p-3 sm:p-4 max-w-[180px] sm:max-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-lips-gold fill-lips-gold" />
                <span className="text-xs font-bold text-lips-green-dark uppercase tracking-wider">Depuis 2006</span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                18 ans d&apos;excellence au service de l&apos;imamat au Sénégal
              </p>
            </motion.div>

            {/* Decorative gold border accent */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-lips-gold/40 rounded-tl-2xl" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-lips-gold/40 rounded-br-2xl" />
          </motion.div>

          {/* Right: Narrative text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
              Qui Sommes-Nous
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
              Ligue des Imams et<br />Prédicateurs du Sénégal
            </h2>
            <div className="separator-islamic text-lips-gold text-2xl my-4">
              &#10022;
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                La <strong className="text-lips-green-dark">LIPS</strong> est
                l&apos;institution nationale de référence qui fédère l&apos;ensemble
                des imams et prédicateurs du Sénégal. Fondée en 2006, elle œuvre
                pour l&apos;institutionnalisation de l&apos;imamat, la formation
                continue des cadres religieux et la promotion du dialogue
                interreligieux au service de la paix sociale.
              </p>
              <p>
                Forte de sa présence dans les <strong className="text-lips-green-dark">14 régions</strong> du
                pays et de son réseau de plus de <strong className="text-lips-green-dark">5 000 membres</strong>,
                la LIPS constitue un cadre unificateur qui porte la voix des imams
                auprès des autorités publiques, des institutions nationales et des
                partenaires internationaux.
              </p>
              <p>
                Son siège à la Grande Mosquée AN-NOUR de Liberté II, Dakar, est le
                cœur symbolique d&apos;un réseau qui relie les mosquées et les
                communautés de tout le territoire sénégalais, du Fouta à la
                Casamance, de la côte au Sahel.
              </p>
            </div>

            {/* Arabic motto */}
            <div className="mt-6 p-4 bg-lips-green-dark/5 rounded-xl border border-lips-green-dark/10">
              <p className="font-arabic text-lips-gold text-lg mb-1">
                بِالصَّبْرِ وَالْيَقِينِ تُنَالُ الْإِمَامَةُ فِي الدِّينِ
              </p>
              <p className="text-xs text-muted-foreground italic">
                &laquo; Par la patience et la certitude, on atteint l&apos;imamat dans la religion &raquo;
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <Button asChild className="bg-lips-green hover:bg-lips-green-dark text-white font-semibold">
                <Link href="/a-propos">
                  En savoir plus sur la LIPS
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
