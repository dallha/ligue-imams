'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Shield,
  CreditCard,
  CalendarDays,
  BookOpen,
  Heart,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Pencil,
  ChevronRight,
} from 'lucide-react'
import { useLanguage } from '@/lib/lips/i18n/language-context'

// --- QR Code SVG Generator ---
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

// --- Types ---
interface MemberProfile {
  id: number
  email: string
  nom: string
  prenom: string
  role: string
  matricule: string
  status: string
  telephone: string
  photo: string | null
  region: { nom: string; nomAr: string | null } | null
  mosque: { nom: string; adresse: string } | null
  carteMembre: {
    numeroCarte: string
    dateEmission: string
    dateExpiration: string
  } | null
  paiements: Array<{
    id: number
    montant: number
    type: string
    methode: string
    datePaiement: string
    referenceTrans: string
  }>
  communications: Array<{
    id: number
    titre: string
    type: string
    date: string
  }>
}

// --- Status Badge ---
function StatusBadge({ status }: { status: string }) {
  const { p } = useLanguage()
  switch (status) {
    case 'ACTIF':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {p.espaceMembre.statusActive}
        </Badge>
      )
    case 'EXPIRE':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          {p.espaceMembre.statusExpired}
        </Badge>
      )
    case 'EN_ATTENTE':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          {p.espaceMembre.statusPending}
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// --- Role Label ---
function RoleBadge({ role }: { role: string }) {
  const { p } = useLanguage()
  const roleMap: Record<string, { label: string; color: string }> = {
    IMAM: { label: p.espaceMembre.roleImam, color: 'bg-lips-green/10 text-lips-green border-lips-green/20' },
    PREDICATEUR: { label: p.espaceMembre.rolePreacher, color: 'bg-lips-emerald/10 text-lips-emerald border-lips-emerald/20' },
    RESPONSABLE_REGIONAL: { label: p.espaceMembre.roleRegionalHead, color: 'bg-lips-gold/10 text-lips-gold border-lips-gold/20' },
    MEMBRE_CHOURA: { label: p.espaceMembre.roleShura, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  }
  const info = roleMap[role] || { label: role, color: 'bg-gray-100 text-gray-700 border-gray-200' }
  return (
    <Badge className={`${info.color} hover:${info.color}`}>
      {info.label}
    </Badge>
  )
}

// --- Format currency ---
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + currency
}

// --- Format date ---
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
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

// --- Communication type badge ---
function CommTypeBadge({ type }: { type: string }) {
  const { p } = useLanguage()
  switch (type) {
    case 'COMMUNIQUE':
      return <Badge className="bg-lips-green/10 text-lips-green border-lips-green/20 text-xs">{p.espaceMembre.commCommunique}</Badge>
    case 'FATWA':
      return <Badge className="bg-lips-gold/10 text-lips-gold border-lips-gold/20 text-xs">{p.espaceMembre.commFatwa}</Badge>
    case 'EVENEMENT':
      return <Badge className="bg-lips-emerald/10 text-lips-emerald border-lips-emerald/20 text-xs">{p.espaceMembre.commEvent}</Badge>
    default:
      return <Badge variant="secondary" className="text-xs">{type}</Badge>
  }
}

