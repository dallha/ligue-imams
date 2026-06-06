'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, CheckCircle2, Printer, Download, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// --- QR Code SVG Generator (simple matrix pattern) ---
function QrCodeSvg({ size = 80 }: { size?: number }) {
  // Generate a deterministic pattern that looks like a QR code
  const modules = 21;
  const cellSize = size / modules;

  const pattern: boolean[][] = [];
  for (let r = 0; r < modules; r++) {
    pattern[r] = [];
    for (let c = 0; c < modules; c++) {
      // Finder patterns (3 corners)
      const isFinderTL = r < 7 && c < 7;
      const isFinderTR = r < 7 && c >= modules - 7;
      const isFinderBL = r >= modules - 7 && c < 7;

      if (isFinderTL || isFinderTR || isFinderBL) {
        const lr = isFinderTR ? r : isFinderBL ? r - (modules - 7) : r;
        const lc = isFinderTR ? c - (modules - 7) : isFinderBL ? c : c;
        if (lr === 0 || lr === 6 || lc === 0 || lc === 6) {
          pattern[r][c] = true;
        } else if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) {
          pattern[r][c] = true;
        } else {
          pattern[r][c] = false;
        }
      } else {
        // Data area — deterministic pseudo-random
        pattern[r][c] = ((r * 13 + c * 7 + r * c) % 3) === 0;
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx={2} />
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#0D3B1F"
            />
          ) : null
        )
      )}
    </svg>
  );
}

