'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/lips/i18n/language-context';

interface EventItem {
  id: number;
  titre: string;
  titreAr: string;
  date: string;
  heure: string;
  lieu: string;
  region: string;
  type: string;
  typeAr: string;
  description: string;
  places?: number;
  inscrits?: number;
}

const EVENEMENTS: EventItem[] = [
  {
    id: 1,
    titre: 'Séminaire National des Imams',
    titreAr: 'الندوة الوطنية للأئمة',
    date: '15 Juin 2026',
    heure: '09:00 - 17:00',
    lieu: 'Centre International du Grand Dakar',
    region: 'DKR',
    type: 'Séminaire',
    typeAr: 'ندوة',
    description: 'Grand séminaire annuel réunissant les délégués des 14 régions pour dresser le bilan de l\'année écoulée et définir les orientations stratégiques pour la saison à venir.',
    places: 500,
    inscrits: 342,
  },
  {
    id: 2,
    titre: 'Formation Régionale : Fiqh des Funérailles',
    titreAr: 'تكوين جهوي: فقه الجنائز',
    date: '22 Juin 2026',
    heure: '08:30 - 16:00',
    lieu: 'Mosquée Centrale de Thiès',
    region: 'THS',
    type: 'Formation',
    typeAr: 'تكوين',
    description: 'Cycle de formation continue dédié au fiqh des funérailles : lavage, enveloppement, prière et inhumation, conformément à l\'école malikite.',
    places: 120,
    inscrits: 87,
  },
  {
    id: 3,
    titre: 'Colloque : Islam et Citoyenneté',
    titreAr: 'ملتقى: الإسلام والمواطنة',
    date: '5 Juillet 2026',
    heure: '09:00 - 18:00',
    lieu: 'Université Cheikh Anta Diop',
    region: 'DKR',
    type: 'Colloque',
    typeAr: 'ملتقى',
    description: 'Colloque académique en partenariat avec l\'UCAD explorant les relations entre l\'exercice religieux et la citoyenneté responsable dans un État laique.',
    places: 300,
    inscrits: 156,
  },
  {
    id: 4,
    titre: 'Journée Portes Ouvertes — Délégation de Kolda',
    titreAr: 'يوم مفتوح — وفد كولدا',
    date: '12 Juillet 2026',
    heure: '10:00 - 16:00',
    lieu: 'Place de l\'Indépendance, Kolda',
    region: 'KLC',
    type: 'Portes Ouvertes',
    typeAr: 'أبواب مفتوحة',
    description: 'Journée de rencontre entre la LIPS et les communautés locales de la région de Kolda pour présenter les missions, services et avantages de l\'adhésion.',
    places: 200,
    inscrits: 45,
  },
];

const TYPE_STYLES: Record<string, string> = {
  Séminaire: 'bg-lips-green/10 text-lips-green',
  Formation: 'bg-lips-emerald/10 text-lips-emerald',
  Colloque: 'bg-purple-500/10 text-purple-600',
  'Portes Ouvertes': 'bg-lips-gold/10 text-lips-gold',
};

export default function EvenementsSection() {
  const { p, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="evenements"
      className="py-12 sm:py-20 lg:py-28 bg-lips-cream relative"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
              {p.evenements.sectionTag}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-2">
              {p.evenements.sectionTitle}
            </h2>
            <p className="text-muted-foreground max-w-xl text-sm">
              {p.evenements.sectionDesc}
            </p>
          </div>
          <Button variant="outline" className="border-lips-green/30 text-lips-green hover:bg-lips-green/5 mt-4 md:mt-0">
            {p.evenements.fullCalendar}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>

        {/* Events grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {EVENEMENTS.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="group hover:shadow-lg hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20 border-border/50 h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Date badge */}
                    <div className="bg-lips-green/5 rounded-xl p-3 text-center shrink-0 min-w-[60px]">
                      <div className="text-lg font-bold text-lips-green leading-none">
                        {event.date.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase mt-1">
                        {event.date.split(' ')[1]}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge className={`${TYPE_STYLES[event.type] || 'bg-gray-100 text-gray-600'} text-[10px]`}>
                          {isRTL ? event.typeAr : event.type}
                        </Badge>
                      </div>

                      <h4 className="font-bold text-lips-green-dark text-lg group-hover:text-lips-green transition-colors leading-snug">
                        {isRTL && event.titreAr ? event.titreAr : event.titre}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                        {event.description.substring(0, 100)}...
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.heure}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {event.lieu}
                        </span>
                        {event.places && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.inscrits}/{event.places} {p.evenements.registeredSuffix}
                          </span>
                        )}
                      </div>

                      {/* Progress bar for registrations */}
                      {event.places && event.inscrits && (
                        <div className="mt-3">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-lips-green to-lips-emerald rounded-full transition-all"
                              style={{ width: `${(event.inscrits / event.places) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
