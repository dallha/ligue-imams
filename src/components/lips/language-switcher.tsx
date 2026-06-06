'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/lips/i18n/language-context';
import { type Locale, LOCALE_NAMES, LOCALE_FLAGS } from '@/lib/lips/i18n/translations';

const LOCALES: Locale[] = ['fr', 'ar', 'en'];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const handleSelect = (l: Locale) => {
    setLocale(l);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-lips-green/5 hover:bg-lips-green/10 border border-lips-green/10 hover:border-lips-green/20 transition-all text-xs font-medium"
        aria-label="Change language"
      >
        <Globe className="h-3.5 w-3.5 text-lips-green" />
        <span className="hidden sm:inline text-lips-green-dark">
          {LOCALE_NAMES[locale]}
        </span>
        <span className="sm:hidden text-lips-green-dark">
          {locale.toUpperCase()}
        </span>
        <ChevronDown className={`h-3 w-3 text-lips-green/60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-1.5 end-0 w-44 bg-white rounded-xl shadow-xl border border-border/50 py-1.5 z-[100] overflow-hidden"
          >
            {LOCALES.map((l) => {
              const isActive = l === locale;
              return (
                <button
                  key={l}
                  onClick={() => handleSelect(l)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-lips-green text-white font-semibold'
                      : 'text-foreground/80 hover:bg-lips-green/5'
                  }`}
                >
                  <span className="text-base leading-none">{LOCALE_FLAGS[l]}</span>
                  <span className={isActive ? 'text-white' : 'text-foreground/80'}>
                    {LOCALE_NAMES[l]}
                  </span>
                  {isActive && (
                    <span className="ms-auto text-[10px] opacity-70">
                      {l.toUpperCase()}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
