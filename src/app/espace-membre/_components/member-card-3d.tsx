'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { RotateCw, Download, Loader2, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/lips/i18n/language-context'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// ─── QR Code SVG Generator (simple matrix pattern) ───────────────
function QrCodeSvg({ size = 80, url }: { size?: number; url?: string }) {
  const modules = 21
  const cellSize = size / modules
  const pattern: boolean[][] = []

  // Use a deterministic seed based on the URL
  const seed = url ? url.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 42

  for (let r = 0; r < modules; r++) {
    pattern[r] = []
    for (let c = 0; c < modules; c++) {
      const isFinderTL = r < 7 && c < 7
      const isFinderTR = r < 7 && c >= modules - 7
      const isFinderBL = r >= modules - 7 && c < 7

      if (isFinderTL || isFinderTR || isFinderBL) {
        const lr = isFinderTR ? r : isFinderBL ? r - (modules - 7) : r
        const lc = isFinderTR ? c - (modules - 7) : isFinderBL ? c : c
        if (lr === 0 || lr === 6 || lc === 0 || lc === 6) {
          pattern[r][c] = true
        } else if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) {
          pattern[r][c] = true
        } else {
          pattern[r][c] = false
        }
      } else {
        pattern[r][c] = ((r * seed + c * 7 + r * c) % 3) === 0
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
  )
}

// ─── Date formatting ──────────────────────────────────────────────
function formatDateShort(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// ─── Shine overlay component ──────────────────────────────────────
function ShineOverlay() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -inset-full top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine pointer-events-none" />
    </div>
  )
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
  )
}

// ─── Gold decorative strip ────────────────────────────────────────
function GoldStrip() {
  return (
    <div className="h-[3px] bg-gradient-to-r from-lips-gold/40 via-[#FFF2D8] to-lips-gold/40 shadow-[0_2px_15px_rgba(201,150,42,0.4)] relative z-10" />
  )
}

