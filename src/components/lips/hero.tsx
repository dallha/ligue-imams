'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Shield, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image — institutional meeting photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-institutional.jpg')" }}
      />

      {/* Multi-layer overlay for readability + institutional identity */}
      {/* Layer 1: Dark green base overlay */}
      <div className="absolute inset-0 bg-lips-green-dark/85" />
      {/* Layer 2: Gradient from left (stronger) to right (lighter) for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-lips-green-dark/90 via-lips-green-dark/60 to-lips-green-dark/40" />
      {/* Layer 3: Bottom fade for smooth transition to next section */}
      <div className="absolute inset-0 bg-gradient-to-t from-lips-green-dark/50 via-transparent to-lips-green-dark/30" />
      {/* Layer 4: Islamic pattern texture */}
      <div className="absolute inset-0 islamic-pattern opacity-15" />

      {/* Decorative geometric elements */}
      <div className="hidden sm:block absolute top-20 left-10 w-32 h-32 border border-white/10 rotate-45 rounded-sm" />
      <div className="hidden sm:block absolute bottom-32 right-20 w-24 h-24 border border-lips-gold/20 rotate-12 rounded-sm" />
      <div className="hidden sm:block absolute top-1/3 right-10 w-16 h-16 border border-white/5 rotate-45 rounded-full" />

      {/* Subtle gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lips-gold/40 to-transparent" />

      {/* Content — left-aligned for editorial impact with photo on right */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs sm:text-sm mb-6 sm:mb-8"
          >
            <Shield className="h-4 w-4 text-lips-gold" />
            <span>Institution Nationale de Référence</span>
          </motion.div>

          {/* Arabic motto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4"
          >
            <p className="font-arabic text-2xl md:text-4xl lg:text-5xl text-lips-gold leading-relaxed">
              بِالصَّبْرِ وَالْيَقِينِ تُنَالُ الْإِمَامَةُ فِي الدِّينِ
            </p>
          </motion.div>

          {/* French translation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/70 text-sm md:text-base italic mb-6"
          >
            &laquo; Par la patience et la certitude, on atteint
            l&apos;imamat dans la religion &raquo;
          </motion.p>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            Ligue des Imams et
            <br />
            Prédicateurs du Sénégal
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed mb-10"
          >
            Au service des imams, de la communauté et de la paix sociale à
            travers les 14 régions du Sénégal. Un cadre institutionnel pour
            l&apos;unité, la formation et l&apos;accompagnement spirituel.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-lips-gold hover:bg-lips-gold-light text-lips-green-dark font-semibold shadow-lg hover:shadow-xl transition-all px-8"
            >
              <Link href="/verifier-carte">
                <Shield className="mr-2 h-4 w-4" />
                Vérifier une Carte Membre
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm px-8"
            >
              <Link href="/a-propos">
                <BookOpen className="mr-2 h-4 w-4" />
                Découvrir la LIPS
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Quick stats — positioned at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-3 gap-4 sm:gap-8 lg:gap-12"
        >
          {[
            { icon: Users, value: '5 000+', label: 'Membres' },
            { icon: BookOpen, value: '14', label: 'Régions' },
            { icon: Shield, value: '15 000+', label: 'Mosquées' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 sm:gap-3">
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-lips-gold shrink-0" />
              <div>
                <div className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-white/60">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown className="h-5 w-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
