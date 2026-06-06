const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  TableOfContents,
} = require("docx");
const fs = require("fs");

// LIPS palette — warm green/gold institutional
const P = {
  primary: "1B5E20",
  body: "1C2A1C",
  secondary: "5B7B5D",
  accent: "C9962A",
  surface: "F5F9F0",
};
const c = (hex) => hex.replace("#", "");

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "SimHei" }, size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 28 : 24 })],
  });
}

function bodyPara(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 420 },
    spacing: { line: 312, after: 80 },
    ...opts,
    children: [new TextRun({ text, size: 22, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

function bodyNoIndent(text, opts = {}) {
  return new Paragraph({
    spacing: { line: 312, after: 60 },
    ...opts,
    children: [new TextRun({ text, size: 22, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

function boldLabel(label, value) {
  return new Paragraph({
    spacing: { line: 312, after: 60 },
    children: [
      new TextRun({ text: label, bold: true, size: 22, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "SimHei" } }),
      new TextRun({ text: value, size: 22, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
    ],
  });
}

function spacer(twips = 120) {
  return new Paragraph({ spacing: { before: twips } });
}

function makeCell(text, opts = {}) {
  const { bold, header, width, align } = opts;
  return new TableCell({
    children: [new Paragraph({
      alignment: align || AlignmentType.LEFT,
      children: [new TextRun({ text, bold: bold || header, size: 20, color: header ? "FFFFFF" : c(P.body), font: { ascii: "Calibri" } })],
    })],
    shading: header ? { type: ShadingType.CLEAR, fill: c(P.primary) } : undefined,
    margins: { top: 50, bottom: 50, left: 100, right: 100 },
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
  });
}

// ───────────────── COVER (R1 style) ─────────────────
function buildCover() {
  const children = [
    new Paragraph({ spacing: { before: 3000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: "LIPS", size: 72, bold: true, color: c(P.primary), font: { ascii: "Calibri" } })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "Ligue des Imams et Pr\u00e9dicateurs du S\u00e9n\u00e9gal", size: 28, color: c(P.accent), font: { ascii: "Calibri" } })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      indent: { left: 2000, right: 2000 },
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: c(P.accent), space: 20 } },
      children: [],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 100 },
      children: [new TextRun({ text: "Documentation Technique Compl\u00e8te", size: 36, bold: true, color: c(P.primary), font: { ascii: "Calibri" } })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "Syst\u00e8me d\u2019Information Institutionnel National (SIIN)", size: 22, color: c(P.secondary), font: { ascii: "Calibri" } })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 80 },
      children: [new TextRun({ text: "Identifiants, architecture et processus de d\u00e9ploiement", size: 22, color: c(P.secondary), font: { ascii: "Calibri" } })],
    }),
    new Paragraph({ spacing: { before: 2000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Version 2.0 \u2014 Juin 2026", size: 20, color: c(P.secondary), font: { ascii: "Calibri" } })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: "Document confidentiel \u2014 Usage interne", size: 18, color: c(P.accent), font: { ascii: "Calibri" } })],
    }),
  ];
  return children;
}

// ───────────────── BODY CONTENT ─────────────────
function buildBody() {
  const content = [];

  // === 1. IDENTIFIANTS D'ACCÈS ===
  content.push(heading("1. Identifiants d\u2019acc\u00e8s"));

  content.push(heading("1.1 Administrateur", HeadingLevel.HEADING_2));
  content.push(bodyPara("Le compte administrateur principal permet d\u2019acc\u00e9der au panneau d\u2019administration complet du site LIPS. Ce compte dispose de tous les privil\u00e8ges de gestion : contenus, membres, r\u00e9gions, param\u00e8tres du site, FAQ, bureau national, commissions, agenda, coran et concours."));

  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("Champ", { header: true, width: 30 }), makeCell("Valeur", { header: true, width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Email", { bold: true, width: 30 }), makeCell("admin@lips.sn", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Mot de passe", { bold: true, width: 30 }), makeCell("Admin@2025", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Matricule", { bold: true, width: 30 }), makeCell("LIPS-2025-DKR-000001", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("R\u00f4le", { bold: true, width: 30 }), makeCell("ADMIN", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("URL d\u2019acc\u00e8s", { bold: true, width: 30 }), makeCell("/admin/login", { width: 70 })] }),
    ],
  }));

  content.push(heading("1.2 Membre d\u00e9mo (Imam)", HeadingLevel.HEADING_2));
  content.push(bodyPara("Le compte membre d\u00e9monstration simule un imam affili\u00e9 \u00e0 la LIPS, disposant d\u2019une carte membre active, d\u2019un historique de cotisations et de dons, et d\u2019un acc\u00e8s \u00e0 l\u2019espace membre personnel."));

  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("Champ", { header: true, width: 30 }), makeCell("Valeur", { header: true, width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Email", { bold: true, width: 30 }), makeCell("abdoulaye.ndiaye@lips.sn", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Mot de passe", { bold: true, width: 30 }), makeCell("Membre@2025", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Matricule", { bold: true, width: 30 }), makeCell("LIPS-2025-DKR-000124", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("R\u00f4le", { bold: true, width: 30 }), makeCell("IMAM", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Statut", { bold: true, width: 30 }), makeCell("ACTIF", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("URL d\u2019acc\u00e8s", { bold: true, width: 30 }), makeCell("/espace-membre/login", { width: 70 })] }),
    ],
  }));

  // === 2. CARTE MEMBRE ===
  content.push(heading("2. Carte Membre \u2014 D\u00e9tails"));

  content.push(bodyPara("La carte membre est le document officiel d\u2019identification de chaque membre de la LIPS. Elle est g\u00e9n\u00e9r\u00e9e automatiquement lors de l\u2019activation du compte membre et contient un num\u00e9ro unique, un QR code de v\u00e9rification, et une date d\u2019expiration. La carte est consultable dans l\u2019espace membre avec un effet 3D flip interactif (recto/verso)."));

  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("Champ", { header: true, width: 30 }), makeCell("Valeur", { header: true, width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Num\u00e9ro de carte", { bold: true, width: 30 }), makeCell("LIPS-2025-DKR-000124", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("QR Code URL", { bold: true, width: 30 }), makeCell("https://lips.sn/verifier/LIPS-2025-DKR-000124", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Date d\u2019\u00e9mission", { bold: true, width: 30 }), makeCell("15 janvier 2025", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Date d\u2019expiration", { bold: true, width: 30 }), makeCell("15 janvier 2026", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Titulaire", { bold: true, width: 30 }), makeCell("Abdoulaye NDIAYE", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("R\u00e9gion", { bold: true, width: 30 }), makeCell("Dakar", { width: 70 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Mosqu\u00e9e", { bold: true, width: 30 }), makeCell("Mosqu\u00e9e An-Nour, Libert\u00e9 II, Dakar", { width: 70 })] }),
    ],
  }));

  content.push(bodyPara("Format du matricule : LIPS-AAAA-REG-NNNNNN o\u00f9 AAAA est l\u2019ann\u00e9e d\u2019adh\u00e9sion, REG le code r\u00e9gion (DKR, SLG, etc.), et NNNNNN le num\u00e9ro s\u00e9quentiel. La v\u00e9rification de carte est accessible publiquement via /verifier-carte avec le matricule complet."));

  // === 3. HISTORIQUE PAIEMENTS ===
  content.push(heading("3. Historique des paiements du membre d\u00e9mo"));

  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("Type", { header: true, width: 20 }), makeCell("Montant", { header: true, width: 15 }), makeCell("M\u00e9thode", { header: true, width: 15 }), makeCell("Date", { header: true, width: 20 }), makeCell("R\u00e9f\u00e9rence", { header: true, width: 30 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Cotisation", { width: 20 }), makeCell("10 000 FCFA", { width: 15 }), makeCell("Wave", { width: 15 }), makeCell("15/01/2025", { width: 20 }), makeCell("WAV-2025-001", { width: 30 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Don", { width: 20 }), makeCell("50 000 FCFA", { width: 15 }), makeCell("CinetPay", { width: 15 }), makeCell("20/03/2025", { width: 20 }), makeCell("CIN-2025-042", { width: 30 })] }),
      new TableRow({ cantSplit: true, children: [makeCell("Cotisation", { width: 20 }), makeCell("10 000 FCFA", { width: 15 }), makeCell("Esp\u00e8ces", { width: 15 }), makeCell("10/01/2026", { width: 20 }), makeCell("ESP-2026-003", { width: 30 })] }),
    ],
  }));

  // === 4. ARCHITECTURE TECHNIQUE ===
  content.push(heading("4. Architecture technique du SIIN"));

  content.push(heading("4.1 Stack technologique", HeadingLevel.HEADING_2));
  const stackRows = [
    ["Framework", "Next.js 16 (App Router, Turbopack)"],
    ["Langage", "TypeScript 5"],
    ["Styling", "Tailwind CSS 4 + Framer Motion"],
    ["UI Kit", "shadcn/ui (Radix primitives)"],
    ["Base de donn\u00e9es", "SQLite via Prisma 6 ORM"],
    ["Authentification", "JWT (jose) + bcryptjs"],
    ["Charts", "Recharts"],
    ["Editeur", "MDX Editor"],
    ["DnD", "@dnd-kit/core + sortable"],
  ];
  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("Composant", { header: true, width: 30 }), makeCell("Technologie", { header: true, width: 70 })] }),
      ...stackRows.map(([comp, tech]) => new TableRow({ cantSplit: true, children: [makeCell(comp, { bold: true, width: 30 }), makeCell(tech, { width: 70 })] })),
    ],
  }));

  content.push(heading("4.2 Couleurs LIPS", HeadingLevel.HEADING_2));
  const colorRows = [
    ["lips-green", "#1B6B3A", "Vert principal"],
    ["lips-green-dark", "#0D3B1F", "Vert fonc\u00e9 (header, sidebar)"],
    ["lips-green-light", "#2E8B57", "Vert clair"],
    ["lips-gold", "#C9962A", "Or (accents, titre Hijri)"],
    ["lips-gold-light", "#E5BE5A", "Or clair"],
    ["lips-cream", "#FBF8F0", "Cr\u00e8me (backgrounds)"],
    ["lips-emerald", "#0D7D5E", "\u00c9meraude"],
  ];
  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("Token", { header: true, width: 25 }), makeCell("Hex", { header: true, width: 20 }), makeCell("Usage", { header: true, width: 55 })] }),
      ...colorRows.map(([tok, hex, usage]) => new TableRow({ cantSplit: true, children: [makeCell(tok, { bold: true, width: 25 }), makeCell(hex, { width: 20 }), makeCell(usage, { width: 55 })] })),
    ],
  }));

  // === 5. STRUCTURE DES PAGES ===
  content.push(heading("5. Structure des pages publiques"));

  const pageRows = [
    ["/", "Accueil", "Hero, Stats, 4 Piliers, Actualit\u00e9s, R\u00e9gions + Carte, CTA, Newsletter"],
    ["/a-propos", "\u00c0 Propos", "Mission, Gouvernance, Carte Membre 3D, FAQ"],
    ["/actualites", "Actualit\u00e9s", "Communiqu\u00e9s/Fatwas, \u00c9v\u00e9nements, Galerie Photos"],
    ["/coran", "Coran", "R\u00e9citateurs audio, Index 114 sourates, Ressources, Verset du jour"],
    ["/agenda", "Agenda", "Double calendrier Gr\u00e9gorien+Hijri, F\u00eates islamiques, \u00c9v\u00e9nements LIPS"],
    ["/regions", "R\u00e9gions", "Carte interactive SVG, 14 r\u00e9gions avec d\u00e9tails"],
    ["/adherer", "Adh\u00e9rer", "Formulaire d\u2019adh\u00e9sion, Avantages membre"],
    ["/verifier-carte", "V\u00e9rifier Carte", "V\u00e9rification par matricule, FAQ"],
    ["/faire-un-don", "Faire un Don", "Formulaire don, Moyens de paiement"],
    ["/espace-membre", "Espace Membre", "Dashboard, Carte 3D, Profil, Cotisations, Liens rapides"],
    ["/espace-membre/login", "Connexion Membre", "Authentification email/matricule + mot de passe"],
  ];
  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("Route", { header: true, width: 18 }), makeCell("Page", { header: true, width: 15 }), makeCell("Contenu", { header: true, width: 67 })] }),
      ...pageRows.map(([route, page, desc]) => new TableRow({ cantSplit: true, children: [makeCell(route, { bold: true, width: 18 }), makeCell(page, { width: 15 }), makeCell(desc, { width: 67 })] })),
    ],
  }));

  // === 6. ADMIN ===
  content.push(heading("6. Panneau d\u2019administration"));

  content.push(heading("6.1 Structure de la sidebar admin", HeadingLevel.HEADING_2));

  const adminRows = [
    ["Tableau de Bord", "/admin", "Stats, graphique r\u00e9gions, contenus r\u00e9cents, membres r\u00e9cents"],
    ["Contenus", "/admin/contenus", "CRUD communiqu\u00e9s, fatwas, articles, \u00e9v\u00e9nements, s\u00e9minaires, cours"],
    ["Coran", "/admin/coran", "Gestion r\u00e9citateurs, versets du jour, ressources coraniques"],
    ["Agenda", "/admin/agenda", "CRUD \u00e9v\u00e9nements, dates islamiques, param\u00e8tres calendrier"],
    ["Concours", "/admin/concours", "CRUD concours (coranique, hadith, m\u00e9morisation, quiz), toggle visibilit\u00e9"],
    ["FAQ", "/admin/faq", "CRUD questions/r\u00e9ponses, ordre, publication"],
    ["Membres", "/admin/membres", "Liste, filtres, modification statut/r\u00f4le, suppression"],
    ["R\u00e9gions", "/admin/regions", "Modification des 14 r\u00e9gions (population, mosqu\u00e9es, coordonn\u00e9es)"],
    ["Bureau National", "/admin/bureau", "CRUD membres du bureau (photo, bio, r\u00f4le bilingue)"],
    ["Commissions", "/admin/commissions", "CRUD commissions (nom, description, membres, ic\u00f4ne)"],
    ["Param\u00e8tres", "/admin/parametres", "Contact, r\u00e9seaux sociaux, hero, stats, cotisations, dons"],
  ];
  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("Section", { header: true, width: 18 }), makeCell("Route", { header: true, width: 18 }), makeCell("Fonctionnalit\u00e9s", { header: true, width: 64 })] }),
      ...adminRows.map(([sec, route, desc]) => new TableRow({ cantSplit: true, children: [makeCell(sec, { bold: true, width: 18 }), makeCell(route, { width: 18 }), makeCell(desc, { width: 64 })] })),
    ],
  }));

  // === 7. API ===
  content.push(heading("7. Points d\u2019acc\u00e8s API"));

  content.push(heading("7.1 APIs publiques", HeadingLevel.HEADING_2));
  const pubApiRows = [
    ["GET", "/api", "Health check"],
    ["GET", "/api/verifier-carte?matricule=...", "V\u00e9rification de carte membre"],
  ];
  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("M\u00e9thode", { header: true, width: 10 }), makeCell("Endpoint", { header: true, width: 45 }), makeCell("Description", { header: true, width: 45 })] }),
      ...pubApiRows.map(([m, e, d]) => new TableRow({ cantSplit: true, children: [makeCell(m, { bold: true, width: 10 }), makeCell(e, { width: 45 }), makeCell(d, { width: 45 })] })),
    ],
  }));

  content.push(heading("7.2 APIs membre", HeadingLevel.HEADING_2));
  const memApiRows = [
    ["POST", "/api/membre/login", "Connexion membre (email ou matricule + mot de passe)"],
    ["GET", "/api/membre/me", "Profil complet du membre connect\u00e9"],
    ["POST", "/api/membre/logout", "D\u00e9connexion membre"],
  ];
  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("M\u00e9thode", { header: true, width: 10 }), makeCell("Endpoint", { header: true, width: 35 }), makeCell("Description", { header: true, width: 55 })] }),
      ...memApiRows.map(([m, e, d]) => new TableRow({ cantSplit: true, children: [makeCell(m, { bold: true, width: 10 }), makeCell(e, { width: 35 }), makeCell(d, { width: 55 })] })),
    ],
  }));

  content.push(heading("7.3 APIs admin (authentification requise)", HeadingLevel.HEADING_2));
  const admApiRows = [
    ["POST", "/api/admin/login", "Connexion admin"],
    ["GET", "/api/admin/me", "Session admin courante"],
    ["POST", "/api/admin/logout", "D\u00e9connexion admin"],
    ["GET/POST", "/api/admin/dashboard", "Statistiques du tableau de bord"],
    ["GET/POST", "/api/admin/contenus", "Liste/Cr\u00e9ation de contenus"],
    ["PUT/DELETE", "/api/admin/contenus/[id]", "Modification/Suppression de contenu"],
    ["GET/PUT", "/api/admin/membres", "Liste/Modification de membres"],
    ["PUT/DELETE", "/api/admin/membres/[id]", "Modification/Suppression de membre"],
    ["GET/PUT", "/api/admin/regions", "Liste/Modification de r\u00e9gions"],
    ["GET/POST", "/api/admin/faq", "Liste/Cr\u00e9ation de FAQ"],
    ["PUT/DELETE", "/api/admin/faq/[id]", "Modification/Suppression de FAQ"],
    ["GET/POST", "/api/admin/bureau", "Liste/Cr\u00e9ation de bureau members"],
    ["PUT/DELETE", "/api/admin/bureau/[id]", "Modification/Suppression"],
    ["GET/POST", "/api/admin/commissions", "Liste/Cr\u00e9ation de commissions"],
    ["PUT/DELETE", "/api/admin/commissions/[id]", "Modification/Suppression"],
    ["GET/POST", "/api/admin/concours", "Liste/Cr\u00e9ation de concours"],
    ["PUT/DELETE", "/api/admin/concours/[id]", "Modification/Suppression/toggle visibilit\u00e9"],
    ["GET/PUT", "/api/admin/parametres", "Liste/Mise \u00e0 jour des param\u00e8tres site"],
  ];
  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("M\u00e9thode", { header: true, width: 12 }), makeCell("Endpoint", { header: true, width: 38 }), makeCell("Description", { header: true, width: 50 })] }),
      ...admApiRows.map(([m, e, d]) => new TableRow({ cantSplit: true, children: [makeCell(m, { bold: true, width: 12 }), makeCell(e, { width: 38 }), makeCell(d, { width: 50 })] })),
    ],
  }));

  // === 8. CONCOURS ===
  content.push(heading("8. Concours (section administrable, non visible publiquement)"));

  content.push(bodyPara("Les concours sont g\u00e9r\u00e9s depuis l\u2019administration mais ne sont pas encore visibles sur le site public. Chaque concours dispose d\u2019un toggle \u00ab Visible publiquement \u00bb qui permettra, quand les pages publiques seront cr\u00e9\u00e9es, de contr\u00f4ler individuellement la visibilit\u00e9 de chaque concours. Les types de concours support\u00e9s sont : Concours Coranique, Concours de Hadith, Concours de M\u00e9morisation et Quiz Islamique."));

  const concoursRows = [
    ["7e Concours de M\u00e9morisation du Saint Coran", "CONCOURS_CORAN", "En cours", "Oui"],
    ["2e Concours du Hadith Nabawi", "CONCOURS_HADITH", "Termin\u00e9", "Oui"],
    ["Concours R\u00e9gional de R\u00e9citation \u2014 Dakar", "CONCOURS_CORAN", "Planifi\u00e9", "Non"],
    ["Quiz Islamique National", "QUIZ_ISLAMIQUE", "Planifi\u00e9", "Non"],
    ["Concours de M\u00e9morisation \u2014 Kaolack", "CONCOURS_MEMORISATION", "Planifi\u00e9", "Non"],
  ];
  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("Nom", { header: true, width: 35 }), makeCell("Type", { header: true, width: 20 }), makeCell("Statut", { header: true, width: 15 }), makeCell("Visible", { header: true, width: 15 })] }),
      ...concoursRows.map(([n, t, s, v]) => new TableRow({ cantSplit: true, children: [makeCell(n, { width: 35 }), makeCell(t, { width: 20 }), makeCell(s, { width: 15 }), makeCell(v, { width: 15 })] })),
    ],
  }));

  // === 9. MODÈLES PRISMA ===
  content.push(heading("9. Mod\u00e8les de donn\u00e9es (Prisma)"));

  content.push(bodyPara("La base de donn\u00e9es SQLite contient 11 mod\u00e8les Prisma couvrant les 7 domaines fonctionnels du SIIN. Chaque mod\u00e8le est con\u00e7u pour \u00eatre extensible et les champs optionnels permettent une adoption progressive des fonctionnalit\u00e9s."));

  const modelRows = [
    ["Region", "Gouvernance", "code, nom, nomAr, population, mosqueCount, latitude, longitude"],
    ["User", "Membres", "matricule, email, password, nom, prenom, telephone, role, status, photo"],
    ["Mosque", "Membres", "nom, adresse, regionId"],
    ["CarteMembre", "Carte & V\u00e9rification", "numeroCarte, qrCodeUrl, dateEmission, dateExpiration"],
    ["Paiement", "Financier", "montant, type, referenceTrans, methode, datePaiement"],
    ["Content", "Communication", "titre, titreAr, contenu, contenuAr, type, categorie, published"],
    ["SiteConfig", "Configuration", "key, value (cl\u00e9-valeur g\u00e9n\u00e9rique)"],
    ["FAQ", "FAQ", "question, reponse, ordre, published"],
    ["BureauMember", "Gouvernance", "nom, prenom, role, roleAr, region, bio, initiales, photo, ordre"],
    ["Commission", "Gouvernance", "nom, nomAr, members, desc, icon, ordre"],
    ["Concours", "Activit\u00e9s", "nom, type, dateDebut, dateFin, lieu, visiblePublic, inscriptionsOuvertes, statut"],
  ];
  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("Mod\u00e8le", { header: true, width: 15 }), makeCell("Domaine", { header: true, width: 18 }), makeCell("Champs cl\u00e9s", { header: true, width: 67 })] }),
      ...modelRows.map(([m, d, f]) => new TableRow({ cantSplit: true, children: [makeCell(m, { bold: true, width: 15 }), makeCell(d, { width: 18 }), makeCell(f, { width: 67 })] })),
    ],
  }));

  // === 10. NOUVELLES FONCTIONNALITÉS ===
  content.push(heading("10. Nouvelles fonctionnalit\u00e9s (v2.0)"));

  content.push(heading("10.1 Section Coran (/coran)", HeadingLevel.HEADING_2));
  content.push(bodyPara("La section Coran est la plus grande nouveaut\u00e9 inspir\u00e9e de l\u2019analyse du site FM6OA. Elle comprend six r\u00e9citateurs s\u00e9n\u00e9galais avec lecteur audio int\u00e9gr\u00e9, un index complet des 114 sourates organis\u00e9es par Juz avec recherche, cinq ressources coraniques (lecture, Wolof, audio, tafsir, hifz), et un verset du jour rotatif en arabe et fran\u00e7ais. L\u2019ensemble est administrable depuis /admin/coran."));

  content.push(heading("10.2 Calendrier Hijri + Agenda (/agenda)", HeadingLevel.HEADING_2));
  content.push(bodyPara("Le calendrier Hijri offre un affichage double (Gr\u00e9gorien + Hijri) synchronis\u00e9 avec navigation mensuelle. Huit f\u00eates islamiques sont marqu\u00e9es sur le calendrier (Nouvel An, Mawlid, Isra, Ramadan, Nuit du Destin, A\u00efd al-Fitr, A\u00efd al-Adha). L\u2019agenda affiche les \u00e9v\u00e9nements LIPS en vue calendrier ou liste, avec filtres par cat\u00e9gorie. Le widget de pri\u00e8res a \u00e9t\u00e9 enrichi avec les dates Hijri en arabe et un lien vers l\u2019agenda."));

  content.push(heading("10.3 Carte interactive du S\u00e9n\u00e9gal (/regions)", HeadingLevel.HEADING_2));
  content.push(bodyPara("La carte SVG interactive affiche les 14 r\u00e9gions du S\u00e9n\u00e9gal avec des effets de survol (changement de couleur, tooltip avec population et mosqu\u00e9es), un clic qui fait d\u00e9filer vers la carte r\u00e9gion correspondante, et une barre de statistiques r\u00e9capitulatives. La Gambie est repr\u00e9sent\u00e9e comme zone s\u00e9paratrice. Une version compacte est int\u00e9gr\u00e9e sur la page d\u2019accueil."));

  content.push(heading("10.4 Espace Membre connect\u00e9 (/espace-membre)", HeadingLevel.HEADING_2));
  content.push(bodyPara("L\u2019espace membre offre un portail personnel complet pour chaque imam ou pr\u00e9dicateur. Apr\u00e8s connexion, le membre acc\u00e8de \u00e0 un tableau de bord avec message de bienvenue, carte membre 3D flip, informations de profil, historique des cotisations et dons, et liens rapides vers les fonctionnalit\u00e9s cl\u00e9s. L\u2019authentification utilise JWT avec cookie httpOnly s\u00e9par\u00e9 de l\u2019admin, et les routes sont prot\u00e9g\u00e9es par middleware."));

  // === 11. SÉCURITÉ ===
  content.push(heading("11. S\u00e9curit\u00e9 et authentification"));

  content.push(bodyPara("Le syst\u00e8me utilise deux canaux d\u2019authentification distincts, s\u00e9par\u00e9s par des cookies diff\u00e9rents. L\u2019administration utilise le cookie lips-admin-session (r\u00f4les ADMIN, PRESIDENT, RESPONSABLE_REGIONAL) et l\u2019espace membre utilise lips-member-session (r\u00f4les IMAM, PREDICATEUR, RESPONSABLE_REGIONAL, MEMBRE_CHOURA). Les deux utilisent JWT via la biblioth\u00e8que jose avec une dur\u00e9e de validit\u00e9 de 24 heures, cookies httpOnly, et v\u00e9rification des mots de passe via bcryptjs. Le middleware Next.js prot\u00e8ge les routes /admin/* et /espace-membre/* en v\u00e9rifiant la validit\u00e9 du JWT correspondant."));

  content.push(heading("11.1 R\u00f4les utilisateur", HeadingLevel.HEADING_2));
  const roleRows = [
    ["ADMIN", "Acc\u00e8s complet au panneau d\u2019administration"],
    ["PRESIDENT", "Acc\u00e8s administration + autorit\u00e9 institutionnelle"],
    ["RESPONSABLE_REGIONAL", "Acc\u00e8s admin limit\u00e9 + acc\u00e8s membre"],
    ["IMAM", "Acc\u00e8s espace membre uniquement"],
    ["PREDICATEUR", "Acc\u00e8s espace membre uniquement"],
    ["MEMBRE_CHOURA", "Acc\u00e8s espace membre uniquement"],
  ];
  content.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [makeCell("R\u00f4le", { header: true, width: 25 }), makeCell("Acc\u00e8s", { header: true, width: 75 })] }),
      ...roleRows.map(([r, a]) => new TableRow({ cantSplit: true, children: [makeCell(r, { bold: true, width: 25 }), makeCell(a, { width: 75 })] })),
    ],
  }));

  return content;
}

// ───────────────── ASSEMBLE DOCUMENT ─────────────────
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 22, color: c(P.body) },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 32, bold: true, color: c(P.primary) },
        paragraph: { spacing: { before: 360, after: 160, line: 312 } },
      },
      heading2: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 28, bold: true, color: c(P.primary) },
        paragraph: { spacing: { before: 240, after: 120, line: 312 } },
      },
    },
  },
  sections: [
    // Cover section
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 0, bottom: 0, left: 1701, right: 1417 },
        },
      },
      children: buildCover(),
    },
    // Body section
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "LIPS \u2014 Documentation Technique SIIN v2.0", size: 16, color: c(P.secondary), font: { ascii: "Calibri" } })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary) })],
          })],
        }),
      },
      children: buildBody(),
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/z/my-project/download/LIPS-Documentation-Technique-SIIN-v2.docx", buf);
  console.log("Document generated: /home/z/my-project/download/LIPS-Documentation-Technique-SIIN-v2.docx");
});
