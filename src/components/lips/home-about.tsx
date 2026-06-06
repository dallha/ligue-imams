'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Target,
  Handshake,
  GraduationCap,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const PILLARS_PREVIEW = [
  {
    icon: Target,
    title: 'Unité Institutionnelle',
    titleAr: 'الوحدة المؤسسية',
    description:
      'Fédérer l\'ensemble des imams et prédicateurs du Sénégal au sein d\'un cadre institutionnel unique, porteur d\'une vision commune.',
  },
  {
    icon: GraduationCap,
    title: 'Formation Continue',
    titleAr: 'التكوين المستمر',
    description:
      'Offrir aux imams un programme de formation continue en sciences islamiques, communication et gestion communautaire.',
  },
  {
    icon: Scale,
    title: 'Paix Sociale',
    titleAr: 'السلم الاجتماعي',
    description:
      'Contribuer activement au maintien de la paix sociale et à la promotion du dialogue interreligieux au Sénégal.',
  },
  {
    icon: Handshake,
    title: 'Représentation Nationale',
    titleAr: 'التمثيل الوطني',
    description:
      'Porter la voix des imams auprès des autorités publiques, des institutions et des partenaires internationaux.',
  },
];

export default function HomeAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="apropos"
      className="py-20 lg:py-28 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-lips-cream/50 to-white" />
      <div className="absolute inset-0 islamic-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            À Propos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            Les Piliers de la LIPS
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Six piliers stratégiques guident l&apos;action de la LIPS pour
            bâtir une institution forte, légitime et au service de la communauté
            musulmane du Sénégal.
          </p>
        </motion.div>

        {/* Pillars grid — only 4 preview items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS_PREVIEW.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white border border-border/50 rounded-xl p-5 hover:shadow-xl hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-lips-green/10 flex items-center justify-center group-hover:bg-lips-green/20 transition-colors">
                  <pillar.icon className="h-5 w-5 text-lips-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-lips-green-dark text-sm">
                    {pillar.title}
                  </h3>
                  <span className="font-arabic text-xs text-lips-gold">
                    {pillar.titleAr}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Link to full page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-10"
        >
          <Button asChild variant="outline" className="border-lips-green/30 text-lips-green hover:bg-lips-green/5">
            <Link href="/a-propos">
              Découvrir notre mission, gouvernance et carte membre
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
