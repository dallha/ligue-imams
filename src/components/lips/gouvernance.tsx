'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Crown, Users, Building, Award, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Leader {
  nom: string;
  prenom: string;
  role: string;
  roleAr: string;
  region: string;
  bio: string;
  initiales: string;
}

const BUREAU_NATIONAL: Leader[] = [
  {
    nom: 'NDAW',
    prenom: 'Abdoulaye',
    role: 'Président National',
    roleAr: 'الرئيس الوطني',
    region: 'Dakar',
    bio: 'Imam de la Grande Mosquée de la Médina, élu à la tête de la LIPS en 2020 pour un mandat de 5 ans. Figure respectée du dialogue interreligieux au Sénégal.',
    initiales: 'AN',
  },
  {
    nom: 'BALDE',
    prenom: 'Mouhammadou',
    role: 'Vice-Président',
    roleAr: 'نائب الرئيس',
    region: 'Tambacounda',
    bio: 'Prédicateur émérite et ancien responsable régional de Tambacounda. Expert en médiation communautaire et cohésion sociale.',
    initiales: 'MB',
  },
  {
    nom: 'SOW',
    prenom: 'Ibrahima',
    role: 'Secrétaire Général',
    roleAr: 'الأمين العام',
    region: 'Saint-Louis',
    bio: 'Juriste en droit islamique, formé à l\'Université Al-Azhar. Pilier de l\'administration et de la structuration institutionnelle de la LIPS.',
    initiales: 'IS',
  },
  {
    nom: 'DIAKHATE',
    prenom: 'Ousmane',
    role: 'Trésorier Général',
    roleAr: 'أمين الصندوق',
    region: 'Thiès',
    bio: 'Expert en gestion financière et en administration d\'organisations confessionnelles. Garant de la transparence et de la pérennité financière de la LIPS.',
    initiales: 'OD',
  },
  {
    nom: 'MBACKÉ',
    prenom: 'Serigne',
    role: 'Conseiller Spirituel',
    roleAr: 'المستشار الروحي',
    region: 'Diourbel',
    bio: 'Descendant d\'une lignée savante, érudit en sciences islamiques et en tariqa. Guide spirituel et gardien de l\'orthodoxie malikite au sein de la LIPS.',
    initiales: 'SM',
  },
  {
    nom: 'FAYE',
    prenom: 'Mamadou',
    role: 'Responsable Formation',
    roleAr: 'مسؤول التكوين',
    region: 'Kaolack',
    bio: 'Docteur en études islamiques, concepteur du programme de formation continue des imams. Auteur de plusieurs ouvrages sur la prédication moderne.',
    initiales: 'MF',
  },
];

const COMMISSIONS = [
  { icon: Crown, name: 'Conseil du Choura', nameAr: 'مجلس الشورى', members: 28, desc: 'Instance suprême de délibération et de conseil' },
  { icon: Users, name: 'Commission des Membres', nameAr: 'لجنة العضوية', members: 7, desc: 'Admissions, radiations et discipline' },
  { icon: Building, name: 'Commission Financière', nameAr: 'اللجنة المالية', members: 5, desc: 'Audit, budget et transparence' },
  { icon: Award, name: 'Commission Fatwa', nameAr: 'لجنة الفتوى', members: 12, desc: 'Avis juridiques et consultations religieuses' },
];

export default function GouvernanceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="gouvernance"
      className="py-12 sm:py-20 lg:py-28 bg-white relative"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            Gouvernance
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            Bureau National & Institutions
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">&#10022;</div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            La LIPS est dirigée par un Bureau National élu, secondé par des commissions
            spécialisées et un Conseil du Choura. Cette gouvernance garantit la représentativité,
            la transparence et la légitimité institutionnelle.
          </p>
        </motion.div>

        {/* Bureau National grid */}
        <div className="mb-16">
          <h3 className="text-lg font-bold text-lips-green-dark mb-6 flex items-center gap-2">
            <Crown className="h-5 w-5 text-lips-gold" />
            Bureau National
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BUREAU_NATIONAL.map((leader, index) => (
              <motion.div
                key={leader.role}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="group hover:shadow-lg hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20 border-border/50 h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lips-green to-lips-emerald flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                        <span className="text-white font-bold text-lg">{leader.initiales}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-lips-green-dark text-sm truncate">
                            {leader.prenom} {leader.nom}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-lips-green/10 text-lips-green text-[10px] px-2">
                            {leader.role}
                          </Badge>
                        </div>
                        <span className="font-arabic text-[10px] text-lips-gold">{leader.roleAr}</span>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                          {leader.bio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Commissions */}
        <div>
          <h3 className="text-lg font-bold text-lips-green-dark mb-6 flex items-center gap-2">
            <Building className="h-5 w-5 text-lips-gold" />
            Commissions Spécialisées
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMISSIONS.map((commission, index) => (
              <motion.div
                key={commission.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
              >
                <Card className="group hover:shadow-md hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20 border-border/50 cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-lips-gold/10 flex items-center justify-center">
                        <commission.icon className="h-5 w-5 text-lips-gold" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lips-green-dark text-sm">{commission.name}</h4>
                        <span className="font-arabic text-[10px] text-lips-gold">{commission.nameAr}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{commission.desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-muted-foreground">{commission.members} membres</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-lips-green group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
