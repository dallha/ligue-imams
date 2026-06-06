'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Save, Phone, Mail, MapPin, Globe, Star, BarChart3, CreditCard, Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Settings {
  [key: string]: string
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
    ],
  },
]

export default function ParametresPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [savingGroup, setSavingGroup] = useState<string | null>(null)

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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-lips-green-dark">Paramètres du Site</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-gray-100 rounded" />
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
        <h1 className="text-2xl font-bold text-lips-green-dark">Paramètres du Site</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configurez les paramètres généraux du site LIPS
        </p>
      </div>

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
