-- ============================================================
-- LIPS — Seed SQL pour Supabase
-- Collez ce fichier entier dans le SQL Editor de Supabase
-- ============================================================

-- ── 1. Régions (14 régions officielles du Sénégal, RGPH-5 2023) ──
INSERT INTO "Region" (code, nom, "nomAr", population, "mosqueCount", latitude, longitude, "createdAt", "updatedAt") VALUES
  ('DKR',  'Dakar',        'دكار',         4004425, 0, 14.7167, -17.4677, NOW(), NOW()),
  ('SLG',  'Saint-Louis',  'سان لويس',     1202438, 0, 16.0326, -16.4818, NOW(), NOW()),
  ('LGN',  'Louga',        'لوغا',         1125910, 0, 15.6167, -16.3167, NOW(), NOW()),
  ('FTK',  'Fatick',       'فاتيك',         906922, 0, 14.1167, -16.4167, NOW(), NOW()),
  ('THS',  'Thiès',        'ثيس',          2463679, 0, 14.7833, -17.1,    NOW(), NOW()),
  ('KDGN', 'Kédougou',     'كيدوغو',        245147, 0, 12.5667, -12.2167, NOW(), NOW()),
  ('KLC',  'Kolda',        'كولدا',          914797, 0, 12.9,    -14.95,   NOW(), NOW()),
  ('MTM',  'Matam',        'ماتام',          831632, 0, 13.25,   -13.25,   NOW(), NOW()),
  ('KDHL', 'Kaolack',      'كاولاك',        1336718, 0, 14.1333, -16.0833, NOW(), NOW()),
  ('TMB',  'Tambacounda',  'تامباكوندا',     987154, 0, 13.7667, -13.6667, NOW(), NOW()),
  ('ZG',   'Ziguinchor',   'زيغينكور',       617568, 0, 12.5833, -16.2667, NOW(), NOW()),
  ('SED',  'Sédhiou',      'سيدهيو',         589264, 0, 12.7,    -15.55,   NOW(), NOW()),
  ('DRL',  'Diourbel',     'ديوربل',        2080332, 0, 14.65,   -16.2333, NOW(), NOW()),
  ('KFR',  'Kaffrine',     'كفرين',          820404, 0, 14.1167, -15.55,   NOW(), NOW())
ON CONFLICT (code) DO UPDATE SET
  nom = EXCLUDED.nom, "nomAr" = EXCLUDED."nomAr",
  population = EXCLUDED.population, "updatedAt" = NOW();

-- ── 2. Mosquée démo ──────────────────────────────────────────
INSERT INTO "Mosque" (nom, adresse, "regionId") VALUES
  ('Mosquée An-Nour', 'Liberté II, Dakar', (SELECT id FROM "Region" WHERE code = 'DKR'));

