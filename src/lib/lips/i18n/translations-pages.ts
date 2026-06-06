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
      unity: { title: string; desc: string };
      formation: { title: string; desc: string };
      peace: { title: string; desc: string };
      representation: { title: string; desc: string };
      sovereignty: { title: string; desc: string };
      solidarity: { title: string; desc: string };
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

// ═══════════════════════════════════════════════════════════════
// FRENCH
// ═══════════════════════════════════════════════════════════════
export const frPages: PageTranslations = {
  pages: {
    about: { label: 'À Propos', title: 'Qui sommes-nous ?', description: "La Ligue des Imams et Prédicateurs du Sénégal est l'institution nationale de référence au service des imams, de la communauté et de la paix sociale. Découvrez notre mission, notre gouvernance et nos valeurs." },
    news: { label: 'Actualités', title: 'Communiqués & Publications', description: 'Restez informé des positions officielles, avis juridiques, formations, événements et annonces de la LIPS à travers les 14 régions du Sénégal.' },
    join: { label: 'Adhésion', title: 'Devenir Membre', description: "Rejoignez la communauté des imams et prédicateurs du Sénégal en quelques étapes simples. L'adhésion vous donne accès à la carte membre nationale, aux formations continues et au réseau institutionnel de la LIPS." },
    agenda: { label: 'Agenda', title: 'Calendrier & Événements', description: 'Consultez le calendrier grégorien et hégirien, les dates islamiques importantes et les événements organisés par la LIPS à travers les 14 régions du Sénégal.' },
    donate: { label: 'Soutenir la LIPS', title: 'Faire un Don', description: 'Votre don contribue au fonctionnement de la LIPS, à la formation des imams, à la solidarité communautaire et au maintien de la paix sociale au Sénégal.' },
    regions: { label: 'Présence Nationale', title: 'Nos 14 Régions', description: "La LIPS est implantée dans les 14 régions administratives du Sénégal, garantissant une couverture institutionnelle complète et un accompagnement de proximité pour tous les imams et prédicateurs du pays." },
    verify: { label: 'Vérification', title: 'Vérifier une Carte Membre', description: 'Saisissez le numéro de matricule figurant sur la carte membre pour vérifier instantanément sa validité. Le format est LIPS-NNNN.' },
    memberArea: { loading: 'Chargement de votre espace...', greeting: "As-salamou 'alaykoum", matricule: 'Matricule' },
    memberLogin: {
      spaceTitle: 'Espace Membre', spaceDesc: 'Connectez-vous pour accéder à votre espace personnel',
      cardTitle: 'Connexion Membre', cardDesc: 'Entrez vos identifiants pour accéder à votre espace',
      emailOrMatricule: 'Email ou Matricule', password: 'Mot de passe',
      placeholder: 'email@exemple.sn ou LIPS-0001',
      forgotPassword: 'Mot de passe oublié ?', connecting: 'Connexion...', login: 'Se connecter',
      notMember: 'Pas encore membre ?', joinLink: 'Adhérer',
      copyright: '© 2026 LIPS — Ligue des Imams et Prédicateurs du Sénégal',
      emailRequired: 'Email ou matricule requis', passwordRequired: 'Mot de passe requis',
      loginError: 'Erreur de connexion', serverError: 'Erreur de connexion au serveur',
      adminError: "Les comptes admin ne peuvent pas accéder à l'espace membre. Utilisez un compte membre (Imam, Prédicateur, etc.).",
    },
  },
  mission: {
    sectionTag: 'Notre Mission', sectionTitle: 'Les Piliers de la LIPS', sectionDesc: "La LIPS repose sur des fondations solides qui guident son action institutionnelle au service de l'islam et de la communauté sénégalaise.",
    pillars: {
      unity: { title: 'Unité Institutionnelle', desc: "Fédérer l'ensemble des imams et prédicateurs du Sénégal dans un cadre institutionnel unique, garant de cohérence et de représentativité nationale." },
      formation: { title: 'Formation Continue', desc: "Offrir aux imams et prédicateurs une formation permanente en sciences islamiques, communication et gestion communautaire." },
      peace: { title: 'Paix Sociale', desc: "Promouvoir le dialogue interreligieux et la cohésion sociale à travers des initiatives de médiation et de concorde nationale." },
      representation: { title: 'Représentation Nationale', desc: "Porter la voix des imams auprès des autorités publiques et des institutions nationales et internationales." },
      sovereignty: { title: 'Souveraineté Spirituelle', desc: "Préserver l'indépendance et l'authenticité de la pratique religieuse au Sénégal, ancrée dans la tradition malikite." },
      solidarity: { title: 'Solidarité Communautaire', desc: "Renforcer les liens de solidarité entre les mosquées, les communautés et les régions pour un islam de paix et de progrès." },
    },
  },
  gouvernance: {
    sectionTag: 'Gouvernance', sectionTitle: 'Bureau National & Institutions', sectionDesc: "Le bureau national de la LIPS est composé de leaders religieux expérimentés, épaulés par des commissions spécialisées qui couvrent les domaines clés de l'action institutionnelle.",
    bureauTitle: 'Bureau National', commissionsTitle: 'Commissions Spécialisées', membersSuffix: 'membres',
    bureau: {
      president: { role: 'Président National', bio: 'Guide spirituel et chef institutionnel de la LIPS' },
      vicePresident: { role: 'Vice-Président', bio: 'Assistant du président et coordonnateur des activités régionales' },
      secretary: { role: 'Secrétaire Général', bio: 'Responsable de la coordination administrative et institutionnelle' },
      treasurer: { role: 'Trésorier Général', bio: "Gestionnaire des finances et du patrimoine de l'institution" },
      spiritualAdvisor: { role: 'Conseiller Spirituel', bio: "Référent en matière de jurisprudence et de spiritualité islamique" },
      trainingHead: { role: 'Responsable Formation', bio: "Coordinateur des programmes de formation continue des imams" },
    },
    commissions: {
      fatwa: { name: 'Commission Fatwa', desc: 'Émission d\'avis juridiques islamiques sur les questions contemporaines' },
      formation: { name: 'Commission Formation', desc: 'Conception et déploiement des programmes de formation continue' },
      communication: { name: 'Commission Communication', desc: 'Gestion de la communication institutionnelle et des relations publiques' },
      social: { name: 'Commission Sociale', desc: "Actions de solidarité, d'entraide et d'insertion sociale" },
    },
  },
  carteMembre: {
    sectionTag: 'Carte Membre', sectionTitle: 'La Carte Membre Nationale', sectionDesc: "La carte membre nationale est un document d'identification sécurisé qui atteste de votre affiliation à la Ligue des Imams et Prédicateurs du Sénégal.",
    orgNameLine1: 'LIGUE DES IMAMS ET', orgNameLine2: 'PRÉDICATEURS DU SÉNÉGAL',
    cardTitle: 'CARTE MEMBRE', nationalLabel: 'NATIONALE',
    photo: 'PHOTO', nameLabel: 'Nom', roleLabel: 'Rôle',
    regionLabel: 'Région', matriculeLabel: 'Matricule',
    issuedLabel: 'Émis le', expiresLabel: 'Expire le',
    verifyText: 'Vérifiez la validité de cette carte',
    institutionLabel: 'Institution Nationale de Référence',
    legalNotice: "Cette carte est la propriété de la LIPS. Toute falsification ou utilisation non autorisée est passible de poursuites. En cas de perte, contactez immédiatement le secrétariat général.",
    showFront: 'Voir le recto', showBack: 'Voir le verso',
    secureDocTitle: 'Document Sécurisé', secureDocDesc: "Un document d'identification infalsifiable",
    features: {
      qr: { title: 'QR Code', desc: 'Vérification instantanée de la validité' },
      hologram: { title: 'Hologramme', desc: 'Protection anti-contrefaçon' },
      watermark: { title: 'Filigrane', desc: 'Marque de sécurité intégrée' },
      uniqueId: { title: 'Matricule Unique', desc: 'Identifiant national infalsifiable' },
      online: { title: 'Vérification en Ligne', desc: 'Système de vérification numérique' },
    },
    downloadModel: 'Télécharger le Modèle', print: 'Imprimer',
    validLabel: 'Valide',
  },
  faq: {
    sectionTag: 'FAQ', sectionTitle: 'Questions Fréquentes', sectionDesc: 'Retrouvez les réponses aux questions les plus courantes sur la LIPS, l\'adhésion et les services proposés.',
    items: {
      q1: { q: "Qu'est-ce que la LIPS ?", a: "La LIPS (Ligue des Imams et Prédicateurs du Sénégal) est l'institution nationale de référence qui fédère l'ensemble des imams et prédicateurs du Sénégal. Fondée en 2006, elle œuvre pour l'institutionnalisation de l'imamat, la formation continue et la promotion du dialogue interreligieux." },
      q2: { q: "Comment adhérer à la LIPS ?", a: "L'adhésion se fait en 4 étapes : 1) Remplir le formulaire de candidature en ligne, 2) Validation par la délégation régionale, 3) Paiement de la cotisation annuelle, 4) Délivrance de la carte membre nationale. Vous pouvez commencer votre adhésion directement sur notre site." },
      q3: { q: "Quels sont les avantages de la carte membre ?", a: "La carte membre donne accès à : la formation continue, le réseau institutionnel national, la représentation officielle, les ressources pédagogiques, l'espace membre en ligne, et la couverture sociale de la LIPS." },
      q4: { q: "Comment vérifier une carte membre ?", a: "Rendez-vous sur la page 'Vérifier une Carte', saisissez le numéro de matricule (format LIPS-NNNN) et le système vérifiera instantanément sa validité." },
      q5: { q: "La LIPS est-elle présente dans toutes les régions ?", a: "Oui, la LIPS est implantée dans les 14 régions administratives du Sénégal, de Dakar à Kédougou, garantissant une couverture institutionnelle complète et un accompagnement de proximité." },
      q6: { q: "Comment la LIPS est-elle gouvernée ?", a: "La LIPS est dirigée par un Bureau National élu, composé d'un Président National, d'un Vice-Président, d'un Secrétaire Général, d'un Trésorier Général et de conseillers. Des commissions spécialisées couvrent les domaines clés : Fatwa, Formation, Communication et Action Sociale." },
      q7: { q: "Quels types de formations sont proposés ?", a: "La LIPS propose des formations en sciences islamiques (fiqh, aqida, tafsir), en communication et prédication (khutba, daawa), en gestion communautaire et en interreligieux. Plus de 200 formations sont dispensées chaque année." },
      q8: { q: "Comment faire un don à la LIPS ?", a: "Vous pouvez faire un don en ligne via CinetPay (carte bancaire, Mobile Money) ou Wave, ou en espèces auprès de votre délégation régionale. Votre don contribue à la formation des imams et à la solidarité communautaire." },
    },
    notFound: "Vous n'avez pas trouvé la réponse à votre question ?", contactUs: 'Contactez-nous',
  },
  devenirMembre: {
    sectionTag: 'Adhésion', sectionTitle: 'Devenir Membre de la LIPS', sectionDesc: "Rejoignez le réseau institutionnel des imams et prédicateurs du Sénégal en quelques étapes simples.",
    howToJoin: "Comment adhérer ?",
    steps: {
      apply: { title: 'Candidature en ligne', desc: 'Remplissez le formulaire avec vos informations personnelles et votre mosque d\'affectation.' },
      validate: { title: 'Validation régionale', desc: 'Votre candidature est examinée par la délégation régionale de la LIPS.' },
      pay: { title: 'Cotisation annuelle', desc: 'Acquittez la cotisation annuelle pour finaliser votre adhésion.' },
      card: { title: 'Carte membre délivrée', desc: 'Recevez votre carte membre nationale avec votre matricule unique.' },
    },
    benefitsTitle: "Avantages de l'adhésion",
    benefits: {
      nationalCard: 'Carte membre nationale', training: 'Formation continue',
      network: 'Réseau institutionnel', representation: 'Représentation officielle',
      resources: 'Ressources pédagogiques', community: 'Communauté solidaire',
    },
    formTitle: "Formulaire d'adhésion",
    firstName: 'Prénom', lastName: 'Nom', email: 'Email',
    phone: 'Téléphone', region: 'Région', role: 'Rôle', mosque: "Mosquée d'affectation",
    selectPlaceholder: 'Sélectionner',
    submit: 'Soumettre ma candidature', submitted: 'Candidature soumise !',
    newApplication: 'Nouvelle candidature', conditions: "En soumettant ce formulaire, vous acceptez les conditions d'adhésion de la LIPS et certifiez l'exactitude des informations fournies.",
    roleImam: 'Imam', rolePreacher: 'Prédicateur', roleRegionalHead: 'Responsable régional', roleShura: 'Membre du Choura', roleOther: 'Autre',
    mosquePlaceholder: 'Grande Mosquée de la Médina',
  },
  verification: {
    sectionTag: 'Vérification', sectionTitle: 'Vérifier une Carte Membre', sectionDesc: "Saisissez le numéro de matricule figurant sur la carte membre pour vérifier instantanément sa validité.",
    nationalCard: 'Carte Membre Nationale', secureSystem: 'Système de vérification sécurisé LIPS',
    verifyBtn: 'Vérifier',
    emptyError: 'Veuillez saisir un numéro de matricule', formatError: 'Format invalide. Utilisez le format LIPS-NNNN (ex: LIPS-0001)', serverError: 'Erreur de connexion au serveur. Veuillez réessayer.',
    valid: 'Carte Valide', expired: 'Carte Expirée', pending: 'En Attente', notFound: 'Non Trouvé',
    active: 'ACTIF',
    resultName: 'Nom', resultRegion: 'Région', resultRole: 'Rôle',
    resultValidity: 'Validité', resultYear: 'Année',
    formatHint: 'Format : LIPS-NNNN',
  },
  dons: {
    sectionTag: 'Soutenir la LIPS', sectionTitle: 'Faire un Don', sectionDesc: "Votre générosité permet à la LIPS de poursuivre sa mission de formation, de solidarité et de paix sociale au Sénégal.",
    chooseAmount: 'Choisissez un montant (FCFA)', otherAmount: 'Autre montant...',
    impactTitle: 'Impact de votre don',
    impacts: {
      imams: 'Formation de 5 imams pendant 6 mois', mosques: 'Équipement de 10 mosquées en matériel pédagogique',
      training: 'Organisation de 3 sessions de formation régionale', solidarity: 'Aide d\'urgence pour 50 familles nécessiteuses',
      peace: 'Médiation interreligieuse dans 14 régions',
    },
    fallbackImpact: 'Votre don contribue à la formation des imams et à la paix sociale au Sénégal.',
    paymentMethod: 'Mode de paiement',
    methods: { cinetpay: 'Carte bancaire & Mobile Money', wave: 'Paiement mobile instantané', cash: 'À la délégation régionale' },
    donateAmount: 'Faire un don de {amount} FCFA',
    securePayment: 'Paiement sécurisé', fiscalReceipt: 'Reçu fiscal',
    verseTranslation: 'Qui est celui qui ferait un prêt généreux à Allah ?',
  },
  evenements: {
    sectionTag: 'Calendrier', sectionTitle: 'Événements & Activités', sectionDesc: "Découvrez les événements et activités organisés par la LIPS à travers les régions du Sénégal.",
    fullCalendar: 'Calendrier complet', registeredSuffix: 'inscrits',
  },
  actualitesPage: {
    sectionTag: 'Actualités', sectionTitle: 'Communiqués & Publications', sectionDesc: 'Restez informé des positions officielles, avis juridiques et annonces de la LIPS.',
    viewAll: 'Voir toutes les publications', newBadge: 'Nouveau', readFull: 'Lire le communiqué complet',
  },
  galerie: {
    sectionTag: 'Galerie', sectionTitle: 'Nos Moments Institutionnels', sectionDesc: 'Revivez les moments forts de la vie institutionnelle de la LIPS à travers notre galerie photo.',
    photosCount: 'photos', totalPhotos: 'photos réparties dans 6 albums',
  },
  agendaComp: {
    sectionTag: 'Agenda', sectionTitle: 'Calendrier & Événements', sectionDesc: 'Consultez le calendrier grégorien et hégirien, les dates islamiques importantes et les événements LIPS.',
    calendar: 'Calendrier', list: 'Liste',
    filterAll: 'Tous',
    upcomingIslamic: 'Prochains événements islamiques', upcomingLips: 'Événements LIPS à venir',
    today: "Aujourd'hui", inDays: 'Dans {n}j', days: '{n} jours',
    legend: { islamicDate: 'Date islamique', aid: 'Aïd', islamicEvent: 'Événement islamique', lipsEvent: 'Événement LIPS' },
    prevMonth: 'Mois précédent', nextMonth: 'Mois suivant',
  },
  regionsPage: {
    sectionTag: 'Présence Nationale', sectionTitle: 'Nos 14 Régions', sectionDesc: "La LIPS est implantée dans les 14 régions administratives du Sénégal, garantissant une couverture institutionnelle complète.",
    interactiveMap: 'Carte Interactive', exploreTitle: 'Explorez les Régions du Sénégal',
    exploreDesc: 'Survolez ou cliquez sur une région pour découvrir ses données. La carte vous guidera vers la fiche détaillée ci-dessous.',
    inhabitants: 'hab.', mosques: 'mosquées',
    summaryRegions: 'Régions', summaryDepartments: 'Départements',
    summaryMosques: 'Mosquées', summaryMembers: 'Membres',
  },
  publications: {
    sectionTag: 'Ressources', sectionTitle: 'Publications & Formations', sectionDesc: 'Accédez aux publications officielles et aux ressources de formation de la LIPS.',
    categories: {
      communiques: { title: 'Communiqués', desc: 'Positions officielles et déclarations institutionnelles' },
      fatwas: { title: 'Fatwas', desc: 'Avis juridiques islamiques sur les questions contemporaines' },
      courses: { title: 'Cours & Formations', desc: 'Supports de formation et programmes pédagogiques' },
      articles: { title: 'Articles & Réflexions', desc: 'Analyses et réflexions sur l\'islam au Sénégal' },
    },
    explore: 'Explorer',
  },
  espaceMembre: {
    loading: 'Chargement de votre espace...',
    greeting: "As-salamou 'alaykoum",
    matriculeLabel: 'Matricule',
    myCard: 'Ma Carte Membre', cardDesc: "Votre carte d'identification officielle", validLabel: 'Valide',
    profileTitle: 'Informations Personnelles', profileDesc: 'Vos données de profil', editBtn: 'Modifier',
    editProfile: 'Modifier mon profil', saveChanges: 'Enregistrer les modifications',
    firstName: 'Prénom', lastName: 'Nom', email: 'Email',
    phone: 'Téléphone', region: 'Région', mosque: 'Mosquée',
    nationalMatricule: 'Matricule National',
    paymentsTitle: 'Cotisations & Paiements', paymentsDesc: 'Historique de vos paiements',
    totalContributions: 'Total cotisations', payContribution: 'Payer ma cotisation',
    tableType: 'Type', tableAmount: 'Montant', tableDate: 'Date',
    tableMethod: 'Méthode', tableReference: 'Référence',
    quickLinks: 'Accès Rapides',
    verifyCard: 'Vérifier ma carte', qrVerification: 'Vérification QR Code',
    lipsCalendar: 'Calendrier LIPS', agendaEvents: 'Agenda & événements',
    holyQuran: 'Le Saint Coran', readListen: 'Lecture & écoute',
    makeDonation: 'Faire un don', supportLips: 'Soutenir la LIPS',
    communicationsTitle: 'Dernières Communications', communicationsDesc: 'Communiqués et fatwas récents de la LIPS',
    seeAll: 'Voir tout', noCommunications: 'Aucune communication récente',
    cardFront: 'Voir le recto', cardBack: 'Voir le verso',
    orgLine1: 'LIGUE DES IMAMS ET', orgLine2: 'PRÉDICATEURS DU SÉNÉGAL',
    cardTitle: 'CARTE MEMBRE', nationalLabel: 'NATIONALE',
    photoLabel: 'PHOTO', nameLabel: 'Nom', roleLabel: 'Rôle',
    regionLabel: 'Région', matriculeLabel2: 'Matricule',
    issuedLabel: 'Émis le', expiresLabel: 'Expire le',
    verifyText: 'Vérifiez la validité de cette carte',
    institutionLabel: 'Institution Nationale de Référence',
    legalNotice: "Cette carte est la propriété de la LIPS. Toute falsification ou utilisation non autorisée est passible de poursuites.",
    statusActive: 'ACTIF', statusExpired: 'EXPIRÉ', statusPending: 'EN ATTENTE',
    roleImam: 'Imam', rolePreacher: 'Prédicateur', roleRegionalHead: 'Responsable Régional', roleShura: 'Membre Choura',
    commCommunique: 'Communiqué', commFatwa: 'Fatwa', commEvent: 'Événement',
    currency: 'FCFA',
  },
};

