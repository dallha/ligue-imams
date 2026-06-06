'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Shield, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background with Islamic pattern overlay */}
      <div className="absolute inset-0 bg-gradient-lips" />
      <div className="absolute inset-0 islamic-pattern opacity-30" />

      {/* Decorative geometric elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-white/10 rotate-45 rounded-sm" />
      <div className="absolute bottom-32 right-20 w-24 h-24 border border-lips-gold/20 rotate-12 rounded-sm" />
      <div className="absolute top-1/3 right-10 w-16 h-16 border border-white/5 rotate-45 rounded-full" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8"
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
          &laquo; Par la patience et la certitude, on atteint l&apos;imamat dans
          la religion &raquo;
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
          className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Au service des imams, de la communauté et de la paix sociale à travers
          les 14 régions du Sénégal. Un cadre institutionnel pour l&apos;unité,
          la formation et l&apos;accompagnement spirituel.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-lips-gold hover:bg-lips-gold-light text-lips-green-dark font-semibold shadow-lg hover:shadow-xl transition-all px-8"
          >
            <a href="#verification">
              <Shield className="mr-2 h-4 w-4" />
              Vérifier une Carte Membre
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm px-8"
          >
            <a href="#apropos">
              <BookOpen className="mr-2 h-4 w-4" />
              Découvrir la LIPS
            </a>
          </Button>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { icon: Users, value: '5 000+', label: 'Membres' },
            { icon: BookOpen, value: '14', label: 'Régions' },
            { icon: Shield, value: '15 000+', label: 'Mosquées' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="h-5 w-5 text-lips-gold mx-auto mb-2" />
              <div className="text-xl md:text-2xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>

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
      </div>
    </section>
  );
}
