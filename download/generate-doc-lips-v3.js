const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageOrientation, TableOfContents, LevelFormat,
} = require("docx");
const fs = require("fs");

// ─── Color Palette: FG-1 Forest Mint (Islamic / institutional green theme) ───
const P = {
  primary: "0C1F1A",
  body: "1A2E20",
  secondary: "507070",
  accent: "1B6B3A",
  surface: "EDF5F2",
  cover: {
    titleColor: "FFFFFF",
    subtitleColor: "B0C8B8",
    metaColor: "90B0A0",
    footerColor: "687078",
  },
  table: {
    headerBg: "1B6B3A",
    headerText: "FFFFFF",
    accentLine: "1B6B3A",
    innerLine: "C5D8D0",
    surface: "EDF5F2",
  },
};

const c = (hex) => hex.replace("#", "");

// ─── Helpers ───
function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: {
      before: level === HeadingLevel.HEADING_1 ? 360 : level === HeadingLevel.HEADING_2 ? 280 : 200,
      after: 120,
      line: 312,
    },
    children: [
      new TextRun({
        text,
        bold: true,
        color: c(P.primary),
        font: { ascii: "Calibri", eastAsia: "SimHei" },
        size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 28 : 24,
      }),
    ],
  });
}

function body(text, indent = true) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: indent ? { firstLine: 480 } : undefined,
    spacing: { line: 312, after: 60 },
    children: [
      new TextRun({
        text,
        size: 24,
        color: c(P.body),
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
      }),
    ],
  });
}

function bodyBold(text) {
  return new Paragraph({
    spacing: { line: 312, after: 60 },
    children: [
      new TextRun({
        text,
        size: 24,
        bold: true,
        color: c(P.primary),
        font: { ascii: "Calibri", eastAsia: "SimHei" },
      }),
    ],
  });
}

function spacer(h = 120) {
  return new Paragraph({ spacing: { before: h } });
}

// ─── Table builder ───
function makeTable(headers, rows, colWidths) {
  const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const borderH = { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine };
  const borderTop = { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine };
  const borderBot = { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine };

  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: { size: colWidths[i] || Math.round(100 / headers.length), type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: P.table.headerBg },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        borders: {
          top: borderTop,
          bottom: { style: BorderStyle.SINGLE, size: 1, color: P.table.headerBg },
          left: NB,
          right: NB,
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: h, bold: true, size: 21, color: P.table.headerText, font: { ascii: "Calibri", eastAsia: "SimHei" } }),
            ],
          }),
        ],
      })
    ),
  });

  const dataRows = rows.map((row, ri) =>
    new TableRow({
      cantSplit: true,
      children: row.map((cell, ci) =>
        new TableCell({
          width: { size: colWidths[ci] || Math.round(100 / row.length), type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: ri % 2 === 0 ? P.table.surface : "FFFFFF" },
          margins: { top: 50, bottom: 50, left: 120, right: 120 },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
            bottom: ri === rows.length - 1 ? borderBot : { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
            left: NB,
            right: NB,
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: cell, size: 21, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
              ],
            }),
          ],
        })
      ),
    })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

