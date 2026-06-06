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
import { Plus, Edit, Trash2, HelpCircle, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface FAQItem {
  id: number
  question: string
  reponse: string
  ordre: number
  published: boolean
  createdAt: string
}

const emptyForm = {
  question: '',
  reponse: '',
  ordre: 0,
  published: true,
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchFAQs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/faq')
      const data = await res.json()
      setFaqs(data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFAQs()
  }, [fetchFAQs])

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyForm, ordre: faqs.length })
    setDialogOpen(true)
  }

  function openEdit(item: FAQItem) {
    setEditingId(item.id)
    setForm({
      question: item.question,
      reponse: item.reponse,
      ordre: item.ordre,
      published: item.published,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.question || !form.reponse) {
      toast.error('Question et réponse sont requises')
      return
    }
    setSaving(true)
    try {
      const body = { ...form }

      if (editingId) {
        const res = await fetch(`/api/admin/faq/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('FAQ mise à jour')
      } else {
        const res = await fetch('/api/admin/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('FAQ créée')
      }

      setDialogOpen(false)
      fetchFAQs()
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
      const res = await fetch(`/api/admin/faq/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('FAQ supprimée')
      setDeleteId(null)
      fetchFAQs()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  async function togglePublish(item: FAQItem) {
    try {
      const res = await fetch(`/api/admin/faq/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      })
      if (!res.ok) throw new Error()
      toast.success(item.published ? 'FAQ dépubliée' : 'FAQ publiée')
      fetchFAQs()
    } catch {
      toast.error('Erreur lors du changement de statut')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lips-green-dark">Gestion de la FAQ</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Questions fréquemment posées
          </p>
        </div>
        <Button onClick={openCreate} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une FAQ
        </Button>
      </div>

      {/* FAQ Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Ordre</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Réponse</TableHead>
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
                ) : faqs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center">
                        <HelpCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        Aucune FAQ
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  faqs.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-mono text-center">{item.ordre}</TableCell>
                      <TableCell className="font-medium text-sm max-w-xs">
                        <p className="line-clamp-2">{item.question}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-sm">
                        <p className="line-clamp-2">{item.reponse}</p>
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
                            title={item.published ? 'Dépublier' : 'Publier'}
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
            <DialogTitle>{editingId ? 'Modifier la FAQ' : 'Nouvelle FAQ'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Modifiez la question et la réponse' : 'Ajoutez une nouvelle question'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question *</Label>
              <Textarea
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="La question..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Réponse *</Label>
              <Textarea
                value={form.reponse}
                onChange={(e) => setForm({ ...form, reponse: e.target.value })}
                placeholder="La réponse..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordre</Label>
                <Input
                  type="number"
                  value={form.ordre}
                  onChange={(e) => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })}
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
              Êtes-vous sûr de vouloir supprimer cette FAQ ? Cette action est irréversible.
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