-- ── 3. Utilisateur Admin ─────────────────────────────────────
-- Mot de passe Admin@2025 (bcrypt hash)
INSERT INTO "User" (matricule, email, password, nom, prenom, telephone, status, "regionId", "createdAt", "updatedAt")
VALUES (
  'LIPS-0001',
  'admin@lips.sn',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'LIPS',
  'Admin',
  '+221 77 000 00 00',
  'ACTIF',
  (SELECT id FROM "Region" WHERE code = 'DKR'),
  NOW(), NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ── 4. Bureau National ───────────────────────────────────────
INSERT INTO "BureauMember" (nom, prenom, role, "roleAr", region, bio, initiales, ordre, published, "createdAt", "updatedAt") VALUES
  ('TRAORÉ',   'Amadou',      'Président National',    'الرئيس الوطني',    'Dakar',        'Imam de la Grande Mosquée de la Médina, élu à la tête de la LIPS en 2020 pour un mandat de 5 ans.',                           'AT', 1, true, NOW(), NOW()),
  ('BALDE',    'Mouhammadou', 'Vice-Président',         'نائب الرئيس',      'Tambacounda',  'Prédicateur émérite et ancien responsable régional de Tambacounda.',                                                           'MB', 2, true, NOW(), NOW()),
  ('SOW',      'Ibrahima',    'Secrétaire Général',     'الأمين العام',     'Saint-Louis',  'Juriste en droit islamique, formé à l''Université Al-Azhar.',                                                                  'IS', 3, true, NOW(), NOW()),
  ('DIAKHATE', 'Ousmane',     'Trésorier Général',      'أمين الصندوق',     'Thiès',        'Expert en gestion financière et administration d''organisations confessionnelles.',                                            'OD', 4, true, NOW(), NOW()),
  ('MBACKÉ',   'Serigne',     'Conseiller Spirituel',   'المستشار الروحي',  'Diourbel',     'Descendant d''une lignée savante, érudit en sciences islamiques.',                                                             'SM', 5, true, NOW(), NOW()),
  ('FAYE',     'Mamadou',     'Responsable Formation',  'مسؤول التكوين',    'Kaolack',      'Docteur en études islamiques, concepteur du programme de formation continue.',                                                  'MF', 6, true, NOW(), NOW());

-- ── 5. Commissions ──────────────────────────────────────────
INSERT INTO "Commission" (nom, "nomAr", members, "desc", icon, ordre, published) VALUES
  ('Conseil du Choura',     'مجلس الشورى',      28, 'Instance suprême de délibération et de conseil',         'Crown',    1, true),
  ('Commission des Membres','لجنة العضوية',       7, 'Admissions, radiations et discipline',                   'Users',    2, true),
  ('Commission Financière', 'اللجنة المالية',     5, 'Audit, budget et transparence',                          'Building', 3, true),
  ('Commission Fatwa',      'لجنة الفتوى',       12, 'Avis juridiques et consultations religieuses',           'Award',    4, true);

-- ── 6. FAQ ───────────────────────────────────────────────────
INSERT INTO "FAQ" (question, reponse, ordre, published, "createdAt", "updatedAt") VALUES
  ('Quelles sont les conditions pour adhérer à la LIPS ?',        'Pour adhérer à la LIPS, vous devez être un imam ou prédicateur exerçant au Sénégal, être parrainé par un membre actif ou un responsable régional, et vous acquitter de la cotisation annuelle.',                                                         1, true, NOW(), NOW()),
  ('Comment obtenir la carte membre nationale ?',                  'La carte membre nationale est délivrée après validation de votre candidature et paiement de la cotisation annuelle. Elle porte un matricule unique au format LIPS-NNNN.',                                                                                   2, true, NOW(), NOW()),
  ('Quel est le montant de la cotisation annuelle ?',              'La cotisation annuelle est fixée à 5 000 FCFA pour les imams et prédicateurs, et 10 000 FCFA pour les responsables régionaux et membres du Choura.',                                                                                                        3, true, NOW(), NOW()),
  ('La LIPS est-elle reconnue par les autorités de l''État ?',    'Oui, la LIPS est reconnue comme organisation confessionnelle de référence par les autorités sénégalaises. Elle siège au Haut Conseil Islamique.',                                                                                                           4, true, NOW(), NOW()),
  ('Comment vérifier l''authenticité d''une carte membre ?',      'Chaque carte membre intègre un QR code qui, une fois scanné, redirige vers la page de vérification du site lips.sn. Vous pouvez également saisir le matricule directement.',                                                                                5, true, NOW(), NOW()),
  ('Quels types de formations la LIPS propose-t-elle ?',          'La LIPS organise des formations continues couvrant plusieurs domaines : sciences islamiques, communication, gestion communautaire, médiation et accompagnement psycho-social.',                                                                               6, true, NOW(), NOW()),
  ('Puis-je faire un don à la LIPS ?',                            'Oui, les dons sont essentiels au fonctionnement de la LIPS. Vous pouvez contribuer via notre plateforme sécurisée ou en espèces auprès de votre responsable régional.',                                                                                      7, true, NOW(), NOW());

-- ── 7. Paramètres du site ─────────────────────────────────
INSERT INTO "SiteConfig" (key, value) VALUES
  ('site_name',          'LIPS - Ligue des Imams et Prédicateurs du Sénégal'),
  ('site_description',   'Institution nationale de référence au service des imams, de la communauté et de la paix sociale.'),
  ('contact_phone',      '+221 33 800 00 00'),
  ('contact_email',      'contact@lips.sn'),
  ('contact_address',    'Grande Mosquée AN-NOUR, Liberté II, Dakar'),
  ('facebook_url',       '#'),
  ('twitter_url',        '#'),
  ('youtube_url',        '#'),
  ('hero_title',         'Ligue des Imams et Prédicateurs du Sénégal'),
  ('hero_subtitle',      'Au service des imams, de la communauté et de la paix sociale à travers les 14 régions du Sénégal.'),
  ('hero_badge',         'Institution Nationale de Référence'),
  ('hero_motto_ar',      'بِالصَّبْرِ وَالْيَقِينِ تُنَالُ الْإِمَامَةُ فِي الدِّينِ'),
  ('hero_motto_fr',      'Par la patience et la certitude, on atteint l''imamat dans la religion'),
  ('stat_members',       '0'),
  ('stat_regions',       '14'),
  ('stat_mosques',       '0'),
  ('stat_formations',    '0'),
  ('stat_annees',        '18'),
  ('stat_renouvellement','98'),
  ('cotisation_imam',    '5000'),
  ('cotisation_responsable', '10000'),
  ('don_minimum',        '1000')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ── 8. Concours ───────────────────────────────────────────
INSERT INTO "Concours" (nom, type, "dateDebut", "dateFin", lieu, description, "participantsEst", "visiblePublic", "inscriptionsOuvertes", statut, "createdAt", "updatedAt") VALUES
  ('7e Concours de Mémorisation du Saint Coran', 'CONCOURS_CORAN',       '2026-03-27', '2026-04-02', 'Dakar',     'La septième édition du concours national de mémorisation du Saint Coran.',                                         250, true,  true,  'EN_COURS',  NOW(), NOW()),
  ('2e Concours du Hadith Nabawi',               'CONCOURS_HADITH',      '2025-11-07', '2025-11-10', 'Saint-Louis','Deuxième édition du concours dédié à la connaissance des hadiths du Prophète (paix et salut sur lui).',           180, true,  false, 'TERMINE',   NOW(), NOW()),
  ('Concours Régional de Récitation — Dakar',    'CONCOURS_CORAN',       '2026-05-15', '2026-05-17', 'Dakar',     'Concours régional de récitation du Coran réservé aux imams et prédicateurs de Dakar.',                            80,  false, false, 'PLANIFIE',  NOW(), NOW()),
  ('Quiz Islamique National',                    'QUIZ_ISLAMIQUE',       '2026-06-20', '2026-06-22', 'Thiès',     'Compétition nationale de quiz sur les sciences islamiques, ouvertes à tous les membres de la LIPS.',              300, false, false, 'PLANIFIE',  NOW(), NOW()),
  ('Concours de Mémorisation — Kaolack',         'CONCOURS_MEMORISATION','2026-04-10', '2026-04-12', 'Kaolack',   'Concours régional de mémorisation du Coran et des hadiths pour la région de Kaolack.',                           120, false, false, 'PLANIFIE',  NOW(), NOW());

-- ── 9. Contenus ──────────────────────────────────────────
INSERT INTO "Content" (titre, "titreAr", contenu, type, categorie, published, "auteurId", "createdAt", "updatedAt") VALUES
  ('Communiqué : Position de la LIPS sur le dialogue interreligieux', 'بيان: موقف الرابطة حول الحوار بين الأديان',
   'La Ligue des Imams et Prédicateurs du Sénégal réaffirme son engagement en faveur du dialogue interreligieux.',
   'COMMUNIQUE', 'dialogue', true, (SELECT id FROM "User" WHERE matricule = 'LIPS-0001'), NOW(), NOW()),
  ('Fatwa : Conditions de la prière du Vendredi en voyage', 'فتوى: شروط صلاة الجمعة في السفر',
   'La Commission des Fatwas précise les conditions dans lesquelles le voyageur peut accomplir la prière du Vendredi.',
   'FATWA', 'fiqh', true, (SELECT id FROM "User" WHERE matricule = 'LIPS-0001'), NOW(), NOW()),
  ('Ramadan 2026 : Recommandations de la LIPS aux imams', 'رمضان ٢٠٢٦: توصيات الرابطة للأئمة',
   'La LIPS adresse ses recommandations aux imams du Sénégal pour l''organisation des prières de tarawih.',
   'ARTICLE', 'spiritualité', true, (SELECT id FROM "User" WHERE matricule = 'LIPS-0001'), NOW(), NOW());

-- ✅ Fin du seed — Toutes les données initiales sont insérées.
-- Compte admin : admin@lips.sn / Admin@2025
