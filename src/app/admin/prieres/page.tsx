'use client'

import { useEffect, useState, useCallback } from 'react'
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
  Clock,
  Moon,
  Sun,
  Sunset,
  Save,
  Loader2,
  RefreshCw,
  MoonStar,
  MapPin,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

interface PrayerConfig {
  [key: string]: string
}

const PRAYER_FIELDS = [
  { key: 'prayer_fajr', label: 'Fajr (Sobh)', icon: Moon, color: 'text-indigo-500' },
  { key: 'prayer_dhuhr', label: 'Dhuhr (Tisbar)', icon: Sun, color: 'text-yellow-500' },
  { key: 'prayer_asr', label: 'Asr (Takussan)', icon: Sun, color: 'text-amber-600' },
  { key: 'prayer_maghrib', label: 'Maghrib (Timis)', icon: Sunset, color: 'text-red-500' },
  { key: 'prayer_isha', label: 'Isha (Gueye)', icon: Moon, color: 'text-blue-500' },
]

const HIJRI_MONTHS = [
  { num: 1,  fr: 'Muharram', ar: 'محرم' },
  { num: 2,  fr: 'Safar', ar: 'صفر' },
  { num: 3,  fr: "Rabi\u02BF al-Awwal", ar: 'ربيع الأول' },
  { num: 4,  fr: "Rabi\u02BF al-Thani", ar: 'ربيع الثاني' },
  { num: 5,  fr: 'Jumada al-Ula', ar: 'جمادى الأولى' },
  { num: 6,  fr: 'Jumada al-Thania', ar: 'جمادى الآخرة' },
  { num: 7,  fr: 'Rajab', ar: 'رجب' },
  { num: 8,  fr: "Sha\u02BFban", ar: 'شعبان' },
  { num: 9,  fr: 'Ramadan', ar: 'رمضان' },
  { num: 10, fr: 'Shawwal', ar: 'شوال' },
  { num: 11, fr: "Dhu al-Qi\u02BFdah", ar: 'ذو القعدة' },
  { num: 12, fr: 'Dhu al-Hijjah', ar: 'ذو الحجة' },
]

const REGIONS = [
  { key: 'dakar', label: 'Dakar' },
  { key: 'saint_louis', label: 'Saint-Louis' },
  { key: 'thiès', label: 'Thiès' },
  { key: 'louga', label: 'Louga' },
  { key: 'kaolack', label: 'Kaolack' },
  { key: 'diourbel', label: 'Diourbel' },
  { key: 'tambacounda', label: 'Tambacounda' },
  { key: 'ziguinchor', label: 'Ziguinchor' },
  { key: 'kolda', label: 'Kolda' },
  { key: 'matam', label: 'Matam' },
  { key: 'kédougou', label: 'Kédougou' },
  { key: 'sédhiou', label: 'Sédhiou' },
  { key: 'fatick', label: 'Fatick' },
  { key: 'kaffrine', label: 'Kaffrine' },
]

