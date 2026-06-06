import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Regions (must be first due to FK) ---
  const regionsData = [
    { code: 'DKR', nom: 'Dakar', nomAr: 'دكار', population: 3916000, mosqueCount: 2450, latitude: 14.7167, longitude: -17.4677 },
    { code: 'SLG', nom: 'Saint-Louis', nomAr: 'سان لويس', population: 1074000, mosqueCount: 890, latitude: 16.0326, longitude: -16.4818 },
    { code: 'LGN', nom: 'Louga', nomAr: 'لوغا', population: 995000, mosqueCount: 720, latitude: 15.6167, longitude: -16.3167 },
    { code: 'FTK', nom: 'Fatick', nomAr: 'فاتيك', population: 835000, mosqueCount: 640, latitude: 14.1167, longitude: -16.4167 },
    { code: 'THS', nom: 'Thiès', nomAr: 'ثيس', population: 1788000, mosqueCount: 1280, latitude: 14.7833, longitude: -17.1 },
    { code: 'KDGN', nom: 'Kédougou', nomAr: 'كيدوغو', population: 175000, mosqueCount: 110, latitude: 12.5667, longitude: -12.2167 },
    { code: 'KLC', nom: 'Kolda', nomAr: 'كولدا', population: 780000, mosqueCount: 560, latitude: 12.9, longitude: -14.95 },
    { code: 'MTM', nom: 'Matam', nomAr: 'ماتام', population: 675000, mosqueCount: 480, latitude: 13.25, longitude: -13.25 },
    { code: 'KDHL', nom: 'Kaolack', nomAr: 'كاولاك', population: 1170000, mosqueCount: 920, latitude: 14.1333, longitude: -16.0833 },
    { code: 'TMB', nom: 'Tambacounda', nomAr: 'تامباكوندا', population: 830000, mosqueCount: 590, latitude: 13.7667, longitude: -13.6667 },
    { code: 'ZG', nom: 'Ziguinchor', nomAr: 'زيغينكور', population: 655000, mosqueCount: 420, latitude: 12.5833, longitude: -16.2667 },
    { code: 'SED', nom: 'Sédhiou', nomAr: 'سيدهيو', population: 520000, mosqueCount: 350, latitude: 12.7, longitude: -15.55 },
    { code: 'DRL', nom: 'Diourbel', nomAr: 'ديوربل', population: 1980000, mosqueCount: 1580, latitude: 14.65, longitude: -16.2333 },
    { code: 'KFR', nom: 'Kaffrine', nomAr: 'كفرين', population: 690000, mosqueCount: 510, latitude: 14.1167, longitude: -15.55 },
  ];

  for (const r of regionsData) {
    await prisma.region.upsert({
      where: { code: r.code },
      update: r,
      create: r,
    });
  }
  console.log('✅ 14 regions seeded');

  // --- Admin User ---
  const adminPassword = await bcrypt.hash('Admin@2025', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lips.sn' },
    update: {},
    create: {
      email: 'admin@lips.sn',
      password: adminPassword,
      nom: 'NDAW',
      prenom: 'Abdoulaye',
      telephone: '+221 77 000 00 00',
      matricule: 'LIPS-2025-DKR-000001',
      role: 'ADMIN',
      status: 'ACTIF',
      regionId: 1,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // --- Bureau National ---
  const bureauMembers = [
    { nom: 'NDAW', prenom: 'Abdoulaye', role: 'Président National', roleAr: 'الرئيس الوطني', region: 'Dakar', bio: 'Imam de la Grande Mosquée de la Médina, élu à la tête de la LIPS en 2020 pour un mandat de 5 ans.', initiales: 'AN', ordre: 1 },
    { nom: 'BALDE', prenom: 'Mouhammadou', role: 'Vice-Président', roleAr: 'نائب الرئيس', region: 'Tambacounda', bio: 'Prédicateur émérite et ancien responsable régional de Tambacounda.', initiales: 'MB', ordre: 2 },
    { nom: 'SOW', prenom: 'Ibrahima', role: 'Secrétaire Général', roleAr: 'الأمين العام', region: 'Saint-Louis', bio: 'Juriste en droit islamique, formé à l\'Université Al-Azhar.', initiales: 'IS', ordre: 3 },
    { nom: 'DIAKHATE', prenom: 'Ousmane', role: 'Trésorier Général', roleAr: 'أمين الصندوق', region: 'Thiès', bio: 'Expert en gestion financière et administration d\'organisations confessionnelles.', initiales: 'OD', ordre: 4 },
    { nom: 'MBACKÉ', prenom: 'Serigne', role: 'Conseiller Spirituel', roleAr: 'المستشار الروحي', region: 'Diourbel', bio: 'Descendant d\'une lignée savante, érudit en sciences islamiques.', initiales: 'SM', ordre: 5 },
    { nom: 'FAYE', prenom: 'Mamadou', role: 'Responsable Formation', roleAr: 'مسؤول التكوين', region: 'Kaolack', bio: 'Docteur en études islamiques, concepteur du programme de formation continue.', initiales: 'MF', ordre: 6 },
  ];

  for (const m of bureauMembers) {
    await prisma.bureauMember.create({ data: m });
  }
  console.log('✅ Bureau National seeded');

  // --- Commissions ---
  const commissions = [
    { nom: 'Conseil du Choura', nomAr: 'مجلس الشورى', members: 28, desc: 'Instance suprême de délibération et de conseil', icon: 'Crown', ordre: 1 },
    { nom: 'Commission des Membres', nomAr: 'لجنة العضوية', members: 7, desc: 'Admissions, radiations et discipline', icon: 'Users', ordre: 2 },
    { nom: 'Commission Financière', nomAr: 'اللجنة المالية', members: 5, desc: 'Audit, budget et transparence', icon: 'Building', ordre: 3 },
    { nom: 'Commission Fatwa', nomAr: 'لجنة الفتوى', members: 12, desc: 'Avis juridiques et consultations religieuses', icon: 'Award', ordre: 4 },
  ];

  for (const c of commissions) {
    await prisma.commission.create({ data: c });
  }
  console.log('✅ Commissions seeded');

  // --- FAQ ---
  const faqs = [
    { question: 'Quelles sont les conditions pour adhérer à la LIPS ?', reponse: 'Pour adhérer à la LIPS, vous devez être un imam ou prédicateur exerçant au Sénégal, être parrainé par un membre actif ou un responsable régional, et vous acquitter de la cotisation annuelle.', ordre: 1 },
    { question: 'Comment obtenir la carte membre nationale ?', reponse: 'La carte membre nationale est délivrée après validation de votre candidature et paiement de la cotisation annuelle. Elle porte un matricule unique au format LIPS-ANNÉE-RÉGION-NUMÉRO.', ordre: 2 },
    { question: 'Quel est le montant de la cotisation annuelle ?', reponse: 'La cotisation annuelle est fixée à 5 000 FCFA pour les imams et prédicateurs, et 10 000 FCFA pour les responsables régionaux et membres du Choura.', ordre: 3 },
    { question: 'La LIPS est-elle reconnue par les autorités de l\'État ?', reponse: 'Oui, la LIPS est reconnue comme organisation confessionnelle de référence par les autorités sénégalaises. Elle siège au Haut Conseil Islamique.', ordre: 4 },
    { question: 'Comment vérifier l\'authenticité d\'une carte membre ?', reponse: 'Chaque carte membre intègre un QR code qui, une fois scanné, redirige vers la page de vérification du site lips.sn. Vous pouvez également saisir le matricule directement.', ordre: 5 },
    { question: 'Quels types de formations la LIPS propose-t-elle ?', reponse: 'La LIPS organise des formations continues couvrant plusieurs domaines : sciences islamiques, communication, gestion communautaire, médiation et accompagnement psycho-social.', ordre: 6 },
    { question: 'Puis-je faire un don à la LIPS ?', reponse: 'Oui, les dons sont essentiels au fonctionnement de la LIPS. Vous pouvez contribuer via notre plateforme sécurisée (CinetPay, Wave) ou en espèces.', ordre: 7 },
  ];

  for (const f of faqs) {
    await prisma.fAQ.create({ data: f });
  }
  console.log('✅ FAQ seeded');

  // --- Contents (Articles, Communiqués, Fatwas, Événements) ---
  const contents = [
    {
      titre: 'Communiqué : Position de la LIPS sur le dialogue interreligieux',
      titreAr: 'بيان: موقف الرابطة حول الحوار بين الأديان',
      contenu: 'La Ligue des Imams et Prédicateurs du Sénégal réaffirme son engagement en faveur du dialogue interreligieux et appelle l\'ensemble des communautés de foi à privilégier la concertation et le respect mutuel dans un climat de paix et de fraternité.',
      type: 'COMMUNIQUE',
      categorie: 'dialogue',
      published: true,
      auteurId: admin.id,
    },
    {
      titre: 'Fatwa : Conditions de la prière du Vendredi en voyage',
      titreAr: 'فتوى: شروط صلاة الجمعة في السفر',
      contenu: 'La Commission des Fatwas de la LIPS précise les conditions dans lesquelles le voyageur peut accomplir la prière du Vendredi, conformément à l\'école malikite.',
      type: 'FATWA',
      categorie: 'fiqh',
      published: true,
      auteurId: admin.id,
    },
    {
      titre: 'Formation régionale à Thiès — 15 au 18 Juin',
      titreAr: 'تكوين جهوي في ثيس',
      contenu: 'La LIPS organise du 15 au 18 juin prochain une session de formation continue au profit des imams et prédicateurs de la région de Thiès.',
      type: 'EVENEMENT',
      categorie: 'formation',
      published: true,
      auteurId: admin.id,
      dateEvenement: new Date('2026-06-15'),
      lieu: 'Mosquée Centrale de Thiès',
    },
    {
      titre: 'Ramadan 2026 : Recommandations de la LIPS aux imams',
      titreAr: 'رمضان ٢٠٢٦: توصيات الرابطة للأئمة',
      contenu: 'À l\'approche du mois sacré de Ramadan, la LIPS adresse ses recommandations aux imams du Sénégal pour l\'organisation des prières de tarawih et la gestion des collectes de zakat.',
      type: 'ARTICLE',
      categorie: 'spiritualité',
      published: true,
      auteurId: admin.id,
    },
    {
      titre: 'Assemblée Générale Extraordinaire — Décisions',
      titreAr: 'الجمعية العامة الاستثنائية',
      contenu: 'L\'Assemblée Générale Extraordinaire a adopté à l\'unanimité les résolutions portant réforme du système d\'adhésion et création de la carte membre numérique.',
      type: 'COMMUNIQUE',
      categorie: 'institutionnel',
      published: true,
      auteurId: admin.id,
    },
    {
      titre: 'Séminaire National des Imams',
      titreAr: 'الندوة الوطنية للأئمة',
      contenu: 'Grand séminaire annuel réunissant les délégués des 14 régions pour dresser le bilan de l\'année écoulée et définir les orientations stratégiques.',
      type: 'SEMINAIRE',
      categorie: 'formation',
      published: true,
      auteurId: admin.id,
      dateEvenement: new Date('2026-06-15'),
      lieu: 'Centre International du Grand Dakar',
    },
  ];

  for (const c of contents) {
    await prisma.content.create({ data: c });
  }
  console.log('✅ Contents seeded');

  // --- SiteConfig ---
  const configs = [
    { key: 'site_name', value: 'LIPS - Ligue des Imams et Prédicateurs du Sénégal' },
    { key: 'site_description', value: 'Institution nationale de référence au service des imams, de la communauté et de la paix sociale.' },
    { key: 'contact_phone', value: '+221 33 800 00 00' },
    { key: 'contact_email', value: 'contact@lips.sn' },
    { key: 'contact_address', value: 'Grande Mosquée AN-NOUR, Liberté II, Dakar' },
    { key: 'facebook_url', value: '#' },
    { key: 'twitter_url', value: '#' },
    { key: 'youtube_url', value: '#' },
    { key: 'hero_title', value: 'Ligue des Imams et Prédicateurs du Sénégal' },
    { key: 'hero_subtitle', value: 'Au service des imams, de la communauté et de la paix sociale à travers les 14 régions du Sénégal.' },
    { key: 'hero_badge', value: 'Institution Nationale de Référence' },
    { key: 'hero_motto_ar', value: 'بِالصَّبْرِ وَالْيَقِينِ تُنَالُ الْإِمَامَةُ فِي الدِّينِ' },
    { key: 'hero_motto_fr', value: 'Par la patience et la certitude, on atteint l\'imamat dans la religion' },
    { key: 'stat_members', value: '5000' },
    { key: 'stat_regions', value: '14' },
    { key: 'stat_mosques', value: '15000' },
    { key: 'stat_formations', value: '200' },
    { key: 'stat_annees', value: '18' },
    { key: 'stat_renouvellement', value: '98' },
    { key: 'cotisation_imam', value: '5000' },
    { key: 'cotisation_responsable', value: '10000' },
    { key: 'don_minimum', value: '1000' },
  ];

  for (const c of configs) {
    await prisma.siteConfig.upsert({
      where: { key: c.key },
      update: { value: c.value },
      create: c,
    });
  }
  console.log('✅ SiteConfig seeded');

  console.log('\n🎉 Seed complete!');
  console.log('📧 Admin: admin@lips.sn');
  console.log('🔑 Password: Admin@2025');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
