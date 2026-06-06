'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FileText,
  BookOpen,
  GraduationCap,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PUBLICATION_CATEGORIES = [
  {
    icon: FileText,
    title: 'Communiqués',
    titleAr: 'بيانات',
    description:
      'Positions officielles et déclarations de la LIPS sur les questions sociétales, religieuses et communautaires touchant la nation sénégalaise.',
    count: '24',
    color: 'bg-lips-green/10 text-lips-green',
  },
  {
    icon: Scale,
    title: 'Fatwas',
    titleAr: 'فتاوى',
    description:
      'Avis juridiques islamiques délivrés par le Conseil des Oulémas sur les questions de fiqh, de culte et de vie quotidienne des musulmans.',
    count: '86',
    color: 'bg-lips-gold/10 text-lips-gold',
  },
  {
    icon: GraduationCap,
    title: 'Cours & Formations',
    titleAr: 'دروس وتكوينات',
    description:
      'Programmes de formation continue pour les imams et prédicateurs, couvrant les sciences islamiques, la communication et la gestion communautaire.',
    count: '120+',
    color: 'bg-lips-emerald/10 text-lips-emerald',
  },
  {
    icon: BookOpen,
    title: 'Articles & Réflexions',
    titleAr: 'مقالات وتأملات',
    description:
      'Publications éducatives et spirituelles pour la communauté, abordant la daawa, l\'aqida et les enjeux contemporains à la lumière de l\'Islam.',
    count: '45',
    color: 'bg-lips-green-light/10 text-lips-green-light',
  },
];

export default function PublicationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="publications"
      className="py-20 lg:py-28 bg-white relative"
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
            Ressources
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            Publications & Formations
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Accédez aux ressources pédagogiques, aux avis juridiques et aux
            communiqués officiels de la LIPS pour nourrir votre pratique
            religieuse et votre engagement communautaire.
          </p>
        </motion.div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PUBLICATION_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20 border-border/50 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center shrink-0`}
                    >
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-lips-green-dark">
                            {category.title}
                          </h3>
                          <span className="font-arabic text-xs text-lips-gold">
                            {category.titleAr}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-lips-green font-medium mt-3 group-hover:gap-2 transition-all">
                        Explorer <ArrowRight className="h-3 w-3" />
                      </div>
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
