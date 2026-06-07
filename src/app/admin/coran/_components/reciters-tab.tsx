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
import { Plus, Edit, Trash2, Headphones, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function RecitersTab() {
  const [reciters, setReciters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [reciterForm, setReciterForm] = useState({ name: '', bio: '', ordre: 0, published: false })

  const fetchReciters = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/coran/reciters')
      const data = await res.json()
      setReciters(data.data || [])
    } catch {
      toast.error('Erreur lors du chargement des récitateurs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReciters()
  }, [fetchReciters])

  function openCreate() {
    setEditingId(null)
    setReciterForm({ name: '', bio: '', ordre: reciters.length, published: false })
    setDialogOpen(true)
  }

  function openEdit(item: any) {
    setEditingId(item.id)
    setReciterForm({
      name: item.name,
      bio: item.bio || '',
      ordre: item.ordre,
      published: item.published,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
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

  async function togglePublish(item: any) {
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

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/coran/reciters/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Récitateur supprimé')
      setDeleteId(null)
      fetchReciters()
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
              <Headphones className="h-5 w-5 text-lips-green" />
              <h3 className="font-semibold text-foreground">Récitateurs</h3>
              <Badge variant="secondary" className="text-xs">{reciters.length}</Badge>
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
            <DialogTitle>{editingId ? 'Modifier le récitatateur' : 'Nouveau récitatateur'}</DialogTitle>
            <DialogDescription>{editingId ? 'Modifiez les informations ci-dessous' : 'Remplissez les informations ci-dessous'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input value={reciterForm.name} onChange={(e) => setReciterForm({ ...reciterForm, name: e.target.value })} placeholder="Nom du récitatateur" />
            </div>
            <div className="space-y-2">
              <Label>Biographie</Label>
              <Textarea value={reciterForm.bio} onChange={(e) => setReciterForm({ ...reciterForm, bio: e.target.value })} placeholder="Biographie du récitatateur..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordre</Label>
                <Input type="number" value={reciterForm.ordre} onChange={(e) => setReciterForm({ ...reciterForm, ordre: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <Switch checked={reciterForm.published} onCheckedChange={(v) => setReciterForm({ ...reciterForm, published: v })} />
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
            <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer ce récitatateur ? Cette action est irréversible.</AlertDialogDescription>
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
