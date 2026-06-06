'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  type Locale,
  type TranslationDict,
  RTL_LOCALES,
  LOCALE_NAMES,
  dictionaries,
} from './translations';
import {
  type PageTranslations,
  pageDictionaries,
} from './translations-pages';

// ─── Context shape ─────────────────────────────────────────────
interface LanguageContextValue {
  locale: Locale;
  t: TranslationDict;
  p: PageTranslations;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
  localeName: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');

  // Read saved locale from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lips-locale') as Locale | null;
      if (saved && dictionaries[saved]) {
        setLocaleState(saved);
      }
    } catch {
      // SSR or blocked storage
    }
  }, []);

  // Persist locale + update <html> lang/dir attributes
  useEffect(() => {
    try {
      localStorage.setItem('lips-locale', locale);
    } catch {}

    const isRTL = RTL_LOCALES.includes(locale);
    const html = document.documentElement;
    html.lang = locale;
    html.dir = isRTL ? 'rtl' : 'ltr';

    // Toggle a CSS class on body for RTL-specific styling
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    if (dictionaries[newLocale]) {
      setLocaleState(newLocale);
    }
  }, []);

  const isRTL = RTL_LOCALES.includes(locale);
  const dir = isRTL ? 'rtl' as const : 'ltr' as const;
  const t = dictionaries[locale];
  const p = pageDictionaries[locale];
  const localeName = LOCALE_NAMES[locale];

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    t,
    p,
    dir,
    isRTL,
    setLocale,
    localeName,
  }), [locale, t, p, dir, isRTL, setLocale, localeName]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return ctx;
}
