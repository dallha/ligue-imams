'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Crown, Users, Building, Award, ChevronRight, BookOpen, Handshake, Mic, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/lips/i18n/language-context';

interface Leader {
  id: number;
  nom: string;
  prenom: string;
  role: string;
  roleAr: string | null;
  region: string | null;
  bio: string | null;
  initiales: string | null;
  photo: string | null;
}

interface CommissionItem {
  id: number;
  nom: string;
  nomAr: string | null;
  members: number;
  desc: string | null;
  icon: string | null;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Award, Users, Building, Crown, BookOpen, Handshake, Mic, Headphones,
};

export default function GouvernanceSection() {
  const { p } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [commissions, setCommissions] = useState<CommissionItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/bureau').then(r => r.json()),
      fetch('/api/public/commissions').then(r => r.json()),
    ]).then(([bureauData, commissionData]) => {
      if (bureauData.data?.length > 0) setLeaders(bureauData.data);
      if (commissionData.data?.length > 0) setCommissions(commissionData.data);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  // Fallback to i18n if DB is empty
  const displayLeaders = leaders.length > 0 ? leaders : [
    { id: 1, nom: 'TRAORÉ', prenom: 'Amadou', role: p.gouvernance.bureau.president.role, roleAr: 'الرئيس الوطني', region: 'Dakar', bio: p.gouvernance.bureau.president.bio, initiales: 'AT', photo: null },
    { id: 2, nom: 'BALDE', prenom: 'Mouhammadou', role: p.gouvernance.bureau.vicePresident.role, roleAr: 'نائب الرئيس', region: 'Tambacounda', bio: p.gouvernance.bureau.vicePresident.bio, initiales: 'MB', photo: null },
    { id: 3, nom: 'SOW', prenom: 'Ibrahima', role: p.gouvernance.bureau.secretary.role, roleAr: 'الأمين العام', region: 'Saint-Louis', bio: p.gouvernance.bureau.secretary.bio, initiales: 'IS', photo: null },
    { id: 4, nom: 'DIAKHATE', prenom: 'Ousmane', role: p.gouvernance.bureau.treasurer.role, roleAr: 'أمين الصندوق', region: 'Thiès', bio: p.gouvernance.bureau.treasurer.bio, initiales: 'OD', photo: null },
    { id: 5, nom: 'MBACKÉ', prenom: 'Serigne', role: p.gouvernance.bureau.spiritualAdvisor.role, roleAr: 'المستشار الروحي', region: 'Diourbel', bio: p.gouvernance.bureau.spiritualAdvisor.bio, initiales: 'SM', photo: null },
    { id: 6, nom: 'FAYE', prenom: 'Mamadou', role: p.gouvernance.bureau.trainingHead.role, roleAr: 'مسؤول التكوين', region: 'Kaolack', bio: p.gouvernance.bureau.trainingHead.bio, initiales: 'MF', photo: null },
  ];

  const displayCommissions = commissions.length > 0 ? commissions : [
    { id: 1, nom: p.gouvernance.commissions.fatwa.name, nomAr: 'لجنة الفتوى', members: 12, desc: p.gouvernance.commissions.fatwa.desc, icon: 'Award' },
    { id: 2, nom: p.gouvernance.commissions.formation.name, nomAr: 'لجنة التكوين', members: 7, desc: p.gouvernance.commissions.formation.desc, icon: 'Users' },
    { id: 3, nom: p.gouvernance.commissions.communication.name, nomAr: 'لجنة التواصل', members: 5, desc: p.gouvernance.commissions.communication.desc, icon: 'Building' },
    { id: 4, nom: p.gouvernance.commissions.social.name, nomAr: 'لجنة الشؤون الاجتماعية', members: 9, desc: p.gouvernance.commissions.social.desc, icon: 'Crown' },
  ];

  return (
    <section
      ref={sectionRef}
      id="gouvernance"
      className="py-12 sm:py-20 lg:py-28 bg-white dark:bg-card relative"
    >
      <div className="max-w-7xl mx-auto px-4">
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

        {/* Bureau National */}
        <div className="mb-16">
          <h3 className="text-lg font-bold text-lips-green-dark mb-6 flex items-center gap-2">
            <Crown className="h-5 w-5 text-lips-gold" />
            {p.gouvernance.bureauTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayLeaders.map((leader, index) => {
              const initials = leader.initiales || `${leader.prenom[0]}${leader.nom[0]}`;
              return (
                <motion.div
                  key={leader.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Card className="group hover:shadow-lg hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20 border-border/50 h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lips-green to-lips-emerald flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                          <span className="text-white font-bold text-lg">{initials}</span>
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
                          {leader.roleAr && (
                            <span className="font-arabic text-[10px] text-lips-gold">{leader.roleAr}</span>
                          )}
                          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                            {leader.bio || ''}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Commissions */}
        <div>
          <h3 className="text-lg font-bold text-lips-green-dark mb-6 flex items-center gap-2">
            <Building className="h-5 w-5 text-lips-gold" />
            {p.gouvernance.commissionsTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayCommissions.map((commission, index) => {
              const IconComp = ICON_MAP[commission.icon || ''] || Award;
              return (
                <motion.div
                  key={commission.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                >
                  <Card className="group hover:shadow-md hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20 border-border/50 cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-lips-gold/10 flex items-center justify-center">
                          <IconComp className="h-5 w-5 text-lips-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lips-green-dark text-sm">{commission.nom}</h4>
                          {commission.nomAr && (
                            <span className="font-arabic text-[10px] text-lips-gold">{commission.nomAr}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{commission.desc || ''}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-muted-foreground">{commission.members} {p.gouvernance.membersSuffix}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-lips-green group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
