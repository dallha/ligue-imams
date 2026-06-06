'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';
import { Sun, Moon, Monitor, Sunrise } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/lips/i18n/language-context';

// ─── Auto Day/Night Logic ────────────────────────────────────────
// Day:   06:00 → 19:00  → light
// Night: 19:00 → 06:00  → dark
// Uses Dakar timezone (Africa/Dakar = UTC+0)
const DAY_START_HOUR = 6;
const NIGHT_START_HOUR = 19;

function isDaytimeInDakar(): boolean {
  const hour = new Date().toLocaleTimeString('en-GB', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'Africa/Dakar',
  });
  const h = parseInt(hour, 10);
  return h >= DAY_START_HOUR && h < NIGHT_START_HOUR;
}

// How many ms until the next day/night transition
function msUntilNextTransition(): number {
  const now = new Date();
  const dakarNow = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Dakar' }));
  const currentHour = dakarNow.getHours();
  const currentMin = dakarNow.getMinutes();
  const currentSec = dakarNow.getSeconds();

  let targetHour: number;
  if (currentHour < DAY_START_HOUR) {
    targetHour = DAY_START_HOUR;
  } else if (currentHour < NIGHT_START_HOUR) {
    targetHour = NIGHT_START_HOUR;
  } else {
    targetHour = DAY_START_HOUR + 24; // tomorrow
  }

  const currentMs = (currentHour * 3600 + currentMin * 60 + currentSec) * 1000;
  const targetMs = targetHour * 3600 * 1000;
  return targetMs - currentMs;
}

type ThemeMode = 'light' | 'dark' | 'system' | 'auto';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ─── ALL hooks MUST be called before any conditional return ───

  const handleSelect = useCallback((mode: ThemeMode) => {
    if (mode === 'auto') {
      const dayTime = isDaytimeInDakar();
      setTheme(dayTime ? 'light' : 'dark');
      try { localStorage.setItem('lips-theme-mode', 'auto'); } catch {}
    } else {
      setTheme(mode);
      try { localStorage.setItem('lips-theme-mode', mode); } catch {}
    }
    setOpen(false);
  }, [setTheme]);

  // ─── Auto day/night scheduler ───────────────────────────────
  useEffect(() => {
    if (theme !== 'auto') return;

    const applyAutoTheme = () => {
      const dayTime = isDaytimeInDakar();
      setTheme(dayTime ? 'light' : 'dark');
      try { localStorage.setItem('lips-theme-mode', 'auto'); } catch {}
    };

    applyAutoTheme();

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const ms = msUntilNextTransition();
      timeoutId = setTimeout(() => {
        applyAutoTheme();
        scheduleNext();
      }, ms);
    };

    scheduleNext();

    const intervalId = setInterval(applyAutoTheme, 60_000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [theme, setTheme]);

  // On mount, restore auto mode if previously set
  useEffect(() => {
    setMounted(true);
    try {
      const savedMode = localStorage.getItem('lips-theme-mode');
      if (savedMode === 'auto') {
        setTheme('auto');
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Early return AFTER all hooks ───────────────────────────
  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-muted/50 animate-pulse" />
    );
  }

  const isAutoMode = (() => {
    try { return localStorage.getItem('lips-theme-mode') === 'auto'; } catch { return false; }
  })();

  const options: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: t.common.light, icon: Sun },
    { value: 'dark', label: t.common.dark, icon: Moon },
    { value: 'auto', label: t.common.auto, icon: Sunrise },
    { value: 'system', label: t.common.system, icon: Monitor },
  ];

  const activeMode: ThemeMode = isAutoMode ? 'auto' : (theme as ThemeMode) || 'light';

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (activeMode === 'light') handleSelect('dark');
          else if (activeMode === 'dark') handleSelect('auto');
          else handleSelect('light');
        }}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-lips-green/5 hover:bg-lips-green/10 border border-lips-green/10 hover:border-lips-green/20 transition-all"
        aria-label={t.common.theme}
        title={`${t.common.theme} — ${activeMode === 'auto' ? t.common.auto : activeMode === 'light' ? t.common.light : activeMode === 'dark' ? t.common.dark : t.common.system}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeMode}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {activeMode === 'auto' ? (
              <Sunrise className="h-4 w-4 text-lips-gold" />
            ) : resolvedTheme === 'dark' ? (
              <Moon className="h-4 w-4 text-lips-gold" />
            ) : (
              <Sun className="h-4 w-4 text-lips-green" />
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Extended options menu */}
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-[99]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute top-full mt-1.5 end-0 w-44 bg-popover rounded-xl shadow-xl border border-border/50 py-1.5 z-[100] overflow-hidden"
            >
              {options.map((opt) => {
                const isActive = activeMode === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-lips-green text-white font-semibold'
                        : 'text-foreground/80 hover:bg-lips-green/5'
                    }`}
                  >
                    <opt.icon className="h-4 w-4" />
                    <span>{opt.label}</span>
                    {opt.value === 'auto' && isActive && (
                      <span className="ms-auto text-[10px] opacity-70">
                        {resolvedTheme === 'dark' ? '🌙' : '☀️'}
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
