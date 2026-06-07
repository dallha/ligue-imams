'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  UserPlus,
  CheckCircle2,
  FileText,
  CreditCard,
  BadgeCheck,
  Mail,
  Phone,
  User,
  MapPin,
  Building,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/lips/i18n/language-context';

const REGIONS = [
  'Dakar', 'Saint-Louis', 'Louga', 'Fatick', 'Thiès',
  'Kédougou', 'Kolda', 'Matam', 'Kaolack', 'Tambacounda',
  'Ziguinchor', 'Sédhiou', 'Diourbel', 'Kaffrine',
];

export default function DevenirMembreSection() {
  const { p } = useLanguage();
  const ROLES = [p.devenirMembre.roleImam, p.devenirMembre.rolePreacher, p.devenirMembre.roleRegionalHead, p.devenirMembre.roleShura, p.devenirMembre.roleOther];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });
  const [submitted, setSubmitted] = useState(false);

  const STEPS = [
    {
      icon: FileText,
      title: `1. ${p.devenirMembre.steps.apply.title}`,
      desc: p.devenirMembre.steps.apply.desc,
    },
    {
      icon: BadgeCheck,
      title: `2. ${p.devenirMembre.steps.validate.title}`,
      desc: p.devenirMembre.steps.validate.desc,
    },
    {
      icon: CreditCard,
      title: `3. ${p.devenirMembre.steps.pay.title}`,
      desc: p.devenirMembre.steps.pay.desc,
    },
    {
      icon: CheckCircle2,
      title: `4. ${p.devenirMembre.steps.card.title}`,
      desc: p.devenirMembre.steps.card.desc,
    },
  ];

  const BENEFITS = [
    p.devenirMembre.benefits.nationalCard,
    p.devenirMembre.benefits.training,
    p.devenirMembre.benefits.representation,
    p.devenirMembre.benefits.network,
    p.devenirMembre.benefits.resources,
    p.devenirMembre.benefits.community,
  ];

  return (
    <section
      ref={sectionRef}
      id="devenir-membre"
      className="py-16 sm:py-24 lg:py-32 bg-muted/20 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-lips-emerald/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.02] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lips-green/10 border border-lips-green/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-lips-green animate-pulse" />
            <span className="text-xs font-bold text-lips-green tracking-widest uppercase">
              {p.devenirMembre.sectionTag}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
            {p.devenirMembre.sectionTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {p.devenirMembre.sectionDesc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Steps & Benefits (takes 5 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-10"
          >
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lips-green to-lips-emerald flex items-center justify-center shadow-lg shadow-lips-green/20">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {p.devenirMembre.howToJoin}
                </h3>
              </div>
              
              <div className="space-y-6">
                {STEPS.map((step, index) => (
                  <div key={step.title} className="flex gap-5 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-card border border-border/50 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-lips-green group-hover:text-white transition-colors duration-300 text-lips-green">
                        <step.icon className="h-5 w-5" />
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className="w-px h-full bg-border mt-3 mb-1" />
                      )}
                    </div>
                    <div className="pb-6">
                      <div className="font-bold text-base text-foreground mb-1">{step.title}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BadgeCheck className="w-32 h-32 text-lips-gold" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-5 relative z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lips-gold" />
                {p.devenirMembre.benefitsTitle}
              </h4>
              <div className="grid grid-cols-1 gap-3 relative z-10">
                {BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-muted/50 p-2.5 rounded-xl border border-border/30">
                    <CheckCircle2 className="h-4 w-4 text-lips-gold shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form (takes 7 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="bg-card rounded-[2.5rem] p-8 sm:p-12 border border-border/50 shadow-2xl shadow-lips-green/5 relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-lips-green via-lips-emerald to-lips-green rounded-t-[2.5rem]" />
              
              <h3 className="text-2xl font-bold text-foreground mb-2">{p.devenirMembre.formTitle}</h3>
              <p className="text-sm text-muted-foreground mb-10">{p.devenirMembre.sectionDesc}</p>

              {submitted ? (
                <div className="text-center py-16">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                    className="w-24 h-24 rounded-full bg-lips-emerald/10 border border-lips-emerald/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="h-12 w-12 text-lips-emerald" />
                  </motion.div>
                  <h4 className="font-black text-2xl text-foreground mb-4">{p.devenirMembre.submitted}</h4>
                  <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                    {p.devenirMembre.conditions}
                  </p>
                  <Button
                    className="mt-8 bg-lips-green hover:bg-lips-green-dark text-white rounded-full px-8 h-12 font-bold"
                    onClick={() => setSubmitted(false)}
                  >
                    {p.devenirMembre.newApplication}
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        <User className="h-4 w-4 text-lips-green" /> {p.devenirMembre.firstName}
                      </label>
                      <Input placeholder="Mamadou" className="h-12 rounded-xl bg-muted/50 border-border/50 focus-visible:ring-lips-green/50" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground ml-6">{p.devenirMembre.lastName}</label>
                      <Input placeholder="SY" className="h-12 rounded-xl bg-muted/50 border-border/50 focus-visible:ring-lips-green/50" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4 text-lips-green" /> {p.devenirMembre.email}
                      </label>
                      <Input type="email" placeholder="mamadou.sy@exemple.sn" className="h-12 rounded-xl bg-muted/50 border-border/50 focus-visible:ring-lips-green/50" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4 text-lips-green" /> {p.devenirMembre.phone}
                      </label>
                      <Input type="tel" placeholder="+221 77 123 45 67" className="h-12 rounded-xl bg-muted/50 border-border/50 focus-visible:ring-lips-green/50" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-lips-green" /> {p.devenirMembre.region}
                      </label>
                      <select className="w-full h-12 rounded-xl border border-border/50 bg-muted/50 px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lips-green/50" required>
                        <option value="">{p.devenirMembre.selectPlaceholder}</option>
                        {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Building className="h-4 w-4 text-lips-green" /> {p.devenirMembre.role}
                      </label>
                      <select className="w-full h-12 rounded-xl border border-border/50 bg-muted/50 px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lips-green/50" required>
                        <option value="">{p.devenirMembre.selectPlaceholder}</option>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-lips-green/20 flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-lips-green" />
                      </span>
                      {p.devenirMembre.mosque}
                    </label>
                    <Input placeholder={p.devenirMembre.mosquePlaceholder} className="h-12 rounded-xl bg-muted/50 border-border/50 focus-visible:ring-lips-green/50" />
                  </div>

                  <div className="pt-6">
                    <Button type="submit" className="w-full bg-lips-green hover:bg-lips-green-dark text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-lips-green/20">
                      <UserPlus className="h-5 w-5 mr-2" />
                      {p.devenirMembre.submit}
                    </Button>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-xl border border-border/50 mt-6">
                    <p className="text-xs text-muted-foreground text-center leading-relaxed">
                      {p.devenirMembre.conditions}
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
