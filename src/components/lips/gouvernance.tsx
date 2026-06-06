'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Crown, Users, Building, Award, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/lips/i18n/language-context';

interface Leader {
  nom: string;
  prenom: string;
  role: string;
  roleAr: string;
  region: string;
  bio: string;
  initiales: string;
}

interface Commission {
  icon: React.ElementType;
  name: string;
  nameAr: string;
  members: number;
  desc: string;
}

export default function GouvernanceSection() {
  const { p } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const BUREAU_NATIONAL: Leader[] = [
    {
      nom: 'TRAORÉ',
      prenom: 'Amadou',
      role: p.gouvernance.bureau.president.role,
      roleAr: 'الرئيس الوطني',
      region: 'Dakar',
      bio: p.gouvernance.bureau.president.bio,
      initiales: 'AT',
    },
    {
      nom: 'BALDE',
      prenom: 'Mouhammadou',
      role: p.gouvernance.bureau.vicePresident.role,
      roleAr: 'نائب الرئيس',
      region: 'Tambacounda',
      bio: p.gouvernance.bureau.vicePresident.bio,
      initiales: 'MB',
    },
    {
      nom: 'SOW',
      prenom: 'Ibrahima',
      role: p.gouvernance.bureau.secretary.role,
      roleAr: 'الأمين العام',
      region: 'Saint-Louis',
      bio: p.gouvernance.bureau.secretary.bio,
      initiales: 'IS',
    },
    {
      nom: 'DIAKHATE',
      prenom: 'Ousmane',
      role: p.gouvernance.bureau.treasurer.role,
      roleAr: 'أمين الصندوق',
      region: 'Thiès',
      bio: p.gouvernance.bureau.treasurer.bio,
      initiales: 'OD',
    },
    {
      nom: 'MBACKÉ',
      prenom: 'Serigne',
      role: p.gouvernance.bureau.spiritualAdvisor.role,
      roleAr: 'المستشار الروحي',
      region: 'Diourbel',
      bio: p.gouvernance.bureau.spiritualAdvisor.bio,
      initiales: 'SM',
    },
    {
      nom: 'FAYE',
      prenom: 'Mamadou',
      role: p.gouvernance.bureau.trainingHead.role,
      roleAr: 'مسؤول التكوين',
      region: 'Kaolack',
      bio: p.gouvernance.bureau.trainingHead.bio,
      initiales: 'MF',
    },
  ];

  const COMMISSIONS: Commission[] = [
    {
      icon: Award,
      name: p.gouvernance.commissions.fatwa.name,
      nameAr: 'لجنة الفتوى',
      members: 12,
      desc: p.gouvernance.commissions.fatwa.desc,
    },
    {
      icon: Users,
      name: p.gouvernance.commissions.formation.name,
      nameAr: 'لجنة التكوين',
      members: 7,
      desc: p.gouvernance.commissions.formation.desc,
    },
    {
      icon: Building,
      name: p.gouvernance.commissions.communication.name,
      nameAr: 'لجنة التواصل',
      members: 5,
      desc: p.gouvernance.commissions.communication.desc,
    },
    {
      icon: Crown,
      name: p.gouvernance.commissions.social.name,
      nameAr: 'لجنة الشؤون الاجتماعية',
      members: 9,
      desc: p.gouvernance.commissions.social.desc,
    },
  ];

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
            {p.gouvernance.sectionTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            {p.gouvernance.sectionTitle}
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">&#10022;</div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            {p.gouvernance.sectionDesc}
          </p>
        </motion.div>

        {/* Bureau National grid */}
        <div className="mb-16">
          <h3 className="text-lg font-bold text-lips-green-dark mb-6 flex items-center gap-2">
            <Crown className="h-5 w-5 text-lips-gold" />
            {p.gouvernance.bureauTitle}
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
            {p.gouvernance.commissionsTitle}
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
                      <span className="text-[10px] text-muted-foreground">{commission.members} {p.gouvernance.membersSuffix}</span>
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
