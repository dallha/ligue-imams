'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { UserPlus, BookOpen, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/lib/lips/i18n/language-context';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  const { t, isRTL } = useLanguage();
  const [heroStats, setHeroStats] = useState({ membres: 0, mosquees: 0 });

  useEffect(() => {
    fetch('/api/public/config')
      .then(r => r.json())
      .then(data => {
        const cfg: Record<string, string> = {};
        (data.config || []).forEach((c: { key: string; value: string }) => { cfg[c.key] = c.value; });
        setHeroStats({
          membres: parseInt(cfg['stat_members'] || '0'),
          mosquees: parseInt(cfg['stat_mosques'] || '0'),
        });
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="accueil"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-lips-cream dark:bg-[#0D3B1F] transition-colors duration-500"
    >
      {/* Background image & Gradients */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-[pulse_20s_ease-in-out_infinite] opacity-10 mix-blend-multiply dark:opacity-30 dark:mix-blend-luminosity transition-opacity duration-500"
        style={{ backgroundImage: "url('/hero-imams.jpg')" }}
      />
      
      {/* Complex Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-lips-cream via-transparent to-lips-cream/80 dark:from-[#05180C] dark:via-transparent dark:to-[#05180C]/80 transition-colors duration-500" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.05]" />

      {/* Decorative floating elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [45, 50, 45] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="hidden sm:block absolute top-1/4 left-10 w-40 h-40 border-[1px] border-lips-gold/20 rounded-3xl backdrop-blur-3xl" 
      />
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [12, 0, 12] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="hidden lg:block absolute bottom-1/3 right-20 w-32 h-32 bg-lips-gold/5 border border-lips-gold/20 rounded-full backdrop-blur-xl" 
      />
      
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lips-gold/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-20 pb-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-md border border-lips-green/10 text-lips-green-dark shadow-xl mb-8 transition-colors duration-500"
          >
            <Shield className="h-4 w-4 text-lips-green dark:text-lips-gold" />
            <span className="text-sm font-bold tracking-wide">{t.hero.badge}</span>
          </motion.div>

          {/* Arabic motto */}
          {!isRTL && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4"
            >
              <p className="font-arabic text-3xl md:text-5xl lg:text-6xl text-[#C9962A] leading-relaxed drop-shadow-sm">
                {t.hero.arabicMotto}
              </p>
            </motion.div>
          )}

          {/* Motto translation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lips-green-dark/80 dark:text-white/80 text-lg md:text-xl font-light italic mb-8 border-l-2 border-lips-green dark:border-lips-gold pl-4 transition-colors duration-500"
          >
            &laquo; {t.hero.mottoTranslation} &raquo;
          </motion.p>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-lips-green-dark dark:text-white mb-6 tracking-tight leading-[1.1] transition-colors duration-500"
          >
            {t.hero.title1}
            <br />
            <span className="text-lips-green dark:text-lips-green-light">{t.hero.title2}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lips-green-dark/70 dark:text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 font-medium dark:font-light transition-colors duration-500"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-lips-green to-lips-emerald dark:from-lips-gold dark:to-[#C9962A] hover:from-lips-emerald hover:to-lips-green dark:hover:from-[#C9962A] dark:hover:to-[#B08020] text-white dark:text-[#0D3B1F] font-bold shadow-[0_0_30px_rgba(27,107,58,0.3)] dark:shadow-[0_0_30px_rgba(201,150,42,0.3)] hover:shadow-[0_0_50px_rgba(27,107,58,0.5)] dark:hover:shadow-[0_0_50px_rgba(201,150,42,0.5)] transition-all px-8 py-7 rounded-full text-lg hover:-translate-y-1"
            >
              <Link href="/adherer">
                <UserPlus className="mr-2 h-5 w-5" />
                {t.hero.joinCta}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white/50 dark:bg-white/5 border-lips-green/20 dark:border-white/20 text-lips-green-dark dark:text-white hover:bg-white/80 dark:hover:bg-white/10 hover:text-lips-green dark:hover:text-white backdrop-blur-md px-8 py-7 rounded-full text-lg transition-all hover:-translate-y-1"
            >
              <Link href="/a-propos">
                <BookOpen className="mr-2 h-5 w-5" />
                {t.hero.discoverCta}
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Quick stats (Glassmorphism Card) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 max-w-4xl bg-background/80 backdrop-blur-xl border border-lips-green/10 rounded-3xl p-6 sm:p-8 shadow-2xl transition-colors duration-500"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 divide-y sm:divide-y-0 sm:divide-x divide-lips-green/10 dark:divide-white/10">
            {[
              { icon: Users, value: heroStats.membres > 0 ? heroStats.membres.toLocaleString(isRTL ? 'ar-SN' : 'fr-FR') : '—', label: t.hero.members },
              { icon: BookOpen, value: '14', label: t.hero.regions },
              { icon: Shield, value: heroStats.mosquees > 0 ? heroStats.mosquees.toLocaleString(isRTL ? 'ar-SN' : 'fr-FR') : '—', label: t.hero.mosques },
            ].map((stat, idx) => (
              <div key={idx} className={cn("flex flex-col items-center sm:items-start pt-6 sm:pt-0", idx === 0 && "pt-0")}>
                <div className="w-12 h-12 rounded-2xl bg-lips-green/10 dark:bg-lips-gold/10 flex items-center justify-center mb-4 transition-colors duration-500">
                  <stat.icon className="h-6 w-6 text-lips-green dark:text-lips-gold" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-lips-green-dark dark:text-white mb-1 transition-colors duration-500">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-lips-green-dark/60 dark:text-white/60 tracking-wider uppercase transition-colors duration-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <div className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center p-2 backdrop-blur-sm">
            <motion.div 
              animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1.5 h-3 bg-lips-gold rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
