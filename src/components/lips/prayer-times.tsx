'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Clock, Sun, Sunset, Moon, ChevronDown, ChevronUp, MapPin, X } from 'lucide-react';
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

// ─── Regions list (must match API route) ──────────────────────
const SENEGAL_REGIONS = [
  { key: 'dakar',        label: 'Dakar' },
  { key: 'saint_louis',  label: 'Saint-Louis' },
  { key: 'thiès',        label: 'Thiès' },
  { key: 'louga',        label: 'Louga' },
  { key: 'kaolack',      label: 'Kaolack' },
  { key: 'diourbel',     label: 'Diourbel' },
  { key: 'tambacounda',  label: 'Tambacounda' },
  { key: 'ziguinchor',   label: 'Ziguinchor' },
  { key: 'kolda',        label: 'Kolda' },
  { key: 'matam',        label: 'Matam' },
  { key: 'kédougou',     label: 'Kédougou' },
  { key: 'sédhiou',      label: 'Sédhiou' },
  { key: 'fatick',       label: 'Fatick' },
  { key: 'kaffrine',     label: 'Kaffrine' },
] as const;

// ─── Constants ────────────────────────────────────────────────
const PRAYERS: PrayerInfo[] = [
  { key: 'Fajr',    name: 'Fajr',     nameAr: 'الفجر',   icon: Moon,    color: 'text-sky-300',   bgColor: 'bg-sky-500/25' },
  { key: 'Dhuhr',   name: 'Dhuhr',    nameAr: 'الظهر',   icon: Sun,     color: 'text-yellow-200',bgColor: 'bg-yellow-500/25' },
  { key: 'Asr',     name: 'Asr',      nameAr: 'العصر',   icon: Sun,     color: 'text-orange-300',bgColor: 'bg-orange-500/25' },
  { key: 'Maghrib', name: 'Maghrib',  nameAr: 'المغرب',  icon: Sunset,  color: 'text-red-300',   bgColor: 'bg-red-500/25' },
  { key: 'Isha',    name: 'Isha',     nameAr: 'العشاء',  icon: Moon,    color: 'text-indigo-300',bgColor: 'bg-indigo-500/25' },
];

// ─── Helpers ──────────────────────────────────────────────────
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
  // Only the 5 obligatory prayers (skip Sunrise)
  const prayerKeys: (keyof PrayerData['timings'])[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const times = prayerKeys.map(k => timeToMinutes(timings[k]));
  for (let i = times.length - 1; i >= 0; i--) {
    if (minutes >= times[i]) return i;
  }
  return 0; // Before Fajr → Isha is current
}

