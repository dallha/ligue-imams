'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, CheckCircle2, Printer, Download, RotateCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/lips/i18n/language-context';

// ─── QR Code SVG Generator ────────────────────────────────────────
function QrCodeSvg({ size = 80, seed = 42 }: { size?: number; seed?: number }) {
  const modules = 21;
  const cellSize = size / modules;
  const pattern: boolean[][] = [];

  for (let r = 0; r < modules; r++) {
    pattern[r] = [];
    for (let c = 0; c < modules; c++) {
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
        pattern[r][c] = ((r * seed + c * 7 + r * c) % 3) === 0;
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

// ─── Shine overlay ────────────────────────────────────────────────
function ShineOverlay() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -inset-full top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine pointer-events-none" />
    </div>
  );
}

// ─── Watermark overlay ────────────────────────────────────────────
function WatermarkOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 text-[120px] font-black tracking-[0.3em] rotate-[-30deg] select-none">
        LIPS
      </div>
      <div className="absolute top-[10%] right-[5%] text-white/3 text-[60px] font-black tracking-[0.3em] rotate-[-30deg] select-none">
        LIPS
      </div>
      <div className="absolute bottom-[10%] left-[5%] text-white/3 text-[60px] font-black tracking-[0.3em] rotate-[-30deg] select-none">
        LIPS
      </div>
    </div>
  );
}

// ─── Gold strip ───────────────────────────────────────────────────
function GoldStrip() {
  return (
    <div className="h-[3px] bg-gradient-to-r from-lips-gold/40 via-[#FFF2D8] to-lips-gold/40 shadow-[0_2px_15px_rgba(201,150,42,0.4)] relative z-10" />
  );
}

// ─── 3D Tilt Card Wrapper ─────────────────────────────────────────
function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-200 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

