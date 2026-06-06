'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Clock, Sun, Sunset, Moon, Sunrise, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────
interface PrayerData {
  date: string;
  region: string;
  regionName: string;
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
  hijri?: {
    date: string;
    day: string;
    month: { number: number; en: string; ar: string };
    year: string;
  };
  fallback?: boolean;
}

interface PrayerInfo {
  key: string;
  name: string;
  nameAr: string;
  icon: typeof Moon;
  color: string;
  bgColor: string;
}

// ─── Constants ────────────────────────────────────────────────
const PRAYERS: PrayerInfo[] = [
  { key: 'Fajr',    name: 'Fajr',     nameAr: 'الفجر',   icon: Moon,    color: 'text-sky-300',   bgColor: 'bg-sky-500/25' },
  { key: 'Sunrise', name: 'Chourouk', nameAr: 'الشروق',  icon: Sunrise, color: 'text-amber-300', bgColor: 'bg-amber-500/25' },
  { key: 'Dhuhr',   name: 'Dhuhr',    nameAr: 'الظهر',   icon: Sun,     color: 'text-yellow-200',bgColor: 'bg-yellow-500/25' },
  { key: 'Asr',     name: 'Asr',      nameAr: 'العصر',   icon: Sun,     color: 'text-orange-300',bgColor: 'bg-orange-500/25' },
  { key: 'Maghrib', name: 'Maghrib',  nameAr: 'المغرب',  icon: Sunset,  color: 'text-red-300',   bgColor: 'bg-red-500/25' },
  { key: 'Isha',    name: 'Isha',     nameAr: 'العشاء',  icon: Moon,    color: 'text-indigo-300',bgColor: 'bg-indigo-500/25' },
];

