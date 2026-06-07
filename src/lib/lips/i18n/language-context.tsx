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
export function LanguageProvider({ children, uiTexts = [] }: { children: React.ReactNode, uiTexts?: any[] }) {
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

  // Merge dynamic UI Texts from DB
  const { mergedT, mergedP } = useMemo(() => {
    const t = structuredClone(dictionaries[locale]) as any;
    const p = structuredClone(pageDictionaries[locale]) as any;

    if (uiTexts && uiTexts.length > 0) {
      uiTexts.forEach((item) => {
        const val = locale === 'ar' && item.valueAr ? item.valueAr : item.value;
        const keys = item.key.split('.');
        
        let target = t;
        if (keys[0] === 'pages' || keys[0] === 'p') {
          target = p;
          if (keys[0] === 'pages' || keys[0] === 'p') keys.shift();
        }

        // Deep set
        let current = target;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        if (current) {
          current[keys[keys.length - 1]] = val;
        }
      });
    }

    return { mergedT: t as TranslationDict, mergedP: p as PageTranslations };
  }, [locale, uiTexts]);

  const localeName = LOCALE_NAMES[locale];

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    t: mergedT,
    p: mergedP,
    dir,
    isRTL,
    setLocale,
    localeName,
  }), [locale, mergedT, mergedP, dir, isRTL, setLocale, localeName]);

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