// ─── Membership Card Component ────────────────────────────────────
function MembershipCard({ flipped, onFlip }: { flipped: boolean; onFlip: () => void }) {
  const { p } = useLanguage();

  // Données d'aperçu réalistes mais clairement identifiées comme démo
  const previewMember = {
    prenom: 'Mamadou',
    nom: 'Sy',
    role: 'Imam',
    region: { nom: 'Dakar' },
    matricule: 'LIPS-0042',
    photo: null,
    carteMembre: {
      dateEmission: '2025-03-15',
      dateExpiration: '2026-03-14',
    },
  };

  const verifyUrl = `https://lips.sn/verifier/${previewMember.matricule}`;

  return (
    <div className="perspective-[1500px] w-full max-w-[500px] mx-auto px-2 sm:px-0">
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 15 }}
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ===== FRONT FACE ===== */}
        <div
          className="w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl shadow-[#0A2E17]/40 ring-1 ring-white/10 group"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-[#0A2E17] via-[#0D3B1F] to-[#061e0e]">
            {/* Decorative orbs */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-lips-gold/15 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px]" />
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-lips-gold/10 rounded-full blur-[60px]" />

            {/* Islamic pattern */}
            <div className="absolute inset-0 islamic-pattern opacity-[0.08] z-[1]" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.08] mix-blend-overlay z-[1]" />

            {/* Watermark */}
            <WatermarkOverlay />

            {/* Shine effect */}
            <ShineOverlay />

            {/* Top gold strip */}
            <GoldStrip />

            {/* Card header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner p-1">
                  <img src="/logo.png" alt="LIPS" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-white font-bold text-[11px] leading-tight tracking-wide drop-shadow-md">
                    {p.carteMembre.orgNameLine1}
                  </div>
                  <div className="text-lips-gold text-[9px] leading-tight font-bold uppercase tracking-widest mt-0.5">
                    {p.carteMembre.orgNameLine2}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-[11px] font-black tracking-[0.15em] uppercase">
                  {p.carteMembre.cardTitle}
                </div>
                <div className="text-white/40 text-[8px] uppercase tracking-wider font-semibold">
                  {p.carteMembre.nationalLabel}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center px-5 relative z-10">
              <div className="flex items-center gap-5 w-full bg-black/20 rounded-xl p-3 border border-white/10 backdrop-blur-sm shadow-inner">
                {/* Photo */}
                <div className="w-[76px] h-[92px] rounded-xl overflow-hidden shrink-0 border-2 border-lips-gold/30 shadow-lg shadow-black/30 relative">
                  <div className="w-full h-full bg-gradient-to-b from-white/10 to-black/40 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-lips-gold/20 flex items-center justify-center border-2 border-white/20">
                      <span className="text-lips-gold text-lg font-bold">
                        {previewMember.prenom[0]}{previewMember.nom[0]}
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2.5">
                  <div>
                    <div className="text-lips-gold/60 text-[8px] uppercase tracking-[0.15em] font-bold mb-0.5">{p.carteMembre.nameLabel}</div>
                    <div className="text-white font-black text-base leading-none truncate drop-shadow-sm">
                      {previewMember.prenom} {previewMember.nom}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <div className="text-lips-gold/60 text-[8px] uppercase tracking-[0.15em] font-bold mb-0.5">{p.carteMembre.roleLabel}</div>
                      <div className="text-white font-bold text-[11px] leading-none bg-white/10 px-2 py-1 rounded-md inline-block border border-white/5">
                        {previewMember.role}
                      </div>
                    </div>
                    <div>
                      <div className="text-lips-gold/60 text-[8px] uppercase tracking-[0.15em] font-bold mb-0.5">{p.carteMembre.regionLabel}</div>
                      <div className="text-white font-bold text-[11px] leading-none pt-1">
                        {previewMember.region.nom}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-lips-gold/60 text-[8px] uppercase tracking-[0.15em] font-bold mb-0.5">{p.carteMembre.matriculeLabel}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lips-gold font-mono font-black text-sm tracking-[0.15em] drop-shadow-[0_0_10px_rgba(201,150,42,0.4)]">
                        {previewMember.matricule}
                      </span>
                      <Sparkles className="h-3 w-3 text-lips-gold/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="px-5 pb-3 pt-1.5 flex items-end justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div>
                  <div className="text-white/30 text-[8px] uppercase font-bold tracking-wider mb-0.5">{p.carteMembre.issuedLabel}</div>
                  <div className="text-white/80 text-[10px] font-mono font-bold">15/03/2025</div>
                </div>
                <div>
                  <div className="text-white/30 text-[8px] uppercase font-bold tracking-wider mb-0.5">{p.carteMembre.expiresLabel}</div>
                  <div className="text-white text-[10px] font-mono font-bold">14/03/2026</div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-1 rounded-lg shadow-lg shadow-black/30 rotate-2 hover:rotate-0 transition-transform duration-300">
                <QrCodeSvg size={44} seed={42} />
              </div>
            </div>

            {/* Bottom gold strip */}
            <GoldStrip />

            {/* Preview badge */}
            <div className="absolute top-3 right-3 z-40">
              <Badge className="bg-lips-gold/80 text-[#0A2E17] text-[9px] font-bold px-2 py-0.5 rounded-full border border-lips-gold/50 shadow-lg backdrop-blur-sm">
                APERÇU
              </Badge>
            </div>
          </div>
        </div>

        {/* ===== BACK FACE ===== */}
        <div
          className="absolute inset-0 w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl shadow-[#0A2E17]/40 ring-1 ring-white/10 group"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-[#061e0e] via-[#0A2E17] to-[#05180C]">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.06] mix-blend-overlay" />
            <div className="absolute inset-0 islamic-pattern opacity-[0.05]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lips-gold/8 rounded-full blur-[100px]" />

            {/* Watermark */}
            <WatermarkOverlay />

            {/* Shine */}
            <ShineOverlay />

            {/* Top gold strip */}
            <GoldStrip />

            <div className="relative z-10 flex flex-col items-center justify-center px-6 h-full">
              <div className="flex-1 flex flex-col justify-center items-center w-full gap-2">
                {/* Arabic calligraphy */}
                <div className="text-center">
                  <p className="font-arabic text-lips-gold text-2xl drop-shadow-md leading-relaxed">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="font-arabic text-lips-gold/70 text-lg mt-1 drop-shadow-md">
                    بِالصَّبْرِ وَالْيَقِينِ
                  </p>
                </div>

                <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-lips-gold/30 to-transparent my-1" />

                {/* Verification section */}
                <div className="w-full bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                  <div className="text-[10px] text-white/50 uppercase tracking-[0.15em] font-bold mb-1.5">
                    {p.carteMembre.verifyText}
                  </div>
                  <div className="text-white font-mono font-bold text-[10px] bg-black/40 py-1.5 px-3 rounded-lg border border-white/5 inline-block break-all">
                    {verifyUrl}
                  </div>
                </div>

                <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-lips-gold/30 to-transparent my-1" />

                {/* Magnetic strip simulation */}
                <div className="w-full h-6 rounded bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center border border-gray-600/30">
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-400/20 to-transparent" />
                </div>

                {/* Contact */}
                <div className="text-center mt-1">
                  <div className="flex items-center justify-center gap-3 text-white/50 text-[10px] font-medium tracking-wide">
                    <span>contact@lips.sn</span>
                    <span className="text-lips-gold/40">•</span>
                    <span>www.lips.sn</span>
                  </div>
                </div>
              </div>

              {/* Legal notice */}
              <div className="pb-2 text-white/25 text-[8px] max-w-[85%] mx-auto text-center leading-relaxed">
                {p.carteMembre.legalNotice}
              </div>
            </div>

            {/* Bottom gold strip */}
            <GoldStrip />
          </div>
        </div>
      </motion.div>

      {/* Flip button */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={onFlip}
          className="bg-card text-foreground hover:bg-muted border border-border/50 shadow-lg rounded-full font-bold px-6"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          {flipped ? p.carteMembre.showFront : p.carteMembre.showBack}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────
export default function CarteMembreSection() {
  const { p } = useLanguage();
  const [flipped, setFlipped] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

  const FEATURES = [
    { title: p.carteMembre.features.uniqueId.title, desc: p.carteMembre.features.uniqueId.desc },
    { title: p.carteMembre.features.qr.title, desc: p.carteMembre.features.qr.desc },
    { title: p.carteMembre.features.hologram.title, desc: p.carteMembre.features.hologram.desc },
    { title: p.carteMembre.features.online.title, desc: p.carteMembre.features.online.desc },
  ];

  return (
    <section
      ref={sectionRef}
      id="carte-membre"
      className="py-16 sm:py-24 lg:py-32 bg-[#05180C] text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 islamic-pattern opacity-[0.02]" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Two-column layout: Info + Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Info & Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lips-gold/10 border border-lips-gold/20 mb-6">
                <span className="text-xs font-bold text-lips-gold tracking-widest uppercase">
                  {p.carteMembre.sectionTag}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                {p.carteMembre.sectionTitle}
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                {p.carteMembre.sectionDesc}
              </p>
            </div>

            <div className="space-y-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 text-lips-gold mb-6 border-b border-white/10 pb-4">
                <Shield className="h-6 w-6" />
                <h3 className="text-xl font-bold">{p.carteMembre.secureDocTitle}</h3>
              </div>
              
              {FEATURES.map((feature, index) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-lips-gold/10 flex items-center justify-center shrink-0 mt-0.5 border border-lips-gold/20">
                    <CheckCircle2 className="h-4 w-4 text-lips-gold" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-base mb-1">
                      {feature.title}
                    </div>
                    <div className="text-sm text-white/50 leading-relaxed">
                      {feature.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-lips-gold hover:bg-[#C9962A] text-[#0A2E17] font-bold rounded-full px-8 h-12 shadow-[0_0_20px_rgba(201,150,42,0.3)]">
                <Download className="h-5 w-5 mr-2" />
                {p.carteMembre.downloadModel}
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full px-8 h-12">
                <Printer className="h-5 w-5 mr-2" />
                {p.carteMembre.print}
              </Button>
            </div>
          </motion.div>

          {/* Right: The Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Glow behind card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-lips-gold/20 rounded-full blur-[100px] pointer-events-none" />
            
            <TiltCard>
              <MembershipCard flipped={flipped} onFlip={() => setFlipped(!flipped)} />
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