// --- Membership Card Component ---
function MembershipCard({ flipped, onFlip }: { flipped: boolean; onFlip: () => void }) {
  return (
    <div className="perspective-[1200px] w-full max-w-[480px] mx-auto px-2 sm:px-0" style={{ perspective: '1200px' }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ===== FRONT FACE ===== */}
        <div
          className="w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl shadow-lips-green-dark/30"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-lips-green-dark via-lips-green to-lips-emerald flex flex-col">
            {/* Top decorative strip */}
            <div className="h-1.5 bg-gradient-to-r from-lips-gold via-lips-gold-light to-lips-gold" />

            {/* Card header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-2.5">
                {/* Logo */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 overflow-hidden p-0.5">
                  <img src="/logo.png" alt="LIPS" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-white font-semibold text-[10px] sm:text-[11px] leading-tight">
                    LIGUE DES IMAMS ET
                  </div>
                  <div className="text-white/70 text-[8px] sm:text-[9px] leading-tight">
                    PRÉDICATEURS DU SÉNÉGAL
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lips-gold text-[9px] sm:text-[10px] font-semibold tracking-wider">
                  CARTE MEMBRE
                </div>
                <div className="text-lips-gold/60 text-[8px] sm:text-[9px]">
                  NATIONALE
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex items-center px-5 pb-2">
              <div className="flex items-center gap-2 sm:gap-4 w-full">
                {/* Photo placeholder */}
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-white/10 border-2 border-white/20 flex flex-col items-center justify-center shrink-0 overflow-hidden">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" opacity="0.4">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="text-white/30 text-[8px] sm:text-[9px] mt-0.5">PHOTO</div>
                </div>

                {/* Member info */}
                <div className="flex-1 space-y-1.5">
                  <div>
                    <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider">Nom</div>
                    <div className="text-white font-bold text-sm sm:text-base leading-tight">Mamadou SY</div>
                  </div>
                  <div className="flex gap-3 sm:gap-4">
                    <div>
                      <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider">Rôle</div>
                      <div className="text-lips-gold font-semibold text-[10px] sm:text-[11px] leading-tight">IMAM</div>
                    </div>
                    <div>
                      <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider">Région</div>
                      <div className="text-white font-semibold text-[10px] sm:text-[11px] leading-tight">Dakar</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider">Matricule</div>
                    <div className="text-white font-mono font-bold text-xs sm:text-sm tracking-wide">
                      LIPS-2025-DKR-000124
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="px-5 pb-3 pt-1 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-white/40 text-[8px] sm:text-[9px]">Émis le</div>
                  <div className="text-white/80 text-[10px] sm:text-[11px] font-medium">01/01/2025</div>
                </div>
                <div>
                  <div className="text-white/40 text-[8px] sm:text-[9px]">Expire le</div>
                  <div className="text-lips-gold text-[10px] sm:text-[11px] font-bold">31/12/2026</div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-1 rounded-md">
                <QrCodeSvg size={44} />
              </div>
            </div>

            {/* Bottom gold line */}
            <div className="h-1 bg-gradient-to-r from-lips-gold via-lips-gold-light to-lips-gold" />
          </div>
        </div>

        {/* ===== BACK FACE ===== */}
        <div
          className="absolute inset-0 w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl shadow-lips-green-dark/30"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-lips-green-dark via-lips-green to-lips-emerald flex flex-col">
            {/* Top decorative strip */}
            <div className="h-1.5 bg-gradient-to-r from-lips-gold via-lips-gold-light to-lips-gold" />

            {/* Back content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {/* Arabic motto */}
              <p className="font-arabic text-lips-gold text-lg mb-2">
                بِالصَّبْرِ وَالْيَقِينِ
              </p>

              {/* Institution name */}
              <div className="text-white font-bold text-xs text-center mb-1">
                LIGUE DES IMAMS ET PRÉDICATEURS DU SÉNÉGAL
              </div>
              <div className="text-white/50 text-[10px] sm:text-[11px] text-center mb-4">
                Institution Nationale de Référence
              </div>

              {/* Verification info */}
              <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10 mb-3">
                <div className="text-center text-[10px] sm:text-[11px] text-white/60 mb-1">
                  Vérifiez la validité de cette carte
                </div>
                <div className="text-center text-white font-mono text-[10px] sm:text-xs">
                  https://lips.sn/verifier/LIPS-2025-DKR-000124
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-4 text-white/40 text-[9px] sm:text-[10px]">
                <span>+221 33 800 00 00</span>
                <span>•</span>
                <span>contact@lips.sn</span>
              </div>
            </div>

            {/* Legal notice */}
            <div className="px-5 pb-3">
              <div className="text-white/30 text-[8px] sm:text-[9px] text-center leading-relaxed">
                Cette carte est la propriété de la LIPS. Toute falsification ou utilisation non autorisée
                est passible de poursuites. En cas de perte, contactez immédiatement le secrétariat général.
              </div>
            </div>

            {/* Bottom gold line */}
            <div className="h-1 bg-gradient-to-r from-lips-gold via-lips-gold-light to-lips-gold" />
          </div>
        </div>
      </motion.div>

      {/* Flip button */}
      <div className="flex justify-center mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onFlip}
          className="text-lips-green hover:text-lips-green-dark hover:bg-lips-green/5"
        >
          <RotateCw className="h-3.5 w-3.5 mr-1.5" />
          {flipped ? 'Voir le recto' : 'Voir le verso'}
        </Button>
      </div>
    </div>
  );
}

// --- Main Section ---
export default function CarteMembreSection() {
  const [matricule, setMatricule] = useState('LIPS-2025-DKR-000124');
  const [flipped, setFlipped] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="carte-membre"
      className="py-12 sm:py-20 lg:py-28 bg-lips-cream relative overflow-hidden"
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-lips-gold tracking-widest uppercase">
            Carte Membre
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lips-green-dark mt-3 mb-4">
            La Carte Membre Nationale
          </h2>
          <div className="separator-islamic text-lips-gold text-2xl my-4">
            &#10022;
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            La Carte Membre LIPS est le document officiel d&apos;identification
            de tout membre de la Ligue. Dotée d&apos;un QR code de vérification
            et d&apos;un matricule national unique, elle garantit l&apos;authenticité
            et la traçabilité de chaque membre à travers les 14 régions.
          </p>
        </motion.div>

        {/* Two-column layout: Card + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: The Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MembershipCard flipped={flipped} onFlip={() => setFlipped(!flipped)} />
          </motion.div>

          {/* Right: Card Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Security badge */}
            <div className="flex items-center gap-2 text-lips-green">
              <Shield className="h-5 w-5" />
              <span className="font-semibold text-sm">Document Sécurisé</span>
              <Badge className="bg-lips-green/10 text-lips-green text-xs">
                QR Code
              </Badge>
            </div>

            <h3 className="text-2xl font-bold text-lips-green-dark">
              Un document d&apos;identification infalsifiable
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Chaque carte membre est dotée d&apos;un matricule national unique au format
              LIPS-ANNÉE-RÉGION-NUMÉRO, permettant une identification précise et une
              vérification instantanée via le QR code intégré. Le système garantit
              la traçabilité complète du parcours de chaque membre au sein de l&apos;institution.
            </p>

            {/* Features list */}
            <div className="space-y-4">
              {[
                {
                  title: 'Matricule National Unique',
                  desc: 'Format LIPS-2025-DKR-000124 — Identifie la région, l\'année d\'adhésion et le numéro séquentiel du membre.',
                },
                {
                  title: 'QR Code de Vérification',
                  desc: 'Scannez le QR code pour vérifier instantanément la validité de la carte via le portail lips.sn.',
                },
                {
                  title: 'Validité Annuelle',
                  desc: 'La carte est valable du 1er janvier au 31 décembre. Le renouvellement annuel confirme le statut ACTIF.',
                },
                {
                  title: 'Sécurité Anti-Falsification',
                  desc: 'Gradient de sécurité, micro-texte et correspondance base de données nationale.',
                },
                {
                  title: 'Couverture 14 Régions',
                  desc: 'Chaque région dispose de son code officiel (DKR, SLG, THS...) intégré au matricule.',
                },
              ].map((feature, index) => (
                <div key={feature.title} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-lips-green/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-lips-green" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-lips-green-dark">
                      {feature.title}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button className="bg-lips-green hover:bg-lips-green-dark text-white">
                <Download className="h-4 w-4 mr-2" />
                Télécharger le Modèle
              </Button>
              <Button variant="outline" className="border-lips-green/30 text-lips-green hover:bg-lips-green/5">
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
