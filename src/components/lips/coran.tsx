'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Search,
  BookOpen,
  Headphones,
  Globe,
  Mic,
  GraduationCap,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// --- Reciters Data ---
interface Reciter {
  id: number;
  name: string;
  initials: string;
  bio: string;
  gradient: string;
}

const RECITERS: Reciter[] = [
  {
    id: 1,
    name: 'Cheikh Ahmad Tijani Cissé',
    initials: 'AT',
    bio: 'Éminent récitateur tijani, spécialiste de la psalmodie coranique selon la lecture de Warsh.',
    gradient: 'from-lips-green to-lips-emerald',
  },
  {
    id: 2,
    name: 'Imam Ratib Cissé',
    initials: 'RC',
    bio: 'Imam et récitateur renommé de Dakar, connu pour sa belle voix dans la récitation du Coran.',
    gradient: 'from-lips-gold to-amber-600',
  },
  {
    id: 3,
    name: 'Cheikh Moustapha Cissé',
    initials: 'MC',
    bio: 'Récitateur accompli et enseignant de tajwid, formateur d\'imams dans la région de Thiès.',
    gradient: 'from-lips-emerald to-lips-green',
  },
  {
    id: 4,
    name: 'Abdou Karim Diop',
    initials: 'AK',
    bio: 'Récitateur de la communauté mouride, spécialiste des qira\'at et de la tradition orale.',
    gradient: 'from-emerald-600 to-lips-green',
  },
  {
    id: 5,
    name: 'Mouhammadou Bâ',
    initials: 'MB',
    bio: 'Récitateur et imam de la région de Saint-Louis, professeur de coran dans les daaras.',
    gradient: 'from-lips-green-dark to-lips-green',
  },
  {
    id: 6,
    name: 'Serigne Moustapha Sy',
    initials: 'MS',
    bio: 'Récitateur de la communauté tidiane, voix respectée pour la psalmodie lors des grands événements.',
    gradient: 'from-lips-gold to-lips-green',
  },
];

// --- Daily Verses ---
interface DailyVerse {
  arabic: string;
  french: string;
  reference: string;
}

const DAILY_VERSES: DailyVerse[] = [
  {
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    french: 'Au nom d\'Allah, le Tout-Miséricordieux, le Très-Miséricordieux.',
    reference: 'Coran 1:1 — Al-Fatiha',
  },
  {
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    french: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même.',
    reference: 'Coran 2:255 — Ayat al-Kursi',
  },
  {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    french: 'Et quiconque craint Allah, Il lui donnera une issue.',
    reference: 'Coran 65:2 — At-Talaq',
  },
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    french: 'Certes, avec la difficulté vient la facilité.',
    reference: 'Coran 94:6 — Ash-Sharh',
  },
  {
    arabic: 'وَلَذِكْرُ اللَّهِ أَكْبَرُ',
    french: 'Et l\'invocation d\'Allah est certes la plus grande chose.',
    reference: 'Coran 29:45 — Al-Ankabut',
  },
  {
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    french: 'Et dis : « Ô mon Seigneur, augmente mes connaissances. »',
    reference: 'Coran 20:114 — Taha',
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    french: 'Souvenez-vous de Moi, Je me souviendrai de vous. Soyez reconnaissants envers Moi et ne Me reniez pas.',
    reference: 'Coran 2:152 — Al-Baqara',
  },
];

// --- Surah Data (first 5 Juz, abbreviated) ---
interface Surah {
  number: number;
  nameAr: string;
  nameFr: string;
  verses: number;
  juz: number;
  type: 'Makki' | 'Madani';
}

