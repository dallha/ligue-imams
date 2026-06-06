'use client';

import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Search,
  BookOpen,
  Headphones,
  Globe,
  Mic,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Loader2,
  RefreshCw,
  ListMusic,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

// ─── Types ────────────────────────────────────────────────────
interface Moshaf {
  id: number;
  name: string;
  server: string;
  surahTotal: number;
  rewayaId: number;
  moshafType: number;
}

interface Reciter {
  id: number;
  name: string;
  letter: string;
  moshaf: Moshaf[];
}

interface Surah {
  id: number;
  name: string;
  startPage: number;
  endPage: number;
  makkia: boolean;
}

// ─── Popular reciters (pre-selected IDs from mp3quran.net) ────
const POPULAR_RECITER_IDS = [
  102, // Maher Al Meaqli
  7,   // Mishary Rashid Alafasy
  128, // Abdul Rahman Al-Sudais
  171, // Saud Al-Shuraim
  5,   // Ibrahim Al-Akdar
  103, // Yasser Al-Dosari
  170, // Abdullah Basfar
  82,  // Nasser Al-Qatami
  56,  // Ali Al-Huthaifi
  119, // Abdul Basit Abdul Samad
  9,   // Abu Bakr Al-Shatri
  101, // Hani Ar-Rifai
];

// ─── Arabic surah names (complete 114) ────────────────────────
const SURAH_NAMES_AR: Record<number, string> = {
  1:'الفاتحة',2:'البقرة',3:'آل عمران',4:'النساء',5:'المائدة',6:'الأنعام',7:'الأعراف',
  8:'الأنفال',9:'التوبة',10:'يونس',11:'هود',12:'يوسف',13:'الرعد',14:'إبراهيم',
  15:'الحجر',16:'النحل',17:'الإسراء',18:'الكهف',19:'مريم',20:'طه',21:'الأنبياء',
  22:'الحج',23:'المؤمنون',24:'النور',25:'الفرقان',26:'الشعراء',27:'النمل',28:'القصص',
  29:'العنكبوت',30:'الروم',31:'لقمان',32:'السجدة',33:'الأحزاب',34:'سبأ',35:'فاطر',
  36:'يس',37:'الصافات',38:'ص',39:'الزمر',40:'غافر',41:'فصلت',42:'الشورى',43:'الزخرف',
  44:'الدخان',45:'الجاثية',46:'الأحقاف',47:'محمد',48:'الفتح',49:'الحجرات',50:'ق',
  51:'الذاريات',52:'الطور',53:'النجم',54:'القمر',55:'الرحمن',56:'الواقعة',57:'الحديد',
  58:'المجادلة',59:'الحشر',60:'الممتحنة',61:'الصف',62:'الجمعة',63:'المنافقون',
  64:'التغابن',65:'الطلاق',66:'التحريم',67:'الملك',68:'القلم',69:'الحاقة',70:'المعارج',
  71:'نوح',72:'الجن',73:'المزمل',74:'المدثر',75:'القيامة',76:'الإنسان',77:'المرسلات',
  78:'النبأ',79:'النازعات',80:'عبس',81:'التكوير',82:'الانفطار',83:'المطففين',
  84:'الانشقاق',85:'البروج',86:'الطارق',87:'الأعلى',88:'الغاشية',89:'الفجر',90:'البلد',
  91:'الشمس',92:'الليل',93:'الضحى',94:'الشرح',95:'التين',96:'العلق',97:'القدر',
  98:'البينة',99:'الزلزلة',100:'العاديات',101:'القارعة',102:'التكاثر',103:'العصر',
  104:'الهمزة',105:'الفيل',106:'قريش',107:'الماعون',108:'الكوثر',109:'الكافرون',
  110:'النصر',111:'المسد',112:'الإخلاص',113:'الفلق',114:'الناس',
};

// ─── Daily Verses ─────────────────────────────────────────────
interface DailyVerse {
  arabic: string;
  french: string;
  reference: string;
}

