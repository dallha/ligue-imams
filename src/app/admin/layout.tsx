/**
 * Layout racine de l'administration.
 * Ce layout est minimal et ne contient PAS la sidebar ni le header.
 * Il sert uniquement de wrapper pour les sous-groupes de routes.
 * La page de login utilise ce layout directement (pas de sidebar visible).
 * Les pages protégées (dashboard) sont dans le groupe (dashboard) qui a son propre layout avec sidebar.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
