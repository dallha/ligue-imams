'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Calendar,
  Clock,
  ChevronRight,
  ArrowRight,
  Newspaper,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/lib/lips/i18n/language-context';

interface Article {
  id: number;
  titre: string;
  categorie: string;
  date: string;
  auteur: string;
  type: 'communique' | 'fatwa' | 'article' | 'evenement';
}

const LATEST_ARTICLES: Article[] = [
  {
    id: 1,
    titre: 'Communiqué : Position de la LIPS sur le dialogue interreligieux',
    categorie: 'Communiqué',
    date: '4 Juin 2026',
    auteur: 'Bureau National',
    type: 'communique',
  },
  {
    id: 2,
    titre: 'Fatwa : Conditions de la prière du Vendredi en voyage',
    categorie: 'Fatwa',
    date: '1 Juin 2026',
    auteur: 'Commission Fatwa',
    type: 'fatwa',
  },
  {
    id: 3,
    titre: 'Formation régionale à Thiès — 15 au 18 Juin',
    categorie: 'Formation',
    date: '29 Mai 2026',
    auteur: 'Commission Formation',
    type: 'evenement',
  },
];

const TYPE_COLORS: Record<string, string> = {
  communique: 'bg-red-500/10 text-red-600',
  fatwa: 'bg-purple-500/10 text-purple-600',
  article: 'bg-blue-500/10 text-blue-600',
  evenement: 'bg-green-500/10 text-green-600',
};

export default function HomeActualites() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="actualites"
      className="py-12 sm:py-20 lg:py-28 bg-lips-cream relative overflow-hidden"
    >
      <div className="absolute inset-0 islamic-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10"
        >
          <div>
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
              {t.actualites.sectionTag}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-2">
              {t.actualites.sectionTitle}
            </h2>
            <p className="text-muted-foreground max-w-xl text-sm">
              {t.actualites.sectionDesc}
            </p>
          </div>
          <Button asChild variant="outline" className="border-lips-green/30 text-lips-green hover:bg-lips-green/5 mt-4 md:mt-0">
            <Link href="/actualites">
              {t.actualites.allNews}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Articles grid — 3 latest */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {LATEST_ARTICLES.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="group hover:shadow-lg hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20 cursor-pointer h-full border-border/50">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`${TYPE_COLORS[article.type]} text-[10px]`}>
                      {article.categorie}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-lips-green-dark text-sm mb-2 group-hover:text-lips-green transition-colors leading-snug flex-1">
                    {article.titre}
                  </h4>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {article.date}
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-lips-green group-hover:translate-x-0.5 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick link bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { label: t.actualites.communiques, href: '/actualites' },
            { label: t.actualites.fatwas, href: '/actualites' },
            { label: t.actualites.events, href: '/actualites' },
            { label: t.actualites.gallery, href: '/actualites' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 border border-border/50 text-xs font-medium text-muted-foreground hover:text-lips-green hover:border-lips-green/30 transition-colors"
            >
              <Newspaper className="h-3 w-3" />
              {link.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
