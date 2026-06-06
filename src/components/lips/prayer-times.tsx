'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sun, Sunset, Moon, Sunrise } from 'lucide-react';

// Dakar prayer times (approximate for 2025)
const PRAYER_SCHEDULE = [
  { name: 'Fajr', nameAr: 'الفجر', icon: Moon, time: '05:42', color: 'text-indigo-400' },
  { name: 'Chourouk', nameAr: 'الشروق', icon: Sunrise, time: '06:58', color: 'text-orange-400' },
  { name: 'Dhuhr', nameAr: 'الظهر', icon: Sun, time: '13:22', color: 'text-yellow-400' },
  { name: 'Asr', nameAr: 'العصر', icon: Sun, time: '16:38', color: 'text-amber-400' },
  { name: 'Maghrib', nameAr: 'المغرب', icon: Sunset, time: '19:10', color: 'text-orange-500' },
  { name: 'Isha', nameAr: 'العشاء', icon: Moon, time: '20:26', color: 'text-blue-400' },
];

function getHijriDate(): string {
  // Approximate Hijri date calculation
  const now = new Date();
  const islamicEpoch = new Date(622, 6, 16);
  const diff = now.getTime() - islamicEpoch.getTime();
  const islamicDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const lunarCycles = islamicDays / 29.53058867;
  const islamicYear = Math.floor(lunarCycles / 12) + 1;
  const islamicMonthNum = Math.floor(lunarCycles % 12) + 1;
  const islamicDay = Math.floor((lunarCycles % 1) * 29.53) + 1;

  const months = [
    'Muharram', 'Safar', 'Rabi\u02BF al-Awwal', 'Rabi\u02BF al-Thani',
    'Jumada al-Ula', 'Jumada al-Thania', 'Rajab', 'Sha\u02BFban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\u02BFdah', 'Dhu al-Hijjah'
  ];

  return `${islamicDay} ${months[islamicMonthNum - 1]} ${islamicYear} H`;
}

function getCurrentPrayerIndex(): number {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const times = PRAYER_SCHEDULE.map(p => {
    const [h, m] = p.time.split(':').map(Number);
    return h * 60 + m;
  });

  for (let i = times.length - 1; i >= 0; i--) {
    if (minutes >= times[i]) return i;
  }
  return 0;
}

export default function PrayerTimesWidget() {
  const [currentPrayer, setCurrentPrayer] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [hijriDate] = useState(getHijriDate());

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentPrayer(getCurrentPrayerIndex());
    };

    update();
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-lips-green-dark via-lips-green to-lips-green-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Hijri Date & Clock */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-lips-gold" />
              <span className="font-mono text-xs sm:text-sm">{currentTime}</span>
            </div>
            <div className="w-px h-4 bg-white/20 hidden sm:block" />
            <div className="text-xs sm:text-sm">
              <span className="text-white/50 text-[10px] sm:text-xs">Hijri :</span>{' '}
              <span className="font-semibold text-lips-gold text-xs sm:text-sm">{hijriDate}</span>
            </div>
          </div>

          {/* Prayer Times — grid on mobile, flex on desktop */}
          <div className="grid grid-cols-3 sm:flex sm:items-center sm:gap-2 md:gap-5 gap-1.5 sm:gap-3 w-full sm:w-auto">
            {PRAYER_SCHEDULE.map((prayer, index) => (
              <div
                key={prayer.name}
                className={`flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-2 sm:py-1 rounded-md transition-colors ${
                  index === currentPrayer
                    ? 'bg-white/15 ring-1 ring-lips-gold/50'
                    : 'hover:bg-white/5'
                }`}
              >
                <prayer.icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${index === currentPrayer ? 'text-lips-gold' : prayer.color}`} />
                <div className="text-[10px] sm:text-xs min-w-0">
                  <div className={`${index === currentPrayer ? 'text-lips-gold font-semibold' : 'text-white/70'} truncate`}>
                    {prayer.name}
                  </div>
                  <div className="font-mono text-[10px] sm:text-[11px] text-white/90">{prayer.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="text-[10px] sm:text-xs text-white/40 hidden lg:flex items-center gap-1">
            <Sun className="h-3 w-3" />
            Dakar, Sénégal
          </div>
        </div>
      </div>
    </div>
  );
}