const SURAHS: Surah[] = [
  // Juz 1
  { number: 1, nameAr: 'الفاتحة', nameFr: 'L\'Ouverture', verses: 7, juz: 1, type: 'Makki' },
  { number: 2, nameAr: 'البقرة', nameFr: 'La Vache', verses: 286, juz: 1, type: 'Madani' },
  // Juz 2
  { number: 2, nameAr: 'البقرة', nameFr: 'La Vache (suite)', verses: 286, juz: 2, type: 'Madani' },
  { number: 3, nameAr: 'آل عمران', nameFr: 'La Famille d\'Imran', verses: 200, juz: 2, type: 'Madani' },
  // Juz 3
  { number: 3, nameAr: 'آل عمران', nameFr: 'La Famille d\'Imran (suite)', verses: 200, juz: 3, type: 'Madani' },
  { number: 4, nameAr: 'النساء', nameFr: 'Les Femmes', verses: 176, juz: 3, type: 'Madani' },
  // Juz 4
  { number: 4, nameAr: 'النساء', nameFr: 'Les Femmes (suite)', verses: 176, juz: 4, type: 'Madani' },
  { number: 5, nameAr: 'المائدة', nameFr: 'La Table Servie', verses: 120, juz: 4, type: 'Madani' },
  // Juz 5
  { number: 5, nameAr: 'المائدة', nameFr: 'La Table Servie (suite)', verses: 120, juz: 5, type: 'Madani' },
  { number: 6, nameAr: 'الأنعام', nameFr: 'Les Bestiaux', verses: 165, juz: 5, type: 'Makki' },
  // Additional surahs for richer display
  { number: 7, nameAr: 'الأعراف', nameFr: 'Al-A\'raf', verses: 206, juz: 5, type: 'Makki' },
  { number: 8, nameAr: 'الأنفال', nameFr: 'Le Butin', verses: 75, juz: 5, type: 'Madani' },
  { number: 9, nameAr: 'التوبة', nameFr: 'Le Repentir', verses: 129, juz: 5, type: 'Madani' },
  { number: 10, nameAr: 'يونس', nameFr: 'Jonas', verses: 109, juz: 5, type: 'Makki' },
  { number: 11, nameAr: 'هود', nameFr: 'Hud', verses: 123, juz: 5, type: 'Makki' },
  { number: 12, nameAr: 'يوسف', nameFr: 'Joseph', verses: 111, juz: 5, type: 'Makki' },
  { number: 36, nameAr: 'يس', nameFr: 'Ya-Sin', verses: 83, juz: 5, type: 'Makki' },
  { number: 55, nameAr: 'الرحمن', nameFr: 'Le Tout-Miséricordieux', verses: 78, juz: 5, type: 'Madani' },
  { number: 56, nameAr: 'الواقعة', nameFr: 'L\'Événement', verses: 96, juz: 5, type: 'Makki' },
  { number: 67, nameAr: 'الملك', nameFr: 'La Royauté', verses: 30, juz: 5, type: 'Makki' },
  { number: 78, nameAr: 'النبأ', nameFr: 'La Nouvelle', verses: 40, juz: 5, type: 'Makki' },
  { number: 87, nameAr: 'الأعلى', nameFr: 'Le Très-Haut', verses: 19, juz: 5, type: 'Makki' },
  { number: 93, nameAr: 'الضحى', nameFr: 'Le Matin', verses: 11, juz: 5, type: 'Makki' },
  { number: 94, nameAr: 'الشرح', nameFr: 'L\'Ouverture', verses: 8, juz: 5, type: 'Makki' },
  { number: 95, nameAr: 'التين', nameFr: 'Le Figuier', verses: 8, juz: 5, type: 'Makki' },
  { number: 96, nameAr: 'العلق', nameFr: 'L\'Adhérence', verses: 19, juz: 5, type: 'Makki' },
  { number: 97, nameAr: 'القدر', nameFr: 'La Destinée', verses: 5, juz: 5, type: 'Makki' },
  { number: 98, nameAr: 'البينة', nameFr: 'La Preuve', verses: 8, juz: 5, type: 'Madani' },
  { number: 99, nameAr: 'الزلزلة', nameFr: 'Le Tremblement de Terre', verses: 8, juz: 5, type: 'Madani' },
  { number: 100, nameAr: 'العاديات', nameFr: 'Les Coursiers', verses: 11, juz: 5, type: 'Makki' },
  { number: 101, nameAr: 'القارعة', nameFr: 'Le Fracas', verses: 11, juz: 5, type: 'Makki' },
  { number: 102, nameAr: 'التكاثر', nameFr: 'La Convoitise', verses: 8, juz: 5, type: 'Makki' },
  { number: 103, nameAr: 'العصر', nameFr: 'Le Temps', verses: 3, juz: 5, type: 'Makki' },
  { number: 104, nameAr: 'الهمزة', nameFr: 'Le Calomniateur', verses: 9, juz: 5, type: 'Makki' },
  { number: 105, nameAr: 'الفيل', nameFr: 'L\'Éléphant', verses: 5, juz: 5, type: 'Makki' },
  { number: 106, nameAr: 'قريش', nameFr: 'Quraysh', verses: 4, juz: 5, type: 'Makki' },
  { number: 107, nameAr: 'الماعون', nameFr: 'L\'Utile', verses: 7, juz: 5, type: 'Makki' },
  { number: 108, nameAr: 'الكوثر', nameFr: 'L\'Abondance', verses: 3, juz: 5, type: 'Makki' },
  { number: 109, nameAr: 'الكافرون', nameFr: 'Les Infidèles', verses: 6, juz: 5, type: 'Makki' },
  { number: 110, nameAr: 'النصر', nameFr: 'Le Secours', verses: 3, juz: 5, type: 'Madani' },
  { number: 111, nameAr: 'المسد', nameFr: 'La Corde', verses: 5, juz: 5, type: 'Makki' },
  { number: 112, nameAr: 'الإخلاص', nameFr: 'Le Monothéisme Pur', verses: 4, juz: 5, type: 'Makki' },
  { number: 113, nameAr: 'الفلق', nameFr: 'L\'Aube Naissante', verses: 5, juz: 5, type: 'Makki' },
  { number: 114, nameAr: 'الناس', nameFr: 'Les Hommes', verses: 6, juz: 5, type: 'Makki' },
];