// ═══════════════════════════════════════════════════════════════
// ARABIC
// ═══════════════════════════════════════════════════════════════
export const arPages: PageTranslations = {
  pages: {
    about: { label: 'من نحن', title: 'من نحن؟', description: 'رابطة الأئمة والخطباء في السنغال هي المؤسسة الوطنية المرجعية في خدمة الأئمة والمجتمع والسلام الاجتماعي. اكتشف مهمتنا وحوكمتنا وقيمنا.' },
    news: { label: 'أخبار', title: 'بيانات ومنشورات', description: 'ابق على اطلاع من المواقف الرسمية والآراء القانونية والتكوينات والفعاليات وإعلانات الرابطة عبر المناطق الأربع عشرة في السنغال.' },
    join: { label: 'انضمام', title: 'أن تصبح عضواً', description: 'انضم إلى مجتمع الأئمة والخطباء في السنغال بخطوات بسيطة. العضوية تمنحك بطاقة العضوية الوطنية والتكوينات المستمرة والشبكة المؤسسية للرابطة.' },
    agenda: { label: 'أجندة', title: 'التقويم والفعاليات', description: 'استعرض التقويم الميلادي والهجري والتواريخ الإسلامية المهمة والفعاليات التي تنظمها الرابطة عبر المناطق الأربع عشرة في السنغال.' },
    donate: { label: 'ادعم الرابطة', title: 'التبرع', description: 'تبرعك يساهم في تسيير الرابطة وتكوين الأئمة والتضامن المجتمعي والحفاظ على السلام الاجتماعي في السنغال.' },
    regions: { label: 'الحضور الوطني', title: 'المناطق الأربع عشرة', description: 'الرابطة متواجدة في المناطق الإدارية الأربع عشرة بالسنغال، مما يضمن تغطية مؤسسية كاملة ومرافقة قريبة لجميع الأئمة والخطباء في البلاد.' },
    verify: { label: 'التحقق', title: 'التحقق من بطاقة عضوية', description: 'أدخل رقم التسجيل الموجود على بطاقة العضوية للتحقق الفوري من صلاحيتها. التنسيق هو الرابطة-السنة-المنطقة-الرقم.' },
    memberArea: { loading: 'جاري تحميل فضائك...', greeting: 'السلام عليكم', matricule: 'رقم التسجيل' },
    memberLogin: {
      spaceTitle: 'فضاء الأعضاء', spaceDesc: 'اتصل للوصول إلى فضائك الشخصي',
      cardTitle: 'تسجيل دخول الأعضاء', cardDesc: 'أدخل بياناتك للوصول إلى فضائك',
      emailOrMatricule: 'البريد الإلكتروني أو رقم التسجيل', password: 'كلمة المرور',
      placeholder: 'بريدك@مثال.sn أو الرابطة-2025-DKR-000124',
      forgotPassword: 'نسيت كلمة المرور؟', connecting: 'جاري الاتصال...', login: 'تسجيل الدخول',
      notMember: 'لست عضواً بعد؟', joinLink: 'انضم',
      copyright: '© 2026 الرابطة — رابطة الأئمة والخطباء في السنغال',
      emailRequired: 'البريد الإلكتروني أو رقم التسجيل مطلوب', passwordRequired: 'كلمة المرور مطلوبة',
      loginError: 'خطأ في الاتصال', serverError: 'خطأ في الاتصال بالخادم',
      adminError: 'لا يمكن للحسابات الإدارية الوصول إلى فضاء الأعضاء. استخدم حساب عضو (إمام، خطيب، إلخ).',
    },
  },
  mission: {
    sectionTag: 'مهمتنا', sectionTitle: 'أركان الرابطة', sectionDesc: 'تقوم الرابطة على أسس متينة توجه عملها المؤسسي في خدمة الإسلام والمجتمع السنغالي.',
    pillars: {
      unity: { title: 'الوحدة المؤسسية', desc: 'تجميع جميع الأئمة والخطباء في السنغال في إطار مؤسسي واحد يضمن التماسك والتمثيل الوطني.' },
      formation: { title: 'التكوين المستمر', desc: 'تقديم تكوين دائم للأئمة والخطباء في العلوم الإسلامية والتواصل والتسيير المجتمعي.' },
      peace: { title: 'السلام الاجتماعي', desc: 'تعزيز الحوار بين الأديان والتماسك الاجتماعي من خلال مبادرات الوساطة والوفاق الوطني.' },
      representation: { title: 'التمثيل الوطني', desc: 'حمل صوت الأئمة أمام السلطات العمومية والمؤسسات الوطنية والدولية.' },
      sovereignty: { title: 'السيادة الروحية', desc: 'الحفاظ على استقلال وأصالة الممارسة الدينية في السنغال المتجذرة في المذهب المالكي.' },
      solidarity: { title: 'التضامن المجتمعي', desc: 'تعزيز روابط التضامن بين المساجد والمجتمعات والمناطق من أجل إسلام سلام وتقدم.' },
    },
  },
  gouvernance: {
    sectionTag: 'الحوكمة', sectionTitle: 'المكتب الوطني والمؤسسات', sectionDesc: 'يتكون المكتب الوطني للرابطة من قادة دينيين ذوي خبرة، مدعومين بلجان متخصصة تغطي المجالات الرئيسية للعمل المؤسسي.',
    bureauTitle: 'المكتب الوطني', commissionsTitle: 'اللجان المتخصصة', membersSuffix: 'أعضاء',
    bureau: {
      president: { role: 'الرئيس الوطني', bio: 'المرشد الروحي والرئيس المؤسسي للرابطة' },
      vicePresident: { role: 'نائب الرئيس', bio: 'مساعد الرئيس ومنسق الأنشطة الإقليمية' },
      secretary: { role: 'الأمين العام', bio: 'مسؤول عن التنسيق الإداري والمؤسسي' },
      treasurer: { role: 'أمين المال', bio: 'مدير المالية والتراث المؤسسي' },
      spiritualAdvisor: { role: 'المستشار الروحي', bio: 'مرجع في الفقه والروحانية الإسلامية' },
      trainingHead: { role: 'مسؤول التكوين', bio: 'منسق برامج التكوين المستمر للأئمة' },
    },
    commissions: {
      fatwa: { name: 'لجنة الفتوى', desc: 'إصدار آراء فقهية إسلامية في المسائل المعاصرة' },
      formation: { name: 'لجنة التكوين', desc: 'تصميم ونشر برامج التكوين المستمر' },
      communication: { name: 'لجنة التواصل', desc: 'إدارة التواصل المؤسسي والعلاقات العامة' },
      social: { name: 'لجنة الشؤون الاجتماعية', desc: 'أعمال التضامن والمساعدة والإدماج الاجتماعي' },
    },
  },
  carteMembre: {
    sectionTag: 'بطاقة العضوية', sectionTitle: 'بطاقة العضوية الوطنية', sectionDesc: 'بطاقة العضوية الوطنية هي وثيقة تعريف مؤمّنة تثبت انتماءك لرابطة الأئمة والخطباء في السنغال.',
    orgNameLine1: 'رابطة الأئمة و', orgNameLine2: 'الخطباء في السنغال',
    cardTitle: 'بطاقة العضوية', nationalLabel: 'الوطنية',
    photo: 'صورة', nameLabel: 'الاسم', roleLabel: 'الوظيفة',
    regionLabel: 'المنطقة', matriculeLabel: 'رقم التسجيل',
    issuedLabel: 'تاريخ الإصدار', expiresLabel: 'تاريخ الانتهاء',
    verifyText: 'تحقق من صلاحية هذه البطاقة',
    institutionLabel: 'مؤسسة وطنية مرجعية',
    legalNotice: 'هذه البطاقة ملك الرابطة. أي تزوير أو استخدام غير مصرح به عرضة للملاحقة القانونية. في حالة الفقدان، اتصل فوراً بالأمانة العامة.',
    showFront: 'عرض الوجه', showBack: 'عرض الظهر',
    secureDocTitle: 'وثيقة مؤمّنة', secureDocDesc: 'وثيقة تعريف غير قابلة للتزوير',
    features: {
      qr: { title: 'رمز QR', desc: 'التحقق الفوري من الصلاحية' },
      hologram: { title: 'هولوغرام', desc: 'حماية من التزييف' },
      watermark: { title: 'علامة مائية', desc: 'علامة أمان مدمجة' },
      uniqueId: { title: 'رقم تسجيل فريد', desc: 'معرف وطني غير قابل للتزوير' },
      online: { title: 'التحقق عبر الإنترنت', desc: 'نظام تحقق رقمي' },
    },
    downloadModel: 'تحميل النموذج', print: 'طباعة',
    validLabel: 'ساري',
  },
  faq: {
    sectionTag: 'الأسئلة الشائعة', sectionTitle: 'الأسئلة المتكررة', sectionDesc: 'اعثر على إجابات للأسئلة الأكثر شيوعاً حول الرابطة والعضوية والخدمات المقدمة.',
    items: {
      q1: { q: 'ما هي الرابطة؟', a: 'الرابطة (رابطة الأئمة والخطباء في السنغال) هي المؤسسة الوطنية المرجعية التي تجمع جميع الأئمة والخطباء في السنغال. تأسست عام 2006 وتسعى لتأطير الإمامة والتكوين المستمر وتعزيز الحوار بين الأديان.' },
      q2: { q: 'كيف أنضم إلى الرابطة؟', a: 'الانضمام يتم في 4 خطوات: 1) ملء استمارة الترشح عبر الإنترنت، 2) المصادقة من طرف الوفد الجهوي، 3) دفع الاشتراك السنوي، 4) تسليم بطاقة العضوية الوطنية. يمكنك بدء انضمامك مباشرة على موقعنا.' },
      q3: { q: 'ما هي مزايا بطاقة العضوية؟', a: 'بطاقة العضوية تمنح الوصول إلى: التكوين المستمر، الشبكة المؤسسية الوطنية، التمثيل الرسمي، الموارد البيداغوجية، فضاء الأعضاء عبر الإنترنت، والتغطية الاجتماعية للرابطة.' },
      q4: { q: 'كيف أتحقق من بطاقة عضوية؟', a: 'اذهب إلى صفحة "التحقق من بطاقة"، أدخل رقم التسجيل (التنسيق: الرابطة-السنة-المنطقة-الرقم) وسيتحقق النظام فوراً من صلاحيتها.' },
      q5: { q: 'هل الرابطة متواجدة في جميع المناطق؟', a: 'نعم، الرابطة متواجدة في المناطق الإدارية الأربع عشرة بالسنغال، من داكار إلى كيدوغو، مما يضمن تغطية مؤسسية كاملة ومرافقة قريبة.' },
      q6: { q: 'كيف تدار الرابطة؟', a: 'الرابطة يديرها مكتب وطني منتخب، يتكون من رئيس وطني ونائب رئيس وأمين عام وأمين مال ومستشارين. لجان متخصصة تغطي المجالات الرئيسية: الفتوى، التكوين، التواصل والعمل الاجتماعي.' },
      q7: { q: 'ما أنواع التكوينات المقدمة؟', a: 'الرابطة تقدم تكوينات في العلوم الإسلامية (فقه، عقيدة، تفسير)، والتواصل والخطابة (خطبة، دعوة)، والتسيير المجتمعي وبين الأديان. أكثر من 200 تكوين يتم تقديمها سنوياً.' },
      q8: { q: 'كيف أتبرع للرابطة؟', a: 'يمكنك التبرع عبر الإنترنت عبر CinetPay (بطاقة بنكية، Mobile Money) أو Wave، أو نقداً لدى وفدك الجهوي. تبرعك يساهم في تكوين الأئمة والتضامن المجتمعي.' },
    },
    notFound: 'لم تجد الإجابة على سؤالك؟', contactUs: 'اتصل بنا',
  },
  devenirMembre: {
    sectionTag: 'انضمام', sectionTitle: 'أن تصبح عضواً في الرابطة', sectionDesc: 'انضم إلى الشبكة المؤسسية للأئمة والخطباء في السنغال بخطوات بسيطة.',
    howToJoin: 'كيف تنضم؟',
    steps: {
      apply: { title: 'الترشح عبر الإنترنت', desc: 'املأ الاستمارة بمعلوماتك الشخصية ومسجدك.' },
      validate: { title: 'المصادقة الجهوية', desc: 'يتم فحص ترشحك من طرف وفد الرابطة الجهوي.' },
      pay: { title: 'الاشتراك السنوي', desc: 'ادفع الاشتراك السنوي لإنهاء انضمامك.' },
      card: { title: 'تسليم بطاقة العضوية', desc: 'استلم بطاقة عضويتك الوطنية برقم تسجيلك الفريد.' },
    },
    benefitsTitle: 'مزايا العضوية',
    benefits: { nationalCard: 'بطاقة العضوية الوطنية', training: 'التكوين المستمر', network: 'الشبكة المؤسسية', representation: 'التمثيل الرسمي', resources: 'الموارد البيداغوجية', community: 'المجتمع المتضامن' },
    formTitle: 'استمارة الانضمام',
    firstName: 'الاسم الأول', lastName: 'الاسم الأخير', email: 'البريد الإلكتروني',
    phone: 'الهاتف', region: 'المنطقة', role: 'الوظيفة', mosque: 'مسجد الانتماء',
    selectPlaceholder: 'اختر',
    submit: 'إرسال ترشحي', submitted: 'تم إرسال الترشح!',
    newApplication: 'ترشح جديد', conditions: 'بإرسال هذه الاستمارة، أنت تقبل شروط انضمام الرابطة وتصرح بصحة المعلومات المقدمة.',
    roleImam: 'إمام', rolePreacher: 'خطيب', roleRegionalHead: 'مسؤول جهوي', roleShura: 'عضو شورى', roleOther: 'آخر',
    mosquePlaceholder: 'الجامع الكبير للمدينة',
  },
  verification: {
    sectionTag: 'التحقق', sectionTitle: 'التحقق من بطاقة عضوية', sectionDesc: 'أدخل رقم التسجيل الموجود على بطاقة العضوية للتحقق الفوري من صلاحيتها.',
    nationalCard: 'بطاقة العضوية الوطنية', secureSystem: 'نظام تحقق مؤمّن الرابطة',
    verifyBtn: 'تحقق',
    emptyError: 'يرجى إدخال رقم التسجيل', formatError: 'تنسيق غير صالح. استخدم التنسيق الرابطة-السنة-المنطقة-الرقم', serverError: 'خطأ في الاتصال بالخادم. يرجى إعادة المحاولة.',
    valid: 'بطاقة صالحة', expired: 'بطاقة منتهية', pending: 'قيد الانتظار', notFound: 'غير موجودة',
    active: 'نشط',
    resultName: 'الاسم', resultRegion: 'المنطقة', resultRole: 'الوظيفة',
    resultValidity: 'الصلاحية', resultYear: 'السنة',
    formatHint: 'التنسيق: الرابطة-السنة-المنطقة-الرقم',
  },
  dons: {
    sectionTag: 'ادعم الرابطة', sectionTitle: 'التبرع', sectionDesc: 'كرمك يمكّن الرابطة من مواصلة مهمتها في التكوين والتضامن والسلام الاجتماعي في السنغال.',
    chooseAmount: 'اختر مبلغاً (فرنك)', otherAmount: 'مبلغ آخر...',
    impactTitle: 'أثر تبرعك',
    impacts: { imams: 'تكوين 5 أئمة لمدة 6 أشهر', mosques: 'تجهيز 10 مساجد بمواد بيداغوجية', training: 'تنظيم 3 دورات تكوين جهوية', solidarity: 'مساعدة طارئة لـ 50 عائلة محتاجة', peace: 'وساطة بين الأديان في 14 منطقة' },
    fallbackImpact: 'تبرعك يساهم في تكوين الأئمة والسلام الاجتماعي في السنغال.',
    paymentMethod: 'طريقة الدفع',
    methods: { cinetpay: 'بطاقة بنكية و Mobile Money', wave: 'دفع فوري عبر الهاتف', cash: 'لدى الوفد الجهوي' },
    donateAmount: 'تبرع بمبلغ {amount} فرنك',
    securePayment: 'دفع مؤمّن', fiscalReceipt: 'إيصال جبائي',
    verseTranslation: 'من ذا الذي يقرض الله قرضاً حسناً؟',
  },
  evenements: {
    sectionTag: 'التقويم', sectionTitle: 'الفعاليات والأنشطة', sectionDesc: 'اكتشف الفعاليات والأنشطة التي تنظمها الرابطة عبر مناطق السنغال.',
    fullCalendar: 'التقويم الكامل', registeredSuffix: 'مسجلون',
  },
  actualitesPage: {
    sectionTag: 'أخبار', sectionTitle: 'بيانات ومنشورات', sectionDesc: 'ابق على اطلاع من المواقف الرسمية والآراء القانونية وإعلانات الرابطة.',
    viewAll: 'عرض جميع المنشورات', newBadge: 'جديد', readFull: 'قراءة البيان كاملاً',
  },
  galerie: {
    sectionTag: 'معرض', sectionTitle: 'لحظاتنا المؤسسية', sectionDesc: 'عش مجدداً أبرز لحظات الحياة المؤسسية للرابطة عبر معرض الصور.',
    photosCount: 'صور', totalPhotos: 'صور موزعة على 6 ألبومات',
  },
  agendaComp: {
    sectionTag: 'أجندة', sectionTitle: 'التقويم والفعاليات', sectionDesc: 'استعرض التقويم الميلادي والهجري والتواريخ الإسلامية المهمة وفعاليات الرابطة.',
    calendar: 'التقويم', list: 'القائمة',
    filterAll: 'الكل',
    upcomingIslamic: 'الفعاليات الإسلامية القادمة', upcomingLips: 'فعاليات الرابطة القادمة',
    today: 'اليوم', inDays: 'خلال {n}ي', days: '{n} أيام',
    legend: { islamicDate: 'التاريخ الإسلامي', aid: 'عيد', islamicEvent: 'فعالية إسلامية', lipsEvent: 'فعالية الرابطة' },
    prevMonth: 'الشهر السابق', nextMonth: 'الشهر التالي',
  },
  regionsPage: {
    sectionTag: 'الحضور الوطني', sectionTitle: 'المناطق الأربع عشرة', sectionDesc: 'الرابطة متواجدة في المناطق الإدارية الأربع عشرة بالسنغال، مما يضمن تغطية مؤسسية كاملة.',
    interactiveMap: 'خريطة تفاعلية', exploreTitle: 'استكشف مناطق السنغال',
    exploreDesc: 'مرر أو انقر على منطقة لاكتشاف بياناتها. الخريطة سترشدك إلى البطاقة التفصيلية أدناه.',
    inhabitants: 'نسمة', mosques: 'مساجد',
    summaryRegions: 'مناطق', summaryDepartments: 'أقاليم',
    summaryMosques: 'مساجد', summaryMembers: 'أعضاء',
  },
  publications: {
    sectionTag: 'موارد', sectionTitle: 'المنشورات والتكوينات', sectionDesc: 'احصل على المنشورات الرسمية وموارد التكوين من الرابطة.',
    categories: {
      communiques: { title: 'بيانات', desc: 'المواقف الرسمية والإعلانات المؤسسية' },
      fatwas: { title: 'فتاوى', desc: 'آراء فقهية إسلامية في المسائل المعاصرة' },
      courses: { title: 'دروس وتكوينات', desc: 'وسائل التكوين والبرامج البيداغوجية' },
      articles: { title: 'مقالات وتأملات', desc: 'تحليلات وتأملات حول الإسلام في السنغال' },
    },
    explore: 'استكشف',
  },
  espaceMembre: {
    loading: 'جاري تحميل فضائك...',
    greeting: 'السلام عليكم',
    matriculeLabel: 'رقم التسجيل',
    myCard: 'بطاقتي', cardDesc: 'بطاقة تعريفك الرسمية', validLabel: 'ساري',
    profileTitle: 'المعلومات الشخصية', profileDesc: 'بيانات ملفك', editBtn: 'تعديل',
    editProfile: 'تعديل ملفي', saveChanges: 'حفظ التعديلات',
    firstName: 'الاسم الأول', lastName: 'الاسم الأخير', email: 'البريد الإلكتروني',
    phone: 'الهاتف', region: 'المنطقة', mosque: 'المسجد',
    nationalMatricule: 'رقم التسجيل الوطني',
    paymentsTitle: 'الاشتراكات والمدفوعات', paymentsDesc: 'سجل مدفوعاتك',
    totalContributions: 'مجموع الاشتراكات', payContribution: 'ادفع اشتراكي',
    tableType: 'النوع', tableAmount: 'المبلغ', tableDate: 'التاريخ',
    tableMethod: 'الطريقة', tableReference: 'المرجع',
    quickLinks: 'روابط سريعة',
    verifyCard: 'تحقق من بطاقتي', qrVerification: 'التحقق برمز QR',
    lipsCalendar: 'تقويم الرابطة', agendaEvents: 'الأجندة والفعاليات',
    holyQuran: 'القرآن الكريم', readListen: 'قراءة واستماع',
    makeDonation: 'التبرع', supportLips: 'ادعم الرابطة',
    communicationsTitle: 'آخر الاتصالات', communicationsDesc: 'البيانات والفتاوى الأخيرة للرابطة',
    seeAll: 'عرض الكل', noCommunications: 'لا اتصالات حديثة',
    cardFront: 'عرض الوجه', cardBack: 'عرض الظهر',
    orgLine1: 'رابطة الأئمة و', orgLine2: 'الخطباء في السنغال',
    cardTitle: 'بطاقة العضوية', nationalLabel: 'الوطنية',
    photoLabel: 'صورة', nameLabel: 'الاسم', roleLabel: 'الوظيفة',
    regionLabel: 'المنطقة', matriculeLabel2: 'رقم التسجيل',
    issuedLabel: 'تاريخ الإصدار', expiresLabel: 'تاريخ الانتهاء',
    verifyText: 'تحقق من صلاحية هذه البطاقة',
    institutionLabel: 'مؤسسة وطنية مرجعية',
    legalNotice: 'هذه البطاقة ملك الرابطة. أي تزوير أو استخدام غير مصرح به عرضة للملاحقة القانونية.',
    statusActive: 'نشط', statusExpired: 'منتهي', statusPending: 'قيد الانتظار',
    roleImam: 'إمام', rolePreacher: 'خطيب', roleRegionalHead: 'مسؤول جهوي', roleShura: 'عضو شورى',
    commCommunique: 'بيان', commFatwa: 'فتوى', commEvent: 'فعالية',
    currency: 'فرنك',
  },
};

