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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
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
      className="py-12 sm:py-20 lg:py-28 bg-gradient-to-b from-lips-cream via-white to-lips-cream relative overflow-hidden"
    >
      <div className="absolute inset-0 islamic-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            {p.devenirMembre.sectionTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            {p.devenirMembre.sectionTitle}
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">&#10022;</div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            {p.devenirMembre.sectionDesc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-lips-green-dark mb-6 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-lips-gold" />
              {p.devenirMembre.howToJoin}
            </h3>
            <div className="space-y-4">
              {STEPS.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-lips-green/10 flex items-center justify-center shrink-0">
                      <step.icon className="h-5 w-5 text-lips-green" />
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="w-px flex-1 bg-lips-green/20 my-2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="font-semibold text-sm text-lips-green-dark">{step.title}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <Card className="mt-8 border-lips-gold/20 bg-lips-gold/5">
              <CardContent className="p-5">
                <h4 className="font-semibold text-lips-green-dark text-sm mb-3">{p.devenirMembre.benefitsTitle}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BENEFITS.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-lips-green shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-lips-green/20 shadow-lg shadow-lips-green/5">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-lips-green-dark mb-1">{p.devenirMembre.formTitle}</h3>
                <p className="text-xs text-muted-foreground mb-6">{p.devenirMembre.sectionDesc}</p>

                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-lips-green/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-lips-green" />
                    </div>
                    <h4 className="font-bold text-lips-green-dark text-lg mb-2">{p.devenirMembre.submitted}</h4>
                    <p className="text-sm text-muted-foreground">
                      {p.devenirMembre.conditions}
                    </p>
                    <Button
                      className="mt-6 bg-lips-green hover:bg-lips-green-dark text-white"
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
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <User className="h-3 w-3 text-lips-green" /> {p.devenirMembre.firstName}
                        </label>
                        <Input placeholder="Mamadou" className="h-10 text-sm" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">{p.devenirMembre.lastName}</label>
                        <Input placeholder="SY" className="h-10 text-sm" required />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-lips-green" /> {p.devenirMembre.email}
                      </label>
                      <Input type="email" placeholder="mamadou.sy@exemple.sn" className="h-10 text-sm" required />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-lips-green" /> {p.devenirMembre.phone}
                      </label>
                      <Input type="tel" placeholder="+221 77 123 45 67" className="h-10 text-sm" required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-lips-green" /> {p.devenirMembre.region}
                        </label>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                          <option value="">{p.devenirMembre.selectPlaceholder}</option>
                          {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <Building className="h-3 w-3 text-lips-green" /> {p.devenirMembre.role}
                        </label>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                          <option value="">{p.devenirMembre.selectPlaceholder}</option>
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">{p.devenirMembre.mosque}</label>
                      <Input placeholder={p.devenirMembre.mosquePlaceholder} className="h-10 text-sm" />
                    </div>

                    <div className="pt-2">
                      <Button type="submit" className="w-full bg-lips-green hover:bg-lips-green-dark text-white h-11">
                        <UserPlus className="h-4 w-4 mr-2" />
                        {p.devenirMembre.submit}
                      </Button>
                    </div>

                    <p className="text-[10px] text-muted-foreground text-center">
                      {p.devenirMembre.conditions}
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