function toArabicNumerals(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map((d) => arabicDigits[parseInt(d)] ?? d).join('');
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function getCurrentPrayerIndex(timings: PrayerData['timings']): number {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const times = [
    timeToMinutes(timings.Fajr),
    timeToMinutes(timings.Sunrise),
    timeToMinutes(timings.Dhuhr),
    timeToMinutes(timings.Asr),
    timeToMinutes(timings.Maghrib),
    timeToMinutes(timings.Isha),
  ];
  for (let i = times.length - 1; i >= 0; i--) {
    if (minutes >= times[i]) return i;
  }
  return 0;
}

function getNextPrayerCountdown(timings: PrayerData['timings']): string {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const times = [
    timeToMinutes(timings.Fajr),
    timeToMinutes(timings.Sunrise),
    timeToMinutes(timings.Dhuhr),
    timeToMinutes(timings.Asr),
    timeToMinutes(timings.Maghrib),
    timeToMinutes(timings.Isha),
  ];

  for (let i = 0; i < times.length; i++) {
    if (minutes < times[i]) {
      const diff = times[i] - minutes;
      const h = Math.floor(diff / 60);
      const m = Math.floor(diff % 60);
      if (h > 0) return `${h}h ${m}min`;
      return `${m} min`;
    }
  }
  // After Isha — next Fajr tomorrow
  const diff = (24 * 60 - minutes) + times[0];
  const h = Math.floor(diff / 60);
  const m = Math.floor(diff % 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
}

// ─── Component ────────────────────────────────────────────────
export default function PrayerTimesWidget() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [countdown, setCountdown] = useState('');
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hijriDisplay, setHijriDisplay] = useState({ french: '', arabic: '' });
  const [gregorianDate, setGregorianDate] = useState('');
  const [region] = useState('dakar');

  const fetchPrayerTimes = useCallback(async () => {
    try {
      const res = await fetch(`/api/prayer-times?region=${region}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPrayerData(json.data);
        if (json.data.hijri) {
          const h = json.data.hijri;
          setHijriDisplay({
            french: `${h.day} ${h.month.en} ${h.year} H`,
            arabic: `${toArabicNumerals(parseInt(h.day))} ${h.month.ar} ${toArabicNumerals(parseInt(h.year))} هـ`,
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch prayer times:', err);
      setPrayerData({
        date: new Date().toISOString().split('T')[0],
        region: 'dakar',
        regionName: 'Dakar',
        timings: { Fajr: '05:42', Sunrise: '06:58', Dhuhr: '13:22', Asr: '16:38', Maghrib: '19:10', Isha: '20:26' },
        fallback: true,
      });
      setHijriDisplay({ french: '7 Dhul Hijjah 1447 H', arabic: '٧ ذو الحجة ١٤٤٧ هـ' });
    }
  }, [region]);

  useEffect(() => {
    setMounted(true);
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  useEffect(() => {
    if (!prayerData) return;
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentPrayer(getCurrentPrayerIndex(prayerData.timings));
      setCountdown(getNextPrayerCountdown(prayerData.timings));
      if (!gregorianDate) {
        setGregorianDate(now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }));
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [prayerData, gregorianDate]);

  // Loading skeleton
  if (!mounted || !prayerData) {
    return (
      <div className="bg-[#0a2e18] text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-center gap-3 text-xs text-white/70">
            <Clock className="h-4 w-4 text-lips-gold animate-pulse" />
            <span>Chargement des horaires de prière...</span>
          </div>
        </div>
      </div>
    );
  }

  const nextPrayer = currentPrayer < PRAYERS.length - 1 ? currentPrayer + 1 : 0;
  const currentPrayerInfo = PRAYERS[currentPrayer];
  const nextPrayerInfo = PRAYERS[nextPrayer];
  const CurrentIcon = currentPrayerInfo.icon;
  const NextIcon = nextPrayerInfo.icon;

  return (
    <div className="bg-[#0a2e18] text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">

        {/* ═══════════════════════════════════════════════════════
            MOBILE VIEW — Compact, high-contrast
        ═══════════════════════════════════════════════════════ */}
        <div className="py-2.5 sm:hidden">
          {/* Row 1: Current prayer badge + countdown + clock */}
          <div className="flex items-center justify-between gap-2">
            {/* Current prayer — gold badge with DARK text for max contrast */}
            <Link href="/agenda" className="flex items-center gap-2 min-w-0 flex-1" title="Voir le calendrier">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-lips-gold">
                <CurrentIcon className="h-3.5 w-3.5 text-[#0a2e18] flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-[#0a2e18] font-bold text-[11px] leading-tight">{currentPrayerInfo.name}</div>
                  <div className="font-mono text-[11px] text-[#0a2e18]/80 leading-tight font-semibold">{prayerData.timings[currentPrayerInfo.key as keyof typeof prayerData.timings]}</div>
                </div>
              </div>
            </Link>

            {/* Countdown — white text on semi-transparent bg */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white/15 rounded-lg">
              <NextIcon className="h-3 w-3 text-white flex-shrink-0" />
              <div className="text-center">
                <div className="text-[9px] text-white/70 leading-tight">Prochaine</div>
                <div className="font-mono text-[11px] font-bold text-white leading-tight">{countdown}</div>
              </div>
            </div>

            {/* Clock */}
            <div className="flex items-center gap-1 px-1.5 py-1">
              <Clock className="h-3 w-3 text-lips-gold flex-shrink-0" />
              <span className="font-mono text-[11px] font-semibold">{currentTime}</span>
            </div>

            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-white/15 transition-colors touch-manipulation"
              aria-label={expanded ? 'Réduire' : 'Voir toutes les prières'}
            >
              {expanded ? <ChevronUp className="h-4 w-4 text-white" /> : <ChevronDown className="h-4 w-4 text-white" />}
            </button>
          </div>

          {/* Row 2: Hijri date + Location */}
          <div className="flex items-center justify-between mt-1.5 gap-2">
            <Link href="/agenda" className="flex items-center gap-1.5 min-w-0">
              <span className="text-white text-[10px] font-semibold truncate">{hijriDisplay.french}</span>
              <span className="font-arabic text-white/80 text-[9px] truncate" dir="rtl">{hijriDisplay.arabic}</span>
            </Link>
            <div className="flex items-center gap-1 text-white/60 flex-shrink-0">
              <MapPin className="h-2.5 w-2.5" />
              <span className="text-[9px]">{prayerData.regionName}</span>
            </div>
          </div>

          {/* Expandable: All 6 prayers */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-3 gap-1.5 pt-3 pb-1">
                  {PRAYERS.map((prayer, index) => {
                    const Icon = prayer.icon;
                    const isCurrent = index === currentPrayer;
                    const time = prayerData.timings[prayer.key as keyof typeof prayerData.timings];
                    return (
                      <div
                        key={prayer.key}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all ${
                          isCurrent
                            ? 'bg-lips-gold'  // Solid gold background for current prayer
                            : 'bg-white/10'
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${isCurrent ? 'text-[#0a2e18]' : prayer.color}`} />
                        <div className="min-w-0">
                          <div className={`text-[10px] leading-tight truncate font-semibold ${
                            isCurrent ? 'text-[#0a2e18]' : 'text-white'
                          }`}>
                            {prayer.name}
                          </div>
                          <div className={`font-mono text-[11px] leading-tight font-bold ${
                            isCurrent ? 'text-[#0a2e18]/80' : 'text-white'
                          }`}>
                            {time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════════════════════════════
            DESKTOP / TABLET VIEW — Full bar, high-contrast
        ═══════════════════════════════════════════════════════ */}
        <div className="hidden sm:flex items-center justify-between gap-4 py-3 lg:py-3.5">
          {/* Date & Clock */}
          <Link
            href="/agenda"
            className="flex items-center gap-2 sm:gap-3 group flex-shrink-0"
            title="Voir le calendrier"
          >
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-lips-gold" />
              <span className="font-mono text-sm font-semibold">{currentTime}</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-xs">{gregorianDate}</span>
                <span className="text-white/30">|</span>
                <span className="font-bold text-white text-sm">{hijriDisplay.french}</span>
              </div>
              <span className="font-arabic text-white/70 text-[11px] leading-none" dir="rtl">
                {hijriDisplay.arabic}
              </span>
            </div>
          </Link>

          {/* Prayer Times Bar — each prayer in a pill */}
          <div className="flex items-center gap-1.5 md:gap-2 lg:gap-2.5 flex-1 justify-center">
            {PRAYERS.map((prayer, index) => {
              const Icon = prayer.icon;
              const isCurrent = index === currentPrayer;
              const time = prayerData.timings[prayer.key as keyof typeof prayerData.timings];
              return (
                <div
                  key={prayer.key}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-lips-gold shadow-md shadow-lips-gold/30' // Solid gold pill
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${isCurrent ? 'text-[#0a2e18]' : prayer.color}`} />
                  <div>
                    <div className={`text-xs leading-tight font-semibold ${
                      isCurrent ? 'text-[#0a2e18]' : 'text-white'
                    }`}>
                      {prayer.name}
                    </div>
                    <div className={`font-mono text-[11px] leading-tight font-bold ${
                      isCurrent ? 'text-[#0a2e18]/80' : 'text-white'
                    }`}>
                      {time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Countdown + Location */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/15 rounded-lg">
              <NextIcon className="h-3.5 w-3.5 text-white" />
              <div>
                <div className="text-[9px] text-white/70 leading-tight">Prochaine prière</div>
                <div className="font-mono text-xs font-bold text-white leading-tight">{countdown}</div>
              </div>
            </div>
            <div className="text-xs text-white/60 flex items-center gap-1 hidden lg:flex">
              <MapPin className="h-3 w-3" />
              {prayerData.regionName}, Sénégal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
