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

const STEPS = [
  {
    icon: FileText,
    title: '1. Candidature en ligne',
    desc: 'Remplissez le formulaire d\'adhésion avec vos informations personnelles et votre affectation régionale.',
  },
  {
    icon: BadgeCheck,
    title: '2. Validation régionale',
    desc: 'Le responsable régional vérifie vos informations et valide votre candidature dans un délai de 72h.',
  },
  {
    icon: CreditCard,
    title: '3. Cotisation annuelle',
    desc: 'Réglez votre cotisation annuelle via CinetPay, Wave ou en espèces à la délégation régionale.',
  },
  {
    icon: CheckCircle2,
    title: '4. Carte membre délivrée',
    desc: 'Recevez votre carte membre nationale avec matricule unique et QR code de vérification.',
  },
];

const REGIONS = [
  'Dakar', 'Saint-Louis', 'Louga', 'Fatick', 'Thiès',
  'Kédougou', 'Kolda', 'Matam', 'Kaolack', 'Tambacounda',
  'Ziguinchor', 'Sédhiou', 'Diourbel', 'Kaffrine',
];

const ROLES = ['Imam', 'Prédicateur', 'Responsable régional', 'Membre du Choura', 'Autre'];

export default function DevenirMembreSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="devenir-membre"
      className="py-20 lg:py-28 bg-gradient-to-b from-lips-cream via-white to-lips-cream relative overflow-hidden"
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
            Adhésion
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            Devenir Membre de la LIPS
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">&#10022;</div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Rejoignez la communauté des imams et prédicateurs du Sénégal en quelques étapes simples.
            L&apos;adhésion vous donne accès à la carte membre nationale, aux formations continues et au
            réseau institutionnel de la LIPS.
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
              Comment adhérer ?
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
                <h4 className="font-semibold text-lips-green-dark text-sm mb-3">Avantages de l&apos;adhésion</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Carte membre nationale',
                    'Formations continues',
                    'Couverture sociale',
                    'Réseau institutionnel',
                    'Accès aux fatwas',
                    'Accompagnement juridique',
                  ].map((benefit) => (
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
                <h3 className="text-lg font-bold text-lips-green-dark mb-1">Formulaire d&apos;adhésion</h3>
                <p className="text-xs text-muted-foreground mb-6">Remplissez ce formulaire pour soumettre votre candidature.</p>

                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-lips-green/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-lips-green" />
                    </div>
                    <h4 className="font-bold text-lips-green-dark text-lg mb-2">Candidature soumise !</h4>
                    <p className="text-sm text-muted-foreground">
                      Votre demande a été enregistrée. Le responsable régional vous contactera sous 72h pour la validation.
                    </p>
                    <Button
                      className="mt-6 bg-lips-green hover:bg-lips-green-dark text-white"
                      onClick={() => setSubmitted(false)}
                    >
                      Nouvelle candidature
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
                          <User className="h-3 w-3 text-lips-green" /> Prénom
                        </label>
                        <Input placeholder="Mamadou" className="h-10 text-sm" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Nom</label>
                        <Input placeholder="SY" className="h-10 text-sm" required />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-lips-green" /> Email
                      </label>
                      <Input type="email" placeholder="mamadou.sy@exemple.sn" className="h-10 text-sm" required />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-lips-green" /> Téléphone
                      </label>
                      <Input type="tel" placeholder="+221 77 123 45 67" className="h-10 text-sm" required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-lips-green" /> Région
                        </label>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                          <option value="">Sélectionner</option>
                          {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <Building className="h-3 w-3 text-lips-green" /> Rôle
                        </label>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                          <option value="">Sélectionner</option>
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Mosque d&apos;affectation</label>
                      <Input placeholder="Grande Mosquée de la Médina" className="h-10 text-sm" />
                    </div>

                    <div className="pt-2">
                      <Button type="submit" className="w-full bg-lips-green hover:bg-lips-green-dark text-white h-11">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Soumettre ma candidature
                      </Button>
                    </div>

                    <p className="text-[10px] text-muted-foreground text-center">
                      En soumettant ce formulaire, vous acceptez les conditions d&apos;adhésion de la LIPS.
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
