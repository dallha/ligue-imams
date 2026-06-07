// ─── Translation Dictionaries for LIPS (FR / AR / EN) ──────────

export type Locale = 'fr' | 'ar' | 'en';

export const LOCALE_NAMES: Record<Locale, string> = {
  fr: 'Français',
  ar: 'العربية',
  en: 'English',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  fr: '🇫🇷',
  ar: '🇸🇦',
  en: '🇬🇧',
};

export const RTL_LOCALES: Locale[] = ['ar'];

export interface TranslationDict {
  // ─── Header / Navigation ───────────────────────────────────
  nav: {
    home: string;
    about: string;
    news: string;
    agenda: string;
    regions: string;
    coran: string;
    join: string;
    verifyCard: string;
    donate: string;
    memberArea: string;
    // Dropdown: About
    ourMission: string;
    governance: string;
    memberCard: string;
    faq: string;
    // Dropdown: News
    communiquesFatwas: string;
    events: string;
    photoGallery: string;
    agendaCalendar: string;
  };

  // ─── Hero ──────────────────────────────────────────────────
  hero: {
    badge: string;
    arabicMotto: string;
    mottoTranslation: string;
    title1: string;
    title2: string;
    subtitle: string;
    joinCta: string;
    discoverCta: string;
    members: string;
    regions: string;
    mosques: string;
  };

  // ─── Prayer Times ──────────────────────────────────────────
  prayer: {
    loading: string;
    next: string;
    chooseRegion: string;
    changeRegion: string;
    seeCalendar: string;
    seeAllPrayers: string;
    collapse: string;
    // Prayer names
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };

  // ─── Services ──────────────────────────────────────────────
  services: {
    sectionTag: string;
    sectionTitle: string;
    sectionDesc: string;
    explore: string;
    memberSpaceNote: string;
    memberSpaceLink: string;
    items: {
      prayerTimes: { title: string; desc: string };
      coran: { title: string; desc: string };
      agenda: { title: string; desc: string };
      memberCard: { title: string; desc: string };
      donate: { title: string; desc: string };
      join: { title: string; desc: string };
    };
  };

  // ─── About Narrative ───────────────────────────────────────
  aboutNarrative: {
    sectionTag: string;
    sectionTitle1: string;
    sectionTitle2: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    mottoTranslation: string;
    sinceLabel: string;
    sinceDesc: string;
    mosqueName: string;
    mosqueLocation: string;
    imageAlt: string;
    cta: string;
  };

  // ─── Stats ─────────────────────────────────────────────────
  stats: {
    sectionTag: string;
    sectionTitle: string;
    sectionDesc: string;
    items: {
      members: { label: string; desc: string };
      regions: { label: string; desc: string };
      mosques: { label: string; desc: string };
      trainings: { label: string; desc: string };
      years: { label: string; desc: string };
      renewal: { label: string; desc: string };
    };
  };

  // ─── CTA Section ───────────────────────────────────────────
  cta: {
    joinTitle: string;
    joinDesc: string;
    joinBtn: string;
    verifyTitle: string;
    verifyDesc: string;
    verifyBtn: string;
    coranTitle: string;
    coranDesc: string;
    coranBtn: string;
    donateTitle: string;
    donateDesc: string;
    donateBtn: string;
    verseArabic: string;
    verseTranslation: string;
  };

  // ─── Newsletter ────────────────────────────────────────────
  newsletter: {
    title: string;
    desc: string;
    placeholder: string;
    subscribe: string;
    success: string;
    privacy: string;
  };

  // ─── Actualites ────────────────────────────────────────────
  actualites: {
    sectionTag: string;
    sectionTitle: string;
    sectionDesc: string;
    allNews: string;
    communiques: string;
    fatwas: string;
    events: string;
    gallery: string;
    // Article categories
    catCommunique: string;
    catFatwa: string;
    catFormation: string;
    // Latest articles
    art1Title: string;
    art1Date: string;
    art1Author: string;
    art2Title: string;
    art2Date: string;
    art2Author: string;
    art3Title: string;
    art3Date: string;
    art3Author: string;
  };

  // ─── Regions ───────────────────────────────────────────────
  regions: {
    sectionTag: string;
    sectionTitle: string;
    sectionDesc: string;
    moreRegions: string;
    regionsLabel: string;
    mosquesLabel: string;
    membersLabel: string;
    exploreAll: string;
  };

  // ─── Footer ────────────────────────────────────────────────
  footer: {
    orgLine1: string;
    orgLine2: string;
    description: string;
    quickLinks: string;
    resources: string;
    contact: string;
    address: string;
    copyright: string;
    legalNotice: string;
    privacyPolicy: string;
  };

  // ─── Coran Page ────────────────────────────────────────────
  coran: {
    heroTag: string;
    heroTitle: string;
    heroSubtitle: string;
    // Daily verse
    verseOfDay: string;
    // Daily verses data (7 verses, one per day of week)
    verses: {
      v1: { arabic: string; translation: string; reference: string };
      v2: { arabic: string; translation: string; reference: string };
      v3: { arabic: string; translation: string; reference: string };
      v4: { arabic: string; translation: string; reference: string };
      v5: { arabic: string; translation: string; reference: string };
      v6: { arabic: string; translation: string; reference: string };
      v7: { arabic: string; translation: string; reference: string };
    };
    // Surah fallback label
    surahLabel: string;
    // Reciters section
    recitationTag: string;
    recitationTitle: string;
    recitationSubtitle: string;
    popularReciters: string;
    searchReciter: string;
    searchPlaceholder: string;
    noResult: string;
    typeToSearch: string;
    styles: string;
    style: string;
    popular: string;
    // Player
    surahIndexTag: string;
    surahIndexTitle: string;
    surahIndexSubtitle: string;
    searchSurah: string;
    noSurahFound: string;
    makki: string;
    madani: string;
    loadingReciters: string;
    loadingSurahs: string;
    fetchError: string;
    retry: string;
    // Resources
    resourcesTag: string;
    resourcesTitle: string;
    resourcesSubtitle: string;
    resReadCoran: string;
    resReadCoranDesc: string;
    resMp3Quran: string;
    resMp3QuranDesc: string;
    resWolof: string;
    resWolofDesc: string;
    resTafsir: string;
    resTafsirDesc: string;
    resHifz: string;
    resHifzDesc: string;
  };

  // ─── Preloader ─────────────────────────────────────────────
  preloader: {
    bismillah: string;
    logoAlt: string;
  };

  // ─── Common ────────────────────────────────────────────────
  common: {
    loading: string;
    error: string;
    close: string;
    menu: string;
    search: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    auto: string;
    system: string;
  };
}


import { fr } from './locales/fr';
import { ar } from './locales/ar';
import { en } from './locales/en';

export const dictionaries: Record<Locale, TranslationDict> = { fr, ar, en };
