'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Filter } from 'lucide-react'
import { toast } from 'sonner'

interface ContentItem {
  id: number
  titre: string
  titreAr: string | null
  contenu: string
  contenuAr: string | null
  type: string
  categorie: string | null
  imageUrl: string | null
  published: boolean
  dateEvenement: string | null
  lieu: string | null
  createdAt: string
  updatedAt: string
}

const typeOptions = [
  { value: 'COMMUNIQUE', label: 'Communiqué' },
  { value: 'ARTICLE', label: 'Article' },
  { value: 'FATWA', label: 'Fatwa' },
  { value: 'EVENEMENT', label: 'Événement' },
  { value: 'SEMINAIRE', label: 'Séminaire' },
  { value: 'COURS', label: 'Cours' },
]

const categorieOptions = [
  { value: 'fiqh', label: 'Fiqh' },
  { value: 'aqida', label: 'Aqida' },
  { value: 'daawa', label: 'Daawa' },
  { value: 'societe', label: 'Société' },
]

const typeLabels: Record<string, string> = Object.fromEntries(
  typeOptions.map((o) => [o.value, o.label])
)

const emptyForm = {
  titre: '',
  titreAr: '',
  contenu: '',
  contenuAr: '',
  type: 'ARTICLE',
  categorie: '',
  published: false,
  dateEvenement: '',
  lieu: '',
  imageUrl: '',
}

export default function ContenusPage() {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterPublished, setFilterPublished] = useState('all')
  const [page, setPage] = useState(1)
  const limit = 15

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchContents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (filterType !== 'all') params.set('type', filterType)
      if (filterPublished !== 'all') params.set('published', filterPublished)
      params.set('page', page.toString())
      params.set('limit', limit.toString())

      const res = await fetch(`/api/admin/contenus?${params}`)
      const data = await res.json()
      setContents(data.data || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement des contenus')
    } finally {
      setLoading(false)
    }
  }, [search, filterType, filterPublished, page])

  useEffect(() => {
    fetchContents()
  }, [fetchContents])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(item: ContentItem) {
    setEditingId(item.id)
    setForm({
      titre: item.titre,
      titreAr: item.titreAr || '',
      contenu: item.contenu,
      contenuAr: item.contenuAr || '',
      type: item.type,
      categorie: item.categorie || '',
      published: item.published,
      dateEvenement: item.dateEvenement ? new Date(item.dateEvenement).toISOString().slice(0, 16) : '',
      lieu: item.lieu || '',
      imageUrl: item.imageUrl || '',
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.titre || !form.contenu || !form.type) {
      toast.error('Titre, contenu et type sont requis')
      return
    }
    setSaving(true)
    try {
      const body = {
        ...form,
        categorie: form.categorie || null,
        titreAr: form.titreAr || null,
        contenuAr: form.contenuAr || null,
        dateEvenement: form.dateEvenement || null,
        lieu: form.lieu || null,
        imageUrl: form.imageUrl || null,
      }

      if (editingId) {
        const res = await fetch(`/api/admin/contenus/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('Contenu mis à jour avec succès')
      } else {
        const res = await fetch('/api/admin/contenus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('Contenu créé avec succès')
      }

      setDialogOpen(false)
      fetchContents()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/contenus/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Contenu supprimé avec succès')
      setDeleteId(null)
      fetchContents()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  async function togglePublish(item: ContentItem) {
    try {
      const res = await fetch(`/api/admin/contenus/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      })
      if (!res.ok) throw new Error()
      toast.success(item.published ? 'Contenu dépublié' : 'Contenu publié')
      fetchContents()
    } catch {
      toast.error('Erreur lors du changement de statut')
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Contenus</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Articles, fatwas, communiqués, événements et séminaires
          </p>
        </div>
        <Button onClick={openCreate} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          Nouveau contenu
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {typeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPublished} onValueChange={(v) => { setFilterPublished(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="true">Publié</SelectItem>
                <SelectItem value="false">Brouillon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : contents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun contenu trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  contents.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium text-sm truncate">{item.titre}</p>
                          {item.titreAr && (
                            <p className="text-xs text-muted-foreground font-arabic truncate" dir="rtl">
                              {item.titreAr}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {typeLabels[item.type] || item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.categorie || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.published ? 'default' : 'secondary'} className="text-xs">
                          {item.published ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublish(item)}
                            title={item.published ? 'Dépublier' : 'Publier'}
                          >
                            {item.published ? (
                              <Eye className="h-4 w-4 text-lips-green" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(item.id)}
                          >
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                {total} résultat(s) — Page {page}/{totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier le contenu' : 'Nouveau contenu'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Modifiez les informations du contenu' : 'Remplissez les informations pour créer un contenu'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre *</Label>
                <Input
                  id="titre"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  placeholder="Titre en français"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titreAr">Titre (Arabe)</Label>
                <Input
                  id="titreAr"
                  value={form.titreAr}
                  onChange={(e) => setForm({ ...form, titreAr: e.target.value })}
                  placeholder="العنوان"
                  dir="rtl"
                  className="font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Select value={form.categorie} onValueChange={(v) => setForm({ ...form, categorie: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {categorieOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenu">Contenu *</Label>
              <Textarea
                id="contenu"
                value={form.contenu}
                onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                placeholder="Rédigez le contenu ici..."
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenuAr">Contenu (Arabe)</Label>
              <Textarea
                id="contenuAr"
                value={form.contenuAr}
                onChange={(e) => setForm({ ...form, contenuAr: e.target.value })}
                placeholder="المحتوى بالعربية"
                rows={4}
                dir="rtl"
                className="font-arabic"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de l&apos;image</Label>
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lieu">Lieu</Label>
                <Input
                  id="lieu"
                  value={form.lieu}
                  onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                  placeholder="Lieu de l'événement"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateEvenement">Date de l&apos;événement</Label>
                <Input
                  id="dateEvenement"
                  type="datetime-local"
                  value={form.dateEvenement}
                  onChange={(e) => setForm({ ...form, dateEvenement: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(v) => setForm({ ...form, published: v })}
                />
                <Label htmlFor="published">Publié</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
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

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce contenu ? Cette action est irréversible.
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
