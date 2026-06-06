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
import { useLanguage } from '@/lib/lips/i18n/language-context';

export default function PublicationsSection() {
  const { p } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const PUBLICATION_CATEGORIES = [
    {
      icon: FileText,
      title: p.publications.categories.communiques.title,
      titleAr: 'بيانات',
      description: p.publications.categories.communiques.desc,
      count: '24',
      color: 'bg-lips-green/10 text-lips-green',
    },
    {
      icon: Scale,
      title: p.publications.categories.fatwas.title,
      titleAr: 'فتاوى',
      description: p.publications.categories.fatwas.desc,
      count: '86',
      color: 'bg-lips-gold/10 text-lips-gold',
    },
    {
      icon: GraduationCap,
      title: p.publications.categories.courses.title,
      titleAr: 'دروس وتكوينات',
      description: p.publications.categories.courses.desc,
      count: '120+',
      color: 'bg-lips-emerald/10 text-lips-emerald',
    },
    {
      icon: BookOpen,
      title: p.publications.categories.articles.title,
      titleAr: 'مقالات وتأملات',
      description: p.publications.categories.articles.desc,
      count: '45',
      color: 'bg-lips-green-light/10 text-lips-green-light',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="publications"
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
            {p.publications.sectionTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            {p.publications.sectionTitle}
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            {p.publications.sectionDesc}
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
                        {p.publications.explore} <ArrowRight className="h-3 w-3" />
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
