'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, CheckCircle2, Printer, Download, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/lips/i18n/language-context';

// --- QR Code SVG Generator (simple matrix pattern) ---
function QrCodeSvg({ size = 80 }: { size?: number }) {
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
  const { p } = useLanguage();

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
          className="w-full aspect-[1.586/1] rounded-3xl overflow-hidden shadow-2xl shadow-[#0A2E17]/40 ring-1 ring-white/10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative w-full h-full bg-[#0D3B1F] flex flex-col overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-lips-gold/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-lips-emerald/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 islamic-pattern opacity-[0.05]" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

            {/* Top decorative strip */}
            <div className="h-1.5 bg-gradient-to-r from-lips-gold via-[#FFF2D8] to-lips-gold shadow-[0_2px_10px_rgba(201,150,42,0.5)] z-10" />

            {/* Card header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner p-1">
                  <img src="/logo.png" alt="LIPS" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-white font-bold text-[11px] sm:text-[13px] leading-tight tracking-wide drop-shadow-md">
                    {p.carteMembre.orgNameLine1}
                  </div>
                  <div className="text-lips-gold text-[9px] sm:text-[10px] leading-tight font-bold uppercase tracking-widest mt-0.5">
                    {p.carteMembre.orgNameLine2}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-[10px] sm:text-[12px] font-black tracking-widest uppercase">
                  {p.carteMembre.cardTitle}
                </div>
                <div className="text-white/50 text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold">
                  {p.carteMembre.nationalLabel}
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex items-center px-6 relative z-10">
              <div className="flex items-center gap-4 sm:gap-6 w-full bg-black/10 rounded-2xl p-3 border border-white/5 backdrop-blur-sm">
                {/* Photo */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-white/5 border border-white/20 flex flex-col items-center justify-center shrink-0 shadow-inner overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 z-10" />
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center relative z-20 mb-1">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" opacity="0.6">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="text-white/50 text-[9px] font-medium relative z-20 uppercase tracking-widest">{p.carteMembre.photo}</div>
                </div>

                {/* Member info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="text-lips-gold/70 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-0.5">{p.carteMembre.nameLabel}</div>
                    <div className="text-white font-black text-lg sm:text-xl leading-none">Mamadou SY</div>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-lips-gold/70 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-0.5">{p.carteMembre.roleLabel}</div>
                      <div className="text-white font-bold text-xs sm:text-sm leading-none bg-white/10 px-2 py-1 rounded-md inline-block">IMAM</div>
                    </div>
                    <div>
                      <div className="text-lips-gold/70 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-0.5">{p.carteMembre.regionLabel}</div>
                      <div className="text-white font-bold text-xs sm:text-sm leading-none pt-1">Dakar</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-lips-gold/70 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-0.5">{p.carteMembre.matriculeLabel}</div>
                    <div className="text-lips-gold font-mono font-black text-sm sm:text-base tracking-widest drop-shadow-[0_0_8px_rgba(201,150,42,0.5)]">
                      LIPS-0001
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="px-6 pb-4 pt-2 flex items-end justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-white/40 text-[9px] uppercase font-bold tracking-wider mb-0.5">{p.carteMembre.issuedLabel}</div>
                  <div className="text-white/90 text-[11px] font-mono font-bold">01/01/2025</div>
                </div>
                <div>
                  <div className="text-white/40 text-[9px] uppercase font-bold tracking-wider mb-0.5">{p.carteMembre.expiresLabel}</div>
                  <div className="text-white text-[11px] font-mono font-bold">31/12/2026</div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-1.5 rounded-lg shadow-lg rotate-3 hover:rotate-0 transition-transform">
                <QrCodeSvg size={48} />
              </div>
            </div>

            {/* Holographic strip overlay */}
            <div className="absolute top-0 bottom-0 right-10 w-2 bg-gradient-to-b from-transparent via-white/10 to-transparent mix-blend-overlay z-20" />
          </div>
        </div>

        {/* ===== BACK FACE ===== */}
        <div
          className="absolute inset-0 w-full aspect-[1.586/1] rounded-3xl overflow-hidden shadow-2xl shadow-[#0A2E17]/40 ring-1 ring-white/10"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="relative w-full h-full bg-[#05180C] flex flex-col items-center justify-center p-8">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
            <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />

            <div className="relative z-10 flex flex-col items-center w-full h-full justify-between">
              <p className="font-arabic text-lips-gold text-2xl drop-shadow-md">
                بِالصَّبْرِ وَالْيَقِينِ
              </p>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />

              <div className="w-full bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
                <div className="text-[11px] text-white/50 uppercase tracking-widest font-bold mb-2">
                  {p.carteMembre.verifyText}
                </div>
                <div className="text-white font-mono font-bold text-xs bg-black/30 py-2 px-3 rounded-lg border border-white/5 inline-block">
                  https://lips.sn/verifier/LIPS-0001
                </div>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />

              <div className="text-center">
                <div className="flex items-center justify-center gap-4 text-white/40 text-[10px] font-medium tracking-wide">
                  <span>+221 33 800 00 00</span>
                  <span>•</span>
                  <span>contact@lips.sn</span>
                </div>
                <div className="text-white/20 text-[9px] mt-4 max-w-[80%] mx-auto leading-relaxed">
                  {p.carteMembre.legalNotice}
                </div>
              </div>
            </div>
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

// --- Main Section ---
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
            
            <MembershipCard flipped={flipped} onFlip={() => setFlipped(!flipped)} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
