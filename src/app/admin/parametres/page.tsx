'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Save, Phone, Globe, Star, BarChart3, CreditCard, Heart,
  Loader2, UserPlus, Eye, EyeOff, Shield, CheckCircle2, XCircle, KeyRound,
} from 'lucide-react'
import { toast } from 'sonner'

interface Settings {
  [key: string]: string
}

interface Region {
  id: number
  code: string
  nom: string
}

const settingsGroups = [
  {
    key: 'contact',
    title: 'Contact',
    icon: Phone,
    description: 'Informations de contact de la LIPS',
    fields: [
      { key: 'contact_phone', label: 'Téléphone', placeholder: '+221 33 800 00 00' },
      { key: 'contact_email', label: 'Email', placeholder: 'contact@lips.sn' },
      { key: 'contact_address', label: 'Adresse', placeholder: 'Dakar, Sénégal' },
    ],
  },
  {
    key: 'social',
    title: 'Réseaux Sociaux',
    icon: Globe,
    description: 'Liens vers les réseaux sociaux',
    fields: [
      { key: 'facebook_url', label: 'Facebook', placeholder: 'https://facebook.com/lips.sn' },
      { key: 'twitter_url', label: 'Twitter / X', placeholder: 'https://twitter.com/lips_sn' },
      { key: 'youtube_url', label: 'YouTube', placeholder: 'https://youtube.com/@lips' },
    ],
  },
  {
    key: 'hero',
    title: 'Section Hero',
    icon: Star,
    description: 'Contenu de la section principale du site',
    fields: [
      { key: 'hero_title', label: 'Titre', placeholder: 'Ligue des Imams et Prédicateurs du Sénégal' },
      { key: 'hero_subtitle', label: 'Sous-titre', placeholder: 'Au service de la communauté' },
      { key: 'hero_badge', label: 'Badge', placeholder: 'Institution Nationale' },
      { key: 'hero_motto_ar', label: 'Devise (Arabe)', placeholder: 'بالصبر واليقين تبلغ الإمامة في الدين' },
      { key: 'hero_motto_fr', label: 'Devise (Français)', placeholder: 'Par la patience et la certitude...' },
    ],
  },
  {
    key: 'stats',
    title: 'Statistiques',
    icon: BarChart3,
    description: 'Chiffres affichés sur le site',
    fields: [
      { key: 'stat_members', label: 'Membres', placeholder: '5000+' },
      { key: 'stat_regions', label: 'Régions', placeholder: '14' },
      { key: 'stat_mosques', label: 'Mosquées', placeholder: '2000+' },
      { key: 'stat_formations', label: 'Formations', placeholder: '500+' },
      { key: 'stat_annees', label: 'Années d\'existence', placeholder: '18+' },
      { key: 'stat_renouvellement', label: 'Renouvellement', placeholder: '95%' },
    ],
  },
  {
    key: 'cotisations',
    title: 'Cotisations',
    icon: CreditCard,
    description: 'Montants des cotisations',
    fields: [
      { key: 'cotisation_imam', label: 'Cotisation Imam (FCFA)', placeholder: '5000' },
      { key: 'cotisation_responsable', label: 'Cotisation Responsable (FCFA)', placeholder: '10000' },
    ],
  },
  {
    key: 'dons',
    title: 'Dons',
    icon: Heart,
    description: 'Paramètres des dons',
    fields: [
      { key: 'don_minimum', label: 'Don minimum (FCFA)', placeholder: '1000' },
      { key: 'don_whatsapp_number', label: 'Numéro WhatsApp (ex: +221770000000)', placeholder: '+221770000000' },
      { key: 'don_instructions', label: 'Instructions de paiement', placeholder: 'Envoyez votre don par Wave ou Orange Money, puis validez votre reçu sur WhatsApp.' },
    ],
  },
]

const roleOptions = [
  { value: 'IMAM', label: 'Imam' },
  { value: 'PREDICATEUR', label: 'Prédicateur' },
  { value: 'RESPONSABLE_REGIONAL', label: 'Responsable Régional' },
  { value: 'ADMIN', label: 'Administrateur' },
  { value: 'PRESIDENT', label: 'Président' },
  { value: 'MEMBRE_CHOURA', label: 'Membre Choura' },
]