// ─── Cover Page (R1 Pure Paragraph Left — dark bg FG-1 Forest Mint) ───
function buildCover() {
  const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: allNoBorders,
      rows: [
        new TableRow({
          height: { value: 16838, rule: "exact" },
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: "0C1F1A" },
              borders: allNoBorders,
              verticalAlign: "top",
              children: [
                // Top accent line
                new Paragraph({
                  spacing: { before: 0 },
                  border: { top: { style: BorderStyle.SINGLE, size: 18, color: "1B6B3A", space: 0 } },
                  indent: { left: 0, right: 0 },
                  children: [],
                }),
                // Spacing before title
                new Paragraph({ spacing: { before: 3200 } }),
                // Arabic bismillah
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  indent: { left: 1200 },
                  spacing: { after: 200 },
                  children: [
                    new TextRun({
                      text: "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650",
                      size: 32,
                      color: "C9962A",
                      font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
                    }),
                  ],
                }),
                // Main title line 1
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  indent: { left: 1200, right: 1200 },
                  spacing: { line: 828, lineRule: "atLeast", after: 0 },
                  children: [
                    new TextRun({
                      text: "LIPS - SIIN",
                      bold: true,
                      size: 72,
                      color: P.cover.titleColor,
                      font: { ascii: "Calibri", eastAsia: "SimHei" },
                    }),
                  ],
                }),
                // Main title line 2
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  indent: { left: 1200, right: 1200 },
                  spacing: { line: 552, lineRule: "atLeast", after: 200 },
                  children: [
                    new TextRun({
                      text: "Documentation Technique",
                      bold: true,
                      size: 44,
                      color: P.cover.titleColor,
                      font: { ascii: "Calibri", eastAsia: "SimHei" },
                    }),
                  ],
                }),
                // Gold accent line
                new Paragraph({
                  indent: { left: 1200, right: 5200 },
                  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: "C9962A", space: 12 } },
                  children: [],
                }),
                // Subtitle
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  indent: { left: 1200, right: 1200 },
                  spacing: { before: 400, after: 100 },
                  children: [
                    new TextRun({
                      text: "Syst\u00e8me d'Information Institutionnel National",
                      size: 28,
                      color: P.cover.subtitleColor,
                      font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  indent: { left: 1200, right: 1200 },
                  spacing: { after: 100 },
                  children: [
                    new TextRun({
                      text: "Ligue des Imams et Pr\u00e9dicateurs du S\u00e9n\u00e9gal",
                      size: 28,
                      color: P.cover.subtitleColor,
                      font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
                    }),
                  ],
                }),
                // Spacer
                new Paragraph({ spacing: { before: 2800 } }),
                // Meta info
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  indent: { left: 1200 },
                  spacing: { after: 80 },
                  children: [
                    new TextRun({ text: "Version 3.0 \u2014 Juin 2026", size: 22, color: P.cover.metaColor, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  indent: { left: 1200 },
                  spacing: { after: 80 },
                  children: [
                    new TextRun({ text: "Stack : Next.js 16 \u2022 React 19 \u2022 Tailwind CSS 4 \u2022 Prisma \u2022 SQLite", size: 20, color: P.cover.metaColor, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  indent: { left: 1200 },
                  children: [
                    new TextRun({ text: "Confidentiel \u2014 Usage interne LIPS", size: 20, color: P.cover.footerColor, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];
}

// ═══════════════════════════════════════════════════════════════
// DOCUMENT CONTENT
// ═══════════════════════════════════════════════════════════════

const content = [];

// ─── 1. Pr\u00e9sentation du Projet ───
content.push(heading("1. Pr\u00e9sentation du Projet"));
content.push(heading("1.1 Contexte et Objectifs", HeadingLevel.HEADING_2));
content.push(body("Le SIIN (Syst\u00e8me d'Information Institutionnel National) est la plateforme num\u00e9rique officielle de la LIPS (Ligue des Imams et Pr\u00e9dicateurs du S\u00e9n\u00e9gal). Fond\u00e9e en 2006 et pr\u00e9sente dans les 14 r\u00e9gions administratives du S\u00e9n\u00e9gal, la LIPS f\u00e9d\u00e8re plus de 5 000 imams et pr\u00e9dicateurs \u00e0 travers le pays. Le SIIN constitue l'\u00e9pine dorsale num\u00e9rique de cette institution, offrant un cadre technologique moderne pour la gestion des membres, la diffusion de contenus religieux, la coordination r\u00e9gionale et la communication institutionnelle."));
content.push(body("L'objectif principal du SIIN est de num\u00e9riser l'ensemble des processus m\u00e9tiers de la LIPS : adh\u00e9sion des membres, \u00e9mission et v\u00e9rification des cartes membres, gestion des horaires de pri\u00e8re, diffusion de communiqu\u00e9s et fatwas, organisation d'\u00e9v\u00e9nements, et collecte de dons. La plateforme vise \u00e9galement \u00e0 renforcer la transparence institutionnelle et \u00e0 faciliter la communication entre le bureau national, les repr\u00e9sentants r\u00e9gionaux et les membres de base."));
content.push(body("Le projet s'inscrit dans une d\u00e9marche d'institutionnalisation de l'imamat au S\u00e9n\u00e9gal, en mettant \u00e0 disposition des outils num\u00e9riques qui respectent les valeurs islamiques tout en exploitant les technologies les plus avanc\u00e9es. La devise de la LIPS, \u00ab Par la patience et la certitude, on atteint l'imamat dans la religion \u00bb, guide chaque d\u00e9cision de conception et de d\u00e9veloppement."));

content.push(heading("1.2 Architecture G\u00e9n\u00e9rale", HeadingLevel.HEADING_2));
content.push(body("Le SIIN est construit sur une architecture monolithique moderne utilisant Next.js 16 (App Router) comme framework fullstack. Le frontend et le backend partagent le m\u00eame d\u00e9p\u00f4t, les API Routes de Next.js servant de couche backend. La base de donn\u00e9es SQLite g\u00e9r\u00e9e par Prisma ORM assure la persistance des donn\u00e9es. Cette architecture a \u00e9t\u00e9 choisie pour sa simplicit\u00e9 de d\u00e9ploiement, sa performance et sa capacit\u00e9 \u00e0 r\u00e9pondre aux besoins d'une institution de taille moyenne."));
content.push(spacer(100));
content.push(makeTable(
  ["Couche", "Technologie", "R\u00f4le"],
  [
    ["Frontend", "Next.js 16 + React 19 + Tailwind CSS 4", "Interface utilisateur, rendu SSR/SSG, routing"],
    ["UI Components", "shadcn/ui (Radix) + Framer Motion", "Composants accessibles et animations"],
    ["Backend API", "Next.js API Routes + Middleware", "Endpoints REST, authentification JWT, protection des routes"],
    ["Base de donn\u00e9es", "SQLite + Prisma ORM", "Persistance, migrations, requ\u00eatage typ\u00e9"],
    ["Authentification", "JWT (jose) + bcryptjs", "Tokens s\u00e9curis\u00e9s, hashage mots de passe"],
    ["i18n", "Context API custom + 500+ cl\u00e9s FR/AR/EN", "Trilinguisme complet avec support RTL"],
    ["Th\u00e8me", "next-themes + auto jour/nuit", "Mode clair/sombre automatique (timezone Dakar)"],
    ["D\u00e9ploiement", "Standalone output + Caddy", "Docker-ready, reverse proxy HTTPS"],
  ],
  [15, 40, 45]
));

content.push(heading("1.3 Publics Cibles", HeadingLevel.HEADING_2));
content.push(body("La plateforme SIIN s'adresse \u00e0 trois publics distincts, chacun disposant d'un espace d\u00e9di\u00e9 avec des fonctionnalit\u00e9s sp\u00e9cifiques et des niveaux d'acc\u00e8s diff\u00e9renci\u00e9s. Le site public est accessible \u00e0 tous les visiteurs et pr\u00e9sente l'institution, ses services, ses publications et ses horaires de pri\u00e8re. L'espace membre est r\u00e9serv\u00e9 aux imams et pr\u00e9dicateurs adh\u00e9rents disposant d'un matricule valide. L'espace administrateur est strictement limit\u00e9 au personnel autoris\u00e9 du bureau national et des commissions."));
content.push(spacer(100));
content.push(makeTable(
  ["Public", "Route", "Authentification", "Fonctionnalit\u00e9s cl\u00e9s"],
  [
    ["Visiteurs", "/", "Aucune", "Accueil, pri\u00e8res, Coran, actualit\u00e9s, adh\u00e9sion, dons"],
    ["Membres", "/espace-membre", "JWT membre (24h)", "Profil, carte membre, paiements, dashboard"],
    ["Administrateurs", "/admin", "JWT admin (24h)", "CRUD membres, contenus, FAQ, r\u00e9gions, param\u00e8tres"],
  ],
  [18, 22, 25, 35]
));

// ─── 2. Stack Technique ───
content.push(heading("2. Stack Technique D\u00e9taill\u00e9e"));
content.push(heading("2.1 Frontend", HeadingLevel.HEADING_2));
content.push(body("Le frontend est construit avec Next.js 16 exploitant l'App Router avec des Server Components par d\u00e9faut. React 19 fournit les derni\u00e8res optimisations de rendu. Tailwind CSS 4 g\u00e8re le syst\u00e8me de design avec un bloc @theme custom d\u00e9finissant les couleurs institutionnelles LIPS (lips-green #1B6B3A, lips-gold #C9962A, lips-emerald #0D7D5E). Les composants shadcn/ui offrent une biblioth\u00e8que accessible bas\u00e9e sur Radix UI, tandis que Framer Motion anime les transitions et interactions utilisateur avec des animations fluides et performantes."));
content.push(body("Le syst\u00e8me de th\u00e8me int\u00e8gre trois modes de fonctionnement : le mode clair (light), le mode sombre (dark) et le mode automatique (auto). Le mode auto utilise le fuseau horaire de Dakar (Africa/Dakar, UTC+0) pour basculer automatiquement entre le mode jour (06h-19h) et le mode nuit (19h-06h). Un script inline dans le <head> du document HTML \u00e9vite le flash de contenu non styl\u00e9 (FOUC) en appliquant la classe dark avant l'hydratation React. Le composant ThemeToggle permet de cycliquement passer d'un mode \u00e0 l'autre (Clair \u2192 Sombre \u2192 Auto \u2192 Clair) ou d'acc\u00e9der \u00e0 un menu d\u00e9roulant avec les quatre options incluant le mode syst\u00e8me."));

content.push(heading("2.2 Backend et API", HeadingLevel.HEADING_2));
content.push(body("Les API Routes de Next.js servent de couche backend compl\u00e8te. Chaque endpoint est une Route Handler TypeScript situ\u00e9e dans le r\u00e9pertoire src/app/api/. Le middleware Next.js (src/middleware.ts) intercepte toutes les requ\u00eates vers /admin/* et /espace-membre/* pour v\u00e9rifier la pr\u00e9sence et la validit\u00e9 des JWT d'authentification. Les tokens sont stock\u00e9s dans des cookies HTTP-only (lips-admin-session et lips-member-session) avec v\u00e9rification via la biblioth\u00e8que jose. En cas de token invalide ou expir\u00e9, l'utilisateur est redirig\u00e9 vers la page de connexion correspondante avec un param\u00e8tre de redirection."));
content.push(spacer(100));
content.push(makeTable(
  ["Endpoint", "M\u00e9thode", "Auth", "Description"],
  [
    ["/api/admin/login", "POST", "Aucune", "Authentification administrateur"],
    ["/api/admin/me", "GET", "Admin JWT", "Profil admin connect\u00e9"],
    ["/api/admin/membres", "GET/POST", "Admin JWT", "Liste et cr\u00e9ation de membres"],
    ["/api/admin/membres/[id]", "GET/PUT/DELETE", "Admin JWT", "CRUD membre individuel"],
    ["/api/admin/contenus", "GET/POST", "Admin JWT", "Gestion des contenus (articles, fatwas, \u00e9v\u00e9nements)"],
    ["/api/admin/regions", "GET/POST", "Admin JWT", "Gestion des r\u00e9gions"],
    ["/api/admin/faq", "GET/POST", "Admin JWT", "Gestion FAQ"],
    ["/api/admin/bureau", "GET/POST", "Admin JWT", "Gestion membres du bureau"],
    ["/api/admin/commissions", "GET/POST", "Admin JWT", "Gestion commissions"],
    ["/api/admin/concours", "GET/POST", "Admin JWT", "Gestion concours coraniques"],
    ["/api/admin/parametres", "GET/PUT", "Admin JWT", "Configuration du site"],
    ["/api/admin/prieres", "GET/PUT", "Admin JWT", "Configuration pri\u00e8res"],
    ["/api/membre/login", "POST", "Aucune", "Authentification membre"],
    ["/api/membre/me", "GET", "Member JWT", "Profil membre connect\u00e9"],
    ["/api/prayer-times", "GET", "Aucune", "Horaires de pri\u00e8re (API externe)"],
    ["/api/coran/reciters", "GET", "Aucune", "Liste des r\u00e9citateurs (MP3Quran)"],
    ["/api/coran/suwar", "GET", "Aucune", "Index des 114 sourates"],
    ["/api/verifier-carte", "POST", "Aucune", "V\u00e9rification carte membre par matricule"],
  ],
  [25, 10, 15, 50]
));

content.push(heading("2.3 Base de Donn\u00e9es", HeadingLevel.HEADING_2));
content.push(body("La base de donn\u00e9es SQLite est g\u00e9r\u00e9e par Prisma ORM qui fournit un sch\u00e9ma typ\u00e9, des migrations automatiques et un client g\u00e9n\u00e9r\u00e9. Le sch\u00e9ma Prisma d\u00e9finit 9 mod\u00e8les couvrant les domaines m\u00e9tiers de la LIPS. Le fichier de base de donn\u00e9es est situ\u00e9 dans db/custom.db avec l'URL de connexion configur\u00e9e via la variable d'environnement DATABASE_URL. Prisma permet de changer facilement de SGBD (PostgreSQL, MySQL) si les besoins \u00e9voluent sans modification du code applicatif."));
content.push(spacer(100));
content.push(makeTable(
  ["Mod\u00e8le", "Domaine", "Description"],
  [
    ["User", "Membres", "Imams, pr\u00e9dicateurs, admin avec matricule unique, r\u00f4le, statut, r\u00e9gion"],
    ["Region", "Gouvernance", "14 r\u00e9gions avec code, nom (FR/AR), coordonn\u00e9es GPS, stats"],
    ["Mosque", "Gouvernance", "Mosqu\u00e9es affili\u00e9es avec adresse et lien r\u00e9gion"],
    ["CarteMembre", "Carte Membre", "Carte avec QR code, dates \u00e9mission/expiration, lien utilisateur"],
    ["Paiement", "Financier", "Cotisations, dons, adh\u00e9sions avec r\u00e9f\u00e9rence et m\u00e9thode"],
    ["Content", "Communication", "Communiqu\u00e9s, fatwas, articles, \u00e9v\u00e9nements avec version bilingue"],
    ["FAQ", "Communication", "Questions fr\u00e9quentes avec ordre d'affichage"],
    ["BureauMember", "Institutionnel", "Membres du bureau national avec r\u00f4le et bio"],
    ["Commission", "Institutionnel", "Commissions th\u00e9matiques avec nom bilingue et ic\u00f4ne"],
    ["Concours", "Formation", "Concours coraniques avec dates, lieu, statut"],
    ["SiteConfig", "Configuration", "Param\u00e8tres cl\u00e9-valeur du site"],
  ],
  [20, 18, 62]
));

content.push(heading("2.4 Syst\u00e8me d'Internationalisation (i18n)", HeadingLevel.HEADING_2));
content.push(body("Le SIIN impl\u00e9mente un syst\u00e8me trilingue complet (Fran\u00e7ais, Arabe, Anglais) bas\u00e9 sur React Context API. Le fichier translations.ts contient plus de 500 cl\u00e9s de traduction couvrant l'ensemble de l'interface : navigation, hero, horaires de pri\u00e8re, services, statistiques, actualit\u00e9s, r\u00e9gions, Coran, newsletter, footer, et pages sp\u00e9cifiques (connexion membre, connexion admin, v\u00e9rification carte). Le LanguageProvider encapsule l'application et expose les fonctions t() et p() pour acc\u00e9der aux traductions, ainsi que les \u00e9tats locale et setLocale pour g\u00e9rer la langue courante."));
content.push(body("Le support RTL (Right-to-Left) pour l'arabe est g\u00e9r\u00e9 via l'attribut dir='rtl' sur l'\u00e9l\u00e9ment HTML root, avec des r\u00e8gles CSS sp\u00e9cifiques dans globals.css pour inverser les marges, les flexbox et les propri\u00e9t\u00e9s directionnelles. La police Noto Naskh Arabic est utilis\u00e9e pour le rendu des textes arabes avec une hauteur de ligne de 1.8 pour une lisibilit\u00e9 optimale. Le s\u00e9lecteur de langue (LanguageSwitcher) affiche le drapeau, le nom complet de la langue et un indicateur visuel de la langue active."));

// ─── 3. S\u00e9curit\u00e9 ───
content.push(heading("3. S\u00e9curit\u00e9 et Authentification"));
content.push(heading("3.1 Architecture d'Authentification", HeadingLevel.HEADING_2));
content.push(body("Le SIIN utilise un syst\u00e8me d'authentification dual avec des tokens JWT (JSON Web Tokens) s\u00e9par\u00e9s pour les administrateurs et les membres. Chaque type d'utilisateur dispose de son propre cookie de session (lips-admin-session et lips-member-session), de sa propre cl\u00e9 secr\u00e8te JWT et de ses propres endpoints d'authentification. Cette s\u00e9paration stricte garantit qu'un membre ne peut jamais acc\u00e9der aux routes administrateur et vice versa, m\u00eame en cas de compromission d'un token."));
content.push(body("Les mots de passe sont hash\u00e9s avec bcryptjs (salt rounds par d\u00e9faut) avant stockage en base de donn\u00e9es. La v\u00e9rification se fait par comparaison du hash, sans jamais transmettre le mot de passe en clair. Les tokens JWT sont sign\u00e9s avec la biblioth\u00e8que jose et ont une dur\u00e9e de validit\u00e9 de 24 heures. Le middleware Next.js intercepte chaque requ\u00eate vers les zones prot\u00e9g\u00e9es, v\u00e9rifie la signature et l'expiration du token, et redirige vers la page de connexion en cas d'\u00e9chec."));

content.push(heading("3.2 Protection Anti-Brute Force", HeadingLevel.HEADING_2));
content.push(body("Les pages de connexion impl\u00e9mentent une protection anti-brute force c\u00f4t\u00e9 client avec verrouillage temporaire du compte apr\u00e8s tentatives infructueuses. Pour les membres, le seuil est de 5 tentatives avant verrouillage de 5 minutes. Pour les administrateurs, le seuil est \u00e9galement de 5 tentatives mais le verrouillage dure 15 minutes, refl\u00e9tant le niveau de sensibilit\u00e9 sup\u00e9rieur de l'acc\u00e8s admin. Les informations de verrouillage sont stock\u00e9es dans le localStorage du navigateur avec des cl\u00e9s s\u00e9par\u00e9es (lips-member-lockout et lips-admin-lockout)."));
content.push(body("Un compteur de tentatives restantes s'affiche en temps r\u00e9el sous le formulaire de connexion, et un message d'avertissement explicite appara\u00eet lorsque le compte est verrouill\u00e9, indiquant la dur\u00e9e restante avant d\u00e9verrouillage automatique. Un minuteur actualise cette information toutes les 5 secondes. Lorsque le verrouillage expire, les compteurs sont automatiquement r\u00e9initialis\u00e9s et l'utilisateur peut de nouveau tenter de se connecter."));

content.push(heading("3.3 Indicateur de Force du Mot de Passe", HeadingLevel.HEADING_2));
content.push(body("Les deux pages de connexion (membre et administrateur) int\u00e8grent un indicateur visuel de force du mot de passe qui s'affiche en temps r\u00e9el lorsque l'utilisateur saisit son mot de passe. L'indicateur \u00e9value cinq crit\u00e8res : longueur minimale de 6 caract\u00e8res, longueur de 8 caract\u00e8res ou plus, pr\u00e9sence de majuscules, pr\u00e9sence de chiffres, et pr\u00e9sence de caract\u00e8res sp\u00e9ciaux. Quatre barres color\u00e9es affichent le r\u00e9sultat : Faible (rouge), Moyen (ambre), Bon (vert LIPS), Fort (vert \u00e9meraude). Cette fonctionnalit\u00e9 encourage les utilisateurs \u00e0 choisir des mots de passe robustes."));

content.push(heading("3.4 Badges de S\u00e9curit\u00e9 Visuels", HeadingLevel.HEADING_2));
content.push(body("Les formulaires de connexion affichent des badges de s\u00e9curit\u00e9 en bas du formulaire pour rassurer l'utilisateur sur le niveau de protection de ses donn\u00e9es. C\u00f4t\u00e9 membre, trois badges sont visibles : \u00ab Chiffrement SSL \u00bb, \u00ab Auth JWT \u00bb et \u00ab Session 24h \u00bb. C\u00f4t\u00e9 administrateur, les badges sont adapt\u00e9s au contexte : \u00ab SSL/TLS \u00bb, \u00ab JWT Secure \u00bb et \u00ab Anti-intrusion \u00bb. Ces indicateurs sont accompagn\u00e9s d'ic\u00f4nes Lucide (Shield, Fingerprint, BadgeCheck) pour une identification visuelle rapide. La page admin affiche \u00e9galement un avertissement d'acc\u00e8s restreint en pied de formulaire."));

// ─── 4. Navigation et UX ───
content.push(heading("4. Navigation et Exp\u00e9rience Utilisateur"));
content.push(heading("4.1 Header et Navigation Responsive", HeadingLevel.HEADING_2));
content.push(body("Le header du site public est un composant sticky qui s'adapte automatiquement \u00e0 la taille de l'\u00e9cran. Sur les \u00e9crans XL (1280px et plus), la navigation horizontale affiche les 9 items du menu avec des dropdowns anim\u00e9s (Framer Motion) pour les sous-menus \u00ab \u00c0 Propos \u00bb et \u00ab Actualit\u00e9s \u00bb. Sur les \u00e9crans plus petits (tablette et mobile), un bouton hamburger ouvre un panneau lat\u00e9ral glissant depuis la droite (slide-in panel) avec un fond semi-transparent et un effet de blur."));
content.push(body("Le panneau mobile inclut un en-t\u00eate avec le logo et un bouton de fermeture, les items de navigation avec des sous-menus d\u00e9pliables en accord\u00e9on, et une section fixe en bas contenant le s\u00e9lecteur de th\u00e8me, le s\u00e9lecteur de langue et le bouton d'acc\u00e8s \u00e0 l'espace membre. Le scroll du body est d\u00e9sactiv\u00e9 lorsque le menu est ouvert pour \u00e9viter les conflits de navigation. Le menu se ferme automatiquement lors d'un changement de route ou d'un redimensionnement de la fen\u00eatre au-dessus de 1280px."));

content.push(heading("4.2 Th\u00e8me Jour/Nuit Automatique", HeadingLevel.HEADING_2));
content.push(body("Le syst\u00e8me de th\u00e8me propose quatre modes : Clair (light), Sombre (dark), Auto et Syst\u00e8me (system). Le mode Auto est le mode par d\u00e9faut et bascule automatiquement entre le th\u00e8me clair et sombre en fonction de l'heure de Dakar : le mode jour est actif de 06h00 \u00e0 19h00, et le mode nuit de 19h00 \u00e0 06h00. Cette logique utilise le fuseau horaire Africa/Dakar (UTC+0) pour s'adapter au contexte s\u00e9n\u00e9galais. Un scheduler c\u00f4t\u00e9 client calcule le d\u00e9lai jusqu'\u00e0 la prochaine transition et planifie la bascule automatique via setTimeout."));
content.push(body("Pour \u00e9viter le flash de contenu (FOUC) au chargement initial, un script inline dans la balise <head> du document ex\u00e9cute la logique de d\u00e9tection du th\u00e8me avant l'hydratation React. Ce script lit le mode sauvegard\u00e9 dans localStorage, et si le mode est auto ou non d\u00e9fini, calcule l'heure de Dakar pour d\u00e9terminer s'il faut appliquer la classe dark \u00e0 l'\u00e9l\u00e9ment <html>. Le composant ThemeToggle affiche une ic\u00f4ne anim\u00e9e (Soleil, Lune ou Lever de soleil) et permet de cycler entre les modes par clic simple, ou d'acc\u00e9der au menu d\u00e9taill\u00e9 par clic droit."));

content.push(heading("4.3 Pr\u00e9chargeur (Preloader)", HeadingLevel.HEADING_2));
content.push(body("Un \u00e9cran de pr\u00e9chargeur anim\u00e9 s'affiche pendant 1,8 seconde au chargement initial du site, cr\u00e9ant une transition visuelle \u00e9l\u00e9gante entre le chargement et le contenu. Le preloader affiche le logo LIPS avec une animation de pulse, une bismillah en arabe (\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u0631\u062D\u064A\u0645), et un ornement g\u00e9om\u00e9trique islamique en rotation. Le tout dispara\u00eet avec un fondu progressif pour r\u00e9v\u00e9ler la page principale."));

// ─── 5. Pages Publiques ───
content.push(heading("5. Pages Publiques"));
content.push(heading("5.1 Page d'Accueil", HeadingLevel.HEADING_2));
content.push(body("La page d'accueil est structur\u00e9e en sections empil\u00e9es verticalement, chacune apportant une information cl\u00e9 sur la LIPS. L'ordre des sections est le suivant : Preloader (transition), Header (navigation sticky), PrayerTimesWidget (barre d'horaires de pri\u00e8re), HeroSection (banni\u00e8re principale avec CTA), HomeServices (6 cartes de services), HomeAboutNarrative (r\u00e9cit institutionnel avec image), StatsSection (chiffres cl\u00e9s anim\u00e9s), HomeAbout (pr\u00e9sentation d\u00e9taill\u00e9e), HomeActualites (derni\u00e8res publications), HomeRegions (carte des 14 r\u00e9gions), HomeCTA (blocs d'appels \u00e0 l'action), NewsletterSection (inscription newsletter), et LipsFooter (pied de page complet)."));
content.push(body("Chaque section utilise des animations au scroll (reveal-on-scroll) pour r\u00e9v\u00e9ler progressivement le contenu, des motifs g\u00e9om\u00e9triques islamiques en arri\u00e8re-plan, et la palette de couleurs institutionnelle (vert LIPS, or, cr\u00e8me, \u00e9meraude). Le design responsive garantit un affichage optimal sur mobile, tablette et desktop. Le hero section pr\u00e9sente la devise en arabe avec sa traduction, le nom complet de l'institution, un sous-titre descriptif, et deux boutons d'action : \u00ab Adh\u00e9rer \u00e0 la LIPS \u00bb et \u00ab D\u00e9couvrir la LIPS \u00bb."));

content.push(heading("5.2 Page Coran", HeadingLevel.HEADING_2));
content.push(body("La page Coran est une exp\u00e9rience compl\u00e8te de lecture et d'\u00e9coute du Saint Coran. Elle int\u00e8gre un verset du jour (7 versets rotatifs, un par jour de la semaine), un lecteur audio streaming via l'API MP3Quran.net avec s\u00e9lection de r\u00e9citateurs populaires, un index interactif des 114 sourates avec recherche par nom ou num\u00e9ro, et une section de ressources coraniques (lecture en ligne, MP3Quran, Coran en wolof, tafsir fran\u00e7ais, guide de m\u00e9morisation). Les sourates sont class\u00e9es Makki/Madani avec indicateurs visuels distincts."));

content.push(heading("5.3 Autres Pages Publiques", HeadingLevel.HEADING_2));
content.push(spacer(100));
content.push(makeTable(
  ["Page", "Route", "Description"],
  [
    ["\u00c0 Propos", "/a-propos", "Mission, gouvernance, carte membre, FAQ avec ancres"],
    ["Actualit\u00e9s", "/actualites", "Communiqu\u00e9s, fatwas, \u00e9v\u00e9nements, galerie photos"],
    ["Agenda", "/agenda", "Calendrier Hijri, \u00e9v\u00e9nements religieux, programmes LIPS"],
    ["R\u00e9gions", "/regions", "Carte interactive des 14 r\u00e9gions avec statistiques"],
    ["Adh\u00e9rer", "/adherer", "Formulaire d'adh\u00e9sion avec g\u00e9n\u00e9ration de matricule"],
    ["V\u00e9rifier Carte", "/verifier-carte", "V\u00e9rification instantan\u00e9e par matricule avec QR code"],
    ["Faire un Don", "/faire-un-don", "Page de don avec int\u00e9gration CinetPay/Wave"],
  ],
  [18, 22, 60]
));

// ─── 6. Espaces Priv\u00e9s ───
content.push(heading("6. Espaces Priv\u00e9s"));
content.push(heading("6.1 Espace Membre", HeadingLevel.HEADING_2));
content.push(body("L'espace membre (/espace-membre) est accessible apr\u00e8s authentification via la page de connexion (/espace-membre/login). Le layout de l'espace membre utilise un header simplifi\u00e9 avec le logo, les informations de l'utilisateur connect\u00e9 et un bouton de d\u00e9connexion. Sur mobile, une Sheet (tiroir lat\u00e9ral droit) remplace la navigation lat\u00e9rale. Le dashboard membre affiche la carte de membre avec QR code, les informations personnelles, l'historique des paiements et les prochaines \u00e9ch\u00e9ances. La page de connexion membre utilise un design glassmorphism avec arri\u00e8re-plan vert fonc\u00e9 et motif islamique, un formulaire avec ic\u00f4nes, indicateurs de force du mot de passe et protection anti-brute force."));

content.push(heading("6.2 Espace Administrateur", HeadingLevel.HEADING_2));
content.push(body("L'espace administrateur (/admin) offre une interface compl\u00e8te de gestion du SIIN. Le layout admin comprend une sidebar gauche (desktop) ou un tiroir lat\u00e9ral gauche (mobile via Sheet) avec les liens de navigation vers les diff\u00e9rentes sections : Dashboard, Membres, Contenus, Agenda, Pri\u00e8res, FAQ, Coran, R\u00e9gions, Bureau, Commissions, Concours et Param\u00e8tres. La page de connexion admin utilise un design plus sombre et plus sobre que la page membre, avec un bandeau de s\u00e9curit\u00e9 or-vert, un avertissement d'acc\u00e8s restreint et des badges de s\u00e9curit\u00e9 renforc\u00e9s (SSL/TLS, JWT Secure, Anti-intrusion). Le bouton de connexion admin est de couleur or (lips-gold) pour le distinguer visuellement du bouton membre."));

// ─── 7. Composants R\u00e9utilisables ───
content.push(heading("7. Composants R\u00e9utilisables"));
content.push(body("Le projet utilise une architecture de composants modulaires s\u00e9par\u00e9e en deux r\u00e9pertoires : src/components/ui/ pour les composants primitifs shadcn/ui (54 composants couvrant boutons, inputs, dialogues, tables, formulaires, etc.) et src/components/lips/ pour les composants m\u00e9tier sp\u00e9cifiques \u00e0 la LIPS (22 composants). Chaque composant LIPS est internationalis\u00e9 et adapt\u00e9 au mode sombre."));
content.push(spacer(100));
content.push(makeTable(
  ["Composant", "Fichier", "Fonction"],
  [
    ["LipsHeader", "header.tsx", "Navigation sticky responsive avec dropdowns et panneau mobile"],
    ["LipsFooter", "footer.tsx", "Pied de page avec liens, contact, copyright"],
    ["HeroSection", "hero.tsx", "Banni\u00e8re principale avec CTA et stats"],
    ["HomeServices", "home-services.tsx", "6 cartes de services avec ic\u00f4nes et gradients"],
    ["PrayerTimesWidget", "prayer-times.tsx", "Barre horaires pri\u00e8re avec s\u00e9lecteur r\u00e9gion"],
    ["ThemeToggle", "theme-toggle.tsx", "Bascule jour/nuit/auto avec ic\u00f4nes anim\u00e9es"],
    ["LanguageSwitcher", "language-switcher.tsx", "S\u00e9lecteur trilingue FR/AR/EN avec drapeaux"],
    ["Preloader", "preloader.tsx", "\u00c9cran de chargement anim\u00e9 avec bismillah"],
    ["CarteMembre", "carte-membre.tsx", "Carte membre avec QR code et informations"],
    ["SenegalMap", "senegal-map.tsx", "Carte interactive du S\u00e9n\u00e9gal"],
    ["CoranPlayer", "coran.tsx", "Lecteur Coran avec r\u00e9citateurs et sourates"],
  ],
  [20, 22, 58]
));

// ─── 8. Design System ───
content.push(heading("8. Design System et Identit\u00e9 Visuelle"));
content.push(heading("8.1 Palette de Couleurs", HeadingLevel.HEADING_2));
content.push(spacer(100));
content.push(makeTable(
  ["Nom", "Hex", "Usage"],
  [
    ["lips-green", "#1B6B3A", "Couleur primaire, boutons, liens actifs, accents"],
    ["lips-green-light", "#2E8B57", "Hover states, backgrounds l\u00e9gers"],
    ["lips-green-dark", "#0D3B1F", "Texte fonc\u00e9, headers, backgrounds sombres"],
    ["lips-gold", "#C9962A", "Accents dor\u00e9s, s\u00e9parateurs, badge admin"],
    ["lips-gold-light", "#E5BE5A", "Hover dor\u00e9, highlights"],
    ["lips-cream", "#FBF8F0", "Backgrounds clairs (mode jour)"],
    ["lips-emerald", "#0D7D5E", "Gradients, accents secondaires"],
  ],
  [22, 18, 60]
));
content.push(body("En mode sombre, les couleurs sont automatiquement ajust\u00e9es pour maintenir le contraste et la lisibilit\u00e9. Le vert LIPS passe de #1B6B3A \u00e0 #2E8B57, l'or de #C9962A \u00e0 #E5BE5A, et le cr\u00e8me devient un vert tr\u00e8s fonc\u00e9 (#1A2E20). Les variables CSS sont red\u00e9finies dans le bloc .dark de globals.css en utilisant le mode oklch pour une transition fluide entre les modes. Toutes les transitions entre modes sont anim\u00e9es avec une dur\u00e9e de 0.15s ease-in-out."));

content.push(heading("8.2 Typographie et Motifs", HeadingLevel.HEADING_2));
content.push(body("Le projet utilise les polices Geist Sans et Geist Mono comme polices par d\u00e9faut via next/font/google. Pour les textes arabes, la classe .font-arabic applique Noto Naskh Arabic avec direction RTL et une hauteur de ligne de 1.8 pour une lisibilit\u00e9 optimale. Les motifs g\u00e9om\u00e9triques islamiques sont g\u00e9n\u00e9r\u00e9s en CSS pur via la classe .islamic-pattern qui utilise un SVG en data URI pour cr\u00e9er un motif de losanges r\u00e9p\u00e9t\u00e9 avec une opacit\u00e9 subtile (5% en mode clair, 8% en mode sombre). Le s\u00e9parateur islamique (.separator-islamic) cr\u00e9e des lignes dor\u00e9es d\u00e9grad\u00e9es de part et d'autre d'un \u00e9l\u00e9ment central."));

// ─── 9. D\u00e9ploiement ───
content.push(heading("9. D\u00e9ploiement et Infrastructure"));
content.push(heading("9.1 Configuration de Build", HeadingLevel.HEADING_2));
content.push(body("Le projet utilise le mode standalone de Next.js (output: 'standalone') pour un d\u00e9ploiement Docker-compatible optimis\u00e9. Le script de build copie les fichiers statiques et le r\u00e9pertoire public dans le dossier standalone g\u00e9n\u00e9r\u00e9. Le serveur de production est lanc\u00e9 via Node.js ou Bun en ex\u00e9cutant le fichier server.js g\u00e9n\u00e9r\u00e9 par Next.js. Le Caddyfile \u00e0 la racine du projet configure le reverse proxy HTTPS avec certificats automatiques (Let's Encrypt)."));
content.push(spacer(100));
content.push(makeTable(
  ["Commande", "Description"],
  [
    ["pnpm dev", "Serveur de d\u00e9veloppement sur port 3000 avec Turbopack"],
    ["pnpm build", "Build de production standalone + copie assets"],
    ["pnpm start", "Lancement du serveur de production"],
    ["pnpm db:push", "Synchronisation du sch\u00e9ma Prisma avec la base"],
    ["pnpm db:generate", "G\u00e9n\u00e9ration du client Prisma"],
    ["pnpm db:migrate", "Cr\u00e9ation d'une migration"],
    ["pnpm db:reset", "R\u00e9initialisation compl\u00e8te de la base"],
  ],
  [30, 70]
));

content.push(heading("9.2 Variables d'Environnement", HeadingLevel.HEADING_2));
content.push(spacer(100));
content.push(makeTable(
  ["Variable", "Description", "Exemple"],
  [
    ["DATABASE_URL", "URL de connexion Prisma", "file:./db/custom.db"],
    ["JWT_SECRET", "Cl\u00e9 secr\u00e8te pour la signature JWT", "lips-secret-key-2025"],
  ],
  [25, 45, 30]
));

// ─── 10. Historique des Modifications ───
content.push(heading("10. Historique des Modifications"));
content.push(spacer(100));
content.push(makeTable(
  ["Version", "Date", "Modifications"],
  [
    ["1.0", "Mai 2026", "MVP initial : site public, espace admin basique, i18n FR"],
    ["2.0", "Mai 2026", "Trilinguisme FR/AR/EN complet, RTL, Coran, pri\u00e8res, r\u00e9gions"],
    ["2.1", "Mai 2026", "Logo officiel extrait du PDF, appliqu\u00e9 sur 8 emplacements"],
    ["2.2", "Juin 2026", "Pages de connexion professionalis\u00e9es avec s\u00e9curit\u00e9 renforc\u00e9e"],
    ["3.0", "Juin 2026", "Th\u00e8me jour/nuit global avec auto-d\u00e9tection, header responsive XL, panneau mobile slide-in"],
  ],
  [12, 15, 73]
));

// ═══════════════════════════════════════════════════════════════
// ASSEMBLE DOCUMENT
// ═══════════════════════════════════════════════════════════════

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
          size: 24,
          color: c(P.body),
        },
        paragraph: {
          spacing: { line: 312 },
        },
      },
      heading1: {
        run: {
          font: { ascii: "Calibri", eastAsia: "SimHei" },
          size: 32,
          bold: true,
          color: c(P.primary),
        },
        paragraph: {
          spacing: { before: 360, after: 160, line: 312 },
        },
      },
      heading2: {
        run: {
          font: { ascii: "Calibri", eastAsia: "SimHei" },
          size: 28,
          bold: true,
          color: c(P.primary),
        },
        paragraph: {
          spacing: { before: 280, after: 120, line: 312 },
        },
      },
      heading3: {
        run: {
          font: { ascii: "Calibri", eastAsia: "SimHei" },
          size: 24,
          bold: true,
          color: c(P.primary),
        },
        paragraph: {
          spacing: { before: 200, after: 100, line: 312 },
        },
      },
    },
  },
  numbering: {
    config: [],
  },
  sections: [
    // Section 1: Cover
    {
      properties: {
        page: {
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: buildCover(),
    },
    // Section 2: TOC
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary) })],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: "Table des mati\u00e8res",
              bold: true,
              size: 36,
              color: c(P.primary),
              font: { ascii: "Calibri", eastAsia: "SimHei" },
            }),
          ],
        }),
        new TableOfContents("Table des mati\u00e8res", {
          hyperlink: true,
          headingStyleRange: "1-3",
        }),
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "Astuce : clic droit sur la table des mati\u00e8res \u2192 \u00ab Mettre \u00e0 jour les champs \u00bb pour actualiser les num\u00e9ros de page.",
              italics: true,
              size: 20,
              color: c(P.secondary),
            }),
          ],
        }),
        new Paragraph({
          children: [new PageBreak()],
        }),
      ],
    },
    // Section 3: Body
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "LIPS \u2014 Documentation Technique SIIN v3.0",
                  size: 16,
                  color: c(P.secondary),
                  font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary) }),
              ],
            }),
          ],
        }),
      },
      children: content,
    },
  ],
});

// ─── Generate ───
Packer.toBuffer(doc).then((buffer) => {
  const outPath = "/home/z/my-project/download/LIPS-Documentation-Technique-SIIN-v3.docx";
  fs.writeFileSync(outPath, buffer);
  console.log(`Document generated: ${outPath}`);
});
