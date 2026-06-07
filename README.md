# 🕌 LIPS - Ligue des Imams et Prédicateurs du Sénégal

**Système d'Information Institutionnel National (SIIN)**

Plateforme web officielle et système de gestion intégré de la Ligue des Imams et Prédicateurs du Sénégal (LIPS). Conçue pour centraliser l'administration, digitaliser l'adhésion des membres, et offrir une vitrine institutionnelle moderne.

## 🌟 Fonctionnalités Principales

### Vitrine Publique (Frontend)
- **Multilingue** : Interface bilingue Français / Arabe avec support RTL (Right-to-Left).
- **Design Moderne & Responsive** : Interface fluide, rapide, et optimisée pour tous les appareils (mobile, tablette, bureau).
- **Informations Dynamiques** : Actualités, galerie photos, chiffres clés de l'institut, régions et nombre de mosquées.
- **Espace Coranique** : Horaires de prière en temps réel, verset du jour, écoute de récitateurs et ressources islamiques.
- **Système de Dons** : Intégration prévue pour les paiements en ligne (CinetPay, Wave, etc.).

### Tableau de Bord Administrateur (CMS & SIIN)
- **Gestion des Membres** : Création, modification, attribution de matricules (LIPS-XXXX) et génération de cartes de membre numériques avec QR Code.
- **Gestion des Contenus (CMS)** : Publications (Communiqués, Fatwas, Événements), FAQ, Galerie d'images, Textes de l'interface et Chiffres clés entièrement modifiables.
- **Gestion Administrative** : Suivi des commissions, du bureau national, et des concours islamiques.
- **Rôles & Accès (RBAC)** : Permissions hiérarchisées (Super Admin, Admin Régional, Imam, Prédicateur).

## 🛠️ Stack Technique

- **Framework** : [Next.js 14/15](https://nextjs.org/) (App Router, Server Components)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) + Framer Motion (Animations)
- **Base de données** : [Prisma ORM](https://www.prisma.io/) (SQLite en dev, PostgreSQL/Supabase en production)
- **Authentification** : JWT (JSON Web Tokens) personnalisé avec gestion de sessions sécurisées.

## 🚀 Déploiement (Production)

Ce projet est optimisé pour un déploiement sur **Vercel** et **Supabase**.

1. **Base de données** : 
   - Créez un projet sur Supabase (PostgreSQL).
   - Changez le `provider` de `sqlite` à `postgresql` dans `prisma/schema.prisma`.
   - Exécutez `npx prisma db push` avec vos variables Supabase pour générer les tables.
2. **Hébergement** : 
   - Importez le dépôt GitHub sur Vercel.
   - Ajoutez les variables d'environnement nécessaires (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`).
   - Le build s'occupera automatiquement du reste !

## 📄 Licence
Ce projet est développé pour le compte exclusif de la Ligue des Imams et Prédicateurs du Sénégal (LIPS).
