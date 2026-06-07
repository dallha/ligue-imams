'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Heart,
  Gift,
  HandCoins,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/lips/i18n/language-context';

const MONTANTS = [1000, 2500, 5000, 10000, 25000, 50000];

export default function DonsSection() {
  const { p, locale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });
  const [selected, setSelected] = useState<number | null>(5000);
  const [custom, setCustom] = useState('');

  const currentMontant = custom ? parseInt(custom) : selected;

  const METHODES = [
    { icon: CreditCard, name: 'CinetPay', desc: p.dons.methods.cinetpay },
    { icon: Smartphone, name: 'Wave', desc: p.dons.methods.wave },
    { icon: Banknote, name: p.dons.sectionTag, desc: p.dons.methods.cash },
  ];

  const IMPACTS = [
    { montant: 1000, desc: p.dons.impacts.imams },
    { montant: 5000, desc: p.dons.impacts.mosques },
    { montant: 10000, desc: p.dons.impacts.training },
    { montant: 25000, desc: p.dons.impacts.solidarity },
    { montant: 50000, desc: p.dons.impacts.peace },
  ];

  return (
    <section
      ref={sectionRef}
      id="dons"
      className="py-16 sm:py-24 lg:py-32 bg-[#05180C] text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.03] pointer-events-none" />

      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lips-gold/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lips-emerald/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lips-gold/10 border border-lips-gold/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-lips-gold animate-pulse" />
            <span className="text-xs font-bold text-lips-gold tracking-widest uppercase">
              {p.dons.sectionTag}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight drop-shadow-lg">
            {p.dons.sectionTitle}
          </h2>
          
          <div className="inline-block bg-black/30 backdrop-blur-md border border-white/5 p-6 rounded-3xl mb-8 shadow-inner">
            <p className="font-arabic text-transparent bg-clip-text bg-gradient-to-r from-lips-gold to-[#C9962A] text-2xl sm:text-3xl mb-3 drop-shadow-sm">
              مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا
            </p>
            <p className="text-white/60 text-sm font-medium italic">
              &laquo; {p.dons.verseTranslation} &raquo; — Coran 2:245
            </p>
          </div>
          
          <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
            {p.dons.sectionDesc}
          </p>
        </motion.div>

        {/* Donation card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lips-gold/40 to-transparent" />
            
            <div className="p-8 lg:p-12">
              {/* Amount selection */}
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-full bg-lips-gold/10 flex items-center justify-center border border-lips-gold/20">
                  <HandCoins className="h-5 w-5 text-lips-gold" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {p.dons.chooseAmount}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {MONTANTS.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelected(m); setCustom(''); }}
                    className={`py-4 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 ${
                      selected === m && !custom
                        ? 'bg-gradient-to-br from-lips-gold to-[#C9962A] text-[#0A2E17] shadow-[0_0_20px_rgba(201,150,42,0.4)] scale-[1.02]'
                        : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {m.toLocaleString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR')} FCFA
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <Input
                  type="number"
                  placeholder={p.dons.otherAmount}
                  value={custom}
                  onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/40 h-14 rounded-xl text-lg font-medium focus-visible:ring-lips-gold/50"
                />
              </div>

              {/* Impact indicator */}
              <div className="bg-black/30 rounded-2xl p-5 mb-10 border border-white/5 flex items-start gap-4 transition-all duration-500">
                <div className="w-12 h-12 rounded-full bg-lips-emerald/10 flex items-center justify-center shrink-0 border border-lips-emerald/20">
                  <Gift className="h-5 w-5 text-lips-emerald" />
                </div>
                <div>
                  <div className="text-white font-bold mb-1">
                    {p.dons.impactTitle}
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {(() => {
                      const impact = IMPACTS.filter((i) => i.montant <= (currentMontant || 0)).pop();
                      return impact ? impact.desc : p.dons.fallbackImpact;
                    })()}
                  </p>
                </div>
              </div>

              {/* Payment methods */}
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  <CreditCard className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {p.dons.paymentMethod}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {METHODES.map((methode) => (
                  <div
                    key={methode.name}
                    className="group bg-white/5 rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <methode.icon className="h-6 w-6 text-lips-gold" />
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{methode.name}</div>
                    <div className="text-xs text-white/40">{methode.desc}</div>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <Button className="w-full bg-lips-gold hover:bg-[#C9962A] text-[#0A2E17] font-black h-16 text-xl rounded-2xl shadow-[0_0_30px_rgba(201,150,42,0.3)] transition-all hover:scale-[1.01]">
                <Heart className="h-6 w-6 mr-3" />
                {p.dons.donateAmount.replace('{amount}', currentMontant ? currentMontant.toLocaleString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR') : '0')}
              </Button>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                <span className="flex items-center gap-2 text-white/40 text-xs font-medium bg-black/20 px-4 py-2 rounded-full border border-white/5">
                  <ShieldCheck className="h-4 w-4 text-lips-emerald" /> {p.dons.securePayment}
                </span>
                <span className="flex items-center gap-2 text-white/40 text-xs font-medium bg-black/20 px-4 py-2 rounded-full border border-white/5">
                  <CheckCircle2 className="h-4 w-4 text-lips-gold" /> {p.dons.fiscalReceipt}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
