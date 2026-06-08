'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Crown, Users, Building, Award, ChevronRight, BookOpen, Handshake, Mic, Headphones } from 'lucide-react';
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
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

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

  const displayLeaders = leaders;
  const displayCommissions = commissions;

  return (
    <section
      ref={sectionRef}
      id="gouvernance"
      className="py-16 sm:py-24 lg:py-32 bg-muted/20 relative"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lips-gold/10 border border-lips-gold/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-lips-gold animate-pulse" />
            <span className="text-xs font-bold text-lips-gold tracking-widest uppercase">
              {p.gouvernance.sectionTag}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
            {p.gouvernance.sectionTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {p.gouvernance.sectionDesc}
          </p>
        </motion.div>

        {/* Bureau National */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lips-gold to-[#C9962A] flex items-center justify-center shadow-lg shadow-lips-gold/20">
              <Crown className="h-6 w-6 text-[#0A2E17]" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              {p.gouvernance.bureauTitle}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayLeaders.length === 0 && loaded ? (
              <div className="col-span-3 text-center py-16 text-muted-foreground">
                <Crown className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Les membres du Bureau National seront affichés ici.</p>
              </div>
            ) : displayLeaders.map((leader, index) => {
              const initials = leader.initiales || `${leader.prenom[0]}${leader.nom[0]}`;
              return (
                <motion.div
                  key={leader.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="group bg-card rounded-[2rem] p-6 shadow-md border border-border/50 hover:shadow-2xl hover:shadow-lips-gold/10 hover:border-lips-gold/30 transition-all duration-500 h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Crown className="h-24 w-24 -mt-10 -mr-10 text-lips-gold" />
                    </div>
                    
                    <div className="flex items-center gap-5 mb-5 relative z-10">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0A2E17] to-lips-green flex items-center justify-center shrink-0 shadow-lg border-2 border-lips-gold/20 group-hover:scale-110 transition-transform duration-500">
                        <span className="text-lips-gold font-bold text-xl">{initials}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-lg mb-1">
                          {leader.prenom} <span className="uppercase">{leader.nom}</span>
                        </h4>
                        <Badge className="bg-lips-gold/10 text-lips-gold hover:bg-lips-gold/20 border-lips-gold/20 shadow-none font-bold">
                          {leader.role}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      {leader.roleAr && (
                        <div className="font-arabic text-lips-gold text-lg mb-3 block">
                          {leader.roleAr}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                        {leader.bio || ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Commissions */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lips-emerald to-emerald-400 flex items-center justify-center shadow-lg shadow-lips-emerald/20">
              <Building className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              {p.gouvernance.commissionsTitle}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayCommissions.length === 0 && loaded ? (
              <div className="col-span-4 text-center py-10 text-muted-foreground">
                <Building className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Les commissions seront affichées ici.</p>
              </div>
            ) : displayCommissions.map((commission, index) => {
              const IconComp = ICON_MAP[commission.icon || ''] || Award;
              return (
                <motion.div
                  key={commission.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="group bg-card rounded-3xl p-6 shadow-sm border border-border/50 hover:shadow-xl hover:border-lips-emerald/30 transition-all duration-300 cursor-pointer h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-lips-emerald/10 flex items-center justify-center group-hover:bg-lips-emerald group-hover:text-white transition-colors duration-300 text-lips-emerald">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground px-3 py-1 rounded-full bg-muted">
                        {commission.members} {p.gouvernance.membersSuffix}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-foreground mb-1 group-hover:text-lips-emerald transition-colors">
                      {commission.nom}
                    </h4>
                    {commission.nomAr && (
                      <span className="font-arabic text-sm text-lips-emerald mb-3">
                        {commission.nomAr}
                      </span>
                    )}
                    
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                      {commission.desc || ''}
                    </p>
                    
                    <div className="flex items-center text-sm font-bold text-lips-emerald mt-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      Explorer <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
