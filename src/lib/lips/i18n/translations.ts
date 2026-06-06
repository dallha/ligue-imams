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

  // ─── Common ────────────────────────────────────────────────
  common: {
    loading: string;
    error: string;
    close: string;
    menu: string;
    search: string;
    language: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// FRENCH (Default)
// ═══════════════════════════════════════════════════════════════
export const fr: TranslationDict = {
  nav: {
    home: 'Accueil',
    about: 'À Propos',
    news: 'Actualités',
    agenda: 'Agenda',
    regions: 'Régions',
    coran: 'Coran',
    join: 'Adhérer',
    verifyCard: 'Vérifier une Carte',
    donate: 'Faire un Don',
    memberArea: 'Espace Membre',
    ourMission: 'Notre Mission',
    governance: 'Gouvernance',
    memberCard: 'Carte Membre',
    faq: 'FAQ',
    communiquesFatwas: 'Communiqués & Fatwas',
    events: 'Événements',
    photoGallery: 'Galerie Photos',
    agendaCalendar: 'Agenda & Calendrier',
  },
  hero: {
    badge: 'Institution Nationale de Référence',
    arabicMotto: 'بِالصَّبْرِ وَالْيَقِينِ تُنَالُ الْإِمَامَةُ فِي الدِّينِ',
    mottoTranslation: 'Par la patience et la certitude, on atteint l\'imamat dans la religion',
    title1: 'Ligue des Imams et',
    title2: 'Prédicateurs du Sénégal',
    subtitle: 'Au service des imams, de la communauté et de la paix sociale à travers les 14 régions du Sénégal. Un cadre institutionnel pour l\'unité, la formation et l\'accompagnement spirituel.',
    joinCta: 'Adhérer à la LIPS',
    discoverCta: 'Découvrir la LIPS',
    members: 'Membres',
    regions: 'Régions',
    mosques: 'Mosquées',
  },
  prayer: {
    loading: 'Chargement des horaires de prière...',
    next: 'Prochaine',
    chooseRegion: 'Choisir une région',
    changeRegion: 'Changer de région',
    seeCalendar: 'Voir le calendrier',
    seeAllPrayers: 'Voir toutes les prières',
    collapse: 'Réduire',
    fajr: 'Fajr',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
  },
  services: {
    sectionTag: 'Nos Services',
    sectionTitle: 'Pourquoi Choisir Notre Plateforme',
    sectionDesc: 'La plateforme SIIN met à votre disposition des outils numériques innovants au service de la communauté musulmane du Sénégal, alliant tradition islamique et technologie moderne.',
    explore: 'Explorer',
    memberSpaceNote: 'Un espace membre dédié est aussi disponible pour les adhérents',
    memberSpaceLink: 'Espace Membre',
    items: {
      prayerTimes: {
        title: 'Horaires de Prière',
        desc: 'Horaires précis des 5 prières quotidiennes pour les 14 régions du Sénégal, avec date Hijri et compte à rebours de la prochaine prière.',
      },
      coran: {
        title: 'Le Saint Coran',
        desc: 'Lecture et écoute du Coran avec traduction française, recherche par sourate et verset, et récitations audio par nos imams.',
      },
      agenda: {
        title: 'Agenda & Calendrier',
        desc: 'Calendrier Hijri complet avec les événements religieux, les fêtes islamiques, les mois sacrés et les programmes de la LIPS.',
      },
      memberCard: {
        title: 'Carte Membre',
        desc: 'Carte nationale d\'identification sécurisée avec QR code, matricule unique et vérification instantanée de validité.',
      },
      donate: {
        title: 'Faire un Don',
        desc: 'Soutenez la formation des imams, la solidarité communautaire et le maintien de la paix sociale au Sénégal par votre contribution.',
      },
      join: {
        title: 'Adhérer à la LIPS',
        desc: 'Rejoignez le réseau institutionnel des imams et prédicateurs du Sénégal. Accédez aux formations, à la carte membre et à l\'espace réservé.',
      },
    },
  },
  aboutNarrative: {
    sectionTag: 'Qui Sommes-Nous',
    sectionTitle1: 'Ligue des Imams et',
    sectionTitle2: 'Prédicateurs du Sénégal',
    paragraph1: 'La LIPS est l\'institution nationale de référence qui fédère l\'ensemble des imams et prédicateurs du Sénégal. Fondée en 2006, elle œuvre pour l\'institutionnalisation de l\'imamat, la formation continue des cadres religieux et la promotion du dialogue interreligieux au service de la paix sociale.',
    paragraph2: 'Forte de sa présence dans les 14 régions du pays et de son réseau de plus de 5 000 membres, la LIPS constitue un cadre unificateur qui porte la voix des imams auprès des autorités publiques, des institutions nationales et des partenaires internationaux.',
    paragraph3: 'Son siège à la Grande Mosquée AN-NOUR de Liberté II, Dakar, est le cœur symbolique d\'un réseau qui relie les mosquées et les communautés de tout le territoire sénégalais, du Fouta à la Casamance, de la côte au Sahel.',
    mottoTranslation: 'Par la patience et la certitude, on atteint l\'imamat dans la religion',
    sinceLabel: 'Depuis 2006',
    sinceDesc: '18 ans d\'excellence au service de l\'imamat au Sénégal',
    mosqueName: 'Grande Mosquée AN-NOUR',
    mosqueLocation: 'Liberté II, Dakar — Siège de la LIPS',
    imageAlt: 'Grande Mosquée — Siège de la LIPS',
    cta: 'En savoir plus sur la LIPS',
  },
  stats: {
    sectionTag: 'En Chiffres',
    sectionTitle: 'L\'Impact de la LIPS en Chiffres',
    sectionDesc: 'Des indicateurs concrets qui témoignent de l\'ampleur de notre action institutionnelle au service de la communauté musulmane du Sénégal.',
    items: {
      members: { label: 'Membres Actifs', desc: 'Imams, prédicateurs et cadres religieux encadrés à travers tout le territoire national' },
      regions: { label: 'Régions Couvertes', desc: 'Présence institutionnelle dans les 14 régions administratives du Sénégal' },
      mosques: { label: 'Mosquées Affiliées', desc: 'Réseau de mosquées partenaires pour la diffusion du message de paix et de concorde' },
      trainings: { label: 'Formations Annuelles', desc: 'Cycles de formation continue en fiqh, aqida, daawa et gestion communautaire' },
      years: { label: 'Années d\'Excellence', desc: 'Depuis 2006, la LIPS œuvre pour l\'institutionnalisation de l\'imamat au Sénégal' },
      renewal: { label: 'Taux de Renouvellement', desc: 'Fidélité et engagement des membres au renouvellement annuel de leur carte' },
    },
  },
  cta: {
    joinTitle: 'Rejoignez la LIPS',
    joinDesc: 'Devenir membre de la LIPS, c\'est accéder à la carte membre nationale, aux formations continues et au réseau institutionnel des imams du Sénégal.',
    joinBtn: 'Adhérer maintenant',
    verifyTitle: 'Vérifier une Carte',
    verifyDesc: 'Saisissez le matricule d\'une carte membre pour vérifier instantanément sa validité et l\'authenticité du porteur via notre système sécurisé.',
    verifyBtn: 'Vérifier une carte',
    coranTitle: 'Le Saint Coran',
    coranDesc: 'Explorez le Livre Saint, écoutez les récitations de nos imams et accédez aux ressources coraniques pour approfondir votre foi.',
    coranBtn: 'Lire le Coran',
    donateTitle: 'Faire un Don',
    donateDesc: 'Soutenez la formation des imams, la solidarité communautaire et le maintien de la paix sociale au Sénégal par votre contribution généreuse.',
    donateBtn: 'Faire un don',
    verseArabic: 'مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا',
    verseTranslation: 'Qui est celui qui ferait un prêt généreux à Allah ? — Coran 2:245',
  },
  newsletter: {
    title: 'Restez Informé',
    desc: 'Recevez les communiqués, fatwas et annonces de la LIPS directement dans votre boîte mail.',
    placeholder: 'votre.email@exemple.sn',
    subscribe: 'S\'inscrire',
    success: 'Merci ! Vous êtes maintenant inscrit(e) à la newsletter.',
    privacy: 'Pas de spam. Désinscription possible à tout moment. Vos données restent confidentielles.',
  },
  actualites: {
    sectionTag: 'Actualités',
    sectionTitle: 'Dernières Publications',
    sectionDesc: 'Restez informé des positions officielles, avis juridiques et annonces de la LIPS.',
    allNews: 'Toutes les actualités',
    communiques: 'Communiqués',
    fatwas: 'Fatwas',
    events: 'Événements',
    gallery: 'Galerie Photos',
    catCommunique: 'Communiqué',
    catFatwa: 'Fatwa',
    catFormation: 'Formation',
    art1Title: 'Communiqué : Position de la LIPS sur le dialogue interreligieux',
    art1Date: '4 Juin 2026',
    art1Author: 'Bureau National',
    art2Title: 'Fatwa : Conditions de la prière du Vendredi en voyage',
    art2Date: '1 Juin 2026',
    art2Author: 'Commission Fatwa',
    art3Title: 'Formation régionale à Thiès — 15 au 18 Juin',
    art3Date: '29 Mai 2026',
    art3Author: 'Commission Formation',
  },
  regions: {
    sectionTag: 'Présence Nationale',
    sectionTitle: 'Nos 14 Régions',
    sectionDesc: 'La LIPS est implantée dans les 14 régions administratives du Sénégal, garantissant une couverture institutionnelle complète.',
    moreRegions: '+ 8 autres régions',
    regionsLabel: 'Régions',
    mosquesLabel: 'Mosquées',
    membersLabel: 'Membres',
    exploreAll: 'Explorer toutes les régions',
  },
  footer: {
    orgLine1: 'Ligue des Imams',
    orgLine2: '& Prédicateurs du Sénégal',
    description: 'Institution nationale de référence au service des imams, de la communauté et de la paix sociale.',
    quickLinks: 'Liens Rapides',
    resources: 'Ressources',
    contact: 'Contact',
    address: 'Grande Mosquée AN-NOUR\nLiberté II, Dakar, Sénégal',
    copyright: 'LIPS - Ligue des Imams et Prédicateurs du Sénégal. Tous droits réservés.',
    legalNotice: 'Mentions Légales',
    privacyPolicy: 'Politique de Confidentialité',
  },
  coran: {
    heroTag: 'Parole Divine',
    heroTitle: 'Le Saint Coran',
    heroSubtitle: 'Écoutez les plus belles récitations du Coran par les plus grands récitateurs du monde musulman, par sourate et en streaming direct.',
    verseOfDay: 'Verset du Jour',
    verses: {
      v1: { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'Au nom d\'Allah, le Tout-Miséricordieux, le Très-Miséricordieux.', reference: 'Coran 1:1 — Al-Fatiha' },
      v2: { arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', translation: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même.', reference: 'Coran 2:255 — Ayat al-Kursi' },
      v3: { arabic: 'وَمَن يَتَّقِ اللَّهِ يَجْعَل لَّهُ مَخْرَجًا', translation: 'Et quiconque craint Allah, Il lui donnera une issue.', reference: 'Coran 65:2 — At-Talaq' },
      v4: { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Certes, avec la difficulté vient la facilité.', reference: 'Coran 94:6 — Ash-Sharh' },
      v5: { arabic: 'وَلَذِكْرُ اللَّهِ أَكْبَرُ', translation: 'Et l\'invocation d\'Allah est certes la plus grande chose.', reference: 'Coran 29:45 — Al-Ankabut' },
      v6: { arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', translation: 'Et dis : « Ô mon Seigneur, augmente mes connaissances. »', reference: 'Coran 20:114 — Taha' },
      v7: { arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', translation: 'Souvenez-vous de Moi, Je me souviendrai de vous. Soyez reconnaissants envers Moi et ne Me reniez pas.', reference: 'Coran 2:152 — Al-Baqara' },
    },
    surahLabel: 'Sourate',
    recitationTag: 'Récitation',
    recitationTitle: 'Récitateurs du Coran',
    recitationSubtitle: 'Sélectionnez un récitateurs et écoutez la psalmodie du Coran en streaming direct depuis MP3Quran.net.',
    popularReciters: 'Récitateurs populaires',
    searchReciter: 'Rechercher un récitateurs',
    searchPlaceholder: 'Rechercher un récitateurs par nom...',
    noResult: 'Aucun récitateurs trouvé pour',
    typeToSearch: 'Tapez le nom d\'un récitateurs pour rechercher parmi',
    styles: 'styles',
    style: 'style',
    popular: 'Populaire',
    surahIndexTag: 'Index',
    surahIndexTitle: 'Les 114 Sourates',
    surahIndexSubtitle: 'Cliquez sur une sourate pour l\'écouter directement avec le récitateurs sélectionné.',
    searchSurah: 'Rechercher une sourate (nom, numéro)...',
    noSurahFound: 'Aucune sourate trouvée pour',
    makki: 'Makki',
    madani: 'Madani',
    loadingReciters: 'Chargement des récitateurs...',
    loadingSurahs: 'Chargement des sourates...',
    fetchError: 'Impossible de charger les données. Vérifiez votre connexion.',
    retry: 'Réessayer',
    resourcesTag: 'Ressources',
    resourcesTitle: 'Ressources Coraniques',
    resourcesSubtitle: 'Accédez à des outils et ressources pour approfondir votre relation avec le Coran.',
    resReadCoran: 'Lecture du Coran',
    resReadCoranDesc: 'Lisez le Coran en ligne avec traduction française et translittération.',
    resMp3Quran: 'MP3Quran.net',
    resMp3QuranDesc: 'Plateforme complète de récitations audio du Coran par les plus grands récitateurs du monde musulman.',
    resWolof: 'Coran en Wolof',
    resWolofDesc: 'Écoutez et lisez le Coran avec la traduction en wolof pour les locuteurs sénégalais.',
    resTafsir: 'Tafsir en français',
    resTafsirDesc: 'Commentaire et exégèse du Coran en langue française pour une compréhension approfondie.',
    resHifz: 'Mémorisation (Hifz)',
    resHifzDesc: 'Guide pratique et méthodologie pour la mémorisation du Coran, adapté aux adultes et enfants.',
  },
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    close: 'Fermer',
    menu: 'Menu',
    search: 'Rechercher',
    language: 'Langue',
  },
};

// ═══════════════════════════════════════════════════════════════
// ARABIC
// ═══════════════════════════════════════════════════════════════
export const ar: TranslationDict = {
  nav: {
    home: 'الرئيسية',
    about: 'من نحن',
    news: 'أخبار',
    agenda: 'أجندة',
    regions: 'المناطق',
    coran: 'القرآن',
    join: 'انضمام',
    verifyCard: 'التحقق من بطاقة',
    donate: 'تبرع',
    memberArea: 'فضاء الأعضاء',
    ourMission: 'مهمتنا',
    governance: 'الحوكمة',
    memberCard: 'بطاقة العضوية',
    faq: 'الأسئلة الشائعة',
    communiquesFatwas: 'بيانات وفتاوى',
    events: 'فعاليات',
    photoGallery: 'معرض الصور',
    agendaCalendar: 'الأجندة والتقويم',
  },
  hero: {
    badge: 'مؤسسة وطنية مرجعية',
    arabicMotto: 'بِالصَّبْرِ وَالْيَقِينِ تُنَالُ الْإِمَامَةُ فِي الدِّينِ',
    mottoTranslation: 'بالصبر واليقين تنال الإمامة في الدين',
    title1: 'رابطة الأئمة و',
    title2: 'الخطباء في السنغال',
    subtitle: 'في خدمة الأئمة والمجتمع والسلام الاجتماعي عبر المناطق الأربع عشرة في السنغال. إطار مؤسسي للوحدة والتكوين والمرافقة الروحية.',
    joinCta: 'انضم إلى الرابطة',
    discoverCta: 'اكتشف الرابطة',
    members: 'أعضاء',
    regions: 'مناطق',
    mosques: 'مساجد',
  },
  prayer: {
    loading: 'جاري تحميل مواقيت الصلاة...',
    next: 'التالية',
    chooseRegion: 'اختر منطقة',
    changeRegion: 'تغيير المنطقة',
    seeCalendar: 'عرض التقويم',
    seeAllPrayers: 'عرض جميع الصلوات',
    collapse: 'طي',
    fajr: 'الفجر',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
  },
  services: {
    sectionTag: 'خدماتنا',
    sectionTitle: 'لماذا تختار منصتنا',
    sectionDesc: 'توفر منصة سيين أدوات رقمية مبتكرة في خدمة المجتمع المسلم في السنغال، تجمع بين التراث الإسلامي والتكنولوجيا الحديثة.',
    explore: 'استكشف',
    memberSpaceNote: 'فضاء مخصص للأعضاء متاح أيضاً للمنضمين',
    memberSpaceLink: 'فضاء الأعضاء',
    items: {
      prayerTimes: {
        title: 'مواقيت الصلاة',
        desc: 'مواقيت دقيقة للصلوات الخمس اليومية في المناطق الأربع عشرة بالسنغال، مع التاريخ الهجري والعد التنازلي للصلاة التالية.',
      },
      coran: {
        title: 'القرآن الكريم',
        desc: 'قراءة واستماع القرآن مع الترجمة الفرنسية، البحث بالسورة والآية، وتلاوات صوتية من أئمتنا.',
      },
      agenda: {
        title: 'الأجندة والتقويم',
        desc: 'تقويم هجري كامل مع الأحداث الدينية والأعياد الإسلامية والأشهر الحرم وبرامج الرابطة.',
      },
      memberCard: {
        title: 'بطاقة العضوية',
        desc: 'بطاقة تعريف وطنية مؤمنة برمز QR ورقم تسجيل فريد والتحقق الفوري من الصلاحية.',
      },
      donate: {
        title: 'التبرع',
        desc: 'ادعم تكوين الأئمة والتضامن المجتمعي والحفاظ على السلام الاجتماعي في السنغال بمساهمتك.',
      },
      join: {
        title: 'الانضمام إلى الرابطة',
        desc: 'انضم إلى الشبكة المؤسسية للأئمة والخطباء في السنغال. احصل على التكوينات وبطاقة العضوية والفضاء المخصص.',
      },
    },
  },
  aboutNarrative: {
    sectionTag: 'من نحن',
    sectionTitle1: 'رابطة الأئمة و',
    sectionTitle2: 'الخطباء في السنغال',
    paragraph1: 'الرابطة هي المؤسسة الوطنية المرجعية التي تجمع جميع الأئمة والخطباء في السنغال. تأسست عام 2006، وتسعى لتأطير الإمام والتكوين المستمر للإطارات الدينية وتعزيز الحوار بين الأديان في خدمة السلام الاجتماعي.',
    paragraph2: 'بحضورها في المناطق الأربع عشرة وشبكتها التي تضم أكثر من 5000 عضو، تشكل الرابطة إطاراً موحداً يحمل صوت الأئمة أمام السلطات العمومية والمؤسسات الوطنية والشركاء الدوليين.',
    paragraph3: 'يقع مقرها في الجامع الكبير النور بحي الحرية الثاني داكار، وهو القلب الرمزي لشبكة تربط المساجد والمجتمعات في جميع أنحاء الأراضي السنغالية، من فوتا إلى كازامانس، ومن الساحل إلى الساحل.',
    mottoTranslation: 'بالصبر واليقين تنال الإمامة في الدين',
    sinceLabel: 'منذ 2006',
    sinceDesc: '18 عاماً من التميز في خدمة الإمامة في السنغال',
    mosqueName: 'الجامع الكبير النور',
    mosqueLocation: 'حي الحرية الثاني، داكار — مقر الرابطة',
    imageAlt: 'الجامع الكبير — مقر الرابطة',
    cta: 'اعرف المزيد عن الرابطة',
  },
  stats: {
    sectionTag: 'بالأرقام',
    sectionTitle: 'تأثير الرابطة بالأرقام',
    sectionDesc: 'مؤشرات ملموسة تشهد بسعة عملنا المؤسسي في خدمة المجتمع المسلم في السنغال.',
    items: {
      members: { label: 'أعضاء نشطون', desc: 'أئمة وخطباء وإطارات دينية مؤطرة في جميع أنحاء التراب الوطني' },
      regions: { label: 'مناطق مغطاة', desc: 'حضور مؤسسي في المناطق الإدارية الأربع عشرة بالسنغال' },
      mosques: { label: 'مساجد منتسبة', desc: 'شبكة مساجد شريكة لنشر رسالة السلام والوئام' },
      trainings: { label: 'تكوينات سنوية', desc: 'دورات تكوين مستمر في الفقه والعقيدة والدعوة والتسيير المجتمعي' },
      years: { label: 'سنوات من التميز', desc: 'منذ 2006، تسعى الرابطة لتأطير الإمامة في السنغال' },
      renewal: { label: 'نسبة التجديد', desc: 'ولاء والتزام الأعضاء بتجديد بطاقتهم السنوية' },
    },
  },
  cta: {
    joinTitle: 'انضم إلى الرابطة',
    joinDesc: 'الانضمام إلى الرابطة يعني الحصول على بطاقة العضوية الوطنية والتكوينات المستمرة والشبكة المؤسسية للأئمة في السنغال.',
    joinBtn: 'انضم الآن',
    verifyTitle: 'التحقق من بطاقة',
    verifyDesc: 'أدخل رقم تسجيل بطاقة العضوية للتحقق الفوري من صلاحيتها وموثوقية حاملها عبر نظامنا المؤمّن.',
    verifyBtn: 'تحقق من بطاقة',
    coranTitle: 'القرآن الكريم',
    coranDesc: 'استكشف الكتاب المقدس، استمع إلى تلاوات أئمتنا واحصل على الموارد القرآنية لتعميق إيمانك.',
    coranBtn: 'اقرأ القرآن',
    donateTitle: 'التبرع',
    donateDesc: 'ادعم تكوين الأئمة والتضامن المجتمعي والحفاظ على السلام الاجتماعي في السنغال بمساهمتك الكريمة.',
    donateBtn: 'تبرع الآن',
    verseArabic: 'مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا',
    verseTranslation: 'من ذا الذي يقرض الله قرضاً حسناً — القرآن 2:245',
  },
  newsletter: {
    title: 'ابق على اطلاع',
    desc: 'استلم البيانات والفتاوى وإعلانات الرابطة مباشرة في بريدك الإلكتروني.',
    placeholder: 'بريدك.الإلكتروني@مثال.sn',
    subscribe: 'اشترك',
    success: 'شكراً! أنت الآن مشترك في النشرة الإخبارية.',
    privacy: 'لا بريد مزعج. إلغاء الاشتراك ممكن في أي وقت. بياناتك تبقى سرية.',
  },
  actualites: {
    sectionTag: 'أخبار',
    sectionTitle: 'آخر المنشورات',
    sectionDesc: 'ابق على اطلاع من المواقف الرسمية والآراء القانونية وإعلانات الرابطة.',
    allNews: 'جميع الأخبار',
    communiques: 'بيانات',
    fatwas: 'فتاوى',
    events: 'فعاليات',
    gallery: 'معرض الصور',
    catCommunique: 'بيان',
    catFatwa: 'فتوى',
    catFormation: 'تكوين',
    art1Title: 'بيان: موقف الرابطة حول الحوار بين الأديان',
    art1Date: '4 يونيو 2026',
    art1Author: 'المكتب الوطني',
    art2Title: 'فتوى: شروط صلاة الجمعة في السفر',
    art2Date: '1 يونيو 2026',
    art2Author: 'لجنة الفتوى',
    art3Title: 'تكوين جهوي في ثيس — 15 إلى 18 يونيو',
    art3Date: '29 مايو 2026',
    art3Author: 'لجنة التكوين',
  },
  regions: {
    sectionTag: 'الحضور الوطني',
    sectionTitle: 'المناطق الأربع عشرة',
    sectionDesc: 'الرابطة متواجدة في المناطق الإدارية الأربع عشرة بالسنغال، مما يضمن تغطية مؤسسية كاملة.',
    moreRegions: '+ 8 مناطق أخرى',
    regionsLabel: 'مناطق',
    mosquesLabel: 'مساجد',
    membersLabel: 'أعضاء',
    exploreAll: 'استكشف جميع المناطق',
  },
  footer: {
    orgLine1: 'رابطة الأئمة',
    orgLine2: 'و الخطباء في السنغال',
    description: 'مؤسسة وطنية مرجعية في خدمة الأئمة والمجتمع والسلام الاجتماعي.',
    quickLinks: 'روابط سريعة',
    resources: 'موارد',
    contact: 'اتصل بنا',
    address: 'الجامع الكبير النور\nحي الحرية الثاني، داكار، السنغال',
    copyright: 'الرابطة - رابطة الأئمة والخطباء في السنغال. جميع الحقوق محفوظة.',
    legalNotice: 'إشعار قانوني',
    privacyPolicy: 'سياسة الخصوصية',
  },
  coran: {
    heroTag: 'الكلمة الإلهية',
    heroTitle: 'القرآن الكريم',
    heroSubtitle: 'استمع إلى أجمل تلاوات القرآن لأكبر القراء في العالم الإسلامي، بالسورة والبث المباشر.',
    verseOfDay: 'آية اليوم',
    verses: {
      v1: { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'بسم الله الرحمن الرحيم.', reference: 'القرآن 1:1 — الفاتحة' },
      v2: { arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', translation: 'الله لا إله إلا هو الحي القيوم.', reference: 'القرآن 2:255 — آية الكرسي' },
      v3: { arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', translation: 'ومن يتق الله يجعل له مخرجاً.', reference: 'القرآن 65:2 — الطلاق' },
      v4: { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'إن مع العسر يسراً.', reference: 'القرآن 94:6 — الشرح' },
      v5: { arabic: 'وَلَذِكْرُ اللَّهِ أَكْبَرُ', translation: 'ولذكر الله أكبر.', reference: 'القرآن 29:45 — العنكبوت' },
      v6: { arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', translation: 'وقل رب زدني علماً.', reference: 'القرآن 20:114 — طه' },
      v7: { arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', translation: 'فاذكروني أذكركم واشكروا لي ولا تكفرون.', reference: 'القرآن 2:152 — البقرة' },
    },
    surahLabel: 'سورة',
    recitationTag: 'تلاوة',
    recitationTitle: 'قراء القرآن',
    recitationSubtitle: 'اختر قارئاً واستمع إلى تلاوة القرآن بالبث المباشر من MP3Quran.net.',
    popularReciters: 'قراء مختارون',
    searchReciter: 'البحث عن قارئ',
    searchPlaceholder: 'ابحث عن قارئ بالاسم...',
    noResult: 'لم يتم العثور على قارئ لـ',
    typeToSearch: 'اكتب اسم قارئ للبحث بين',
    styles: 'أنماط',
    style: 'نمط',
    popular: 'مختار',
    surahIndexTag: 'فهرس',
    surahIndexTitle: 'السور الـ 114',
    surahIndexSubtitle: 'انقر على سورة للاستماع مباشرة مع القارئ المحدد.',
    searchSurah: 'ابحث عن سورة (الاسم، الرقم)...',
    noSurahFound: 'لم يتم العثور على سورة لـ',
    makki: 'مكية',
    madani: 'مدنية',
    loadingReciters: 'جاري تحميل القراء...',
    loadingSurahs: 'جاري تحميل السور...',
    fetchError: 'تعذر تحميل البيانات. تحقق من اتصالك.',
    retry: 'إعادة المحاولة',
    resourcesTag: 'موارد',
    resourcesTitle: 'موارد قرآنية',
    resourcesSubtitle: 'احصل على أدوات وموارد لتعميق علاقتك مع القرآن.',
    resReadCoran: 'قراءة القرآن',
    resReadCoranDesc: 'اقرأ القرآن على الإنترنت مع الترجمة الفرنسية والنطق.',
    resMp3Quran: 'MP3Quran.net',
    resMp3QuranDesc: 'منصة شاملة لتلاوات القرآن الصوتية لأكبر القراء في العالم الإسلامي.',
    resWolof: 'القرآن بالولوف',
    resWolofDesc: 'استمع واقرأ القرآن مع الترجمة بالولوف للمتحدثين السنغاليين.',
    resTafsir: 'تفسير بالفرنسية',
    resTafsirDesc: 'تعليق وتفسير القرآن باللغة الفرنسية لفهم أعمق.',
    resHifz: 'الحفظ (حفظ القرآن)',
    resHifzDesc: 'دليل عملي ومنهجية لحفظ القرآن، مناسب للبالغين والأطفال.',
  },
  common: {
    loading: 'جاري التحميل...',
    error: 'خطأ',
    close: 'إغلاق',
    menu: 'القائمة',
    search: 'بحث',
    language: 'اللغة',
  },
};

// ═══════════════════════════════════════════════════════════════
// ENGLISH
// ═══════════════════════════════════════════════════════════════
export const en: TranslationDict = {
  nav: {
    home: 'Home',
    about: 'About',
    news: 'News',
    agenda: 'Agenda',
    regions: 'Regions',
    coran: 'Quran',
    join: 'Join',
    verifyCard: 'Verify Card',
    donate: 'Donate',
    memberArea: 'Member Area',
    ourMission: 'Our Mission',
    governance: 'Governance',
    memberCard: 'Member Card',
    faq: 'FAQ',
    communiquesFatwas: 'Communiqués & Fatwas',
    events: 'Events',
    photoGallery: 'Photo Gallery',
    agendaCalendar: 'Agenda & Calendar',
  },
  hero: {
    badge: 'National Reference Institution',
    arabicMotto: 'بِالصَّبْرِ وَالْيَقِينِ تُنَالُ الْإِمَامَةُ فِي الدِّينِ',
    mottoTranslation: 'Through patience and certainty, one attains leadership in religion',
    title1: 'League of Imams and',
    title2: 'Preachers of Senegal',
    subtitle: 'Serving imams, the community, and social peace across the 14 regions of Senegal. An institutional framework for unity, training, and spiritual guidance.',
    joinCta: 'Join LIPS',
    discoverCta: 'Discover LIPS',
    members: 'Members',
    regions: 'Regions',
    mosques: 'Mosques',
  },
  prayer: {
    loading: 'Loading prayer times...',
    next: 'Next',
    chooseRegion: 'Choose a region',
    changeRegion: 'Change region',
    seeCalendar: 'View calendar',
    seeAllPrayers: 'View all prayers',
    collapse: 'Collapse',
    fajr: 'Fajr',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
  },
  services: {
    sectionTag: 'Our Services',
    sectionTitle: 'Why Choose Our Platform',
    sectionDesc: 'The SIIN platform provides innovative digital tools serving the Muslim community of Senegal, combining Islamic tradition with modern technology.',
    explore: 'Explore',
    memberSpaceNote: 'A dedicated member space is also available for members',
    memberSpaceLink: 'Member Area',
    items: {
      prayerTimes: {
        title: 'Prayer Times',
        desc: 'Accurate times for the 5 daily prayers across Senegal\'s 14 regions, with Hijri date and countdown to the next prayer.',
      },
      coran: {
        title: 'The Holy Quran',
        desc: 'Read and listen to the Quran with French translation, search by surah and verse, and audio recitations by our imams.',
      },
      agenda: {
        title: 'Agenda & Calendar',
        desc: 'Complete Hijri calendar with religious events, Islamic holidays, sacred months, and LIPS programs.',
      },
      memberCard: {
        title: 'Member Card',
        desc: 'Secure national identification card with QR code, unique registration number, and instant validity verification.',
      },
      donate: {
        title: 'Make a Donation',
        desc: 'Support imam training, community solidarity, and the maintenance of social peace in Senegal through your contribution.',
      },
      join: {
        title: 'Join LIPS',
        desc: 'Join the institutional network of imams and preachers of Senegal. Access training, the member card, and the reserved space.',
      },
    },
  },
  aboutNarrative: {
    sectionTag: 'Who We Are',
    sectionTitle1: 'League of Imams and',
    sectionTitle2: 'Preachers of Senegal',
    paragraph1: 'LIPS is the national reference institution that federates all imams and preachers of Senegal. Founded in 2006, it works for the institutionalization of the imamate, the continuous training of religious leaders, and the promotion of interfaith dialogue in the service of social peace.',
    paragraph2: 'With its presence in the 14 regions of the country and its network of over 5,000 members, LIPS constitutes a unifying framework that carries the voice of imams to public authorities, national institutions, and international partners.',
    paragraph3: 'Its headquarters at the Grand Mosque AN-NOUR in Liberté II, Dakar, is the symbolic heart of a network that connects mosques and communities across the entire Senegalese territory, from Fouta to Casamance, from the coast to the Sahel.',
    mottoTranslation: 'Through patience and certainty, one attains leadership in religion',
    sinceLabel: 'Since 2006',
    sinceDesc: '18 years of excellence serving the imamate in Senegal',
    mosqueName: 'Grand Mosque AN-NOUR',
    mosqueLocation: 'Liberté II, Dakar — LIPS Headquarters',
    imageAlt: 'Grand Mosque — LIPS Headquarters',
    cta: 'Learn more about LIPS',
  },
  stats: {
    sectionTag: 'In Numbers',
    sectionTitle: 'LIPS Impact in Numbers',
    sectionDesc: 'Concrete indicators that testify to the scope of our institutional action serving the Muslim community of Senegal.',
    items: {
      members: { label: 'Active Members', desc: 'Imams, preachers, and religious leaders supervised across the entire national territory' },
      regions: { label: 'Regions Covered', desc: 'Institutional presence in the 14 administrative regions of Senegal' },
      mosques: { label: 'Affiliated Mosques', desc: 'Network of partner mosques for spreading the message of peace and harmony' },
      trainings: { label: 'Annual Trainings', desc: 'Continuous training cycles in fiqh, aqida, daawa, and community management' },
      years: { label: 'Years of Excellence', desc: 'Since 2006, LIPS has worked for the institutionalization of the imamate in Senegal' },
      renewal: { label: 'Renewal Rate', desc: 'Loyalty and commitment of members to the annual renewal of their card' },
    },
  },
  cta: {
    joinTitle: 'Join LIPS',
    joinDesc: 'Becoming a LIPS member means accessing the national member card, continuous training, and the institutional network of Senegal\'s imams.',
    joinBtn: 'Join now',
    verifyTitle: 'Verify a Card',
    verifyDesc: 'Enter a member card registration number to instantly verify its validity and the holder\'s authenticity through our secure system.',
    verifyBtn: 'Verify a card',
    coranTitle: 'The Holy Quran',
    coranDesc: 'Explore the Holy Book, listen to recitations by our imams, and access Quranic resources to deepen your faith.',
    coranBtn: 'Read the Quran',
    donateTitle: 'Make a Donation',
    donateDesc: 'Support imam training, community solidarity, and the maintenance of social peace in Senegal through your generous contribution.',
    donateBtn: 'Donate now',
    verseArabic: 'مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا',
    verseTranslation: 'Who is it that would loan Allah a goodly loan? — Quran 2:245',
  },
  newsletter: {
    title: 'Stay Informed',
    desc: 'Receive LIPS communiqués, fatwas, and announcements directly in your inbox.',
    placeholder: 'your.email@example.sn',
    subscribe: 'Subscribe',
    success: 'Thank you! You are now subscribed to the newsletter.',
    privacy: 'No spam. Unsubscribe at any time. Your data remains confidential.',
  },
  actualites: {
    sectionTag: 'News',
    sectionTitle: 'Latest Publications',
    sectionDesc: 'Stay informed of official positions, legal opinions, and LIPS announcements.',
    allNews: 'All news',
    communiques: 'Communiqués',
    fatwas: 'Fatwas',
    events: 'Events',
    gallery: 'Photo Gallery',
    catCommunique: 'Communiqué',
    catFatwa: 'Fatwa',
    catFormation: 'Training',
    art1Title: 'Communiqué: LIPS Position on Interfaith Dialogue',
    art1Date: 'June 4, 2026',
    art1Author: 'National Bureau',
    art2Title: 'Fatwa: Conditions for Friday Prayer While Traveling',
    art2Date: 'June 1, 2026',
    art2Author: 'Fatwa Commission',
    art3Title: 'Regional Training in Thiès — June 15-18',
    art3Date: 'May 29, 2026',
    art3Author: 'Training Commission',
  },
  regions: {
    sectionTag: 'National Presence',
    sectionTitle: 'Our 14 Regions',
    sectionDesc: 'LIPS is established in the 14 administrative regions of Senegal, ensuring complete institutional coverage.',
    moreRegions: '+ 8 more regions',
    regionsLabel: 'Regions',
    mosquesLabel: 'Mosques',
    membersLabel: 'Members',
    exploreAll: 'Explore all regions',
  },
  footer: {
    orgLine1: 'League of Imams',
    orgLine2: '& Preachers of Senegal',
    description: 'National reference institution serving imams, the community, and social peace.',
    quickLinks: 'Quick Links',
    resources: 'Resources',
    contact: 'Contact',
    address: 'Grand Mosque AN-NOUR\nLiberté II, Dakar, Senegal',
    copyright: 'LIPS - League of Imams and Preachers of Senegal. All rights reserved.',
    legalNotice: 'Legal Notice',
    privacyPolicy: 'Privacy Policy',
  },
  coran: {
    heroTag: 'Divine Word',
    heroTitle: 'The Holy Quran',
    heroSubtitle: 'Listen to the most beautiful recitations of the Quran by the greatest reciters of the Muslim world, by surah and in direct streaming.',
    verseOfDay: 'Verse of the Day',
    verses: {
      v1: { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Most Gracious, the Most Merciful.', reference: 'Quran 1:1 — Al-Fatiha' },
      v2: { arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence.', reference: 'Quran 2:255 — Ayat al-Kursi' },
      v3: { arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', translation: 'And whoever fears Allah — He will make for him a way out.', reference: 'Quran 65:2 — At-Talaq' },
      v4: { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship comes ease.', reference: 'Quran 94:6 — Ash-Sharh' },
      v5: { arabic: 'وَلَذِكْرُ اللَّهِ أَكْبَرُ', translation: 'And the remembrance of Allah is indeed the greatest thing.', reference: 'Quran 29:45 — Al-Ankabut' },
      v6: { arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', translation: 'And say: "My Lord, increase me in knowledge."', reference: 'Quran 20:114 — Taha' },
      v7: { arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', translation: 'Remember Me, and I will remember you. Be grateful to Me and do not deny Me.', reference: 'Quran 2:152 — Al-Baqara' },
    },
    surahLabel: 'Surah',
    recitationTag: 'Recitation',
    recitationTitle: 'Quran Reciters',
    recitationSubtitle: 'Select a reciter and listen to the chanting of the Quran in direct streaming from MP3Quran.net.',
    popularReciters: 'Popular reciters',
    searchReciter: 'Search for a reciter',
    searchPlaceholder: 'Search for a reciter by name...',
    noResult: 'No reciter found for',
    typeToSearch: 'Type a reciter\'s name to search among',
    styles: 'styles',
    style: 'style',
    popular: 'Popular',
    surahIndexTag: 'Index',
    surahIndexTitle: 'The 114 Surahs',
    surahIndexSubtitle: 'Click on a surah to listen directly with the selected reciter.',
    searchSurah: 'Search for a surah (name, number)...',
    noSurahFound: 'No surah found for',
    makki: 'Makki',
    madani: 'Madani',
    loadingReciters: 'Loading reciters...',
    loadingSurahs: 'Loading surahs...',
    fetchError: 'Unable to load data. Check your connection.',
    retry: 'Retry',
    resourcesTag: 'Resources',
    resourcesTitle: 'Quranic Resources',
    resourcesSubtitle: 'Access tools and resources to deepen your relationship with the Quran.',
    resReadCoran: 'Read the Quran',
    resReadCoranDesc: 'Read the Quran online with French translation and transliteration.',
    resMp3Quran: 'MP3Quran.net',
    resMp3QuranDesc: 'Complete platform for audio recitations of the Quran by the greatest reciters of the Muslim world.',
    resWolof: 'Quran in Wolof',
    resWolofDesc: 'Listen and read the Quran with Wolof translation for Senegalese speakers.',
    resTafsir: 'Tafsir in French',
    resTafsirDesc: 'Commentary and exegesis of the Quran in French for deeper understanding.',
    resHifz: 'Memorization (Hifz)',
    resHifzDesc: 'Practical guide and methodology for Quran memorization, suitable for adults and children.',
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    close: 'Close',
    menu: 'Menu',
    search: 'Search',
    language: 'Language',
  },
};

// ─── Dictionary map ────────────────────────────────────────────
export const dictionaries: Record<Locale, TranslationDict> = { fr, ar, en };