// ═══════════════════════════════════════════════════════════════
// ENGLISH
// ═══════════════════════════════════════════════════════════════
export const enPages: PageTranslations = {
  pages: {
    about: { label: 'About', title: 'Who Are We?', description: 'The League of Imams and Preachers of Senegal is the national reference institution serving imams, the community, and social peace. Discover our mission, governance, and values.' },
    news: { label: 'News', title: 'Communiqués & Publications', description: 'Stay informed of official positions, legal opinions, training, events, and LIPS announcements across the 14 regions of Senegal.' },
    join: { label: 'Membership', title: 'Become a Member', description: 'Join the community of imams and preachers of Senegal in a few simple steps. Membership gives you access to the national member card, continuous training, and the LIPS institutional network.' },
    agenda: { label: 'Agenda', title: 'Calendar & Events', description: 'View the Gregorian and Hijri calendar, important Islamic dates, and events organized by LIPS across the 14 regions of Senegal.' },
    donate: { label: 'Support LIPS', title: 'Make a Donation', description: 'Your donation contributes to LIPS operations, imam training, community solidarity, and maintaining social peace in Senegal.' },
    regions: { label: 'National Presence', title: 'Our 14 Regions', description: 'LIPS is established in the 14 administrative regions of Senegal, ensuring complete institutional coverage and local support for all imams and preachers.' },
    verify: { label: 'Verification', title: 'Verify a Member Card', description: 'Enter the registration number on the member card to instantly verify its validity. Format: LIPS-NNNN.' },
    memberArea: { loading: 'Loading your space...', greeting: 'As-salamu alaykum', matricule: 'Registration No.' },
    memberLogin: {
      spaceTitle: 'Member Area', spaceDesc: 'Sign in to access your personal space',
      cardTitle: 'Member Login', cardDesc: 'Enter your credentials to access your space',
      emailOrMatricule: 'Email or Registration No.', password: 'Password',
      placeholder: 'email@example.sn or LIPS-0001',
      forgotPassword: 'Forgot password?', connecting: 'Connecting...', login: 'Sign in',
      notMember: 'Not a member yet?', joinLink: 'Join',
      copyright: '© 2026 LIPS — League of Imams and Preachers of Senegal',
      emailRequired: 'Email or registration number required', passwordRequired: 'Password required',
      loginError: 'Login error', serverError: 'Server connection error',
      adminError: 'Admin accounts cannot access the member area. Use a member account (Imam, Preacher, etc.).',
    },
  },
  mission: {
    sectionTag: 'Our Mission', sectionTitle: 'The Pillars of LIPS', sectionDesc: 'LIPS rests on solid foundations that guide its institutional action serving Islam and the Senegalese community.',
    pillars: {
      unity: { title: 'Institutional Unity', desc: 'Federate all imams and preachers of Senegal in a single institutional framework, guaranteeing coherence and national representativeness.' },
      formation: { title: 'Continuous Training', desc: 'Provide imams and preachers with ongoing training in Islamic sciences, communication, and community management.' },
      peace: { title: 'Social Peace', desc: 'Promote interfaith dialogue and social cohesion through mediation and national concord initiatives.' },
      representation: { title: 'National Representation', desc: 'Carry the voice of imams to public authorities and national and international institutions.' },
      sovereignty: { title: 'Spiritual Sovereignty', desc: 'Preserve the independence and authenticity of religious practice in Senegal, rooted in the Maliki tradition.' },
      solidarity: { title: 'Community Solidarity', desc: 'Strengthen solidarity ties between mosques, communities, and regions for an Islam of peace and progress.' },
    },
  },
  gouvernance: {
    sectionTag: 'Governance', sectionTitle: 'National Bureau & Institutions', sectionDesc: 'The national bureau of LIPS is composed of experienced religious leaders, supported by specialized commissions covering key areas of institutional action.',
    bureauTitle: 'National Bureau', commissionsTitle: 'Specialized Commissions', membersSuffix: 'members',
    bureau: {
      president: { role: 'National President', bio: 'Spiritual guide and institutional head of LIPS' },
      vicePresident: { role: 'Vice-President', bio: 'Assistant to the president and coordinator of regional activities' },
      secretary: { role: 'Secretary General', bio: 'Responsible for administrative and institutional coordination' },
      treasurer: { role: 'Treasurer General', bio: 'Manager of the institution\'s finances and assets' },
      spiritualAdvisor: { role: 'Spiritual Advisor', bio: 'Reference for Islamic jurisprudence and spirituality' },
      trainingHead: { role: 'Training Director', bio: 'Coordinator of continuing education programs for imams' },
    },
    commissions: {
      fatwa: { name: 'Fatwa Commission', desc: 'Issuing Islamic legal opinions on contemporary matters' },
      formation: { name: 'Training Commission', desc: 'Design and deployment of continuing education programs' },
      communication: { name: 'Communication Commission', desc: 'Institutional communication and public relations management' },
      social: { name: 'Social Commission', desc: 'Solidarity, mutual aid, and social integration actions' },
    },
  },
  carteMembre: {
    sectionTag: 'Member Card', sectionTitle: 'The National Member Card', sectionDesc: 'The national member card is a secure identification document attesting to your affiliation with the League of Imams and Preachers of Senegal.',
    orgNameLine1: 'LEAGUE OF IMAMS AND', orgNameLine2: 'PREACHERS OF SENEGAL',
    cardTitle: 'MEMBER CARD', nationalLabel: 'NATIONAL',
    photo: 'PHOTO', nameLabel: 'Name', roleLabel: 'Role',
    regionLabel: 'Region', matriculeLabel: 'Reg. No.',
    issuedLabel: 'Issued', expiresLabel: 'Expires',
    verifyText: 'Verify the validity of this card',
    institutionLabel: 'National Reference Institution',
    legalNotice: 'This card is the property of LIPS. Any falsification or unauthorized use is subject to prosecution. In case of loss, contact the general secretariat immediately.',
    showFront: 'Show front', showBack: 'Show back',
    secureDocTitle: 'Secure Document', secureDocDesc: 'An unfalsifiable identification document',
    features: {
      qr: { title: 'QR Code', desc: 'Instant validity verification' },
      hologram: { title: 'Hologram', desc: 'Anti-counterfeiting protection' },
      watermark: { title: 'Watermark', desc: 'Integrated security mark' },
      uniqueId: { title: 'Unique ID', desc: 'Unforgable national identifier' },
      online: { title: 'Online Verification', desc: 'Digital verification system' },
    },
    downloadModel: 'Download Model', print: 'Print',
    validLabel: 'Valid',
  },
  faq: {
    sectionTag: 'FAQ', sectionTitle: 'Frequently Asked Questions', sectionDesc: 'Find answers to the most common questions about LIPS, membership, and services offered.',
    items: {
      q1: { q: 'What is LIPS?', a: 'LIPS (League of Imams and Preachers of Senegal) is the national reference institution that federates all imams and preachers of Senegal. Founded in 2006, it works for the institutionalization of the imamate, continuous training, and the promotion of interfaith dialogue.' },
      q2: { q: 'How to join LIPS?', a: 'Membership involves 4 steps: 1) Fill out the online application form, 2) Validation by the regional delegation, 3) Payment of the annual fee, 4) Issuance of the national member card. You can start your application directly on our website.' },
      q3: { q: 'What are the benefits of the member card?', a: 'The member card gives access to: continuing education, the national institutional network, official representation, educational resources, the online member area, and LIPS social coverage.' },
      q4: { q: 'How to verify a member card?', a: 'Go to the "Verify a Card" page, enter the registration number (format: LIPS-NNNN) and the system will instantly verify its validity.' },
      q5: { q: 'Is LIPS present in all regions?', a: 'Yes, LIPS is established in the 14 administrative regions of Senegal, from Dakar to Kédougou, ensuring complete institutional coverage and local support.' },
      q6: { q: 'How is LIPS governed?', a: 'LIPS is led by an elected National Bureau, consisting of a National President, Vice-President, Secretary General, Treasurer General, and advisors. Specialized commissions cover key areas: Fatwa, Training, Communication, and Social Action.' },
      q7: { q: 'What types of training are offered?', a: 'LIPS offers training in Islamic sciences (fiqh, aqida, tafsir), communication and preaching (khutba, daawa), community management, and interfaith dialogue. Over 200 training sessions are held each year.' },
      q8: { q: 'How to donate to LIPS?', a: 'You can donate online via CinetPay (bank card, Mobile Money) or Wave, or in cash at your regional delegation. Your donation contributes to imam training and community solidarity.' },
    },
    notFound: "Didn't find the answer to your question?", contactUs: 'Contact us',
  },
  devenirMembre: {
    sectionTag: 'Membership', sectionTitle: 'Become a LIPS Member', sectionDesc: 'Join the institutional network of imams and preachers of Senegal in a few simple steps.',
    howToJoin: 'How to join?',
    steps: {
      apply: { title: 'Online Application', desc: 'Fill out the form with your personal information and assigned mosque.' },
      validate: { title: 'Regional Validation', desc: 'Your application is reviewed by the LIPS regional delegation.' },
      pay: { title: 'Annual Fee', desc: 'Pay the annual fee to finalize your membership.' },
      card: { title: 'Member Card Issued', desc: 'Receive your national member card with your unique registration number.' },
    },
    benefitsTitle: 'Membership Benefits',
    benefits: { nationalCard: 'National Member Card', training: 'Continuing Education', network: 'Institutional Network', representation: 'Official Representation', resources: 'Educational Resources', community: 'Solidarity Community' },
    formTitle: 'Membership Application Form',
    firstName: 'First Name', lastName: 'Last Name', email: 'Email',
    phone: 'Phone', region: 'Region', role: 'Role', mosque: 'Assigned Mosque',
    selectPlaceholder: 'Select',
    submit: 'Submit My Application', submitted: 'Application Submitted!',
    newApplication: 'New Application', conditions: 'By submitting this form, you accept the LIPS membership conditions and certify the accuracy of the information provided.',
    roleImam: 'Imam', rolePreacher: 'Preacher', roleRegionalHead: 'Regional Head', roleShura: 'Shura Member', roleOther: 'Other',
    mosquePlaceholder: 'Grand Mosque of the Medina',
  },
  verification: {
    sectionTag: 'Verification', sectionTitle: 'Verify a Member Card', sectionDesc: 'Enter the registration number on the member card to instantly verify its validity.',
    nationalCard: 'National Member Card', secureSystem: 'LIPS Secure Verification System',
    verifyBtn: 'Verify',
    emptyError: 'Please enter a registration number', formatError: 'Invalid format. Use LIPS-NNNN format', serverError: 'Server connection error. Please try again.',
    valid: 'Valid Card', expired: 'Expired Card', pending: 'Pending', notFound: 'Not Found',
    active: 'ACTIVE',
    resultName: 'Name', resultRegion: 'Region', resultRole: 'Role',
    resultValidity: 'Validity', resultYear: 'Year',
    formatHint: 'Format: LIPS-NNNN',
  },
  dons: {
    sectionTag: 'Support LIPS', sectionTitle: 'Make a Donation', sectionDesc: 'Your generosity enables LIPS to pursue its mission of training, solidarity, and social peace in Senegal.',
    chooseAmount: 'Choose an amount (FCFA)', otherAmount: 'Other amount...',
    impactTitle: 'Impact of Your Donation',
    impacts: { imams: 'Training 5 imams for 6 months', mosques: 'Equipping 10 mosques with educational materials', training: 'Organizing 3 regional training sessions', solidarity: 'Emergency aid for 50 needy families', peace: 'Interfaith mediation in 14 regions' },
    fallbackImpact: 'Your donation contributes to imam training and social peace in Senegal.',
    paymentMethod: 'Payment Method',
    methods: { cinetpay: 'Bank Card & Mobile Money', wave: 'Instant Mobile Payment', cash: 'At the regional delegation' },
    donateAmount: 'Donate {amount} FCFA',
    securePayment: 'Secure Payment', fiscalReceipt: 'Tax Receipt',
    verseTranslation: 'Who is it that would loan Allah a goodly loan?',
  },
  evenements: {
    sectionTag: 'Calendar', sectionTitle: 'Events & Activities', sectionDesc: 'Discover events and activities organized by LIPS across the regions of Senegal.',
    fullCalendar: 'Full Calendar', registeredSuffix: 'registered',
  },
  actualitesPage: {
    sectionTag: 'News', sectionTitle: 'Communiqués & Publications', sectionDesc: 'Stay informed of official positions, legal opinions, and LIPS announcements.',
    viewAll: 'View all publications', newBadge: 'New', readFull: 'Read the full communiqué',
  },
  galerie: {
    sectionTag: 'Gallery', sectionTitle: 'Our Institutional Moments', sectionDesc: 'Relive the highlights of LIPS institutional life through our photo gallery.',
    photosCount: 'photos', totalPhotos: 'photos across 6 albums',
  },
  agendaComp: {
    sectionTag: 'Agenda', sectionTitle: 'Calendar & Events', sectionDesc: 'View the Gregorian and Hijri calendar, important Islamic dates, and LIPS events.',
    calendar: 'Calendar', list: 'List',
    filterAll: 'All',
    upcomingIslamic: 'Upcoming Islamic Events', upcomingLips: 'Upcoming LIPS Events',
    today: 'Today', inDays: 'In {n}d', days: '{n} days',
    legend: { islamicDate: 'Islamic Date', aid: 'Eid', islamicEvent: 'Islamic Event', lipsEvent: 'LIPS Event' },
    prevMonth: 'Previous Month', nextMonth: 'Next Month',
  },
  regionsPage: {
    sectionTag: 'National Presence', sectionTitle: 'Our 14 Regions', sectionDesc: 'LIPS is established in the 14 administrative regions of Senegal, ensuring complete institutional coverage.',
    interactiveMap: 'Interactive Map', exploreTitle: 'Explore the Regions of Senegal',
    exploreDesc: 'Hover or click on a region to discover its data. The map will guide you to the detailed card below.',
    inhabitants: 'inhab.', mosques: 'mosques',
    summaryRegions: 'Regions', summaryDepartments: 'Departments',
    summaryMosques: 'Mosques', summaryMembers: 'Members',
  },
  publications: {
    sectionTag: 'Resources', sectionTitle: 'Publications & Training', sectionDesc: 'Access official publications and training resources from LIPS.',
    categories: {
      communiques: { title: 'Communiqués', desc: 'Official positions and institutional statements' },
      fatwas: { title: 'Fatwas', desc: 'Islamic legal opinions on contemporary matters' },
      courses: { title: 'Courses & Training', desc: 'Training materials and educational programs' },
      articles: { title: 'Articles & Reflections', desc: 'Analyses and reflections on Islam in Senegal' },
    },
    explore: 'Explore',
  },
  espaceMembre: {
    loading: 'Loading your space...',
    greeting: 'As-salamu alaykum',
    matriculeLabel: 'Registration No.',
    myCard: 'My Card', cardDesc: 'Your official identification card', validLabel: 'Valid',
    profileTitle: 'Personal Information', profileDesc: 'Your profile data', editBtn: 'Edit',
    editProfile: 'Edit my profile', saveChanges: 'Save Changes',
    firstName: 'First Name', lastName: 'Last Name', email: 'Email',
    phone: 'Phone', region: 'Region', mosque: 'Mosque',
    nationalMatricule: 'National Registration No.',
    paymentsTitle: 'Contributions & Payments', paymentsDesc: 'Your payment history',
    totalContributions: 'Total contributions', payContribution: 'Pay my contribution',
    tableType: 'Type', tableAmount: 'Amount', tableDate: 'Date',
    tableMethod: 'Method', tableReference: 'Reference',
    quickLinks: 'Quick Links',
    verifyCard: 'Verify my card', qrVerification: 'QR Verification',
    lipsCalendar: 'LIPS Calendar', agendaEvents: 'Agenda & Events',
    holyQuran: 'The Holy Quran', readListen: 'Read & Listen',
    makeDonation: 'Make a donation', supportLips: 'Support LIPS',
    communicationsTitle: 'Latest Communications', communicationsDesc: 'Recent communiqués and fatwas from LIPS',
    seeAll: 'See all', noCommunications: 'No recent communications',
    cardFront: 'Show front', cardBack: 'Show back',
    orgLine1: 'LEAGUE OF IMAMS AND', orgLine2: 'PREACHERS OF SENEGAL',
    cardTitle: 'MEMBER CARD', nationalLabel: 'NATIONAL',
    photoLabel: 'PHOTO', nameLabel: 'Name', roleLabel: 'Role',
    regionLabel: 'Region', matriculeLabel2: 'Reg. No.',
    issuedLabel: 'Issued', expiresLabel: 'Expires',
    verifyText: 'Verify the validity of this card',
    institutionLabel: 'National Reference Institution',
    legalNotice: 'This card is the property of LIPS. Any falsification or unauthorized use is subject to prosecution.',
    statusActive: 'ACTIVE', statusExpired: 'EXPIRED', statusPending: 'PENDING',
    roleImam: 'Imam', rolePreacher: 'Preacher', roleRegionalHead: 'Regional Head', roleShura: 'Shura Member',
    commCommunique: 'Communiqué', commFatwa: 'Fatwa', commEvent: 'Event',
    currency: 'FCFA',
  },
};

// ─── Dictionary map ────────────────────────────────────────────
export const pageDictionaries: Record<Locale, PageTranslations> = {
  fr: frPages,
  ar: arPages,
  en: enPages,
};
