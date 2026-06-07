import { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'
import { useLanguage } from '@/lib/lips/i18n/language-context'

function QrCodeSvg({ size = 80 }: { size?: number }) {
  const modules = 21
  const cellSize = size / modules
  const pattern: boolean[][] = []
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
        pattern[r][c] = ((r * 13 + c * 7 + r * c) % 3) === 0
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

export function MemberCard3D({ member }: { member: any }) {
  const { p } = useLanguage()
  const [flipped, setFlipped] = useState(false)
  const card = member.carteMembre

  return (
    <div className="perspective-[1200px] w-full max-w-[480px] mx-auto" style={{ perspective: '1200px' }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT */}
        <div
          className="w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl shadow-lips-green-dark/30"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-lips-green-dark via-lips-green to-lips-emerald flex flex-col">
            <div className="h-1.5 bg-gradient-to-r from-lips-gold via-lips-gold-light to-lips-gold" />
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 overflow-hidden p-0.5">
                  <img src="/logo.png" alt="LIPS" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-white font-semibold text-[10px] sm:text-[11px] leading-tight">
                    {p.espaceMembre.orgLine1}
                  </div>
                  <div className="text-white/70 text-[8px] sm:text-[9px] leading-tight">
                    {p.espaceMembre.orgLine2}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lips-gold text-[9px] sm:text-[10px] font-semibold tracking-wider">
                  {p.espaceMembre.cardTitle}
                </div>
                <div className="text-lips-gold/60 text-[8px] sm:text-[9px]">{p.espaceMembre.nationalLabel}</div>
              </div>
            </div>
            <div className="flex-1 flex items-center px-5 pb-2">
              <div className="flex items-center gap-2 sm:gap-4 w-full">
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-white/10 border-2 border-white/20 flex flex-col items-center justify-center shrink-0">
                  {member.photo ? (
                    <img src={member.photo} alt="Photo" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                      <AvatarFallback className="bg-white/10 text-white text-lg">
                        {member.prenom[0]}{member.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div>
                    <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider">{p.espaceMembre.nameLabel}</div>
                    <div className="text-white font-bold text-sm sm:text-base leading-tight">
                      {member.prenom} {member.nom}
                    </div>
                  </div>
                  <div className="flex gap-3 sm:gap-4">
                    <div>
                      <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider">{p.espaceMembre.roleLabel}</div>
                      <div className="text-lips-gold font-semibold text-[10px] sm:text-[11px] leading-tight">
                        {member.role}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider">{p.espaceMembre.regionLabel}</div>
                      <div className="text-white font-semibold text-[10px] sm:text-[11px] leading-tight">
                        {member.region?.nom || '—'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider">{p.espaceMembre.matriculeLabel2}</div>
                    <div className="text-white font-mono font-bold text-xs sm:text-sm tracking-wide">
                      {member.matricule}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 pb-3 pt-1 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-white/40 text-[8px] sm:text-[9px]">{p.espaceMembre.issuedLabel}</div>
                  <div className="text-white/80 text-[10px] sm:text-[11px] font-medium">
                    {card ? formatDateShort(card.dateEmission) : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-white/40 text-[8px] sm:text-[9px]">{p.espaceMembre.expiresLabel}</div>
                  <div className="text-lips-gold text-[10px] sm:text-[11px] font-bold">
                    {card ? formatDateShort(card.dateExpiration) : '—'}
                  </div>
                </div>
              </div>
              <div className="bg-white p-1 rounded-md">
                <QrCodeSvg size={44} />
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-lips-gold via-lips-gold-light to-lips-gold" />
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl shadow-lips-green-dark/30"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-lips-green-dark via-lips-green to-lips-emerald flex flex-col">
            <div className="h-1.5 bg-gradient-to-r from-lips-gold via-lips-gold-light to-lips-gold" />
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <p className="font-arabic text-lips-gold text-lg mb-2">
                بِالصَّبْرِ وَالْيَقِينِ
              </p>
              <div className="text-white font-bold text-xs text-center mb-1">
                {p.espaceMembre.orgLine1} {p.espaceMembre.orgLine2}
              </div>
              <div className="text-white/50 text-[10px] sm:text-[11px] text-center mb-4">
                {p.espaceMembre.institutionLabel}
              </div>
              <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10 mb-3">
                <div className="text-center text-[10px] sm:text-[11px] text-white/60 mb-1">
                  {p.espaceMembre.verifyText}
                </div>
                <div className="text-center text-white font-mono text-[10px] sm:text-xs">
                  https://lips.sn/verifier/{member.matricule}
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/40 text-[9px] sm:text-[10px]">
                <span>+221 33 800 00 00</span>
                <span>•</span>
                <span>contact@lips.sn</span>
              </div>
            </div>
            <div className="px-5 pb-3">
              <div className="text-white/30 text-[8px] sm:text-[9px] text-center leading-relaxed">
                {p.espaceMembre.legalNotice}
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-lips-gold via-lips-gold-light to-lips-gold" />
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFlipped(!flipped)}
          className="text-lips-green hover:text-lips-green-dark hover:bg-lips-green/5"
        >
          <RotateCw className="h-3.5 w-3.5 mr-1.5" />
          {flipped ? p.espaceMembre.cardFront : p.espaceMembre.cardBack}
        </Button>
      </div>
    </div>
  )
}
