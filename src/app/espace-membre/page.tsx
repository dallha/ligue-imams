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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  CalendarDays,
  BookOpen,
  Heart,
  FileText,
  Pencil,
  ChevronRight,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

import { useLanguage } from '@/lib/lips/i18n/language-context'

// Nouveaux imports extraits (Refactoring)
import { StatusBadge, RoleBadge, CommTypeBadge } from './_components/member-badges'
import { MemberCard3D } from './_components/member-card-3d'
import { PaymentsTable } from './_components/payments-table'
import { QuickLinkCard } from './_components/quick-links'

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

export default function EspaceMembreDashboard() {
  const { p } = useLanguage()
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({ current: '', newPassword: '', confirm: '' })
  const [showPasswordFields, setShowPasswordFields] = useState({ current: false, new: false, confirm: false })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')


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
                <StatusBadge status="ACTIF" />
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
                <div className="flex items-center gap-2">
                  <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-lips-green hover:text-lips-green-dark hover:bg-lips-green/5">
                        <Lock className="h-4 w-4 mr-1.5" />
                        Mot de passe
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Changer le mot de passe</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {passwordError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{passwordError}</p>
                          </div>
                        )}
                        {passwordSuccess && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-green-700">{passwordSuccess}</p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Mot de passe actuel</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showPasswordFields.current ? 'text' : 'password'}
                              value={passwordData.current}
                              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                              placeholder="Votre mot de passe actuel"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswordFields({ ...showPasswordFields, current: !showPasswordFields.current })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPasswordFields.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nouveau mot de passe</Label>
                          <div className="relative">
                            <Input
                              id="new-password"
                              type={showPasswordFields.new ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              placeholder="Au moins 8 caractères"
                              minLength={8}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswordFields({ ...showPasswordFields, new: !showPasswordFields.new })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPasswordFields.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showPasswordFields.confirm ? 'text' : 'password'}
                              value={passwordData.confirm}
                              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                              placeholder="Répétez le nouveau mot de passe"
                              minLength={8}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswordFields({ ...showPasswordFields, confirm: !showPasswordFields.confirm })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPasswordFields.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <Button
                          className="w-full bg-lips-green hover:bg-lips-green-dark text-white"
                          disabled={passwordLoading}
                          onClick={async () => {
                            setPasswordError('');
                            setPasswordSuccess('');

                            if (!passwordData.current || !passwordData.newPassword || !passwordData.confirm) {
                              setPasswordError('Tous les champs sont requis');
                              return;
                            }

                            if (passwordData.newPassword.length < 8) {
                              setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');
                              return;
                            }

                            if (passwordData.newPassword !== passwordData.confirm) {
                              setPasswordError('Les nouveaux mots de passe ne correspondent pas');
                              return;
                            }

                            setPasswordLoading(true);
                            try {
                              const { createClient } = await import('@/lib/supabase/client');
                              const supabase = createClient();
                              const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });

                              if (error) {
                                setPasswordError(error.message);
                              } else {
                                setPasswordSuccess('Mot de passe modifié avec succès !');
                                setPasswordData({ current: '', newPassword: '', confirm: '' });
                                setTimeout(() => setPasswordOpen(false), 1500);
                              }
                            } catch {
                              setPasswordError('Erreur de connexion au serveur');
                            } finally {
                              setPasswordLoading(false);
                            }
                          }}
                        >
                          {passwordLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Modification...
                            </>
                          ) : (
                            'Modifier le mot de passe'
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

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
        <PaymentsTable member={member} />
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
                member.communications.map((comm: any) => (
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