const DAILY_VERSES: DailyVerse[] = [
  { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', french: 'Au nom d\'Allah, le Tout-Miséricordieux, le Très-Miséricordieux.', reference: 'Coran 1:1 — Al-Fatiha' },
  { arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', french: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même.', reference: 'Coran 2:255 — Ayat al-Kursi' },
  { arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', french: 'Et quiconque craint Allah, Il lui donnera une issue.', reference: 'Coran 65:2 — At-Talaq' },
  { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', french: 'Certes, avec la difficulté vient la facilité.', reference: 'Coran 94:6 — Ash-Sharh' },
  { arabic: 'وَلَذِكْرُ اللَّهِ أَكْبَرُ', french: 'Et l\'invocation d\'Allah est certes la plus grande chose.', reference: 'Coran 29:45 — Al-Ankabut' },
  { arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', french: 'Et dis : « Ô mon Seigneur, augmente mes connaissances. »', reference: 'Coran 20:114 — Taha' },
  { arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', french: 'Souvenez-vous de Moi, Je me souviendrai de vous. Soyez reconnaissants envers Moi et ne Me reniez pas.', reference: 'Coran 2:152 — Al-Baqara' },
];

// ─── Quran Resources ──────────────────────────────────────────
const QURAN_RESOURCES = [
  { title: 'Lecture du Coran', description: 'Lisez le Coran en ligne avec traduction française et translittération.', icon: BookOpen, href: 'https://quran.com/fr/', color: 'text-lips-green' },
  { title: 'MP3Quran.net', description: 'Plateforme complète de récitations audio du Coran par les plus grands récitateurs du monde musulman.', icon: Headphones, href: 'https://www.mp3quran.net/fr', color: 'text-lips-gold' },
  { title: 'Coran en Wolof', description: 'Écoutez et lisez le Coran avec la traduction en wolof pour les locuteurs sénégalais.', icon: Globe, href: '#', color: 'text-lips-gold' },
  { title: 'Tafsir en français', description: 'Commentaire et exégèse du Coran en langue française pour une compréhension approfondie.', icon: Mic, href: '#', color: 'text-amber-600' },
  { title: 'Mémorisation (Hifz)', description: 'Guide pratique et méthodologie pour la mémorisation du Coran, adapté aux adultes et enfants.', icon: GraduationCap, href: '#', color: 'text-lips-green-dark' },
];

// ─── Helpers ──────────────────────────────────────────────────
function getDailyVerse(): DailyVerse {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
}

function getAudioUrl(server: string, surahNumber: number): string {
  const padded = String(surahNumber).padStart(3, '0');
  return `${server}${padded}.mp3`;
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Main Component ───────────────────────────────────────────
export default function CoranSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Data state
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [suwar, setSuwar] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState('');

  // Player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [selectedMoshaf, setSelectedMoshaf] = useState<Moshaf | null>(null);
  const [currentSurah, setCurrentSurah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Surah search
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllReciters, setShowAllReciters] = useState(false);

  const dailyVerse = useMemo(() => getDailyVerse(), []);

  // ─── Fetch data ───────────────────────────────────────────
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [recitersRes, suwarRes] = await Promise.all([
          fetch('/api/coran/reciters?language=fr'),
          fetch('/api/coran/suwar'),
        ]);

        if (!recitersRes.ok || !suwarRes.ok) throw new Error('API error');

        const recitersData = await recitersRes.json();
        const suwarData = await suwarRes.json();

        setSuwar(suwarData.suwar || []);

        // Sort: popular reciters first
        const all = recitersData.reciters || [];
        const popular = POPULAR_RECITER_IDS
          .map(id => all.find((r: Reciter) => r.id === id))
          .filter(Boolean) as Reciter[];
        const others = all.filter((r: Reciter) => !POPULAR_RECITER_IDS.includes(r.id));

        setReciters([...popular, ...others]);

        // Auto-select first popular reciter
        if (popular.length > 0) {
          setSelectedReciter(popular[0]);
          // Select first moshaf (murattal preferred)
          const murattal = popular[0].moshaf.find(m => m.moshafType === 11) || popular[0].moshaf[0];
          setSelectedMoshaf(murattal);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setDataError('Impossible de charger les données. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ─── Audio player logic ──────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const playSurah = useCallback((surahNum: number, moshaf?: Moshaf) => {
    const m = moshaf || selectedMoshaf;
    if (!m) return;

    const audio = audioRef.current!;
    const url = getAudioUrl(m.server, surahNum);
    audio.src = url;
    audio.volume = isMuted ? 0 : volume;
    setAudioLoading(true);
    setCurrentSurah(surahNum);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    audio.play()
      .then(() => { setIsPlaying(true); setAudioLoading(false); })
      .catch((err) => { console.error('Play error:', err); setAudioLoading(false); });
  }, [selectedMoshaf, volume, isMuted]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && isFinite(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      // Auto-play next surah
      if (currentSurah < 114 && selectedMoshaf) {
        playSurah(currentSurah + 1);
      }
    };
    const onLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setAudioLoading(false);
    };
    const onCanPlay = () => setAudioLoading(false);
    const onWaiting = () => setAudioLoading(true);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('waiting', onWaiting);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('waiting', onWaiting);
    };
  }, [currentSurah, selectedMoshaf, playSurah]);

  const togglePlay = () => {
    const audio = audioRef.current!;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src || audio.src === window.location.href) {
        playSurah(currentSurah);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }
  };

  const handlePrev = () => {
    if (currentSurah > 1) playSurah(currentSurah - 1);
  };
  const handleNext = () => {
    if (currentSurah < 114) playSurah(currentSurah + 1);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current!;
    if (!audio.duration || !isFinite(audio.duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  };

  const toggleMute = () => {
    const audio = audioRef.current!;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (val: number) => {
    const audio = audioRef.current!;
    setVolume(val);
    audio.volume = val;
    if (val > 0 && isMuted) setIsMuted(false);
  };

  const selectReciter = (reciter: Reciter, moshaf?: Moshaf) => {
    setSelectedReciter(reciter);
    const m = moshaf || reciter.moshaf.find(m2 => m2.moshafType === 11) || reciter.moshaf[0];
    setSelectedMoshaf(m);
    // If currently playing, switch to new reciter
    if (isPlaying) {
      playSurah(currentSurah, m);
    }
  };

  // ─── Filtered surahs ────────────────────────────────────
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return suwar;
    const q = searchQuery.toLowerCase();
    return suwar.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      (SURAH_NAMES_AR[s.id] || '').includes(q) ||
      s.id.toString() === q
    );
  }, [searchQuery, suwar]);

  // ─── Displayed reciters ──────────────────────────────────
  const displayedReciters = useMemo(() => {
    if (showAllReciters) return reciters;
    return reciters.slice(0, 12);
  }, [reciters, showAllReciters]);

  const currentSurahName = suwar.find(s => s.id === currentSurah)?.name || `Sourate ${currentSurah}`;
  const currentSurahNameAr = SURAH_NAMES_AR[currentSurah] || '';

  return (
    <div ref={sectionRef}>
      {/* ===== A. Hero Section ===== */}
      <section className="relative py-12 sm:py-20 lg:py-28 bg-gradient-to-b from-lips-green-dark via-lips-green to-lips-green-dark text-white overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/5 rotate-45 rounded-sm" />
        <div className="absolute bottom-10 right-16 w-20 h-20 border border-lips-gold/10 rotate-12 rounded-sm" />
        <div className="absolute top-1/3 right-10 w-12 h-12 border border-white/5 rotate-45 rounded-full" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">Parole Divine</span>
            <p className="font-arabic text-4xl sm:text-5xl lg:text-7xl text-lips-gold mt-4 mb-4 leading-relaxed">القرآن الكريم</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Le Saint Coran</h1>
            <div className="separator-islamic text-lips-gold text-2xl my-4">&#10022;</div>
            <p className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Écoutez les plus belles récitations du Coran par les plus grands récitateurs du monde musulman, par sourate et en streaming direct.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lips-gold/40 to-transparent" />
      </section>

      {/* ===== E. Daily Verse Widget ===== */}
      <section className="py-10 sm:py-16 bg-lips-cream relative">
        <div className="absolute inset-0 islamic-pattern opacity-5" />
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}>
            <Card className="border-lips-gold/30 bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-lips-gold/20 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-lips-gold" />
                  </div>
                  <Badge className="bg-lips-gold/10 text-lips-gold border-lips-gold/20 text-xs">Verset du Jour</Badge>
                </div>
                <p className="font-arabic text-2xl sm:text-3xl lg:text-4xl text-lips-green-dark text-right leading-loose mb-4" dir="rtl">{dailyVerse.arabic}</p>
                <div className="w-16 h-0.5 bg-lips-gold/40 mx-auto my-4" />
                <p className="text-base sm:text-lg text-foreground/80 italic text-center leading-relaxed mb-3">&laquo; {dailyVerse.french} &raquo;</p>
                <p className="text-sm text-lips-gold text-center font-medium">— {dailyVerse.reference}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ===== B. Audio Player Section ===== */}
      <section className="py-12 sm:py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-center mb-12">
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">Récitation</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-lips-green-dark mt-3 mb-4">Récitateurs du Coran</h2>
            <div className="separator-islamic text-lips-gold text-2xl my-4">&#10022;</div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Sélectionnez un récitateurs et écoutez la psalmodie du Coran en streaming direct depuis MP3Quran.net.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-lips-green animate-spin" />
              <span className="ml-3 text-muted-foreground">Chargement des récitateurs...</span>
            </div>
          ) : dataError ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{dataError}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" /> Réessayer
              </Button>
            </div>
          ) : (
            <>
              {/* Reciters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-8">
                {displayedReciters.map((reciter) => {
                  const isSelected = selectedReciter?.id === reciter.id;
                  return (
                    <motion.button
                      key={reciter.id}
                      onClick={() => selectReciter(reciter)}
                      className={`text-left rounded-xl p-3 transition-all duration-200 border ${
                        isSelected
                          ? 'bg-lips-green text-white border-lips-green shadow-lg shadow-lips-green/20'
                          : 'bg-white border-border/50 hover:border-lips-green/30 hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        isSelected ? 'bg-lips-gold' : 'bg-lips-green/10'
                      }`}>
                        <span className={`font-bold text-sm ${isSelected ? 'text-lips-green-dark' : 'text-lips-green'}`}>
                          {reciter.name.charAt(0)}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold text-center leading-tight truncate ${
                        isSelected ? 'text-white' : 'text-lips-green-dark'
                      }`}>
                        {reciter.name}
                      </p>
                      {reciter.moshaf.length > 1 && (
                        <p className={`text-[10px] text-center mt-0.5 truncate ${
                          isSelected ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                          {reciter.moshaf.length} styles
                        </p>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Show more reciters */}
              {reciters.length > 12 && (
                <div className="text-center mb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllReciters(!showAllReciters)}
                    className="gap-2 border-lips-green/20 text-lips-green"
                  >
                    {showAllReciters ? 'Voir moins' : `Voir tous les ${reciters.length} récitateurs`}
                    <ChevronRight className={`h-4 w-4 transition-transform ${showAllReciters ? 'rotate-90' : ''}`} />
                  </Button>
                </div>
              )}

              {/* Moshaf selector (if reciter has multiple styles) */}
              {selectedReciter && selectedReciter.moshaf.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  <span className="text-xs text-muted-foreground mr-1">Style :</span>
                  {selectedReciter.moshaf.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMoshaf(m);
                        if (isPlaying) playSurah(currentSurah, m);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedMoshaf?.id === m.id
                          ? 'bg-lips-gold text-lips-green-dark shadow-sm'
                          : 'bg-lips-green/10 text-lips-green hover:bg-lips-green/20'
                      }`}
                    >
                      {m.name.replace('Rewayat ', '').replace('Almusshaf ', '')}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ─── Audio Player Bar ──────────────────────────── */}
          {selectedReciter && selectedMoshaf && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="bg-lips-green-dark text-white border-0 shadow-xl overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  {/* Surah info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <ListMusic className="h-4 w-4 text-lips-gold flex-shrink-0" />
                        <span className="font-semibold text-sm truncate">{currentSurahName}</span>
                        <span className="font-arabic text-lips-gold text-sm" dir="rtl">{currentSurahNameAr}</span>
                      </div>
                      <p className="text-[11px] text-white/50 truncate mt-0.5">{selectedReciter.name} — {selectedMoshaf.name}</p>
                    </div>
                    <Badge className="bg-lips-gold/20 text-lips-gold border-lips-gold/30 text-[10px] ml-2 shrink-0">
                      {currentSurah}/114
                    </Badge>
                  </div>

                  {/* Progress bar (clickable) */}
                  <div
                    className="relative h-2 bg-white/10 rounded-full cursor-pointer group mb-3"
                    onClick={handleSeek}
                  >
                    <div
                      className="absolute top-0 left-0 h-full bg-lips-gold rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-lips-gold rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
                    />
                  </div>

                  {/* Time */}
                  <div className="flex items-center justify-between text-[10px] text-white/50 mb-3">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <Button variant="ghost" size="icon" onClick={handlePrev} disabled={currentSurah <= 1} className="text-white/60 hover:text-white hover:bg-white/10 h-9 w-9">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={togglePlay}
                      className="h-12 w-12 rounded-full bg-lips-gold hover:bg-lips-gold/90 text-lips-green-dark shrink-0 shadow-lg"
                      size="icon"
                      disabled={audioLoading}
                    >
                      {audioLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentSurah >= 114} className="text-white/60 hover:text-white hover:bg-white/10 h-9 w-9">
                      <SkipForward className="h-4 w-4" />
                    </Button>

                    {/* Volume */}
                    <div className="hidden sm:flex items-center gap-2 ml-4">
                      <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                        {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-20 accent-lips-gold"
                      />
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
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="text-center mb-12">
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">Index</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-lips-green-dark mt-3 mb-4">Les 114 Sourates</h2>
            <div className="separator-islamic text-lips-gold text-2xl my-4">&#10022;</div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Cliquez sur une sourate pour l&apos;écouter directement avec le récitateurs sélectionné.
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

          {/* Surah grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-lips-green animate-spin" />
              <span className="ml-2 text-muted-foreground text-sm">Chargement des sourates...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
              {filteredSurahs.map((surah, idx) => {
                const isActive = currentSurah === surah.id && isPlaying;
                const isCurrent = currentSurah === surah.id;
                const nameAr = SURAH_NAMES_AR[surah.id] || '';
                return (
                  <motion.button
                    key={surah.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: Math.min(idx * 0.01, 0.5) }}
                    onClick={() => {
                      if (selectedMoshaf) {
                        playSurah(surah.id);
                      }
                    }}
                    disabled={!selectedMoshaf}
                    className={`text-left rounded-xl p-2.5 sm:p-3 transition-all duration-200 border relative overflow-hidden ${
                      isActive
                        ? 'bg-lips-green text-white border-lips-green shadow-lg shadow-lips-green/20'
                        : isCurrent
                        ? 'bg-lips-gold/10 border-lips-gold/30'
                        : 'bg-white/90 border-border/50 hover:border-lips-green/30 hover:shadow-sm'
                    } ${!selectedMoshaf ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {/* Playing indicator */}
                    {isActive && (
                      <div className="absolute top-2 right-2 flex items-end gap-0.5 h-3">
                        <span className="w-0.5 bg-lips-gold rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
                        <span className="w-0.5 bg-lips-gold rounded-full animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
                        <span className="w-0.5 bg-lips-gold rounded-full animate-pulse" style={{ height: '40%', animationDelay: '300ms' }} />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-lips-gold' : 'bg-lips-green/10'
                      }`}>
                        <span className={`text-[10px] font-bold font-mono ${
                          isActive ? 'text-lips-green-dark' : 'text-lips-green'
                        }`}>{surah.id}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-arabic text-xs truncate ${isActive ? 'text-lips-gold' : 'text-lips-gold'}`}>{nameAr}</p>
                        <p className={`text-[10px] truncate leading-tight ${
                          isActive ? 'text-white/80' : 'text-muted-foreground'
                        }`}>{surah.name}</p>
                      </div>
                    </div>
                    <div className="mt-1.5">
                      <Badge variant="secondary" className={`text-[8px] h-3.5 px-1 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-lips-green/5 text-lips-green'
                      }`}>
                        {surah.makkia ? 'Makki' : 'Madani'}
                      </Badge>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {searchQuery.trim() && filteredSurahs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>Aucune sourate trouvée pour &laquo; {searchQuery} &raquo;</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== D. Quran Resources ===== */}
      <section className="py-12 sm:py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="text-center mb-12">
            <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">Ressources</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-lips-green-dark mt-3 mb-4">Ressources Coraniques</h2>
            <div className="separator-islamic text-lips-gold text-2xl my-4">&#10022;</div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">Accédez à des outils et ressources pour approfondir votre relation avec le Coran.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {QURAN_RESOURCES.map((resource, index) => (
              <motion.div key={resource.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.1 * index }}>
                <Card className="group hover:shadow-lg hover:shadow-lips-green/10 transition-all duration-300 hover:border-lips-green/30 border-border/50 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-xl bg-lips-green/10 flex items-center justify-center mb-4">
                      <resource.icon className={`h-6 w-6 ${resource.color}`} />
                    </div>
                    <h3 className="font-semibold text-lips-green-dark text-base mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{resource.description}</p>
                    <Button asChild variant="outline" className="w-full gap-2 border-lips-green/20 text-lips-green hover:bg-lips-green hover:text-white transition-colors">
                      <a href={resource.href} target={resource.href.startsWith('http') ? '_blank' : undefined} rel={resource.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                        Accéder <ChevronRight className="h-4 w-4" />
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
