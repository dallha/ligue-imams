'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  List,
  Star,
  MapPin,
  Clock,
  Filter,
  MoonStar,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/lips/i18n/language-context';

// ─── Hijri Calculation ───────────────────────────────────────────

function gregorianToHijri(date: Date): { year: number; month: number; day: number } {
  const islamicEpoch = new Date(622, 6, 16);
  const diff = date.getTime() - islamicEpoch.getTime();
  const islamicDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const lunarCycles = islamicDays / 29.53058867;
  const islamicYear = Math.floor(lunarCycles / 12) + 1;
  const islamicMonth = Math.floor(lunarCycles % 12) + 1;
  const islamicDay = Math.floor((lunarCycles % 1) * 29.53) + 1;
  return { year: islamicYear, month: islamicMonth, day: islamicDay };
}

// Approximate Hijri-to-Gregorian: iterate forward until match
function hijriToGregorian(hYear: number, hMonth: number, hDay: number): Date | null {
  // Start from an approximate Gregorian date
  const approxDays = (hYear - 1) * 354.36667 + (hMonth - 1) * 29.53058867 + hDay;
  const epoch = new Date(622, 6, 16);
  const approxMs = epoch.getTime() + approxDays * 86400000;
  let candidate = new Date(Math.floor(approxMs));
  // Search within a 60-day window
  for (let i = -60; i <= 60; i++) {
    const d = new Date(candidate.getTime() + i * 86400000);
    const h = gregorianToHijri(d);
    if (h.year === hYear && h.month === hMonth && h.day === hDay) {
      return d;
    }
  }
  return null;
}

// ─── Constants ───────────────────────────────────────────────────

const HIJRI_MONTHS_FR = [
  'Muharram', 'Safar', 'Rabi\u02BF al-Awwal', 'Rabi\u02BF al-Thani',
  'Jumada al-Ula', 'Jumada al-Thania', 'Rajab', 'Sha\u02BFban',
  'Ramadan', 'Shawwal', 'Dhu al-Qi\u02BFdah', 'Dhu al-Hijjah',
];

const HIJRI_MONTHS_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