export default function PrieresPage() {
  const [config, setConfig] = useState<PrayerConfig>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [apiPreview, setApiPreview] = useState<any>(null)

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/prieres')
      const data = await res.json()
      setConfig(data.data || {})
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch API preview to show what Aladhan returns
  const fetchApiPreview = useCallback(async () => {
    try {
      const region = config.prayer_region || 'dakar'
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${REGIONS.find(r => r.key === region)?.label || 'Dakar'}&country=Senegal&method=3`)
      const data = await res.json()
      if (data.code === 200) {
        setApiPreview(data.data)
      }
    } catch {
      setApiPreview(null)
    }
  }, [config.prayer_region])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  useEffect(() => {
    if (config.prayer_mode === 'auto') {
      fetchApiPreview()
    }
  }, [config.prayer_mode, fetchApiPreview])

  function updateConfig(key: string, value: string) {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  // When Hijri month changes, auto-fill month names
  function handleHijriMonthChange(monthNum: string) {
    const m = HIJRI_MONTHS.find(hm => hm.num === parseInt(monthNum))
    setConfig(prev => ({
      ...prev,
      hijri_month: monthNum,
      hijri_month_name_fr: m?.fr || '',
      hijri_month_name_ar: m?.ar || '',
    }))
  }

  // Fill all prayer times from API preview
  function fillFromApi() {
    if (!apiPreview?.timings) return
    const t = apiPreview.timings
    setConfig(prev => ({
      ...prev,
      prayer_fajr: t.Fajr?.substring(0, 5) || prev.prayer_fajr,
      prayer_dhuhr: t.Dhuhr?.substring(0, 5) || prev.prayer_dhuhr,
      prayer_asr: t.Asr?.substring(0, 5) || prev.prayer_asr,
      prayer_maghrib: t.Maghrib?.substring(0, 5) || prev.prayer_maghrib,
      prayer_isha: t.Isha?.substring(0, 5) || prev.prayer_isha,
    }))
    toast.success('Horaires API Aladhan chargés — modifiez-les si besoin puis enregistrez')
  }

  // Fill Hijri from API preview
  function fillHijriFromApi() {
    if (!apiPreview?.date?.hijri) return
    const h = apiPreview.date.hijri
    setConfig(prev => ({
      ...prev,
      hijri_day: h.day,
      hijri_month: h.month.number.toString(),
      hijri_year: h.year,
      hijri_month_name_fr: h.month.en,
      hijri_month_name_ar: h.month.ar,
    }))
    toast.success('Date Hijri API chargée — modifiez si besoin puis enregistrez')
  }

  async function saveConfig() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/prieres', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: config }),
      })

      if (!res.ok) throw new Error()
      toast.success('Configuration des prières enregistrée avec succès')
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Horaires de Prière</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-40 bg-muted rounded" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Clock className="h-6 w-6 text-lips-gold" />
            Horaires de Prière
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configurez les horaires affichés dans la barre de prière sur le site public
          </p>
        </div>
        <Button
          onClick={saveConfig}
          disabled={saving}
          className="bg-lips-green hover:bg-lips-green-dark text-white gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer tout
        </Button>
      </div>

      {/* ═══ MODE: Horaires de prière ═══ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-lips-green/10">
                <Clock className="h-5 w-5 text-lips-green" />
              </div>
              <div>
                <CardTitle className="text-lg">Horaires de Prière</CardTitle>
                <CardDescription>Choisissez le mode et les horaires des 5 prières</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${config.prayer_mode === 'auto' ? 'text-lips-green' : 'text-lips-gold'}`}>
                {config.prayer_mode === 'auto' ? 'Automatique (API)' : 'Manuel'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateConfig('prayer_mode', config.prayer_mode === 'auto' ? 'manual' : 'auto')}
                className="gap-2"
              >
                {config.prayer_mode === 'auto' ? (
                  <><ToggleRight className="h-5 w-5 text-lips-green" /> Auto</>
                ) : (
                  <><ToggleLeft className="h-5 w-5 text-lips-gold" /> Manuel</>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode explanation */}
          {config.prayer_mode === 'auto' ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-lips-green/5 border border-lips-green/20">
              <AlertCircle className="h-5 w-5 text-lips-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Mode Automatique</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Les horaires sont récupérés automatiquement depuis l&apos;API Aladhan chaque jour. Ils changent selon la région sélectionnée par l&apos;utilisateur. Vous n&apos;avez rien à faire.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-lips-gold/5 border border-lips-gold/20">
              <AlertCircle className="h-5 w-5 text-lips-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-lips-gold">Mode Manuel</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Vous contrôlez les horaires affichés. Les heures saisies ci-dessous seront utilisées pour toutes les régions (remplace l&apos;API). Vous pouvez pré-remplir depuis l&apos;API puis ajuster.
                </p>
              </div>
            </div>
          )}

          {/* Default region */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-lips-gold" />
              Région par défaut (affichée aux nouveaux visiteurs)
            </Label>
            <Select value={config.prayer_region || 'dakar'} onValueChange={v => updateConfig('prayer_region', v)}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Choisir une région" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map(r => (
                  <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Prayer times grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Horaires des prières</Label>
              {config.prayer_mode === 'manual' && (
                <Button variant="outline" size="sm" onClick={fillFromApi} className="gap-2 text-xs">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Pré-remplir depuis API Aladhan
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRAYER_FIELDS.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                  <div className={`p-2 rounded-lg bg-muted ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={key} className="text-xs font-medium">{label}</Label>
                    <Input
                      id={key}
                      type="time"
                      value={config[key] || ''}
                      onChange={e => updateConfig(key, e.target.value)}
                      disabled={config.prayer_mode === 'auto'}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* API preview when auto */}
            {config.prayer_mode === 'auto' && apiPreview?.timings && (
              <div className="mt-4 p-4 rounded-lg bg-muted border border-border/50">
                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Aperçu API Aladhan pour {REGIONS.find(r => r.key === (config.prayer_region || 'dakar'))?.label || 'Dakar'}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                  {PRAYER_FIELDS.map(({ key, label, icon: Icon, color }) => {
                    const apiKey = key.replace('prayer_', '')
                    const apiTime = apiPreview.timings[apiKey.charAt(0).toUpperCase() + apiKey.slice(1)]
                    return (
                      <div key={key} className="p-2 rounded bg-card border text-xs">
                        <Icon className={`h-3.5 w-3.5 mx-auto mb-1 ${color}`} />
                        <div className="font-medium">{label.split(' ')[0]}</div>
                        <div className="font-mono font-bold text-foreground">{apiTime?.substring(0, 5) || '—'}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ═══ MODE: Date Hijri ═══ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-lips-gold/10">
                <MoonStar className="h-5 w-5 text-lips-gold" />
              </div>
              <div>
                <CardTitle className="text-lg">Date Hijri (Hégire)</CardTitle>
                <CardDescription>La date hégirienne affichée dans la barre de prière</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${config.hijri_mode === 'auto' ? 'text-lips-green' : 'text-lips-gold'}`}>
                {config.hijri_mode === 'auto' ? 'Automatique' : 'Manuel'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateConfig('hijri_mode', config.hijri_mode === 'auto' ? 'manual' : 'auto')}
                className="gap-2"
              >
                {config.hijri_mode === 'auto' ? (
                  <><ToggleRight className="h-5 w-5 text-lips-green" /> Auto</>
                ) : (
                  <><ToggleLeft className="h-5 w-5 text-lips-gold" /> Manuel</>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {config.hijri_mode === 'auto' ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-lips-green/5 border border-lips-green/20">
              <AlertCircle className="h-5 w-5 text-lips-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Mode Automatique</p>
                <p className="text-xs text-muted-foreground mt-1">
                  La date Hijri est calculée automatiquement par l&apos;API Aladhan. Elle peut différer de ±1 jour par rapport à l&apos;observation locale au Sénégal.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-lips-gold/5 border border-lips-gold/20">
              <AlertCircle className="h-5 w-5 text-lips-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-lips-gold">Mode Manuel</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Vous saisissez la date Hijri vous-même. C&apos;est utile quand la date observée localement diffère du calcul astronomique (ex: début du Ramadan, jour de l&apos;Aïd).
                </p>
              </div>
            </div>
          )}

          {config.hijri_mode === 'manual' && (
            <div className="flex items-center gap-2 mb-2">
              <Button variant="outline" size="sm" onClick={fillHijriFromApi} className="gap-2 text-xs">
                <RefreshCw className="h-3.5 w-3.5" />
                Pré-remplir depuis API Aladhan
              </Button>
              <span className="text-xs text-muted-foreground">puis ajustez si besoin</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Day */}
            <div className="space-y-2">
              <Label htmlFor="hijri_day" className="text-sm font-semibold">Jour</Label>
              <Input
                id="hijri_day"
                type="number"
                min="1"
                max="30"
                placeholder="20"
                value={config.hijri_day || ''}
                onChange={e => updateConfig('hijri_day', e.target.value)}
                disabled={config.hijri_mode === 'auto'}
                className="font-mono"
              />
            </div>

            {/* Month */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Mois</Label>
              <Select
                value={config.hijri_month || ''}
                onValueChange={handleHijriMonthChange}
                disabled={config.hijri_mode === 'auto'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un mois" />
                </SelectTrigger>
                <SelectContent>
                  {HIJRI_MONTHS.map(m => (
                    <SelectItem key={m.num} value={m.num.toString()}>
                      {m.num}. {m.fr} — {m.ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="hijri_year" className="text-sm font-semibold">Année</Label>
              <Input
                id="hijri_year"
                type="number"
                placeholder="1447"
                value={config.hijri_year || ''}
                onChange={e => updateConfig('hijri_year', e.target.value)}
                disabled={config.hijri_mode === 'auto'}
                className="font-mono"
              />
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Aperçu</Label>
              <div className="p-3 rounded-lg bg-lips-green-dark text-white text-sm">
                <div className="font-semibold">
                  {config.hijri_day || '??'} {config.hijri_month_name_fr || '??'} {config.hijri_year || '????'} H
                </div>
                <div className="font-arabic text-lips-gold text-xs mt-1" dir="rtl">
                  {config.hijri_day || '؟'} {config.hijri_month_name_ar || '؟'} {config.hijri_year || '؟؟؟؟'} هـ
                </div>
              </div>
            </div>
          </div>

          {/* Month name overrides (advanced) */}
          {config.hijri_mode === 'manual' && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Noms du mois (remplis automatiquement, modifiables)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="hijri_month_name_fr" className="text-xs">Nom français</Label>
                    <Input
                      id="hijri_month_name_fr"
                      value={config.hijri_month_name_fr || ''}
                      onChange={e => updateConfig('hijri_month_name_fr', e.target.value)}
                      placeholder="Dhul Hijjah"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="hijri_month_name_ar" className="text-xs">Nom arabe</Label>
                    <Input
                      id="hijri_month_name_ar"
                      value={config.hijri_month_name_ar || ''}
                      onChange={e => updateConfig('hijri_month_name_ar', e.target.value)}
                      placeholder="ذو الحجة"
                      className="text-sm font-arabic"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ═══ Save Button (bottom) ═══ */}
      <div className="flex justify-end">
        <Button
          onClick={saveConfig}
          disabled={saving}
          size="lg"
          className="bg-lips-green hover:bg-lips-green-dark text-white gap-2 min-w-[200px]"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer la configuration
        </Button>
      </div>
    </div>
  )
}
