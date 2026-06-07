'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Clock,
  ChevronRight,
  ArrowRight,
  Newspaper,
  CalendarDays,
  FileText,
  Video,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/lips/i18n/language-context';
import { cn } from '@/lib/utils';

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  communique: { color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', icon: FileText },
  fatwa: { color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', icon: BookOpen },
  evenement: { color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CalendarDays },
  article: { color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', icon: Newspaper },
};

function BookOpen(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}

interface Article {
  id: number;
  titre: string;
  titreAr?: string;
  categorie: string;
  date: string;
  auteur: string;
  type: string;
  image: string;
}

export default function HomeActualites() {
  const { t, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [dbArticles, setDbArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/public/contenus?limit=3')
      .then(r => r.json())
      .then(data => {
        if (data.data?.length > 0) {
          const typeMap: Record<string, string> = {
            COMMUNIQUE: 'communique', FATWA: 'fatwa', ARTICLE: 'article', EVENEMENT: 'evenement', COURS: 'article', SEMINAIRE: 'evenement',
          };
          const catMap: Record<string, string> = {
            COMMUNIQUE: 'Communiqué', FATWA: 'Fatwa', ARTICLE: 'Article', EVENEMENT: 'Événement', COURS: 'Cours', SEMINAIRE: 'Séminaire',
          };
          const articles = data.data.map((c: any) => ({
            id: c.id,
            titre: c.titre,
            titreAr: c.titreAr,
            categorie: catMap[c.type] || c.type,
            date: new Date(c.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
            auteur: 'LIPS',
            type: typeMap[c.type] || 'article',
            image: c.imageUrl || '/hero-bg.jpg',
          }));
          setDbArticles(articles);
        }
      })
      .catch(() => {});
  }, []);

  const FALLBACK_ARTICLES: Article[] = [
    {
      id: 1,
      titre: t.actualites.art1Title,
      categorie: t.actualites.catCommunique,
      date: t.actualites.art1Date,
      auteur: t.actualites.art1Author,
      type: 'communique',
      image: '/hero-bg.jpg',
    },
    {
      id: 2,
      titre: t.actualites.art2Title,
      categorie: t.actualites.catFatwa,
      date: t.actualites.art2Date,
      auteur: t.actualites.art2Author,
      type: 'fatwa',
      image: '/mosquee-exterieur.jpg',
    },
    {
      id: 3,
      titre: t.actualites.art3Title,
      categorie: t.actualites.catFormation,
      date: t.actualites.art3Date,
      auteur: t.actualites.art3Author,
      type: 'evenement',
      image: '/mosquee-hero.jpg',
    },
  ];

  const LATEST_ARTICLES = dbArticles.length > 0 ? dbArticles.slice(0, 3) : FALLBACK_ARTICLES;

  return (
    <section
      ref={sectionRef}
      id="actualites"
      className="py-24 lg:py-32 bg-lips-cream relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-lips-cream/20 via-background to-muted/20" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lips-gold/10 border border-lips-gold/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-lips-gold animate-pulse" />
              <span className="text-xs font-bold text-lips-gold tracking-widest uppercase">
                {t.actualites.sectionTag}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {t.actualites.sectionTitle}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t.actualites.sectionDesc}
            </p>
          </div>
          <Button asChild size="lg" className="bg-foreground text-background hover:bg-lips-green transition-colors rounded-full px-8 shadow-xl shadow-black/5">
            <Link href="/actualites">
              {t.actualites.allNews}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LATEST_ARTICLES.map((article, index) => {
            const config = TYPE_CONFIG[article.type] || TYPE_CONFIG.communique;
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group h-full"
              >
                <Link href={`/actualites/${article.id}`} className="block h-full">
                  <Card className="h-full overflow-hidden bg-card border-border/50 hover:shadow-2xl hover:border-lips-green/30 transition-all duration-500 rounded-[2rem] hover:-translate-y-2 flex flex-col">
                    {/* Image Header */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-lips-green-dark/20 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-500" />
                      <Image 
                        src={article.image} 
                        alt={article.titre} 
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md border", config.bg, config.color)}>
                          <div className="flex items-center gap-1.5">
                            <config.icon className="h-3.5 w-3.5" />
                            {article.categorie}
                          </div>
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-8 flex flex-col flex-1">
                      <h4 className="font-bold text-xl text-foreground mb-4 group-hover:text-lips-green transition-colors leading-snug flex-1">
                        {isRTL && article.titreAr ? article.titreAr : article.titre}
                      </h4>
                      
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Clock className="h-4 w-4 text-lips-gold" />
                          {article.date}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-lips-green group-hover:text-white transition-colors text-muted-foreground">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick link bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-4"
        >
          {[
            { label: t.actualites.communiques, href: '/actualites', icon: FileText },
            { label: t.actualites.fatwas, href: '/actualites', icon: BookOpen },
            { label: t.actualites.events, href: '/actualites', icon: CalendarDays },
            { label: t.actualites.gallery, href: '/actualites', icon: Video },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card shadow-sm border border-border/50 text-sm font-bold text-muted-foreground hover:text-lips-green hover:border-lips-green/30 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
