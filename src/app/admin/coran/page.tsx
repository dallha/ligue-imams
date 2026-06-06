'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Headphones,
  Mic,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────

interface ReciterItem {
  id: number
  name: string
  bio: string | null
  published: boolean
  ordre: number
}

interface VerseItem {
  id: number
  arabic: string
  french: string
  reference: string
  published: boolean
  dateActive: string | null
}

interface ResourceItem {
  id: number
  title: string
  description: string | null
  url: string | null
  icon: string
  published: boolean
}

type TabKey = 'recitateurs' | 'versets' | 'ressources'

// ─── Component ────────────────────────────────────────────────

export default function AdminCoranPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('recitateurs')
  const [mounted, setMounted] = useState(false)

  // Data
  const [reciters, setReciters] = useState<ReciterItem[]>([])
  const [verses, setVerses] = useState<VerseItem[]>([])
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  // Delete state
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Form state
  const [reciterForm, setReciterForm] = useState({ name: '', bio: '', ordre: 0, published: false })
  const [verseForm, setVerseForm] = useState({ arabic: '', french: '', reference: '', dateActive: '', published: false })
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', url: '', icon: 'BookOpen', published: false })

  useEffect(() => {
    setMounted(true)
  }, [])

  // ─── Fetch ────────────────────────────────────────────────────

  const fetchReciters = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/coran/reciters')
      const data = await res.json()
      setReciters(data.data || [])
    } catch {
      toast.error('Erreur lors du chargement des récitateurs')
    }
  }, [])

  const fetchVerses = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/coran/versets')
      const data = await res.json()
      setVerses(data.data || [])
    } catch {
      toast.error('Erreur lors du chargement des versets')
    }
  }, [])

  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/coran/ressources')
      const data = await res.json()
      setResources(data.data || [])
    } catch {
      toast.error('Erreur lors du chargement des ressources')
    }
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchReciters(), fetchVerses(), fetchResources()])
    setLoading(false)
  }, [fetchReciters, fetchVerses, fetchResources])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // ─── Tab helpers ──────────────────────────────────────────────

  const tabConfig = [
    { key: 'recitateurs' as TabKey, label: 'Récitateurs', icon: Headphones, count: reciters.length },
    { key: 'versets' as TabKey, label: 'Versets du Jour', icon: BookOpen, count: verses.length },
    { key: 'ressources' as TabKey, label: 'Ressources', icon: Mic, count: resources.length },
  ]

  // ─── CRUD: Reciters ───────────────────────────────────────────

  function openCreateReciter() {
    setEditingId(null)
    setReciterForm({ name: '', bio: '', ordre: reciters.length, published: false })
    setDialogOpen(true)
  }

  function openEditReciter(item: ReciterItem) {
    setEditingId(item.id)
    setReciterForm({
      name: item.name,
      bio: item.bio || '',
      ordre: item.ordre,
      published: item.published,
    })
    setDialogOpen(true)
  }

  async function saveReciter() {
    if (!reciterForm.name) {
      toast.error('Le nom est requis')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/coran/reciters/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reciterForm),
        })
        if (!res.ok) throw new Error()
        toast.success('Récitateur mis à jour')
      } else {
        const res = await fetch('/api/admin/coran/reciters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reciterForm),
        })
        if (!res.ok) throw new Error()
        toast.success('Récitateur ajouté')
      }
      setDialogOpen(false)
      fetchReciters()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  async function toggleReciterPublish(item: ReciterItem) {
    try {
      const res = await fetch(`/api/admin/coran/reciters/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      })
      if (!res.ok) throw new Error()
      toast.success(item.published ? 'Récitateur dépublié' : 'Récitateur publié')
      fetchReciters()
    } catch {
      toast.error('Erreur lors du changement de statut')
    }
  }

  // ─── CRUD: Verses ─────────────────────────────────────────────

  function openCreateVerse() {
    setEditingId(null)
    setVerseForm({ arabic: '', french: '', reference: '', dateActive: '', published: false })
    setDialogOpen(true)
  }

  function openEditVerse(item: VerseItem) {
    setEditingId(item.id)
    setVerseForm({
      arabic: item.arabic,
      french: item.french,
      reference: item.reference,
      dateActive: item.dateActive ? item.dateActive.slice(0, 10) : '',
      published: item.published,
    })
    setDialogOpen(true)
  }

  async function saveVerse() {
    if (!verseForm.arabic || !verseForm.french || !verseForm.reference) {
      toast.error('Texte arabe, traduction et référence sont requis')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/coran/versets/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(verseForm),
        })
        if (!res.ok) throw new Error()
        toast.success('Verset mis à jour')
      } else {
        const res = await fetch('/api/admin/coran/versets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(verseForm),
        })
        if (!res.ok) throw new Error()
        toast.success('Verset ajouté')
      }
      setDialogOpen(false)
      fetchVerses()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  async function toggleVersePublish(item: VerseItem) {
    try {
      const res = await fetch(`/api/admin/coran/versets/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      })
      if (!res.ok) throw new Error()
      toast.success(item.published ? 'Verset dépublié' : 'Verset publié')
      fetchVerses()
    } catch {
      toast.error('Erreur lors du changement de statut')
    }
  }

  // ─── CRUD: Resources ──────────────────────────────────────────

  function openCreateResource() {
    setEditingId(null)
    setResourceForm({ title: '', description: '', url: '', icon: 'BookOpen', published: false })
    setDialogOpen(true)
  }

  function openEditResource(item: ResourceItem) {
    setEditingId(item.id)
    setResourceForm({
      title: item.title,
      description: item.description || '',
      url: item.url || '',
      icon: item.icon || 'BookOpen',
      published: item.published,
    })
    setDialogOpen(true)
  }

  async function saveResource() {
    if (!resourceForm.title) {
      toast.error('Le titre est requis')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/coran/ressources/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resourceForm),
        })
        if (!res.ok) throw new Error()
        toast.success('Ressource mise à jour')
      } else {
        const res = await fetch('/api/admin/coran/ressources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resourceForm),
        })
        if (!res.ok) throw new Error()
        toast.success('Ressource ajoutée')
      }
      setDialogOpen(false)
      fetchResources()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  async function toggleResourcePublish(item: ResourceItem) {
    try {
      const res = await fetch(`/api/admin/coran/ressources/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      })
      if (!res.ok) throw new Error()
      toast.success(item.published ? 'Ressource dépubliée' : 'Ressource publiée')
      fetchResources()
    } catch {
      toast.error('Erreur lors du changement de statut')
    }
  }

  // ─── Delete ────────────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      let endpoint = ''
      if (activeTab === 'recitateurs') endpoint = `/api/admin/coran/reciters/${deleteId}`
      else if (activeTab === 'versets') endpoint = `/api/admin/coran/versets/${deleteId}`
      else endpoint = `/api/admin/coran/ressources/${deleteId}`

      const res = await fetch(endpoint, { method: 'DELETE' })
      if (!res.ok) throw new Error()

      const labels = { recitateurs: 'Récitateur', versets: 'Verset', ressources: 'Ressource' }
      toast.success(`${labels[activeTab]} supprimé(e)`)
      setDeleteId(null)
      fetchAll()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  // ─── Save dispatcher ──────────────────────────────────────────

  function handleSave() {
    if (activeTab === 'recitateurs') saveReciter()
    else if (activeTab === 'versets') saveVerse()
    else saveResource()
  }

  // ─── Icon helper ──────────────────────────────────────────────

  function getIconByName(name: string) {
    switch (name) {
      case 'BookOpen': return BookOpen
      case 'Headphones': return Headphones
      case 'Mic': return Mic
      default: return BookOpen
    }
  }

  const iconOptions = [
    { value: 'BookOpen', label: 'Livre', icon: BookOpen },
    { value: 'Headphones', label: 'Audio', icon: Headphones },
    { value: 'Mic', label: 'Micro', icon: Mic },
  ]

  // ─── Render ───────────────────────────────────────────────────

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion du Coran</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les récitateurs, les versets du jour et les ressources coraniques
          </p>
        </div>
        <Card><CardContent className="p-8 text-center text-muted-foreground">Chargement...</CardContent></Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion du Coran</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les récitateurs, les versets du jour et les ressources coraniques
          </p>
        </div>
      </div>

      {/* Custom Tab Navigation */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
        {tabConfig.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'bg-lips-green text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <Badge
                variant={isActive ? 'secondary' : 'outline'}
                className={`text-[10px] px-1.5 ${isActive ? 'bg-white/20 text-white border-0' : ''}`}
              >
                {tab.count}
              </Badge>
            </button>
          )
        })}
      </div>

      {/* ─── Récitateurs Tab ─────────────────────────────────────── */}
      {activeTab === 'recitateurs' && (
        <Card>
          <CardContent className="p-0">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-lips-green" />
                <h3 className="font-semibold text-foreground">Récitateurs</h3>
                <Badge variant="secondary" className="text-xs">{reciters.length}</Badge>
              </div>
              <Button onClick={openCreateReciter} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Ordre</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead className="hidden md:table-cell">Biographie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : reciters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        <Headphones className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        Aucun récitatateur
                      </TableCell>
                    </TableRow>
                  ) : (
                    reciters.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-center">{item.ordre}</TableCell>
                        <TableCell className="font-medium text-sm">{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs hidden md:table-cell">
                          <p className="line-clamp-2">{item.bio || '—'}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.published ? 'default' : 'secondary'} className="text-xs">
                            {item.published ? 'Publié' : 'Brouillon'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleReciterPublish(item)}
                              title={item.published ? 'Dépublier' : 'Publier'}
                            >
                              {item.published ? <Eye className="h-4 w-4 text-lips-green" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditReciter(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Versets Tab ─────────────────────────────────────────── */}
      {activeTab === 'versets' && (
        <Card>
          <CardContent className="p-0">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-lips-gold" />
                <h3 className="font-semibold text-foreground">Versets du Jour</h3>
                <Badge variant="secondary" className="text-xs">{verses.length}</Badge>
              </div>
              <Button onClick={openCreateVerse} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>Texte Arabe</TableHead>
                    <TableHead className="hidden lg:table-cell">Traduction</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : verses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        Aucun verset
                      </TableCell>
                    </TableRow>
                  ) : (
                    verses.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-center">{item.id}</TableCell>
                        <TableCell>
                          <p className="font-arabic text-sm text-right leading-relaxed max-w-xs" dir="rtl">{item.arabic}</p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-sm hidden lg:table-cell">
                          <p className="line-clamp-2">{item.french}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-mono border-lips-gold/30 text-lips-gold">{item.reference}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.published ? 'default' : 'secondary'} className="text-xs">
                            {item.published ? 'Publié' : 'Brouillon'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleVersePublish(item)}
                              title={item.published ? 'Dépublier' : 'Publier'}
                            >
                              {item.published ? <Eye className="h-4 w-4 text-lips-green" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditVerse(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Ressources Tab ──────────────────────────────────────── */}
      {activeTab === 'ressources' && (
        <Card>
          <CardContent className="p-0">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-lips-emerald" />
                <h3 className="font-semibold text-foreground">Ressources Coraniques</h3>
                <Badge variant="secondary" className="text-xs">{resources.length}</Badge>
              </div>
              <Button onClick={openCreateResource} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="hidden sm:table-cell">URL</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : resources.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        Aucune ressource
                      </TableCell>
                    </TableRow>
                  ) : (
                    resources.map((item) => {
                      const IconComp = getIconByName(item.icon)
                      return (
                        <TableRow key={item.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-center">{item.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <IconComp className="h-4 w-4 text-lips-green shrink-0" />
                              <span className="font-medium text-sm">{item.title}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs hidden md:table-cell">
                            <p className="line-clamp-2">{item.description || '—'}</p>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono max-w-[120px] truncate hidden sm:table-cell">
                            {item.url || '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.published ? 'default' : 'secondary'} className="text-xs">
                              {item.published ? 'Publié' : 'Brouillon'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleResourcePublish(item)}
                                title={item.published ? 'Dépublier' : 'Publier'}
                              >
                                {item.published ? <Eye className="h-4 w-4 text-lips-green" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openEditResource(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Create/Edit Dialog ──────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? activeTab === 'recitateurs'
                  ? 'Modifier le récitatateur'
                  : activeTab === 'versets'
                  ? 'Modifier le verset'
                  : 'Modifier la ressource'
                : activeTab === 'recitateurs'
                ? 'Nouveau récitatateur'
                : activeTab === 'versets'
                ? 'Nouveau verset'
                : 'Nouvelle ressource'}
            </DialogTitle>
            <DialogDescription>
              {editingId ? 'Modifiez les informations ci-dessous' : 'Remplissez les informations ci-dessous'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Reciter form */}
            {activeTab === 'recitateurs' && (
              <>
                <div className="space-y-2">
                  <Label>Nom *</Label>
                  <Input
                    value={reciterForm.name}
                    onChange={(e) => setReciterForm({ ...reciterForm, name: e.target.value })}
                    placeholder="Nom du récitatateur"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Biographie</Label>
                  <Textarea
                    value={reciterForm.bio}
                    onChange={(e) => setReciterForm({ ...reciterForm, bio: e.target.value })}
                    placeholder="Biographie du récitatateur..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ordre</Label>
                    <Input
                      type="number"
                      value={reciterForm.ordre}
                      onChange={(e) => setReciterForm({ ...reciterForm, ordre: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <Switch
                      checked={reciterForm.published}
                      onCheckedChange={(v) => setReciterForm({ ...reciterForm, published: v })}
                    />
                    <Label>Publié</Label>
                  </div>
                </div>
              </>
            )}

            {/* Verse form */}
            {activeTab === 'versets' && (
              <>
                <div className="space-y-2">
                  <Label>Texte Arabe *</Label>
                  <Textarea
                    value={verseForm.arabic}
                    onChange={(e) => setVerseForm({ ...verseForm, arabic: e.target.value })}
                    placeholder="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                    rows={2}
                    dir="rtl"
                    className="font-arabic text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Traduction Française *</Label>
                  <Textarea
                    value={verseForm.french}
                    onChange={(e) => setVerseForm({ ...verseForm, french: e.target.value })}
                    placeholder="Traduction en français..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Référence *</Label>
                  <Input
                    value={verseForm.reference}
                    onChange={(e) => setVerseForm({ ...verseForm, reference: e.target.value })}
                    placeholder="Coran 1:1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date d'activation</Label>
                    <Input
                      type="date"
                      value={verseForm.dateActive}
                      onChange={(e) => setVerseForm({ ...verseForm, dateActive: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <Switch
                      checked={verseForm.published}
                      onCheckedChange={(v) => setVerseForm({ ...verseForm, published: v })}
                    />
                    <Label>Publié</Label>
                  </div>
                </div>
              </>
            )}

            {/* Resource form */}
            {activeTab === 'ressources' && (
              <>
                <div className="space-y-2">
                  <Label>Titre *</Label>
                  <Input
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    placeholder="Titre de la ressource"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                    placeholder="Description de la ressource..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={resourceForm.url}
                    onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Icône</Label>
                    <div className="flex gap-2">
                      {iconOptions.map((opt) => {
                        const isActive = resourceForm.icon === opt.value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setResourceForm({ ...resourceForm, icon: opt.value })}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border transition-all ${
                              isActive
                                ? 'border-lips-green bg-lips-green/10 text-lips-green'
                                : 'border-border text-muted-foreground hover:border-lips-green/30'
                            }`}
                          >
                            <opt.icon className="h-3.5 w-3.5" />
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <Switch
                      checked={resourceForm.published}
                      onCheckedChange={(v) => setResourceForm({ ...resourceForm, published: v })}
                    />
                    <Label>Publié</Label>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-lips-green hover:bg-lips-green-dark text-white"
            >
              {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ─────────────────────────────────── */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              {activeTab === 'recitateurs'
                ? 'Êtes-vous sûr de vouloir supprimer ce récitatateur ?'
                : activeTab === 'versets'
                ? 'Êtes-vous sûr de vouloir supprimer ce verset ?'
                : 'Êtes-vous sûr de vouloir supprimer cette ressource ?'}
              {' '}Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