function getNextPrayerCountdown(timings: PrayerData['timings']): string {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  // Only the 5 obligatory prayers (skip Sunrise)
  const prayerKeys: (keyof PrayerData['timings'])[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const times = prayerKeys.map(k => timeToMinutes(timings[k]));

  for (let i = 0; i < times.length; i++) {
    if (minutes < times[i]) {
      const diff = times[i] - minutes;
      const h = Math.floor(diff / 60);
      const m = Math.floor(diff % 60);
      if (h > 0) return `${h}h ${m}min`;
      return `${m} min`;
    }
  }
  // After Isha → next is Fajr tomorrow
  const diff = (24 * 60 - minutes) + times[0];
  const h = Math.floor(diff / 60);
  const m = Math.floor(diff % 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
}

// ─── Region Selector Component ────────────────────────────────
function RegionSelector({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      // Also close on Escape
      const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('mousedown', handleClick);
        document.removeEventListener('keydown', handleEsc);
      };
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const selectedLabel = SENEGAL_REGIONS.find(r => r.key === selected)?.label ?? 'Dakar';

  const handleSelect = (key: string) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative z-[60]">
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-[10px] sm:text-xs font-medium"
        aria-label="Changer de région"
      >
        <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-lips-gold flex-shrink-0" />
        <span>{selectedLabel}</span>
        <ChevronDown className={`h-2.5 w-2.5 sm:h-3 sm:w-3 text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Desktop: dropdown anchored to button */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[9999] hidden sm:block bg-[#0f3d22] border border-white/20 rounded-xl shadow-2xl shadow-black/50 w-48 overflow-visible"
              style={{
                top: btnRef.current
                  ? btnRef.current.getBoundingClientRect().bottom + 6
                  : 'auto',
                right: btnRef.current
                  ? window.innerWidth - btnRef.current.getBoundingClientRect().right
                  : 'auto',
              }}
            >
              <div className="p-1.5 max-h-72 overflow-y-auto">
                {SENEGAL_REGIONS.map(r => (
                  <button
                    key={r.key}
                    onClick={() => handleSelect(r.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                      r.key === selected
                        ? 'bg-lips-gold text-[#0a2e18] font-bold'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <MapPin className={`h-3 w-3 flex-shrink-0 ${r.key === selected ? 'text-[#0a2e18]' : 'text-lips-gold'}`} />
                    {r.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Mobile: full-screen overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[9998] bg-black/60 sm:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed bottom-0 left-0 right-0 z-[9999] sm:hidden bg-[#0f3d22] border-t border-white/20 rounded-t-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="text-white font-bold text-sm">Choisir une région</h3>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {SENEGAL_REGIONS.map(r => (
                  <button
                    key={r.key}
                    onClick={() => handleSelect(r.key)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center gap-3 ${
                      r.key === selected
                        ? 'bg-lips-gold text-[#0a2e18] font-bold'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <MapPin className={`h-4 w-4 flex-shrink-0 ${r.key === selected ? 'text-[#0a2e18]' : 'text-lips-gold'}`} />
                    {r.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function PrayerTimesWidget() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [countdown, setCountdown] = useState('');
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hijriDisplay, setHijriDisplay] = useState({ french: '', arabic: '' });
  const [gregorianDate, setGregorianDate] = useState('');

  // Read saved region from localStorage (default: dakar)
  const [region, setRegion] = useState('dakar');

  // Load saved region on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lips-prayer-region');
      if (saved && SENEGAL_REGIONS.some(r => r.key === saved)) {
        setRegion(saved);
      }
    } catch {}
  }, []);

  // Save region to localStorage when it changes
  const handleRegionChange = useCallback((newRegion: string) => {
    setRegion(newRegion);
    try { localStorage.setItem('lips-prayer-region', newRegion); } catch {}
  }, []);

  // Fetch prayer times from API
  const fetchPrayerTimes = useCallback(async (reg: string) => {
    try {
      const res = await fetch(`/api/prayer-times?region=${reg}`);
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
      const regionLabel = SENEGAL_REGIONS.find(r => r.key === reg)?.label ?? 'Dakar';
      setPrayerData({
        date: new Date().toISOString().split('T')[0],
        region: reg,
        regionName: regionLabel,
        timings: { Fajr: '05:42', Sunrise: '06:58', Dhuhr: '13:22', Asr: '16:38', Maghrib: '19:10', Isha: '20:26' },
        fallback: true,
      });
      setHijriDisplay({ french: '7 Dhul Hijjah 1447 H', arabic: '٧ ذو الحجة ١٤٤٧ هـ' });
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchPrayerTimes(region);
    }
  }, [mounted, region, fetchPrayerTimes]);

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
    <div className="bg-[#0a2e18] text-white w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 min-w-0">

        {/* ═══════════════════════════════════════════════════════
            MOBILE VIEW — Compact, high-contrast
        ═══════════════════════════════════════════════════════ */}
        <div className="py-2.5 sm:hidden">
          {/* Row 1: Current prayer + countdown + clock + expand */}
          <div className="flex items-center justify-between gap-2">
            <Link href="/agenda" className="flex items-center gap-2 min-w-0 flex-1" title="Voir le calendrier">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-lips-gold">
                <CurrentIcon className="h-3.5 w-3.5 text-[#0a2e18] flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-[#0a2e18] font-bold text-[11px] leading-tight">{currentPrayerInfo.name}</div>
                  <div className="font-mono text-[11px] text-[#0a2e18]/80 leading-tight font-semibold">{prayerData.timings[currentPrayerInfo.key as keyof typeof prayerData.timings]}</div>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-1 px-2 py-1 bg-white/15 rounded-lg flex-shrink-0">
              <NextIcon className="h-3 w-3 text-white flex-shrink-0" />
              <div className="text-center">
                <div className="text-[9px] text-white/70 leading-tight">Prochaine</div>
                <div className="font-mono text-[11px] font-bold text-white leading-tight">{countdown}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 px-1.5 py-1 flex-shrink-0">
              <Clock className="h-3 w-3 text-lips-gold flex-shrink-0" />
              <span className="font-mono text-[11px] font-semibold">{currentTime}</span>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-white/15 transition-colors touch-manipulation flex-shrink-0"
              aria-label={expanded ? 'Réduire' : 'Voir toutes les prières'}
            >
              {expanded ? <ChevronUp className="h-4 w-4 text-white" /> : <ChevronDown className="h-4 w-4 text-white" />}
            </button>
          </div>

          {/* Row 2: Hijri date + Region selector */}
          <div className="flex items-center justify-between mt-1.5 gap-2">
            <Link href="/agenda" className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <span className="text-white text-[10px] font-semibold truncate">{hijriDisplay.french}</span>
              <span className="font-arabic text-white/80 text-[9px] truncate" dir="rtl">{hijriDisplay.arabic}</span>
            </Link>
            <RegionSelector selected={region} onChange={handleRegionChange} />
          </div>

          {/* Expandable: All 5 prayers */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-5 gap-1.5 pt-3 pb-1">
                  {PRAYERS.map((prayer, index) => {
                    const Icon = prayer.icon;
                    const isCurrent = index === currentPrayer;
                    const time = prayerData.timings[prayer.key as keyof typeof prayerData.timings];
                    return (
                      <div
                        key={prayer.key}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all overflow-hidden ${
                          isCurrent ? 'bg-lips-gold' : 'bg-white/10'
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${isCurrent ? 'text-[#0a2e18]' : prayer.color}`} />
                        <div className="min-w-0 overflow-hidden">
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
            DESKTOP / TABLET VIEW — 3-row layout, no overflow
        ═══════════════════════════════════════════════════════ */}
        <div className="hidden sm:block py-2.5 lg:py-3">
          {/* Top row: Clock + Date | Hijri | Region */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2.5 min-w-0">
            <Link
              href="/agenda"
              className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden flex-shrink"
              title="Voir le calendrier"
            >
              <Clock className="h-4 w-4 text-lips-gold flex-shrink-0" />
              <span className="font-mono text-xs sm:text-sm font-semibold flex-shrink-0">{currentTime}</span>
              <div className="w-px h-4 bg-white/30 flex-shrink-0" />
              <span className="text-white/70 text-[10px] sm:text-xs truncate hidden sm:inline">{gregorianDate}</span>
              <span className="text-white/30 flex-shrink-0 hidden sm:inline">|</span>
              <span className="font-bold text-white text-xs sm:text-sm truncate">{hijriDisplay.french}</span>
              <span className="font-arabic text-white/70 text-[10px] sm:text-[11px] truncate hidden md:inline" dir="rtl">{hijriDisplay.arabic}</span>
            </Link>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-white/10 rounded-lg">
                <NextIcon className="h-3 w-3 text-white" />
                <span className="text-[8px] sm:text-[9px] text-white/70">Prochaine</span>
                <span className="font-mono text-[10px] sm:text-xs font-bold text-white">{countdown}</span>
              </div>
              <RegionSelector selected={region} onChange={handleRegionChange} />
            </div>
          </div>

          {/* Bottom row: 5 prayer pills — compact, evenly spaced */}
          <div className="grid grid-cols-5 gap-1.5 lg:gap-2">
            {PRAYERS.map((prayer, index) => {
              const Icon = prayer.icon;
              const isCurrent = index === currentPrayer;
              const time = prayerData.timings[prayer.key as keyof typeof prayerData.timings];
              return (
                <div
                  key={prayer.key}
                  className={`flex items-center justify-center gap-1.5 px-1.5 py-1.5 lg:px-2.5 rounded-lg transition-all overflow-hidden ${
                    isCurrent
                      ? 'bg-lips-gold shadow-md shadow-lips-gold/30'
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${isCurrent ? 'text-[#0a2e18]' : prayer.color}`} />
                  <div className="min-w-0 overflow-hidden">
                    <div className={`text-[10px] lg:text-xs leading-tight font-semibold truncate ${
                      isCurrent ? 'text-[#0a2e18]' : 'text-white'
                    }`}>
                      {prayer.name}
                    </div>
                    <div className={`font-mono text-[10px] lg:text-[11px] leading-tight font-bold truncate ${
                      isCurrent ? 'text-[#0a2e18]/80' : 'text-white'
                    }`}>
                      {time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
