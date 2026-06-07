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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface StaticPage {
  id: number
  slug: string
  title: string
  titleAr: string | null
  content: string | null
  contentAr: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

const emptyForm = {
  slug: '',
  title: '',
  titleAr: '',
  content: '',
  contentAr: '',
  published: true,
}

export default function PagesAdminPage() {
  const [pages, setPages] = useState<StaticPage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/pages?search=${encodeURIComponent(search)}`)
      const data = await res.json()
      setPages(data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement des pages')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(item: StaticPage) {
    setEditingId(item.id)
    setForm({
      slug: item.slug,
      title: item.title,
      titleAr: item.titleAr || '',
      content: item.content || '',
      contentAr: item.contentAr || '',
      published: item.published,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.slug || !form.title) {
      toast.error('Slug et titre sont requis')
      return
    }
    setSaving(true)
    try {
      const body = {
        ...form,
        titleAr: form.titleAr || null,
        content: form.content || null,
        contentAr: form.contentAr || null,
      }

      if (editingId) {
        const res = await fetch(`/api/admin/pages/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const e = await res.json()
          throw new Error(e.error || 'Erreur')
        }
        toast.success('Page mise à jour avec succès')
      } else {
        const res = await fetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const e = await res.json()
          throw new Error(e.error || 'Erreur')
        }
        toast.success('Page créée avec succès')
      }

      setDialogOpen(false)
      fetchPages()
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
      const res = await fetch(`/api/admin/pages/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Page supprimée avec succès')
      setDeleteId(null)
      fetchPages()
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
          <h1 className="text-2xl font-bold text-foreground">Pages Vitrines</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez le contenu des pages statiques (Accueil, À propos, etc.)
          </p>
        </div>
        <Button onClick={openCreate} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle page
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre ou slug..."
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
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Titre</TableHead>
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
                ) : pages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Aucune page trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  pages.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{item.slug}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium text-sm truncate">{item.title}</p>
                          {item.titleAr && (
                            <p className="text-xs text-muted-foreground font-arabic truncate" dir="rtl">
                              {item.titleAr}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.published ? 'default' : 'secondary'} className="text-xs">
                          {item.published ? 'Actif' : 'Désactivé'}
                        </Badge>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier la page' : 'Nouvelle page'}</DialogTitle>
            <DialogDescription>
              Utilisez les champs ci-dessous pour structurer le contenu de la page.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Identifiant (Slug) *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="ex: accueil, a-propos"
                  className="font-mono text-xs"
                />
                <p className="text-[10px] text-muted-foreground">Sert à cibler la page dans le code.</p>
              </div>
              <div className="flex items-center gap-3 pt-8">
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(v) => setForm({ ...form, published: v })}
                />
                <Label htmlFor="published">Active</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Titre en français"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleAr">Titre (Arabe)</Label>
                <Input
                  id="titleAr"
                  value={form.titleAr}
                  onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                  placeholder="العنوان"
                  dir="rtl"
                  className="font-arabic"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu HTML/Markdown</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Structure de la page (peut être du JSON si nécessaire)"
                rows={10}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentAr">Contenu (Arabe)</Label>
              <Textarea
                id="contentAr"
                value={form.contentAr}
                onChange={(e) => setForm({ ...form, contentAr: e.target.value })}
                placeholder="المحتوى بالعربية"
                rows={6}
                dir="rtl"
                className="font-arabic"
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
              Êtes-vous sûr de vouloir supprimer cette page ?
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