// ─── Card Front ───────────────────────────────────────────────────
function CardFrontDesign({ member, p, isExport = false }: { member: any; p: any; isExport?: boolean }) {
  const card = member.carteMembre
  const exportScaleStyle = isExport ? { transform: 'scale(1)', transformOrigin: 'top left', width: '500px', height: '315px' } : {}
  const verifyUrl = `https://lips.sn/verifier/${member.matricule}`

  return (
    <div
      className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group"
      style={{ ...exportScaleStyle, backfaceVisibility: 'hidden' }}
    >
      {/* Background gradient premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2E17] via-[#0D3B1F] to-[#061e0e]" />

      {/* Decorative orbs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-lips-gold/15 rounded-full blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-lips-gold/10 rounded-full blur-[60px]" />

      {/* Islamic pattern overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-[0.08] z-[1]" />

      {/* Noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.08] mix-blend-overlay z-[1]" />

      {/* Watermark */}
      <WatermarkOverlay />

      {/* Shine effect */}
      <ShineOverlay />

      {/* Top gold strip */}
      <GoldStrip />

      {/* Content */}
      <div className="relative w-full h-full flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner p-1">
              <img src="/logo.png" alt="LIPS" className="w-full h-full object-contain" crossOrigin="anonymous" />
            </div>
            <div>
              <div className="text-white font-bold text-[11px] leading-tight tracking-wide drop-shadow-md">
                {p.espaceMembre.orgLine1}
              </div>
              <div className="text-lips-gold text-[9px] leading-tight font-bold uppercase tracking-widest mt-0.5">
                {p.espaceMembre.orgLine2}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white text-[11px] font-black tracking-[0.15em] uppercase">
              {p.espaceMembre.cardTitle}
            </div>
            <div className="text-white/40 text-[8px] uppercase tracking-wider font-semibold">
              {p.espaceMembre.nationalLabel}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center px-5">
          <div className="flex items-center gap-5 w-full bg-black/20 rounded-xl p-3 border border-white/10 backdrop-blur-sm shadow-inner">
            {/* Photo */}
            <div className="w-[76px] h-[92px] rounded-xl overflow-hidden shrink-0 border-2 border-lips-gold/30 shadow-lg shadow-black/30 relative">
              {member.photo ? (
                <img src={member.photo} alt="Photo" className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-white/10 to-black/40 flex flex-col items-center justify-center">
                  <Avatar className="w-12 h-12 rounded-full border-2 border-white/20">
                    <AvatarFallback className="bg-lips-gold/20 text-lips-gold text-lg font-bold">
                      {member.prenom[0]}{member.nom[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              {/* Photo border accent */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2.5">
              <div>
                <div className="text-lips-gold/60 text-[8px] uppercase tracking-[0.15em] font-bold mb-0.5">{p.espaceMembre.nameLabel}</div>
                <div className="text-white font-black text-base leading-none truncate drop-shadow-sm">
                  {member.prenom} {member.nom}
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <div className="text-lips-gold/60 text-[8px] uppercase tracking-[0.15em] font-bold mb-0.5">{p.espaceMembre.roleLabel}</div>
                  <div className="text-white font-bold text-[11px] leading-none bg-white/10 px-2 py-1 rounded-md inline-block border border-white/5">
                    {member.role}
                  </div>
                </div>
                <div>
                  <div className="text-lips-gold/60 text-[8px] uppercase tracking-[0.15em] font-bold mb-0.5">{p.espaceMembre.regionLabel}</div>
                  <div className="text-white font-bold text-[11px] leading-none pt-1">
                    {member.region?.nom || '—'}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-lips-gold/60 text-[8px] uppercase tracking-[0.15em] font-bold mb-0.5">{p.espaceMembre.matriculeLabel2}</div>
                <div className="flex items-center gap-2">
                  <span className="text-lips-gold font-mono font-black text-sm tracking-[0.15em] drop-shadow-[0_0_10px_rgba(201,150,42,0.4)]">
                    {member.matricule}
                  </span>
                  <Sparkles className="h-3 w-3 text-lips-gold/60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="px-5 pb-3 pt-1.5 flex items-end justify-between">
          <div className="flex items-center gap-5">
            <div>
              <div className="text-white/30 text-[8px] uppercase font-bold tracking-wider mb-0.5">{p.espaceMembre.issuedLabel}</div>
              <div className="text-white/80 text-[10px] font-mono font-bold">
                {card ? formatDateShort(card.dateEmission) : '—'}
              </div>
            </div>
            <div>
              <div className="text-white/30 text-[8px] uppercase font-bold tracking-wider mb-0.5">{p.espaceMembre.expiresLabel}</div>
              <div className="text-white text-[10px] font-mono font-bold">
                {card ? formatDateShort(card.dateExpiration) : '—'}
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-1 rounded-lg shadow-lg shadow-black/30 rotate-2 hover:rotate-0 transition-transform duration-300">
            <QrCodeSvg size={44} url={verifyUrl} />
          </div>
        </div>

        {/* Bottom gold strip */}
        <GoldStrip />
      </div>
    </div>
  )
}

// ─── Card Back ────────────────────────────────────────────────────
function CardBackDesign({ member, p, isExport = false }: { member: any; p: any; isExport?: boolean }) {
  const exportScaleStyle = isExport ? { transform: 'scale(1)', transformOrigin: 'top left', width: '500px', height: '315px' } : {}
  const verifyUrl = `https://lips.sn/verifier/${member.matricule}`

  return (
    <div
      className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group"
      style={{ ...exportScaleStyle, backfaceVisibility: 'hidden', transform: isExport ? 'none' : 'rotateY(180deg)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#061e0e] via-[#0A2E17] to-[#05180C]" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.06] mix-blend-overlay" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.05]" />

      {/* Decorative orbs */}
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
              {p.espaceMembre.verifyText}
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
          {p.espaceMembre.legalNotice}
        </div>
      </div>

      {/* Bottom gold strip */}
      <GoldStrip />
    </div>
  )
}

// ─── 3D Tilt Card Wrapper ─────────────────────────────────────────
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────
export function MemberCard3D({ member }: { member: any }) {
  const { p } = useLanguage()
  const [flipped, setFlipped] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const exportContainerRef = useRef<HTMLDivElement>(null)

  const handleExportPDF = async () => {
    if (!exportContainerRef.current) return
    try {
      setIsExporting(true)

      const canvas = await html2canvas(exportContainerRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const margin = 20
      const cardWidth = pdfWidth - margin * 2
      const cardHeight = cardWidth / 1.586

      const totalCanvasHeight = canvas.height
      const singleCardCanvasHeight = totalCanvasHeight / 2

      // Crop Front
      const canvasFront = document.createElement('canvas')
      canvasFront.width = canvas.width
      canvasFront.height = singleCardCanvasHeight
      const ctxFront = canvasFront.getContext('2d')
      ctxFront?.drawImage(canvas, 0, 0, canvas.width, singleCardCanvasHeight, 0, 0, canvas.width, singleCardCanvasHeight)

      // Crop Back
      const canvasBack = document.createElement('canvas')
      canvasBack.width = canvas.width
      canvasBack.height = singleCardCanvasHeight
      const ctxBack = canvasBack.getContext('2d')
      ctxBack?.drawImage(canvas, 0, singleCardCanvasHeight, canvas.width, singleCardCanvasHeight, 0, 0, canvas.width, singleCardCanvasHeight)

      const imgFront = canvasFront.toDataURL('image/png')
      const imgBack = canvasBack.toDataURL('image/png')

      pdf.text("Carte de Membre - LIPS", pdfWidth / 2, 20, { align: 'center' })
      pdf.addImage(imgFront, 'PNG', margin, 35, cardWidth, cardHeight)
      pdf.addImage(imgBack, 'PNG', margin, 35 + cardHeight + 15, cardWidth, cardHeight)

      pdf.save(`carte-membre-${member.matricule}.pdf`)
    } catch (e) {
      console.error('Failed to export PDF', e)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="perspective-[1500px] w-full max-w-[500px] mx-auto">
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 15 }}
          className="relative w-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT */}
          <TiltCard>
            <CardFrontDesign member={member} p={p} />
          </TiltCard>

          {/* BACK */}
          <div className="absolute inset-0">
            <TiltCard>
              <CardBackDesign member={member} p={p} />
            </TiltCard>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => setFlipped(!flipped)}
          className="rounded-full border-lips-green/20 text-lips-green hover:bg-lips-green/5"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          {flipped ? p.espaceMembre.cardFront : p.espaceMembre.cardBack}
        </Button>
        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="rounded-full bg-lips-gold hover:bg-[#C9962A] text-[#0A2E17] font-bold shadow-md"
        >
          {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          Exporter en PDF
        </Button>
      </div>

      {/* Hidden container for PDF export */}
      <div className="fixed top-[-10000px] left-[-10000px] pointer-events-none">
        <div ref={exportContainerRef} className="flex flex-col gap-8 p-12 bg-white" style={{ width: '600px' }}>
          <CardFrontDesign member={member} p={p} isExport={true} />
          <CardBackDesign member={member} p={p} isExport={true} />
        </div>
      </div>
    </div>
  )
}
