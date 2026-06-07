'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  UserPlus,
  Heart,
  Shield,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function HomeCTA() {
  const { t, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const CTA_ITEMS = [
    {
      icon: UserPlus,
      title: t.cta.joinTitle,
      desc: t.cta.joinDesc,
      btn: t.cta.joinBtn,
      href: '/adherer',
      primary: true,
    },
    {
      icon: Shield,
      title: t.cta.verifyTitle,
      desc: t.cta.verifyDesc,
      btn: t.cta.verifyBtn,
      href: '/verifier-carte',
      primary: false,
    },
    {
      icon: BookOpen,
      title: t.cta.coranTitle,
      desc: t.cta.coranDesc,
      btn: t.cta.coranBtn,
      href: '/coran',
      primary: true,
    },
    {
      icon: Heart,
      title: t.cta.donateTitle,
      desc: t.cta.donateDesc,
      btn: t.cta.donateBtn,
      href: '/faire-un-don',
      primary: true,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#0A2E17] text-white relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 islamic-pattern opacity-[0.05]" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-lips-gold/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lips-green/20 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4" />
      
      {/* Top golden border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lips-gold to-transparent opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CTA_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-lips-gold/30 hover:bg-white/10 rounded-3xl p-8 h-full flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-lips-gold/10 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="h-8 w-8 text-lips-gold" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                
                <p className="text-white/60 text-sm leading-relaxed mb-8 flex-1">
                  {item.desc}
                </p>
                
                <Button 
                  asChild 
                  variant={item.primary ? "default" : "outline"} 
                  className={
                    item.primary 
                      ? "w-full bg-gradient-to-r from-lips-gold to-[#C9962A] hover:from-[#C9962A] hover:to-[#B08020] text-[#0A2E17] font-bold shadow-lg shadow-lips-gold/20 transition-all rounded-full" 
                      : "w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full transition-all"
                  }
                >
                  <Link href={item.href}>
                    {item.btn}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quran verse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0A2E17] px-4">
              <span className="text-lips-gold">✨</span>
            </div>
            {!isRTL && (
              <p className="font-arabic text-lips-gold text-2xl md:text-3xl mb-4 drop-shadow-sm leading-relaxed" dir="rtl">
                {t.cta.verseArabic}
              </p>
            )}
            <p className="text-white/60 text-sm italic">
              &laquo; {t.cta.verseTranslation} &raquo;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
