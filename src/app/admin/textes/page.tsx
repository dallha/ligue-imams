'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface UIText {
  id: number
  key: string
  value: string
  valueAr: string | null
  description: string | null
}

const emptyForm = {
  key: '',
  value: '',
  valueAr: '',
  description: '',
}

export default function TextesAdminPage() {
  const [textes, setTextes] = useState<UIText[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTextes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/textes?search=${encodeURIComponent(search)}`)
      const data = await res.json()
      setTextes(data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement des textes')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchTextes()
  }, [fetchTextes])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(item: UIText) {
    setEditingId(item.id)
    setForm({
      key: item.key,
      value: item.value,
      valueAr: item.valueAr || '',
      description: item.description || '',
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.key || !form.value) {
      toast.error('Clé et valeur sont requises')
      return
    }
    setSaving(true)
    try {
      const body = {
        ...form,
        valueAr: form.valueAr || null,
        description: form.description || null,
      }

      if (editingId) {
        const res = await fetch(`/api/admin/textes/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const e = await res.json()
          throw new Error(e.error || 'Erreur')
        }
        toast.success('Texte mis à jour avec succès')
      } else {
        const res = await fetch('/api/admin/textes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const e = await res.json()
          throw new Error(e.error || 'Erreur')
        }
        toast.success('Texte créé avec succès')
      }

      setDialogOpen(false)
      fetchTextes()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/textes/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Texte supprimé avec succès')
      setDeleteId(null)
      fetchTextes()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Textes de l'Interface</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Modifiez les petits textes du site (boutons, slogans, labels)
          </p>
        </div>
        <Button onClick={openCreate} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          Nouveau texte
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par clé ou texte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clé (Key)</TableHead>
                  <TableHead>Valeur (FR)</TableHead>
                  <TableHead>Valeur (AR)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : textes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Aucun texte trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  textes.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs font-semibold text-lips-green">
                        {item.key}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">
                        {item.value}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm font-arabic" dir="rtl">
                        {item.valueAr || '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier le texte' : 'Nouveau texte'}</DialogTitle>
            <DialogDescription>
              La clé identifie où ce texte s'affiche (ex: home.hero.button).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key">Clé *</Label>
              <Input
                id="key"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                placeholder="ex: btn.adherer"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valeur en Français *</Label>
              <Textarea
                id="value"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="Texte affiché sur le site"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valueAr">Valeur en Arabe</Label>
              <Textarea
                id="valueAr"
                value={form.valueAr}
                onChange={(e) => setForm({ ...form, valueAr: e.target.value })}
                placeholder="النص بالعربية"
                dir="rtl"
                className="font-arabic"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description / Indication (Optionnel)</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="À quoi sert ce texte ?"
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-lips-green text-white">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce texte ? Il pourrait manquer sur le site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600">
              {deleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