// --- Quran Resources ---
interface QuranResource {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const QURAN_RESOURCES: QuranResource[] = [
  {
    title: 'Lecture du Coran',
    description: 'Lisez le Coran en ligne avec traduction française et translittération.',
    icon: BookOpen,
    href: 'https://quran.com/fr/',
    color: 'text-lips-green',
  },
  {
    title: 'Coran en Wolof',
    description: 'Écoutez et lisez le Coran avec la traduction en wolof pour les locuteurs sénégalais.',
    icon: Globe,
    href: '#',
    color: 'text-lips-gold',
  },
  {
    title: 'Coran audio complet',
    description: 'Récitation intégrale du Saint Coran par les plus grands récitateurs du monde musulman.',
    icon: Headphones,
    href: '#',
    color: 'text-lips-emerald',
  },
  {
    title: 'Tafsir en français',
    description: 'Commentaire et exégèse du Coran en langue française pour une compréhension approfondie.',
    icon: Mic,
    href: '#',
    color: 'text-amber-600',
  },
  {
    title: 'Mémorisation (Hifz)',
    description: 'Guide pratique et méthodologie pour la mémorisation du Coran, adapté aux adultes et enfants.',
    icon: GraduationCap,
    href: '#',
    color: 'text-lips-green-dark',
  },
];

// --- Get daily verse based on date ---
function getDailyVerse(): DailyVerse {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
}

export default function CoranSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeReciter, setActiveReciter] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  // Surah search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeJuz, setActiveJuz] = useState('1');

  // Daily verse
  const dailyVerse = useMemo(() => getDailyVerse(), []);

  // Filter surahs
  const filteredSurahs = useMemo(() => {
    const juzNum = parseInt(activeJuz);
    let filtered = SURAHS.filter((s) => s.juz === juzNum);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = SURAHS.filter(
        (s) =>
          s.nameFr.toLowerCase().includes(q) ||
          s.nameAr.includes(q) ||
          s.number.toString() === q
      );
    }

    return filtered;
  }, [searchQuery, activeJuz]);

  function handlePlayReciter(id: number) {
    if (activeReciter === id && isPlaying) {
      setIsPlaying(false);
    } else {
      setActiveReciter(id);
      setIsPlaying(true);
      setProgress(0);
      // Simulate progress
      simulateProgress();
    }
  }

  function simulateProgress() {
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 3;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setIsPlaying(false);
      }
      setProgress(p);
    }, 500);
  }

  return (
    <div ref={sectionRef}>
      {/* ===== A. Hero Section ===== */}
      <section className="relative py-12 sm:py-20 lg:py-28 bg-gradient-to-b from-lips-green-dark via-lips-green to-lips-green-dark text-white overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/5 rotate-45 rounded-sm" />
        <div className="absolute bottom-10 right-16 w-20 h-20 border border-lips-gold/10 rotate-12 rounded-sm" />
        <div className="absolute top-1/3 right-10 w-12 h-12 border border-white/5 rotate-45 rounded-full" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
              Parole Divine
            </span>
            <p className="font-arabic text-4xl sm:text-5xl lg:text-7xl text-lips-gold mt-4 mb-4 leading-relaxed">
              القرآن الكريم
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Le Saint Coran
            </h1>
            <div className="separator-islamic text-lips-gold text-2xl my-4">
              &#10022;
            </div>
            <p className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Explorez le Livre Saint, écoutez les récitations de nos imams sénégalais et accédez aux ressources coraniques pour approfondir votre foi.
            </p>
          </motion.div>
        </div>

        {/* Bottom gold line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lips-gold/40 to-transparent" />
      </section>

      {/* ===== E. Daily Verse Widget ===== */}
      <section className="py-10 sm:py-16 bg-lips-cream relative">
        <div className="absolute inset-0 islamic-pattern opacity-5" />
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-lips-gold/30 bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-lips-gold/20 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-lips-gold" />
                  </div>
                  <Badge className="bg-lips-gold/10 text-lips-gold border-lips-gold/20 text-xs">
                    Verset du Jour
                  </Badge>
                </div>

                <p className="font-arabic text-2xl sm:text-3xl lg:text-4xl text-lips-green-dark text-right leading-loose mb-4" dir="rtl">
                  {dailyVerse.arabic}
                </p>
                <div className="w-16 h-0.5 bg-lips-gold/40 mx-auto my-4" />
                <p className="text-base sm:text-lg text-foreground/80 italic text-center leading-relaxed mb-3">
                  &laquo; {dailyVerse.french} &raquo;
                </p>
                <p className="text-sm text-lips-gold text-center font-medium">
                  — {dailyVerse.reference}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ===== B. Audio Player Section ===== */}
      <section className="py-12 sm:py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
              Récitation
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
              Récitateurs Sénégalais
            </h2>
            <div className="separator-islamic text-lips-gold text-2xl my-4">
              &#10022;
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Écoutez la psalmodie du Coran par les voix les plus respectées de l&apos;imamat sénégalais.
            </p>
          </motion.div>

          {/* Reciters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {RECITERS.map((reciter, index) => (
              <motion.div
                key={reciter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className={`group hover:shadow-lg hover:shadow-lips-green/10 transition-all duration-300 hover:border-lips-green/30 border-border/50 ${
                  activeReciter === reciter.id ? 'ring-2 ring-lips-green/30 border-lips-green/30' : ''
                }`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${reciter.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                        <span className="text-white font-bold text-lg">{reciter.initials}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lips-green-dark text-sm leading-tight mb-1">
                          {reciter.name}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {reciter.bio}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        onClick={() => handlePlayReciter(reciter.id)}
                        className={`w-full gap-2 text-sm ${
                          activeReciter === reciter.id && isPlaying
                            ? 'bg-lips-gold hover:bg-lips-gold/90 text-lips-green-dark'
                            : 'bg-lips-green hover:bg-lips-green-dark text-white'
                        }`}
                      >
                        {activeReciter === reciter.id && isPlaying ? (
                          <>
                            <Pause className="h-4 w-4" /> En cours...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" /> Écouter
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Audio Player Bar */}
          {activeReciter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-lips-green-dark text-white border-0 shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-4">
                    {/* Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8"
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="h-10 w-10 rounded-full bg-lips-gold hover:bg-lips-gold/90 text-lips-green-dark shrink-0"
                        size="icon"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Progress */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-white/60 truncate">
                          {RECITERS.find((r) => r.id === activeReciter)?.name}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2 bg-white/10 [&>[data-slot=indicator]]:bg-lips-gold" />
                    </div>

                    {/* Volume */}
                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                      <Volume2 className="h-4 w-4 text-white/60" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== C. Surah Index ===== */}
      <section className="py-12 sm:py-20 lg:py-28 bg-lips-cream relative">
        <div className="absolute inset-0 islamic-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
              Index
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
              Sourates du Coran
            </h2>
            <div className="separator-islamic text-lips-gold text-2xl my-4">
              &#10022;
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Retrouvez les 114 sourates du Coran, classées par Juz, avec accès rapide à la lecture en ligne.
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une sourate (nom, numéro)..."
                className="pl-10 bg-white border-lips-green/20 focus:border-lips-green h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Juz Tabs */}
          <Tabs value={activeJuz} onValueChange={setActiveJuz} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white border border-border/50 shadow-sm">
                <TabsTrigger value="1" className="data-[state=active]:bg-lips-green data-[state=active]:text-white text-xs sm:text-sm">
                  Juz 1
                </TabsTrigger>
                <TabsTrigger value="2" className="data-[state=active]:bg-lips-green data-[state=active]:text-white text-xs sm:text-sm">
                  Juz 2
                </TabsTrigger>
                <TabsTrigger value="3" className="data-[state=active]:bg-lips-green data-[state=active]:text-white text-xs sm:text-sm">
                  Juz 3
                </TabsTrigger>
                <TabsTrigger value="4" className="data-[state=active]:bg-lips-green data-[state=active]:text-white text-xs sm:text-sm">
                  Juz 4
                </TabsTrigger>
                <TabsTrigger value="5" className="data-[state=active]:bg-lips-green data-[state=active]:text-white text-xs sm:text-sm">
                  Juz 5
                </TabsTrigger>
              </TabsList>
            </div>

            {['1', '2', '3', '4', '5'].map((juz) => (
              <TabsContent key={juz} value={juz}>
                {searchQuery.trim() ? null : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredSurahs.map((surah, idx) => (
                      <motion.div
                        key={`${surah.number}-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                      >
                        <a
                          href={`https://quran.com/fr/${surah.number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Card className="group hover:shadow-md hover:shadow-lips-green/10 transition-all duration-200 hover:border-lips-green/30 cursor-pointer border-border/50 bg-white/90">
                            <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                              {/* Surah number */}
                              <div className="w-9 h-9 rounded-lg bg-lips-green/10 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-lips-green font-mono">
                                  {surah.number}
                                </span>
                              </div>

                              {/* Names */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-arabic text-sm text-lips-gold">
                                    {surah.nameAr}
                                  </span>
                                  <Badge variant="secondary" className="text-[10px] h-4 bg-lips-green/5 text-lips-green shrink-0">
                                    {surah.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                  {surah.nameFr} — {surah.verses} versets
                                </p>
                              </div>

                              {/* Arrow */}
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-lips-green transition-colors shrink-0" />
                            </CardContent>
                          </Card>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}

            {/* Search results */}
            {searchQuery.trim() && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredSurahs.length > 0 ? (
                  filteredSurahs.map((surah, idx) => (
                    <motion.div
                      key={`search-${surah.number}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                    >
                      <a
                        href={`https://quran.com/fr/${surah.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Card className="group hover:shadow-md hover:shadow-lips-green/10 transition-all duration-200 hover:border-lips-green/30 cursor-pointer border-border/50 bg-white/90">
                          <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-lips-green/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-lips-green font-mono">
                                {surah.number}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-arabic text-sm text-lips-gold">
                                  {surah.nameAr}
                                </span>
                                <Badge variant="secondary" className="text-[10px] h-4 bg-lips-green/5 text-lips-green shrink-0">
                                  {surah.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {surah.nameFr} — {surah.verses} versets
                              </p>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-lips-green transition-colors shrink-0" />
                          </CardContent>
                        </Card>
                      </a>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>Aucune sourate trouvée pour &laquo; {searchQuery} &raquo;</p>
                  </div>
                )}
              </div>
            )}
          </Tabs>
        </div>
      </section>

      {/* ===== D. Quran Resources ===== */}
      <section className="py-12 sm:py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
              Ressources
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
              Ressources Coraniques
            </h2>
            <div className="separator-islamic text-lips-gold text-2xl my-4">
              &#10022;
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Accédez à des outils et ressources pour approfondir votre relation avec le Coran.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {QURAN_RESOURCES.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className="group hover:shadow-lg hover:shadow-lips-green/10 transition-all duration-300 hover:border-lips-green/30 border-border/50 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-xl bg-lips-green/10 flex items-center justify-center mb-4">
                      <resource.icon className={`h-6 w-6 ${resource.color}`} />
                    </div>
                    <h3 className="font-semibold text-lips-green-dark text-base mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                      {resource.description}
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full gap-2 border-lips-green/20 text-lips-green hover:bg-lips-green hover:text-white transition-colors"
                    >
                      <a
                        href={resource.href}
                        target={resource.href.startsWith('http') ? '_blank' : undefined}
                        rel={resource.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        Accéder
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
