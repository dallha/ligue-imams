// LIPS - Générateur de Matricule National
// Format : LIPS-{SÉQUENCE 4 chiffres}
// Exemple : LIPS-0001, LIPS-0002, LIPS-0124

/**
 * Valide le format d'un matricule LIPS
 * @param matricule - Le matricule à valider (ex: LIPS-0001)
 * @returns true si le format est valide
 */
export function validateMatricule(matricule: string): boolean {
  const regex = /^LIPS-\d{4}$/;
  return regex.test(matricule);
}

/**
 * Génère un matricule LIPS au format national
 * @param sequentialNumber - Numéro séquentiel (ex: 1, 2, 124)
 * @returns Matricule formaté (ex: LIPS-0001, LIPS-0124)
 */
export function generateMatricule(sequentialNumber: number): string {
  const formattedSeq = String(sequentialNumber).padStart(4, '0');
  return `LIPS-${formattedSeq}`;
}

/**
 * Extrait les composants d'un matricule LIPS
 * @param matricule - Le matricule à parser
 * @returns Objet avec préfixe et numéro séquentiel
 */
export function parseMatricule(matricule: string): {
  prefix: string;
  sequential: number;
} | null {
  if (!validateMatricule(matricule)) return null;

  const parts = matricule.split('-');
  return {
    prefix: parts[0],
    sequential: parseInt(parts[1], 10),
  };
}

/**
 * Génère le prochain numéro séquentiel
 * En production, cette logique sera gérée par la base de données
 */
export function getNextSequential(): number {
  // TODO: Interroger la base pour le dernier numéro
  return 1;
}
