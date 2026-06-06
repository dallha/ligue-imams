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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/lips/i18n/language-context';

const MONTANTS = [1000, 2500, 5000, 10000, 25000, 50000];

export default function DonsSection() {
  const { p } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
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
      className="py-12 sm:py-20 lg:py-28 bg-gradient-to-b from-lips-green-dark via-lips-green to-lips-green-dark text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 islamic-pattern opacity-10" />

      <div className="relative max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            {p.dons.sectionTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
            {p.dons.sectionTitle}
          </h2>
          <p className="font-arabic text-lips-gold text-xl mb-4">
            مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا
          </p>
          <p className="text-white/70 max-w-xl mx-auto text-sm italic">
            &laquo; {p.dons.verseTranslation} &raquo; — Coran 2:245
          </p>
          <p className="text-white/60 max-w-2xl mx-auto text-sm mt-4">
            {p.dons.sectionDesc}
          </p>
        </motion.div>

        {/* Donation card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-6 lg:p-8">
              {/* Amount selection */}
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <HandCoins className="h-5 w-5 text-lips-gold" />
                {p.dons.chooseAmount}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                {MONTANTS.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelected(m); setCustom(''); }}
                    className={`py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      selected === m && !custom
                        ? 'bg-lips-gold text-lips-green-dark shadow-lg shadow-lips-gold/30'
                        : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    {m.toLocaleString('fr-FR')} F
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mb-6">
                <Input
                  type="number"
                  placeholder={p.dons.otherAmount}
                  value={custom}
                  onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-11"
                />
              </div>

              {/* Impact indicator */}
              {currentMontant && (
                <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
                  <div className="flex items-center gap-2 text-lips-gold text-sm font-medium mb-1">
                    <Gift className="h-4 w-4" />
                    {p.dons.impactTitle}
                  </div>
                  {(() => {
                    const impact = IMPACTS.filter((i) => i.montant <= (currentMontant || 0)).pop();
                    return impact ? (
                      <p className="text-white/70 text-xs">{impact.desc}</p>
                    ) : (
                      <p className="text-white/70 text-xs">{p.dons.fallbackImpact}</p>
                    );
                  })()}
                </div>
              )}

              {/* Payment methods */}
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-lips-gold" />
                {p.dons.paymentMethod}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {METHODES.map((methode) => (
                  <div
                    key={methode.name}
                    className="bg-white/10 rounded-lg p-3 text-center border border-white/10 hover:bg-white/15 cursor-pointer transition-colors"
                  >
                    <methode.icon className="h-5 w-5 text-lips-gold mx-auto mb-1.5" />
                    <div className="text-xs font-medium text-white">{methode.name}</div>
                    <div className="text-[10px] text-white/50">{methode.desc}</div>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <Button className="w-full bg-lips-gold hover:bg-lips-gold-light text-lips-green-dark font-semibold h-12 text-base shadow-lg shadow-lips-gold/30">
                <Heart className="h-5 w-5 mr-2" />
                {p.dons.donateAmount.replace('{amount}', currentMontant ? currentMontant.toLocaleString('fr-FR') : '0')}
              </Button>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-4 text-[10px] text-white/40">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> {p.dons.securePayment}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {p.dons.fiscalReceipt}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