// --- 3D Membership Card ---
function MemberCard3D({ member }: { member: MemberProfile }) {
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

// --- Quick Link Card ---
function QuickLinkCard({ icon: Icon, title, description, href, color }: {
  icon: React.ElementType
  title: string
  description: string
  href: string
  color: string
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card className="h-full hover:shadow-md transition-shadow border-lips-green/5 cursor-pointer">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-sm text-lips-green-dark">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

// --- Main Dashboard ---
export default function EspaceMembreDashboard() {
  const { p } = useLanguage()
  const [member, setMember] = useState<MemberProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    fetch('/api/membre/me')
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Not authenticated')
      })
      .then(data => setMember(data.user))
      .catch(() => {
        // Will be redirected by layout
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || !member) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-lips-green/30 border-t-lips-green rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">{p.espaceMembre.loading}</p>
        </div>
      </div>
    )
  }

  const totalCotisations = member.paiements
    .filter(pay => pay.type === 'COTISATION')
    .reduce((sum, pay) => sum + pay.montant, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* A. Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-lips-green-dark to-lips-green rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 islamic-pattern opacity-5" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-white/20 shrink-0">
            <AvatarFallback className="bg-white/10 text-white text-xl font-bold">
              {member.prenom[0]}{member.nom[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">
              {p.espaceMembre.greeting}, {member.prenom} {member.nom}!
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <RoleBadge role={member.role} />
              <StatusBadge status={member.status} />
              {member.region && (
                <span className="text-white/60 text-sm flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {member.region.nom}
                  {member.region.nomAr && (
                    <span className="font-arabic text-lips-gold/70">({member.region.nomAr})</span>
                  )}
                </span>
              )}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-white/50 text-xs">{p.espaceMembre.matriculeLabel}</div>
            <div className="font-mono font-bold text-lips-gold text-sm">{member.matricule}</div>
          </div>
        </div>
      </motion.div>

      {/* B. Member Card + C. Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* B. Card Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          id="carte"
        >
          <Card className="border-lips-green/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-lips-green-dark flex items-center gap-2">
                    <Shield className="h-5 w-5 text-lips-green" />
                    {p.espaceMembre.myCard}
                  </CardTitle>
                  <CardDescription>{p.espaceMembre.cardDesc}</CardDescription>
                </div>
                <Badge className="bg-lips-green/10 text-lips-green border-lips-green/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {p.espaceMembre.validLabel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <MemberCard3D member={member} />
            </CardContent>
          </Card>
        </motion.div>

        {/* C. Profile Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          id="profil"
        >
          <Card className="border-lips-green/10 h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-lips-green-dark flex items-center gap-2">
                    <svg className="h-5 w-5 text-lips-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {p.espaceMembre.profileTitle}
                  </CardTitle>
                  <CardDescription>{p.espaceMembre.profileDesc}</CardDescription>
                </div>
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-lips-green hover:text-lips-green-dark hover:bg-lips-green/5">
                      <Pencil className="h-4 w-4 mr-1.5" />
                      {p.espaceMembre.editBtn}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{p.espaceMembre.editProfile}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-prenom">{p.espaceMembre.firstName}</Label>
                          <Input id="edit-prenom" defaultValue={member.prenom} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-nom">{p.espaceMembre.lastName}</Label>
                          <Input id="edit-nom" defaultValue={member.nom} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-email">{p.espaceMembre.email}</Label>
                        <Input id="edit-email" type="email" defaultValue={member.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-tel">{p.espaceMembre.phone}</Label>
                        <Input id="edit-tel" defaultValue={member.telephone} />
                      </div>
                      <Button
                        className="w-full bg-lips-green hover:bg-lips-green-dark text-white"
                        onClick={() => setEditOpen(false)}
                      >
                        {p.espaceMembre.saveChanges}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Matricule */}
              <div className="bg-lips-green/5 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">{p.espaceMembre.nationalMatricule}</div>
                  <div className="font-mono font-bold text-lips-green-dark">{member.matricule}</div>
                </div>
                <StatusBadge status={member.status} />
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">{p.espaceMembre.lastName}</div>
                  <div className="text-sm font-medium">{member.nom}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{p.espaceMembre.firstName}</div>
                  <div className="text-sm font-medium">{member.prenom}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{p.espaceMembre.email}</div>
                  <div className="text-sm font-medium truncate">{member.email}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{p.espaceMembre.phone}</div>
                  <div className="text-sm font-medium">{member.telephone}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{p.espaceMembre.region}</div>
                  <div className="text-sm font-medium">{member.region?.nom || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{p.espaceMembre.mosque}</div>
                  <div className="text-sm font-medium truncate">{member.mosque?.nom || '—'}</div>
                </div>
              </div>

              {member.mosque && (
                <div className="text-xs text-muted-foreground">
                  <svg className="h-3 w-3 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {member.mosque.adresse}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* D. Cotisations & Paiements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        id="cotisations"
      >
        <Card className="border-lips-green/10">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg text-lips-green-dark flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-lips-green" />
                  {p.espaceMembre.paymentsTitle}
                </CardTitle>
                <CardDescription>{p.espaceMembre.paymentsDesc}</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{p.espaceMembre.totalContributions}</div>
                  <div className="text-lg font-bold text-lips-green">{formatCurrency(totalCotisations, p.espaceMembre.currency)}</div>
                </div>
                <Button asChild size="sm" className="bg-lips-green hover:bg-lips-green-dark text-white">
                  <Link href="/faire-un-don">
                    <Heart className="h-4 w-4 mr-1.5" />
                    {p.espaceMembre.payContribution}
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-lips-green/5">
                      <th className="text-left p-3 font-medium text-muted-foreground">{p.espaceMembre.tableType}</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">{p.espaceMembre.tableAmount}</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">{p.espaceMembre.tableDate}</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">{p.espaceMembre.tableMethod}</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">{p.espaceMembre.tableReference}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {member.paiements.map((pay) => (
                      <tr key={pay.id} className="border-t hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <Badge
                            className={
                              pay.type === 'COTISATION'
                                ? 'bg-lips-green/10 text-lips-green border-lips-green/20'
                                : pay.type === 'DON'
                                ? 'bg-lips-gold/10 text-lips-gold border-lips-gold/20'
                                : 'bg-amber-100 text-amber-700 border-amber-200'
                            }
                          >
                            {pay.type}
                          </Badge>
                        </td>
                        <td className="p-3 font-medium">{formatCurrency(pay.montant, p.espaceMembre.currency)}</td>
                        <td className="p-3 text-muted-foreground">{formatDate(pay.datePaiement)}</td>
                        <td className="p-3">{pay.methode}</td>
                        <td className="p-3 font-mono text-xs text-muted-foreground">{pay.referenceTrans}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3 max-h-96 overflow-y-auto">
              {member.paiements.map((pay) => (
                <div key={pay.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        pay.type === 'COTISATION'
                          ? 'bg-lips-green/10 text-lips-green border-lips-green/20'
                          : pay.type === 'DON'
                          ? 'bg-lips-gold/10 text-lips-gold border-lips-gold/20'
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                      }
                    >
                      {pay.type}
                    </Badge>
                    <span className="font-bold text-lips-green-dark">{formatCurrency(pay.montant, p.espaceMembre.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(pay.datePaiement)}</span>
                    <span>{pay.methode}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{pay.referenceTrans}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* E. Quick Links Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h2 className="text-lg font-bold text-lips-green-dark mb-4 flex items-center gap-2">
          <ChevronRight className="h-5 w-5 text-lips-green" />
          {p.espaceMembre.quickLinks}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickLinkCard
            icon={Shield}
            title={p.espaceMembre.verifyCard}
            description={p.espaceMembre.qrVerification}
            href="/verifier-carte"
            color="bg-lips-green/10 text-lips-green"
          />
          <QuickLinkCard
            icon={CalendarDays}
            title={p.espaceMembre.lipsCalendar}
            description={p.espaceMembre.agendaEvents}
            href="/agenda"
            color="bg-lips-gold/10 text-lips-gold"
          />
          <QuickLinkCard
            icon={BookOpen}
            title={p.espaceMembre.holyQuran}
            description={p.espaceMembre.readListen}
            href="/coran"
            color="bg-lips-emerald/10 text-lips-emerald"
          />
          <QuickLinkCard
            icon={Heart}
            title={p.espaceMembre.makeDonation}
            description={p.espaceMembre.supportLips}
            href="/faire-un-don"
            color="bg-rose-50 text-rose-600"
          />
        </div>
      </motion.div>

      {/* F. Recent Communications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="border-lips-green/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-lips-green-dark flex items-center gap-2">
                  <FileText className="h-5 w-5 text-lips-green" />
                  {p.espaceMembre.communicationsTitle}
                </CardTitle>
                <CardDescription>{p.espaceMembre.communicationsDesc}</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-lips-green hover:text-lips-green-dark">
                <Link href="/actualites">
                  {p.espaceMembre.seeAll}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {member.communications && member.communications.length > 0 ? (
                member.communications.map((comm) => (
                  <div
                    key={comm.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-lips-green/10"
                  >
                    <div className="w-9 h-9 rounded-lg bg-lips-green/5 flex items-center justify-center shrink-0 mt-0.5">
                      {comm.type === 'FATWA' ? (
                        <BookOpen className="h-4 w-4 text-lips-gold" />
                      ) : comm.type === 'EVENEMENT' ? (
                        <CalendarDays className="h-4 w-4 text-lips-emerald" />
                      ) : (
                        <FileText className="h-4 w-4 text-lips-green" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-lips-green-dark truncate">
                        {comm.titre}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <CommTypeBadge type={comm.type} />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comm.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  {p.espaceMembre.noCommunications}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer Spacer */}
      <div className="h-8" />
    </div>
  )
}
