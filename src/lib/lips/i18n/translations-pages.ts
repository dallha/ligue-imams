// ─── Page & Sub-Component Translations (FR / AR / EN) ──────────
// Extends the base translations with page-specific and sub-component keys.

import type { Locale } from './translations';

// ─── Types for page/component translations ─────────────────────
export interface PageTranslations {
  // ─── Page Banners ──────────────────────────────────────────
  pages: {
    about: { label: string; title: string; description: string };
    news: { label: string; title: string; description: string };
    join: { label: string; title: string; description: string };
    agenda: { label: string; title: string; description: string };
    donate: { label: string; title: string; description: string };
    regions: { label: string; title: string; description: string };
    verify: { label: string; title: string; description: string };
    memberArea: { loading: string; greeting: string; matricule: string };
    memberLogin: {
      spaceTitle: string; spaceDesc: string;
      cardTitle: string; cardDesc: string;
      emailOrMatricule: string; password: string;
      placeholder: string; forgotPassword: string;
      connecting: string; login: string;
      notMember: string; joinLink: string;
      copyright: string;
      emailRequired: string; passwordRequired: string;
      loginError: string; serverError: string; adminError: string;
    };
  };

  // ─── Mission Component ─────────────────────────────────────
  mission: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    pillars: {
      defense: { title: string; desc: string };
      unity: { title: string; desc: string };
      initiative: { title: string; desc: string };
      values: { title: string; desc: string };
      promotion: { title: string; desc: string };
      advocacy: { title: string; desc: string };
      openness: { title: string; desc: string };
      cohesion: { title: string; desc: string };
    };
  };

  // ─── Gouvernance Component ─────────────────────────────────
  gouvernance: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    bureauTitle: string; commissionsTitle: string; membersSuffix: string;
    bureau: {
      president: { role: string; bio: string };
      vicePresident: { role: string; bio: string };
      secretary: { role: string; bio: string };
      treasurer: { role: string; bio: string };
      spiritualAdvisor: { role: string; bio: string };
      trainingHead: { role: string; bio: string };
    };
    commissions: {
      fatwa: { name: string; desc: string };
      formation: { name: string; desc: string };
      communication: { name: string; desc: string };
      social: { name: string; desc: string };
    };
  };

  // ─── President Section Component ─────────────────────────────
  presidentSection: {
    sectionTag: string;
    sectionTitle: string;
    name: string;
    role: string;
    bio: string;
  };

  // ─── Carte Membre Component ────────────────────────────────
  carteMembre: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    orgNameLine1: string; orgNameLine2: string;
    cardTitle: string; nationalLabel: string;
    photo: string; nameLabel: string; roleLabel: string;
    regionLabel: string; matriculeLabel: string;
    issuedLabel: string; expiresLabel: string;
    verifyText: string; institutionLabel: string;
    legalNotice: string;
    showFront: string; showBack: string;
    secureDocTitle: string; secureDocDesc: string;
    features: {
      qr: { title: string; desc: string };
      hologram: { title: string; desc: string };
      watermark: { title: string; desc: string };
      uniqueId: { title: string; desc: string };
      online: { title: string; desc: string };
    };
    downloadModel: string; print: string;
    validLabel: string;
  };

  // ─── FAQ Component ─────────────────────────────────────────
  faq: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    items: {
      q1: { q: string; a: string }; q2: { q: string; a: string };
      q3: { q: string; a: string }; q4: { q: string; a: string };
      q5: { q: string; a: string }; q6: { q: string; a: string };
      q7: { q: string; a: string }; q8: { q: string; a: string };
    };
    notFound: string; contactUs: string;
  };

  // ─── Devenir Membre Component ──────────────────────────────
  devenirMembre: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    howToJoin: string;
    steps: {
      apply: { title: string; desc: string };
      validate: { title: string; desc: string };
      pay: { title: string; desc: string };
      card: { title: string; desc: string };
    };
    benefitsTitle: string;
    benefits: {
      nationalCard: string; training: string; network: string;
      representation: string; resources: string; community: string;
    };
    formTitle: string;
    firstName: string; lastName: string; email: string;
    phone: string; region: string; role: string; mosque: string;
    selectPlaceholder: string;
    submit: string; submitted: string; newApplication: string;
    conditions: string;
    // Role options
    roleImam: string; rolePreacher: string; roleRegionalHead: string; roleShura: string; roleOther: string;
    mosquePlaceholder: string;
  };

  // ─── Verification Component ────────────────────────────────
  verification: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    nationalCard: string; secureSystem: string;
    verifyBtn: string;
    emptyError: string; formatError: string; serverError: string;
    valid: string; expired: string; pending: string; notFound: string;
    active: string;
    resultName: string; resultRegion: string; resultRole: string;
    resultValidity: string; resultYear: string;
    formatHint: string;
  };

  // ─── Dons Component ────────────────────────────────────────
  dons: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    chooseAmount: string; otherAmount: string;
    impactTitle: string;
    impacts: {
      imams: string; mosques: string; training: string;
      solidarity: string; peace: string;
    };
    fallbackImpact: string;
    paymentMethod: string;
    methods: {
      cinetpay: string; wave: string; cash: string;
    };
    donateAmount: string;
    securePayment: string; fiscalReceipt: string;
    verseTranslation: string;
  };

  // ─── Evenements Component ──────────────────────────────────
  evenements: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    fullCalendar: string; registeredSuffix: string;
  };

  // ─── Actualites Page Component ─────────────────────────────
  actualitesPage: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    viewAll: string; newBadge: string; readFull: string;
  };

  // ─── Galerie Component ─────────────────────────────────────
  galerie: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    photosCount: string; totalPhotos: string;
  };

  // ─── Agenda Component ──────────────────────────────────────
  agendaComp: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    calendar: string; list: string;
    filterAll: string;
    upcomingIslamic: string; upcomingLips: string;
    today: string; inDays: string; days: string;
    legend: {
      islamicDate: string; aid: string; islamicEvent: string; lipsEvent: string;
    };
    prevMonth: string; nextMonth: string;
  };

  // ─── Regions Page Component ────────────────────────────────
  regionsPage: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    interactiveMap: string; exploreTitle: string; exploreDesc: string;
    inhabitants: string; mosques: string;
    summaryRegions: string; summaryDepartments: string;
    summaryMosques: string; summaryMembers: string;
  };

  // ─── Publications Component ────────────────────────────────
  publications: {
    sectionTag: string; sectionTitle: string; sectionDesc: string;
    categories: {
      communiques: { title: string; desc: string };
      fatwas: { title: string; desc: string };
      courses: { title: string; desc: string };
      articles: { title: string; desc: string };
    };
    explore: string;
  };

  // ─── Espace Membre Page ────────────────────────────────────
  espaceMembre: {
    loading: string;
    greeting: string;
    matriculeLabel: string;
    myCard: string; cardDesc: string; validLabel: string;
    profileTitle: string; profileDesc: string; editBtn: string;
    editProfile: string; saveChanges: string;
    firstName: string; lastName: string; email: string;
    phone: string; region: string; mosque: string;
    nationalMatricule: string;
    paymentsTitle: string; paymentsDesc: string;
    totalContributions: string; payContribution: string;
    tableType: string; tableAmount: string; tableDate: string;
    tableMethod: string; tableReference: string;
    quickLinks: string;
    verifyCard: string; qrVerification: string;
    lipsCalendar: string; agendaEvents: string;
    holyQuran: string; readListen: string;
    makeDonation: string; supportLips: string;
    communicationsTitle: string; communicationsDesc: string;
    seeAll: string; noCommunications: string;
    cardFront: string; cardBack: string;
    orgLine1: string; orgLine2: string;
    cardTitle: string; nationalLabel: string;
    photoLabel: string; nameLabel: string; roleLabel: string;
    regionLabel: string; matriculeLabel2: string;
    issuedLabel: string; expiresLabel: string;
    verifyText: string; institutionLabel: string;
    legalNotice: string;
    statusActive: string; statusExpired: string; statusPending: string;
    roleImam: string; rolePreacher: string; roleRegionalHead: string; roleShura: string;
    commCommunique: string; commFatwa: string; commEvent: string;
    currency: string;
  };
}


import { frPages } from './locales/pages-fr';
import { arPages } from './locales/pages-ar';
import { enPages } from './locales/pages-en';

export const pageDictionaries: Record<Locale, PageTranslations> = { fr: frPages, ar: arPages, en: enPages };
