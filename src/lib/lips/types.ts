// LIPS - Types & Constants partagés
// Système d'Information Institutionnel National (SIIN)

// --- Codes Régions du Sénégal ---
export const REGION_CODES = [
  'DKR',   // Dakar
  'SLG',   // Saint-Louis
  'LGN',   // Louga
  'FTK',   // Fatick
  'THS',   // Thiès
  'KDGN',  // Kédougou
  'KLC',   // Kolda
  'MTM',   // Matam
  'KDHL',  // Kaolack
  'TMB',   // Tambacounda
  'ZG',    // Ziguinchor
  'SED',   // Sédhiou
  'DRL',   // Diourbel
  'KFR',   // Kaffrine
] as const;

export type RegionCode = (typeof REGION_CODES)[number];

// --- Rôles Membres ---
export const USER_ROLES = [
  'IMAM',
  'PREDICATEUR',
  'RESPONSABLE_REGIONAL',
  'ADMIN',
  'PRESIDENT',
  'MEMBRE_CHOURA',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

// --- Statuts Membres ---
export const MEMBER_STATUSES = ['ACTIF', 'EXPIRE', 'EN_ATTENTE'] as const;
export type MemberStatus = (typeof MEMBER_STATUSES)[number];

// --- Types de Paiement ---
export const PAIEMENT_TYPES = ['COTISATION', 'DON', 'ADHESION'] as const;
export type PaiementType = (typeof PAIEMENT_TYPES)[number];

// --- Types de Contenu ---
export const CONTENT_TYPES = ['COMMUNIQUE', 'ARTICLE', 'FATWA', 'COURS', 'SEMINAIRE'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

// --- Données Régions (pour seed & affichage) ---
export interface RegionData {
  code: RegionCode;
  nom: string;
  nomAr: string;
  population?: number;
  mosqueCount?: number;
  coordinates?: { lat: number; lng: number };
}

export const REGIONS_DATA: RegionData[] = [
  { code: 'DKR', nom: 'Dakar', nomAr: 'دكار', population: 3_916_000, mosqueCount: 2450, coordinates: { lat: 14.7167, lng: -17.4677 } },
  { code: 'SLG', nom: 'Saint-Louis', nomAr: 'سان لويس', population: 1_074_000, mosqueCount: 890, coordinates: { lat: 16.0326, lng: -16.4818 } },
  { code: 'LGN', nom: 'Louga', nomAr: 'لوغا', population: 995_000, mosqueCount: 720, coordinates: { lat: 15.6167, lng: -16.3167 } },
  { code: 'FTK', nom: 'Fatick', nomAr: 'فاتيك', population: 835_000, mosqueCount: 640, coordinates: { lat: 14.1167, lng: -16.4167 } },
  { code: 'THS', nom: 'Thiès', nomAr: 'ثيس', population: 1_788_000, mosqueCount: 1280, coordinates: { lat: 14.7833, lng: -17.1 } },
  { code: 'KDGN', nom: 'Kédougou', nomAr: 'كيدوغو', population: 175_000, mosqueCount: 110, coordinates: { lat: 12.5667, lng: -12.2167 } },
  { code: 'KLC', nom: 'Kolda', nomAr: 'كولدا', population: 780_000, mosqueCount: 560, coordinates: { lat: 12.9, lng: -14.95 } },
  { code: 'MTM', nom: 'Matam', nomAr: 'ماتام', population: 675_000, mosqueCount: 480, coordinates: { lat: 13.25, lng: -13.25 } },
  { code: 'KDHL', nom: 'Kaolack', nomAr: 'كاولاك', population: 1_170_000, mosqueCount: 920, coordinates: { lat: 14.1333, lng: -16.0833 } },
  { code: 'TMB', nom: 'Tambacounda', nomAr: 'تامباكوندا', population: 830_000, mosqueCount: 590, coordinates: { lat: 13.7667, lng: -13.6667 } },
  { code: 'ZG', nom: 'Ziguinchor', nomAr: 'زيغينكور', population: 655_000, mosqueCount: 420, coordinates: { lat: 12.5833, lng: -16.2667 } },
  { code: 'SED', nom: 'Sédhiou', nomAr: 'سيدهيو', population: 520_000, mosqueCount: 350, coordinates: { lat: 12.7, lng: -15.55 } },
  { code: 'DRL', nom: 'Diourbel', nomAr: 'ديوربل', population: 1_980_000, mosqueCount: 1580, coordinates: { lat: 14.65, lng: -16.2333 } },
  { code: 'KFR', nom: 'Kaffrine', nomAr: 'كفرين', population: 690_000, mosqueCount: 510, coordinates: { lat: 14.1167, lng: -15.55 } },
];
