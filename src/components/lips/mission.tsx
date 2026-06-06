'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Target,
  Handshake,
  GraduationCap,
  Scale,
  Globe,
  Heart,
} from 'lucide-react';

const PILLARS = [
  {
    icon: Target,
    title: 'Unité Institutionnelle',
    titleAr: 'الوحدة المؤسسية',
    description:
      'Fédérer l\'ensemble des imams et prédicateurs du Sénégal au sein d\'un cadre institutionnel unique, porteur d\'une vision commune et garante de la cohésion de la communauté musulmane dans toute sa diversité.',
  },
  {
    icon: GraduationCap,
    title: 'Formation Continue',
    titleAr: 'التكوين المستمر',
    description:
      'Offrir aux imams et prédicateurs un programme de formation continue en sciences islamiques, en communication et en gestion communautaire, afin de renforcer leurs compétences et la qualité de leur accompagnement spirituel.',
  },
  {
    icon: Scale,
    title: 'Paix Sociale',
    titleAr: 'السلم الاجتماعي',
    description:
      'Contribuer activement au maintien de la paix sociale et à la promotion du dialogue interreligieux, en s\'érigeant comme acteur de référence dans la résolution des tensions communautaires et la prévention de l\'extrémisme.',
  },
  {
    icon: Handshake,
    title: 'Représentation Nationale',
    titleAr: 'التمثيل الوطني',
    description:
      'Porter la voix des imams auprès des autorités publiques, des institutions et des partenaires internationaux, pour faire valoir les droits et la dignité de la fonction d\'imam dans la société sénégalaise.',
  },
  {
    icon: Globe,
    title: 'Souveraineté Spirituelle',
    titleAr: 'السيادة الروحية',
    description:
      'Préserver l\'indépendance et la souveraineté de l\'institution religieuse face aux influences extérieures, en consolidant un Islam modéré, ancré dans la tradition malikite et la confrérie tidjane du Sénégal.',
  },
  {
    icon: Heart,
    title: 'Solidarité Communautaire',
    titleAr: 'التضامن المجتمعي',
    description:
      'Mettre en place des mécanismes de solidarité entre les membres, incluant la couverture sociale, l\'assistance médicale et l\'accompagnement familial, pour améliorer les conditions de vie des imams et de leurs proches.',
  },
];

export default function MissionSection() {
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
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            Notre Mission
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

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white border border-border/50 rounded-xl p-6 hover:shadow-xl hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20"
            >
              <div className="flex items-center gap-3 mb-4">
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
      </div>
    </section>
  );
}
