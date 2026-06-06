'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
import { Plus, Edit, Trash2, Handshake } from 'lucide-react'
import { toast } from 'sonner'

interface CommissionItem {
  id: number
  nom: string
  nomAr: string | null
  members: number
  desc: string | null
  icon: string | null
  ordre: number
}

const emptyForm = {
  nom: '',
  nomAr: '',
  members: 0,
  desc: '',
  icon: '',
  ordre: 0,
}

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<CommissionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchCommissions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/commissions')
      const data = await res.json()
      setCommissions(data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCommissions()
  }, [fetchCommissions])

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyForm, ordre: commissions.length })
    setDialogOpen(true)
  }

  function openEdit(item: CommissionItem) {
    setEditingId(item.id)
    setForm({
      nom: item.nom,
      nomAr: item.nomAr || '',
      members: item.members,
      desc: item.desc || '',
      icon: item.icon || '',
      ordre: item.ordre,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.nom) {
      toast.error('Le nom est requis')
      return
    }
    setSaving(true)
    try {
      const body = {
        nom: form.nom,
        nomAr: form.nomAr || null,
        members: form.members,
        desc: form.desc || null,
        icon: form.icon || null,
        ordre: form.ordre,
      }

      if (editingId) {
        const res = await fetch(`/api/admin/commissions/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('Commission mise à jour')
      } else {
        const res = await fetch('/api/admin/commissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
        toast.success('Commission créée')
      }

      setDialogOpen(false)
      fetchCommissions()
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
      const res = await fetch(`/api/admin/commissions/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Commission supprimée')
      setDeleteId(null)
      fetchCommissions()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lips-green-dark">Gestion des Commissions</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Commissions et comités de la LIPS
          </p>
        </div>
        <Button onClick={openCreate} className="bg-lips-green hover:bg-lips-green-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une commission
        </Button>
      </div>

      {/* Commissions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Nom (Arabe)</TableHead>
                  <TableHead>Membres</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icône</TableHead>
                  <TableHead>Ordre</TableHead>
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
                ) : commissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center">
                        <Handshake className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        Aucune commission
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  commissions.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium">{item.nom}</TableCell>
                      <TableCell className="text-muted-foreground font-arabic" dir="rtl">
                        {item.nomAr || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.members} membre(s)
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {item.desc || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.icon || '—'}
                      </TableCell>
                      <TableCell className="text-sm">{item.ordre}</TableCell>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier la commission' : 'Nouvelle commission'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Modifiez les informations de la commission' : 'Créez une nouvelle commission'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Nom de la commission"
                />
              </div>
              <div className="space-y-2">
                <Label>Nom (Arabe)</Label>
                <Input
                  value={form.nomAr}
                  onChange={(e) => setForm({ ...form, nomAr: e.target.value })}
                  dir="rtl"
                  className="font-arabic"
                  placeholder="اسم اللجنة"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre de membres</Label>
                <Input
                  type="number"
                  value={form.members}
                  onChange={(e) => setForm({ ...form, members: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Icône (Lucide)</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="Shield, BookOpen..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Description de la commission..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Ordre</Label>
              <Input
                type="number"
                value={form.ordre}
                onChange={(e) => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })}
              />
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
              Êtes-vous sûr de vouloir supprimer cette commission ? Cette action est irréversible.
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
