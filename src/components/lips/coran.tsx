'use client';

import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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
  Loader2,
  RefreshCw,
  ListMusic,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/lips/i18n/language-context';

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

// ─── Daily Verses ──────────────────────────────────────────────
interface DailyVerse {
  arabic: string;
  translation: string;
  reference: string;
}

function getDailyVerse(t: { coran: { verses: Record<string, DailyVerse> } }): DailyVerse {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const keys = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7'];
  const key = keys[dayOfYear % keys.length];
  return t.coran.verses[key];
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

function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ─── Reciter Search Row ────────────────────────────────────────
function ReciterSearchRow({ reciter, isSelected, isPopular, onClick }: { reciter: Reciter; isSelected: boolean; isPopular: boolean; onClick: () => void }) {
  const { t } = useLanguage();
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-left group',
        isSelected ? 'bg-lips-green text-white shadow-md' : 'hover:bg-muted/50'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
        isSelected ? 'bg-white/20' : 'bg-lips-green/10 group-hover:bg-lips-green/20'
      )}>
        <span className={cn('font-bold text-sm', isSelected ? 'text-white' : 'text-lips-green')}>{reciter.name.charAt(0)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-semibold truncate', isSelected ? 'text-white' : 'text-foreground')}>{reciter.name}</p>
        <p className={cn('text-[11px] truncate mt-0.5', isSelected ? 'text-white/70' : 'text-muted-foreground')}>
          {reciter.moshaf.length} {reciter.moshaf.length > 1 ? t.coran.styles : t.coran.style}
        </p>
      </div>
      {isPopular && !isSelected && (
        <Badge variant="outline" className="text-[10px] text-lips-gold border-lips-gold/20 bg-lips-gold/5 shrink-0">{t.coran.popular}</Badge>
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function CoranSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

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

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [reciterSearch, setReciterSearch] = useState('');

  const dailyVerse = useMemo(() => getDailyVerse(t), [t]);
  const [dbVerse, setDbVerse] = useState<DailyVerse | null>(null);
  const [dbResources, setDbResources] = useState<Array<{ title: string; description: string; icon: React.ElementType; href: string; color: string }>>([]);

  useEffect(() => {
    fetch('/api/public/coran')
      .then(r => r.json())
      .then(data => {
        if (data.data?.verses?.length > 0) {
          const today = new Date().toISOString().slice(0, 10);
          const todayVerse = data.data.verses.find((v: any) => v.dateActive && v.dateActive.slice(0, 10) === today);
          const verse = todayVerse || data.data.verses[0];
          setDbVerse({ arabic: verse.arabic, translation: verse.french, reference: verse.reference });
        }
        if (data.data?.resources?.length > 0) {
          const iconMap: Record<string, React.ElementType> = { BookOpen, Headphones, Mic, Globe, GraduationCap };
          const res = data.data.resources.map((r: any) => ({
            title: r.title,
            description: r.description || '',
            icon: iconMap[r.icon] || BookOpen,
            href: r.url || '#',
            color: 'text-lips-green',
          }));
          setDbResources(res);
        }
      })
      .catch(() => {});
  }, []);

  const activeVerse = dbVerse || dailyVerse;
  const quranResources = dbResources.length > 0 ? dbResources : useMemo(() => [
    { title: t.coran.resReadCoran, description: t.coran.resReadCoranDesc, icon: BookOpen, href: 'https://quran.com/fr/', color: 'text-lips-green' },
    { title: t.coran.resMp3Quran, description: t.coran.resMp3QuranDesc, icon: Headphones, href: 'https://www.mp3quran.net/fr', color: 'text-lips-gold' },
  ], [t]);

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

        const all = recitersData.reciters || [];
        const popular = POPULAR_RECITER_IDS.map(id => all.find((r: Reciter) => r.id === id)).filter(Boolean) as Reciter[];
        const others = all.filter((r: Reciter) => !POPULAR_RECITER_IDS.includes(r.id));

        setReciters([...popular, ...others]);

        if (popular.length > 0) {
          setSelectedReciter(popular[0]);
          const murattal = popular[0].moshaf.find(m => m.moshafType === 11) || popular[0].moshaf[0];
          setSelectedMoshaf(murattal);
        }
      } catch (err) {
        console.error(err);
        setDataError(t.coran.fetchError);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [t.coran.fetchError]);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
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
    audio.src = getAudioUrl(m.server, surahNum);
    audio.volume = isMuted ? 0 : volume;
    setAudioLoading(true);
    setCurrentSurah(surahNum);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    audio.play().then(() => { setIsPlaying(true); setAudioLoading(false); }).catch(() => setAudioLoading(false));
  }, [selectedMoshaf, volume, isMuted]);

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
    const onEnded = () => { setIsPlaying(false); if (currentSurah < 114) playSurah(currentSurah + 1); };
    const onLoadedMetadata = () => { if (audio.duration && isFinite(audio.duration)) setDuration(audio.duration); setAudioLoading(false); };
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
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else {
      if (!audio.src || audio.src === window.location.href) playSurah(currentSurah);
      else audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handlePrev = () => { if (currentSurah > 1) playSurah(currentSurah - 1); };
  const handleNext = () => { if (currentSurah < 114) playSurah(currentSurah + 1); };
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current!;
    if (!audio.duration || !isFinite(audio.duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  };
  const toggleMute = () => {
    const audio = audioRef.current!;
    if (isMuted) { audio.volume = volume; setIsMuted(false); }
    else { audio.volume = 0; setIsMuted(true); }
  };
  const handleVolumeChange = (val: number) => {
    const audio = audioRef.current!;
    setVolume(val); audio.volume = val;
    if (val > 0 && isMuted) setIsMuted(false);
  };
  const selectReciter = (reciter: Reciter, moshaf?: Moshaf) => {
    setSelectedReciter(reciter);
    const m = moshaf || reciter.moshaf.find(m2 => m2.moshafType === 11) || reciter.moshaf[0];
    setSelectedMoshaf(m);
    if (isPlaying) playSurah(currentSurah, m);
  };

  const scrollToPlayer = () => {
    playerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return suwar;
    const q = searchQuery.toLowerCase();
    return suwar.filter((s) => s.name.toLowerCase().includes(q) || (SURAH_NAMES_AR[s.id] || '').includes(q) || s.id.toString() === q);
  }, [searchQuery, suwar]);

  const reciterSearchResults = useMemo(() => {
    if (!reciterSearch.trim()) return reciters.slice(0, 15);
    const q = reciterSearch.toLowerCase();
    return reciters.filter(r => r.name.toLowerCase().includes(q) || r.letter.toLowerCase().includes(q)).slice(0, 15);
  }, [reciterSearch, reciters]);

  const currentSurahName = suwar.find(s => s.id === currentSurah)?.name || t.coran.surahLabel + ' ' + currentSurah;
  const currentSurahNameAr = SURAH_NAMES_AR[currentSurah] || '';

  return (
    <div ref={sectionRef} className="bg-background min-h-screen font-sans">
      
      {/* ===== A. Hero Section ===== */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-[#0D3B1F] text-white overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D3B1F] via-[#1B6B3A]/80 to-[#0D3B1F] z-0" />
        
        {/* Abstract typography background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none z-0">
          <p className="font-arabic text-[30vw] leading-none whitespace-nowrap text-white drop-shadow-2xl">القرآن</p>
        </div>
        
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <Badge variant="outline" className="text-lips-gold border-lips-gold/30 bg-lips-gold/5 mb-6 px-4 py-1 text-xs tracking-widest uppercase backdrop-blur-sm shadow-sm">
              {t.coran.heroTag}
            </Badge>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold font-arabic text-transparent bg-clip-text bg-gradient-to-r from-[#E5BE5A] to-[#C9962A] mb-6 drop-shadow-xl" dir="rtl">
              القرآن الكريم
            </h1>
            <h2 className="text-2xl sm:text-4xl font-semibold mb-6 tracking-tight text-white/90">Le Saint Coran</h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg mb-10 font-light leading-relaxed">
              {t.coran.heroSubtitle}
            </p>
            <Button 
              onClick={scrollToPlayer}
              className="bg-lips-gold hover:bg-[#C9962A] text-[#0D3B1F] font-bold text-base sm:text-lg px-8 py-6 rounded-full shadow-[0_0_40px_rgba(201,150,42,0.3)] hover:shadow-[0_0_60px_rgba(201,150,42,0.5)] transition-all hover:-translate-y-1"
            >
              <Headphones className="mr-3 h-5 w-5" /> Écouter la Récitation
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 animate-bounce cursor-pointer hover:text-white transition-colors"
          onClick={scrollToPlayer}
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </section>

      {/* ===== B. Daily Verse Widget ===== */}
      <section className="py-24 relative -mt-10 z-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Card className="border-0 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden relative ring-1 ring-border/50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lips-gold via-lips-green to-lips-gold" />
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-lips-gold/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-lips-green/10 rounded-full blur-[100px] pointer-events-none" />
              
              <CardContent className="p-10 sm:p-16 text-center relative z-10">
                <BookOpen className="h-8 w-8 text-lips-gold mx-auto mb-6 opacity-80" />
                <div className="w-full flex justify-center mb-8">
                  <p className="font-arabic text-3xl sm:text-4xl lg:text-5xl text-foreground dark:text-[#E5BE5A] leading-[1.8] drop-shadow-sm" dir="rtl" style={{ textAlign: 'center' }}>
                    {activeVerse.arabic}
                  </p>
                </div>
                <p className="text-lg sm:text-xl text-muted-foreground font-light italic leading-relaxed mb-8 max-w-2xl mx-auto">
                  &laquo; {activeVerse.translation} &raquo;
                </p>
                <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-1.5 rounded-full border border-border/50">
                  <span className="w-2 h-2 rounded-full bg-lips-gold" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wide text-foreground/80">{activeVerse.reference}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ===== C. Audio Player Section ===== */}
      <section ref={playerRef} className="py-20 relative bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">Récitations Audio</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Écoutez le Saint Coran avec les plus belles voix du monde islamique.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-lips-green animate-spin mb-4" />
              <span className="text-muted-foreground font-medium">{t.coran.loadingReciters}</span>
            </div>
          ) : dataError ? (
            <div className="text-center py-20">
              <p className="text-destructive mb-4 font-medium">{dataError}</p>
              <Button onClick={() => window.location.reload()} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> {t.coran.retry}</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Player & Selected Reciter */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* The Player Card (Glassmorphism) */}
                <Card className="bg-card border-border/50 shadow-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-lips-green/5 to-lips-gold/5 opacity-50 transition-opacity group-hover:opacity-100" />
                  
                  <CardContent className="p-8 sm:p-10 relative z-10">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                      
                      {/* Play Button Massive */}
                      <div className="relative group/play shrink-0">
                        <div className={`absolute -inset-2 bg-lips-gold rounded-full blur-xl transition-opacity duration-500 ${isPlaying ? 'opacity-40' : 'opacity-0 group-hover/play:opacity-20'}`} />
                        <Button
                          onClick={togglePlay}
                          className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-b from-[#1B6B3A] to-[#0D3B1F] hover:from-[#1B6B3A] hover:to-[#124d29] text-white shadow-xl border-4 border-white dark:border-background flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                          disabled={audioLoading}
                        >
                          {audioLoading ? <Loader2 className="h-10 w-10 animate-spin" /> : isPlaying ? <Pause className="h-10 w-10 sm:h-12 sm:w-12" /> : <Play className="h-10 w-10 sm:h-12 sm:w-12 ml-2" />}
                        </Button>
                      </div>

                      <div className="flex-1 w-full text-center sm:text-left min-w-0">
                        <Badge variant="outline" className="mb-4 border-lips-green/30 text-lips-green bg-lips-green/5 text-xs font-semibold tracking-wide">
                          Sourate {currentSurah}/114
                        </Badge>
                        <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 truncate">{currentSurahName}</h3>
                        <p className="font-arabic text-3xl sm:text-4xl text-lips-gold mb-6 truncate" dir="rtl">{currentSurahNameAr}</p>
                        
                        {/* Progress Bar */}
                        <div className="relative group/progress cursor-pointer py-2" onClick={handleSeek}>
                          <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-lips-green to-lips-gold transition-all duration-200 ease-linear" style={{ width: `${progress}%` }} />
                          </div>
                          <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[3px] border-lips-gold rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 transition-all scale-75 group-hover/progress:scale-100" style={{ left: `calc(${progress}% - 10px)` }} />
                        </div>
                        
                        <div className="flex justify-between text-xs sm:text-sm font-semibold text-muted-foreground mt-2">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Controls Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-10 pt-6 border-t border-border/50 gap-6">
                      <div className="flex gap-4">
                        <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentSurah <= 1} className="h-12 w-12 rounded-full border-border hover:bg-muted text-foreground">
                          <SkipBack className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleNext} disabled={currentSurah >= 114} className="h-12 w-12 rounded-full border-border hover:bg-muted text-foreground">
                          <SkipForward className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-full border border-border/50">
                        <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground transition-colors">
                          {isMuted || volume === 0 ? <VolumeX className="h-5 w-5 text-destructive" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        <input type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} className="w-24 sm:w-32 accent-lips-green" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Reciter Card */}
                {selectedReciter && (
                  <Card className="bg-card border-border/50 shadow-md transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lips-green to-[#0D3B1F] flex items-center justify-center text-white text-2xl font-bold shadow-inner shrink-0">
                            {selectedReciter.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] text-lips-gold font-bold uppercase tracking-widest mb-1">En lecture</p>
                            <h4 className="font-bold text-lg sm:text-xl text-foreground truncate">{selectedReciter.name}</h4>
                          </div>
                        </div>

                        {selectedReciter.moshaf.length > 1 && (
                          <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
                            {selectedReciter.moshaf.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => { setSelectedMoshaf(m); if (isPlaying) playSurah(currentSurah, m); }}
                                className={cn('px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm', selectedMoshaf?.id === m.id ? 'bg-foreground text-background scale-105' : 'bg-muted text-muted-foreground hover:bg-muted/80')}
                              >
                                {m.name.replace('Rewayat ', '').replace('Almusshaf ', '')}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              </div>

              {/* Right Column: Reciters List (Sidebar) */}
              <div className="lg:col-span-4 flex flex-col h-[600px] lg:h-auto">
                <Card className="flex flex-col h-full bg-card border-border/50 shadow-md overflow-hidden">
                  <div className="p-5 border-b border-border/50 bg-muted/10">
                    <h4 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                      <Mic className="h-5 w-5 text-lips-gold" />
                      Choisir un Récitateur
                    </h4>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un récitateur..."
                        className="pl-10 h-12 bg-background border-border shadow-sm rounded-xl"
                        value={reciterSearch}
                        onChange={(e) => setReciterSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    {reciterSearchResults.map((reciter) => (
                      <ReciterSearchRow
                        key={reciter.id}
                        reciter={reciter}
                        isSelected={selectedReciter?.id === reciter.id}
                        isPopular={POPULAR_RECITER_IDS.includes(reciter.id)}
                        onClick={() => selectReciter(reciter)}
                      />
                    ))}
                    {reciterSearchResults.length === 0 && (
                      <div className="p-8 text-center flex flex-col items-center">
                        <Search className="h-8 w-8 text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground text-sm font-medium">Aucun récitateur trouvé</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* ===== D. Surah Index ===== */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">Index des Sourates</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Parcourez les 114 sourates du Saint Coran. Cliquez sur une sourate pour la lancer instantanément dans le lecteur.</p>
          </div>

          {/* Search Bar for Surahs */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-lips-green to-lips-gold rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-5 h-6 w-6 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une sourate par nom ou numéro..."
                  className="pl-14 h-16 rounded-full bg-card border-border shadow-md text-lg transition-shadow focus-visible:ring-lips-green"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-10 w-10 text-lips-green animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSurahs.map((surah) => {
                const isActive = currentSurah === surah.id && isPlaying;
                const isCurrent = currentSurah === surah.id;
                const nameAr = SURAH_NAMES_AR[surah.id] || '';
                
                return (
                  <motion.button
                    key={surah.id}
                    onClick={() => { playSurah(surah.id); scrollToPlayer(); }}
                    disabled={!selectedMoshaf}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'relative h-36 rounded-2xl p-6 text-left overflow-hidden transition-all duration-300 border group shadow-sm',
                      isActive ? 'bg-[#1B6B3A] text-white border-[#1B6B3A] shadow-xl shadow-[#1B6B3A]/30' : 
                      isCurrent ? 'bg-lips-gold/10 border-lips-gold/40' : 
                      'bg-card border-border/60 hover:border-lips-green/50 hover:shadow-lg'
                    )}
                  >
                    {/* Watermark Number */}
                    <div className={cn(
                      "absolute -bottom-6 -right-4 text-[100px] font-bold italic pointer-events-none transition-all duration-500",
                      isActive ? "text-white opacity-10" : "text-foreground group-hover:text-lips-green opacity-5 group-hover:opacity-[0.08]"
                    )}>
                      {surah.id}
                    </div>

                    <div className="flex flex-col h-full justify-between relative z-10">
                      <div className="flex items-start justify-between">
                        <div className={cn("text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0", isActive ? "bg-white/20 text-lips-gold" : "bg-muted text-muted-foreground group-hover:bg-lips-green/10 group-hover:text-lips-green")}>
                          {surah.id}
                        </div>
                        <p className={cn("font-arabic text-2xl leading-none", isActive ? "text-lips-gold" : "text-foreground/80 group-hover:text-lips-gold transition-colors")} dir="rtl">{nameAr}</p>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className={cn("text-lg font-bold truncate", isActive ? "text-white" : "text-foreground group-hover:text-lips-green transition-colors")}>{surah.name}</h4>
                        <p className={cn("text-xs uppercase tracking-wider font-bold mt-1", isActive ? "text-white/70" : "text-muted-foreground")}>
                          {surah.makkia ? 'Mecquoise' : 'Médinoise'}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== E. Quran Resources ===== */}
      <section className="py-24 bg-muted/30 relative border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">Ressources Coraniques</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Sites et applications de référence pour la lecture et l'apprentissage.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {quranResources.map((resource, idx) => (
              <a key={idx} href={resource.href} target="_blank" rel="noopener noreferrer" className="block group h-full">
                <Card className="bg-card border-border/50 hover:border-lips-gold/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-lips-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 relative z-10 h-full">
                    <div className={cn("w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner", resource.color)}>
                      <resource.icon className="h-10 w-10" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-lips-gold transition-colors">{resource.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{resource.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
