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
import { Plus, Edit, Trash2, Mic, BookOpen, Headphones, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

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

export function ResourcesTab() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [resourceForm, setResourceForm] = useState({ title: '', description: '', url: '', icon: 'BookOpen', published: false })

  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/coran/ressources')
      const data = await res.json()
      setResources(data.data || [])
    } catch {
      toast.error('Erreur lors du chargement des ressources')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  function openCreate() {
    setEditingId(null)
    setResourceForm({ title: '', description: '', url: '', icon: 'BookOpen', published: false })
    setDialogOpen(true)
  }

  function openEdit(item: any) {
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

  async function handleSave() {
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

  async function togglePublish(item: any) {
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

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/coran/ressources/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Ressource supprimée')
      setDeleteId(null)
      fetchResources()
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
              <Mic className="h-5 w-5 text-lips-emerald" />
              <h3 className="font-semibold text-foreground">Ressources Coraniques</h3>
              <Badge variant="secondary" className="text-xs">{resources.length}</Badge>
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
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier la ressource' : 'Nouvelle ressource'}</DialogTitle>
            <DialogDescription>{editingId ? 'Modifiez les informations ci-dessous' : 'Remplissez les informations ci-dessous'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input value={resourceForm.title} onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })} placeholder="Titre de la ressource" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={resourceForm.description} onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })} placeholder="Description de la ressource..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={resourceForm.url} onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })} placeholder="https://..." />
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
                <Switch checked={resourceForm.published} onCheckedChange={(v) => setResourceForm({ ...resourceForm, published: v })} />
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
            <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible.</AlertDialogDescription>
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
