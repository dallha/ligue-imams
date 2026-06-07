import { useState, useCallback, useEffect } from 'react'
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
import { Plus, Edit, Trash2, BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function VersesTab() {
  const [verses, setVerses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [verseForm, setVerseForm] = useState({ arabic: '', french: '', reference: '', dateActive: '', published: false })

  const fetchVerses = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/coran/versets')
      const data = await res.json()
      setVerses(data.data || [])
    } catch {
      toast.error('Erreur lors du chargement des versets')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVerses()
  }, [fetchVerses])

  function openCreate() {
    setEditingId(null)
    setVerseForm({ arabic: '', french: '', reference: '', dateActive: '', published: false })
    setDialogOpen(true)
  }

  function openEdit(item: any) {
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

  async function handleSave() {
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

  async function togglePublish(item: any) {
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

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/coran/versets/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Verset supprimé')
      setDeleteId(null)
      fetchVerses()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-lips-gold" />
              <h3 className="font-semibold text-foreground">Versets du Jour</h3>
              <Badge variant="secondary" className="text-xs">{verses.length}</Badge>
            </div>
            <Button onClick={openCreate} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
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
                          <Button variant="ghost" size="icon" onClick={() => togglePublish(item)} title={item.published ? 'Dépublier' : 'Publier'}>
                            {item.published ? <Eye className="h-4 w-4 text-lips-green" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier le verset' : 'Nouveau verset'}</DialogTitle>
            <DialogDescription>{editingId ? 'Modifiez les informations ci-dessous' : 'Remplissez les informations ci-dessous'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Texte Arabe *</Label>
              <Textarea value={verseForm.arabic} onChange={(e) => setVerseForm({ ...verseForm, arabic: e.target.value })} placeholder="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" rows={2} dir="rtl" className="font-arabic text-right" />
            </div>
            <div className="space-y-2">
              <Label>Traduction Française *</Label>
              <Textarea value={verseForm.french} onChange={(e) => setVerseForm({ ...verseForm, french: e.target.value })} placeholder="Traduction en français..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Référence *</Label>
              <Input value={verseForm.reference} onChange={(e) => setVerseForm({ ...verseForm, reference: e.target.value })} placeholder="Coran 1:1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date d'activation</Label>
                <Input type="date" value={verseForm.dateActive} onChange={(e) => setVerseForm({ ...verseForm, dateActive: e.target.value })} />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <Switch checked={verseForm.published} onCheckedChange={(v) => setVerseForm({ ...verseForm, published: v })} />
                <Label>Publié</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-lips-green hover:bg-lips-green-dark text-white">
              {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer ce verset ? Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
