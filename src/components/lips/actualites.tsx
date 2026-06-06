'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FileText,
  Calendar,
  ArrowRight,
  Clock,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Article {
  id: number;
  titre: string;
  titreAr?: string;
  extrait: string;
  categorie: string;
  categorieAr: string;
  date: string;
  auteur: string;
  lu: boolean;
  type: 'communique' | 'fatwa' | 'article' | 'evenement';
}

const ARTICLES: Article[] = [
  {
    id: 1,
    titre: 'Communiqué : Position de la LIPS sur le dialogue interreligieux',
    titreAr: 'بيان: موقف الرابطة حول الحوار بين الأديان',
    extrait: 'La Ligue des Imams et Prédicateurs du Sénégal réaffirme son engagement en faveur du dialogue interreligieux et appelle l\'ensemble des communautés de foi à privilégier la concertation et le respect mutuel dans un climat de paix et de fraternité.',
    categorie: 'Communiqué',
    categorieAr: 'بيان',
    date: '4 Juin 2026',
    auteur: 'Bureau National',
    lu: false,
    type: 'communique',
  },
  {
    id: 2,
    titre: 'Fatwa : Conditions de la prière du Vendredi en voyage',
    titreAr: 'فتوى: شروط صلاة الجمعة في السفر',
    extrait: 'La Commission des Fatwas de la LIPS précise les conditions dans lesquelles le voyageur peut accomplir la prière du Vendredi, conformément à l\'école malikite et aux références jurisprudentielles validées.',
    categorie: 'Fatwa',
    categorieAr: 'فتوى',
    date: '1 Juin 2026',
    auteur: 'Commission Fatwa',
    lu: false,
    type: 'fatwa',
  },
  {
    id: 3,
    titre: 'Renforcement des capacités : Formation régionale à Thiès',
    titreAr: 'بناء القدرات: تكوين جهوي في ثيس',
    extrait: 'La LIPS organise du 15 au 18 juin prochain une session de formation continue au profit des imams et prédicateurs de la région de Thiès, autour du thème "L\'imam face aux défis de la modernité".',
    categorie: 'Formation',
    categorieAr: 'تكوين',
    date: '29 Mai 2026',
    auteur: 'Commission Formation',
    lu: true,
    type: 'evenement',
  },
  {
    id: 4,
    titre: 'Ramadan 2026 : Recommandations de la LIPS aux imams',
    titreAr: 'رمضان ٢٠٢٦: توصيات الرابطة للأئمة',
    extrait: 'À l\'approche du mois sacré de Ramadan, la LIPS adresse ses recommandations aux imams du Sénégal pour l\'organisation des prières de tarawih, la gestion des collectes de zakat et l\'accompagnement spirituel des fidèles.',
    categorie: 'Article',
    categorieAr: 'مقال',
    date: '25 Mai 2026',
    auteur: 'Conseil Spirituel',
    lu: true,
    type: 'article',
  },
  {
    id: 5,
    titre: 'Assemblée Générale Extraordinaire — Décisions et résolutions',
    titreAr: 'الجمعية العامة الاستثنائية — القرارات وال توصيات',
    extrait: 'L\'Assemblée Générale Extraordinaire tenue le 20 mai 2026 a adopté à l\'unanimité les résolutions portant réforme du système d\'adhésion, création de la carte membre numérique et ouverture de 3 nouvelles délégations régionales.',
    categorie: 'Communiqué',
    categorieAr: 'بيان',
    date: '22 Mai 2026',
    auteur: 'Secrétariat Général',
    lu: true,
    type: 'communique',
  },
  {
    id: 6,
    titre: 'Fatwa : Répartition de l\'héritage dans le contexte sénégalais',
    titreAr: 'فتوى: توزيع الميراث في السياق السنغالي',
    extrait: 'La Commission des Fatwas clarifie les règles de succession islamique dans le contexte sénégalais, en tenant compte du droit coutumier et des dispositions du Code de la Famille, dans le respect des préceptes de la Charia.',
    categorie: 'Fatwa',
    categorieAr: 'فتوى',
    date: '18 Mai 2026',
    auteur: 'Commission Fatwa',
    lu: true,
    type: 'fatwa',
  },
];

const TYPE_COLORS: Record<string, string> = {
  communique: 'bg-red-500/10 text-red-600',
  fatwa: 'bg-purple-500/10 text-purple-600',
  article: 'bg-blue-500/10 text-blue-600',
  evenement: 'bg-green-500/10 text-green-600',
};

export default function ActualitesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const featured = ARTICLES[0];
  const rest = ARTICLES.slice(1);

  return (
    <section
      ref={sectionRef}
      id="actualites"
      className="py-20 lg:py-28 bg-lips-cream relative overflow-hidden"
    >
      <div className="absolute inset-0 islamic-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
              Actualités
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-2">
              Communiqués & Publications
            </h2>
            <p className="text-muted-foreground max-w-xl text-sm">
              Restez informé des positions officielles, avis juridiques, formations et annonces de la LIPS.
            </p>
          </div>
          <Button variant="outline" className="border-lips-green/30 text-lips-green hover:bg-lips-green/5 mt-4 md:mt-0">
            Voir toutes les publications
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>

        {/* Featured article */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-lips-green/20 hover:shadow-xl hover:shadow-lips-green/5 transition-all duration-300 cursor-pointer group overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Left accent */}
                <div className="bg-gradient-to-b from-lips-green to-lips-green-dark p-6 lg:p-8 flex flex-col justify-between text-white">
                  <div>
                    <Badge className={`${TYPE_COLORS[featured.type]} text-xs mb-3`}>
                      {featured.categorie}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-lips-gold transition-colors">
                      {featured.titre}
                    </h3>
                    {featured.titreAr && (
                      <p className="font-arabic text-sm text-white/50 mb-3">{featured.titreAr}</p>
                    )}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {featured.extrait}
                  </p>
                </div>
                {/* Right info */}
                <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {featured.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        {featured.auteur}
                      </span>
                      {!featured.lu && (
                        <Badge className="bg-red-500 text-white text-[10px]">Nouveau</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-lips-green text-sm font-medium group-hover:gap-2.5 transition-all">
                      Lire le communiqué complet <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">dialogue interreligieux, paix sociale, communiqué officiel</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
            >
              <Card className="group hover:shadow-lg hover:shadow-lips-green/5 transition-all duration-300 hover:border-lips-green/20 cursor-pointer h-full border-border/50">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`${TYPE_COLORS[article.type]} text-[10px]`}>
                      {article.categorie}
                    </Badge>
                    {!article.lu && (
                      <Badge className="bg-red-500 text-white text-[10px]">Nouveau</Badge>
                    )}
                  </div>
                  <h4 className="font-semibold text-lips-green-dark text-sm mb-1.5 group-hover:text-lips-green transition-colors leading-snug">
                    {article.titre}
                  </h4>
                  {article.titreAr && (
                    <span className="font-arabic text-[10px] text-lips-gold mb-2">{article.titreAr}</span>
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3">
                    {article.extrait.substring(0, 120)}...
                  </p>
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
      </div>
    </section>
  );
}
