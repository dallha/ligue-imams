'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/lips/i18n/language-context';

type ThemeOption = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-muted/50 animate-pulse" />
    );
  }

  const options: { value: ThemeOption; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: t.common.light, icon: Sun },
    { value: 'dark', label: t.common.dark, icon: Moon },
    { value: 'system', label: t.common.system, icon: Monitor },
  ];

  const currentIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className="relative">
      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        onContextMenu={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-lips-green/5 hover:bg-lips-green/10 border border-lips-green/10 hover:border-lips-green/20 transition-all"
        aria-label={resolvedTheme === 'dark' ? t.common.light : t.common.dark}
        title={`${t.common.theme} — ${resolvedTheme === 'dark' ? t.common.dark : t.common.light}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="h-4 w-4 text-lips-gold" />
            ) : (
              <Sun className="h-4 w-4 text-lips-green" />
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Extended options on right-click / long-press */}
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
              className="absolute top-full mt-1.5 end-0 w-40 bg-popover rounded-xl shadow-xl border border-border/50 py-1.5 z-[100] overflow-hidden"
            >
              {options.map((opt) => {
                const isActive = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setTheme(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-lips-green text-white font-semibold'
                        : 'text-foreground/80 hover:bg-lips-green/5'
                    }`}
                  >
                    <opt.icon className="h-4 w-4" />
                    <span>{opt.label}</span>
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
