'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface GalerieItem {
  id: number
  titre: string
  titreAr: string | null
  lieu: string | null
  date: string | null
  count: number
  gradient: string | null
  imageUrl: string | null
  published: boolean
  createdAt: string
}

const emptyForm = {
  titre: '',
  titreAr: '',
  lieu: '',
  date: '',
  count: 0,
  gradient: 'from-lips-green-dark to-lips-green',
  imageUrl: '',
  published: true,
}

export default function GaleriePage() {
  const [items, setItems] = useState<GalerieItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/galerie')
      const data = await res.json()
      setItems(data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setDialogOpen(true)
  }

  function openEdit(item: GalerieItem) {
    setEditingId(item.id)
    setForm({
      titre: item.titre,
      titreAr: item.titreAr || '',
      lieu: item.lieu || '',
      date: item.date || '',
      count: item.count,
      gradient: item.gradient || 'from-lips-green-dark to-lips-green',
      imageUrl: item.imageUrl || '',
      published: item.published,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.titre) {
      toast.error('Le titre est requis')
      return
    }
    setSaving(true)
    try {
      const body = { ...form }

      if (editingId) {
        const res = await fetch(`/api/galerie/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('Album mis à jour')
      } else {
        const res = await fetch('/api/galerie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('Album créé')
      }

      setDialogOpen(false)
      fetchItems()
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
      const res = await fetch(`/api/galerie/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Album supprimé')
      setDeleteId(null)
      fetchItems()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Erreur lors du téléchargement');
      }
      const data = await res.json();
      if (data.url) {
        setForm(prev => ({ ...prev, imageUrl: data.url }))
        toast.success('Image téléchargée avec succès')
      } else {
        throw new Error()
      }
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement de l\'image')
    } finally {
      setUploading(false)
    }
  }

  async function togglePublish(item: GalerieItem) {
    try {
      const res = await fetch(`/api/galerie/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      })
      if (!res.ok) throw new Error()
      toast.success(item.published ? 'Album masqué' : 'Album visible')
      fetchItems()
    } catch {
      toast.error('Erreur lors du changement de statut')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Galerie</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les albums de la page Nos Moments Institutionnels
          </p>
        </div>
        <Button onClick={openCreate} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un album
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Lieu & Date</TableHead>
                  <TableHead className="text-center">Photos</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        Aucun album
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <p className="font-medium">{item.titre}</p>
                        {item.titreAr && <p className="text-xs text-muted-foreground font-arabic">{item.titreAr}</p>}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{item.lieu}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{item.count}</Badge>
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
                            onClick={() => togglePublish(item)}
                            title={item.published ? 'Masquer' : 'Publier'}
                          >
                            {item.published ? (
                              <Eye className="h-4 w-4 text-lips-green" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier l\'album' : 'Nouvel album'}</DialogTitle>
            <DialogDescription>
              Informations sur l'album photo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre (Français) *</Label>
              <Input
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Titre (Arabe)</Label>
              <Input
                className="text-right font-arabic"
                dir="rtl"
                value={form.titreAr}
                onChange={(e) => setForm({ ...form, titreAr: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lieu</Label>
                <Input
                  value={form.lieu}
                  onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                  placeholder="Ex: Dakar"
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="Ex: Mars 2025"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre de photos</Label>
                <Input
                  type="number"
                  value={form.count}
                  onChange={(e) => setForm({ ...form, count: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) => setForm({ ...form, published: v })}
                />
                <Label>Publié</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image de Couverture</Label>
              {form.imageUrl ? (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border group bg-muted">
                  <img src={form.imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                    >
                      Supprimer l'image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/30 transition-colors relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-55" />
                    <span className="text-sm font-semibold">
                      {uploading ? 'Téléchargement...' : 'Sélectionner une photo'}
                    </span>
                    <span className="text-xs">PNG, JPG ou WEBP</span>
                  </div>
                </div>
              )}
              {form.imageUrl && (
                <div className="space-y-1">
                  <Label className="text-xs">URL de l'image</Label>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="text-xs font-mono h-8"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Dégradé (Alternative si pas d'image)</Label>
              <Input
                value={form.gradient}
                onChange={(e) => setForm({ ...form, gradient: e.target.value })}
                placeholder="from-lips-green to-lips-emerald"
              />
              <p className="text-xs text-muted-foreground">Ex: from-lips-green-dark to-lips-green</p>
            </div>
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

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet album ? Cette action est irréversible.
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