// Locale-aware helpers (no more hardcoded French arrays)
function getGregorianMonthNames(locale: string): string[] {
  const months: string[] = [];
  for (let m = 0; m < 12; m++) {
    const d = new Date(2026, m, 1);
    months.push(d.toLocaleDateString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR', { month: 'long' }));
  }
  return months;
}

function getWeekdayShortNames(locale: string): string[] {
  const names: string[] = [];
  // Monday=0 through Sunday=6
  const baseDate = new Date(2026, 0, 5); // Monday Jan 5 2026
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate.getTime() + i * 86400000);
    names.push(d.toLocaleDateString(locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR', { weekday: 'short' }));
  }
  return names;
}

function getLocaleStr(locale: string): string {
  return locale === 'ar' ? 'ar-SN' : locale === 'en' ? 'en-SN' : 'fr-FR';
}

// Arabic numeral conversion
function toArabicNumerals(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map((d) => arabicDigits[parseInt(d)] ?? d)
    .join('');
}

// ─── Islamic Events ──────────────────────────────────────────────

interface IslamicEvent {
  hijriMonth: number;
  hijriDay: number;
  nameFr: string;
  nameAr: string;
  dotColor: string; // tailwind class for the dot
  dotType: 'dot' | 'star';
}

const ISLAMIC_EVENTS: IslamicEvent[] = [
  { hijriMonth: 1, hijriDay: 1, nameFr: 'Nouvel An Islamique', nameAr: 'رأس السنة الهجرية', dotColor: 'bg-lips-green', dotType: 'dot' },
  { hijriMonth: 3, hijriDay: 12, nameFr: 'Mawlid an-Nabawi', nameAr: 'المولد النبوي', dotColor: 'bg-lips-green', dotType: 'dot' },
  { hijriMonth: 7, hijriDay: 27, nameFr: 'Al-Isra wal-Mi\u02BFraj', nameAr: 'الإسراء والمعراج', dotColor: 'bg-lips-gold', dotType: 'dot' },
  { hijriMonth: 8, hijriDay: 15, nameFr: 'Nuit du Destin (Sha\u02BFban)', nameAr: 'ليلة البراءة', dotColor: 'bg-blue-500', dotType: 'dot' },
  { hijriMonth: 9, hijriDay: 1, nameFr: 'Début du Ramadan', nameAr: 'بداية رمضان', dotColor: 'bg-lips-green', dotType: 'dot' },
  { hijriMonth: 9, hijriDay: 27, nameFr: 'Nuit du Destin (Ramadan)', nameAr: 'ليلة القدر', dotColor: 'bg-lips-gold', dotType: 'dot' },
  { hijriMonth: 10, hijriDay: 1, nameFr: 'Aïd al-Fitr', nameAr: 'عيد الفطر', dotColor: 'bg-lips-gold', dotType: 'star' },
  { hijriMonth: 12, hijriDay: 10, nameFr: 'Aïd al-Adha', nameAr: 'عيد الأضحى', dotColor: 'bg-lips-gold', dotType: 'star' },
];

function getIslamicEventsForHijriDate(hMonth: number, hDay: number): IslamicEvent[] {
  return ISLAMIC_EVENTS.filter((e) => e.hijriMonth === hMonth && e.hijriDay === hDay);
}

// ─── LIPS Events ─────────────────────────────────────────────────

type EventCategory = 'Assemblée' | 'Formation' | 'Colloque' | 'Conférence' | 'Conseil' | 'LIPS' | 'ISLAMIQUE' | 'FORMATION' | 'COMMUNAUTE';

interface LIPSEvent {
  id: number;
  title: string;
  date: Date;
  dateEnd?: Date;
  hijriDate?: string; // e.g., "1 Ramadan 1447"
  location: string;
  category: string;
  description: string;
  published: boolean;
}

const HARDCODED_LIPS_EVENTS: LIPSEvent[] = [
  {
    id: 1,
    title: 'Assemblée Générale LIPS',
    date: new Date(2026, 2, 15),
    location: 'Dakar',
    category: 'Assemblée',
    description: 'Assemblée générale annuelle de la LIPS réunissant tous les délégués régionaux pour le bilan et les perspectives.',
    published: true,
  },
  {
    id: 2,
    title: 'Séminaire de Formation des Imams',
    date: new Date(2026, 3, 20),
    dateEnd: new Date(2026, 3, 22),
    location: 'Thiès',
    category: 'Formation',
    description: 'Formation intensive de trois jours sur les pratiques imamiques, la gestion communautaire et le leadership religieux.',
    published: true,
  },
  {
    id: 3,
    title: 'Colloque sur la Paix Sociale',
    date: new Date(2026, 4, 10),
    location: 'Saint-Louis',
    category: 'Colloque',
    description: 'Colloque intercommunautaire sur le rôle des imams dans la promotion de la paix sociale et la cohésion nationale.',
    published: true,
  },
  {
    id: 4,
    title: 'Conférence Fiqh Malékite',
    date: new Date(2026, 5, 5),
    location: 'Kaolack',
    category: 'Conférence',
    description: 'Conférence académique sur le rite malékite et son application dans le contexte sénégalais contemporain.',
    published: true,
  },
  {
    id: 5,
    title: 'Journée de l\u02BFImam',
    date: new Date(2026, 5, 27), // approx 1 Ramadan 1447
    hijriDate: '1 Ramadan 1447',
    location: 'Dakar',
    category: 'Assemblée',
    description: 'Journée spéciale dédiée aux imams du Sénégal, avec remise de prix et reconnaissance du dévouement.',
    published: true,
  },
  {
    id: 6,
    title: 'Formation Da\u02BFawa',
    date: new Date(2026, 6, 27), // approx 15 Shawwal 1447
    hijriDate: '15 Shawwal 1447',
    location: 'Touba',
    category: 'Formation',
    description: 'Formation sur les méthodes de prédication et de da\u02BFawa adaptées au contexte sénégalais.',
    published: true,
  },
  {
    id: 7,
    title: 'Conseil National des Imams',
    date: new Date(2026, 11, 20),
    location: 'Dakar',
    category: 'Conseil',
    description: 'Réunion du Conseil National des Imams pour les décisions stratégiques et les orientations de la LIPS.',
    published: true,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Assemblée: 'bg-lips-green/10 text-lips-green border-lips-green/20',
  Formation: 'bg-lips-emerald/10 text-lips-emerald border-lips-emerald/20',
  Colloque: 'bg-blue-50 text-blue-700 border-blue-200',
  Conférence: 'bg-lips-gold/10 text-lips-gold border-lips-gold/20',
  Conseil: 'bg-purple-50 text-purple-700 border-purple-200',
  LIPS: 'bg-lips-green/10 text-lips-green border-lips-green/20',
  ISLAMIQUE: 'bg-lips-gold/10 text-lips-gold border-lips-gold/20',
  FORMATION: 'bg-lips-emerald/10 text-lips-emerald border-lips-emerald/20',
  COMMUNAUTE: 'bg-blue-50 text-blue-700 border-blue-200',
};

const CATEGORY_DOT_COLORS: Record<string, string> = {
  Assemblée: 'bg-lips-green',
  Formation: 'bg-lips-emerald',
  Colloque: 'bg-blue-500',
  Conférence: 'bg-lips-gold',
  Conseil: 'bg-purple-500',
  LIPS: 'bg-lips-green',
  ISLAMIQUE: 'bg-lips-gold',
  FORMATION: 'bg-lips-emerald',
  COMMUNAUTE: 'bg-blue-500',
};

// ─── Helper functions ─────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  // Convert from Sunday=0 to Monday=0
  return day === 0 ? 6 : day - 1;
}

function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(getLocaleStr(locale), { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(date: Date, locale: string): string {
  return date.toLocaleDateString(getLocaleStr(locale), { day: 'numeric', month: 'short' });
}

function daysUntil(date: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// ─── Calendar Grid Component ──────────────────────────────────────

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  type: 'gregorian' | 'hijri';
  onNavigate: (direction: 'prev' | 'next') => void;
}

function CalendarGrid({ year, month, type, onNavigate, lipsEvents }: CalendarGridProps & { lipsEvents?: LIPSEvent[] }) {
  const { p, locale } = useLanguage();
  const today = new Date();
  const todayHijri = gregorianToHijri(today);

  const GREGORIAN_MONTHS = getGregorianMonthNames(locale);
  const WEEKDAYS_SHORT = getWeekdayShortNames(locale);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthName = type === 'gregorian'
    ? GREGORIAN_MONTHS[month]
    : HIJRI_MONTHS_FR[month];

  const monthNameAr = type === 'hijri' ? HIJRI_MONTHS_AR[month] : undefined;

  // Build array of day cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Card className="border-border/50 bg-white/80 backdrop-blur-sm overflow-hidden">
      {/* Month header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-lips-green-dark to-lips-green text-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('prev')}
          className="h-8 w-8 text-white hover:bg-white/10"
          aria-label={p.agendaComp.prevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <div className="font-semibold text-sm">{monthName} {type === 'gregorian' ? year : ''}</div>
          {monthNameAr && (
            <div className="font-arabic text-lips-gold text-xs">{monthNameAr} {type === 'hijri' ? toArabicNumerals(year) : ''}</div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('next')}
          className="h-8 w-8 text-white hover:bg-white/10"
          aria-label={p.agendaComp.nextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-2 sm:p-3">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-0 mb-1">
          {(type === 'hijri' && locale === 'ar' ? getWeekdayShortNames('ar') : WEEKDAYS_SHORT).map((day, i) => (
            <div
              key={i}
              className="text-center text-[10px] sm:text-xs font-medium text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-0">
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }

            const cellDate = new Date(year, month, day);
            const hijri = gregorianToHijri(cellDate);
            const isToday = isSameDay(cellDate, today);

            // Check for Islamic events on this date
            const eventsOnDay = getIslamicEventsForHijriDate(hijri.month, hijri.day);

            // Check for LIPS events on this date
            const lipsEventsOnDay = (lipsEvents || HARDCODED_LIPS_EVENTS).filter((e) => {
              if (e.dateEnd) {
                return cellDate >= new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate()) &&
                       cellDate <= new Date(e.dateEnd.getFullYear(), e.dateEnd.getMonth(), e.dateEnd.getDate());
              }
              return isSameDay(e.date, cellDate);
            });

            return (
              <div
                key={`day-${day}`}
                className={`
                  relative aspect-square flex flex-col items-center justify-center text-xs sm:text-sm
                  rounded-md transition-colors cursor-default
                  ${isToday ? 'ring-2 ring-lips-gold bg-lips-gold/5' : 'hover:bg-lips-green/5'}
                `}
              >
                {/* Gregorian day number */}
                <span className={`leading-none ${isToday ? 'font-bold text-lips-gold' : ''}`}>
                  {day}
                </span>

                {/* Hijri day number (smaller, on gregorian calendar) */}
                {type === 'gregorian' && (
                  <span className="text-[8px] sm:text-[9px] text-lips-green/60 leading-none mt-0.5">
                    {hijri.day}
                  </span>
                )}

                {/* Hijri day number (on hijri calendar, show gregorian) */}
                {type === 'hijri' && (
                  <span className="text-[8px] sm:text-[9px] text-muted-foreground/50 leading-none mt-0.5">
                    {cellDate.getDate()}
                  </span>
                )}

                {/* Islamic event dots */}
                {eventsOnDay.length > 0 && (
                  <div className="absolute bottom-0.5 flex items-center gap-0.5">
                    {eventsOnDay.map((ev, idx) =>
                      ev.dotType === 'star' ? (
                        <Star key={idx} className={`h-2 w-2 sm:h-2.5 sm:w-2.5 ${ev.dotColor} fill-current`} />
                      ) : (
                        <span key={idx} className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${ev.dotColor}`} />
                      )
                    )}
                  </div>
                )}

                {/* LIPS event dots */}
                {lipsEventsOnDay.length > 0 && (
                  <div className="absolute top-0.5 right-0.5">
                    <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${CATEGORY_DOT_COLORS[lipsEventsOnDay[0].category]}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Islamic Events List ──────────────────────────────────────────

function IslamicEventsList() {
  const { p, locale } = useLanguage();
  const today = new Date();
  const todayHijri = gregorianToHijri(today);

  // Compute upcoming Islamic events
  const upcomingEvents = useMemo(() => {
    const events: {
      event: IslamicEvent;
      gregorianDate: Date;
      daysAway: number;
      hijriYear: number;
    }[] = [];

    // Check current hijri year and next year
    for (const event of ISLAMIC_EVENTS) {
      for (let y = todayHijri.year; y <= todayHijri.year + 1; y++) {
        const gDate = hijriToGregorian(y, event.hijriMonth, event.hijriDay);
        if (gDate) {
          const daysAway = daysUntil(gDate);
          if (daysAway >= -1) { // include today and future
            events.push({ event, gregorianDate: gDate, daysAway, hijriYear: y });
          }
        }
      }
    }

    // Sort by days away
    events.sort((a, b) => a.daysAway - b.daysAway);

    // Remove duplicates (keep the nearest occurrence)
    const seen = new Set<string>();
    return events.filter((e) => {
      const key = `${e.event.hijriMonth}-${e.event.hijriDay}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 6);
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-lips-green-dark flex items-center gap-2">
        <MoonStar className="h-5 w-5 text-lips-gold" />
        {p.agendaComp.upcomingIslamic}
      </h3>
      <div className="space-y-2">
        {upcomingEvents.map(({ event, gregorianDate, daysAway, hijriYear }) => (
          <motion.div
            key={`${event.hijriMonth}-${event.hijriDay}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/80 border border-border/50 hover:border-lips-gold/30 hover:shadow-sm transition-all"
          >
            {/* Event dot */}
            {event.dotType === 'star' ? (
              <Star className={`h-5 w-5 ${event.dotColor} fill-current shrink-0`} />
            ) : (
              <span className={`h-3 w-3 rounded-full ${event.dotColor} shrink-0`} />
            )}

            {/* Event info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-lips-green-dark truncate">
                  {event.nameAr}
                </span>
                <span className="font-arabic text-xs text-lips-gold shrink-0">
                  {event.nameAr}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {event.hijriDay} {HIJRI_MONTHS_FR[event.hijriMonth - 1]} {hijriYear} H — {formatDateShort(gregorianDate, locale)}
              </div>
            </div>

            {/* Countdown */}
            <div className="shrink-0 text-right">
              {daysAway <= 0 ? (
                <Badge className="bg-lips-gold text-white text-xs">{p.agendaComp.today}</Badge>
              ) : daysAway <= 7 ? (
                <Badge className="bg-lips-green text-white text-xs">{p.agendaComp.inDays.replace('{n}', String(daysAway))}</Badge>
              ) : (
                <span className="text-xs text-muted-foreground font-medium">
                  {p.agendaComp.days.replace('{n}', String(daysAway))}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── LIPS Events List View ────────────────────────────────────────

function LIPSEventsListView({ filter, lipsEvents }: { filter: string; lipsEvents?: LIPSEvent[] }) {
  const { p, locale } = useLanguage();
  const events = lipsEvents || HARDCODED_LIPS_EVENTS;
  const filteredEvents = useMemo(() => {
    if (filter === p.agendaComp.filterAll) return events;
    return events.filter((e) => e.category === filter);
  }, [filter, p.agendaComp.filterAll, events]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredEvents]);

  return (
    <div className="space-y-4">
      {sortedEvents.map((event, index) => {
        const hijri = gregorianToHijri(event.date);
        const daysAway = daysUntil(event.date);

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="group hover:shadow-lg hover:shadow-lips-green/5 transition-all duration-300 border-border/50 bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Date column */}
                <div className="flex sm:flex-col items-center justify-center gap-1 sm:gap-0 p-4 sm:p-6 bg-lips-green-dark text-white sm:min-w-[120px]">
                  <span className="text-2xl sm:text-3xl font-bold">
                    {event.date.getDate()}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-lips-gold">
                    {event.date.toLocaleDateString(getLocaleStr(locale), { month: 'short' })}
                  </span>
                  <span className="text-[10px] text-white/50">
                    {event.date.getFullYear()}
                  </span>
                </div>

                {/* Content */}
                <CardContent className="flex-1 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs border ${CATEGORY_COLORS[event.category]}`}>
                          {event.category}
                        </Badge>
                        {daysAway <= 30 && daysAway >= 0 && (
                          <Badge variant="outline" className="text-xs border-lips-gold/30 text-lips-gold">
                            {p.agendaComp.inDays.replace('{n}', String(daysAway))}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-lips-green-dark text-base mb-1">
                        {event.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.dateEnd
                            ? `${formatDateShort(event.date, locale)} — ${formatDateShort(event.dateEnd, locale)}`
                            : formatDate(event.date, locale)}
                        </span>
                        <span className="font-arabic text-lips-gold text-xs">
                          {event.hijriDate || `${hijri.day} ${HIJRI_MONTHS_FR[hijri.month - 1]} ${hijri.year} H`}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Legend ────────────────────────────────────────────────────────

function CalendarLegend() {
  const { p } = useLanguage();
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-3">
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-lips-green" /> {p.agendaComp.legend.islamicDate}
      </span>
      <span className="flex items-center gap-1">
        <Star className="h-2.5 w-2.5 text-lips-gold fill-current" /> {p.agendaComp.legend.aid}
      </span>
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-lips-gold" /> {p.agendaComp.legend.islamicEvent}
      </span>
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-lips-emerald" /> {p.agendaComp.legend.lipsEvent}
      </span>
      <span className="flex items-center gap-1">
        <span className="ring-2 ring-lips-gold rounded h-2 w-2" /> {p.agendaComp.today}
      </span>
    </div>
  );
}

// ─── Main AgendaSection ───────────────────────────────────────────

export default function AgendaSection() {
  const { p, locale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState(p.agendaComp.filterAll);
  const [dbEvents, setDbEvents] = useState<LIPSEvent[]>([]);

  // Fetch events from DB
  useEffect(() => {
    fetch('/api/public/agenda')
      .then(r => r.json())
      .then(data => {
        if (data.data?.length > 0) {
          const events: LIPSEvent[] = data.data.map((e: any) => ({
            id: e.id,
            title: e.titre,
            date: new Date(e.dateDebut),
            dateEnd: e.dateFin ? new Date(e.dateFin) : undefined,
            location: e.lieu || '',
            category: e.type || 'LIPS',
            description: e.description || '',
            published: e.published,
          }));
          setDbEvents(events);
        }
      })
      .catch(() => {});
  }, []);

  const lipsEvents = dbEvents.length > 0 ? dbEvents : HARDCODED_LIPS_EVENTS;

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const currentHijri = gregorianToHijri(new Date(currentYear, currentMonth, 15));
  const hijriYear = currentHijri.year;
  const hijriMonth = currentHijri.month - 1; // 0-indexed

  function navigateMonth(direction: 'prev' | 'next') {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (direction === 'prev') {
        d.setMonth(d.getMonth() - 1);
      } else {
        d.setMonth(d.getMonth() + 1);
      }
      return d;
    });
  }

  const filterOptions = [p.agendaComp.filterAll, 'Assemblée', 'Formation', 'Colloque', 'Conférence'];

  return (
    <section
      ref={sectionRef}
      id="agenda"
      className="py-12 sm:py-20 lg:py-28 bg-lips-cream relative overflow-hidden"
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-10" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            {p.agendaComp.sectionTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            {p.agendaComp.sectionTitle}
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            {p.agendaComp.sectionDesc}
          </p>
        </motion.div>

        {/* View toggle + filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          {/* View toggle */}
          <div className="flex items-center bg-white rounded-lg border border-border/50 p-1 shadow-sm">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className={
                viewMode === 'calendar'
                  ? 'bg-lips-green hover:bg-lips-green-dark text-white gap-1.5'
                  : 'gap-1.5 text-muted-foreground'
              }
            >
              <CalendarDays className="h-4 w-4" />
              {p.agendaComp.calendar}
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={
                viewMode === 'list'
                  ? 'bg-lips-green hover:bg-lips-green-dark text-white gap-1.5'
                  : 'gap-1.5 text-muted-foreground'
              }
            >
              <List className="h-4 w-4" />
              {p.agendaComp.list}
            </Button>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1.5">
              {filterOptions.map((opt) => (
                <Button
                  key={opt}
                  variant={filter === opt ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(opt)}
                  className={
                    filter === opt
                      ? 'bg-lips-green hover:bg-lips-green-dark text-white text-xs h-7'
                      : 'text-xs h-7 border-border/50'
                  }
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Calendar view */}
        {viewMode === 'calendar' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dual Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <CalendarGrid
                year={currentYear}
                month={currentMonth}
                type="gregorian"
                onNavigate={navigateMonth}
                lipsEvents={lipsEvents}
              />
              <CalendarGrid
                year={hijriYear}
                month={hijriMonth}
                type="hijri"
                onNavigate={navigateMonth}
                lipsEvents={lipsEvents}
              />
            </div>

            {/* Legend */}
            <CalendarLegend />

            {/* Islamic Events */}
            <div className="mt-8">
              <IslamicEventsList />
            </div>

            {/* LIPS Events in calendar view (compact) */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-lips-green-dark flex items-center gap-2 mb-4">
                <CalendarDays className="h-5 w-5 text-lips-green" />
                {p.agendaComp.upcomingLips}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lipsEvents
                  .filter((e) => filter === p.agendaComp.filterAll || e.category === filter)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event, index) => {
                    const hijri = gregorianToHijri(event.date);
                    const daysAway = daysUntil(event.date);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="group hover:shadow-md transition-all duration-200 border-border/50 bg-white/80">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col items-center justify-center bg-lips-green-dark text-white rounded-lg px-2 py-1.5 min-w-[48px]">
                                <span className="text-lg font-bold leading-none">{event.date.getDate()}</span>
                                <span className="text-[9px] uppercase text-lips-gold leading-none mt-0.5">
                                  {event.date.toLocaleDateString(getLocaleStr(locale), { month: 'short' })}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Badge className={`text-[10px] border px-1.5 py-0 ${CATEGORY_COLORS[event.category]}`}>
                                    {event.category}
                                  </Badge>
                                  {daysAway >= 0 && daysAway <= 30 && (
                                    <span className="text-[10px] text-lips-gold font-medium">
                                      {p.agendaComp.inDays.replace('{n}', String(daysAway))}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-semibold text-sm text-lips-green-dark truncate">
                                  {event.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                  <span className="font-arabic text-lips-gold text-[10px]">
                                    {event.hijriDate || `${hijri.day} ${HIJRI_MONTHS_FR[hijri.month - 1]} ${hijri.year} H`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}

        {/* List view */}
        {viewMode === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LIPSEventsListView filter={filter} lipsEvents={lipsEvents} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
