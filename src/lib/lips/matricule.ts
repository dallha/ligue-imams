// LIPS - Générateur de Matricule National
// Format : LIPS-{ANNÉE}-{RÉGION}-{SÉQUENCE}
// Exemple : LIPS-2025-DKR-000124

import { type RegionCode, REGION_CODES } from './types';

/**
 * Valide le format d'un matricule LIPS
 * @param matricule - Le matricule à valider (ex: LIPS-2025-DKR-000124)
 * @returns true si le format est valide
 */
export function validateMatricule(matricule: string): boolean {
  const regex = /^LIPS-\d{4}-[A-Z]{2,4}-\d{6}$/;
  if (!regex.test(matricule)) return false;

  const parts = matricule.split('-');
  const regionCode = parts[2] as RegionCode;
  return REGION_CODES.includes(regionCode);
}

/**
 * Génère un matricule LIPS au format national
 * @param regionCode - Code de la région (ex: DKR)
 * @param sequentialNumber - Numéro séquentiel (ex: 124)
 * @returns Matricule formaté (ex: LIPS-2025-DKR-000124)
 */
export function generateMatricule(
  regionCode: RegionCode,
  sequentialNumber: number
): string {
  const currentYear = new Date().getFullYear();
  const formattedSeq = String(sequentialNumber).padStart(6, '0');
  return `LIPS-${currentYear}-${regionCode}-${formattedSeq}`;
}

/**
 * Extrait les composants d'un matricule LIPS
 * @param matricule - Le matricule à parser
 * @returns Objet avec année, région et numéro séquentiel
 */
export function parseMatricule(matricule: string): {
  prefix: string;
  year: number;
  regionCode: RegionCode;
  sequential: number;
} | null {
  if (!validateMatricule(matricule)) return null;

  const parts = matricule.split('-');
  return {
    prefix: parts[0],
    year: parseInt(parts[1], 10),
    regionCode: parts[2] as RegionCode,
    sequential: parseInt(parts[3], 10),
  };
}

/**
 * Génère le prochain numéro séquentiel pour une région donnée
 * En production, cette logique sera gérée par la base de données
 */
export function getNextSequential(_regionCode: RegionCode): number {
  // TODO: Interroger la base pour le dernier numéro de la région
  return 1;
}