// ─── Password Strength Calculator ─────────────────────────────
function getPasswordStrength(password: string) {
  const checks = [
    { label: '8 caractères minimum', met: password.length >= 8 },
    { label: 'Une majuscule', met: /[A-Z]/.test(password) },
    { label: 'Une minuscule', met: /[a-z]/.test(password) },
    { label: 'Un chiffre', met: /[0-9]/.test(password) },
    { label: 'Un caractère spécial', met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
  ]
  const score = checks.filter((c) => c.met).length
  let level: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak'
  if (score >= 5) level = 'very-strong'
  else if (score >= 4) level = 'strong'
  else if (score >= 3) level = 'medium'

  return { checks, score, level }
}

// ─── Main Component ───────────────────────────────────────────
export default function ParametresPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [savingGroup, setSavingGroup] = useState<string | null>(null)

  // ── Account creation state ──
  const [regions, setRegions] = useState<Region[]>([])
  const [showAccountForm, setShowAccountForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [createdMatricule, setCreatedMatricule] = useState<string | null>(null)

  const [accountForm, setAccountForm] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    role: 'IMAM',
    regionId: '',
  })

  const passwordStrength = useMemo(
    () => getPasswordStrength(accountForm.password),
    [accountForm.password]
  )

  const strengthConfig: Record<string, { color: string; width: string; label: string; badgeVariant: 'destructive' | 'secondary' | 'default' | 'outline' }> = {
    weak: { color: 'bg-red-500', width: 'w-1/4', label: 'Faible', badgeVariant: 'destructive' },
    medium: { color: 'bg-yellow-500', width: 'w-2/4', label: 'Moyen', badgeVariant: 'secondary' },
    strong: { color: 'bg-blue-500', width: 'w-3/4', label: 'Fort', badgeVariant: 'default' },
    'very-strong': { color: 'bg-green-500', width: 'w-full', label: 'Très fort', badgeVariant: 'outline' },
  }

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/parametres')
      const data = await res.json()
      setSettings(data.data || {})
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement des paramètres')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // Fetch regions for account creation
  useEffect(() => {
    fetch('/api/admin/regions')
      .then((res) => res.json())
      .then((data) => setRegions(data.data || []))
      .catch(console.error)
  }, [])

  async function saveGroup(group: typeof settingsGroups[0]) {
    setSavingGroup(group.key)
    try {
      const groupSettings: Record<string, string> = {}
      for (const field of group.fields) {
        groupSettings[field.key] = settings[field.key] || ''
      }

      const res = await fetch('/api/admin/parametres', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: groupSettings }),
      })

      if (!res.ok) throw new Error()
      toast.success(`Paramètres "${group.title}" enregistrés avec succès`)
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSavingGroup(null)
    }
  }

  function updateSetting(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function resetAccountForm() {
    setAccountForm({
      email: '',
      password: '',
      nom: '',
      prenom: '',
      telephone: '',
      role: 'IMAM',
      regionId: '',
    })
    setShowPassword(false)
    setCreatedMatricule(null)
  }

  async function handleCreateAccount() {
    // Client-side validation
    if (!accountForm.email || !accountForm.password || !accountForm.nom || !accountForm.prenom || !accountForm.telephone || !accountForm.regionId) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (passwordStrength.score < 5) {
      toast.error('Le mot de passe ne respecte pas les critères de sécurité')
      return
    }

    setCreating(true)
    setCreatedMatricule(null)
    try {
      const res = await fetch('/api/admin/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountForm),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erreur lors de la création du compte')
        return
      }

      setCreatedMatricule(data.data?.matricule || '')
      toast.success(data.message || 'Compte créé avec succès')
    } catch {
      toast.error('Erreur lors de la création du compte')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Paramètres du Site</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres du Site</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configurez les paramètres généraux du site LIPS
        </p>
      </div>

      {/* ── Account Creation Section ──────────────────────────── */}
      <Card className="border-lips-green/20 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-lips-green/10">
                <UserPlus className="h-5 w-5 text-lips-green" />
              </div>
              <div>
                <CardTitle className="text-lg">Création de Compte</CardTitle>
                <CardDescription>Créer un nouveau compte membre ou administrateur</CardDescription>
              </div>
            </div>
            <Button
              onClick={() => {
                if (showAccountForm) {
                  resetAccountForm()
                  setShowAccountForm(false)
                } else {
                  setShowAccountForm(true)
                }
              }}
              variant={showAccountForm ? 'outline' : 'default'}
              className={showAccountForm ? '' : 'bg-lips-green hover:bg-lips-green-dark text-white gap-2'}
              size="sm"
            >
              {showAccountForm ? 'Annuler' : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Nouveau Compte
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {/* Success Banner */}
        {createdMatricule && (
          <CardContent className="pt-0 pb-2">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-green-800 text-sm">Compte créé avec succès</p>
                <p className="text-green-700 text-sm mt-0.5">
                  Matricule attribué : <span className="font-mono font-bold text-lg">{createdMatricule}</span>
                </p>
                <p className="text-green-600 text-xs mt-1">
                  Transmettez ce matricule au membre pour lui permettre de se connecter.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-green-700 border-green-300 hover:bg-green-50"
                onClick={() => {
                  navigator.clipboard.writeText(createdMatricule)
                  toast.success('Matricule copié dans le presse-papier')
                }}
              >
                Copier
              </Button>
            </div>
          </CardContent>
        )}

        {showAccountForm && (
          <CardContent className="pt-0">
            <Separator className="mb-5" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* ── Row 1: Identity ───────────────────── */}
              <div className="space-y-2">
                <Label htmlFor="acc-prenom" className="text-sm font-medium">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="acc-prenom"
                  value={accountForm.prenom}
                  onChange={(e) => setAccountForm((f) => ({ ...f, prenom: e.target.value }))}
                  placeholder="Prénom du membre"
                  disabled={creating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="acc-nom" className="text-sm font-medium">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="acc-nom"
                  value={accountForm.nom}
                  onChange={(e) => setAccountForm((f) => ({ ...f, nom: e.target.value }))}
                  placeholder="Nom de famille"
                  disabled={creating}
                />
              </div>

              {/* ── Row 2: Contact ───────────────────── */}
              <div className="space-y-2">
                <Label htmlFor="acc-email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="acc-email"
                  type="email"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="prenom.nom@exemple.sn"
                  disabled={creating}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="acc-telephone" className="text-sm font-medium">
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="acc-telephone"
                  type="tel"
                  value={accountForm.telephone}
                  onChange={(e) => setAccountForm((f) => ({ ...f, telephone: e.target.value }))}
                  placeholder="+221 77 000 00 00"
                  disabled={creating}
                />
              </div>

              {/* ── Row 3: Role & Region ─────────────── */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Rôle <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={accountForm.role}
                  onValueChange={(v) => setAccountForm((f) => ({ ...f, role: v }))}
                  disabled={creating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Région <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={accountForm.regionId}
                  onValueChange={(v) => setAccountForm((f) => ({ ...f, regionId: v }))}
                  disabled={creating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r.id} value={r.id.toString()}>
                        {r.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ── Row 4: Password ──────────────────── */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="acc-password" className="text-sm font-medium">
                  Mot de passe <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="acc-password"
                    type={showPassword ? 'text' : 'password'}
                    value={accountForm.password}
                    onChange={(e) => {
                      setAccountForm((f) => ({ ...f, password: e.target.value }))
                      setCreatedMatricule(null)
                    }}
                    placeholder="Mot de passe sécurisé"
                    className="pl-10 pr-11"
                    disabled={creating}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Bar */}
                {accountForm.password && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${strengthConfig[passwordStrength.level].color} ${strengthConfig[passwordStrength.level].width}`}
                        />
                      </div>
                      <Badge variant={strengthConfig[passwordStrength.level].badgeVariant} className="text-[10px] px-2 py-0">
                        {strengthConfig[passwordStrength.level].label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1">
                      {passwordStrength.checks.map((check) => (
                        <div key={check.label} className="flex items-center gap-1.5">
                          {check.met ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                          ) : (
                            <XCircle className="h-3 w-3 text-muted-foreground shrink-0" />
                          )}
                          <span className={`text-[11px] ${check.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                            {check.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Info box ── */}
            <div className="mt-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3">
              <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Informations importantes</p>
                <ul className="text-xs text-amber-700 dark:text-amber-400 mt-1 space-y-0.5 list-disc list-inside">
                  <li>Le matricule sera généré automatiquement au format <span className="font-mono font-bold">LIPS-XXXX</span></li>
                  <li>Le compte sera créé avec le statut &quot;En attente&quot; par défaut</li>
                  <li>Le membre devra utiliser son matricule ou email pour se connecter</li>
                  <li>Transmettez le matricule et le mot de passe au membre de manière sécurisée</li>
                </ul>
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  resetAccountForm()
                  setShowAccountForm(false)
                }}
                disabled={creating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateAccount}
                disabled={creating || passwordStrength.score < 5}
                className="bg-lips-green hover:bg-lips-green-dark text-white gap-2 min-w-[160px]"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Créer le Compte
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Settings Groups */}
      <div className="space-y-4">
        {settingsGroups.map((group) => (
          <Card key={group.key}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-lips-green/10">
                    <group.icon className="h-5 w-5 text-lips-green" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{group.title}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => saveGroup(group)}
                  disabled={savingGroup === group.key}
                  className="bg-lips-green hover:bg-lips-green-dark text-white gap-2"
                  size="sm"
                >
                  {savingGroup === group.key ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Enregistrer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-sm">
                      {field.label}
                    </Label>
                    <Input
                      id={field.key}
                      value={settings[field.key] || ''}
                      onChange={(e) => updateSetting(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
