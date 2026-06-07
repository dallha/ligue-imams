# 🕌 LIPS - Ligue des Imams et Prédicateurs du Sénégal

**Système d'Information Institutionnel National (SIIN)**

Le SIIN est la plateforme numérique officielle de la LIPS, institution fondée en 2006 fédérant plus de 5 000 imams au Sénégal. Le projet numérise l'adhésion, la gestion des membres, les horaires de prière, les fatwas, et la communication régionale.

## 🌟 Architecture & Fonctionnalités (Frontend & Backend)

### 1. Architecture Technique
Le SIIN est construit sur une architecture monolithique moderne :
- **Frontend** : Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, Framer Motion.
- **Backend API** : Next.js API Routes (Endpoints REST).
- **Base de données** : Prisma ORM (SQLite en développement, PostgreSQL en production).
- **Internationalisation (i18n)** : Trilinguisme complet (Français, Arabe, Anglais) avec support RTL (Right-to-Left) natif.
- **Thème Intelligent** : Bascule Jour/Nuit automatique calée sur le fuseau horaire de Dakar (Africa/Dakar).

### 2. Sécurité et Authentification
- **Architecture Duale** : Séparation stricte entre l'espace Membres et l'espace Administration via des JWT (JSON Web Tokens) distincts stockés en cookies `HTTP-only`.
- **Protection Anti-Brute Force** : Verrouillage temporaire du compte (5 à 15 minutes) après 5 tentatives de connexion infructueuses (côté client).
- **Indicateur de force de mot de passe** en temps réel.
- **Middleware Next.js** pour la vérification à la volée des sessions et la redirection.

### 3. Pages Publiques
- **Accueil Dynamique** : Widgets de prières interactifs, statistiques animées, carte interactive des 14 régions du Sénégal.
- **Espace Coran** : Écoute en streaming via MP3Quran, index des 114 sourates (Makki/Madani), et verset rotatif quotidien.
- **Actualités & Agendas** : Communiqués officiels, fatwas, calendrier Hijri, et événements.
- **Transparence & Gouvernance** : Présentation du bureau national, des commissions, et des missions.

### 4. Espace Membre & Administration
- **Espace Membre** : Profil, carte de membre numérique avec QR Code, historique des paiements (cotisations/dons).
- **Tableau de Bord Admin** : CRUD complet pour les membres, gestion du CMS public (Textes, Galerie, FAQ, Publications), configuration système.

## 🚀 Déploiement (Production)

Ce projet est optimisé pour un déploiement "Standalone" sur **Vercel**, couplé à une base de données **Supabase** (PostgreSQL).

1. **Base de données** : 
   - Modifiez `provider = "sqlite"` en `provider = "postgresql"` dans `prisma/schema.prisma`.
   - Exécutez `npx prisma db push` avec vos variables Supabase pour générer les tables de production.
2. **Hébergement Vercel** : 
   - Ajoutez les variables d'environnement (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`).
   - Le build s'occupera automatiquement du rendu statique (SSG) et de l'optimisation.

## 📄 Licence
Ce projet est développé pour le compte exclusif de la Ligue des Imams et Prédicateurs du Sénégal (LIPS).
